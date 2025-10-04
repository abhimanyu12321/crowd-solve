"use client";

/**
 * Form component for posting a solution
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postSolution } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SolutionFormProps {
  problemId: string;
}

export default function SolutionForm({ problemId }: SolutionFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await postSolution(problemId, text);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setText("");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propose a Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your solution to this problem..."
            rows={4}
            required
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !text.trim()}>
              {loading ? "Posting..." : "Post Solution"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
