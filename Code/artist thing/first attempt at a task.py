

#%%%

#!/usr/bin/env python3
# daily_checklist_gui.py
# GUI daily checklist with per-day logging + categories + font slider + dark mode
# - Header font stays fixed (+1 step above baseline) regardless of slider.
# - Slider label shows current point size.
# - Dark mode + font size are persisted.

import os, json, csv, datetime as dt
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import tkinter.font as tkfont

DATA_PATH = os.path.expanduser("~/.daily_checklist.json")

###############################################################################
# Storage / Model
###############################################################################
def now_iso(): return dt.datetime.now().isoformat(timespec="seconds")
def today(): return dt.date.today()
def iso(d: dt.date) -> str: return d.isoformat()

def _default_state():
    return {
        "tasks": [],
        "logs": {},
        "prefs": {
            "font_step": 0,      # -2..+2
            "dark_mode": False,  # True/False
        }
    }

def load_state():
    if not os.path.exists(DATA_PATH):
        return _default_state()
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    # backfill missing keys
    base = _default_state()
    for k, v in base.items():
        if k not in data: data[k] = v
    for k, v in base["prefs"].items():
        if k not in data["prefs"]: data["prefs"][k] = v
    return data

def save_state(state):
    tmp = DATA_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DATA_PATH)

def next_id(tasks):
    return (max((t["id"] for t in tasks), default=0) + 1)

def categories(tasks):
    return sorted({t.get("category") or "-" for t in tasks})

def set_status(state, date_str, task_id, completed: bool):
    state.setdefault("logs", {}).setdefault(date_str, {})[str(task_id)] = {
        "completed": bool(completed),
        "ts": now_iso(),
    }

def get_status(state, date_str, task_id) -> bool:
    return bool(state.get("logs", {}).get(date_str, {}).get(str(task_id), {}).get("completed", False))

###############################################################################
# Small UI helpers
###############################################################################
class ScrollFrame(ttk.Frame):
    """A vertically scrollable frame."""
    def __init__(self, master, **kw):
        super().__init__(master, **kw)
        self.canvas = tk.Canvas(self, highlightthickness=0)
        self.vsb = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.inner = ttk.Frame(self.canvas)

        self.inner.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.create_window((0, 0), window=self.inner, anchor="nw")
        self.canvas.configure(yscrollcommand=self.vsb.set)

        self.canvas.pack(side="left", fill="both", expand=True)
        self.vsb.pack(side="right", fill="y")
        # mouse wheel
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        self.canvas.bind_all("<Button-4>", self._on_mousewheel)  # linux
        self.canvas.bind_all("<Button-5>", self._on_mousewheel)

    def _on_mousewheel(self, event):
        delta = 0
        if event.num == 4: delta = -120
        elif event.num == 5: delta = 120
        else: delta = -1 * int(event.delta)
        self.canvas.yview_scroll(int(delta/120), "units")

class TaskDialog(tk.Toplevel):
    """Add/Edit task dialog."""
    def __init__(self, master, title, existing_categories, task=None):
        super().__init__(master)
        self.title(title)
        self.resizable(False, False)
        self.grab_set()
        self.result = None

        name = task["name"] if task else ""
        cat = task.get("category") if task else ""
        mins = task.get("minutes") if task else ""
        self.name_var = tk.StringVar(value=name)
        self.cat_var = tk.StringVar(value=cat or "")
        self.min_var = tk.StringVar(value=str(mins) if mins not in (None, "") else "")

        frm = ttk.Frame(self, padding=12); frm.pack(fill="both", expand=True)
        ttk.Label(frm, text="Name").grid(row=0, column=0, sticky="w", padx=(0,8), pady=4)
        ttk.Entry(frm, textvariable=self.name_var, width=40).grid(row=0, column=1, pady=4, sticky="we")

        ttk.Label(frm, text="Category").grid(row=1, column=0, sticky="w", padx=(0,8), pady=4)
        self.cat_cb = ttk.Combobox(frm, textvariable=self.cat_var, values=[c for c in existing_categories if c != "-"], width=37)
        self.cat_cb.grid(row=1, column=1, pady=4, sticky="we")
        self.cat_cb.configure(state="normal")  # editable

        ttk.Label(frm, text="Minutes (optional)").grid(row=2, column=0, sticky="w", padx=(0,8), pady=4)
        ttk.Entry(frm, textvariable=self.min_var, width=12).grid(row=2, column=1, sticky="w", pady=4)

        btns = ttk.Frame(frm); btns.grid(row=3, column=0, columnspan=2, pady=(10,0))
        ttk.Button(btns, text="Cancel", command=self.destroy).pack(side="right", padx=6)
        ttk.Button(btns, text="Save", command=self._save).pack(side="right")

        self.bind("<Return>", lambda e: self._save())
        self.bind("<Escape>", lambda e: self.destroy())

    def _save(self):
        name = self.name_var.get().strip()
        cat = self.cat_var.get().strip() or None
        mins_raw = self.min_var.get().strip()
        if not name:
            messagebox.showerror("Missing name", "Task name cannot be empty.")
            return
        minutes = None
        if mins_raw:
            if not mins_raw.isdigit():
                messagebox.showerror("Invalid minutes", "Minutes must be an integer.")
                return
            minutes = int(mins_raw)
        self.result = {"name": name, "category": cat, "minutes": minutes}
        self.destroy()

class SelectTaskDialog(tk.Toplevel):
    """Choose a task to edit/remove."""
    def __init__(self, master, tasks, title="Select Task", category_filter=None):
        super().__init__(master)
        self.title(title)
        self.resizable(False, False)
        self.grab_set()
        self.result = None

        frm = ttk.Frame(self, padding=12); frm.pack(fill="both", expand=True)
        cats = ["All"] + sorted({t.get("category") or "-" for t in tasks})
        self.cat = tk.StringVar(value=category_filter or "All")
        ttk.Label(frm, text="Category filter").grid(row=0, column=0, sticky="w")
        ttk.Combobox(frm, values=cats, textvariable=self.cat, state="readonly", width=20)\
            .grid(row=0, column=1, sticky="w")
        self.lb = tk.Listbox(frm, width=55, height=12)
        self.lb.grid(row=1, column=0, columnspan=2, pady=8, sticky="we")
        self.lb.bind("<Double-Button-1>", lambda e: self._choose())
        btns = ttk.Frame(frm); btns.grid(row=2, column=0, columnspan=2, sticky="e")
        ttk.Button(btns, text="Cancel", command=self.destroy).pack(side="right", padx=6)
        ttk.Button(btns, text="Choose", command=self._choose).pack(side="right")

        self.tasks = tasks
        self._refresh()
        self.cat.trace_add("write", lambda *_: self._refresh())

    def _refresh(self):
        self.lb.delete(0, "end")
        cur = self.cat.get()
        for t in sorted(self.tasks, key=lambda x: ((x.get("category") or "-"), x["name"])):
            if cur != "All" and (t.get("category") or "-") != cur:
                continue
            cat = t.get("category") or "-"
            mins = f" ({t['minutes']}m)" if t.get("minutes") else ""
            self.lb.insert("end", f"[{t['id']:>3}] {t['name']}  —  {cat}{mins}")

    def _choose(self):
        idx = self.lb.curselection()
        if not idx: return
        text = self.lb.get(idx[0])
        tid = int(text.split("]")[0].strip(" ["))
        self.result = tid
        self.destroy()

###############################################################################
# Main App
###############################################################################
class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Daily Checklist")
        self.geometry("820x680")

        # Fonts (baseline and slider)
        self.base_font = tkfont.nametofont("TkDefaultFont")
        self.baseline_size = int(self.base_font.cget("size"))  # system default (slider "0")
        self.step_points = 2                                    # each step = 2pt

        # State
        self.state = load_state()
        # Apply persisted prefs
        persisted_step = int(self.state.get("prefs", {}).get("font_step", 0))
        persisted_dark = bool(self.state.get("prefs", {}).get("dark_mode", False))

        # header font: fixed = baseline + one step (independent of slider)
        self.header_font = tkfont.Font(
            family=self.base_font.cget("family"),
            size=self.baseline_size + self.step_points,
            weight="bold"
        )

        # Theme / palette
        self.style = ttk.Style()
        try: self.style.theme_use("clam")
        except Exception: pass
        self.dark_mode = tk.BooleanVar(value=persisted_dark)

        self.cur_date = today()
        self.filter_cat = tk.StringVar(value="All")
        self.check_vars = {}  # task_id -> IntVar

        # Build UI before applying font scale (so labels exist)
        self._build_ui()

        # Set slider to persisted step and apply fonts (header stays fixed)
        self.font_step_var.set(persisted_step)
        self.font_scale.set(persisted_step)
        self._apply_theme()              # palette
        self._apply_font_scale(persisted_step)  # fonts + save prefs
        self._refresh_tasks()

    # UI layout
    def _build_ui(self):
        # top bar
        top = ttk.Frame(self, padding=(10,10,10,0)); top.pack(fill="x")
        ttk.Button(top, text="◀", width=3, command=lambda: self._shift_date(-1)).pack(side="left")
        ttk.Button(top, text="Today", command=self._go_today).pack(side="left", padx=6)
        ttk.Button(top, text="▶", width=3, command=lambda: self._shift_date(1)).pack(side="left")
        self.date_label = ttk.Label(top, text="", font=self.header_font)
        self.date_label.pack(side="left", padx=(10,12))

        # category filter
        ttk.Label(top, text="Category:").pack(side="left", padx=(0,4))
        self.cat_combo = ttk.Combobox(top, values=["All"], textvariable=self.filter_cat, state="readonly", width=22)
        self.cat_combo.pack(side="left")
        self.filter_cat.trace_add("write", lambda *_: self._refresh_tasks())

        # font size slider (−2…+2), label shows actual point size
        sep = ttk.Separator(top, orient="vertical"); sep.pack(side="left", fill="y", padx=10)
        ttk.Label(top, text="Font size").pack(side="left", padx=(0,6))
        self.font_step_var = tk.IntVar(value=0)
        self.font_scale = ttk.Scale(top, from_=-2, to=2, orient="horizontal",
                                    command=self._on_font_scale, length=160)
        self.font_scale.pack(side="left")
        self.font_pts_label = ttk.Label(top, text="")
        self.font_pts_label.pack(side="left", padx=(6,0))

        # dark mode toggle
        sep2 = ttk.Separator(top, orient="vertical"); sep2.pack(side="left", fill="y", padx=10)
        ttk.Checkbutton(top, text="Dark Mode", variable=self.dark_mode, command=self._on_toggle_dark)\
            .pack(side="left")

        self.count_label = ttk.Label(top, text="")
        self.count_label.pack(side="right")

        # buttons row
        bar = ttk.Frame(self, padding=(10,8)); bar.pack(fill="x")
        ttk.Button(bar, text="Add Task", command=self._add_task).pack(side="left")
        ttk.Button(bar, text="Edit Task", command=self._edit_task).pack(side="left", padx=6)
        ttk.Button(bar, text="Remove Task", command=self._remove_task).pack(side="left")
        ttk.Button(bar, text="Reset Day", command=self._reset_day).pack(side="right")
        ttk.Button(bar, text="Export CSV", command=self._export_csv).pack(side="right", padx=6)

        # scrollable checklist area
        self.scroll = ScrollFrame(self); self.scroll.pack(fill="both", expand=True, padx=10, pady=(0,10))

        # bottom bar
        bottom = ttk.Frame(self, padding=(10,0,10,10)); bottom.pack(fill="x")
        ttk.Button(bottom, text="Import CSV", command=self._import_csv).pack(side="left")
        ttk.Button(bottom, text="Quit", command=self.destroy).pack(side="right")

        self._update_date_label()
        self._refresh_category_filter()

        # menu
        menubar = tk.Menu(self)
        file_menu = tk.Menu(menubar, tearoff=0)
        file_menu.add_command(label="Import tasks from CSV…", command=self._import_csv)
        file_menu.add_command(label="Export logs CSV…", command=self._export_csv)
        menubar.add_cascade(label="File", menu=file_menu)
        self.config(menu=menubar)

    # Theme / palette
    def _palette(self):
        if self.dark_mode.get():
            return {
                "bg": "#1e1f22",
                "surface": "#26282b",
                "text": "#e8e8e8",
                "muted": "#b0b0b0",
                "accent": "#4a90e2",
                "entry_bg": "#2d2f33",
                "entry_fg": "#e8e8e8",
                "select_bg": "#3b3f45",
                "select_fg": "#ffffff"
            }
        else:
            return {
                "bg": self.style.lookup("TFrame", "background") or "#f0f0f0",
                "surface": "#ffffff",
                "text": "#111111",
                "muted": "#555555",
                "accent": "#1a73e8",
                "entry_bg": "#ffffff",
                "entry_fg": "#111111",
                "select_bg": "#cde1ff",
                "select_fg": "#000000"
            }

    def _apply_theme(self):
        pal = self._palette()
        self.configure(bg=pal["bg"])
        try: self.scroll.canvas.configure(bg=pal["surface"])
        except Exception: pass

        s = self.style
        s.configure("TFrame", background=pal["surface"])
        s.configure("TLabelframe", background=pal["surface"])
        s.configure("TLabel", background=pal["surface"], foreground=pal["text"])
        s.configure("TButton", background=pal["surface"], foreground=pal["text"])
        s.configure("TCheckbutton", background=pal["surface"], foreground=pal["text"])
        s.configure("TScrollbar", background=pal["surface"])
        s.configure("TSeparator", background=pal["surface"])
        s.configure("TEntry", fieldbackground=pal["entry_bg"], foreground=pal["entry_fg"])
        s.map("TEntry", fieldbackground=[("!disabled", pal["entry_bg"])],
              foreground=[("!disabled", pal["entry_fg"])])
        s.configure("TCombobox", fieldbackground=pal["entry_bg"],
                    background=pal["surface"], foreground=pal["entry_fg"])
        s.map("TCombobox",
              fieldbackground=[("readonly", pal["entry_bg"])],
              foreground=[("readonly", pal["entry_fg"])],
              selectbackground=[("readonly", pal["select_bg"])],
              selectforeground=[("readonly", pal["select_fg"])])

        # refresh visuals
        self._refresh_tasks()

    def _on_toggle_dark(self):
        # apply + persist
        self._apply_theme()
        self.state["prefs"]["dark_mode"] = bool(self.dark_mode.get())
        save_state(self.state)

    # Font scaling
    def _on_font_scale(self, _val):
        try:
            step = int(round(float(_val)))
        except Exception:
            step = 0
        self._apply_font_scale(step)

    def _apply_font_scale(self, step):
        # Adjust named Tk fonts so widgets update automatically (NOT the header font)
        new_size = self.baseline_size + (step * self.step_points)
        for name in ("TkDefaultFont", "TkTextFont", "TkMenuFont", "TkTooltipFont"):
            try:
                tkfont.nametofont(name).configure(size=new_size)
            except tk.TclError:
                continue
        # header font remains steady (baseline + one step)
        self.header_font.configure(size=self.baseline_size + self.step_points)

        # update readout label to show current point size
        if hasattr(self, "font_pts_label"):
            self.font_pts_label.config(text=f"{new_size} pt")

        # persist setting
        self.font_step_var.set(step)
        self.state["prefs"]["font_step"] = int(step)
        save_state(self.state)

        # redraw
        self._update_date_label()
        self._refresh_tasks()

    # Date controls
    def _update_date_label(self):
        self.date_label.config(text=self.cur_date.strftime("%A, %Y-%m-%d"))

    def _shift_date(self, days):
        self.cur_date += dt.timedelta(days=days)
        self._update_date_label()
        self._refresh_tasks()

    def _go_today(self):
        self.cur_date = today()
        self._update_date_label()
        self._refresh_tasks()

    # Task CRUD
    def _add_task(self):
        dlg = TaskDialog(self, "Add Task", categories(self.state["tasks"]))
        self.wait_window(dlg)
        if not dlg.result: return
        t = dlg.result
        new = {"id": next_id(self.state["tasks"]), "name": t["name"], "category": t["category"] or None,
               "minutes": t["minutes"], "active": True}
        self.state["tasks"].append(new)
        save_state(self.state)
        self._refresh_category_filter()
        self._refresh_tasks()

    def _edit_task(self):
        if not self.state["tasks"]:
            messagebox.showinfo("No tasks", "You have no tasks to edit."); return
        dlg = SelectTaskDialog(self, self.state["tasks"], title="Edit Task", category_filter=self.filter_cat.get())
        self.wait_window(dlg)
        if dlg.result is None: return
        task = next(t for t in self.state["tasks"] if t["id"] == dlg.result)
        dlg2 = TaskDialog(self, "Edit Task", categories(self.state["tasks"]), task=task)
        self.wait_window(dlg2)
        if not dlg2.result: return
        upd = dlg2.result
        task.update({"name": upd["name"], "category": upd["category"] or None, "minutes": upd["minutes"]})
        save_state(self.state)
        self._refresh_category_filter()
        self._refresh_tasks()

    def _remove_task(self):
        if not self.state["tasks"]:
            messagebox.showinfo("No tasks", "You have no tasks to remove."); return
        dlg = SelectTaskDialog(self, self.state["tasks"], title="Remove Task", category_filter=self.filter_cat.get())
        self.wait_window(dlg)
        if dlg.result is None: return
        tid = dlg.result
        task = next(t for t in self.state["tasks"] if t["id"] == tid)
        if not messagebox.askyesno("Confirm", f"Delete '{task['name']}'? This keeps past checkmarks in the log."):
            return
        self.state["tasks"] = [t for t in self.state["tasks"] if t["id"] != tid]
        save_state(self.state)
        self._refresh_category_filter()
        self._refresh_tasks()

    # Day actions
    def _reset_day(self):
        d = iso(self.cur_date)
        if d in self.state.get("logs", {}):
            if messagebox.askyesno("Reset day", f"Clear all checkmarks for {d}?"):
                self.state["logs"].pop(d)
                save_state(self.state)
                self._refresh_tasks()

    # Import/Export
    def _import_csv(self):
        path = filedialog.askopenfilename(title="Import tasks CSV",
                                          filetypes=[("CSV files","*.csv"),("All files","*.*")])
        if not path: return
        added = 0
        with open(path, newline="", encoding="utf-8") as f:
            rdr = csv.reader(f)
            for row in rdr:
                if not row: continue
                if row[0].strip().startswith("#"): continue
                name = row[0].strip()
                cat = row[1].strip() if len(row) > 1 else None
                minutes = int(row[2]) if len(row) > 2 and row[2].strip().isdigit() else None
                self.state["tasks"].append({"id": next_id(self.state["tasks"]), "name": name,
                                            "category": cat or None, "minutes": minutes, "active": True})
                added += 1
        save_state(self.state)
        self._refresh_category_filter()
        self._refresh_tasks()
        messagebox.showinfo("Import", f"Imported {added} tasks.")

    def _export_csv(self):
        path = filedialog.asksaveasfilename(title="Export logs CSV", defaultextension=".csv",
                                            filetypes=[("CSV files","*.csv")])
        if not path: return
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(["date","task_id","task_name","category","completed","timestamp"])
            for date, row in sorted(self.state.get("logs", {}).items()):
                for tid_str, info in row.items():
                    t = next((t for t in self.state["tasks"] if t["id"] == int(tid_str)), None)
                    w.writerow([date, int(tid_str), (t["name"] if t else "(deleted)"),
                                (t["category"] if t and t.get("category") else "-"),
                                int(bool(info.get("completed"))), info.get("ts")])
        messagebox.showinfo("Export", f"Exported to {path}")

    # Rendering checklist
    def _refresh_category_filter(self):
        cats = ["All"] + sorted({t.get("category") or "-" for t in self.state["tasks"]})
        cur = self.filter_cat.get()
        self.cat_combo.configure(values=cats)
        if cur not in cats: self.filter_cat.set("All")

    def _refresh_tasks(self):
        # wipe
        for w in list(self.scroll.inner.children.values()):
            w.destroy()
        self.check_vars.clear()

        pal = self._palette()
        try:
            self.scroll.inner.configure(style="TFrame")
            self.scroll.canvas.configure(bg=pal["surface"])
        except Exception:
            pass

        date_str = iso(self.cur_date)
        tasks = list(self.state["tasks"])
        # Filter
        filt = self.filter_cat.get()
        if filt and filt != "All":
            tasks = [t for t in tasks if (t.get("category") or "-") == filt]

        # Group by category if "All" selected
        if filt == "All":
            grouped = {}
            for t in tasks:
                grouped.setdefault(t.get("category") or "-", []).append(t)
            total = done = 0
            for cat in sorted(grouped.keys()):
                ttk.Label(self.scroll.inner, text=cat, font=("TkDefaultFont", 10, "bold")).pack(anchor="w", pady=(12,2))
                for t in sorted(grouped[cat], key=lambda x: x["name"]):
                    self._add_task_row(t, date_str)
                    total += 1; done += int(get_status(self.state, date_str, t["id"]))
        else:
            total = done = 0
            for t in sorted(tasks, key=lambda x: x["name"]):
                self._add_task_row(t, date_str)
                total += 1; done += int(get_status(self.state, date_str, t["id"]))

        self.count_label.config(text=f"{done}/{len(self.state['tasks']) if filt=='All' else total} done")
        self.scroll.inner.update_idletasks()

    def _add_task_row(self, task, date_str):
        row = ttk.Frame(self.scroll.inner); row.pack(fill="x", padx=2, pady=2)
        var = tk.IntVar(value=1 if get_status(self.state, date_str, task["id"]) else 0)
        self.check_vars[task["id"]] = var
        ttk.Checkbutton(row, variable=var).pack(side="left")

        name = task["name"]
        mins = f"  ({task['minutes']}m)" if task.get("minutes") else ""
        ttk.Label(row, text=f"{name}{mins}").pack(side="left", padx=6)
        ttk.Label(row, text=f"#{task['id']}", foreground="#777").pack(side="right")

        def on_toggle(*_):
            set_status(self.state, date_str, task["id"], bool(var.get()))
            save_state(self.state)
            self._refresh_tasks()
        var.trace_add("write", on_toggle)

###############################################################################
if __name__ == "__main__":
    App().mainloop()

# %%
