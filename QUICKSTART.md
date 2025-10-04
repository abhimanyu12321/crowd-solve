# CrowdSolve Platform - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer (keep default settings)
3. MongoDB will auto-start as a service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Alternative: MongoDB Atlas (Cloud - Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Get connection string
5. Update MONGODB_URI in .env.local

### Step 2: Verify MongoDB is Running

```bash
# Windows PowerShell
Get-Service | findstr MongoDB

# macOS/Linux
mongosh
# Should connect successfully
```

### Step 3: Start the Application

```bash
npm run dev
```

### Step 4: Access the Application

Open your browser: **http://localhost:3000**

## 📝 First Steps

1. **Sign Up**: Go to http://localhost:3000/signup
   - Use any email (e.g., test@example.com)
   - Create a password (min 6 characters)

2. **Create a Problem**:
   - Click "Create Problem" button
   - Fill in title, description
   - Select location (Noida/Delhi/Gurgaon)

3. **View Problem Details**:
   - Click on any problem card
   - See the problem details

4. **Post a Solution**:
   - On problem page, use solution form
   - Write your solution
   - Submit

5. **Upvote & Comment**:
   - Upvote solutions you like
   - Add comments to discuss solutions

## 🔧 Configuration

### Environment Variables (.env.local)

The `.env.local` file is already created with default values:

```env
MONGODB_URI=mongodb://localhost:27017/crowdsolve
AUTH_SECRET=crowdsolve-secret-key-2024-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**For Production**: Generate a secure AUTH_SECRET:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🎯 Testing the Platform

### Create Multiple Users
1. Sign up with different emails
2. Test interactions between users
3. Verify upvote restrictions (one per user)

### Test Features
- ✅ User signup/login
- ✅ Create problems
- ✅ Post solutions
- ✅ Upvote solutions
- ✅ Comment on solutions
- ✅ Location filtering
- ✅ User authentication

## 📊 Database Collections

After using the app, you can view data in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use crowdsolve

# View collections
show collections

# Query examples
db.users.find()
db.problems.find()
db.solutions.find()
db.comments.find()
db.upvotes.find()
```

## 🐛 Common Issues

### MongoDB Connection Error
**Error**: "Failed to connect to MongoDB"
**Solution**: 
- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify port 27017 is available

### Port 3000 Already in Use
**Solution**:
```bash
# Kill the process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Authentication Not Working
**Solution**:
- Clear browser cookies
- Restart development server
- Check AUTH_SECRET is set

### Module Not Found Errors
**Solution**:
```bash
npm install
rm -rf .next
npm run dev
```

## 🎨 Customization

### Add More Locations
Edit `models/Problem.ts`:
```typescript
location: {
  type: String,
  enum: ['Noida', 'Delhi', 'Gurgaon', 'Mumbai', 'Bangalore'], // Add more
  required: true,
}
```

### Change Color Theme
Edit `components/ui/button.tsx` and other UI components, or modify Tailwind config.

### Add Profile Pictures
1. Install cloudinary/uploadthing
2. Add avatar field to User model
3. Update UI components

## 📱 Features Overview

| Feature | Description | Access |
|---------|-------------|--------|
| Authentication | Email/Password login | Public |
| Create Problem | Post community problems | Authenticated |
| View Problems | Browse all problems | Public |
| Post Solution | Propose solutions | Authenticated |
| Upvote | Vote for best solutions | Authenticated (once/solution) |
| Comment | Discuss solutions | Authenticated |

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Set up production MongoDB (Atlas recommended)
- [ ] Generate secure AUTH_SECRET
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Test all features in production
- [ ] Set up monitoring/logging
- [ ] Configure CORS if needed
- [ ] Add rate limiting
- [ ] Set up backups

## 📚 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js Server Actions
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth v5
- **UI**: Shadcn UI + Tailwind CSS
- **Icons**: Lucide React

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console errors
3. Verify environment variables
4. Check MongoDB connection

## 🎉 Success!

If you can:
1. Sign up ✅
2. Create a problem ✅
3. Post a solution ✅
4. Upvote ✅
5. Comment ✅

**Congratulations! Your CrowdSolve platform is fully functional! 🎊**
