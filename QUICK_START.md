# ⚡ QUICK START CARD - DO THIS NOW

## 🔴 3 CRITICAL STEPS (10 minutes)

### Step 1: Database Migration (5 mins)

```
1. Open Supabase Dashboard → SQL Editor
2. Copy ALL of: sql/authentication_upgrade.sql
3. Paste and click RUN
4. Wait for "Success. No rows returned"
```

### Step 2: Environment Variable (2 mins)

```
1. Vercel Dashboard → Settings → Environment Variables
2. Add: SUPABASE_SERVICE_ROLE_KEY = [get from Supabase Settings → API]
3. Select: Production, Preview, Development
4. Save
```

### Step 3: Deploy (3 mins)

```bash
git add .
git commit -m "feat: implement authentication system"
git push
```

---

## ✅ WHAT'S DONE

✅ Unique passwords for each customer  
✅ 20-day access from first login  
✅ Personalized PDF with bride name  
✅ Onboarding flow for first-time users  
✅ Multi-device login support  
✅ Anti-sharing (immutable bride name)

---

## 📁 KEY FILES

**New Components:**

- `src/components/LoginGate_NEW.jsx` - Supabase auth
- `src/components/OnboardingForm.jsx` - First-time setup
- `src/components/PersonalizedPDFExport.jsx` - PDF export

**Modified:**

- `api/paystack-webhook.js` - Creates accounts
- `lib/email.js` - Sends credentials
- `src/App.jsx` - Integrated auth flow

**Database:**

- `sql/authentication_upgrade.sql` - MUST RUN FIRST

---

## 🧪 QUICK TEST (5 mins)

1. Complete test payment (debug.html)
2. Check email for credentials
3. Login with credentials
4. Fill onboarding form
5. Export PDF with bride name

---

## 🐛 KNOWN ISSUE (Optional Fix)

**InteractiveGuide.jsx line ~25:**

```jsx
// Change from:
export default function InteractiveGuide({ auth, onLogout }) {

// To:
export default function InteractiveGuide({ onLogout, accessStatus, userEmail }) {
```

---

## 🆘 IF SOMETHING BREAKS

**Database error?**
→ Check SQL migration ran successfully

**Login fails?**
→ Check SUPABASE_SERVICE_ROLE_KEY is set

**Email not received?**
→ Check Resend dashboard for delivery status

**PDF export fails?**
→ Check jspdf is installed: `npm list jspdf`

---

## 📊 SUCCESS = ALL GREEN

- [ ] SQL migration runs without errors
- [ ] Test payment creates auth account
- [ ] Email contains credentials
- [ ] Login works
- [ ] Onboarding appears
- [ ] Bride name saves
- [ ] PDF exports

---

**TIMELINE:** 10 mins setup + 5 mins testing = 15 minutes to complete

**YOU'VE GOT THIS! 🚀**
