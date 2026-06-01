import { execSync } from 'node:child_process';

// Last git commit date (YYYY-MM-DD) for a repo-relative file path, resolved at
// build time. Falls back to the build date if git history isn't available
// (e.g. a shallow CI checkout), so the build never fails on this.
export function lastUpdated(relPath) {
  try {
    const date = execSync(`git log -1 --format=%cs -- ${relPath}`, {
      encoding: 'utf8',
    }).trim();
    if (date) return date;
  } catch {
    // fall through to build date
  }
  return new Date().toISOString().slice(0, 10);
}
