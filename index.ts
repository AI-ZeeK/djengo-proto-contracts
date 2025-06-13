// 📦 DJENGO Proto Contracts - Shared gRPC definitions
// Main entry point for importing protobuf definitions

import * as path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

// Export all type definitions
export * from "./types";

// Export TypeScript enums for use across microservices
export * from "./scripts/enum";

// Import specific types for better intellisense
import {
  CreateChatRequest,
  ChatResponse,
  SendMessageRequest,
  MessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  CreateUserRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
  ChatType,
  MessageType,
  UserStatus,
} from "./types";

// 🏷️ Type definitions for proto enums (legacy compatibility)
export interface ProtoEnums {
  ChatType: {
    DIRECT: number;
    GROUP: number;
    CHANNEL: number;
  };
  ChatStatus: {
    PENDING: number;
    ACTIVE: number;
    ARCHIVED: number;
    DELETED: number;
  };
  MessageType: {
    TEXT: number;
    IMAGE: number;
    VIDEO: number;
    AUDIO: number;
    FILE: number;
    VOICE_NOTE: number;
    SYSTEM: number;
  };
  MessageStatus: {
    PENDING: number;
    SENT: number;
    DELIVERED: number;
    READ: number;
    FAILED: number;
  };
  UserStatus: {
    ACTIVE: number;
    INACTIVE: number;
    SUSPENDED: number;
    DELETED: number;
  };
  UserPrivacy: {
    PUBLIC: number;
    FRIENDS: number;
    PRIVATE: number;
  };
  ConnectionType: {
    FRIEND: number;
    FOLLOWER: number;
    FOLLOWING: number;
    BLOCKED: number;
  };
}

// 🏗️ Type-safe gRPC client interfaces
export interface CommunicationServiceClient extends grpc.Client {
  CreateChat: (
    request: CreateChatRequest,
    callback: grpc.requestCallback<ChatResponse>
  ) => void;
  GetChat: (request: any, callback: grpc.requestCallback<ChatResponse>) => void;
  GetUserChats: (request: any, callback: grpc.requestCallback<any>) => void;
  UpdateChat: (
    request: any,
    callback: grpc.requestCallback<ChatResponse>
  ) => void;
  DeleteChat: (request: any, callback: grpc.requestCallback<any>) => void;
  SendMessage: (
    request: SendMessageRequest,
    callback: grpc.requestCallback<MessageResponse>
  ) => void;
  GetMessages: (
    request: GetMessagesRequest,
    callback: grpc.requestCallback<GetMessagesResponse>
  ) => void;
  UpdateMessage: (
    request: any,
    callback: grpc.requestCallback<MessageResponse>
  ) => void;
  DeleteMessage: (request: any, callback: grpc.requestCallback<any>) => void;
  AddParticipant: (request: any, callback: grpc.requestCallback<any>) => void;
  RemoveParticipant: (
    request: any,
    callback: grpc.requestCallback<any>
  ) => void;
  GetParticipants: (request: any, callback: grpc.requestCallback<any>) => void;
  MarkMessagesAsRead: (
    request: any,
    callback: grpc.requestCallback<any>
  ) => void;
  GetUnreadCounts: (request: any, callback: grpc.requestCallback<any>) => void;
  GetChatEvents: (request: any, callback: grpc.requestCallback<any>) => void;
}

export interface ProfileServiceClient extends grpc.Client {
  CreateUser: (
    request: CreateUserRequest,
    callback: grpc.requestCallback<UserResponse>
  ) => void;
  GetUser: (request: any, callback: grpc.requestCallback<UserResponse>) => void;
  GetUsers: (request: any, callback: grpc.requestCallback<any>) => void;
  UpdateUser: (
    request: any,
    callback: grpc.requestCallback<UserResponse>
  ) => void;
  DeleteUser: (request: any, callback: grpc.requestCallback<any>) => void;
  LoginUser: (
    request: LoginRequest,
    callback: grpc.requestCallback<LoginResponse>
  ) => void;
  RefreshToken: (
    request: any,
    callback: grpc.requestCallback<LoginResponse>
  ) => void;
  LogoutUser: (request: any, callback: grpc.requestCallback<any>) => void;
  UpdateProfile: (request: any, callback: grpc.requestCallback<any>) => void;
  GetProfile: (request: any, callback: grpc.requestCallback<any>) => void;
  UploadAvatar: (request: any, callback: grpc.requestCallback<any>) => void;
  GetUserConnections: (
    request: any,
    callback: grpc.requestCallback<any>
  ) => void;
  SearchUsers: (request: any, callback: grpc.requestCallback<any>) => void;
}

// 🔧 Default proto loader options
const defaultOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

/**
 * 💬 Load Communication Service proto definitions
 * @param options - Proto loader options
 * @returns Communication service definitions
 */
export function loadCommunicationProto(
  options: protoLoader.Options = defaultOptions
): grpc.GrpcObject {
  const protoPath = path.join(__dirname, "proto", "communication.proto");
  const packageDefinition = protoLoader.loadSync(protoPath, options);
  return grpc.loadPackageDefinition(packageDefinition);
}

/**
 * 👤 Load Profile Service proto definitions
 * @param options - Proto loader options
 * @returns Profile service definitions
 */
export function loadProfileProto(
  options: protoLoader.Options = defaultOptions
): grpc.GrpcObject {
  const protoPath = path.join(__dirname, "proto", "profile.proto");
  const packageDefinition = protoLoader.loadSync(protoPath, options);
  return grpc.loadPackageDefinition(packageDefinition);
}

/**
 * 🚀 Load all proto definitions
 * @param options - Proto loader options
 * @returns All service definitions
 */
export function loadAllProtos(options: protoLoader.Options = defaultOptions): {
  communication: grpc.GrpcObject;
  profile: grpc.GrpcObject;
} {
  return {
    communication: loadCommunicationProto(options),
    profile: loadProfileProto(options),
  };
}

/**
 * 🛠️ Create gRPC client for a service
 * @param serviceName - Name of the service ('communication' or 'profile')
 * @param serviceUrl - URL of the service (e.g., 'localhost:50051')
 * @param credentials - gRPC credentials (optional)
 * @param options - Proto loader options (optional)
 * @returns gRPC client instance
 */
export function createClient(
  serviceName: "communication",
  serviceUrl: string,
  credentials?: grpc.ChannelCredentials,
  options?: protoLoader.Options
): CommunicationServiceClient;
export function createClient(
  serviceName: "profile",
  serviceUrl: string,
  credentials?: grpc.ChannelCredentials,
  options?: protoLoader.Options
): ProfileServiceClient;
export function createClient(
  serviceName: "communication" | "profile",
  serviceUrl: string,
  credentials: grpc.ChannelCredentials = grpc.credentials.createInsecure(),
  options: protoLoader.Options = defaultOptions
): CommunicationServiceClient | ProfileServiceClient {
  let serviceDefinition: any;

  switch (serviceName.toLowerCase()) {
    case "communication":
      const commProto = loadCommunicationProto(options) as any;
      serviceDefinition = commProto.communication.CommunicationService;
      break;
    case "profile":
      const profileProto = loadProfileProto(options) as any;
      serviceDefinition = profileProto.profile.ProfileService;
      break;
    default:
      throw new Error(`Unknown service: ${serviceName}`);
  }

  return new serviceDefinition(serviceUrl, credentials);
}

// 📁 Export proto file paths for direct access
export const protoPaths = {
  communication: path.join(__dirname, "proto", "communication.proto"),
  profile: path.join(__dirname, "proto", "profile.proto"),
};

// 🏷️ Export enums for easy access (legacy compatibility)
export const enums: ProtoEnums = {
  ChatType: {
    DIRECT: 0,
    GROUP: 1,
    CHANNEL: 2,
  },
  ChatStatus: {
    PENDING: 0,
    ACTIVE: 1,
    ARCHIVED: 2,
    DELETED: 3,
  },
  MessageType: {
    TEXT: 0,
    IMAGE: 1,
    VIDEO: 2,
    AUDIO: 3,
    FILE: 4,
    VOICE_NOTE: 5,
    SYSTEM: 6,
  },
  MessageStatus: {
    PENDING: 0,
    SENT: 1,
    DELIVERED: 2,
    READ: 3,
    FAILED: 4,
  },
  UserStatus: {
    ACTIVE: 0,
    INACTIVE: 1,
    SUSPENDED: 2,
    DELETED: 3,
  },
  UserPrivacy: {
    PUBLIC: 0,
    FRIENDS: 1,
    PRIVATE: 2,
  },
  ConnectionType: {
    FRIEND: 0,
    FOLLOWER: 1,
    FOLLOWING: 2,
    BLOCKED: 3,
  },
};

// 🔧 Re-export utilities for convenience
export { grpc, protoLoader, defaultOptions };

// 📦 Default export for CommonJS compatibility
export default {
  loadCommunicationProto,
  loadProfileProto,
  loadAllProtos,
  createClient,
  protoPaths,
  enums,
  defaultOptions,
  grpc,
  protoLoader,
};
