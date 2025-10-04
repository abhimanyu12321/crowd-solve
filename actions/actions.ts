"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { signIn } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Problem from "@/models/Problem";
import Solution from "@/models/Solution";
import Comment from "@/models/Comment";
import Upvote from "@/models/Upvote";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Authentication Actions
export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    // Auto-login after signup
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account" };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Invalid email or password" };
  }
}

// Problem Actions
export async function createProblem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;

  if (!title || !description || !location) {
    return { error: "All fields are required" };
  }

  try {
    await connectDB();

    await Problem.create({
      title,
      description,
      location,
      createdBy: session.user.id,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Create problem error:", error);
    return { error: "Failed to create problem" };
  }
}

export async function fetchAllProblems() {
  try {
    await connectDB();

    const problems = await Problem.find()
      .populate("createdBy", "email")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      problems: JSON.parse(JSON.stringify(problems)),
    };
  } catch (error) {
    console.error("Fetch problems error:", error);
    return { error: "Failed to fetch problems", problems: [] };
  }
}

export async function fetchProblemById(problemId: string) {
  try {
    await connectDB();

    const problem = await Problem.findById(problemId)
      .populate("createdBy", "email")
      .lean();

    if (!problem) {
      return { error: "Problem not found" };
    }

    return {
      success: true,
      problem: JSON.parse(JSON.stringify(problem)),
    };
  } catch (error) {
    console.error("Fetch problem error:", error);
    return { error: "Failed to fetch problem" };
  }
}

// Solution Actions
export async function postSolution(problemId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!text) {
    return { error: "Solution text is required" };
  }

  try {
    await connectDB();

    await Solution.create({
      text,
      problemId,
      createdBy: session.user.id,
    });

    revalidatePath(`/problems/${problemId}`);
    return { success: true };
  } catch (error) {
    console.error("Post solution error:", error);
    return { error: "Failed to post solution" };
  }
}

export async function fetchSolutionsByProblemId(problemId: string) {
  try {
    await connectDB();
    const session = await auth();

    const solutions = await Solution.find({ problemId })
      .populate("createdBy", "email")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "email",
        },
      })
      .sort({ upvotes: -1, createdAt: -1 })
      .lean();

    // Check if current user has upvoted each solution
    let upvotedSolutions: string[] = [];
    if (session?.user?.id) {
      const upvotes = await Upvote.find({
        userId: session.user.id,
        solutionId: { $in: solutions.map((s: any) => s._id) },
      }).lean();

      upvotedSolutions = upvotes.map((u: any) => u.solutionId.toString());
    }

    const solutionsWithUpvoteStatus = solutions.map((solution: any) => ({
      ...solution,
      hasUpvoted: upvotedSolutions.includes(solution._id.toString()),
    }));

    return {
      success: true,
      solutions: JSON.parse(JSON.stringify(solutionsWithUpvoteStatus)),
    };
  } catch (error) {
    console.error("Fetch solutions error:", error);
    return { error: "Failed to fetch solutions", solutions: [] };
  }
}

// Upvote Actions
export async function upvoteSolution(solutionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    // Check if user already upvoted
    const existingUpvote = await Upvote.findOne({
      userId: session.user.id,
      solutionId,
    });

    if (existingUpvote) {
      return { error: "You have already upvoted this solution" };
    }

    // Create upvote
    await Upvote.create({
      userId: session.user.id,
      solutionId,
    });

    // Increment solution upvotes count
    await Solution.findByIdAndUpdate(solutionId, {
      $inc: { upvotes: 1 },
    });

    const solution = await Solution.findById(solutionId);
    revalidatePath(`/problems/${solution?.problemId}`);

    return { success: true };
  } catch (error) {
    console.error("Upvote error:", error);
    return { error: "Failed to upvote solution" };
  }
}

// Comment Actions
export async function postComment(solutionId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (!text) {
    return { error: "Comment text is required" };
  }

  try {
    await connectDB();

    const comment = await Comment.create({
      text,
      solutionId,
      createdBy: session.user.id,
    });

    // Add comment reference to solution
    await Solution.findByIdAndUpdate(solutionId, {
      $push: { comments: comment._id },
    });

    const solution = await Solution.findById(solutionId);
    revalidatePath(`/problems/${solution?.problemId}`);

    return { success: true };
  } catch (error) {
    console.error("Post comment error:", error);
    return { error: "Failed to post comment" };
  }
}
