# Interactive Guide Development Guide

## What We Just Built (Step 1 Complete! 🎉)

### 1. Expanded Data Model

We updated `InteractiveGuide.jsx` to include ALL the localStorage keys from your plan:

**Vision & Values Section:**

- `visionQuiz` - For the bride quiz (coming next)
- `weddingPriorities` - Top 5 priorities list ✅ DONE
- `niyyahDua` - Personal prayers/intentions ✅ DONE
- `brideJournal` - Free-form notes ✅ DONE

**Budget Builder Section:**

- `totalBudget` - Total budget amount
- `budgetCategories` - Breakdown by category (venue, catering, etc.)
- `vendorQuotes` - Vendor price comparisons

**Vendor Tracker:**

- `vendorList` - All vendors with contacts and status

**Timeline & Tasks:**

- `taskList` - Wedding tasks with due dates
- `milestones` - Key dates

**Final Blueprint:**

- `finalChecklist` - Master checklist
- `exportReady` - PDF export flag

### 2. Built the Vision & Values Section ✅

This is your **first working feature**! It includes:

- **Top 5 Priorities:** Users can add/remove up to 5 priorities
- **Niyyah & Dua:** Textarea for personal prayers
- **Bride's Journal:** Free-form notes space
- **Auto-save:** All changes save with visual feedback ("Saving..." → "Saved")

### 3. UX Improvements ✅

- **Section tabs:** Easy navigation between different parts
- **Save status:** Shows "Saving..." and "Saved" feedback
- **Back to Home button:** Users can navigate back to main site
- **Better styling:** Uses the app's brand color (#CE805C)
- **Mobile-responsive:** Works on phones with horizontal scroll tabs

### 4. Code Structure

- Each section is its own component (easier to manage)
- Placeholder sections (Budget, Vendors, Timeline) ready for you to build
- Legacy checklists preserved in "Legacy Checklists" tab

---

## How to Test What We Built

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Open the guide:**
   Navigate to: `http://localhost:5173/?guide=1&email=test@test.com&token=sample123`

3. **Test the Vision & Values section:**
   - Click "Vision & Values" tab (should be active by default)
   - Add some priorities (try adding 5 to see the limit)
   - Remove a priority
   - Type in the Niyyah & Dua box
   - Type in the Journal
   - Watch for "Saving..." → "Saved" messages
   - Refresh the page - your data should persist!

4. **Test navigation:**
   - Click through the tabs (Budget, Vendors, etc.)
   - Notice they show placeholder messages
   - Click "Legacy Checklists" to see the old MVP checklists

---

## What to Build Next (Your Roadmap)

### Step 2: Build the Budget Builder (Recommended Next)

This is a great learning opportunity because it involves:

- Number inputs
- Percentage calculations
- Real-time updates
- Validation (warning when over 100%)

**What to build:**

1. Total budget input field
2. Category breakdown (6 categories from the plan)
3. Auto-calculate percentages or amounts
4. Show warning if percentages don't add to 100%
5. Simple table showing all categories

**Where to code it:**
The `BudgetSection` component in `InteractiveGuide.jsx` (around line 300)

**New handlers you'll need:**

```javascript
const updateTotalBudget = (amount) =>
  updateData((p) => ({ ...p, totalBudget: amount }));

const updateCategory = (category, field, value) =>
  updateData((p) => ({
    ...p,
    budgetCategories: {
      ...p.budgetCategories,
      [category]: {
        ...p.budgetCategories[category],
        [field]: value,
      },
    },
  }));
```

### Step 3: Add the Vision Quiz (Optional Fun Feature)

Create a simple multiple-choice quiz:

- 3-5 questions about wedding style
- 4 options each
- Show a "bride type" result at the end

### Step 4: Build Vendor Tracker

Simple CRUD (Create, Read, Update, Delete) for vendors:

- Form to add vendors
- List of vendors
- Edit/delete buttons
- Filter by category

### Step 5: Timeline & Task Manager

- Add tasks with due dates
- Mark tasks as complete
- Sort by date
- Add milestones (engagement date, nikah date, etc.)

### Step 6: Backend Integration

Once the UI feels complete:

- Add token validation (call `/api/validate-token`)
- Create `/api/save-guide-progress.js` for cloud sync
- Update the webhook to send guide links
- Add proper security (HMAC, rate limiting)

---

## Tips for You as a Junior Developer

### When You Get Stuck

1. **Start small:** Build one feature at a time
2. **Test frequently:** Run `npm run dev` and check after each change
3. **Use console.log:** Debug your handlers with `console.log(data)`
4. **Copy patterns:** Look at how `VisionSection` is built and copy for other sections
5. **Read the plan docs:** Reference the blueprint for exact localStorage keys

### Common Mistakes to Avoid

1. **Forgetting to call `updateData`:** Always use our wrapper, not `setData` directly
2. **Not handling edge cases:** What if budget is 0? What if array is empty?
3. **Breaking localStorage keys:** Match the exact keys from `DEFAULT_GUIDE`
4. **Over-complicating:** Start simple, add features later

### Your Development Cycle

```
1. Pick a feature (e.g., "add budget input")
2. Write the handler function
3. Add the UI (input field, button, etc.)
4. Connect them with onChange/onClick
5. Test in browser
6. Check localStorage in DevTools
7. Commit your changes
8. Move to next feature
```

---

## Quick Reference

### How to Add a New Input Field

```jsx
<input
  type="text"
  value={data.someField}
  onChange={(e) => updateSomeField(e.target.value)}
  className="border rounded-lg px-3 py-2"
/>
```

### How to Add a Handler

```javascript
const updateSomeField = (value) =>
  updateData((p) => ({ ...p, someField: value }));
```

### How to Check localStorage

1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" → your domain
4. Find keys starting with `hwg:progress:`

### How to Debug

```javascript
// Add this in your component to see data changes
console.log("Current data:", data);
console.log("Priorities:", data.weddingPriorities);
```

---

## Questions to Ask Me

When you're ready to build the next section, ask me:

- "How do I build the budget calculator with percentage validation?"
- "Can you help me structure the vendor CRUD operations?"
- "What's the best way to handle date inputs for the timeline?"
- "How do I add the quiz logic and scoring?"

I'll walk you through each one step-by-step, just like we did with Vision & Values!

---

## Current Status

✅ Data model expanded  
✅ Vision & Values section complete  
✅ Navigation and tabs working  
✅ Auto-save with feedback  
✅ Mobile-responsive  
✅ **Budget Builder complete!** (with two-way calculations and validation)  
⬜ Vendor Tracker (next!)  
⬜ Timeline & Tasks  
⬜ Vision Quiz  
⬜ Backend integration

**You're doing amazing! 🚀 Two major sections complete. Check `BUDGET_BUILDER_COMPLETE.md` for details on what we just built.**
