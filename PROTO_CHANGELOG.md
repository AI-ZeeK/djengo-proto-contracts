# Proto changelog

All `.proto` files in `proto/` are the **single source of truth**. Run `npm run sync:services` from this package (or the shell script) to copy them into each microservice before building.

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
