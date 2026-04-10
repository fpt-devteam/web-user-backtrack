# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 5173
npm run build      # Production build (vite build + tsc)
npm run test       # Run all tests (vitest)
npm run lint       # Lint with ESLint
npm run check      # Format + lint fix (prettier --write + eslint --fix)
```

Run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

Add shadcn components:
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Environment Variables

Required in `.env`:
- `VITE_API_URL` — backend base URL (e.g. `http://localhost:8080`)
- `VITE_FIREBASE_*` — Firebase project credentials (auth)
- `VITE_STRIPE_*` — Stripe publishable key and price IDs

## Architecture

**Stack:** React 19 + TypeScript, Vite, TailwindCSS v4, TanStack Router (file-based), TanStack Query, Firebase Auth, Socket.IO client, Stripe, Zod, shadcn/ui (Radix UI).

### Provider hierarchy (`main.tsx`)
```
TanStackQueryProvider → AuthProvider → SocketProvider → StripeProvider → RouterProvider
```

### Routing (`src/routes/`)
File-based routing via TanStack Router. Route tree is auto-generated into `src/routeTree.gen.ts` — do not edit that file manually. The root layout (`__root.tsx`) conditionally renders `<BacktrackHeader />` — `/sign-in`, `/sign-up`, and `/chat` paths are excluded from the global header (`NO_HEADER_ROUTES`).

### Authentication (`src/hooks/use-auth.tsx`)
Firebase Auth is the identity layer. `AuthProvider` listens to `onAuthStateChanged` and fetches the backend profile via `userService.getMe()` on login. Anonymous sign-in is supported — anonymous users are not fetched from the backend until they link credentials. Auth mutations (`useSignInWithEmailAndPassword`, `useSignInWithGoogle`, `useCreateAccount`, etc.) all live in `use-auth.tsx`.

### API Layer
- `src/lib/api-client.ts` exports `privateClient` (auto-attaches Firebase ID token, retries on 401) and `publicClient` (no auth), both axios instances pointed at `VITE_API_URL`.
- `src/services/*.service.ts` — one file per domain (user, auth, org, chat, qr, subscription, messager). Services call the axios clients and unwrap `ApiResponse<T>`.
- All responses conform to `ApiResponse<T>` from `src/types/api-response.type.ts`.

### Data Fetching Pattern
TanStack Query hooks live in `src/hooks/use-*.tsx`. Each hook file corresponds to a service file. Query key factories (e.g. `userKeys`) are defined in the hook file and imported where cache invalidation is needed.

### Real-time (`src/hooks/use-socket.tsx`, `src/lib/socket.tsx`)
Socket.IO connection is managed by `SocketProvider`. It connects to `VITE_API_URL` at path `/chat/hub`, auto-connects when a non-anonymous user is authenticated, and disconnects on sign-out.

The context exposes:
- `joinConversation` / `leaveConversation` — room management
- `sendMessage(payload)` — routes to `message:send` or `message:send:support` based on whether payload contains `orgId`
- `sendTypingStart` / `sendTypingStop` — typing indicators
- `onMessageSendSuccess` / `onMessageSendSupportSuccess` — event subscription callbacks (return unsubscribe functions)

Conversation types: `"direct"` (user-to-user, has `partner`) and `"support"` (org-linked, has `orgId`/`orgName`/`orgSlug`).

### Path Alias
`@/` maps to `src/`. Always use this alias for imports.

### Component Organization (`src/components/`)
- `ui/` — shadcn/Radix primitives
- `shared/` — app-wide shared components (header, error pages)
- Feature folders (`landing-page/`, `sign-in/`, `sign-up/`, `chat/`, etc.) mirror the route structure
