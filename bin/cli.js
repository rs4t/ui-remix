#!/usr/bin/env node
// UI REMIX installer: copies the bundled skill into an agent skills folder.
const fs = require("fs");
const os = require("os");
const path = require("path");

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

if (has("-h") || has("--help")) {
  console.log(`UI REMIX installer

Usage: npx ui-remix [options]

Options:
  (default)        install to ~/.claude/skills/ui-remix (Claude Code)
  --project        install to ./.claude/skills/ui-remix
  --agents         install to ~/.agents/skills/ui-remix
  --dir <path>     install to <path>/ui-remix
  --force          overwrite an existing install
  -h, --help       show this help`);
  process.exit(0);
}

const home = os.homedir();
let base = path.join(home, ".claude", "skills");
if (has("--project")) base = path.join(process.cwd(), ".claude", "skills");
if (has("--agents")) base = path.join(home, ".agents", "skills");
if (val("--dir")) base = path.resolve(val("--dir"));

const src = path.join(__dirname, "..", "skill");
const dest = path.join(base, "ui-remix");

if (!fs.existsSync(src)) {
  console.error("Bundled skill folder not found: " + src);
  process.exit(1);
}
if (fs.existsSync(dest) && !has("--force")) {
  console.error(dest + " already exists. Re-run with --force to overwrite.");
  process.exit(1);
}
fs.mkdirSync(base, { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("UI REMIX installed to " + dest);
console.log("Restart your agent session, then ask for any UI/UX design task.");
console.log("Search tool (needs Python 3): python " + path.join(dest, "scripts", "search.py") + ' "fintech dashboard" --design-system');
