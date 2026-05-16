# Project Instructions

This repository contains reusable Agent Skills for multiple agent runtimes,
including Codex, Claude Code, GitHub Copilot, and compatible tools.

## Collaboration Rules

### Required GitHub Workflow

Use the repository-local `github-workflow` skill before starting any task that
may change files, commits, branches, issues, or pull requests in this
repository. The skill is linked at `.agents/skills/github-workflow`.

Before editing files:

1. Create or identify a matching GitHub issue with an English semantic title.
2. Create and switch to an issue-number-prefixed branch using
   `<issue-number>-<semantic-title-slug>`.
3. Implement only the scoped change on that branch.
4. Validate the change before handing work back.

When the user asks to commit, push, publish, or open/update a pull request:

1. Re-check the worktree and stage only scoped changes.
2. Commit with an English semantic commit message.
3. Push the branch and create or update a draft pull request linked to the
   issue.
4. Address CI and review feedback through the pull request.

If a matching issue, branch, and pull request already exist, reuse them after
verifying they match the current task.

Do not commit, push, or create/update pull requests unless the user asks for
that step or explicitly confirms it. All committed repository changes must go
through pull requests. Keep pull requests small and focused; split large
features into smaller issues and pull requests before editing.

### Language And Naming

All issue titles, pull request titles, branch names, and commit messages must be in English.

Issue titles and commit messages must use semantic format:

```text
<type>: <short imperative summary>
```

Example:

```text
chore: add GitHub templates
```

### Worktree Safety

- Preserve unrelated user changes.
- Do not revert or delete files you did not create unless explicitly requested.
- Do not stage or commit unrelated changes unless explicitly requested.
- Do not commit directly on `main`.
- Do not create commits unless the user asks for a commit.

## Repository Layout

- Published skills live under `skills/<skill-name>/`.
- Every skill must include `skills/<skill-name>/SKILL.md`.
- Skill directory names must use lowercase kebab-case.
- Agent-specific metadata belongs under `skills/<skill-name>/agents/` only when a target tool requires it.
- Skill-local scripts, references, and assets should stay inside the skill directory.

## Skill Requirements

`SKILL.md` must start with YAML frontmatter containing `name` and `description`.
The `name` value must match the skill directory name.

Keep skills reusable and portable:

- Do not include credentials, private URLs, local workspace paths, or user-specific details.
- Do not hard-code absolute paths such as `/Users/...` or Windows drive paths.
- Reference any required `scripts/`, `references/`, or `assets/` from `SKILL.md`.
- Keep `SKILL.md` focused on trigger conditions, required context, workflow steps, failure handling, and verification.
- Put long background material in `references/` instead of expanding `SKILL.md`.

## Validation

Before handing work back, run the relevant checks:

```bash
npm run lint:markdown
npm run verify:skills
```

`verify:skills` is required for new or updated files under `skills/` or `scripts/verify-skills/`.

## GitHub Templates

- Use `.github/ISSUE_TEMPLATE/skill-new.yml` for new skill requests.
- Use `.github/ISSUE_TEMPLATE/skill-update.yml` for existing skill changes.
- Use `.github/ISSUE_TEMPLATE/maintenance.yml` for repository maintenance.
- Keep pull request descriptions aligned with `.github/PULL_REQUEST_TEMPLATE.md`.
