## Pull Request Type

Existing skill update

---

## Checklist

- [ ] The change is scoped to a single existing skill.
- [ ] The updated skill still includes `skills/<skill-name>/SKILL.md`.
- [ ] `SKILL.md` still starts with YAML frontmatter containing `name` and `description`.
- [ ] The frontmatter `name` still matches the skill directory name.
- [ ] New or updated `scripts/`, `references/`, or `assets/` are referenced from `SKILL.md`.
- [ ] Agent-specific metadata remains only when required, under `skills/<skill-name>/agents/`.
- [ ] No local paths, credentials, private URLs, or workspace-specific details.
- [ ] README or install docs are updated if behavior, usage, or available skills changed.

---

## Description

<!--
Summarize what changed, why it is useful, and which existing skill is affected.
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
