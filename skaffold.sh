#!/bin/bash

#chmod +x skaffold.sh

if [ "$1" == "--pub" ]; then
  echo "Building & Publishing"
  ./common/publish.sh
else
  echo "Building"
fi

set -euo pipefail

PACKAGE_NAME="@lovelacers/common"
TARGET_DIRS=("service-chat" "service-notification" "service-state" "service-seller" "service-email" "base-consumer" "service-product" "service-query" "service-media" "service-processor" "base-publisher" "service-user" "service-gateway" "service-price")

echo "📦 Fetching the latest version of $PACKAGE_NAME from NPM..."
LATEST_VERSION=$(npm show "$PACKAGE_NAME" version)

if [[ -z "$LATEST_VERSION" ]]; then
  echo "❌ Failed to get version for $PACKAGE_NAME"
  exit 1
fi

echo "📌 Latest available version: $LATEST_VERSION"
echo

for dir in "${TARGET_DIRS[@]}"; do
  echo "📁 Checking ./$dir..."

  if [[ ! -f "$dir/package.json" ]]; then
    echo "⚠️ No package.json found in $dir — skipping..."
    continue
  fi

  # Get currently installed version (if any)
  INSTALLED_VERSION=$(jq -r ".dependencies[\"$PACKAGE_NAME\"] // empty" "$dir/package.json")

  # Remove ^ if present
  INSTALLED_VERSION_CLEAN="${INSTALLED_VERSION/#^/}"

  if [[ "$INSTALLED_VERSION_CLEAN" == "$LATEST_VERSION" ]]; then
    echo "✅ $PACKAGE_NAME is already at the latest version ($LATEST_VERSION) in $dir — skipping."
    echo
    continue
  fi

  echo "🔄 Updating $PACKAGE_NAME from $INSTALLED_VERSION_CLEAN → $LATEST_VERSION in $dir..."
  (
    cd "$dir"
    npm install "$PACKAGE_NAME@$LATEST_VERSION"
  )
  echo "✅ Updated in $dir"

done

set -euo pipefail

terminating_pods=$(kubectl get pods --all-namespaces | grep Terminating || true)

if [[ -n "$terminating_pods" ]]; then
  echo "⚠️  Pods in 'Terminating' state were found. Forcing deletion..."

  echo "$terminating_pods" | while read -r namespace pod _; do
    echo "➡️  Deleting pod: $pod in namespace: $namespace"
    kubectl delete pod "$pod" --namespace="$namespace" --grace-period=0 --force || true
  done

  echo "✅ All pods marked for deletion."
else
  echo "✅ No pods in 'Terminating' state."
fi

skaffold dev