import { auth } from "@/auth";
import { fetchProblemById, fetchSolutionsByProblemId } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import SolutionForm from "@/components/SolutionForm";
import SolutionCard from "@/components/SolutionCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProblemDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const session = await auth();
  
  const problemResult = await fetchProblemById(id);
  if (problemResult.error || !problemResult.problem) {
    notFound();
  }

  const problem = problemResult.problem;
  const solutionsResult = await fetchSolutionsByProblemId(id);
  const solutions = solutionsResult.solutions || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to Problems
              </Button>
            </Link>
            {session && (
              <span className="text-sm text-gray-600">{session.user?.email}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Problem Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {problem.location}
              </span>
            </div>
            <CardDescription>
              Posted by {problem.createdBy?.email || "Unknown"} on{" "}
              {new Date(problem.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
          </CardContent>
        </Card>

        {/* Solutions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Solutions ({solutions.length})
            </h2>
          </div>

          {/* Add Solution Form */}
          {session ? (
            <SolutionForm problemId={id} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600 mb-4">Please login to post a solution</p>
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Solutions List */}
          {solutions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  No solutions yet. Be the first to suggest a solution!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {solutions.map((solution: any) => (
                <SolutionCard
                  key={solution._id}
                  solution={solution}
                  isLoggedIn={!!session}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
