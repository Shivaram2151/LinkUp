import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 🔎 Get the shared code room for an interview
export const getCodeRoom = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    return await ctx.db
      .query("codeRooms")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", interviewId))
      .first();
  },
});

// ➕ Initialize a code room (when starting an interview)
export const createCodeRoom = mutation({
  args: {
    interviewId: v.id("interviews"),
    language: v.string(),
    code: v.string(),
    questionId: v.string(),
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("codeRooms", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ✏️ Update only the code
export const updateCode = mutation({
  args: {
    interviewId: v.id("interviews"),
    code: v.string(),
    updatedBy: v.string(),
  },
  handler: async (ctx, { interviewId, code, updatedBy }) => {
    const room = await ctx.db
      .query("codeRooms")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", interviewId))
      .first();

    if (!room) throw new Error("Code room not found");

    await ctx.db.patch(room._id, {
      code,
      updatedBy,
      updatedAt: Date.now(),
    });
  },
});

// 🌐 Update language + reset starter code
export const updateLanguage = mutation({
  args: {
    interviewId: v.id("interviews"),
    language: v.string(),
    starterCode: v.string(),
    updatedBy: v.string(),
  },
  handler: async (ctx, { interviewId, language, starterCode, updatedBy }) => {
    const room = await ctx.db
      .query("codeRooms")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", interviewId))
      .first();

    if (!room) throw new Error("Code room not found");

    await ctx.db.patch(room._id, {
      language,
      code: starterCode,
      updatedBy,
      updatedAt: Date.now(),
    });
  },
});

// 🔄 Update question (and reset code)
export const updateQuestion = mutation({
  args: {
    interviewId: v.id("interviews"),
    questionId: v.string(),
    starterCode: v.string(),
    language: v.string(),
    updatedBy: v.string(),
  },
  handler: async (
    ctx,
    { interviewId, questionId, starterCode, language, updatedBy }
  ) => {
    const room = await ctx.db
      .query("codeRooms")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", interviewId))
      .first();

    if (!room) throw new Error("Code room not found");

    await ctx.db.patch(room._id, {
      questionId,
      code: starterCode,
      language,
      updatedBy,
      updatedAt: Date.now(),
    });
  },
});
