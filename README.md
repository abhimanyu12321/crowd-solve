# CrowdSolve Platform

A minimal community problem-solving platform built with Next.js 15 (App Router), MongoDB, NextAuth, and Shadcn UI.

## Features

- 🔐 **Authentication**: Email/password authentication with NextAuth v5
- 📝 **Problem Management**: Create and browse community problems
- 💡 **Solutions**: Post solutions to problems
- 👍 **Upvoting**: Upvote solutions (one per user)
- 💬 **Comments**: Comment on solutions
- 🎨 **Modern UI**: Beautiful UI components from Shadcn UI
- 📍 **Location-based**: Filter problems by location (Noida, Delhi, Gurgaon)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth v5 (beta)
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas account)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
# Windows: Start MongoDB service
# macOS/Linux: mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and update values:

```bash
# Already done, but verify the values in .env.local:
MONGODB_URI=mongodb://localhost:27017/crowdsolve
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure AUTH_SECRET:
```bash
# Using openssl (macOS/Linux/Git Bash on Windows)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crowd-solve/
├── actions/
│   └── actions.ts           # Server actions for DB operations
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts # NextAuth API route
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── problems/
│   │   └── [id]/
│   │       └── page.tsx     # Problem detail page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage (problem feed)
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── CreateProblemDialog.tsx
│   ├── SolutionForm.tsx
│   └── SolutionCard.tsx
├── lib/
│   ├── mongodb.ts           # MongoDB connection
│   └── utils.ts             # Utility functions
├── models/
│   ├── User.ts              # User model
│   ├── Problem.ts           # Problem model
│   ├── Solution.ts          # Solution model
│   ├── Comment.ts           # Comment model
│   └── Upvote.ts            # Upvote model
├── types/
│   └── next-auth.d.ts       # NextAuth type definitions
├── auth.ts                  # NextAuth configuration
├── middleware.ts            # NextAuth middleware
└── .env.local               # Environment variables
```

## Usage Guide

### 1. Sign Up / Login
- Visit `/signup` to create a new account
- Or visit `/login` to sign in with existing credentials

### 2. Browse Problems
- Homepage displays all problems from the community
- Problems show title, description, location, and author

### 3. Create a Problem
- Click "Create Problem" button (requires login)
- Fill in title, description, and select location
- Submit to post the problem

### 4. View Problem Details
- Click on any problem card to view details
- See all solutions sorted by upvotes

### 5. Post Solutions
- On problem detail page, use the solution form
- Submit your proposed solution

### 6. Upvote Solutions
- Click the upvote button on solutions you like
- Each user can upvote once per solution
- Solutions are sorted by upvote count

### 7. Comment on Solutions
- Click "Comments" to expand comment section
- Add your thoughts or feedback on solutions

## Database Models

### User
- `email`: String (unique, required)
- `password`: String (hashed with bcrypt)
- `createdAt`: Date

### Problem
- `title`: String
- `description`: String
- `location`: Enum (Noida | Delhi | Gurgaon)
- `createdBy`: Reference to User
- `createdAt`: Date

### Solution
- `text`: String
- `problemId`: Reference to Problem
- `createdBy`: Reference to User
- `upvotes`: Number
- `comments`: Array of Comment references
- `createdAt`: Date

### Comment
- `text`: String
- `solutionId`: Reference to Solution
- `createdBy`: Reference to User
- `createdAt`: Date

### Upvote
- `userId`: Reference to User
- `solutionId`: Reference to Solution
- `createdAt`: Date
- Unique index on `(userId, solutionId)`

## API Routes & Server Actions

All CRUD operations are handled via Next.js Server Actions in `actions/actions.ts`:

- `signupAction()` - Create new user account
- `loginAction()` - Authenticate user
- `createProblem()` - Create a new problem
- `fetchAllProblems()` - Get all problems
- `fetchProblemById()` - Get single problem
- `postSolution()` - Post a solution to a problem
- `fetchSolutionsByProblemId()` - Get all solutions for a problem
- `upvoteSolution()` - Upvote a solution (once per user)
- `postComment()` - Add a comment to a solution

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Use a production MongoDB instance
- Generate a secure `AUTH_SECRET`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- For Atlas, ensure IP whitelist includes your IP

### Authentication Issues
- Verify `AUTH_SECRET` is set
- Clear browser cookies and try again
- Check console for error messages

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

