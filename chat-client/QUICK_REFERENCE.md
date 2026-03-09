# 🚀 Quick Reference Guide

## What Was Changed

### ✅ New Files Created
```
src/
├── routes/AppRouter.tsx                    (All routing logic)
├── sections/
│   ├── WaitingRoom/WaitingRoomSection.tsx  (UI only)
│   └── RepresentativeDashboard/RepresentativeDashboardSection.tsx (UI only)
├── auth/AuthGuard.tsx                      (Token protection)
└── utils/auth.ts                           (Auth utilities)

Documentation/
├── RESTRUCTURING_GUIDE.md                  (Detailed guide)
├── RESTRUCTURING_SUMMARY.md                (Quick summary)
├── BEFORE_AFTER_EXAMPLES.md                (Code examples)
├── COMPLETION_CHECKLIST.md                 (Checklist)
└── ARCHITECTURE_DIAGRAMS.md                (Visual diagrams)
```

### ✅ Files Modified
```
src/App.tsx                                 (Simplified from 44→13 lines)
src/pages/WaitingRoomPage.tsx              (Now calls section)
src/pages/RepresentativeDashboard.tsx      (Now calls section)
src/hooks/useNewChatPage.hook.ts           (Uses auth utilities)
```

---

## How to Use New Features

### 1. Import Auth Utilities

```tsx
import { 
  getDecodedToken,
  setToken,
  removeToken,
  getUserIdFromToken,
  hasValidToken 
} from '../utils/auth';

// In your hook:
const decoded = getDecodedToken();
const userId = getUserIdFromToken();
const isLoggedIn = hasValidToken();
```

### 2. Protect Routes with AuthGuard

```tsx
// In routes/AppRouter.tsx (future implementation):
import AuthGuard from '../auth/AuthGuard';

<Route path="/new-chat" element={
  <AuthGuard userType="customer">
    <NewChat />
  </AuthGuard>
} />

<Route path="/representative-dashboard" element={
  <AuthGuard userType="representative">
    <RepresentativeDashboard />
  </AuthGuard>
} />
```

### 3. Create New Sections

When a page gets too large (>100 lines):

```tsx
// 1. Create section file: src/sections/MyFeature/MyFeatureSection.tsx
interface MyFeatureSectionProps {
  data: any;
  onAction: () => void;
}

const MyFeatureSection: React.FC<MyFeatureSectionProps> = ({ data, onAction }) => {
  return (
    <div>
      {/* Pure UI code only */}
    </div>
  );
};

// 2. Update page: src/pages/MyFeaturePage.tsx
const MyFeaturePage = () => {
  const { data, handleAction } = useMyFeature();
  return <MyFeatureSection data={data} onAction={handleAction} />;
};
```

### 4. Create New Utilities

For code used in multiple places:

```tsx
// src/utils/helpers.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('he-IL');
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Usage in any file:
import { formatDate, isValidEmail } from '../utils/helpers';
```

---

## Project Structure at a Glance

```
App.tsx (global wrapper)
  ↓
AppRouter (route definitions)
  ↓
Pages (logic + navigation) → Hooks (data & logic)
  ↓                            ↓
Sections (pure UI)      ← Services & Utils
```

---

## Common Tasks

### Add a New Protected Customer Page

1. Create page in `src/pages/MyPage.tsx`
2. Create hook in `src/hooks/useMyPage.hook.ts`
3. Create section in `src/sections/MyFeature/MyFeatureSection.tsx`
4. Add route in `src/routes/AppRouter.tsx` with AuthGuard

```tsx
// appRouter.tsx
<Route path="/my-page" element={
  <AuthGuard userType="customer">
    <MyPage />
  </AuthGuard>
} />
```

### Add a Reusable Component

1. Create in `src/components/MyComponent.tsx`
2. Use in multiple pages

```tsx
import MyComponent from '../components/MyComponent';

// Use anywhere
<MyComponent prop1={value1} prop2={value2} />
```

### Access Token Data

```tsx
import { getDecodedToken, getUserIdFromToken } from '../utils/auth';

const hook = () => {
  const userId = getUserIdFromToken();
  const token = getDecodedToken();
  
  return { userId, token };
};
```

---

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Entry point, global wrapper |
| `src/routes/AppRouter.tsx` | All routes defined here |
| `src/utils/auth.ts` | Token management |
| `src/auth/AuthGuard.tsx` | Route protection |
| `src/pages/` | Logic wrappers |
| `src/sections/` | Pure UI components |
| `src/hooks/` | Business logic |
| `src/services/` | API calls |

---

## Common Imports

```tsx
// From utils
import { getDecodedToken, setToken, removeToken } from '../utils/auth';
import parseJwt from '../utils/jwt';

// From hooks
import { useCustomerLogin } from '../hooks/useCustomerLogin.hook';
import { useNewChatPage } from '../hooks/useNewChatPage.hook';

// From services
import { loginCustomer } from '../services/customer.service';
import { createSession } from '../services/chatSession.service';

// From router
import { AppRouter } from '../routes/AppRouter';

// From auth
import AuthGuard from '../auth/AuthGuard';

// From sections
import WaitingRoomSection from '../sections/WaitingRoom/WaitingRoomSection';
import RepresentativeDashboardSection from '../sections/RepresentativeDashboard/RepresentativeDashboardSection';
```

---

## Do's and Don'ts

### ✅ Do

- Create **sections** when UI code exceeds ~100 lines
- Use **auth utilities** instead of inline token access
- Keep **pages thin** - focus on orchestration
- Keep **sections pure** - no state logic
- Import from **utils** for shared logic
- Use **AuthGuard** for protected routes
- Organize **folders by feature** (WaitingRoom, Dashboard, etc.)

### ❌ Don't

- Don't mix **logic and UI** in same file
- Don't duplicate **token-checking code**
- Don't put **API calls** directly in components
- Don't import **hooks into sections** (sections should be pure)
- Don't add **business logic to sections**
- Don't put **routing logic in pages**
- Don't create **deeply nested folder structures** without reason

---

## Migration Checklist

When moving code to this new structure:

- [ ] Extract UI to section if page > 100 lines
- [ ] Remove logic from section, keep UI only
- [ ] Update imports in page to use section
- [ ] Test that page still works
- [ ] If using token, use `getDecodedToken()` from utils
- [ ] If creating new page, use same pattern
- [ ] Add AuthGuard if route needs protection
- [ ] Update any imports in test files

---

## Troubleshooting

### "Cannot find module 'WaitingRoomSection'"
→ Check import path. Should be: `../sections/WaitingRoom/WaitingRoomSection`

### "getDecodedToken is undefined"
→ Check import. Should be: `import { getDecodedToken } from '../utils/auth';`

### "Type error: Component expects X props"
→ Check if passing all required props from page to section

### Page shows nothing / infinite loop
→ Likely missing AuthGuard wrapper or token check in hook

### Build fails with TypeScript error
→ Run `npm run build` to see full errors, fix type mismatches

---

## File Size Guidelines

```
App.tsx              < 20 lines
routes/AppRouter     < 50 lines (route definitions)
pages/               < 50 lines (orchestration)
sections/            < 150 lines (UI)
hooks/               < 100 lines (logic)
services/            < 50 lines (API calls)
utils/               < 100 lines (helpers)
components/          < 80 lines (reusable UI)
```

If a file exceeds these, consider splitting it up.

---

## Next Features to Add

1. **Form Validation**: Extract to `utils/validation.ts`
2. **Error Handling**: Create `utils/errors.ts`
3. **Logging**: Create `utils/logger.ts`
4. **Theme Provider**: Add to `App.tsx` provider
5. **Loading States**: Create `components/Loader.tsx`
6. **Error Boundary**: Create `components/ErrorBoundary.tsx`

---

**Happy coding! The project structure is now professional and scalable.** 🚀

For detailed documentation, see:
- `RESTRUCTURING_GUIDE.md` - Comprehensive guide
- `BEFORE_AFTER_EXAMPLES.md` - Code examples
- `ARCHITECTURE_DIAGRAMS.md` - Visual diagrams
