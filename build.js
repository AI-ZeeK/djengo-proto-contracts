// build.js
const { execSync } = require('child_process');
const path = require('path');

const outDir = process.env.PROTO_OUT || process.argv[2] || 'dist';
const protoDir = path.join(__dirname, 'proto');

console.log(`Generating protos to: ${outDir}`);

execSync(
  `npx grpc_tools_node_protoc --proto_path=${protoDir} --js_out=import_style=commonjs,binary:${outDir} --grpc_out=${outDir} ${protoDir}/*.proto`,
  { stdio: 'inherit' }
);
