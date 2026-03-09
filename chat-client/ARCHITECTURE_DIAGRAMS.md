# 📊 Project Architecture Diagram

## Overall Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       main.tsx                              │
│                   (Entry point)                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx                                │
│         (Global Wrapper - Clean & Simple)                   │
│                                                             │
│  • BrowserRouter                                            │
│  • Global Providers (Theme, Redux, etc.)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  routes/AppRouter.tsx                       │
│         (All Routes & Route Definitions)                    │
│                                                             │
│  ├─ Public Routes                                           │
│  ├─ Customer Routes                                         │
│  └─ Representative Routes                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ┌───────────┐  ┌───────────┐  ┌──────────┐
    │  Page 1   │  │  Page 2   │  │ Page ... │
    │           │  │           │  │          │
    │ (Logic)   │  │ (Logic)   │  │ (Logic)  │
    └─────┬─────┘  └─────┬─────┘  └────┬─────┘
          │              │             │
          ▼              ▼             ▼
    ┌─────────────────────────────────────┐
    │      Hooks (useXXX.hook.ts)         │
    │                                     │
    │  • Data fetching                    │
    │  • State management                 │
    │  • Business logic                   │
    └────────┬────────────────────────────┘
             │
    ┌────────┴────────────────────────────┐
    │    utils/auth.ts (Utilities)        │
    │    services/ (API calls)            │
    │    types/ (TypeScript types)        │
    └─────────────────────────────────────┘


    ┌──────────────────────────────────────┐
    │      Sections (UI Components)        │
    │                                      │
    │  • WaitingRoomSection                │
    │  • RepresentativeDashboardSection    │
    │  • (Presentational only)             │
    └──────────────────────────────────────┘
          ▲
          └─────── Rendered by Pages
```

---

## Detailed Component Architecture

```
                    ┌──────────────────┐
                    │   App.tsx        │
                    │ (Global Wrapper) │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────┐
                    │  AppRouter        │
                    │  (Route Config)   │
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌──────────┐
   │  Pages  │         │  Pages  │         │  Pages   │
   │ (Thin)  │         │ (Thin)  │         │ (Thin)   │
   └────┬────┘         └────┬────┘         └────┬─────┘
        │                   │                    │
        ▼                   ▼                    ▼
   ┌──────────────────────────────────────────────┐
   │              Hooks (Logic)                   │
   │                                              │
   │  useNewChatPage                              │
   │  useRepresentativeDashboard                  │
   │  useCustomerLogin                            │
   │  useRepresentativeLogin                      │
   │  useWaitingRoom                              │
   │  ... etc                                     │
   └──────────────────┬───────────────────────────┘
                      │
        ┌─────────────┼──────────────┐
        │             │              │
        ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌─────────────┐
   │ Services │  │ Utils    │  │ Types       │
   │          │  │          │  │             │
   │ API      │  │ auth.ts  │  │ Customer.ts │
   │ calls    │  │ jwt.ts   │  │ Chat.ts     │
   └──────────┘  └──────────┘  └─────────────┘

        │                                      │
        └──────────────────┬───────────────────┘
                           │
                    ┌──────▼───────┐
                    │  Sections    │
                    │  (Pure UI)   │
                    │              │
                    │ • No logic   │
                    │ • Props only │
                    │ • Reusable   │
                    └──────────────┘
```

---

## Data Flow: Example - Customer Login to Chat

```
1. User Opens App
   │
   ├─→ App.tsx (Router wrapper)
   │
   ├─→ AppRouter (routes to /login)
   │
   ├─→ CustomerLogin Page (thin)
   │   │
   │   ├─→ useCustomerLogin Hook (logic)
   │   │   │
   │   │   ├─→ customer.service.ts (API call)
   │   │   │   │
   │   │   │   ├─→ axios.ts (HTTP request)
   │   │   │   │
   │   │   │   └─→ Backend API
   │   │   │
   │   │   └─→ utils/auth.ts setToken()
   │   │       │
   │   │       └─→ localStorage.setItem('token', token)
   │   │
   │   └─→ LoginSection Component (UI)
   │
   ├─→ User navigates to /new-chat
   │
   ├─→ AppRouter (routes to /new-chat)
   │
   ├─→ NewChat Page (thin)
   │   │
   │   ├─→ useNewChatPage Hook (logic)
   │   │   │
   │   │   ├─→ utils/auth.ts getDecodedToken()
   │   │   │   │
   │   │   │   └─→ Reads token from localStorage
   │   │   │
   │   │   ├─→ topic.service.ts (fetch topics)
   │   │   │
   │   │   └─→ chatSession.service.ts (create session)
   │   │
   │   └─→ ChatRequestForm Component (UI)
   │
   ├─→ User submits message
   │
   ├─→ AppRouter redirects to /waiting-room
   │
   └─→ WaitingRoomPage (thin)
       │
       ├─→ Hook (logic & polling)
       │   │
       │   ├─→ chatSession.service.ts (get wait time)
       │   │
       │   └─→ When status changes → navigate to /chat
       │
       └─→ WaitingRoomSection Component (UI)
```

---

## File Organization Hierarchy

```
src/
│
├── App.tsx ⭐ (Entry - Global Wrapper)
│
├── routes/ ⭐ (NEW)
│   └── AppRouter.tsx (All route definitions)
│
├── pages/ ✏️ (REFACTORED)
│   ├── CustomerLogin.tsx (logic)
│   ├── NewChat.tsx (logic)
│   ├── WaitingRoomPage.tsx (logic)
│   ├── RepresentativeDashboard.tsx (logic)
│   └── ... other pages
│
├── sections/ ⭐ (NEW)
│   ├── WaitingRoom/
│   │   └── WaitingRoomSection.tsx (pure UI)
│   ├── RepresentativeDashboard/
│   │   └── RepresentativeDashboardSection.tsx (pure UI)
│   └── ... other sections
│
├── auth/ ⭐ (NEW)
│   └── AuthGuard.tsx (token validation wrapper)
│
├── layouts/ ⭐ (NEW - READY FOR USE)
│   └── (will contain DashboardLayout, etc.)
│
├── hooks/
│   ├── useCustomerLogin.hook.ts
│   ├── useNewChatPage.hook.ts
│   ├── useRepresentativeDashboard.hook.ts
│   └── ... other hooks
│
├── components/
│   ├── ChatRequestForm.jsx
│   ├── FeatureCard.jsx
│   └── ... other components
│
├── services/
│   ├── axios.ts
│   ├── customer.service.ts
│   ├── chat.service.ts
│   └── ... other services
│
├── utils/
│   ├── auth.ts ⭐ (NEW - centralized)
│   ├── jwt.ts
│   └── ... other utils
│
├── types/
│   ├── customer.types.ts
│   ├── chat.ts
│   └── ... other types
│
└── styles/
    ├── ChatView.css
    └── ... other styles

⭐ = Created/New
✏️ = Refactored/Modified
```

---

## Component Responsibility Matrix

```
┌────────────────────┬─────────────────────────────────────┐
│ Layer              │ Responsibility                      │
├────────────────────┼─────────────────────────────────────┤
│ App.tsx            │ Global wrapper, providers           │
├────────────────────┼─────────────────────────────────────┤
│ routes/AppRouter   │ Route definitions, structure        │
├────────────────────┼─────────────────────────────────────┤
│ auth/AuthGuard     │ Token validation, protection        │
├────────────────────┼─────────────────────────────────────┤
│ Pages/             │ Orchestrate hooks & sections        │
│ (WaitingRoomPage)  │ Handle navigation, state            │
├────────────────────┼─────────────────────────────────────┤
│ Hooks/             │ Business logic, API calls           │
│ (useNewChatPage)   │ State management, side effects      │
├────────────────────┼─────────────────────────────────────┤
│ Sections/          │ Pure UI rendering                   │
│ (WaitingRoomSection)│ Props-driven, no logic             │
├────────────────────┼─────────────────────────────────────┤
│ Components/        │ Reusable UI pieces                  │
│ (Button, Input)    │ Used in multiple pages              │
├────────────────────┼─────────────────────────────────────┤
│ Services/          │ API calls, backend communication    │
│ (customer.service) │ Encapsulate axios/fetch             │
├────────────────────┼─────────────────────────────────────┤
│ Utils/             │ Helper functions                    │
│ (auth.ts)          │ Reusable utilities, token mgmt      │
├────────────────────┼─────────────────────────────────────┤
│ Types/             │ TypeScript definitions              │
│ (Customer.ts)      │ Type safety                         │
└────────────────────┴─────────────────────────────────────┘
```

---

## Dependency Flow (Should Be One Direction)

```
Utils ◄─── Services ◄─── Hooks ◄─── Pages ◄─── Sections
 ▲         ▲               ▲          ▲         ▲
 │         │               │          │         │
 └─────────┴───────────────┴──────────┴─────────┘
                 Types / Constants
```

**Good:** Upper layers depend on lower layers
**Bad:** Lower layers should NOT depend on upper layers

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────┐
│           User Authentication Flow                   │
└──────────────────────────────────────────────────────┘

1. Login Page
   └─→ useCustomerLogin Hook
       └─→ customer.service.login()
           └─→ axios.post('/auth/login')
               └─→ Server returns JWT token
                   └─→ setToken(token) in utils/auth.ts
                       └─→ localStorage.setItem('token', token)

2. Protected Page Access
   └─→ AuthGuard Component checks:
       ├─→ Is token in localStorage?
       ├─→ Is token valid (can be decoded)?
       ├─→ Does token belong to right user type?
       └─→ If all pass: render page
           If fail: redirect to /login

3. API Requests
   └─→ Any service calls axios
       └─→ axios interceptor attaches:
           └─→ Authorization: Bearer {token}
               └─→ Backend validates token
                   └─→ Responds with data

4. Token Refresh (future)
   └─→ If 401 response:
       └─→ Use refresh token to get new token
           └─→ setToken(newToken)
               └─→ Retry original request
```

---

## Import Dependencies (Clean Architecture)

```
pages/WaitingRoomPage.tsx imports:
├─→ hooks/useWaitingRoom.hook.ts
├─→ sections/WaitingRoom/WaitingRoomSection.tsx
└─→ react-router-dom

hooks/useWaitingRoom.hook.ts imports:
├─→ services/chatSession.service.ts
├─→ utils/auth.ts ← For token utilities
├─→ types/chatSession.types.ts
└─→ react

services/chatSession.service.ts imports:
├─→ services/axios.ts
├─→ types/chatSession.types.ts
└─→ axios

utils/auth.ts imports:
├─→ utils/jwt.ts
└─→ (no other utils - standalone)

sections/WaitingRoom/WaitingRoomSection.tsx imports:
├─→ styles/WaitingRoomStyled.css
└─→ react (JSX)
   ⚠️ NO imports from hooks or services!
```

---

## Status Overview

```
┌─────────────────────────────────────────┐
│     ✅ Restructuring Complete           │
├─────────────────────────────────────────┤
│ Routes:              CENTRALIZED         │
│ Pages:               THIN WRAPPERS       │
│ Sections:            PURE UI             │
│ Auth:                PROTECTED           │
│ Utilities:           CENTRALIZED         │
│ Build:               PASSING             │
│ TypeScript:          CLEAN               │
│ Code Duplication:    ELIMINATED          │
│ Scalability:         READY FOR GROWTH    │
└─────────────────────────────────────────┘
```

**Your project is now architecturally sound!** 🏗️
