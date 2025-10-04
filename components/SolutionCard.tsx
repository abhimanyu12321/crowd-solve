"use client";

/**
 * Card component for displaying a solution with upvote and comment features
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upvoteSolution, postComment } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageCircle } from "lucide-react";

interface SolutionCardProps {
  solution: any;
  isLoggedIn: boolean;
}

export default function SolutionCard({ solution, isLoggedIn }: SolutionCardProps) {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpvote() {
    if (!isLoggedIn) return;
    
    setLoading(true);
    const result = await upvoteSolution(solution._id);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(""), 3000);
    } else {
      router.refresh();
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn || !commentText.trim()) return;

    setLoading(true);
    const result = await postComment(solution._id, commentText);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(""), 3000);
    } else {
      setCommentText("");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">
              Posted by {solution.createdBy?.email || "Unknown"} •{" "}
              {new Date(solution.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{solution.text}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant={solution.hasUpvoted ? "default" : "outline"}
            size="sm"
            onClick={handleUpvote}
            disabled={!isLoggedIn || loading || solution.hasUpvoted}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            {solution.upvotes} {solution.upvotes === 1 ? "Upvote" : "Upvotes"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {solution.comments?.length || 0} Comments
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t pt-4 space-y-4">
            {/* Comment Form */}
            {isLoggedIn && (
              <form onSubmit={handleComment} className="space-y-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  disabled={loading}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !commentText.trim()}
                  >
                    {loading ? "Posting..." : "Comment"}
                  </Button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {solution.comments && solution.comments.length > 0 ? (
              <div className="space-y-3">
                {solution.comments.map((comment: any) => (
                  <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {comment.createdBy?.email || "Unknown"} •{" "}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
