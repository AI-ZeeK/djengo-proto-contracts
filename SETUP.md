# 🚀 DJENGO Proto Contracts - GitHub Repository Setup

This guide shows you how to set up and use the proto contracts as a GitHub-based npm dependency across your DJENGO microservices.

## 📋 Setup Steps

### 1. Create GitHub Repository

```bash
# 1. Create a new repository on GitHub named: djengo-proto-contracts
# 2. Clone it locally (or push this existing code)
git init
git add .
git commit -m "Initial proto contracts setup"
git remote add origin https://github.com/AI-ZeeK/djengo-proto-contracts.git
git branch -M main
git push -u origin main
```

### 2. Update package.json

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/AI-ZeeK/djengo-proto-contracts.git"
  }
}
```

## 🛠️ Using in Your Microservices

### Installation

In each of your microservices, install the proto contracts:

```bash
# Install from GitHub (latest)
npm install github:AI-ZeeK/djengo-proto-contracts

# Install specific version/tag
npm install github:AI-ZeeK/djengo-proto-contracts#v1.0.0

# Install specific branch
npm install github:AI-ZeeK/djengo-proto-contracts#main
```

### TypeScript Usage Examples

#### 🌐 REST API Gateway Service

```typescript
// src/grpc-clients.ts
import {
  createClient,
  CommunicationServiceClient,
  ProfileServiceClient,
  protoPaths,
} from "@djengo/proto-contracts";

export const grpcClients = {
  communication: createClient(
    "communication",
    "localhost:50051"
  ) as CommunicationServiceClient,
  profile: createClient("profile", "localhost:50052") as ProfileServiceClient,
};

// src/controllers/chat.controller.ts
import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import {
  SendMessageRequest,
  MessageResponse,
  CreateChatRequest,
  ChatResponse,
  MessageType,
} from "@djengo/proto-contracts";
import { grpcClients } from "../grpc-clients";

@Controller("chats")
export class ChatController {
  @Post(":chatId/messages")
  async sendMessage(
    @Param("chatId") chatId: string,
    @Body() body: { content: string; senderId: string }
  ): Promise<MessageResponse> {
    const request: SendMessageRequest = {
      chat_id: chatId,
      sender_id: body.senderId,
      content: body.content,
      type: MessageType.TEXT,
    };

    return new Promise((resolve, reject) => {
      grpcClients.communication.SendMessage(request, (error, response) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }

  @Post()
  async createChat(@Body() body: CreateChatRequest): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      grpcClients.communication.CreateChat(body, (error, response) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  }
}
```

#### 💬 Communication Service Implementation

```typescript
// src/grpc/communication.service.ts
import { Injectable } from "@nestjs/common";
import {
  SendMessageRequest,
  MessageResponse,
  CreateChatRequest,
  ChatResponse,
  MessageType,
  MessageStatus,
} from "@djengo/proto-contracts";

@Injectable()
export class CommunicationGrpcService {
  async SendMessage(request: SendMessageRequest): Promise<MessageResponse> {
    // Your implementation here
    try {
      // Save to database, send notifications, etc.
      const message = {
        message_id: "generated-uuid",
        chat_id: request.chat_id,
        sender_id: request.sender_id,
        content: request.content,
        type: request.type,
        status: MessageStatus.SENT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        success: true,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async CreateChat(request: CreateChatRequest): Promise<ChatResponse> {
    // Implementation for creating chat
    return {
      success: true,
      chat: {
        chat_id: "generated-uuid",
        name: request.name,
        chat_type: request.chat_type,
        status: 0, // PENDING
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}

// src/main.ts
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { protoPaths } from "@djengo/proto-contracts";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "communication",
        protoPath: protoPaths.communication,
        url: "0.0.0.0:50051",
      },
    }
  );

  await app.listen();
  console.log("Communication microservice listening on port 50051");
}
bootstrap();
```

#### 👤 Profile Service Implementation

```typescript
// src/grpc/profile.service.ts
import { Injectable } from "@nestjs/common";
import {
  CreateUserRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
  UserStatus,
} from "@djengo/proto-contracts";

@Injectable()
export class ProfileGrpcService {
  async CreateUser(request: CreateUserRequest): Promise<UserResponse> {
    try {
      // Hash password, save to database, etc.
      const user = {
        user_id: "generated-uuid",
        email: request.email,
        username: request.username,
        first_name: request.first_name,
        last_name: request.last_name,
        avatar_url: request.avatar_url,
        status: UserStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: false,
      };

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async LoginUser(request: LoginRequest): Promise<LoginResponse> {
    // Implementation for user login
    try {
      // Verify credentials, generate JWT, etc.
      return {
        success: true,
        access_token: "generated-jwt-token",
        refresh_token: "generated-refresh-token",
        expires_in: 3600,
        user: {
          user_id: "user-id",
          email: request.email,
          username: "username",
          status: UserStatus.ACTIVE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verified: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }
  }
}
```

### NestJS Module Configuration

```typescript
// src/grpc-client.module.ts
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
          url: process.env.COMMUNICATION_SERVICE_URL || "localhost:50051",
        },
      },
      {
        name: "PROFILE_SERVICE",
        transport: Transport.GRPC,
        options: {
          package: "profile",
          protoPath: protoPaths.profile,
          url: process.env.PROFILE_SERVICE_URL || "localhost:50052",
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}
```

## 🔄 Version Management & Updates

### Publishing New Versions

```bash
# 1. Make changes to proto files or types
# 2. Update version in package.json
npm version patch  # or minor/major

# 3. Commit and tag
git add .
git commit -m "feat: add new message types"
git push

# 4. Create a release tag
git tag v1.1.0
git push origin v1.1.0
```

### Updating in Services

```bash
# Update to latest version
npm update @djengo/proto-contracts

# Update to specific version
npm install github:YOUR_USERNAME/djengo-proto-contracts#v1.1.0

# Check current version
npm list @djengo/proto-contracts
```

## 🏗️ Building Proto Files in Services

Since the proto files will be built in each service, add build scripts to your service's `package.json`:

```json
{
  "scripts": {
    "build:proto": "grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./src/generated --grpc_out=grpc_js:./src/generated --proto_path=./node_modules/@djengo/proto-contracts/proto ./node_modules/@djengo/proto-contracts/proto/*.proto",
    "build:proto:ts": "grpc_tools_node_protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=grpc_js:./src/generated --proto_path=./node_modules/@djengo/proto-contracts/proto ./node_modules/@djengo/proto-contracts/proto/*.proto"
  }
}
```

## 🔧 Development Workflow

1. **Make Changes**: Update proto files or TypeScript types
2. **Test Locally**: Use `npm link` for local testing
3. **Commit & Push**: Push changes to GitHub
4. **Tag Release**: Create version tags for stable releases
5. **Update Services**: Pull latest version in your microservices

## 🚦 Benefits of This Approach

✅ **Centralized Contracts**: Single source of truth for all API definitions  
✅ **Version Control**: Git-based versioning with tags  
✅ **Type Safety**: Full TypeScript support with IntelliSense  
✅ **Easy Updates**: Simple `npm update` to get latest changes  
✅ **No Build Complexity**: Each service builds protos as needed  
✅ **Snake Case Support**: Consistent with protobuf conventions

## 📞 Usage in Different Scenarios

### Express.js REST API

```typescript
import {
  createClient,
  SendMessageRequest,
  MessageType,
} from "@djengo/proto-contracts";

const commClient = createClient("communication", "localhost:50051");

app.post("/api/messages", async (req, res) => {
  const request: SendMessageRequest = {
    chat_id: req.body.chat_id,
    sender_id: req.body.sender_id,
    content: req.body.content,
    type: MessageType.TEXT,
  };

  commClient.SendMessage(request, (error, response) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(response);
  });
});
```

### Direct gRPC Usage

```typescript
import { loadCommunicationProto } from "@djengo/proto-contracts";
import * as grpc from "@grpc/grpc-js";

const proto = loadCommunicationProto();
const client = new (proto as any).communication.CommunicationService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
```

This setup gives you a clean, maintainable way to share proto contracts across all your DJENGO microservices! 🎉
