#!/bin/bash
# TokenForge Test Runner — Integration Test Suite (devnet)
#
# Usage:
#   ./scripts/run-tests.sh              # Run all tests (no deploy)
#   ./scripts/run-tests.sh deploy       # Deploy FAMP program only
#   ./scripts/run-tests.sh famp         # Run FAMP tests only
#   ./scripts/run-tests.sh noop         # Build verification_policy_noop only
#
# Prerequisites:
#   - Solana toolchain installed
#   - Anchor CLI installed
#   - Node.js + yarn installed
#   - Devnet wallet funded with SOL

set -e

TOKENFORGE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export ANCHOR_WALLET=~/.config/solana/id.json
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com

deploy_famp() {
  echo "=== Building FAMP program ==="
  cd "$TOKENFORGE_ROOT/programs/famp"
  anchor build

  echo ""
  echo "=== Deploying FAMP to devnet ==="
  anchor deploy --program-name famp
}

run_famp_tests() {
  echo "=== Building FAMP program (no deploy) ==="
  cd "$TOKENFORGE_ROOT/programs/famp"
  anchor build

  echo ""
  echo "=== Running FAMP integration tests (devnet) ==="
  # Run tests directly without anchor deploy
  yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
}

build_noop() {
  echo "=== Building verification_policy_noop ==="
  cd "$TOKENFORGE_ROOT/programs/verification_policy_noop"
  cargo build-sbf --manifest-path=programs/verification_policy_noop/Cargo.toml

  echo ""
  echo "=== verification_policy_noop: pure solana-program (no Anchor tests) ==="
  echo "    Build artifact: $(ls -1 target/deploy/*.so 2>/dev/null | head -1)"
}

case "${1:-all}" in
  deploy)
    deploy_famp
    ;;
  famp)
    run_famp_tests
    ;;
  noop)
    build_noop
    ;;
  all)
    run_famp_tests
    echo ""
    build_noop
    ;;
  *)
    echo "Usage: $0 {deploy|famp|noop|all}"
    exit 1
    ;;
esac

echo ""
echo "=== Done ==="
