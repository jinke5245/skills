---
name: gitlab-workflow
description: >
  Use GitLab CLI to run issue-first, merge-request-based development workflows:
  create semantic issues, issue-prefixed branches, early linked draft merge
  requests, focused commits, review-feedback fixes, and merge-ready MRs.
---

# GitLab Workflow

## When To Use

Use this skill when a user asks an agent to make repository changes in a GitLab
project and the work should be tracked through GitLab issues and merge requests.

Use it for implementation, documentation, tooling, repository-maintenance, and
skill-authoring tasks.

Do not use it for read-only investigation unless the user asks to create GitLab
tracking artifacts.

## Principles

- All committed code changes must go through a merge request.
- Keep merge requests small, focused, and easy to review.
- Split large features into smaller issues and merge requests before editing.
- Treat configured GitLab issue and merge request templates as the source of
  truth for GitLab artifact content.
- Use English for issue titles, merge request titles, branch names, and commit
  messages.
- Use semantic titles and commit messages:

```text
<type>: <short imperative summary>
```

Prefer these types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`,
`build`, `perf`.

## Template Discovery

Before creating GitLab artifacts, inspect the repository for templates and
project workflow conventions.

Issue templates:

- Prefer matching templates in `.gitlab/issue_templates/`.
- Use `glab issue create --template <template-name>` when a local issue
  template applies.
- Also respect project-level default issue templates when they are visible in
  repository instructions or GitLab project settings.
- `glab --template` loads local repository templates; if only a project, group,
  or instance default template is available, use the web or interactive flow, or
  manually follow the visible template structure.

Merge request templates:

- Prefer matching templates in `.gitlab/merge_request_templates/`.
- Use `glab mr create --template <template-name>` when a local merge request
  template applies.
- Also respect project-level default merge request templates when they are
  visible in repository instructions or GitLab project settings.
- `glab --template` loads local repository templates; if only a project, group,
  or instance default template is available, use the web or interactive flow, or
  manually follow the visible template structure.

## Required Sequence

1. Inspect repository instructions such as `AGENTS.md`, `README.md`, `.gitlab`
   templates, branch rules, and existing workflow conventions.
2. Inspect the current branch and worktree:

   ```bash
   git status --short --branch
   ```

3. If the task is too large for one focused merge request, propose a split
   before creating GitLab artifacts.
4. Create a GitLab issue with `glab issue create`.
   - Use a semantic English title.
   - Use the applicable issue template when one exists.
   - Fill the template's required sections before adding generic context such
     as goal, scope, acceptance criteria, and validation notes.
5. Create and switch to an issue-prefixed branch:

   ```text
   <issue-iid>-<semantic-title-slug>
   ```

   Example:

   ```text
   12-feat-add-gitlab-workflow-skill
   ```

6. Create a linked draft merge request early, before implementation, when the
   project supports it.
   - Link it to the issue with `Closes #<issue-iid>`.
   - Use the repository merge request template when one exists.
   - Fill the template's required sections before adding extra context.
7. Implement the requested change only on the issue branch.
8. Run relevant checks before committing.
9. Commit with a semantic English commit message.
10. Push the branch.
11. Inspect pipeline status and merge request discussions.
12. Address review feedback in focused follow-up commits or amended commits,
    according to the repository's preferred history style.
13. Wait for pipelines and review to complete before merging.

## Review Feedback Loop

When review comments or pipeline failures appear:

1. Read the merge request pipeline status, review comments, and unresolved
   discussions.
2. Separate actionable feedback from informational comments.
3. Apply only the requested, scoped fixes.
4. Re-run the relevant checks.
5. Commit or amend as appropriate, then push.
6. Summarize what feedback was addressed and what remains open.

Do not resolve discussions, approve, merge, or delete branches unless the user
explicitly asks.

## Existing Local Work

If the user asks to commit, push, publish, or create a merge request for
existing local changes:

1. Inspect the current branch and worktree:

   ```bash
   git status --short --branch
   ```

2. Check whether the current branch already has a merge request:

   ```bash
   glab mr view
   ```

3. If a matching merge request exists, reuse it.
4. If no merge request exists but the branch already follows
   `<issue-iid>-<semantic-title-slug>`, create or identify the matching issue,
   then create a linked draft merge request.
5. If the branch does not follow the issue-branch format, do not commit
   directly. Create or identify the issue, create the issue branch, and move the
   work there before committing.
6. Preserve unrelated user changes and stage only files that belong to the
   current task.

## Useful Commands

Create an issue from a template:

```bash
glab issue create --title "<type>: <short imperative summary>" \
  --template <template-name> \
  --yes
```

Create an issue branch:

```bash
git switch -c <issue-iid>-<semantic-title-slug>
```

Create an early draft merge request:

```bash
glab mr create \
  --draft \
  --create-source-branch \
  --source-branch <issue-iid>-<semantic-title-slug> \
  --target-branch <default-branch> \
  --related-issue <issue-iid> \
  --template <template-name> \
  --yes
```

Push the branch:

```bash
git push -u origin <issue-iid>-<semantic-title-slug>
```

Inspect pipeline status:

```bash
glab ci status
```

Inspect merge request details:

```bash
glab mr view
```

Inspect unresolved discussions:

```bash
glab mr view --unresolved
```

## Failure Handling

- If `glab auth status` fails, ask the user to authenticate before creating or
  editing GitLab artifacts.
- If network or Git transport fails, retry once. If a local proxy is required,
  use the proxy settings provided by the user.
- If the current worktree has unrelated changes, preserve them and do not stage
  or commit them unless the user explicitly asks.
- If the current branch is the default branch, create an issue branch before
  editing files.
- If a merge request already exists for the current branch and matches the task,
  reuse it instead of creating a duplicate.
