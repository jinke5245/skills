#!/bin/bash

set -euo pipefail

[[ -f package-lock.json ]] && { corepack enable; npm ci --ignore-scripts; npm run prepare; }
