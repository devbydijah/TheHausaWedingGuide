# Sprint 2: Component Refactoring - Execution Plan

**Branch:** `interactive-guide`  
**Duration:** 5 days (accelerated to single session)  
**Effort:** 20 hours  
**Goal:** Break down 3753-line InteractiveGuide.jsx into modular, maintainable components

---

## Current State Analysis

**InteractiveGuide.jsx Structure:**

- **Lines:** 3753 total
- **Internal Components:**
  1. `DashboardSection` (line 675)
  2. `VisionQuizSection` (line 1067)
  3. `VisionSection` (line 1676)
  4. `BudgetSection` (line 1777)
  5. `VendorSection` (line 2006)
  6. `TimelineSection` (line 2402)
  7. `BlueprintSection` (line 3152)
  8. `LegacySection` (line 3714)

**Data Model:** 75 lines (DEFAULT_GUIDE object)
**Main Component:** ~600 lines (state, handlers, render logic)

---

## Refactoring Strategy

### Phase 1: Create Folder Structure (Task 2.1-2.3)

```
src/
├── components/
│   ├── shared/
│   │   ├── Header.jsx (existing component cleanup)
│   │   ├── Footer.jsx (NEW)
│   │   └── NavigationBar.jsx (extracted from InteractiveGuide)
│   └── ui/
│       ├── Button.jsx (NEW)
│       ├── Input.jsx (NEW)
│       ├── Card.jsx (NEW)
│       ├── Modal.jsx (NEW)
│       ├── Toast.jsx (extracted)
│       ├── Spinner.jsx (already exists)
│       └── index.js (barrel export)
├── features/
│   ├── dashboard/
│   │   ├── Dashboard.jsx (from DashboardSection)
│   │   ├── ProgressRing.jsx (SVG progress component)
│   │   └── QuickStats.jsx (stats cards)
│   ├── vision-quiz/
│   │   ├── VisionQuiz.jsx (from VisionQuizSection)
│   │   ├── Question.jsx (individual question)
│   │   └── Result.jsx (quiz results)
│   ├── vision/
│   │   └── VisionPlanner.jsx (from VisionSection)
│   ├── budget/
│   │   ├── BudgetBuilder.jsx (from BudgetSection)
│   │   └── CategorySlider.jsx (budget category input)
│   ├── vendors/
│   │   ├── VendorTracker.jsx (from VendorSection)
│   │   ├── VendorCard.jsx (individual vendor)
│   │   └── VendorForm.jsx (add/edit modal)
│   ├── timeline/
│   │   ├── TimelineManager.jsx (from TimelineSection)
│   │   ├── TaskCard.jsx (individual task)
│   │   └── TaskForm.jsx (add/edit modal)
│   └── blueprint/
│       └── FinalBlueprint.jsx (from BlueprintSection)
├── hooks/
│   ├── useAuth.js (exists in hooks/)
│   ├── useSyncToCloud.js (exists in hooks/)
│   ├── useDashboardData.js (NEW - dashboard logic)
│   ├── useQuizLogic.js (NEW - quiz state management)
│   ├── useBudgetCalculator.js (NEW - budget calculations)
│   ├── useVendorManager.js (NEW - vendor CRUD)
│   └── useTaskManager.js (NEW - task CRUD)
└── lib/
    └── constants.js (DEFAULT_GUIDE, quiz questions, etc.)
```

### Phase 2: Extract Shared UI Components (Task 2.2)

Priority components to create:

1. **Button.jsx** - Standardized button with variants (primary, secondary, danger)
2. **Input.jsx** - Text/number/date input with label and validation
3. **Card.jsx** - Container with shadow and hover effects
4. **Modal.jsx** - Dialog overlay with close functionality
5. **Toast.jsx** - Notification system (extract from InteractiveGuide)

### Phase 3: Extract Feature Components (Tasks 2.4-2.17)

**Day 1: Dashboard** (2.4-2.7)

- Extract `DashboardSection` → `features/dashboard/Dashboard.jsx`
- Create `ProgressRing.jsx` for SVG progress visualization
- Create `QuickStats.jsx` for statistics cards
- Create `useDashboardData.js` hook for data aggregation

**Day 2: Vision & Quiz** (2.8-2.12)

- Extract `VisionQuizSection` → `features/vision-quiz/VisionQuiz.jsx`
- Create `Question.jsx` for individual quiz questions
- Create `Result.jsx` for quiz results display
- Extract `VisionSection` → `features/vision/VisionPlanner.jsx`
- Create `useQuizLogic.js` hook

**Day 3: Budget** (2.11-2.12)

- Extract `BudgetSection` → `features/budget/BudgetBuilder.jsx`
- Create `CategorySlider.jsx` for percentage/amount inputs
- Create `useBudgetCalculator.js` hook

**Day 4: Vendors & Timeline** (2.13-2.17)

- Extract `VendorSection` → `features/vendors/VendorTracker.jsx`
- Create `VendorCard.jsx` and `VendorForm.jsx`
- Extract `TimelineSection` → `features/timeline/TimelineManager.jsx`
- Create `TaskCard.jsx` and `TaskForm.jsx`
- Create `useVendorManager.js` and `useTaskManager.js` hooks

**Day 5: Integration** (2.18-2.21)

- Extract `BlueprintSection` → `features/blueprint/FinalBlueprint.jsx`
- Refactor `InteractiveGuide.jsx` into thin orchestration shell (~150 lines)
- Test all features for regressions
- Fix bugs and create Sprint 2 review document

---

## Execution Order

1. ✅ Create folder structure
2. ✅ Create shared UI components (Button, Input, Card, Modal, Toast)
3. ✅ Extract constants to lib/constants.js
4. ✅ Create custom hooks (useDashboardData, useQuizLogic, etc.)
5. ✅ Extract Dashboard feature
6. ✅ Extract VisionQuiz feature
7. ✅ Extract Vision feature
8. ✅ Extract Budget feature
9. ✅ Extract Vendor feature
10. ✅ Extract Timeline feature
11. ✅ Extract Blueprint feature
12. ✅ Refactor InteractiveGuide.jsx shell
13. ✅ Test all features
14. ✅ Create Sprint 2 review document

---

## Success Criteria

- [ ] InteractiveGuide.jsx reduced to < 200 lines
- [ ] All section components extracted to features/ folder
- [ ] No functionality regressions
- [ ] All components use shared UI components
- [ ] Code duplication < 5%
- [ ] All components properly typed with JSDoc or TypeScript
- [ ] Consistent naming conventions
- [ ] All features independently testable

---

## Risk Mitigation

**Risk 1:** Breaking cloud sync functionality

- **Mitigation:** Keep useSyncToCloud hook intact, pass `data` and `setData` as props

**Risk 2:** State management complexity

- **Mitigation:** Use React Context if prop drilling becomes excessive

**Risk 3:** Import path confusion

- **Mitigation:** Use barrel exports (index.js) consistently

**Risk 4:** Regression in user experience

- **Mitigation:** Test each feature after extraction before moving to next

---

## Testing Checklist (Per Feature)

- [ ] Feature renders without errors
- [ ] User can interact with all controls
- [ ] Data saves to cloud (sync indicator shows "Saved")
- [ ] Data persists after page refresh
- [ ] Dark mode works correctly
- [ ] Responsive layout on mobile (360px)
- [ ] Keyboard navigation works
- [ ] No console errors or warnings

---

## Next Steps After Sprint 2

Sprint 3 will focus on:

- Mobile navigation improvements
- Complete WCAG 2.1 AA compliance
- Performance optimization
- Final polish and production readiness
