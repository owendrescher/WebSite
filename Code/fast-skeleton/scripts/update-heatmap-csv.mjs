import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';

const PROJECT_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SHARED_ROOT = resolve(PROJECT_ROOT, '..', 'shared');
const BUCKET = process.env.SUPABASE_HEATMAP_BUCKET || 'mlb-heatmaps';
const OBJECT_PATH = process.env.SUPABASE_HEATMAP_OBJECT || 'season_data_0401-0520.csv';
const TIME_ZONE = process.env.HEATMAP_TIME_ZONE || 'America/New_York';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const MIME = 'text/csv;charset=utf-8';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the heatmap updater.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function clean(value) {
  return String(value ?? '').trim();
}

function easternDate(offsetDays = 0) {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + offsetDays);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function addDays(date, days) {
  const [year, month, day] = clean(date).split('-').map(Number);
  if (!year || !month || !day) return '';
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

function csvParse(text = '') {
  const out = [];
  let row = [];
  let field = '';
  let quoted = false;
  const source = String(text || '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      out.push(row);
      row = [];
      field = '';
      continue;
    }
    field += char;
  }
  if (field || row.length) {
    row.push(field);
    out.push(row);
  }
  return out;
}

function parseCsvRows(text = '') {
  const matrix = csvParse(text).filter((line) => line.some((value) => clean(value)));
  const headers = (matrix.shift() || []).map(clean);
  const rows = matrix.map((line) => {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = line[index] ?? '';
    });
    return row;
  });
  return { headers, rows };
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(rows, headers) {
  const head = headers.map(csvEscape).join(',');
  const body = rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')).join('\r\n');
  return body ? `${head}\r\n${body}\r\n` : `${head}\r\n`;
}

function rowDate(row) {
  return clean(row.date || row.game_date || row.snapshot_date || row.prediction_date);
}

function rowKey(row) {
  return [
    rowDate(row),
    clean(row.batter_id || row.player_id || row.mlb_id || row.batter_mlb_id || row.batter_name),
    clean(row.game_id || row.gamePk || row.game_pk || row.matchup_id),
  ].join(':');
}

function maxCsvDate(rows) {
  return rows.map(rowDate).filter(Boolean).sort().at(-1) || '';
}

function mergeRows(currentRows, generatedRows) {
  const byKey = new Map();
  for (const row of currentRows) {
    if (row.__heatmapPreview) continue;
    const key = rowKey(row);
    if (key.replace(/:/g, '')) byKey.set(key, row);
  }
  for (const row of generatedRows) {
    const key = rowKey(row);
    if (key.replace(/:/g, '')) byKey.set(key, row);
  }
  return [...byKey.values()].sort((a, b) => {
    const byDate = rowDate(a).localeCompare(rowDate(b));
    if (byDate) return byDate;
    return clean(a.batter_name || a.player_name).localeCompare(clean(b.batter_name || b.player_name));
  });
}

function unionHeaders(...headerSets) {
  const seen = new Set();
  const headers = [];
  for (const headerSet of headerSets) {
    for (const header of headerSet) {
      if (!header || seen.has(header)) continue;
      seen.add(header);
      headers.push(header);
    }
  }
  return headers;
}

async function downloadCurrentCsv() {
  const { data, error } = await supabase.storage.from(BUCKET).download(OBJECT_PATH);
  if (error) {
    try {
      const localText = await readFile(join(PROJECT_ROOT, OBJECT_PATH), 'utf8');
      console.log(`No existing Supabase CSV found at ${BUCKET}/${OBJECT_PATH}; seeding from local ${OBJECT_PATH}.`);
      return localText;
    } catch {
      console.log(`No existing Supabase CSV or local ${OBJECT_PATH} found; starting from generated rows.`);
      return '';
    }
  }
  return data.text();
}

function mimeFor(pathname) {
  return {
    '.html': 'text/html;charset=utf-8',
    '.js': 'text/javascript;charset=utf-8',
    '.css': 'text/css;charset=utf-8',
    '.csv': MIME,
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  }[extname(pathname).toLowerCase()] || 'application/octet-stream';
}

async function serveProject() {
  const server = createServer((request, response) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1');
    const pathname = url.pathname === '/' ? '/predictions.html' : decodeURIComponent(url.pathname);
    const root = pathname.startsWith('/shared/') ? SHARED_ROOT : PROJECT_ROOT;
    const relativePath = pathname.startsWith('/shared/') ? pathname.replace(/^\/shared\//, '/') : pathname;
    const target = normalize(join(root, relativePath));
    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    response.writeHead(200, { 'Content-Type': mimeFor(target), 'Cache-Control': 'no-store' });
    createReadStream(target)
      .on('error', () => {
        response.writeHead(404);
        response.end('Not found');
      })
      .pipe(response);
  });
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

async function capturePredictionAuditCsv(startDate, endDate) {
  const { server, baseUrl } = await serveProject();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ acceptDownloads: true });
  const downloads = [];
  page.on('console', (message) => {
    const text = message.text();
    if (/error|warn|range|export/i.test(text)) console.log(`[browser] ${text}`);
  });
  page.on('download', async (download) => {
    const filename = download.suggestedFilename();
    const path = await download.path();
    downloads.push({ filename, content: await readFile(path, 'utf8') });
  });
  try {
    await page.goto(`${baseUrl}/predictions.html?page=predictions&heatmapUpdate=${Date.now()}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForFunction(() => typeof window.exportPredictionAuditRangeCsv === 'function', null, { timeout: 90000 });
    await page.evaluate(([start, end]) => window.exportPredictionAuditRangeCsv(start, end), [startDate, endDate]);
    await page.waitForTimeout(3000);
  } finally {
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }
  const audit = downloads.find((file) => /^prediction_audit_batch_/i.test(file.filename))
    || downloads.find((file) => /^model_summary_by_day_/i.test(file.filename));
  if (!audit) {
    throw new Error(`Prediction export completed without a usable CSV download. Downloads: ${downloads.map((file) => file.filename).join(', ') || 'none'}`);
  }
  return audit;
}

async function main() {
  const currentText = await downloadCurrentCsv();
  const current = parseCsvRows(currentText);
  const defaultEnd = easternDate(-1);
  const startDate = process.env.HEATMAP_START_DATE || (maxCsvDate(current.rows) ? addDays(maxCsvDate(current.rows), 1) : defaultEnd);
  const endDate = process.env.HEATMAP_END_DATE || defaultEnd;

  if (!startDate || startDate > endDate) {
    console.log(`Heatmap CSV already current through ${maxCsvDate(current.rows) || 'no known date'}; target end is ${endDate}.`);
    return;
  }

  console.log(`Generating MLB heatmap rows from ${startDate} through ${endDate}.`);
  const generatedFile = await capturePredictionAuditCsv(startDate, endDate);
  const generated = parseCsvRows(generatedFile.content);
  const generatedRows = generated.rows.filter((row) => {
    const date = rowDate(row);
    return date >= startDate && date <= endDate;
  });
  if (!generatedRows.length) {
    throw new Error(`Generated ${generatedFile.filename}, but it had no rows for ${startDate} through ${endDate}.`);
  }

  const mergedRows = mergeRows(current.rows, generatedRows);
  const headers = unionHeaders(current.headers, generated.headers, Object.keys(mergedRows[0] || {}));
  const csv = rowsToCsv(mergedRows, headers);
  const { error } = await supabase.storage.from(BUCKET).upload(OBJECT_PATH, Buffer.from(csv, 'utf8'), {
    contentType: MIME,
    upsert: true,
  });
  if (error) throw error;
  console.log(`Uploaded ${mergedRows.length.toLocaleString()} rows to ${BUCKET}/${OBJECT_PATH}. Added or refreshed ${generatedRows.length.toLocaleString()} rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
