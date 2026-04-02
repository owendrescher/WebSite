const revealNodes = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.14 }
);

revealNodes.forEach((node) => observer.observe(node));

const PASSWORD = '3434';
const THEME_STORAGE_KEY = 'portfolio-theme';
const STYLE_STORAGE_KEY = 'portfolio-style';
const DEFAULT_STYLE = 'gallery';
const panel = document.getElementById('theme-panel');
const colorInputs = document.querySelectorAll('[data-theme-var]');
const presetButtons = document.querySelectorAll('[data-style-preset]');
const closeButton = document.getElementById('theme-close');
const resetButton = document.getElementById('theme-reset');

const defaultTheme = {
  '--bg': '#050505',
  '--surface': '#101010',
  '--surface-2': '#171717',
  '--text': '#f6f6f6',
  '--muted': '#b8b8b8',
  '--accent': '#ffffff',
  '--accent-2': '#d9d9d9',
  '--border': '#ffffff2e',
};

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace('#', '');
  const value = cleanHex.length === 3
    ? cleanHex.split('').map((part) => part + part).join('')
    : cleanHex.slice(0, 6);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function cssColorToHex(cssColor) {
  if (cssColor.startsWith('#')) {
    return cssColor.slice(0, 7);
  }

  const match = cssColor.match(/\d+/g);
  if (!match || match.length < 3) {
    return '#000000';
  }

  const [r, g, b] = match.map(Number);
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function updateDerivedThemeVars(theme) {
  document.documentElement.style.setProperty('--glow-1', hexToRgba(theme['--accent'], 0.24));
  document.documentElement.style.setProperty('--glow-2', hexToRgba(theme['--accent-2'], 0.12));
}

function applyTheme(theme, persist = true) {
  Object.entries(theme).forEach(([cssVar, value]) => {
    document.documentElement.style.setProperty(cssVar, value);
  });

  updateDerivedThemeVars(theme);

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }
}

function setActivePresetButton(style) {
  presetButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.stylePreset === style);
  });
}

function applyStyle(style, persist = true) {
  const chosenStyle = style || DEFAULT_STYLE;
  if (chosenStyle === DEFAULT_STYLE) {
    document.body.removeAttribute('data-style');
  } else {
    document.body.setAttribute('data-style', chosenStyle);
  }

  setActivePresetButton(chosenStyle);

  if (persist) {
    localStorage.setItem(STYLE_STORAGE_KEY, chosenStyle);
  }
}

function syncInputsToTheme() {
  colorInputs.forEach((input) => {
    const cssVar = input.dataset.themeVar;
    const currentValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    input.value = cssColorToHex(currentValue);
  });
}

function openThemePanel() {
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  syncInputsToTheme();
}

function closeThemePanel() {
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const savedStyle = localStorage.getItem(STYLE_STORAGE_KEY);
applyStyle(savedStyle || DEFAULT_STYLE, false);
if (savedTheme) {
  try {
    const parsedTheme = JSON.parse(savedTheme);
    applyTheme({ ...defaultTheme, ...parsedTheme }, false);
  } catch (error) {
    applyTheme(defaultTheme, false);
  }
}

presetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedStyle = button.dataset.stylePreset;
    applyStyle(selectedStyle);
  });
});

colorInputs.forEach((input) => {
  input.addEventListener('input', (event) => {
    const cssVar = event.target.dataset.themeVar;
    const value = event.target.value;
    const nextTheme = {
      ...defaultTheme,
      ...JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}'),
      [cssVar]: value,
    };
    applyTheme(nextTheme);
  });
});

closeButton.addEventListener('click', closeThemePanel);

resetButton.addEventListener('click', () => {
  localStorage.removeItem(THEME_STORAGE_KEY);
  localStorage.removeItem(STYLE_STORAGE_KEY);
  applyStyle(DEFAULT_STYLE, false);
  applyTheme(defaultTheme, false);
  syncInputsToTheme();
});

document.addEventListener('keydown', (event) => {
  const pressedShortcut = event.ctrlKey && (event.key === ';' || event.code === 'Semicolon');
  if (!pressedShortcut) {
    return;
  }

  event.preventDefault();

  if (panel.classList.contains('is-open')) {
    closeThemePanel();
    return;
  }

  const enteredPassword = window.prompt('Enter customization password:');
  if (enteredPassword === PASSWORD) {
    openThemePanel();
  } else if (enteredPassword !== null) {
    window.alert('Incorrect password.');
  }
});
