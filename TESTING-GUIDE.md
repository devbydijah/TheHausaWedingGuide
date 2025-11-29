# 🧪 Data Persistence Testing Guide - Phase 1

## Test URL

```
http://localhost:5174/?test=true
```

## 🎯 Testing Objectives

Verify that all features properly save and persist data across:

- ✅ Page refreshes (F5)
- ✅ Browser close/reopen
- ✅ Feature navigation
- ✅ localStorage backup
- ✅ Cloud sync (if Supabase configured)

---

## 📋 Testing Checklist

### 🔧 Before You Start

- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab to see logs
- [ ] Open http://localhost:5174/?test=true
- [ ] Verify Debug Panel appears in bottom-right corner
- [ ] Click Debug Panel to expand it

---

### 1️⃣ Vision Quiz Testing

**Actions:**

- [ ] Navigate to "Vision Quiz" tab
- [ ] Answer at least 3 questions
- [ ] Watch for "Syncing..." → "Saved!" animation
- [ ] Check Debug Panel shows "Quiz: In Progress"
- [ ] Complete the quiz and submit
- [ ] Watch for toast: "Quiz results saved! Your wedding vision is ready."
- [ ] See bouncing checkmark animation
- [ ] Check timestamp updates in sync status

**Persistence Tests:**

- [ ] Refresh page (F5) - answers should persist
- [ ] Navigate to Dashboard and back - quiz state preserved
- [ ] Click "Log Data to Console" - verify visionQuiz object exists
- [ ] Click "Check LocalStorage" - confirm data saved

**Expected Results:**
✅ Quiz answers save as you type
✅ Animation shows on submit
✅ Data persists after refresh
✅ visionQuiz.result contains style profile

---

### 2️⃣ Vision Planner Testing

**Actions:**

- [ ] Navigate to "Vision & Values" tab
- [ ] Move priority sliders (Cultural, Budget, Family, Personal)
- [ ] Watch "Syncing..." indicator briefly appear
- [ ] See "Saved" with timestamp after 1.5 seconds
- [ ] Add your niyyah (intention) in text field
- [ ] Type couple names if present
- [ ] Check Debug Panel updates after changes

**Persistence Tests:**

- [ ] Refresh page (F5) - slider positions should stay
- [ ] Navigate away and back - text inputs preserved
- [ ] Check Debug Panel "Last Update" timestamp
- [ ] Verify green checkmark animation on save

**Expected Results:**
✅ Priorities save with 1.5s debounce
✅ Text fields auto-save
✅ Data survives navigation
✅ No data loss on refresh

---

### 3️⃣ Budget Builder Testing

**Actions:**

- [ ] Navigate to "Budget Builder" tab
- [ ] Set total budget (e.g., ₦5,000,000)
- [ ] Watch save animation
- [ ] Add/edit budget categories
- [ ] Allocate amounts to categories
- [ ] Check Debug Panel shows updated budget

**Persistence Tests:**

- [ ] Refresh page (F5) - budget amounts preserved
- [ ] Check Debug Panel: "Budget: ₦X,XXX,XXX"
- [ ] Navigate to Dashboard - budget shows in stats
- [ ] Log data - verify totalBudget and categories

**Expected Results:**
✅ Budget saves automatically
✅ Categories persist
✅ Calculations remain accurate
✅ Dashboard reflects budget data

---

### 4️⃣ Vendor Tracker Testing

**Actions:**

- [ ] Navigate to "Vendor Tracker" tab
- [ ] Add a vendor (name, category, phone, etc.)
- [ ] Watch "Syncing..." → "Saved!" animation
- [ ] Add 2-3 more vendors
- [ ] Edit vendor details
- [ ] Check Debug Panel: "Vendors: X"

**Persistence Tests:**

- [ ] Refresh page (F5) - all vendors should appear
- [ ] Delete a vendor - confirm it stays deleted after refresh
- [ ] Add vendor, navigate away, come back - vendor persists
- [ ] Check LocalStorage - verify vendorList array

**Expected Results:**
✅ Vendors save immediately
✅ All vendor data persists
✅ Edits and deletions persist
✅ Count updates in Debug Panel

---

### 5️⃣ Timeline Manager Testing

**Actions:**

- [ ] Navigate to "Timeline Manager" tab
- [ ] Set wedding date
- [ ] Watch save confirmation
- [ ] Add task (title, date, notes)
- [ ] Mark task as complete
- [ ] Add 2-3 more tasks
- [ ] Check Debug Panel: "Tasks: X"

**Persistence Tests:**

- [ ] Refresh page (F5) - date and tasks preserved
- [ ] Toggle task completion - state persists after refresh
- [ ] Navigate to Dashboard - countdown shows correct days
- [ ] Verify taskList in console

**Expected Results:**
✅ Wedding date saves
✅ Tasks persist with all details
✅ Completion status preserved
✅ Dashboard shows timeline data

---

### 6️⃣ Final Blueprint Testing

**Actions:**

- [ ] Complete some data in each section above
- [ ] Navigate to "Final Blueprint" tab
- [ ] Verify all entered data appears
- [ ] Check each section displays correctly

**Persistence Tests:**

- [ ] Refresh page (F5) - all data should display
- [ ] Verify data integrity across all sections
- [ ] Export/download should include all data

**Expected Results:**
✅ Shows aggregated data from all features
✅ No missing information
✅ Data matches what was entered

---

## 🔍 Advanced Testing

### Cross-Session Persistence

1. [ ] Enter data in multiple sections
2. [ ] Close browser completely
3. [ ] Reopen browser
4. [ ] Navigate to http://localhost:5174/?test=true
5. [ ] Verify all data is still present

### LocalStorage Verification

1. [ ] Open DevTools → Application tab
2. [ ] Expand "Local Storage" → http://localhost:5174
3. [ ] Find "hausaGuideData" key
4. [ ] Click to view JSON data
5. [ ] Verify all your test data is present

### Network Offline Testing

1. [ ] Open DevTools → Network tab
2. [ ] Check "Offline" to simulate no connection
3. [ ] Make changes in the app
4. [ ] Watch for "Working Offline" indicator
5. [ ] Uncheck "Offline" to go back online
6. [ ] Watch for auto-sync attempt
7. [ ] Verify "Connection restored! Syncing..." toast

---

## 📊 Debug Panel Features

### Status Indicators

- **Green dot** = Successfully saved
- **Yellow dot (pulsing)** = Currently syncing
- **Red dot** = Error occurred

### Buttons

- **Log Data to Console** - View current app state
- **Check LocalStorage** - View raw stored data
- **Clear Test Data** - Reset all data and refresh

---

## ✅ Success Criteria

All tests pass if:

- ✅ Data persists after page refresh
- ✅ Data survives browser close/reopen
- ✅ No data loss when navigating between features
- ✅ Save animations appear consistently
- ✅ Sync status updates correctly
- ✅ LocalStorage contains all entered data
- ✅ Debug Panel shows accurate counts
- ✅ No errors in browser console

---

## 🐛 What to Report if Something Fails

1. Which feature/action failed?
2. What did you expect to happen?
3. What actually happened?
4. Check browser console for errors (F12)
5. Check Debug Panel status
6. Try "Log Data to Console" and share output

---

## 📝 Notes

- Auto-save has a **1.5 second debounce** - wait briefly after typing
- **Bouncing checkmark** indicates successful save
- **Timestamp** shows when last save occurred
- **Green background flash** on sync status means data just saved
- Test mode uses **localStorage only** (no Supabase)

---

**Happy Testing! 🎉**
