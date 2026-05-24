# Proto changelog

All `.proto` files in `proto/` are the **single source of truth**. Run `npm run sync:services` from this package (or the shell script) to copy them into each microservice before building.

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
