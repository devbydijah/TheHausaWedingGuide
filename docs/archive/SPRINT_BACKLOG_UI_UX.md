# 🚀 UI/UX Improvement Sprint Backlog

**Project:** Hausa Wedding Guide  
**Student:** AI Coding Assistant  
**Mentor:** Senior Full-Stack Developer  
**Planning Date:** October 6, 2025  
**Total Duration:** 3 weeks (15 working days)  
**Total Effort:** ~47 hours

---

## 🎯 Sprint Overview

### Sprint 1: Foundation & Quick Wins (Week 1)

**Goal:** Fix critical inconsistencies and establish design system  
**Duration:** 5 days | **Effort:** 12 hours  
**Deliverables:** Consistent branding, typography, basic accessibility

### Sprint 2: Component Refactoring (Week 2)

**Goal:** Break down monolithic InteractiveGuide.jsx  
**Duration:** 5 days | **Effort:** 20 hours  
**Deliverables:** Modular feature components, reusable UI library

### Sprint 3: Polish & Accessibility (Week 3)

**Goal:** Mobile optimization, complete WCAG compliance  
**Duration:** 5 days | **Effort:** 15 hours  
**Deliverables:** Production-ready, accessible, mobile-optimized

---

## 📅 SPRINT 1: Foundation & Quick Wins

**Dates:** October 7-11, 2025  
**Review:** Friday October 11, 5:00 PM

### Task Breakdown

#### **Day 1 (Monday): Brand Consistency**

| #   | Task                                   | Priority | Effort | Branch            | Acceptance Criteria                                      |
| --- | -------------------------------------- | -------- | ------ | ----------------- | -------------------------------------------------------- |
| 1.1 | Standardize gradient direction         | 🔴 P0    | 30min  | interactive-guide | All pages use `from-[#990200] to-[#531946]`              |
| 1.2 | Update LoginGate colors                | 🔴 P0    | 45min  | interactive-guide | Matches landing page glassmorphism                       |
| 1.3 | Apply typography to main branch        | 🔴 P0    | 30min  | main              | All headings use `font-playfair`, body uses `font-inter` |
| 1.4 | Apply typography to interactive branch | 🔴 P0    | 30min  | interactive-guide | Consistent with main branch                              |

**Checklist:**

- [ ] Run global find/replace: `from-[#531946] to-[#990200]` → `from-[#990200] to-[#531946]`
- [ ] Update LoginGate.jsx per CODE_REVIEW_LOGINGGATE.md
- [ ] Add `font-playfair` to all `<h1>`, `<h2>`, `<h3>` tags
- [ ] Add `font-inter` to all `<p>`, `<span>`, `<label>` tags
- [ ] Test both deployments visually

**Deliverable:** Screenshot comparison (before/after) for mentor review

---

#### **Day 2 (Tuesday): Visual Assets**

| #    | Task                                  | Priority | Effort | Branch            | Acceptance Criteria                                |
| ---- | ------------------------------------- | -------- | ------ | ----------------- | -------------------------------------------------- |
| 1.5  | Add logo to main branch header        | 🔴 P0    | 15min  | main              | `logowhite.jpg` in top-left, links to home         |
| 1.6  | Add logo to interactive branch header | 🔴 P0    | 15min  | interactive-guide | Same as main                                       |
| 1.7  | Add hero image to PDF landing         | 🟡 P1    | 30min  | main              | `couple1.png` in hero section, rounded, shadow     |
| 1.8  | Add hero image to Interactive landing | 🟡 P1    | 30min  | interactive-guide | `bride1.png` in hero section                       |
| 1.9  | Create PDF preview section            | 🟡 P1    | 1h     | main              | 3-column grid with `samplepage1-3.png`             |
| 1.10 | Optimize all images                   | 🟡 P1    | 1h     | both              | Compress PNGs, add `loading="lazy"`, WebP versions |

**Checklist:**

- [ ] Create `<Header />` shared component with logo
- [ ] Add hero images with proper alt text
- [ ] Build PDF preview section below features
- [ ] Run images through Squoosh (https://squoosh.app)
- [ ] Add lazy loading to all images

**Code Example:**

```jsx
// src/components/shared/Header.jsx
export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <img
        src="/assets/logowhite.jpg"
        alt="Hausa Wedding Guide Logo"
        className="h-12 hover:opacity-90 transition-opacity"
      />
    </header>
  );
}
```

**Deliverable:** Deployed preview links for both branches

---

#### **Day 3 (Wednesday): Accessibility Foundations**

| #    | Task                                | Priority | Effort | Branch            | Acceptance Criteria                            |
| ---- | ----------------------------------- | -------- | ------ | ----------------- | ---------------------------------------------- |
| 1.11 | Add focus states to all buttons     | 🔴 P0    | 45min  | both              | Visible 4px ring on keyboard focus             |
| 1.12 | Add ARIA labels to icon buttons     | 🔴 P0    | 30min  | both              | All emoji/SVG icons have `aria-label`          |
| 1.13 | Add aria-describedby to form inputs | 🔴 P0    | 30min  | interactive-guide | All inputs linked to help text                 |
| 1.14 | Color contrast audit                | 🔴 P0    | 1h     | both              | Run axe DevTools, fix AAA violations           |
| 1.15 | Semantic HTML review                | 🟡 P1    | 45min  | both              | Use `<header>`, `<main>`, `<section>` properly |

**Checklist:**

- [ ] Add `focus:ring-4 focus:ring-[#CE805C]/50 focus:outline-none` to all `<button>`, `<a>`
- [ ] Add `role="img" aria-label="..."` to all emoji elements
- [ ] Link form inputs: `<input aria-describedby="input-help" />` + `<p id="input-help">`
- [ ] Install axe DevTools Chrome extension
- [ ] Run audit on both landing pages
- [ ] Fix all Critical + Serious issues
- [ ] Add skip-to-content link: `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`

**Tool:** https://www.deque.com/axe/devtools/

**Deliverable:** axe DevTools screenshots showing 0 critical issues

---

#### **Day 4 (Thursday): Animations & Polish**

| #    | Task                       | Priority | Effort | Branch            | Acceptance Criteria                            |
| ---- | -------------------------- | -------- | ------ | ----------------- | ---------------------------------------------- |
| 1.16 | Apply entrance animations  | 🟢 P2    | 1h     | both              | Sections fade-in-up on load                    |
| 1.17 | Add loading spinners       | 🟡 P1    | 45min  | interactive-guide | Show spinner during async operations           |
| 1.18 | Improve hover states       | 🟢 P2    | 30min  | both              | Smooth transitions on all interactive elements |
| 1.19 | Add prefers-reduced-motion | 🟡 P1    | 30min  | both              | Respect user accessibility preferences         |

**Checklist:**

- [ ] Add `fade-in-up` class to feature cards with staggered delays
- [ ] Create reusable `<Spinner />` component
- [ ] Ensure all `hover:` states have `transition-all` or specific transition
- [ ] Add to index.css:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Deliverable:** Video recording showing smooth animations

---

#### **Day 5 (Friday): Review & Documentation**

| #    | Task                  | Priority | Effort | Branch | Acceptance Criteria                    |
| ---- | --------------------- | -------- | ------ | ------ | -------------------------------------- |
| 1.20 | Lighthouse audit      | 🔴 P0    | 1h     | both   | Score ≥ 80 on all metrics              |
| 1.21 | Cross-browser testing | 🟡 P1    | 1h     | both   | Works on Chrome, Firefox, Safari, Edge |
| 1.22 | Mobile testing        | 🟡 P1    | 1h     | both   | Test on real device (iPhone/Android)   |
| 1.23 | Document changes      | 🟡 P1    | 1h     | -      | Update README with new patterns        |
| 1.24 | Prepare sprint review | 🔴 P0    | 30min  | -      | Screenshots, metrics, demo             |

**Checklist:**

- [ ] Run Lighthouse on both deployments (Desktop + Mobile)
- [ ] Screenshot results
- [ ] Test in BrowserStack or actual devices
- [ ] Update UI_QUICK_REFERENCE.md with new components
- [ ] Create SPRINT_1_REVIEW.md with:
  - Before/after screenshots
  - Lighthouse scores
  - Accessibility improvements
  - Challenges encountered
  - Questions for mentor

**Deliverable:** Sprint 1 Review Document + Demo Session

---

### Sprint 1 Success Metrics

| Metric                    | Target             | How to Measure           |
| ------------------------- | ------------------ | ------------------------ |
| Lighthouse Performance    | ≥ 80               | Lighthouse audit         |
| Lighthouse Accessibility  | ≥ 80               | Lighthouse audit         |
| Lighthouse Best Practices | ≥ 80               | Lighthouse audit         |
| Lighthouse SEO            | ≥ 80               | Lighthouse audit         |
| axe DevTools Issues       | 0 Critical/Serious | axe browser extension    |
| Color Contrast            | AAA (7:1)          | WebAIM Contrast Checker  |
| Typography Applied        | 100%               | Visual inspection        |
| Images Added              | 5+                 | File count in assets     |
| Focus States              | All interactive    | Keyboard navigation test |

---

## 📅 SPRINT 2: Component Refactoring

**Dates:** October 14-18, 2025  
**Review:** Friday October 18, 5:00 PM

### Task Breakdown

#### **Day 1 (Monday): Setup Feature-Folder Structure**

| #   | Task                        | Priority | Effort | Acceptance Criteria                  |
| --- | --------------------------- | -------- | ------ | ------------------------------------ |
| 2.1 | Create folder structure     | 🔴 P0    | 1h     | Folders match architecture diagram   |
| 2.2 | Create shared UI components | 🟡 P1    | 2h     | Button, Input, Card, Modal extracted |
| 2.3 | Set up barrel exports       | 🟢 P2    | 30min  | Clean import paths with index.js     |

**Folder Structure:**

```
src/
├── components/
│   ├── LoginGate.jsx (refactored per review)
│   ├── shared/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── FeatureCard.jsx
│   │   └── CTAButton.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       └── index.js (barrel export)
├── features/
│   ├── dashboard/
│   ├── vision-quiz/
│   ├── budget/
│   ├── vendors/
│   └── timeline/
└── hooks/
    ├── useAuth.js (extracted from LoginGate)
    ├── useSyncToCloud.js
    ├── useLocalProgress.js
    └── useDebouncedCallback.js
```

**Deliverable:** Empty folder structure committed, UI components created

---

#### **Day 2 (Tuesday): Extract Dashboard**

| #   | Task                         | Priority | Effort | Acceptance Criteria          |
| --- | ---------------------------- | -------- | ------ | ---------------------------- |
| 2.4 | Extract Dashboard.jsx        | 🔴 P0    | 2h     | Main dashboard view isolated |
| 2.5 | Extract ProgressRing.jsx     | 🔴 P0    | 1h     | SVG progress ring component  |
| 2.6 | Extract QuickStats.jsx       | 🔴 P0    | 1h     | Stats cards component        |
| 2.7 | Create useDashboardData hook | 🟡 P1    | 1h     | Logic separated from view    |

**Line-by-Line Review:** Submit Dashboard.jsx Tuesday EOD for mentor feedback

**Acceptance Criteria:**

- [ ] Dashboard.jsx < 150 lines
- [ ] ProgressRing accepts `percentage` prop, renders SVG
- [ ] QuickStats accepts `stats` object, displays 3 cards
- [ ] useDashboardData returns `{ stats, progress, loading }`
- [ ] No regressions in functionality
- [ ] Typography + brand colors applied

---

#### **Day 3 (Wednesday): Extract VisionQuiz & BudgetBuilder**

| #    | Task                                            | Priority | Effort | Acceptance Criteria        |
| ---- | ----------------------------------------------- | -------- | ------ | -------------------------- |
| 2.8  | Extract VisionQuiz.jsx                          | 🔴 P0    | 2h     | Quiz logic isolated        |
| 2.9  | Extract Question.jsx                            | 🔴 P0    | 1h     | Single question component  |
| 2.10 | Extract Result.jsx                              | 🔴 P0    | 1h     | Result display component   |
| 2.11 | Extract BudgetBuilder.jsx                       | 🔴 P0    | 2h     | Budget calculator isolated |
| 2.12 | Create useQuizLogic + useBudgetCalculator hooks | 🟡 P1    | 2h     | Logic hooks                |

**Acceptance Criteria:**

- [ ] VisionQuiz manages state, renders questions sequentially
- [ ] Question accepts `question` prop, handles user input
- [ ] Result calculates score, displays recommendations
- [ ] BudgetBuilder syncs percentage ↔ amount
- [ ] All features/vision-quiz/\* files < 200 lines each

---

#### **Day 4 (Thursday): Extract VendorTracker & TimelineManager**

| #    | Task                        | Priority | Effort | Acceptance Criteria        |
| ---- | --------------------------- | -------- | ------ | -------------------------- |
| 2.13 | Extract VendorTracker.jsx   | 🔴 P0    | 2h     | Vendor management isolated |
| 2.14 | Extract VendorCard.jsx      | 🔴 P0    | 1h     | Individual vendor card     |
| 2.15 | Extract VendorForm.jsx      | 🔴 P0    | 1h     | Add/edit vendor modal      |
| 2.16 | Extract TimelineManager.jsx | 🔴 P0    | 2h     | Task management isolated   |
| 2.17 | Extract TaskCard + TaskForm | 🔴 P0    | 2h     | Task components            |

**Acceptance Criteria:**

- [ ] VendorTracker displays vendor list, handles CRUD
- [ ] VendorCard shows vendor details, edit/delete buttons
- [ ] VendorForm modal for add/edit operations
- [ ] TimelineManager filters tasks, shows progress
- [ ] All components use shared UI components (Button, Input, Card)

---

#### **Day 5 (Friday): Integration & Testing**

| #    | Task                          | Priority | Effort | Acceptance Criteria                     |
| ---- | ----------------------------- | -------- | ------ | --------------------------------------- |
| 2.18 | Update InteractiveGuide shell | 🔴 P0    | 1h     | Imports feature components, < 200 lines |
| 2.19 | Test all features             | 🔴 P0    | 2h     | No regressions, everything works        |
| 2.20 | Fix any bugs                  | 🔴 P0    | 2h     | All functionality restored              |
| 2.21 | Code review prep              | 🟡 P1    | 1h     | Document changes, prepare demo          |

**InteractiveGuide.jsx After:**

```jsx
import Dashboard from "./features/dashboard/Dashboard";
import VisionQuiz from "./features/vision-quiz/VisionQuiz";
import BudgetBuilder from "./features/budget/BudgetBuilder";
import VendorTracker from "./features/vendors/VendorTracker";
import TimelineManager from "./features/timeline/TimelineManager";

export default function InteractiveGuide({ userEmail }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main>
        {activeSection === "dashboard" && <Dashboard userId={userEmail} />}
        {activeSection === "quiz" && <VisionQuiz userId={userEmail} />}
        {activeSection === "budget" && <BudgetBuilder userId={userEmail} />}
        {activeSection === "vendors" && <VendorTracker userId={userEmail} />}
        {activeSection === "timeline" && <TimelineManager userId={userEmail} />}
      </main>
    </div>
  );
}
```

**Deliverable:** Refactored codebase, Sprint 2 Review Document

---

### Sprint 2 Success Metrics

| Metric                    | Target                     | How to Measure                                           |
| ------------------------- | -------------------------- | -------------------------------------------------------- |
| InteractiveGuide.jsx Size | < 200 lines                | Line count                                               |
| Largest Feature Component | < 300 lines                | Line count on Dashboard, Quiz, Budget, Vendors, Timeline |
| Code Duplication          | < 5%                       | SonarQube or manual review                               |
| Component Reusability     | ≥ 3 features use shared UI | Import analysis                                          |
| Functionality             | 0 regressions              | Manual testing checklist                                 |
| Hook Extraction           | 100% logic in hooks        | Visual inspection                                        |

---

## 📅 SPRINT 3: Polish & Accessibility

**Dates:** October 21-25, 2025  
**Review:** Friday October 25, 5:00 PM (FINAL REVIEW)

### Task Breakdown

#### **Day 1 (Monday): Mobile Navigation**

| #   | Task                               | Priority | Effort | Acceptance Criteria    |
| --- | ---------------------------------- | -------- | ------ | ---------------------- |
| 3.1 | Create hamburger menu component    | 🔴 P0    | 2h     | Toggleable mobile nav  |
| 3.2 | Update Dashboard header for mobile | 🔴 P0    | 1h     | Responsive header      |
| 3.3 | Test navigation on mobile          | 🔴 P0    | 1h     | Works on 360px screens |

**Mobile Nav Example:**

```jsx
// src/components/ui/MobileNav.jsx
export default function MobileNav({
  isOpen,
  onClose,
  sections,
  activeSection,
  onSectionChange,
}) {
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"} md:hidden`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-2xl p-6">
        <button onClick={onClose} className="mb-8">
          ✕ Close
        </button>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                onClose();
              }}
              className={
                activeSection === section.id
                  ? "bg-[#CE805C] text-white"
                  : "text-gray-900"
              }
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

---

#### **Day 2 (Tuesday): Responsive Typography & Touch Targets**

| #   | Task                                  | Priority | Effort | Acceptance Criteria                 |
| --- | ------------------------------------- | -------- | ------ | ----------------------------------- |
| 3.4 | Implement responsive typography scale | 🟡 P1    | 1h     | Text scales properly 360px → 1920px |
| 3.5 | Audit touch target sizes              | 🔴 P0    | 1h     | All buttons/links ≥ 44x44px         |
| 3.6 | Fix any undersized targets            | 🔴 P0    | 1h     | Padding added where needed          |

**Typography Scale:**

```jsx
// Responsive classes
<h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
<p className="font-inter text-sm sm:text-base md:text-lg">
```

**Touch Targets:**

```css
/* Minimum 44x44px for all interactive elements */
button,
a {
  min-height: 44px;
  min-width: 44px;
}
```

---

#### **Day 3 (Wednesday): Dark Mode & Keyboard Navigation**

| #   | Task                          | Priority | Effort | Acceptance Criteria           |
| --- | ----------------------------- | -------- | ------ | ----------------------------- |
| 3.7 | Fix dark mode inconsistencies | 🟡 P1    | 2h     | All components respect toggle |
| 3.8 | Keyboard navigation audit     | 🔴 P0    | 1h     | Tab order logical, no traps   |
| 3.9 | Add keyboard shortcuts        | 🟢 P2    | 1h     | Esc closes modals, etc.       |

**Dark Mode Fix:**

```jsx
// Ensure ALL components check darkMode state
<div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
```

**Keyboard Shortcuts:**

- `Esc` closes modals/dropdowns
- `Tab` navigates forward
- `Shift+Tab` navigates backward
- `Enter`/`Space` activates buttons
- Arrow keys navigate lists

---

#### **Day 4 (Thursday): LoginGate Redesign & Enhanced UX**

| #    | Task                         | Priority | Effort | Acceptance Criteria             |
| ---- | ---------------------------- | -------- | ------ | ------------------------------- |
| 3.10 | Implement LoginGate refactor | 🟡 P1    | 2h     | Per CODE_REVIEW_LOGINGGATE.md   |
| 3.11 | Add social proof sections    | 🟢 P2    | 1.5h   | Testimonials on landing pages   |
| 3.12 | Add FAQ sections             | 🟢 P2    | 1.5h   | Accordion with common questions |

**Social Proof:**

```jsx
<div className="text-center mb-12">
  <p className="font-inter text-white/80 text-lg mb-4">
    Join 500+ couples planning their perfect Hausa wedding
  </p>
  <div className="flex justify-center gap-1">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="text-2xl text-yellow-400">
        ⭐
      </span>
    ))}
  </div>
</div>
```

---

#### **Day 5 (Friday): Final Audit & Go-Live Prep**

| #    | Task                     | Priority | Effort | Acceptance Criteria            |
| ---- | ------------------------ | -------- | ------ | ------------------------------ |
| 3.13 | Screen reader testing    | 🔴 P0    | 2h     | Test with NVDA/VoiceOver       |
| 3.14 | Final Lighthouse audit   | 🔴 P0    | 1h     | All scores ≥ 90                |
| 3.15 | Cross-device testing     | 🔴 P0    | 2h     | iPhone, Android, iPad, Desktop |
| 3.16 | Create go-live checklist | 🔴 P0    | 1h     | Pre-launch verification        |
| 3.17 | Final sprint review      | 🔴 P0    | 1h     | Demo + retrospective           |

**Screen Reader Test Checklist:**

- [ ] Navigate entire site with keyboard only
- [ ] Turn on NVDA (Windows) or VoiceOver (Mac)
- [ ] Listen to all headings, links, buttons
- [ ] Verify ARIA labels are read correctly
- [ ] Test form inputs with screen reader
- [ ] Check landmark navigation (<main>, <nav>, etc.)

**Final Lighthouse Targets:**

- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 90

**Deliverable:** Production-ready application, Final Review Document

---

### Sprint 3 Success Metrics

| Metric                      | Target                        | How to Measure                     |
| --------------------------- | ----------------------------- | ---------------------------------- |
| Lighthouse Accessibility    | ≥ 95                          | Lighthouse audit                   |
| Mobile Usability            | 100%                          | Google Mobile-Friendly Test        |
| Screen Reader Compatibility | 0 blockers                    | Manual testing with NVDA/VoiceOver |
| Keyboard Navigation         | 100% operable                 | Manual keyboard-only test          |
| Dark Mode Coverage          | 100% components               | Visual inspection                  |
| Touch Target Compliance     | 100%                          | Manual audit                       |
| Cross-Browser Compatibility | Chrome, Firefox, Safari, Edge | BrowserStack or manual             |

---

## 📊 Overall Project Metrics

### Code Quality Improvements

| Metric                    | Before      | Target After | How to Measure      |
| ------------------------- | ----------- | ------------ | ------------------- |
| InteractiveGuide.jsx Size | 3754 lines  | < 200 lines  | Line count          |
| Component Count           | 3           | 20+          | File count          |
| Typography Application    | 0%          | 100%         | Visual inspection   |
| Accessibility Score       | 60          | 95+          | Lighthouse          |
| Image Usage               | 0/15 assets | 6/15 assets  | File usage analysis |
| Focus State Coverage      | 0%          | 100%         | Keyboard test       |
| Brand Color Consistency   | 60%         | 100%         | Code review         |

### User Experience Improvements

| Area               | Before              | After                           |
| ------------------ | ------------------- | ------------------------------- |
| **Visual Design**  | Generic purple/pink | Authentic Hausa brand colors    |
| **Typography**     | System sans-serif   | Elegant Playfair + Modern Inter |
| **Imagery**        | No photos           | Culturally relevant hero images |
| **Navigation**     | Desktop-only        | Mobile hamburger menu           |
| **Accessibility**  | Limited             | WCAG 2.1 AA compliant           |
| **Loading States** | Basic               | Spinners + smooth transitions   |
| **Error Handling** | Plain text          | ARIA live regions + styling     |

---

## 🎯 Definition of Done (Per Sprint)

### Sprint 1 Done When:

- [ ] All tasks 1.1-1.24 completed
- [ ] Lighthouse scores ≥ 80 on all metrics
- [ ] axe DevTools shows 0 critical issues
- [ ] Typography applied to 100% of text
- [ ] 5+ images integrated
- [ ] Sprint review document submitted
- [ ] Mentor approval received

### Sprint 2 Done When:

- [ ] All tasks 2.1-2.21 completed
- [ ] InteractiveGuide.jsx < 200 lines
- [ ] 5 feature folders created
- [ ] Shared UI components extracted
- [ ] 0 functional regressions
- [ ] Dashboard.jsx reviewed by mentor
- [ ] Sprint review document submitted

### Sprint 3 Done When:

- [ ] All tasks 3.1-3.17 completed
- [ ] Lighthouse accessibility ≥ 95
- [ ] Mobile navigation works on 360px
- [ ] Screen reader tested (0 blockers)
- [ ] Keyboard navigation 100% functional
- [ ] LoginGate refactored per review
- [ ] Final review passed
- [ ] **READY FOR PRODUCTION LAUNCH**

---

## 🚦 Risk Management

### High Risk Items

| Risk                                      | Probability | Impact | Mitigation Strategy                                  |
| ----------------------------------------- | ----------- | ------ | ---------------------------------------------------- |
| InteractiveGuide refactor breaks features | Medium      | High   | Incremental extraction, test after each component    |
| Accessibility fixes impact design         | Low         | Medium | Review WCAG early, design with accessibility in mind |
| Mobile optimization delays                | Medium      | Medium | Start mobile testing in Sprint 1                     |
| Time overrun on refactoring               | High        | Medium | Prioritize extraction order, drop nice-to-haves      |

### Mitigation Actions

1. **Daily commits** to avoid losing work
2. **Test immediately** after each extraction
3. **Request mentor review early** (Dashboard Tuesday)
4. **Use feature flags** if needed to rollback changes
5. **Keep old code commented** until fully tested

---

## 📞 Communication Plan

### Daily Check-Ins

- **Time:** 9:00 AM
- **Format:** Slack message
- **Content:** Yesterday's progress, today's plan, blockers

### Mentor Reviews

- **Sprint 1:** Friday October 11, 5:00 PM
- **Sprint 2 Mid-Review:** Tuesday October 15, 5:00 PM (Dashboard only)
- **Sprint 2 Final:** Friday October 18, 5:00 PM
- **Sprint 3 Final:** Friday October 25, 5:00 PM

### Questions/Blockers

- **Response Time:** Within 4 hours during work hours
- **Escalation:** If blocked > 1 day, schedule call

---

## 🎓 Learning Objectives

By completing this sprint plan, you will learn:

### Technical Skills

✅ Component architecture patterns (feature-folder structure)  
✅ Custom React hooks for logic separation  
✅ Accessibility best practices (WCAG 2.1 AA)  
✅ Responsive design with mobile-first approach  
✅ Performance optimization (image lazy loading, code splitting)  
✅ Design system consistency (typography, colors, spacing)

### Soft Skills

✅ Breaking large tasks into manageable sprints  
✅ Prioritization (P0/P1/P2 framework)  
✅ Self-review and documentation  
✅ Estimating effort accurately  
✅ Iterative development with feedback loops

---

## 📚 Resources

### Tools

- **Lighthouse:** Chrome DevTools → Lighthouse tab
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **NVDA Screen Reader:** https://www.nvaccess.org/download/
- **Squoosh Image Optimizer:** https://squoosh.app/
- **BrowserStack:** https://www.browserstack.com/ (or use real devices)

### Documentation

- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **React Hook Patterns:** https://usehooks.com/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/

### Code Examples

- **Feature-Folder Structure:** https://kentcdodds.com/blog/colocation
- **Custom Hooks:** https://react.dev/learn/reusing-logic-with-custom-hooks
- **Accessible Forms:** https://www.w3.org/WAI/tutorials/forms/

---

## ✅ Next Steps

1. **Read this entire backlog** (you just did! ✓)
2. **Ask clarifying questions** (if any remain)
3. **Get mentor approval** on this plan
4. **Start Sprint 1, Day 1** on Monday October 7
5. **Commit early and often**
6. **Don't be afraid to ask for help!**

---

**Remember:** Progress > Perfection. Ship working increments every day, get feedback, iterate.

You've got this! 🚀
