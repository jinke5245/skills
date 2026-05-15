#!/bin/bash

set -euo pipefail

curl -sSL https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | sudo bash -s -- 1.7.12 /usr/bin
