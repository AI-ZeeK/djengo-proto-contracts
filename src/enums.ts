/**
 * User roles in the system
 */
export enum UserRole {
  PLATFORM_USER = "PLATFORM_USER",
  BUSINESS_USER = "BUSINESS_USER",
  PLATFORM = "PLATFORM",
  CLIENT = "CLIENT",
  BRANCH = "BRANCH",
  STAFF = "STAFF",
  AGENCY = "AGENCY",
}


 * Base organization roles
 */
export enum OrganizationRole {
  CREATOR = "CREATOR",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

/**
 * Address types in the system
 */
export enum AddressType {
  USER_HOME = "user_home",
  USER_WORK = "user_work",
  BUSINESS_PRIMARY = "business_primary",
  BUSINESS_BRANCH = "business_branch",
  CALENDAR_EVENT = "calendar_event",
  SERVICE_AREA = "service_area",
  ORDER_DELIVERY = "order_delivery",
  TRAINING_VENUE = "training_venue",
  INSTRUCTOR_LOCATION = "instructor_location",
  BILLING_ADDRESS = "billing_address",
  BANK_BRANCH = "bank_branch",
  MANUFACTURER_LOCATION = "manufacturer_location",
  SUPPLIER_LOCATION = "supplier_location",
  WAREHOUSE_LOCATION = "warehouse_location",
  STORAGE_LOCATION = "storage_location",
}

/**
 * File entity types
 */
export enum FileEntityType {
  USER_AVATAR = "user_avatar",
  ORGANIZATION_LOGO = "organization_logo",
  BUSINESS_LOGO = "business_logo",
  PRODUCT_IMAGE = "product_image",
  DOCUMENT = "document",
}

/**
 * Email types
 */
export enum EmailType {
  WELCOME = "welcome",
  VERIFICATION = "verification",
  PASSWORD_RESET = "password_reset",
  OTP = "otp",
  NOTIFICATION = "notification",
}

/**
 * Notification types
 */
export enum NotificationType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
}

/**
 * OTP types
 */
export enum OtpType {
  SIGNIN = "signin",
  REGISTRATION = "registration",
  PASSWORD_RESET = "password_reset",
  EMAIL_VERIFICATION = "email_verification",
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
  BLOCKED = "blocked",
}

/**
 * Business user permissions
 */
export enum BusinessUserPermission {
  VIEW_DASHBOARD = "BUSINESS_USER_VIEW_DASHBOARD",
  MANAGE_ORGANIZATION = "BUSINESS_USER_MANAGE_ORGANIZATION",
  VIEW_COMPANIES = "BUSINESS_USER_VIEW_COMPANIES",
  MANAGE_COMPANIES = "BUSINESS_USER_MANAGE_COMPANIES",
  VIEW_BRANCHES = "BUSINESS_USER_VIEW_BRANCHES",
  MANAGE_BRANCHES = "BUSINESS_USER_MANAGE_BRANCHES",
  RESTRICT_BRANCH_ACCESS = "BUSINESS_USER_RESTRICT_BRANCH_ACCESS",
  VIEW_STAFF = "BUSINESS_USER_VIEW_STAFF",
  MANAGE_STAFF = "BUSINESS_USER_MANAGE_STAFF",
  VIEW_FINANCES = "BUSINESS_USER_VIEW_FINANCES",
  MANAGE_FINANCES = "BUSINESS_USER_MANAGE_FINANCES",
}

/**
 * Staff permissions
 */
export enum StaffPermission {
  VIEW_DASHBOARD = "STAFF_VIEW_DASHBOARD",
  MANAGE_PROFILE = "STAFF_MANAGE_PROFILE",
  VIEW_PROFILE = "STAFF_VIEW_PROFILE",
  MANAGE_SCHEDULE = "STAFF_MANAGE_SCHEDULE",
  VIEW_SCHEDULE = "STAFF_VIEW_SCHEDULE",
  MANAGE_TIME = "STAFF_MANAGE_TIME",
  ACCESS_BRANCH = "STAFF_ACCESS_BRANCH",
  MANAGE_BRANCH = "STAFF_MANAGE_BRANCH",
}

/**
 * Permission restrictions
 */
export enum PermissionRestriction {
  RESTRICT_BRANCH_ACCESS = "RESTRICT_BRANCH_ACCESS",
  RESTRICT_PAGE_ACCESS = "RESTRICT_PAGE_ACCESS",
  RESTRICT_GLOBAL_PERMISSIONS = "RESTRICT_GLOBAL_PERMISSIONS",
  RESTRICT_PAYROLL_ACCESS = "RESTRICT_PAYROLL_ACCESS",
  RESTRICT_PAYROLL_APPROVAL = "RESTRICT_PAYROLL_APPROVAL",
  RESTRICT_PAYROLL_MANAGEMENT = "RESTRICT_PAYROLL_MANAGEMENT",
  RESTRICT_FUND_MANAGEMENT = "RESTRICT_FUND_MANAGEMENT",
  RESTRICT_FUND_APPROVAL = "RESTRICT_FUND_APPROVAL",
}
