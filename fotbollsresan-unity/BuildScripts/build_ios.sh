#!/usr/bin/env bash
set -euo pipefail

UNITY_PATH="${UNITY_PATH:-/Applications/Unity/Hub/Editor/2022.3.0f1/Unity.app/Contents/MacOS/Unity}"
PROJECT_PATH="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_PATH="${PROJECT_PATH}/build/ios/FotbollsresanXcode"

mkdir -p "${BUILD_PATH}"

"${UNITY_PATH}" \
  -batchmode -quit \
  -projectPath "${PROJECT_PATH}" \
  -executeMethod BuildScript.BuildiOS \
  -logFile -

echo "iOS build finished at ${BUILD_PATH}"

