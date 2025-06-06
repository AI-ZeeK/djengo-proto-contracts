#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get the calling project's directory (where npm run is executed from)
const projectRoot = process.cwd();
const sourceDir = path.join(__dirname, "../proto");
const targetProtoDir = path.join(projectRoot, "src/shared/proto");
const targetDepsDir = path.join(projectRoot, "src/shared/dependencies");

// Ensure target directories exist
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${path.relative(projectRoot, dir)}`);
  }
}

// Copy proto files
function copyProtoFiles() {
  try {
    console.log("🚀 DJENGO Proto Contracts Setup");
    console.log("================================");
    console.log(`📍 Project root: ${projectRoot}`);

    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error("❌ Proto files not found in package!");
      console.log("This might be a corrupted installation.");
      process.exit(1);
    }

    // Create target directories
    ensureDirectory(targetProtoDir);
    ensureDirectory(targetDepsDir);

    // Read all files in source directory
    const files = fs.readdirSync(sourceDir);
    const protoFiles = files.filter((file) => file.endsWith(".proto"));

    if (protoFiles.length === 0) {
      console.warn("⚠️  No .proto files found in source directory");
      return;
    }

    console.log("📁 Copying proto files...");

    protoFiles.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetProtoDir, file);

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied: ${file}`);
    });

    console.log("");
    console.log("🎉 Setup completed successfully!");
    console.log(
      `📂 Proto files: ${path.relative(projectRoot, targetProtoDir)}`
    );
    console.log(
      `📂 Generated files will go to: ${path.relative(
        projectRoot,
        targetDepsDir
      )}`
    );
    console.log("");
    console.log("📋 Next steps:");
    console.log("1. Run your proto generation command");
    console.log("2. Import the generated types in your services");
    console.log("");
    console.log("💡 Tip: Add this to your package.json scripts:");
    console.log('   "proto:setup": "djengo-proto-setup"');
    console.log(
      '   "proto:generate": "protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./src/shared/dependencies --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb --ts_proto_opt=outputServices=grpc-js --proto_path=./src/shared/proto ./src/shared/proto/*.proto"'
    );
  } catch (error) {
    console.error("❌ Error during setup:", error.message);
    process.exit(1);
  }
}

copyProtoFiles();
