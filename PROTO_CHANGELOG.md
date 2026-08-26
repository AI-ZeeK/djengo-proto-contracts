# Proto changelog

All `.proto` files in `proto/` are the **single source of truth**. Run `npm run sync:services` from this package (or the shell script) to copy them into each microservice before building.

## Unreleased — Budget currency_code

### `financials.proto`
- `MonthlyBudget.currency_code` (18) — ISO 4217 from branch override or company base (same resolution as payroll)
- `GetBudgetAnalyticsRequest.branch_id` (3) — optional branch scope
- `GetBudgetAnalyticsResponse.currency_code` (4) — display currency for analytics cards/charts

## Unreleased — Facility place roles

### `facility.proto`
- `enum FacilitySpaceUsage` — `BOOKABLE` | `DEPARTMENT` | `OPERATIONAL` (plus unspecified)
- `FacilityNodeMessage.space_usage` (20), `department_id` (21)
- Create/Update facility node requests accept the same fields (department link for hospital dept places)

## 1.2.12 — Ledger filters, payment abandon, facility bulk level counts

### `financials.proto`
- `AdminPlatformTransaction.sender_type` (35), `receiver_type` (36) — ledger party kinds (`USER` | `GUEST` | `COMPANY` | `SYSTEM`)
- `ListAdminPlatformTransactionsRequest.transaction_type_name` (12) — exact type name filter (e.g. `WALLET_FUNDING`)
- `ListAdminPlatformTransactionsRequest.exclude_transaction_type_name` (13) — exclude a type from company activity ledger
- `VerifyGuestInvoicePaymentRequest.abandon` (2) — mark PENDING guest checkout FAILED on cancel
- `VerifyCompanyWalletFundRequest.abandon` (2) — mark PENDING wallet funding FAILED on cancel

### `facility.proto`
- `message FacilityBulkLevelCountOverride` — per-level `facility_node_level_id` + `count_per_parent`
- `StartFacilityBulkCreateRequest.level_counts` (6) — required for custom bulk layouts

## 1.2.11 — Guest stays & bookings (partner occupancy + my bookings)

### `organization.proto`
- `rpc EnsurePartnerForOccupancy` + `EnsurePartnerForOccupancyRequest` — upsert Partner for a profile at a company and assign/create `PARTNER_ROLE` of type `TENANT` | `PATIENT` | `GUEST` (booking confirm path)
- `rpc GetPartnersByProfile` + `GetPartnersByProfileRequest` — cross-company partners linked to a profile (optional `partner_type`, `active_only`)
- `GetPartnersRequest.profile_id` (9) — filter partners by linked profile

### `facility.proto`
- `ListOccupancyStaysRequest.branch_id` — now **optional** when filtering by `partner_id`, `guest_id`, or `profile_id`
- `ListOccupancyStaysRequest.profile_id` (11) — filter stays by participant profile

### `operations.proto`
- `rpc ListMyBookings` + `ListMyBookingsRequest` — guest booking history by `client_user_id` and/or matching contact email/phone (covers `stay_as_guest` / `stay_anonymous`)
- `rpc GetMyBooking` + `GetMyBookingRequest` — single booking with ownership check (linked account or matching contact)

## 1.2.10 — Password create / reset + admin temp password

### `profile.proto`
- `rpc RequestPasswordReset` + `RequestPasswordResetRequest` — email → OTP (`FORGOT_PASSWORD`) + `auth_token`
- `rpc ResetPassword` + `ResetPasswordRequest` — set password with `reset_token` from OTP verify
- `VerifyOtpResponse.reset_token` (7) — issued for `FORGOT_PASSWORD` (no session tokens)
- `rpc AdminSetUserPassword` + `AdminSetUserPasswordRequest` — platform admin sets temp password
- `User.has_password` (20) — whether a usable password hash is set

## 1.2.9 — Payroll finalize / return-to-draft

### `financials.proto`
- `rpc FinalizePayroll` + `FinalizePayrollRequest` — DRAFT → PENDING, start payroll approval chain, lock staff roster
- `rpc ReturnPayrollToDraft` + `ReturnPayrollToDraftRequest` — PENDING → DRAFT only when no approval step has been approved yet
- `ListStaffPayrollForPeriodResponse`: `payroll_id`, `payroll_status`, `approval_instance_id`, `can_edit_staff`
- `ListPayrollSchedulesRequest.payroll_status` (11) — optional filter by payroll status (DRAFT, PENDING, APPROVED, …)

## 1.2.8 — Monthly budget by period (upsert UI)

### `financials.proto`
- `rpc GetMonthlyBudgetByPeriod` + `GetMonthlyBudgetByPeriodRequest` / `GetMonthlyBudgetByPeriodResponse` — single budget for month/year (+ optional branch) including allocations; `budget_found=false` when none
- `MonthlyBudget.branch_id` (11) — optional branch on budget resource

## 1.2.7 — Overview analytics money typing & payroll designation fetch

### `profile.proto`
- `OverviewAnalyticsMeta.currency_code` (4), `exchange_rate` (5) — display currency + USD FX for the overview payload
- `AnalyticsBlock.total` (8), `value_type` (9), `currency_code` (10), `exchange_rate` (11) — distinguish money vs count/percent cards; monetary values in major units
- `rpc GetStaffDesignation` + `GetStaffDesignationRequest` — fetch a single company designation for edit/upsert

### `financials.proto`
- `GetCompanyFinancialOverviewResponse.currency_code` (4), `exchange_rate` (5) — company/branch currency and FX for overview cards

### `facility.proto`
- `rpc GetBranchListingTypes` + `GetBranchListingTypeRequest` / `ListBranchListingType` / `GetBranchListingTypeResponse` — public listing operation kinds for a branch

## 1.2.6 — Reception list pagination meta

### `facility.proto`
- `ListHospitalReceptionResponse.meta` (field 5) — full `TableMeta` for reception boards (hotel/hospital/estate/restaurant)

## 1.2.5 — Occupancy list pagination meta

### `facility.proto`
- `ListOccupancyStaysResponse.meta` (field 5) — full `TableMeta` (`total`, `current_page`, `page_size`, `total_pages`, `next_page`, `prev_page`)
- `message TableMeta` — shared pagination envelope for facility list responses (same shape as operations / org users meta)

### Notes
- `operations.proto` `ListReservationsResponse.meta` / `TableMeta` already include `next_page` / `prev_page`; services should populate the full set.

## 1.2.4 — Public booking notifications & reservation detail enrichment

### `communication.proto`
- `rpc SendBookingMail(SendBookingMailRequest) returns (SendBookingMailResponse)` — guest confirmation + company alert emails
- `rpc SendUserPush(SendUserPushRequest) returns (SendUserPushResponse)` — push to company/reception users
- `enum BookingMailKind` — `BOOKING_MAIL_GUEST_CONFIRMATION`, `BOOKING_MAIL_COMPANY_ALERT`
- Messages: `SendBookingMailRequest/Response`, `SendUserPushRequest/Response`

### `operations.proto`
- `ReservationProto` detail enrichment (filled on `GetReservation`):
  - `facility_node_name` (26), `facility_node_code` (27), `facility_node_type` (28)
  - `location_path` (29), `guest_display_name` (30), `account_display_name` (31)
- `stay_anonymous` (25) on `ReservationProto` / public booking request path
- `CreatePublicBookingRequest.stay_anonymous` / related public booking fields for anonymous stay

## 1.2.3 — Payroll branch scope, company roles, service pricing

### `profile.proto`
- `GetStaffForPayrollRequest.branch_id` (field 10) — optional branch filter for payroll staff lists

### `organization.proto`
- `CompanyRoleService.AssignStaffCompanyRole` — assign staff to a company role (reuses `AssignStaffDepartmentRoleRequest`)

### `operations.proto`
- `CreateCompanyServicesRequest` / `UpdateCompanyServiceRequest`: `branch_ids`, `price_plans`, `promos`
- `CompanyServicePricePlanRequest`, `CompanyServicePromoRequest`, `CompanyServicePricePlanData`, `CompanyServicePromoData`
- `CompanyServiceData`: `price_plans`, `promos`, `branch_ids` — occupant-type pricing, billing period, promotional discounts

### `financials.proto`
- `GetPayrollAnalyticsRequest.branch_id` (field 3)
- `ListPayrollSchedulesRequest`: `branch_id` (8), `month` (9), `year` (10) — branch-scoped payroll schedules
- `ListStaffPayrollForPeriodRequest.branch_id` (field 9)

## 1.2.2 — Phone dial code & shift assignment days

### `profile.proto`
- `User.phone_dial_code` (field 19) — calling code digits only (e.g. `254`), returned on `GetUser` and persisted on `UpdateUser`
- Existing `phone_dial_code` on `UpdateUserRequest`, registration, and lookup messages unchanged

### `organization.proto`
- `Company.phone_dial_code` (field 20)
- `UpdateCompanyDetailsRequest.phone_dial_code` (field 20)

### `events.proto`
- `AssignShiftTemplateRequest.days_of_week` (field 10) — per-assignment weekdays override template schedule
- `UpdateAssignShiftTemplateRequest.days_of_week` (field 10)
- `StaffShiftAssignment.days_of_week` (field 14)
- Related `days_of_week` on shift templates and schedule messages (fields 8–9)

### `facility.proto`
- `ListHospitalReceptionRequest.view` comment — documents `UNITS` filter alias

## 1.2.1 — My assigned tasks (multi-board)

### `events.proto`
- `TaskBoardColumnProto`: `is_done_column`, `board_name`
- `TaskBoardItemProto`: `board_name`, `current_column_name`
- `TaskBoardSummaryProto`, `MyAssignedTasksFilterOption`
- `MyAssignedTasksResponse`: `boards`, `filter_options`, `open_column_ids`, `done_column_ids`

`ListMyAssignedTasks` now returns tasks from **all boards** in company/org scope (not only the default board), with per-board columns for status moves.

## 1.2.0 — Analytics & activity feed

### `profile.proto`
- `rpc GetMyAnalytics(MyAnalyticsRequest) returns (OverviewAnalyticsResponse)`
- `enum AnalyticsScopeLevel` — scope for permission-aware dashboards
- `OverviewAnalyticsRequest` — `branch_id`, `department_id` for scoped overview
- `MyAnalyticsRequest` — personal analytics
- `OverviewAnalyticsMeta` — `effective_scope`, `scope_label`, `visible_domains`
- `OverviewAnalyticsResponse.meta`

### `events.proto`
- `ActivityLogService`: `GetMyActivityFeed`, `MarkActivityRead`, `MarkAllRead`, `GetUnreadCount`, `GetCompanyActivityAnalytics`
- `EventsOverviewService.GetCompanyEventsOverview` — aggregated leave, attendance, HR, activity cards/charts
- Messages: `GetMyActivityFeedRequest`, `MarkAllReadRequest`, `UnreadCountResponse`, `GetCompanyEventsOverviewRequest/Response`, `GetCompanyActivityAnalyticsRequest/Response`

### `financials.proto`
- `rpc GetCompanyFinancialOverview` — dashboard cards/charts for company financial overview

### `comms.proto`
- `NotificationData.message_id`
- Approval notification types (`APPROVAL_PENDING`, etc.)
- `NotificationCategory`, `NotificationPresentation`, tags/attachments (rich notifications)

## Workflow

1. Edit protos in `djengo-proto-contracts/proto/`
2. `npm run sync:services` (from `backend/djengo-proto-contracts`)
3. Commit & push **djengo-proto-contracts** (GitHub: `AI-ZeeK/djengo-proto-contracts`)
4. In each NestJS service: `npm run proto:setup` (or `proto:build-all`) then `npm run proto:generate && npm run proto:patch`
5. In each C# service: `dotnet build` (regenerates gRPC from `protos/`)
