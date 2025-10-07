# 🎯 Vendor Tracker - Quick Test Guide

**Dev Server:** http://localhost:5174/  
**Time Needed:** ~15 minutes for essential tests

---

## ✅ Quick Test Checklist

### 1. Empty State (2 min)

```
1. Navigate to "Vendor Tracker" tab
2. Should see 💼 icon
3. Should see "No vendors added yet"
4. Should see "Add Your First Vendor" button
5. Click button → Modal should open
```

### 2. Add First Vendor (3 min)

```
Modal Form:
Name: Elegant Events Hall
Category: Venue & Location
Contact: +234 803 123 4567
Status: Researching
Notes: Recommended by Aunty. Capacity: 500 guests.

Click "Add Vendor"
✅ Modal closes
✅ Card appears in grid
✅ "Saved ✓" appears briefly
```

### 3. Add Cultural Vendor (3 min)

```
Click "Add Vendor"

Name: Hadiza's Traditional Crafts
Category: Kayan Lefe (Traditional Gifts) 🎁
Contact: WhatsApp: +234 810 555 7890
Status: Quoted
Notes: Quote: ₦250,000 for complete set.

Click "Add Vendor"
✅ Category badge shows "Kayan Lefe"
✅ Status badge is YELLOW
```

### 4. Test Status Colors (2 min)

```
Add 5 vendors with different statuses:

Vendor A → Researching → Should be GRAY badge
Vendor B → Contacted → Should be BLUE badge
Vendor C → Quoted → Should be YELLOW badge
Vendor D → Booked → Should be GREEN badge
Vendor E → Declined → Should be RED badge ❌

✅ All 5 colors correct?
✅ Declined (red) stands out?
```

### 5. Edit Vendor (2 min)

```
1. Click "Edit" on Vendor A (Researching)
2. Modal should pre-fill all data ✅
3. Change Status: Researching → Contacted
4. Click "Save Changes"
5. Badge should change: GRAY → BLUE ✅
```

### 6. Delete Vendor (1 min)

```
1. Click "Delete" on Vendor E (Declined)
2. Confirmation dialog appears? ✅
3. Click OK
4. Card disappears immediately ✅
```

### 7. Filter Test (2 min)

```
Category Filter: "Kayan Lefe"
✅ Only Hadiza's vendor shows

Status Filter: "Booked"
✅ Only booked vendor shows

Clear Filters
✅ All vendors show again
```

### 8. Responsive Test (2 min)

```
Open DevTools (F12)

375px width (mobile):
✅ 1 column grid
✅ Filters stacked

768px width (tablet):
✅ 2 column grid
✅ Filters side-by-side

1440px width (desktop):
✅ 3 column grid
```

### 9. Persistence Test (1 min)

```
1. Refresh page (F5)
2. All vendors still there? ✅
3. Status changes saved? ✅
```

---

## 🐛 Watch For These

### Critical Issues 🔴

- [ ] Modal doesn't open
- [ ] Can't add vendor
- [ ] Can't edit vendor
- [ ] Can't delete vendor
- [ ] Data doesn't save after refresh
- [ ] Filters don't work

### Visual Issues 🟡

- [ ] Status colors wrong
- [ ] Declined badge not red
- [ ] Cards don't show all info
- [ ] Notes don't truncate
- [ ] Grid columns wrong on mobile/desktop
- [ ] Hover effects missing

### Minor Issues 🟢

- [ ] Validation message unclear
- [ ] Empty state message confusing
- [ ] Alignment slightly off
- [ ] Colors not exact match

---

## ✨ Expected Behavior

### Status Badge Colors

- Researching = Gray
- Contacted = Blue
- Quoted = Yellow
- Booked = Green
- Declined = **RED** (should stand out!)

### Grid Layout

- Mobile (< 768px) = 1 column
- Tablet (768-1024px) = 2 columns
- Desktop (> 1024px) = 3 columns

### Validation

- Name required
- Contact required
- Alert if either missing

### Empty States

- No vendors at all = "No vendors added yet" + CTA button
- Filters active, no match = "No vendors match your filters"

---

## 📱 Quick Mobile Test

```
iPhone SE (375px):
1. Navigate to Vendor Tracker
2. Add vendor using modal
3. Modal should be full-width ✅
4. Form fields should be touch-friendly ✅
5. Grid should be 1 column ✅
6. Buttons should be easy to tap ✅
```

---

## 🎯 Pass/Fail Criteria

### ✅ PASS if:

- Can add vendors
- Can edit vendors
- Can delete vendors (with confirmation)
- All 11 categories work
- All 5 status colors correct
- Declined status is RED
- Filters work (category, status, combined)
- Clear Filters resets both
- Empty states show correctly
- Data persists after refresh
- Responsive grids work (1/2/3 columns)
- Modal opens/closes properly
- Form validation works

### ❌ FAIL if:

- Can't perform CRUD operations
- Status colors wrong (especially Declined not red)
- Filters don't work
- Data doesn't save
- Crashes or errors
- Layout breaks on mobile
- Modal doesn't open

---

## 🚀 If All Tests Pass

**Next Steps:**

1. Mark feature as ✅ Complete
2. Proceed to Timeline & Tasks OR Vision Quiz
3. Celebrate! 🎉

**If Issues Found:**

1. Document in VENDOR_TRACKER_TEST_REPORT.md
2. Fix critical issues first
3. Re-test after fixes

---

## 📋 Test Data Quick Copy-Paste

### Vendor 1 (Venue)

```
Name: Elegant Events Hall
Category: Venue & Location
Contact: +234 803 123 4567
Status: Researching
Notes: Recommended by Aunty Halima. Capacity: 500 guests.
```

### Vendor 2 (Kayan Lefe) 🎁

```
Name: Hadiza's Traditional Crafts
Category: Kayan Lefe (Traditional Gifts)
Contact: WhatsApp: +234 810 555 7890
Status: Quoted
Notes: Quote: ₦250,000 for complete set.
```

### Vendor 3 (Photography)

```
Name: Moments by Abdullahi
Category: Photography & Videography
Contact: +234 706 987 6543
Status: Booked
Notes: ✅ CONFIRMED! Full day coverage + drone.
```

### Vendor 4 (Henna) ✋

```
Name: Ladi's Henna Designs
Category: Henna Artist
Contact: ladidesigns@whatsapp.com
Status: Researching
Notes: Instagram: @ladihennadesigns. Beautiful patterns.
```

### Vendor 5 (Declined)

```
Name: Expensive Venue Co
Category: Venue & Location
Contact: +234 800 999 0000
Status: Declined
Notes: ❌ Too expensive. Over budget.
```

---

**Ready? Let's test! 🎯**
