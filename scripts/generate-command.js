#!/usr/bin/env node

/**
 * Helper script to generate the complete protoc command
 * with all recommended options for DJENGO projects
 */

const os = require("os");

function generateProtoCommand() {
  const isWindows = os.platform() === "win32";
  const pluginPath = isWindows
    ? "./node_modules/.bin/protoc-gen-ts_proto.cmd"
    : "./node_modules/.bin/protoc-gen-ts_proto";

  const command = [
    "protoc",
    "--plugin=protoc-gen-ts_proto=" + pluginPath,
    "--ts_proto_out=./src/shared/dependencies",
    "--ts_proto_opt=nestJs=true",
    "--ts_proto_opt=fileSuffix=.pb",
    "--ts_proto_opt=outputServices=grpc-js",
    "--ts_proto_opt=useOptionals=messages",
    "--ts_proto_opt=snakeToCamel=false", // Keep snake_case field names
    "--proto_path=./src/shared/proto",
    "./src/shared/proto/*.proto",
  ].join(" ");

  console.log("📋 Recommended proto generation command:");
  console.log("");
  console.log(command);
  console.log("");
  console.log("📝 Add this to your package.json scripts:");
  console.log("");
  console.log(
    JSON.stringify(
      {
        "proto:setup": "djengo-proto-setup",
        "proto:generate": command,
        "proto:build": "npm run proto:setup && npm run proto:generate",
      },
      null,
      2
    )
  );
  console.log("");
  console.log("🔧 Key options explained:");
  console.log("- nestJs=true: Generates NestJS-compatible service interfaces");
  console.log(
    "- snakeToCamel=false: Keeps field names as snake_case (user_id, not userId)"
  );
  console.log("- outputServices=grpc-js: Compatible with @grpc/grpc-js");
  console.log(
    "- useOptionals=messages: Uses optional fields for better TypeScript types"
  );
}

generateProtoCommand();
