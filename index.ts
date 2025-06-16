// 📦 DJENGO Proto Contracts - Shared gRPC definitions
// Main entry point for importing protobuf definitions

// Export all type definitions
export * from "./types";

// Export TypeScript enums for use across microservices
export * from "./scripts/enum";

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

// 🏗️ Type-safe gRPC client interfaces (types only, not runtime loading)
export type CommunicationServiceClient = any;
export type ProfileServiceClient = any;

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
