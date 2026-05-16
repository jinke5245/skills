# Agent Skills

Shared Agent Skills for Codex, Claude Code, GitHub Copilot, and other tools
that support the Agent Skills specification.

## Repository Layout

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

Each skill lives under `skills/<skill-name>/` and must include a `SKILL.md`
file with `name` and `description` frontmatter.

Agent-specific metadata can be added when a tool or installer requires it:

```text
skills/
└── <skill-name>/
    └── agents/
        └── <agent>.yaml
```

## Install A Skill

Install a skill with `npx skills`:

```bash
npx skills add https://github.com/jinke5245/skills.git \
  --skill <skill-name> \
  --agent <agent> \
  --global \
  --copy \
  --yes
```

Alternatively, install it with `npx add-skill`:

```bash
npx add-skill https://github.com/jinke5245/skills.git \
  --skill <skill-name> \
  --agent <agent> \
  --global \
  --yes
```

Use an agent name supported by your installer. For example, Codex installers may
use `codex`; other tools may use their own names or install paths. Restart your
agent after installing or updating skills.

For tools that do not support `npx skills`, follow that tool's own skill
installation instructions and use `skills/<skill-name>/` as the source.

## List Available Skills

```bash
npx skills add https://github.com/jinke5245/skills.git --list
```

or:

```bash
npx add-skill https://github.com/jinke5245/skills.git --list
```

Current skills:

- `github-workflow`: issue-first GitHub CLI workflow for pull-request-based
  repository changes.
- `gitlab-workflow`: issue-first GitLab CLI workflow for merge-request-based
  repository changes.

## Update A Skill

Re-run the same install command to refresh the installed copy:

```bash
npx skills add https://github.com/jinke5245/skills.git \
  --skill <skill-name> \
  --agent <agent> \
  --global \
  --copy \
  --yes
```

Restart your agent after the update.
