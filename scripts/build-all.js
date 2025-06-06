#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");
const chalk = require("chalk");

// Get the calling project's directory (where npm run is executed from)
const projectRoot = process.cwd();
const sourceDir = path.join(__dirname, "../proto");
const targetProtoDir = path.join(projectRoot, "src/shared/proto");
const targetDepsDir = path.join(projectRoot, "src/shared/dependencies");

// NestJS-style logger
const logger = {
  log: (message) => console.log(chalk.green(`[DJENGO] ${message}`)),
  info: (message) => console.log(chalk.blue(`[DJENGO] ${message}`)),
  warn: (message) => console.log(chalk.yellow(`[DJENGO] ${message}`)),
  error: (message) => console.log(chalk.red(`[DJENGO] ${message}`)),
  success: (message) => console.log(chalk.green(`[DJENGO] ✅ ${message}`)),
  step: (step, message) =>
    console.log(chalk.cyan(`[DJENGO] 📋 Step ${step}: ${message}`)),
  title: (title) => {
    console.log(chalk.magenta.bold(`\n🚀 ${title}`));
    console.log(chalk.magenta("=".repeat(title.length + 3)));
  },
};

logger.title("DJENGO Proto Contracts - Complete Build");
logger.info(`Project root: ${projectRoot}`);

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
    logger.step(1, "Copying proto files...");

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

    protoFiles.forEach((file) => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetProtoDir, file);

      fs.copyFileSync(sourcePath, targetPath);
      logger.success(`Copied: ${file}`);
    });

    logger.success("Proto files copied successfully");
  } catch (error) {
    logger.error(`Error copying proto files: ${error.message}`);
    process.exit(1);
  }
}

// Check if ts-proto is installed
function checkDependencies() {
  logger.step(2, "Checking dependencies...");

  const packageJsonPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    logger.error("No package.json found in project root");
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  if (!allDeps["ts-proto"]) {
    logger.warn("ts-proto not found in dependencies");
    logger.info("Installing ts-proto...");
    try {
      execSync("npm install --save-dev ts-proto", {
        cwd: projectRoot,
        stdio: "inherit",
      });
      logger.success("ts-proto installed");
    } catch (error) {
      logger.error(`Failed to install ts-proto: ${error.message}`);
      process.exit(1);
    }
  } else {
    logger.success("ts-proto found in dependencies");
  }
}

// Find protoc executable
function findProtoc() {
  logger.step(3, "Finding protoc executable...");

  const isWindows = os.platform() === "win32";

  // Try to find protoc in various locations
  const possiblePaths = [];

  if (isWindows) {
    // Common Windows paths
    possiblePaths.push(
      "C:\\protoc\\bin\\protoc.exe",
      "C:\\Program Files\\protoc\\bin\\protoc.exe",
      "C:\\tools\\protoc\\bin\\protoc.exe"
    );

    // Try to find via where command
    try {
      const whereOutput = execSync("where.exe protoc", {
        encoding: "utf8",
      }).trim();
      const paths = whereOutput.split("\n").map((p) => p.trim());
      // Find the one that's not npm protoc
      for (const p of paths) {
        if (
          !p.includes("node_modules") &&
          !p.includes("nvm") &&
          p.endsWith(".exe")
        ) {
          possiblePaths.unshift(p); // Add to beginning
        }
      }
    } catch (error) {
      // where command failed, continue with default paths
    }
  } else {
    // Unix-like systems
    possiblePaths.push(
      "/usr/local/bin/protoc",
      "/usr/bin/protoc",
      "/opt/protoc/bin/protoc"
    );

    try {
      const whichOutput = execSync("which protoc", { encoding: "utf8" }).trim();
      if (whichOutput && !whichOutput.includes("node_modules")) {
        possiblePaths.unshift(whichOutput);
      }
    } catch (error) {
      // which command failed, continue with default paths
    }
  }

  // Test each path
  for (const protocPath of possiblePaths) {
    try {
      if (fs.existsSync(protocPath)) {
        execSync(`"${protocPath}" --version`, { stdio: "pipe" });
        logger.success(`Found protoc: ${protocPath}`);
        return protocPath;
      }
    } catch (error) {
      // This path doesn't work, try next
    }
  }

  // Fallback to system protoc (hope it's in PATH)
  try {
    execSync("protoc --version", { stdio: "pipe" });
    logger.success("Using system protoc from PATH");
    return "protoc";
  } catch (error) {
    logger.error("Could not find protoc executable");
    logger.info("Please install protoc:");
    logger.info(
      "   - Windows: Download from https://github.com/protocolbuffers/protobuf/releases"
    );
    logger.info("   - macOS: brew install protobuf");
    logger.info("   - Ubuntu: apt-get install protobuf-compiler");
    process.exit(1);
  }
}

// Generate TypeScript files using the working command format
function generateTypeScript(protocPath) {
  logger.step(4, "Generating TypeScript files...");

  const isWindows = os.platform() === "win32";
  const pluginPath = isWindows
    ? "./node_modules/.bin/protoc-gen-ts_proto.cmd"
    : "./node_modules/.bin/protoc-gen-ts_proto";

  // Check if plugin exists
  const fullPluginPath = path.join(projectRoot, pluginPath);
  if (!fs.existsSync(fullPluginPath)) {
    logger.error(`ts-proto plugin not found at: ${fullPluginPath}`);
    logger.info("Try running: npm install --save-dev ts-proto");
    process.exit(1);
  }

  // Use the working command format from the gateway service
  const command = [
    `"${protocPath}"`,
    `--plugin=protoc-gen-ts_proto=${pluginPath}`,
    `--ts_proto_out=./src/shared/dependencies`,
    `--ts_proto_opt=nestJs=true`,
    `--ts_proto_opt=fileSuffix=.pb`,
    `--ts_proto_opt=outputServices=grpc-js`,
    `--ts_proto_opt=useOptionals=messages`,
    `--ts_proto_opt=snakeToCamel=false`,
    `--proto_path=./src/shared/proto`,
    `./src/shared/proto/*.proto`,
  ].join(" ");

  try {
    logger.info(`Running: ${command}`);
    execSync(command, { cwd: projectRoot, stdio: "inherit" });

    // Check if files were generated
    const generatedFiles = fs
      .readdirSync(targetDepsDir)
      .filter((f) => f.endsWith(".pb.ts"));
    if (generatedFiles.length > 0) {
      logger.success("TypeScript files generated successfully:");
      generatedFiles.forEach((file) => logger.success(`Generated: ${file}`));
    } else {
      logger.warn("No TypeScript files were generated");
    }
  } catch (error) {
    logger.error(`Error generating TypeScript files: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
function main() {
  try {
    copyProtoFiles();
    checkDependencies();
    const protocPath = findProtoc();
    generateTypeScript(protocPath);

    logger.title("🎉 Complete build finished successfully!");
    logger.success(
      `Proto files: ${path.relative(projectRoot, targetProtoDir)}`
    );
    logger.success(
      `Generated files: ${path.relative(projectRoot, targetDepsDir)}`
    );
    logger.info("You can now import the generated types in your services!");
  } catch (error) {
    logger.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

main();
