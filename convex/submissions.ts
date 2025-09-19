import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveSubmission = mutation({
  args: {
    interviewId: v.id("interviews"),
    userId: v.string(),
    questionId: v.string(),
    code: v.string(),
    language: v.string(),
    output: v.string(),
    score: v.optional(v.number()),
    isFinal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("submissions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getSubmissions = query({
  args: {
    interviewId: v.id("interviews"),
    userId: v.string(),
    questionId: v.optional(v.string()),
  },
  handler: async (ctx, { interviewId, userId, questionId }) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_interview_user_question", (q) =>
        q.eq("interviewId", interviewId).eq("userId", userId)
      )
      .filter((q) =>
        questionId ? q.eq(q.field("questionId"), questionId) : true
      )
      .collect();
  },
});

export const getSubmissionsByInterview = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_interview", (q) => q.eq("interviewId", interviewId))
      .order("desc")
      .collect();
  },
});

export const getLatestSubmissionsPerQuestion = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    const allSubs = await ctx.db
      .query("submissions")
      .withIndex("by_interview", (q) => q.eq("interviewId", interviewId))
      .order("desc")
      .collect();

    const latest: Record<string, any> = {};
    for (const sub of allSubs) {
      if (!sub.isFinal) continue;
      const key = `${sub.userId}-${sub.questionId}`;
      if (!latest[key]) {
        latest[key] = sub;
      }
    }

    // Look up users by clerkId
    const results = await Promise.all(
      Object.values(latest).map(async (s) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", s.userId))
          .unique(); // get exactly one match
        return { ...s, user };
      })
    );

    return results;
  },
});
