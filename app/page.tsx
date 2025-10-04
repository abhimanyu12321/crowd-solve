import { auth } from "@/auth";
import { signOut } from "@/auth";
import { fetchAllProblems } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import CreateProblemDialog from "@/components/CreateProblemDialog";

export default async function HomePage() {
  const session = await auth();
  const result = await fetchAllProblems();
  const problems = result.problems || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900">CrowdSolve</h1>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">{session.user?.email}</span>
                  <CreateProblemDialog />
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                  >
                    <Button type="submit" variant="outline" size="sm">
                      Logout
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Problems</h2>
          <p className="text-gray-600">Browse problems from your community and contribute solutions</p>
        </div>

        {problems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No problems posted yet. Be the first to share a problem!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
            {problems.map((problem: any) => (
              <Link key={problem._id} href={`/problems/${problem._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{problem.title}</CardTitle>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {problem.location}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {problem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">
                      Posted by {problem.createdBy?.email || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}