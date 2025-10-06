# Repository Cleanup Plan

**Date:** October 6, 2025  
**Branch:** interactive-guide  
**Purpose:** Remove redundant, obsolete, and unused files to streamline the repository

---

## 📋 Cleanup Categories

### 1. **Redundant Documentation** (39 files → Keep 8 core files)

#### Files to KEEP (Essential Documentation):
- ✅ **README.md** - Main project documentation
- ✅ **CONTRIBUTING.md** - Contribution guidelines
- ✅ **LICENSE** - Project license
- ✅ **SPRINT_3_REVIEW.md** - Latest sprint review (production-ready status)
- ✅ **GO_LIVE_CHECKLIST.md** - Final deployment checklist
- ✅ **QUICK_SETUP_GUIDE.md** - Quick start for developers
- ✅ **.github/copilot-instructions.md** - AI coding agent guidelines
- ✅ **LOCAL_TESTING_GUIDE.md** - Development testing guide

#### Files to DELETE (Redundant/Outdated):

**Sprint/Phase Documentation (28 files):**
- ❌ BUDGET_BUILDER_COMPLETE.md (feature completed, covered in SPRINT_3_REVIEW.md)
- ❌ BUILD_ROADMAP.md (outdated roadmap)
- ❌ CODE_REVIEW_LOGINGGATE.md (review complete, changes implemented)
- ❌ COMPLETE_PROJECT_SUMMARY.md (redundant with SPRINT_3_REVIEW.md)
- ❌ DEPLOYMENT_GUIDE.md (covered in QUICK_SETUP_GUIDE.md)
- ❌ DEPLOYMENT_URLS_FINAL.md (URLs in QUICK_SETUP_GUIDE.md)
- ❌ FEATURE_COMPLETE_SUMMARY.md (covered in SPRINT_3_REVIEW.md)
- ❌ FINAL_SETUP.md (redundant with QUICK_SETUP_GUIDE.md)
- ❌ GLOBAL_FEATURES_COMPLETE.md (features documented in SPRINT_3_REVIEW.md)
- ❌ GUIDE_DEVELOPMENT.md (development complete)
- ❌ MARKETING_PREP.md (not code-related, move to separate repo)
- ❌ PAYSTACK_SETUP_GUIDE.md (covered in QUICK_SETUP_GUIDE.md)
- ❌ PAYSTACK_STOREFRONT_SETUP.md (covered in QUICK_SETUP_GUIDE.md)
- ❌ PHASE_1A_COMPLETE.md (historical, covered in SPRINT_3_REVIEW.md)
- ❌ PHASE_1B_COMPLETE.md (historical)
- ❌ PHASE_1C_COMPLETE.md (historical)
- ❌ PHASE_2_COMPLETE.md (historical)
- ❌ PHASE_2_PLAN.md (historical planning doc)
- ❌ PHASE_3_DEPLOYMENT_CHECKLIST.md (covered in GO_LIVE_CHECKLIST.md)
- ❌ POST_PAYMENT_FLOW.md (flow documented in copilot-instructions.md)
- ❌ QUICK_TEST_GUIDE.md (covered in LOCAL_TESTING_GUIDE.md)
- ❌ SETUP_GUIDE.md (redundant with QUICK_SETUP_GUIDE.md)
- ❌ SPRINT_2_PLAN.md (planning complete)
- ❌ SPRINT_2_REVIEW.md (superseded by SPRINT_3_REVIEW.md)
- ❌ SPRINT_2_SUMMARY.md (superseded)
- ❌ SPRINT_3_DAY_2_NOTES.md (implementation notes, no longer needed)
- ❌ SPRINT_3_PLAN.md (planning complete, covered in SPRINT_3_REVIEW.md)
- ❌ SPRINT_BACKLOG_UI_UX.md (backlog complete)
- ❌ STOREFRONT_VS_PAYMENT_LINKS.md (decision made, documented in QUICK_SETUP_GUIDE.md)
- ❌ SUPABASE_SETUP.md (Supabase integration optional/legacy)
- ❌ TEST_VENDORS.md (testing notes)
- ❌ VENDOR_TRACKER_COMPLETE.md (feature documented in SPRINT_3_REVIEW.md)
- ❌ VENDOR_TRACKER_SUMMARY.md (redundant)
- ❌ VENDOR_TRACKER_TEST_REPORT.md (testing complete)
- ❌ VERCEL_DEPLOYMENT_CHECK.md (deployment info in GO_LIVE_CHECKLIST.md)
- ❌ VISION_QUIZ_COMPLETE.md (feature documented in SPRINT_3_REVIEW.md)

### 2. **Test/Debug HTML Files** (7 files → Keep 1)

#### Files to KEEP:
- ✅ **public/debug.html** - Useful for payment flow testing (protect in production)

#### Files to DELETE:
- ❌ public/debug-session.html (redundant debug page)
- ❌ public/download.html (not used, download via App.jsx)
- ❌ public/success.html (not used, success via App.jsx)
- ❌ public/supabase-setup.html (setup complete, Supabase optional)
- ❌ public/test-auth.html (testing complete)
- ❌ public/test-email.html (testing complete)

### 3. **SQL Files** (6 files → Keep 0, use SQLite auto-creation)

#### Files to DELETE (All):
- ❌ sql/complete_setup.sql (SQLite auto-creates schema)
- ❌ sql/create_sales_table.sql (legacy, not used)
- ❌ sql/create_user_progress.sql (Supabase optional/legacy)
- ❌ sql/fix_rls.sql (Supabase optional/legacy)
- ❌ sql/setup.sql (legacy)
- ❌ sql/supabase_schema.sql (Supabase optional/legacy)
- ❌ **sql/** (entire directory - SQLite database auto-creates)

### 4. **Unused Files**

#### Files to DELETE:
- ❌ local-test.js (not referenced anywhere, testing complete)

### 5. **Batch/Shell Scripts** (3 files → Keep all for cross-platform)

#### Files to KEEP:
- ✅ **deploy.bat** - Windows deployment script
- ✅ **setup.bat** - Windows setup script
- ✅ **setup.sh** - Unix/Mac setup script

---

## 📊 Cleanup Summary

| Category | Before | After | Removed |
|----------|--------|-------|---------|
| Documentation (MD) | 39 files | 8 files | 31 files |
| Public HTML | 7 files | 1 file | 6 files |
| SQL Scripts | 6 files | 0 files | 6 files |
| Test Scripts | 1 file | 0 files | 1 file |
| **TOTAL** | **53 files** | **9 files** | **44 files** |

**Repository Size Reduction:** ~83% fewer files in root/public/sql

---

## ✅ Files Retained (Core)

### Documentation (8 files):
1. README.md
2. CONTRIBUTING.md
3. LICENSE
4. SPRINT_3_REVIEW.md
5. GO_LIVE_CHECKLIST.md
6. QUICK_SETUP_GUIDE.md
7. LOCAL_TESTING_GUIDE.md
8. .github/copilot-instructions.md

### Public Assets (1 file):
9. public/debug.html (with production guard)

### Scripts (3 files):
10. deploy.bat
11. setup.bat
12. setup.sh

### Active Codebase:
- src/ (all files kept - production code)
- api/ (all files kept - serverless functions)
- lib/ (all files kept - utilities)
- public/assets/ (all image assets)
- public/Hausa_Wedding_Guide.pdf (product file)
- Configuration files (package.json, vite.config.js, tailwind.config.js, vercel.json, index.html)

---

## 🎯 Rationale

### Why Remove Sprint/Phase Documentation?

**SPRINT_3_REVIEW.md** is the comprehensive final document containing:
- All sprint achievements (1, 2, and 3)
- Complete feature list
- Accessibility audit results
- Production readiness checklist
- Testing results
- Technical implementation details

**Historical sprint docs serve no purpose post-completion.**

### Why Keep Only 1 Debug HTML?

**public/debug.html** is the primary debugging tool for:
- Payment flow simulation
- Token generation testing
- Webhook testing

**Other debug/test pages were one-time setup tools.**

### Why Remove ALL SQL Files?

**SQLite database (`downloads.db`) auto-creates on first run.**  
Schema is defined in `lib/database.cjs` - no external SQL files needed.

**Supabase is optional/legacy** - not required for core functionality.

### Why Keep QUICK_SETUP_GUIDE.md?

Consolidates:
- Environment variable setup
- Paystack configuration
- Deployment URLs
- Webhook setup

**Single source of truth for setup.**

---

## 🚀 Post-Cleanup Benefits

1. **Cleaner Repository** - Easy to navigate, no outdated files
2. **Faster Clones** - Smaller repo size
3. **Reduced Confusion** - No conflicting documentation
4. **Better Onboarding** - Clear, focused documentation
5. **Easier Maintenance** - Fewer files to update
6. **Professional Appearance** - Production-ready codebase

---

## 📝 Execution Steps

1. Create `docs/archive/` directory for historical reference
2. Move all deleted docs to archive (optional)
3. Delete redundant files from working tree
4. Update README.md to reference correct docs
5. Update .gitignore if needed
6. Commit cleanup with detailed message
7. Verify build still works
8. Test all functionality

---

**Recommendation:** Execute cleanup immediately - all removed files are redundant or historical.
