## Pull Request Type

New skill

---

## Checklist

- [ ] Skill lives under `skills/<skill-name>/`.
- [ ] Directory name uses lowercase kebab-case.
- [ ] Skill includes `skills/<skill-name>/SKILL.md`.
- [ ] `SKILL.md` starts with YAML frontmatter containing `name` and `description`.
- [ ] The frontmatter `name` matches the skill directory name.
- [ ] Required `scripts/`, `references/`, or `assets/` are referenced from `SKILL.md`.
- [ ] Agent-specific metadata is included only when required, under `skills/<skill-name>/agents/`.
- [ ] No local paths, credentials, private URLs, or workspace-specific details.
- [ ] README or install docs are updated if the available skills list changed.

---

## Description

<!--
Summarize the new skill, when agents should use it, and which runtimes or
agents it supports.
-->

---

## Linked Issue

Closes #

---

## Validation

<!--
Include `npm run lint:markdown`, `npm run verify:skills`, and any agent/runtime
verification performed.
-->

---

By submitting this pull request, I understand that my changes will be licensed
under the MIT License.
