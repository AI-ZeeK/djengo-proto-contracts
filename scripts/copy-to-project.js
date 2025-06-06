#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Get the calling project's directory (where npm run is executed from)
const projectRoot = process.cwd();
const sourceDir = path.join(__dirname, "../proto");
const targetProtoDir = path.join(projectRoot, "src/shared/proto");
const targetDepsDir = path.join(projectRoot, "src/shared/dependencies");

// NestJS-style logger
const logger = {
  log: (message) =>
    console.log(chalk.green(`[DJENGO-PROTO-CONTRACTS] ${message}`)),
  info: (message) =>
    console.log(chalk.blue(`[DJENGO-PROTO-CONTRACTS] ${message}`)),
  warn: (message) =>
    console.log(chalk.yellow(`[DJENGO-PROTO-CONTRACTS] ${message}`)),
  error: (message) =>
    console.log(chalk.red(`[DJENGO-PROTO-CONTRACTS] ${message}`)),
  success: (message) =>
    console.log(chalk.green(`[DJENGO-PROTO-CONTRACTS] ✅ ${message}`)),
  step: (step, message) =>
    console.log(
      chalk.cyan(`[DJENGO-PROTO-CONTRACTS] 📋 Step ${step}: ${message}`)
    ),
  title: (title) => {
    console.log(chalk.magenta.bold(`\n🚀 ${title}`));
    console.log(chalk.magenta("=".repeat(title.length + 3)));
  },
};

// Ensure target directories exist
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.success(`Created directory: ${path.relative(projectRoot, dir)}`);
  }
}

// Copy proto files
function copyProtoFiles() {
  try {
    logger.title("DJENGO Proto Contracts Setup");
    logger.info(`Project root: ${projectRoot}`);

    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      logger.error("Proto files not found in package!");
      logger.error("This might be a corrupted installation.");
      process.exit(1);
    }

    // Create target directories
    ensureDirectory(targetProtoDir);
    ensureDirectory(targetDepsDir);

    // Read all files in source directory
    const files = fs.readdirSync(sourceDir);
    const protoFiles = files.filter((file) => file.endsWith(".proto"));

    if (protoFiles.length === 0) {
      logger.warn("No .proto files found in source directory");
      return;
    }

    logger.step(1, "Copying proto files...");

    protoFiles.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetProtoDir, file);

      fs.copyFileSync(sourcePath, targetPath);
      logger.success(`Copied: ${file}`);
    });

    logger.title("🎉 Setup completed successfully!");
    logger.success(
      `Proto files: ${path.relative(projectRoot, targetProtoDir)}`
    );
    logger.success(
      `Generated files will go to: ${path.relative(projectRoot, targetDepsDir)}`
    );

    logger.info("Next steps:");
    logger.info("1. Run your proto generation command");
    logger.info("2. Import the generated types in your services");

    logger.info("Tip: Add this to your package.json scripts:");
    logger.info('   "proto:setup": "djengo-proto-setup"');
    logger.info(
      '   "proto:generate": "protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./src/shared/dependencies --ts_proto_opt=nestJs=true --ts_proto_opt=fileSuffix=.pb --ts_proto_opt=outputServices=grpc-js --ts_proto_opt=useOptionals=messages --ts_proto_opt=snakeToCamel=false --proto_path=./src/shared/proto ./src/shared/proto/*.proto"'
    );
  } catch (error) {
    logger.error(`Error during setup: ${error.message}`);
    process.exit(1);
  }
}

copyProtoFiles();
