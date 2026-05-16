---
name: github-workflow
description: >
  Use GitHub CLI to run issue-first, pull-request-based development workflows:
  create semantic issues, issue-prefixed branches, linked pull requests,
  focused commits, review-feedback fixes, and merge-ready PRs.
---

# GitHub Workflow

## When To Use

Use this skill when a user asks an agent to make repository changes in a GitHub
project and the work should be tracked through GitHub issues and pull requests.

Use it for implementation, documentation, tooling, repository-maintenance, and
skill-authoring tasks.

Do not use it for read-only investigation unless the user asks to create GitHub
tracking artifacts.

## Principles

- All code changes must go through a pull request.
- Keep pull requests small, focused, and easy to review.
- Split large features into smaller issues and pull requests before editing.
- Treat configured GitHub issue and pull request templates as the source of
  truth for GitHub artifact content.
- Use English for issue titles, pull request titles, branch names, and commit
  messages.
- Use semantic titles and commit messages:

```text
<type>: <short imperative summary>
```

Prefer these types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`,
`build`, `perf`.

## Template Discovery

Before creating GitHub artifacts, inspect the repository for templates in common
GitHub-supported locations.

Issue templates:

- Prefer matching issue forms or Markdown templates in `.github/ISSUE_TEMPLATE/`.
- Also respect legacy single-file templates such as `ISSUE_TEMPLATE.md`,
  `docs/ISSUE_TEMPLATE.md`, and `.github/ISSUE_TEMPLATE.md` when present.

Pull request templates:

- Use single-file templates such as `PULL_REQUEST_TEMPLATE.md`,
  `docs/PULL_REQUEST_TEMPLATE.md`, and `.github/PULL_REQUEST_TEMPLATE.md`.
- If `PULL_REQUEST_TEMPLATE/` exists under the repository root, `docs/`, or
  `.github/`, choose the template that best matches the pull request scope.

## Required Sequence

1. Inspect repository instructions such as `AGENTS.md`, `README.md`, GitHub
   templates, branch rules, and existing workflow conventions.
2. Inspect the current branch and worktree:

   ```bash
   git status --short --branch
   ```

3. If the task is too large for one focused pull request, propose a split before
   creating GitHub artifacts.
4. Create a GitHub issue with `gh issue create`.
   - Use a semantic English title.
   - Use the applicable issue template when one exists.
   - Fill the template's required sections before adding generic context such
     as goal, scope, acceptance criteria, and validation notes.
5. Create and switch to an issue-prefixed branch:

   ```text
   <issue-number>-<semantic-title-slug>
   ```

   Example:

   ```text
   12-feat-add-github-workflow-skill
   ```

6. Implement the requested change only on the issue branch.
7. Run relevant checks before committing.
8. Commit with a semantic English commit message.
9. Push the branch.
10. Create a draft pull request linked to the issue.
    - Use the repository pull request template when one exists.
    - Fill the template's required sections before adding extra context.
    - Link the issue with `Closes #<issue-number>`.
11. Inspect pull request checks.
12. Address review feedback in focused follow-up commits or amended commits,
    according to the repository's preferred history style.
13. Wait for checks and review to complete before merging.

## Review Feedback Loop

When review comments or CI failures appear:

1. Read the pull request checks, review comments, and unresolved review threads.
2. Separate actionable feedback from informational comments.
3. Apply only the requested, scoped fixes.
4. Re-run the relevant checks.
5. Commit or amend as appropriate, then push.
6. Summarize what feedback was addressed and what remains open.

Do not resolve review threads, submit reviews, approve, merge, or delete branches
unless the user explicitly asks.

## Existing Local Work

If the user asks to commit, push, publish, or create a pull request for existing
local changes:

1. Inspect the current branch and worktree:

   ```bash
   git status --short --branch
   ```

2. Check whether the current branch already has a pull request:

   ```bash
   gh pr view
   ```

3. If a matching pull request exists, reuse it.
4. If no pull request exists but the branch already follows
   `<issue-number>-<semantic-title-slug>`, commit and push the scoped changes,
   then create a linked draft pull request.
5. If the branch does not follow the issue-branch format, do not commit
   directly. Create or identify the issue, create the issue branch, and move the
   work there before committing.
6. Preserve unrelated user changes and stage only files that belong to the
   current task.

## Useful Commands

Create an issue:

```bash
gh issue create --title "<type>: <short imperative summary>" --body-file <file>
```

Create an issue branch:

```bash
git switch -c <issue-number>-<semantic-title-slug>
```

Push the branch:

```bash
git push -u origin <issue-number>-<semantic-title-slug>
```

Create a draft pull request:

```bash
gh pr create \
  --draft \
  --base main \
  --head <issue-number>-<semantic-title-slug> \
  --title "<type>: <short imperative summary>" \
  --body-file <file>
```

Inspect checks:

```bash
gh pr checks
```

Inspect pull request details:

```bash
gh pr view --json number,title,url,state,isDraft,reviewDecision,statusCheckRollup
```

## Failure Handling

- If `gh auth status` fails, ask the user to authenticate before creating or
  editing GitHub artifacts.
- If network or Git transport fails, retry once. If a local proxy is required,
  use the proxy settings provided by the user.
- If the current worktree has unrelated changes, preserve them and do not stage
  or commit them unless the user explicitly asks.
- If the current branch is `main`, create an issue branch before editing files.
- If a pull request already exists for the current branch and matches the task,
  reuse it instead of creating a duplicate.
