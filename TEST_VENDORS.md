# Test Vendor Data Set

Use this data set for comprehensive testing of the Vendor Tracker.

## Test Vendor 1: Venue

- **Name:** Elegant Events Hall
- **Category:** Venue & Location
- **Contact:** +234 803 123 4567
- **Status:** Researching
- **Notes:** Recommended by Aunty Halima. Capacity: 500 guests. Beautiful outdoor garden for photos. Check availability for December 2025.

## Test Vendor 2: Catering

- **Name:** Zainab's Kitchen
- **Category:** Catering & Food
- **Contact:** zainabskitchen@email.com
- **Status:** Contacted
- **Notes:** Specializes in traditional Hausa dishes. Menu tasting scheduled for next week.

## Test Vendor 3: Kayan Lefe (Cultural)

- **Name:** Hadiza's Traditional Crafts
- **Category:** Kayan Lefe (Traditional Gifts)
- **Contact:** WhatsApp: +234 810 555 7890
- **Status:** Quoted
- **Notes:** Beautiful hand-crafted items. Quote: ₦250,000 for complete set. Includes calabashes, traditional mats, and decorative pieces.

## Test Vendor 4: Photography

- **Name:** Moments by Abdullahi
- **Category:** Photography & Videography
- **Contact:** +234 706 987 6543
- **Status:** Booked
- **Notes:** ✅ CONFIRMED! Package includes pre-wedding shoot, full day coverage, drone footage, and edited video within 4 weeks.

## Test Vendor 5: Henna Artist (Cultural)

- **Name:** Ladi's Henna Designs
- **Category:** Henna Artist
- **Contact:** ladidesigns@whatsapp.com
- **Status:** Researching
- **Notes:** Instagram: @ladihennadesigns. Beautiful intricate patterns. Need to check availability.

## Test Vendor 6: Attire

- **Name:** Farah Fashion House
- **Category:** Traditional Attire & Fabrics
- **Contact:** +234 809 444 3210
- **Status:** Declined
- **Notes:** ❌ Too expensive for our budget. Looking for alternatives.

## Test Vendor 7: Makeup

- **Name:** Glam by Aisha
- **Category:** Makeup & Beauty
- **Contact:** glam.aisha@email.com
- **Status:** Quoted
- **Notes:** Quote: ₦150,000 for bridal makeup, trial session included. Portfolio looks amazing!

## Test Vendor 8: Entertainment

- **Name:** Royal Drummers Ensemble
- **Category:** Live Performers & Entertainment
- **Contact:** +234 805 777 8888
- **Status:** Contacted
- **Notes:** Traditional Hausa drummers and dancers. Waiting for availability confirmation.

## Test Vendor 9: Decor

- **Name:** Elegant Touch Decorators
- **Category:** Decorations & Event Design
- **Contact:** eleganttouch@email.com
- **Status:** Researching
- **Notes:** Check their work on Instagram. Colors: burgundy, gold, and cream theme.

## Test Vendor 10: Transportation

- **Name:** Luxury Ride Services
- **Category:** Transportation & Logistics
- **Contact:** +234 802 333 4444
- **Status:** Booked
- **Notes:** ✅ Confirmed! 5 luxury cars for bridal party. Includes decorated lead car.

---

## Testing Scenarios

### Scenario 1: Fresh Start (Empty State)

1. Clear localStorage
2. Navigate to Vendor Tracker
3. Verify empty state with 💼 icon and CTA button

### Scenario 2: Add Multiple Vendors

1. Add all 10 vendors above
2. Verify each displays correctly
3. Check card layout across mobile/tablet/desktop

### Scenario 3: Filter Testing

1. **By Category:**
   - Filter "Kayan Lefe" → Should show Test Vendor 3 only
   - Filter "Photography" → Should show Test Vendor 4 only
2. **By Status:**
   - Filter "Booked" → Should show Vendors 4 & 10
   - Filter "Declined" → Should show Vendor 6 (red badge!)
   - Filter "Researching" → Should show Vendors 1, 5, 9
3. **Combined:**
   - Category: "Venue" + Status: "Researching" → Vendor 1 only

### Scenario 4: Edit Flow

1. Edit Vendor 1 (Elegant Events Hall)
2. Change status from "Researching" → "Contacted"
3. Verify status badge updates from gray to blue

### Scenario 5: Delete Flow

1. Delete Vendor 6 (Declined vendor)
2. Confirm deletion dialog appears
3. Verify vendor removed from list

### Scenario 6: Edge Cases

1. **Very long notes:** Add vendor with 1000+ character notes
2. **Special characters:** Add vendor with emojis, Arabic script in notes
3. **No notes:** Add vendor with empty notes field
4. **Long names:** Test with very long vendor name (50+ chars)

---

## Expected Behavior Checklist

- ✅ Empty state shows when no vendors
- ✅ "Add Vendor" button opens modal
- ✅ Required field validation works
- ✅ Cancel button discards changes
- ✅ Edit modal pre-fills data
- ✅ Status colors match specification
- ✅ Declined status has red badge
- ✅ Category filters work
- ✅ Status filters work
- ✅ Clear Filters button appears when needed
- ✅ Cards show correct information
- ✅ Notes truncate with line-clamp
- ✅ Hover effects work on buttons/cards
- ✅ Mobile shows 1-column grid
- ✅ Tablet shows 2-column grid
- ✅ Desktop shows 3-column grid
- ✅ Data persists after page refresh
- ✅ Delete confirmation prevents accidents
- ✅ Brand colors (#CE805C) used consistently
