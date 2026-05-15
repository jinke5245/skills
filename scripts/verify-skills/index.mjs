import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const skillsRoot = path.join(repoRoot, "skills");
const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseFrontmatter(skillMdPath, skillName) {
  const content = readText(skillMdPath);
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    fail(`${skillName}: SKILL.md must start with YAML frontmatter`);
    return { content, metadata: {} };
  }

  const frontmatter = match[1];
  const document = YAML.parseDocument(frontmatter);
  if (document.errors.length > 0) {
    fail(`${skillName}: SKILL.md frontmatter must be valid YAML`);
    return { content, metadata: {} };
  }

  const metadata = document.toJSON();
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    fail(`${skillName}: SKILL.md frontmatter must be a YAML mapping`);
    return { content, metadata: {} };
  }

  return { content, metadata };
}

function hasFiles(directoryPath) {
  return fs.existsSync(directoryPath) && fs.readdirSync(directoryPath).length > 0;
}

function verifyResourceReferences(skillDir, skillName, skillContent) {
  for (const resourceDirName of ["scripts", "references", "assets"]) {
    const resourceDir = path.join(skillDir, resourceDirName);
    if (hasFiles(resourceDir) && !skillContent.includes(`${resourceDirName}/`)) {
      fail(`${skillName}: ${resourceDirName}/ exists but is not referenced from SKILL.md`);
    }
  }
}

function verifyAgentMetadata(skillDir, skillName) {
  const agentsDir = path.join(skillDir, "agents");
  if (!fs.existsSync(agentsDir)) {
    return;
  }

  const metadataFiles = fs
    .readdirSync(agentsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();

  for (const metadataFile of metadataFiles) {
    if (!/^[a-z0-9][a-z0-9-]*\.ya?ml$/.test(metadataFile)) {
      fail(`${skillName}: agents/${metadataFile} must use lowercase kebab-case YAML`);
      continue;
    }

    const metadataPath = path.join(agentsDir, metadataFile);
    const metadataText = readText(metadataPath).trim();
    if (!metadataText) {
      fail(`${skillName}: agents/${metadataFile} must not be empty`);
      continue;
    }

    const metadataDocument = YAML.parseDocument(metadataText);
    if (metadataDocument.errors.length > 0) {
      fail(`${skillName}: agents/${metadataFile} must be valid YAML`);
      continue;
    }

    const metadata = metadataDocument.toJSON();
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      fail(`${skillName}: agents/${metadataFile} must be a YAML mapping`);
      continue;
    }

    if (metadataFile === "openai.yaml" || metadataFile === "openai.yml") {
      for (const field of ["interface", "display_name", "short_description", "default_prompt"]) {
        if (!Object.hasOwn(metadata, field)) {
          fail(`${skillName}: agents/${metadataFile} missing ${field}`);
        }
      }
    }
  }
}

function verifyReusableContent(skillName, skillContent) {
  const bannedPatterns = [
    { pattern: /\/Users\//, label: "absolute macOS user path" },
    { pattern: /\b[A-Z]:\\/, label: "absolute Windows path" },
  ];

  for (const { pattern, label } of bannedPatterns) {
    if (pattern.test(skillContent)) {
      fail(`${skillName}: SKILL.md contains ${label}`);
    }
  }
}

function verifySkill(skillDirent) {
  const skillName = skillDirent.name;
  const skillDir = path.join(skillsRoot, skillName);
  const skillMdPath = path.join(skillDir, "SKILL.md");

  if (!/^[a-z0-9][a-z0-9-]*$/.test(skillName)) {
    fail(`${skillName}: skill directory name must use lowercase kebab-case`);
  }

  if (!fs.existsSync(skillMdPath)) {
    fail(`${skillName}: missing SKILL.md`);
    return;
  }

  const { content, metadata } = parseFrontmatter(skillMdPath, skillName);
  const name = metadata.name;
  const description = metadata.description;

  if (!name || typeof name !== "string") {
    fail(`${skillName}: SKILL.md frontmatter missing name`);
  } else if (name !== skillName) {
    fail(`${skillName}: frontmatter name "${name}" must match directory name`);
  }

  if (!description || typeof description !== "string") {
    fail(`${skillName}: SKILL.md frontmatter missing description`);
  }

  verifyResourceReferences(skillDir, skillName, content);
  verifyAgentMetadata(skillDir, skillName);
  verifyReusableContent(skillName, content);
}

if (!fs.existsSync(skillsRoot)) {
  console.log("No skills/ directory found.");
} else {
  const skillDirs = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const skillDir of skillDirs) {
    verifySkill(skillDir);
  }

  if (failures.length === 0) {
    console.log(`Verified ${skillDirs.length} skill(s).`);
  }
}

if (failures.length > 0) {
  console.error("Skill verification failed:");
  for (const message of failures) {
    console.error(`- ${message}`);
  }
  process.exitCode = 1;
}
