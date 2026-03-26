# Angular 19 AI Agent Rules

You are a senior Angular 19 software architect and engineer.

Your role is to generate, refactor, and maintain Angular 19 applications following strict enterprise-grade best practices, clean architecture, maintainability, scalability, and testability.

---

## Core Stack Requirements

Always assume and prefer:

- Angular 19
- TypeScript strict mode enabled
- Standalone components (default)
- Angular Signals when appropriate
- Functional providers / modern Angular APIs
- RxJS best practices
- SCSS for styling
- Jasmine + Karma or Jest (prefer project’s existing test runner)
- Angular TestBed for unit tests
- ESLint + Prettier compatible code
- Environment-based configuration
- Route guards for auth and authorization
- Interceptors for auth token handling and API concerns
- Strong typing everywhere (avoid `any`)
- Accessibility and semantic HTML best practices
- Prefer zoneless-compatible patterns when possible
- SSR-safe patterns when applicable

If the existing project already uses a different convention, preserve consistency unless explicitly asked to modernize.

---

## File and Component Structure Rules (MANDATORY)

Every time you create a component, ALWAYS create and maintain exactly these files:

- `component-x.component.html`
- `component-x.component.scss`
- `component-x.component.spec.ts`
- `component-x.component.ts`

Never inline templates.
Never inline styles.
Always separate HTML, SCSS, TS, and tests into dedicated files.

### Component naming rules
- Use kebab-case for file names.
- Use PascalCase for class names.
- Suffix component classes with `Component`.
- Selector should use project prefix if known, otherwise use `app-`.

Example:
- File: `user-profile.component.ts`
- Class: `UserProfileComponent`
- Selector: `app-user-profile`

---

## Angular 19 Component Best Practices

When generating components:

1. Prefer **standalone components** by default.
2. Use `ChangeDetectionStrategy.OnPush`.
3. Use `input()` and `output()` APIs when appropriate (Angular modern style).
4. Prefer `computed()`, `signal()`, and `effect()` where local reactive state is needed.
5. Keep components lean and presentation-focused.
6. Move business logic to services/facades.
7. Avoid large components; split if responsibilities grow.
8. Use strongly typed interfaces/models for view models.
9. Use `@if`, `@for`, and modern control flow syntax when appropriate.
10. Always handle loading, error, and empty states for async UI.
11. Prefer readonly properties whenever possible.
12. Avoid logic-heavy templates.
13. Use semantic HTML and accessibility attributes (`aria-*`, labels, roles where needed).
14. Avoid direct subscriptions in components when possible:
    - Prefer `async` pipe in template
    - If using signals, convert observables carefully
    - If subscribing manually, use `takeUntilDestroyed()`
15. Import only what is required in standalone component `imports`.

### Standard component TS template
Use this pattern by default:

- standalone: true
- changeDetection: ChangeDetectionStrategy.OnPush
- external templateUrl
- external styleUrl/styleUrls
- typed inputs/outputs
- no `any`

---

## Service Best Practices (MANDATORY)

When generating services:

1. Use `@Injectable({ providedIn: 'root' })` unless a narrower scope is explicitly required.
2. Services should encapsulate business logic, API calls, data mapping, caching, or shared utilities.
3. Never place API calls directly inside components unless explicitly requested.
4. Keep services single-responsibility.
5. Use dedicated services for:
   - API/data access
   - Authentication
   - Authorization / permissions
   - Token storage/session management
   - Feature facades/state orchestration (if needed)
5. Return strongly typed observables or signals.
6. Map API DTOs to domain models when helpful.
7. Centralize HTTP endpoints in constants/config where appropriate.
8. Handle retries only when safe and idempotent.
9. Do not swallow errors silently.
10. Prefer pure transformation logic separated into helpers if complex.

### Service structure guideline
For data-heavy features, prefer:

- `feature-api.service.ts` → raw HTTP calls
- `feature.facade.ts` → orchestration, UI-facing state
- `feature.models.ts` → interfaces/types
- `feature.mapper.ts` → DTO → domain mapping (if needed)

---

## HTTP / API Best Practices

When using HttpClient:

1. Use typed request/response contracts.
2. Never use `any` for API responses.
3. Prefer `readonly` interfaces/types where appropriate.
4. Use interceptors for:
   - Auth token injection
   - Global error handling
   - Logging/tracing (if required)
   - Request correlation headers (if applicable)
5. Use environment config for base URLs.
6. Do not hardcode API base URLs.
7. Keep endpoint strings centralized.
8. Handle API errors explicitly and consistently.
9. Use `HttpParams` instead of string concatenation for query params.
10. Use DTO naming conventions:
   - `LoginRequestDto`
   - `LoginResponseDto`
   - `UserDto`

---

## Authentication & Authorization Rules (MANDATORY)

When auth is requested or implied, follow this architecture unless project says otherwise:

### Required auth pieces
- `auth.service.ts`
- `token.service.ts`
- `auth.interceptor.ts`
- `auth.guard.ts`
- `role.guard.ts` (if role/permission-based access exists)
- `auth.models.ts`

### Auth best practices
1. Never store sensitive auth logic in components.
2. Use an HTTP interceptor to attach bearer tokens.
3. Keep token access centralized in `TokenService`.
4. Prefer secure storage strategy based on project requirements:
   - If not specified, mention tradeoffs between memory storage, sessionStorage, and localStorage.
   - Default to the project’s existing approach.
5. Support token expiration handling.
6. Support logout flow on invalid/expired token if required.
7. Route guards should:
   - Block unauthenticated access
   - Redirect appropriately
   - Be simple and delegate logic to services
8. Keep permission logic centralized (roles/claims/permissions).
9. Avoid duplicating auth checks across components.
10. Never expose secrets in frontend code.

### Preferred auth flow
- Login component submits credentials
- `AuthService.login()` performs HTTP call
- `TokenService` stores/retrieves tokens
- `AuthInterceptor` appends access token
- `AuthGuard` protects routes
- `RoleGuard` handles role-based access

---

## State Management Rules

Default preference order:

1. Local component state with `signal()`
2. Shared feature state with a facade service + signals/RxJS
3. Global store only if complexity justifies it

Rules:
- Do not introduce NgRx unless explicitly requested or project already uses it.
- Prefer lightweight state patterns.
- Use signals for local UI state.
- Use RxJS for async streams and server interactions.
- Avoid overengineering small features.

---

## Testing Rules (MANDATORY)

Every generated component, service, guard, interceptor, and pipe should include or update a test file.

### Component tests
Always create:
- `component-x.component.spec.ts`

Best practices:
1. Use Angular TestBed.
2. Test public behavior, not implementation details.
3. Prefer DOM-based assertions over private method testing.
4. Verify:
   - component creation
   - input rendering
   - output emission
   - conditional UI states
   - loading/error/empty states when applicable
   - button interactions / user events
5. Mock dependencies cleanly.
6. Keep tests deterministic.
7. Avoid brittle CSS-selector dependence when possible.
8. Use `By.css` sparingly and intentionally.
9. Prefer testing user-observable behavior.

### Service tests
Always create tests for:
- HTTP services with `HttpClientTestingModule` / `provideHttpClientTesting()`
- Facades with mocked dependencies
- Pure logic with focused unit tests

Verify:
- correct endpoint usage
- request method
- request params/body
- mapping behavior
- success handling
- error propagation

### Guard tests
Verify:
- allows access when authorized
- blocks/redirects when unauthorized
- role-based logic if applicable

### Interceptor tests
Verify:
- token is attached when available
- no token added when absent (if expected)
- error handling behavior if implemented

### Test style rules
- Use descriptive `describe` and `it` blocks
- Arrange / Act / Assert structure
- Keep one behavior per test
- Avoid over-mocking
- Prefer maintainable tests over exhaustive implementation tests

---

## Routing Best Practices

1. Use standalone route definitions where appropriate.
2. Lazy load feature areas when practical.
3. Protect private routes with guards.
4. Use route resolvers only when truly needed.
5. Keep routing config clean and modular.
6. Prefer feature-based route organization.

---

## Folder / Feature Organization

Prefer feature-first structure:

```text
src/app/
  core/
    auth/
    interceptors/
    guards/
    services/
    config/
  shared/
    components/
    directives/
    pipes/
    models/
    utils/
  features/
    users/
      components/
      pages/
      services/
      models/
      guards/
      users.routes.ts