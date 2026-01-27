# FoodHub Frontend Deployment Guide

## 🚨 Current Issue

Your **local development** is working perfectly, but your **deployed version** (https://foodhub-liard.vercel.app/) is showing static content because:

1. ❌ Deployed version is outdated
2. ❌ Environment variables not configured in Vercel
3. ❌ Possible build errors during deployment

## ✅ Solution: Redeploy with Proper Configuration

### Step 1: Verify Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your `foodhub` project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
Name: NEXT_PUBLIC_API_URL
Value: https://foodhub-backend-seven.vercel.app/api
```

5. Make sure it's enabled for **Production**, **Preview**, and **Development**
6. Click **Save**

### Step 2: Commit and Push Latest Changes

```bash
# In your foodhub directory
git add .
git commit -m "feat: add protected routes and backend integration"
git push origin main
```

### Step 3: Trigger Redeploy in Vercel

**Option A: Automatic (if connected to Git)**
- Vercel will automatically redeploy when you push to main

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Your Project
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Click **Redeploy** button

### Step 4: Check Build Logs

1. In Vercel Dashboard → **Deployments**
2. Click on the running deployment
3. Check the **Build Logs** for any errors
4. Common errors to look for:
   - Missing environment variables
   - TypeScript errors
   - Build failures

### Step 5: Verify Deployment

Once deployed, test these URLs:

1. **Homepage**: https://foodhub-liard.vercel.app/
   - Should show categories, meals, providers from backend

2. **Meals Page**: https://foodhub-liard.vercel.app/meals
   - Should show list of meals from backend

3. **Login**: https://foodhub-liard.vercel.app/login
   - Should allow login and redirect based on role

4. **Cart**: https://foodhub-liard.vercel.app/cart
   - Should redirect to login if not authenticated

## 🔍 Troubleshooting

### Issue: Still showing static content

**Check 1: Environment Variable**
```bash
# In browser console on deployed site
console.log(process.env.NEXT_PUBLIC_API_URL)
```
Should output: `https://foodhub-backend-seven.vercel.app/api`

**Check 2: Network Tab**
1. Open DevTools → Network tab
2. Refresh page
3. Look for API calls to `foodhub-backend-seven.vercel.app`
4. If no API calls, environment variable is not set

**Check 3: Console Errors**
1. Open DevTools → Console tab
2. Look for CORS errors or API errors
3. If CORS error, backend needs to allow your frontend domain

### Issue: Build fails in Vercel

**Common Fixes:**

1. **TypeScript Errors**
   ```bash
   # Run locally to check
   pnpm run build
   ```
   Fix any TypeScript errors shown

2. **Missing Dependencies**
   ```bash
   # Ensure all dependencies are in package.json
   pnpm install
   ```

3. **Environment Variables**
   - Make sure `NEXT_PUBLIC_API_URL` is set in Vercel

### Issue: CORS Error

If you see CORS errors in console:

1. Go to your backend repository
2. Update CORS configuration to allow your frontend domain:
   ```javascript
   // In backend
   cors({
     origin: [
       'http://localhost:3000',
       'https://foodhub-liard.vercel.app'  // Add this
     ],
     credentials: true
   })
   ```
3. Redeploy backend

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to Git
- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- [ ] Local build works: `pnpm run build`
- [ ] No TypeScript errors
- [ ] Backend is deployed and accessible
- [ ] Backend CORS allows frontend domain

## 🎯 Quick Deploy Commands

```bash
# 1. Ensure you're in the frontend directory
cd "d:/level 2 programming course/FoodHub/foodhub"

# 2. Build locally to check for errors
pnpm run build

# 3. If build succeeds, commit and push
git add .
git commit -m "feat: complete backend integration with protected routes"
git push origin main

# 4. Vercel will auto-deploy (if connected to Git)
```

## 🔗 Important Links

- **Frontend Repo**: Check your Git repository
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Backend API**: https://foodhub-backend-seven.vercel.app/api
- **Deployed Frontend**: https://foodhub-liard.vercel.app/

## ✨ After Successful Deployment

Your deployed site should:
- ✅ Fetch and display categories from backend
- ✅ Fetch and display meals from backend
- ✅ Allow user login/register
- ✅ Show cart functionality for logged-in customers
- ✅ Protect admin/provider routes
- ✅ Display loading states and error messages

## 🆘 Still Having Issues?

If deployment still fails:

1. **Check Vercel Build Logs** for specific errors
2. **Verify Backend is Running**: Visit https://foodhub-backend-seven.vercel.app/api/health
3. **Test API Directly**: Use Postman or browser to test backend endpoints
4. **Clear Vercel Cache**: In Vercel settings, try clearing build cache and redeploying
