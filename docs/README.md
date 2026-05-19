# djengo-proto-contracts

## Purpose

The `@djengo/proto-contracts` package is the single source of truth for all gRPC service definitions in Djengo. It contains `.proto` files and their generated TypeScript type stubs. Every NestJS service imports this package to get type-safe gRPC client and server implementations.

## What It Contains

```
proto/
├── profile.proto       # ProfileService — auth, staff, invitations, analytics
├── organization.proto  # OrganizationService — orgs, companies, branches, departments, roles
├── address.proto       # AddressService — address CRUD for any entity
├── files.proto         # FilesService — file upload, metadata
├── communication.proto # CommunicationService — email, push notifications
├── comms.proto         # CommsService (C# variant) — communications
├── events.proto        # All Events services — attendance, leave, approvals, shifts, etc.
├── financials.proto    # All Financials services — payroll, budgets, procurement, etc.
├── operations.proto    # All Operations services — orders, kitchen, feedback, incidents
└── admin.proto         # AdminService — platform admin

src/                    # Generated TypeScript stubs
types.ts                # Shared type definitions
index.ts                # Package exports
```

## Key Services in Each Proto

### `profile.proto`
- `ProfileService` — register, login, OTP, refresh token, logout, validate account, get/update user, staff CRUD, invitations, bulk invite, payroll staff, analytics

### `events.proto`
- `ApprovalChainService` — approval chain template management
- `ApprovalService` — live approval instance lifecycle
- `AttendanceService` — clock in/out, session status, attendance listing
- `AttendanceCodeService` — attendance code management
- `BusinessHoursService` — company business hours
- `CalendarEventService` — calendar CRUD with recurrence
- `ComplaintService` + `ComplaintCategoryService` — complaint management
- `DisciplinaryService` — disciplinary records
- `EmploymentContractService` — contract lifecycle
- `LeaveService` — request, balance, policy, analytics
- `PerformanceReviewService` — review lifecycle
- `ShiftTemplateService` — shift template CRUD
- `StaffDocumentService` — document metadata
- `TaskBoardService` + `TaskService` — task management
- `HrService` + `HrAnalyticsService` — HR data and analytics

### `financials.proto`
- `EventLogService` — financial audit log
- `ApprovalChainService` — financial approvals (payroll, budget)
- `PayrollService` — payroll schedule/run lifecycle
- `BudgetService` — monthly budgets and allocations
- `InventoryService` — inventory tracking
- `ProcurementService` — purchase requests
- `GuestBillingService` — guest charges
- `StatutoryRemittanceService` — tax/statutory payments
- `FacilityAssetService` — asset registry
- `WalletService` — internal wallets
- `FinancialAnalyticsService` — financial reporting
- `CountriesService` — country/currency utilities

### `operations.proto`
- `OperationService` — company services, business types, service types, utility data
- `OrderService` — order lifecycle
- `KitchenService` — kitchen ticket management
- `GuestFeedbackService` — ratings and responses
- `IncidentService` — incident tracking

## Usage

```typescript
// In a NestJS service
import { ProfileServiceClient } from '@djengo/proto-contracts';

// In a proto file (reference)
import 'google/protobuf/empty.proto';
import 'google/protobuf/struct.proto';
import 'google/protobuf/timestamp.proto';
```

## Maintenance

When a new RPC is added to any service:
1. Add it to the relevant `.proto` file in `proto/`
2. Run the build to regenerate TypeScript stubs: `node build.js`
3. Publish a new package version
4. Update the package in all consuming services

> ⚠️ Currently, proto files are also manually copied into each service's `src/shared/proto/` directory. This duplication is a known maintenance risk — the package should be the canonical source, and services should reference it via the npm package, not a local copy.
