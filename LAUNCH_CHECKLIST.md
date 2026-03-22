# Launch Readiness Checklist

Generated from code review on March 22, 2026

---

## CRITICAL - Must Fix Before Launch

### Security
- [ ] **Remove hardcoded secrets from code**
  - GitHub OAuth Client ID in `src/pages/Login.tsx:7`
  - Clerk keys should use environment variables only
  - PocketBase URL hardcoded in `src/services/pocketbase.ts`
  
- [ ] **Verify .gitignore excludes all .env files**
  - `.env`, `.env.development`, `.env.production` all ignored ✓

- [ ] **Review localStorage token storage**
  - `src/services/api.ts` stores tokens in localStorage (security concern)
  - Consider using httpOnly cookies instead for production

### Backend Integration
- [ ] **Connect REST API properly**
  - Set `VITE_API_URL` to your Railway backend
  - Remove PocketBase dependency or deprecate it
  
- [ ] **Fix stubbed service methods**
  - `src/services/submissionService.ts` - all methods return stubs
  - `src/services/questService.ts:57` - updateQuest() doesn't call API

- [ ] **Connect notification panel**
  - `src/components/notifications/NotificationPanel.tsx:36-40` - returns empty array

---

## HIGH PRIORITY - Should Fix Soon

### User Experience
- [ ] **Add error handling to mutations**
  - `src/pages/QuestDetail.tsx:25-33` - acceptMutation needs onError
  - `src/pages/Submit.tsx:22-28` - submitMutation needs onError
  - Show toast notifications on errors

- [ ] **Persist user settings**
  - Wallet address not saved to backend (`src/pages/Settings.tsx:231-233`)
  - Notification preferences not saved (`src/pages/Settings.tsx:466-468`)
  - Profile save is mocked (`src/pages/Settings.tsx:116-123`)

- [ ] **Fix mobile menu**
  - `mobileMenuOpen` state exists but does nothing (`src/components/layout/TopNav.tsx:127`)

### API Reliability
- [ ] **Add React error boundary**
  - `src/App.tsx` - no error boundary for component errors

- [ ] **Review query error handling**
  - `src/pages/Dashboard.tsx` - useQuery has no onError

---

## MEDIUM - Technical Debt

### Performance
- [ ] **Add React.memo to list components**
  - `QuestCard.tsx` re-renders on every parent update
  - `DifficultyBadge.tsx` simple component needs memoization
  
- [ ] **Memoize expensive computations**
  - `Leaderboard.tsx` - stats not memoized
  - `Transactions.tsx` - filter calculations not memoized

- [ ] **Use useCallback for handlers**
  - Multiple inline arrow functions in map callbacks

### Code Quality
- [ ] **Remove console.log statements**
  - `console.error` in production at:
    - `Landing.tsx:37`
    - `Transactions.tsx:54`
    - `Admin.tsx:48,58,67`
    - `Leaderboard.tsx:21`
    - Multiple other files

- [ ] **Fix duplicate user mapping**
  - User mapping duplicated in:
    - `AuthContext.tsx`
    - `hooks/useAuth.ts`
    - `services/authService.ts`
  - Create shared user mapper function

- [ ] **Type safety**
  - Excessive use of `any` type defeats TypeScript purpose
  - Fix `src/types/index.ts:63` typo: `rejaction_reason` → `rejection_reason`

---

## LOW - Nice to Have

### Accessibility
- [ ] **Add aria-labels to interactive elements**
  - Search inputs missing labels
  - Icon buttons need aria-labels
  - Make QuestCard keyboard accessible

- [ ] **Improve image alt text**
  - Avatar images have empty or unhelpful alts

### UX Polish
- [ ] **Remove hardcoded notification count** (`TopNav.tsx:76`)
- [ ] **Add loading states to settings tabs**
- [ ] **Show active tab in URL** (back button support)

---

## POST-LAUNCH

### Features
- [ ] GitHub OAuth for user accounts (currently using Clerk only)
- [ ] USDC payment escrow on Base
- [ ] Email notifications
- [ ] WebSocket real-time updates
- [ ] Quest categories and tags
- [ ] User reviews and ratings

### Improvements
- [ ] Replace Clerk dev keys with production keys
- [ ] Set up proper error monitoring (Sentry)
- [ ] Add analytics (Plausible/Umami)
- [ ] Implement rate limiting for API
- [ ] Add end-to-end tests

---

## Quick Wins (1 Hour Each)

1. **Remove Login.tsx** - Old auth page, replaced by Clerk
2. **Remove Index.tsx** - Placeholder page, redirects to root
3. **Remove AuthCallback.tsx** - Not needed with Clerk routing
4. **Delete pocketbase.ts** - No longer used
5. **Remove .env files from repo** - Keep only .env.example
6. **Fix type typo** - `rejaction_reason` → `rejection_reason`
7. **Replace console.error with toast** - Better UX

---

## Estimated Fix Times

| Category | Estimated Time |
|----------|---------------|
| Critical security fixes | 2-3 hours |
| Backend integration | 4-6 hours |
| UX improvements | 3-4 hours |
| Type safety | 2-3 hours |
| Performance | 2-3 hours |

**Minimum viable for launch**: 1 day
**Production ready**: 3-5 days
