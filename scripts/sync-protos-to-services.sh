#!/usr/bin/env bash
# Copy canonical protos from djengo-proto-contracts into every service that embeds them.
# Source of truth: backend/djengo-proto-contracts/proto/
#
# Usage (from repo root):
#   bash backend/djengo-proto-contracts/scripts/sync-protos-to-services.sh
#
# After syncing C# services, rebuild:
#   cd backend/events && dotnet build
#   cd backend/financials && dotnet build
#   cd backend/operations && dotnet build
#
# After syncing NestJS services:
#   npm run proto:generate && npm run proto:patch
#   (or npm run proto:build-all where available)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/djengo-proto-contracts/proto"

if [[ ! -d "$SRC" ]]; then
  echo "ERROR: Proto source not found: $SRC" >&2
  exit 1
fi

DESTS=(
  "$ROOT/gateway-service/src/shared/proto"
  "$ROOT/profile-service/src/shared/proto"
  "$ROOT/organization-service/src/shared/proto"
  "$ROOT/admin-service/src/shared/proto"
  "$ROOT/files-service/src/shared/proto"
  "$ROOT/address-service/src/shared/proto"
  "$ROOT/communications-service/src/shared/proto"
  "$ROOT/financials/protos"
  "$ROOT/events/protos"
  "$ROOT/operations/protos"
  "$ROOT/comms/proto"
)

echo "Syncing protos from: $SRC"
echo ""

for d in "${DESTS[@]}"; do
  if [[ -d "$d" ]]; then
    cp "$SRC"/*.proto "$d/"
    echo "  -> $d"
  else
    echo "  SKIP (missing dir): $d"
  fi
done

echo ""
echo "Done. Canonical protos are now aligned across services."
echo "Publish djengo-proto-contracts to GitHub before running proto:setup in CI/other machines."
