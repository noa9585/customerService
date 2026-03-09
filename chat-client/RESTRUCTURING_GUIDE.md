# 📊 Project Restructuring Guide

## ✅ Changes Made

### 1. **Routes Organization** (`routes/AppRouter.tsx`)
   - ✅ Created `src/routes/AppRouter.tsx`
   - ✅ Extracted all routing logic from `App.tsx`
   - ✅ Centralized route definitions and organized them by user type (public, customer, representative)
   - ✅ Simplified `App.tsx` to be a clean global wrapper

**What this fixes:**
- `App.tsx` is now very small and clean
- All routes are in one organized place
- Easy to add/remove/modify routes
- Future: can easily add AuthGuard wrapper to protected routes

---

### 2. **Sections Organization** (`sections/`)
   - ✅ Created `src/sections/WaitingRoom/WaitingRoomSection.tsx`
   - ✅ Created `src/sections/RepresentativeDashboard/RepresentativeDashboardSection.tsx`
   - ✅ Moved large UI chunks from pages → sections
   - ✅ Updated page components to use sections

**What this fixes:**
- Pages (like `WaitingRoomPage.tsx`) are now **thin wrappers** that only:
  - Call hooks to fetch/manage data
  - Pass props to sections for rendering
- Sections are **pure presentation components** that receive all props
- Clear separation: Page = Logic, Section = UI

---

### 3. **Auth Protection** (`auth/AuthGuard.tsx`)
   - ✅ Created `src/auth/AuthGuard.tsx` component
   - ✅ Centralized token validation logic

**What this fixes:**
- Before: Every hook had to check for token separately (code duplication)
- Now: Wrap routes with `<AuthGuard>` and it handles token validation
- Can restrict routes by user type: `<AuthGuard userType="customer">`

**Example Usage (in future):**
```tsx
<Route path="/new-chat" element={
  <AuthGuard userType="customer">
    <NewChat />
  </AuthGuard>
} />
```

---

### 4. **Auth Utilities** (`utils/auth.ts`)
   - ✅ Created centralized auth helper functions
   - ✅ Functions: `getDecodedToken()`, `setToken()`, `removeToken()`, `getUserIdFromToken()`, etc.
   - ✅ Updated `useNewChatPage.hook.ts` to use new utilities

**What this fixes:**
- Before: `parseJwt` called directly in multiple hooks
- Now: Use `getDecodedToken()` from `utils/auth.ts`
- Easier to maintain: change once, affects everywhere
- Reusable across entire app

---

### 5. **Layouts Folder** (`layouts/`)
   - ✅ Created `src/layouts/` folder (ready for future use)
   - Will be used for: `DashboardLayout.tsx`, `AuthLayout.tsx`, etc.

**Future Usage Example:**
```tsx
// RepresentativeDashboard.tsx
import DashboardLayout from '../layouts/DashboardLayout';

const RepresentativeDashboard = () => {
  return (
    <DashboardLayout>
      <RepresentativeDashboardSection {...props} />
    </DashboardLayout>
  );
};
```

---

## 📁 New Project Structure

```
src/
  ├── auth/                           ✅ NEW
  │   └── AuthGuard.tsx               (Token validation wrapper)
  │
  ├── routes/                         ✅ NEW
  │   └── AppRouter.tsx               (All routing logic)
  │
  ├── sections/                       ✅ NEW
  │   ├── WaitingRoom/
  │   │   └── WaitingRoomSection.tsx  (Moved from pages/)
  │   └── RepresentativeDashboard/
  │       └── RepresentativeDashboardSection.tsx (Moved from pages/)
  │
  ├── layouts/                        ✅ NEW (empty, ready for Layouts)
  │
  ├── pages/                          ✅ REFACTORED
  │   ├── WaitingRoomPage.tsx         (Now thin wrapper calling section)
  │   ├── RepresentativeDashboard.tsx (Now thin wrapper calling section)
  │   └── ... other pages
  │
  ├── hooks/                          ✅ UPDATED
  │   ├── useNewChatPage.hook.ts      (Now uses auth utilities)
  │   └── ... other hooks
  │
  ├── utils/                          ✅ UPDATED
  │   ├── auth.ts                     (NEW - centralized auth helpers)
  │   ├── jwt.ts
  │   └── ...
  │
  └── App.tsx                         ✅ SIMPLIFIED
```

---

## 🔄 How Pages Work Now

### Before (Mixed Concern):
```tsx
// Old: Page had both logic AND UI mixed
const WaitingRoomPage = () => {
  // ... logic ...
  return (
    <div>
      {/* UI code inline */}
      <h1>...</h1>
      <div>...</div>
    </div>
  );
};
```

### After (Separated Concern):
```tsx
// Page: Only logic
const WaitingRoomPage = () => {
  const { sessionData, elapsed, waitTime } = useWaitingRoom();
  
  return (
    <WaitingRoomSection 
      session={sessionData}
      elapsed={elapsed}
      waitTime={waitTime}
    />
  );
};

// Section: Only UI
const WaitingRoomSection = ({ session, elapsed, waitTime }) => {
  return (
    <div className="waiting-page">
      {/* Pure presentational JSX */}
    </div>
  );
};
```

---

## 🎯 Benefits of This Structure

| Before | After |
|--------|-------|
| ❌ App.tsx was huge with all routes | ✅ App.tsx is clean, 15 lines |
| ❌ Pages mixed logic + UI | ✅ Pages = logic, Sections = UI |
| ❌ Token checking duplicated in hooks | ✅ Centralized in auth utils |
| ❌ Hard to test UI separately | ✅ Pure sections are testable |
| ❌ Hard to reuse UI sections | ✅ Sections reusable in multiple pages |

---

## 📋 Next Steps (Optional)

If you want to continue optimizing:

1. **Extract Reusable Components**: Create `PasswordInput.tsx`, `Button.tsx`, etc. if used in multiple places
2. **Add Layouts**: Create `DashboardLayout.tsx` for pages that share a sidebar
3. **Add AuthGuard to Routes**: Wrap protected routes with `<AuthGuard>`
4. **Create Context**: Add `AuthContext` to avoid passing token around

---

## ⚠️ Files Still in Pages (To Consider Moving)

These are still in `src/pages/` but could be moved to `sections/` if they're large:
- `RepresentativeRegister.tsx`
- `CustomerRegister.tsx`
- `ChatView.tsx`
- `UpdateRepresentative.tsx`

Move them when they grow beyond ~100 lines of UI code.

---

## 🔗 How to Import (Examples)

```tsx
// Import section component
import WaitingRoomSection from '../sections/WaitingRoom/WaitingRoomSection';

// Import auth guard
import AuthGuard from '../auth/AuthGuard';

// Import auth utilities
import { getDecodedToken, getUserIdFromToken } from '../utils/auth';

// Use router
import { AppRouter } from './routes/AppRouter';
```

---

**Done! Your project structure is now professional and scalable.** 🚀
