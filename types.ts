// 📋 Complete TypeScript type definitions for DJENGO Proto Contracts
// Using snake_case to match protobuf convention

// ===============================
// 💬 COMMUNICATION SERVICE TYPES
// ===============================

// Request Types
export interface CreateChatRequest {
  name: string;
  chat_type: ChatType;
  creator_id: string;
  participant_ids: string[];
  avatar_url?: string;
}

export interface GetChatRequest {
  chat_id: string;
  user_id: string;
}

export interface GetUserChatsRequest {
  user_id: string;
  limit?: number;
  offset?: number;
}

export interface UpdateChatRequest {
  chat_id: string;
  user_id: string;
  name?: string;
  avatar_url?: string;
  status?: ChatStatus;
}

export interface DeleteChatRequest {
  chat_id: string;
  user_id: string;
}

export interface SendMessageRequest {
  chat_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  media_urls?: string[];
  file_url?: string;
  file_size?: number;
  file_type?: string;
  duration?: number;
}

export interface GetMessagesRequest {
  chat_id: string;
  user_id: string;
  limit?: number;
  offset?: number;
  before_message_id?: string;
  after_message_id?: string;
}

export interface UpdateMessageRequest {
  message_id: string;
  user_id: string;
  content?: string;
  media_urls?: string[];
}

export interface DeleteMessageRequest {
  message_id: string;
  user_id: string;
}

export interface AddParticipantRequest {
  chat_id: string;
  user_id: string;
  new_participant_id: string;
  is_admin?: boolean;
}

export interface RemoveParticipantRequest {
  chat_id: string;
  user_id: string;
  participant_id: string;
}

export interface GetParticipantsRequest {
  chat_id: string;
  user_id: string;
}

export interface MarkAsReadRequest {
  chat_id: string;
  user_id: string;
  message_ids: string[];
}

export interface GetUnreadCountsRequest {
  user_id: string;
  chat_ids?: string[];
}

export interface ChatEventsRequest {
  user_id: string;
  chat_ids?: string[];
}

// Response Types
export interface ChatResponse {
  success: boolean;
  error?: string;
  chat?: Chat;
}

export interface GetUserChatsResponse {
  success: boolean;
  error?: string;
  chats: ChatWithDetails[];
  total_count: number;
}

export interface DeleteChatResponse {
  success: boolean;
  error?: string;
  chat_id: string;
}

export interface MessageResponse {
  success: boolean;
  error?: string;
  message?: Message;
}

export interface GetMessagesResponse {
  success: boolean;
  error?: string;
  messages: Message[];
  total_count: number;
  next_cursor?: string;
}

export interface DeleteMessageResponse {
  success: boolean;
  error?: string;
  message_id: string;
}

export interface ParticipantResponse {
  success: boolean;
  error?: string;
  participant?: ChatParticipant;
}

export interface GetParticipantsResponse {
  success: boolean;
  error?: string;
  participants: ChatParticipant[];
}

export interface MarkAsReadResponse {
  success: boolean;
  error?: string;
  marked_count: number;
}

export interface GetUnreadCountsResponse {
  success: boolean;
  error?: string;
  unread_counts: UnreadCount[];
}

export interface ChatEventResponse {
  event_type: string;
  chat_id: string;
  message?: Message;
  participant?: ChatParticipant;
  chat?: Chat;
  timestamp: string;
}

// Data Models
export interface Chat {
  chat_id: string;
  name?: string;
  avatar_url?: string;
  chat_type: ChatType;
  status: ChatStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChatWithDetails {
  chat_id: string;
  name?: string;
  avatar_url?: string;
  chat_type: ChatType;
  status: ChatStatus;
  is_admin: boolean;
  joined_at: string;
  last_message?: Message;
  unread_count: number;
  participant_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  media_urls?: string[];
  type: MessageType;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  duration?: number;
  file_url?: string;
  file_size?: number;
  file_type?: string;
}

export interface ChatParticipant {
  chat_id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  is_active: boolean;
  unread_count: number;
}

export interface UnreadCount {
  chat_id: string;
  count: number;
  last_read_at: string;
}

// ========================
// 👤 PROFILE SERVICE TYPES
// ========================

// Request Types
export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface GetUserRequest {
  user_id: string;
}

export interface GetUsersRequest {
  user_ids: string[];
  limit?: number;
  offset?: number;
}

export interface UpdateUserRequest {
  user_id: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status?: UserStatus;
}

export interface DeleteUserRequest {
  user_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  user_id: string;
  access_token: string;
}

export interface UpdateProfileRequest {
  user_id: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  privacy?: UserPrivacy;
}

export interface GetProfileRequest {
  user_id: string;
  requesting_user_id?: string;
}

export interface UploadAvatarRequest {
  user_id: string;
  image_data: Uint8Array;
  content_type: string;
}

export interface GetConnectionsRequest {
  user_id: string;
  limit?: number;
  offset?: number;
}

export interface SearchUsersRequest {
  query: string;
  limit?: number;
  offset?: number;
  status_filter?: UserStatus[];
}

// Response Types
export interface UserResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface GetUsersResponse {
  success: boolean;
  error?: string;
  users: User[];
  total_count: number;
}

export interface DeleteUserResponse {
  success: boolean;
  error?: string;
  user_id: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  expires_in?: number;
}

export interface LogoutResponse {
  success: boolean;
  error?: string;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  error?: string;
  profile?: UserProfile;
}

export interface AvatarResponse {
  success: boolean;
  error?: string;
  avatar_url?: string;
}

export interface GetConnectionsResponse {
  success: boolean;
  error?: string;
  connections: UserConnection[];
  total_count: number;
}

export interface SearchUsersResponse {
  success: boolean;
  error?: string;
  users: User[];
  total_count: number;
}

// Data Models
export interface User {
  user_id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified: boolean;
}

export interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  status: UserStatus;
  privacy: UserPrivacy;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified: boolean;
}

export interface UserConnection {
  user_id: string;
  connected_user_id: string;
  connection_type: ConnectionType;
  created_at: string;
  user: User;
}

// ===============
// 🏷️ ENUM TYPES
// ===============

export enum ChatType {
  DIRECT = 0,
  GROUP = 1,
  CHANNEL = 2,
}

export enum ChatStatus {
  PENDING = 0,
  ACTIVE = 1,
  ARCHIVED = 2,
  DELETED = 3,
}

export enum MessageType {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  FILE = 4,
  VOICE_NOTE = 5,
  SYSTEM = 6,
}

export enum MessageStatus {
  PENDING = 0,
  SENT = 1,
  DELIVERED = 2,
  READ = 3,
  FAILED = 4,
}

export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  SUSPENDED = 2,
  DELETED = 3,
}

export enum UserPrivacy {
  PUBLIC = 0,
  FRIENDS = 1,
  PRIVATE = 2,
}

export enum ConnectionType {
  FRIEND = 0,
  FOLLOWER = 1,
  FOLLOWING = 2,
  BLOCKED = 3,
}
