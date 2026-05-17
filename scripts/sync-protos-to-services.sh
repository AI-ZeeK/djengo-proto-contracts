#!/usr/bin/env bash
# Copy canonical protos from djengo-proto-contracts into each microservice.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/djengo-proto-contracts/proto"

DESTS=(
  "$ROOT/gateway-service/src/shared/proto"
  "$ROOT/financials/protos"
  "$ROOT/events/protos"
  "$ROOT/operations/protos"
  "$ROOT/profile-service/src/shared/proto"
  "$ROOT/organization-service/src/shared/proto"
)

for d in "${DESTS[@]}"; do
  if [[ -d "$d" ]]; then
    cp "$SRC"/*.proto "$d/"
    echo "Synced -> $d"
  fi
done

echo "Done. Run 'npm run proto:build-all' in gateway-service to regenerate TypeScript stubs."
