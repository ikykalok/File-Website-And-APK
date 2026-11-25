<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PERMANENT AGENT INSTRUCTIONS: AUTOMATIC GITHUB SYNCHRONIZATION

## GitHub Repository
- **Remote URL**: `https://github.com/ikykalok/File-Website-And-APK.git`
- **Default Branch**: `main`
- **Remote Name**: `origin`

## Mandatory Rule: Automatic Sync on EVERY Change
Whenever making ANY changes, edits, or additions to this project:
You must automatically synchronize all changes with GitHub. The user will **NEVER** need to remind you to commit, push, upload, or sync.

### Workflow after EVERY completed task:
1. **Complete the requested development work.**
2. **Verify the modified files** (`git status`, `git diff`).
3. **Run relevant checks or builds** when practical (e.g., `npm run build` or type check).
4. **Security Check**:
   - Never commit `.env`, `.env*.local`, secrets, API keys, passwords, or personal credentials.
   - Respect `.gitignore` (node_modules, .next, build, dist, cache files).
5. **Stage all intended project changes**:
   `git add <files>` or `git add .` (verifying untracked files first).
6. **Create a meaningful commit message**:
   Describing exactly what was changed/added.
7. **Push the commit to origin/main**:
   `git push origin main`
8. **Verify the push was successful**.

### Error Handling & Safeguards:
- If push fails (e.g. network/auth issue or out-of-sync remote):
  - Identify the exact error.
  - Pull safely with rebase if remote has new commits: `git pull --rebase origin main`.
  - Resolve conflicts carefully without overwriting local or remote work blindly.
  - Never force push (`--force` or `-f`) without explicit user permission.
  - Never print or leak auth tokens or credentials in logs or messages.
  - If authentication fails, ask the user to authenticate via Git Credential Manager / GitHub CLI.
