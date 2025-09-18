import { action } from "./_generated/server";
import { v } from "convex/values";

export const runCode = action({
  args: {
    language: v.string(),
    code: v.string(),
  },

  handler: async (ctx, args) => {
    console.log(
      "Using RAPIDAPI_KEY:",
      process.env.RAPIDAPI_KEY ? "Loaded ✅" : "Missing ❌"
    );

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        },
        body: JSON.stringify({
          source_code: args.code,
          stdin: "", // all inputs are injected directly in the code
          language_id: mapLanguage(args.language),
        }),
      }
    );

    const result = await response.json();
    console.log("Judge0 result:", result);

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status,
    };
  },
});

// helper to map editor language -> Judge0 id
function mapLanguage(lang: string) {
  switch (lang) {
    case "javascript":
      return 63; // Node.js
    case "python":
      return 71; // Python 3
    case "java":
      return 62; // Java
    default:
      return 63;
  }
}
