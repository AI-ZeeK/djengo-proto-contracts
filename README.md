# 📦 DJENGO Proto Contracts

Shared gRPC protobuf definitions for DJENGO microservices architecture with full TypeScript support.

## 🚀 Overview

This package contains all the gRPC service definitions, message types, and enums used across the DJENGO microservices ecosystem. It ensures consistent API contracts between services and enables type-safe communication with full TypeScript intellisense.

## 🏗️ Services Included

- **💬 Communication Service** - Chat, messaging, and real-time communication
- **👤 Profile Service** - User profiles, authentication, and user management

## 📦 Installation

### From GitHub (Recommended)

```bash
# Install directly from GitHub repository
npm install github:AI-ZeeK/djengo-proto-contracts

# Or with specific version/tag
npm install github:AI-ZeeK/djengo-proto-contracts#v1.0.0
```

### Local Development

```bash
# Clone and link for local development
git clone https://github.com/AI-ZeeK/djengo-proto-contracts.git
cd djengo-proto-contracts
npm install
npm run build
npm link

# In your service directory
npm link @djengo/proto-contracts
```

## 🛠️ Usage

### TypeScript Import (Recommended)

```typescript
import {
  loadCommunicationProto,
  createClient,
  enums,
  CommunicationServiceClient,
  ProfileServiceClient,
} from "@djengo/proto-contracts";

// Load proto definitions
const proto = loadCommunicationProto();

// Create gRPC client with full type safety
const communicationClient = createClient(
  "communication",
  "localhost:50051"
) as CommunicationServiceClient;
```

### CommonJS Import

```javascript
const {
  loadCommunicationProto,
  createClient,
  enums,
} = require("@djengo/proto-contracts");

// Create gRPC client
const communicationClient = createClient("communication", "localhost:50051");
```

### 💬 Communication Service Example

```typescript
import {
  createClient,
  enums,
  CommunicationServiceClient,
} from "@djengo/proto-contracts";

// Create client with type safety
const commClient = createClient(
  "communication",
  "localhost:50051"
) as CommunicationServiceClient;

// Send a message with full type checking
const request = {
  chat_id: "some-chat-id",
  sender_id: "user-id",
  content: "Hello World!",
  type: enums.MessageType.TEXT,
};

commClient.SendMessage(request, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Message sent:", response.message);
  }
});

// Promise-based async/await version
async function sendMessage() {
  try {
    const response = await new Promise((resolve, reject) => {
      commClient.SendMessage(request, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    console.log("Message sent:", response.message);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### 👤 Profile Service Example

```typescript
import {
  createClient,
  enums,
  ProfileServiceClient,
} from "@djengo/proto-contracts";

// Create client with type safety
const profileClient = createClient(
  "profile",
  "localhost:50052"
) as ProfileServiceClient;

// Get user profile
const request = {
  user_id: "user-123",
  requesting_user_id: "requester-456",
};

profileClient.GetProfile(request, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Profile:", response.profile);
  }
});
```

### 🏷️ Using Enums with TypeScript

```typescript
import { enums, ProtoEnums } from "@djengo/proto-contracts";

// Full type safety for enums
const messageType: number = enums.MessageType.TEXT; // 0
const chatType: number = enums.ChatType.GROUP; // 1
const userStatus: number = enums.UserStatus.ACTIVE; // 0

// Type-safe enum checking
function handleMessageType(type: keyof ProtoEnums["MessageType"]) {
  switch (type) {
    case "TEXT":
      return enums.MessageType.TEXT;
    case "IMAGE":
      return enums.MessageType.IMAGE;
    // TypeScript will enforce all cases
  }
}
```

## 🔧 Advanced Usage

### Custom Proto Loading Options

```typescript
import { loadCommunicationProto, protoLoader } from "@djengo/proto-contracts";

const customOptions: protoLoader.Options = {
  keepCase: false,
  longs: Number,
  enums: Number,
  defaults: false,
  oneofs: false,
};

const proto = loadCommunicationProto(customOptions);
```

### Direct Proto File Access

```typescript
import { protoPaths, grpc, protoLoader } from "@djengo/proto-contracts";

console.log(protoPaths.communication); // Path to communication.proto
console.log(protoPaths.profile); // Path to profile.proto

// Use with other gRPC libraries
const packageDefinition = protoLoader.loadSync(protoPaths.communication);
const proto = grpc.loadPackageDefinition(packageDefinition);
```

### Load All Services

```typescript
import { loadAllProtos } from "@djengo/proto-contracts";

const allProtos = loadAllProtos();

// Access services with type safety
const commService = (allProtos.communication as any).communication
  .CommunicationService;
const profileService = (allProtos.profile as any).profile.ProfileService;
```

## 🌐 NestJS Integration

### Install in NestJS Service

```bash
npm install @djengo/proto-contracts @grpc/grpc-js @grpc/proto-loader
```

### Create gRPC Client Module

```typescript
// grpc-client.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { protoPaths } from "@djengo/proto-contracts";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "COMMUNICATION_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "communication",
          protoPath: protoPaths.communication,
          url: "localhost:50051",
        },
      },
      {
        name: "PROFILE_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "profile",
          protoPath: protoPaths.profile,
          url: "localhost:50052",
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}
```

### Use in Service with TypeScript

```typescript
// chat.service.ts
import { Injectable, Inject } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { enums } from "@djengo/proto-contracts";

interface CommunicationService {
  sendMessage(data: SendMessageRequest): Observable<MessageResponse>;
  getMessages(data: GetMessagesRequest): Observable<GetMessagesResponse>;
}

interface SendMessageRequest {
  chat_id: string;
  sender_id: string;
  content: string;
  type: number;
}

interface MessageResponse {
  success: boolean;
  error?: string;
  message?: any;
}

interface GetMessagesRequest {
  chat_id: string;
  user_id: string;
  limit?: number;
  offset?: number;
}

interface GetMessagesResponse {
  success: boolean;
  error?: string;
  messages: any[];
  total_count: number;
}

@Injectable()
export class ChatService {
  private communicationService: CommunicationService;

  constructor(@Inject("COMMUNICATION_SERVICE") private client: ClientGrpc) {}

  onModuleInit() {
    this.communicationService = this.client.getService<CommunicationService>(
      "CommunicationService"
    );
  }

  async sendMessage(messageData: SendMessageRequest): Promise<MessageResponse> {
    return this.communicationService
      .sendMessage({
        ...messageData,
        type: enums.MessageType.TEXT, // Type-safe enum usage
      })
      .toPromise();
  }

  async getMessages(
    chatId: string,
    userId: string
  ): Promise<GetMessagesResponse> {
    return this.communicationService
      .getMessages({
        chat_id: chatId,
        user_id: userId,
        limit: 50,
      })
      .toPromise();
  }
}
```

## 📁 Project Structure

```
djengo-proto-contracts/
├── src/
│   └── index.ts                # TypeScript main entry point
├── proto/
│   ├── communication.proto     # Communication service definitions
│   └── profile.proto          # Profile service definitions
├── dist/                      # Generated JavaScript and type definitions
│   ├── index.js              # Compiled JavaScript
│   ├── index.d.ts            # TypeScript declarations
│   └── ...                   # Other compiled assets
├── package.json              # Package configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🔄 Development & Building

### Build the Package

```bash
# Install dependencies
npm install

# Build proto files and TypeScript
npm run build

# Watch mode for development
npm run dev
```

### Version Management

```bash
# Update version
npm version patch  # or minor/major

# Build and publish
npm run build
npm publish
```

## 🚀 Integration Examples

### Gateway Service (Express + TypeScript)

```typescript
import express from "express";
import {
  createClient,
  enums,
  CommunicationServiceClient,
  ProfileServiceClient,
} from "@djengo/proto-contracts";

const app = express();

// Create clients with full type safety
const clients = {
  communication: createClient(
    "communication",
    process.env.COMM_SERVICE_URL || "localhost:50051"
  ) as CommunicationServiceClient,
  profile: createClient(
    "profile",
    process.env.PROFILE_SERVICE_URL || "localhost:50052"
  ) as ProfileServiceClient,
};

// Use in REST endpoints with type checking
app.post("/api/chats/:chatId/messages", async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      clients.communication.SendMessage(
        {
          chat_id: req.params.chatId,
          sender_id: req.user.id,
          content: req.body.content,
          type: req.body.type || enums.MessageType.TEXT,
        },
        (error, response) => {
          if (error) reject(error);
          else resolve(response);
        }
      );
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("API Gateway running on port 3001");
});
```

### Microservice Implementation (TypeScript)

```typescript
import * as grpc from "@grpc/grpc-js";
import { loadCommunicationProto } from "@djengo/proto-contracts";

const proto = loadCommunicationProto();

// Implement service with type safety
const server = new grpc.Server();

server.addService((proto as any).communication.CommunicationService.service, {
  SendMessage: (call: any, callback: any) => {
    // Your implementation with full type checking
    const response = {
      success: true,
      message: {
        message_id: "generated-id",
        content: call.request.content,
        sender_id: call.request.sender_id,
        chat_id: call.request.chat_id,
        type: call.request.type,
        created_at: new Date().toISOString(),
        // ... other fields
      },
    };
    callback(null, response);
  },

  GetMessages: (call: any, callback: any) => {
    // Implementation for getting messages
    const response = {
      success: true,
      messages: [],
      total_count: 0,
    };
    callback(null, response);
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Communication service running on port 50051");
    server.start();
  }
);
```

## 🛡️ Security

All services should implement proper authentication and authorization. The proto definitions include user_id fields for access control.

## 🔧 TypeScript Configuration

This package is built with TypeScript and provides full type definitions. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 📝 Contributing

1. Update proto files in `proto/` directory
2. Update TypeScript types in `src/index.ts` if needed
3. Test with your services
4. Run `npm run build` to ensure everything compiles
5. Update version in `package.json`
6. Create pull request
7. After merge, publish new version

## 📄 License

MIT License - see LICENSE file for details.
