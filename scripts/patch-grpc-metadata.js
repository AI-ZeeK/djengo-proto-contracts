#!/usr/bin/env node
/**
 * patch-grpc-metadata.js
 *
 * Post-processes ts-proto generated *.pb.ts files to add `metadata?: Metadata`
 * to every method in *ServiceClient interfaces.
 *
 * Why: gRPC metadata (auth headers etc.) is a transport-level concept — it
 * cannot be expressed in .proto files. ts-proto's nestJs=true output omits it
 * from the client interface signatures, but the underlying @grpc/grpc-js client
 * accepts it as an optional second argument on every RPC call.
 *
 * Run after proto generation:
 *   node scripts/patch-grpc-metadata.js [path/to/dependencies]
 */

const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const depsDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(projectRoot, "src/shared/dependencies");

if (!fs.existsSync(depsDir)) {
  console.error(`[patch-grpc-metadata] Directory not found: ${depsDir}`);
  process.exit(1);
}

const pbFiles = fs.readdirSync(depsDir).filter((f) => f.endsWith(".pb.ts"));

if (pbFiles.length === 0) {
  console.warn(
    "[patch-grpc-metadata] No *.pb.ts files found — nothing to patch.",
  );
  process.exit(0);
}

let totalPatched = 0;

for (const file of pbFiles) {
  const filePath = path.join(depsDir, file);
  let src = fs.readFileSync(filePath, "utf8");
  const original = src;

  // 1. Ensure `Metadata` is imported from '@grpc/grpc-js'.
  //    The file may already import OTHER things from grpc-js (e.g. handleUnaryCall)
  //    without importing Metadata specifically — so we check for Metadata by name.
  const hasMetadataImport = /import[^;]*\bMetadata\b[^;]*from ['"]@grpc\/grpc-js['"]/.test(src);
  if (!hasMetadataImport) {
    if (src.includes("from '@grpc/grpc-js'") || src.includes('from "@grpc/grpc-js"')) {
      // A grpc-js import already exists — add Metadata to it.
      // Handle both `import { ... }` and `import type { ... }` forms.
      src = src.replace(
        /import(?:\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])@grpc\/grpc-js\2/,
        (match, imports) => {
          const names = imports.split(",").map((s) => s.trim()).filter(Boolean);
          if (!names.includes("Metadata")) names.push("Metadata");
          // Keep as a value import (not `import type`) so Metadata is available at runtime
          return `import { ${names.join(", ")} } from '@grpc/grpc-js'`;
        }
      );
    } else {
      // No grpc-js import at all — insert a new one after the last import line
      const lastImportIdx = src.lastIndexOf("\nimport ");
      const insertAt = src.indexOf("\n", lastImportIdx + 1);
      src =
        src.slice(0, insertAt) +
        "\nimport { Metadata } from '@grpc/grpc-js';" +
        src.slice(insertAt);
    }
  }

  // 2. Inside *ServiceClient interfaces, add `metadata?: Metadata` to every
  //    method that returns Observable<...> but doesn't already have it.
  //
  //    Targets lines like:
  //      someMethod(request: FooRequest): Observable<FooResponse>;
  //    and multi-line variants:
  //      someMethod(
  //        request: FooRequest,
  //      ): Observable<FooResponse>;
  //
  //    Strategy: only patch inside *ServiceClient interface blocks.

  // Match each *ServiceClient interface block
  src = src.replace(
    /export interface \w+ServiceClient \{[\s\S]*?\n\}/g,
    (interfaceBlock) => {
      // Add metadata to single-line method signatures
      interfaceBlock = interfaceBlock.replace(
        /(\w+\(request: \w+)\): Observable</g,
        "$1, metadata?: Metadata): Observable<",
      );

      // Add metadata to multi-line method signatures — the closing paren
      // on its own line before ): Observable
      interfaceBlock = interfaceBlock.replace(
        /(\n\s+)\): Observable</g,
        (match, indent) => {
          // Only add if metadata isn't already there (idempotent)
          return `${indent}metadata?: Metadata,\n${indent}): Observable<`;
        },
      );

      return interfaceBlock;
    },
  );

  // 3. Make the patch idempotent: collapse any doubled metadata params
  //    that might appear if the script runs twice.
  src = src.replace(
    /(metadata\?: Metadata,\s*\n\s*metadata\?: Metadata)/g,
    "metadata?: Metadata",
  );
  src = src.replace(
    /(, metadata\?: Metadata, metadata\?: Metadata)/g,
    ", metadata?: Metadata",
  );

  if (src !== original) {
    fs.writeFileSync(filePath, src, "utf8");
    totalPatched++;
    console.log(`[patch-grpc-metadata] ✅ Patched: ${file}`);
  } else {
    console.log(`[patch-grpc-metadata] ⏭  Already up-to-date: ${file}`);
  }
}

console.log(`[patch-grpc-metadata] Done — ${totalPatched} file(s) patched.`);
