# 🚀 CrowdSolve Platform - Getting Started Checklist

## Prerequisites Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB installed OR MongoDB Atlas account ready
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Initial Setup (First Time)

### 1. Dependencies
```bash
✅ Already installed via: npm install
```
All required packages are installed:
- Next.js, React
- Mongoose, MongoDB
- NextAuth, bcrypt
- Shadcn UI components
- TypeScript types

### 2. Environment Configuration
- [x] `.env.local` file created with default values
- [ ] **ACTION REQUIRED**: Verify MongoDB connection string
  - If using local MongoDB: `mongodb://localhost:27017/crowdsolve` (default)
  - If using MongoDB Atlas: Replace with your connection string

### 3. MongoDB Setup

**Option A: Local MongoDB**
- [ ] Install MongoDB Community Server
- [ ] Start MongoDB service
- [ ] Verify it's running on port 27017

**Option B: MongoDB Atlas (Cloud)**
- [ ] Create free account at mongodb.com/cloud/atlas
- [ ] Create a cluster
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in `.env.local`
- [ ] Whitelist your IP address

### 4. Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] No TypeScript compilation errors
- [ ] Open http://localhost:3000

## First Use Testing

### Test Authentication
- [ ] Visit http://localhost:3000/signup
- [ ] Create account: test@example.com / password123
- [ ] Verify redirect to homepage after signup
- [ ] Logout works
- [ ] Login with same credentials works

### Test Problem Creation
- [ ] Login if not already
- [ ] Click "Create Problem" button
- [ ] Fill form:
  - Title: "Street light not working"
  - Description: "Street light on Main Street needs repair"
  - Location: Select "Noida"
- [ ] Submit and verify problem appears on homepage

### Test Solutions
- [ ] Click on the problem you created
- [ ] View problem detail page
- [ ] Post a solution: "Contact local municipality"
- [ ] Verify solution appears below problem

### Test Upvoting
- [ ] Click upvote button on your solution
- [ ] Verify upvote count increases
- [ ] Try upvoting again - should show error
- [ ] Create second user account and upvote same solution
- [ ] Verify multiple users can upvote

### Test Comments
- [ ] Click "Comments" button on a solution
- [ ] Add a comment: "Great idea!"
- [ ] Verify comment appears with your email and timestamp

## Verification Checklist

### Core Features
- [ ] User signup working
- [ ] User login working
- [ ] User logout working
- [ ] Create problem working
- [ ] View all problems working
- [ ] View problem details working
- [ ] Post solution working
- [ ] Upvote solution working
- [ ] Comment on solution working
- [ ] One upvote per user enforced
- [ ] Solutions sorted by upvotes

### UI/UX
- [ ] Responsive design on mobile
- [ ] Buttons have loading states
- [ ] Error messages display correctly
- [ ] Success feedback after actions
- [ ] Navigation works smoothly
- [ ] Forms validate input

### Database
- [ ] MongoDB connection successful
- [ ] Data persists after page refresh
- [ ] Collections created automatically
- [ ] Relationships working (User → Problem → Solution → Comment)

## Troubleshooting

### Issue: Cannot connect to MongoDB
**Check:**
- [ ] MongoDB is running (check services/system processes)
- [ ] Port 27017 is not blocked by firewall
- [ ] MONGODB_URI in .env.local is correct
- [ ] For Atlas: IP whitelist includes your IP

**Fix:**
```bash
# Windows - Check MongoDB service
Get-Service | findstr MongoDB

# Start MongoDB service if stopped
net start MongoDB
```

### Issue: Port 3000 already in use
**Fix:**
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Module not found errors
**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install
npm run dev
```

### Issue: Authentication not working
**Check:**
- [ ] AUTH_SECRET is set in .env.local
- [ ] Clear browser cookies for localhost
- [ ] Restart development server

### Issue: TypeScript errors
**Fix:**
```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)
# Type: "TypeScript: Restart TS Server"
```

## Production Deployment Checklist

### Before Deploying
- [ ] Set up production MongoDB (MongoDB Atlas recommended)
- [ ] Generate secure AUTH_SECRET
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- [ ] Update environment variables:
  - [ ] MONGODB_URI (production database)
  - [ ] AUTH_SECRET (generated secure key)
  - [ ] NEXTAUTH_URL (production URL)
- [ ] Test build locally: `npm run build`
- [ ] Fix any build errors

### Deploy to Vercel
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel dashboard
- [ ] Deploy!
- [ ] Test production site thoroughly

### Post-Deployment
- [ ] Create test account on production
- [ ] Test all features in production
- [ ] Monitor for errors
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure MongoDB backups

## Quick Reference

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Common URLs
- Homepage: http://localhost:3000
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login
- Problems: http://localhost:3000/problems/[id]

### File Structure
```
app/           → Pages and routes
actions/       → Server actions
models/        → Database models
components/    → React components
lib/           → Utilities
```

## Support Resources

- **README.md** - Full project documentation
- **QUICKSTART.md** - Detailed setup guide
- **IMPLEMENTATION.md** - Technical implementation details

## Success Criteria

You're ready to go when:
- ✅ Development server runs without errors
- ✅ Can signup, login, logout
- ✅ Can create problems and view them
- ✅ Can post solutions and see them
- ✅ Can upvote solutions (once per user)
- ✅ Can comment on solutions
- ✅ Data persists in MongoDB

## 🎉 Congratulations!

If all checks pass, your CrowdSolve platform is fully operational!

**Next Steps:**
1. Explore the codebase
2. Customize the UI/features
3. Add more functionality
4. Deploy to production
5. Share with users!

---

**Questions or Issues?**
- Check QUICKSTART.md for detailed guides
- Review error messages in browser console
- Verify MongoDB connection
- Ensure all environment variables are set
