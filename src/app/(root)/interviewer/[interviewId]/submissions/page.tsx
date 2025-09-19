"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel"; // ✅ import the Id type
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CODING_QUESTIONS } from "@/constants";
import { useRouter } from "next/navigation";

export default function InterviewerSubmissionsPage() {
  const { interviewId } = useParams();
  const id = interviewId as Id<"interviews">;
  const router = useRouter();

  const subs = useQuery(api.submissions.getLatestSubmissionsPerQuestion, {
    interviewId: id,
  });

  if (subs === undefined) return <p>Loading submissions...</p>;
  if (subs.length === 0) return <p>No submissions yet.</p>;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.back()}>← Back</button>
      <h1 className="text-2xl font-bold">
        Submissions for Interview {interviewId}
      </h1>

      {subs.map((s) => {
        const question = CODING_QUESTIONS.find((q) => q.id === s.questionId);
        console.log(s, "s");

        return (
          <Card key={s._id} className="space-y-4">
            <CardHeader>
              <CardTitle>
                Candidate:{" "}
                <span className="font-semibold pr-3">
                  Name: {s.user?.name ?? s.userId}
                </span>
                <span className="text-muted-foreground font-medium">
                  Email: {s.user?.email ?? s.userId}
                </span>
              </CardTitle>

              <div className="flex gap-2 mt-2">
                <Badge>{s.language}</Badge>
                {s.isFinal ? (
                  <Badge className="bg-green-600 text-white">Final</Badge>
                ) : (
                  <Badge className="bg-yellow-600 text-white">Draft</Badge>
                )}
                {s.score !== undefined && <Badge>{s.score} pts</Badge>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* ✅ Full Question */}
              {question && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Question</h2>
                  <p className="text-base font-bold">{question.title}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {question.description}
                  </p>

                  {question.examples && (
                    <div>
                      <h3 className="font-semibold mt-2">Examples:</h3>
                      <ul className="list-disc pl-6 space-y-2 text-sm">
                        {question.examples.map((ex, i) => (
                          <li key={i}>
                            <strong>Input:</strong>{" "}
                            <code>{JSON.stringify(ex.input)}</code> <br />
                            <strong>Output:</strong>{" "}
                            <code>{JSON.stringify(ex.output)}</code> <br />
                            {ex.explanation && <em>{ex.explanation}</em>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.constraints && (
                    <div>
                      <h3 className="font-semibold mt-2">Constraints:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        {question.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ Candidate Code */}
              <div>
                <h3 className="font-semibold">Candidate Code</h3>
                <pre className="bg-muted p-3 rounded text-sm max-h-48 overflow-auto">
                  {s.code}
                </pre>
              </div>

              {/* ✅ Candidate Output */}
              <div>
                <h3 className="font-semibold">Output</h3>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm max-h-32 overflow-auto">
                  {s.output}
                </pre>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
