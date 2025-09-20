"use client";

import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { Id } from "../../convex/_generated/dataModel";
import type * as monaco from "monaco-editor";
import { useAction } from "convex/react";
import { useUserRole } from "@/hooks/useUserRole";

type CodeEditorProps = {
  interviewId: Id<"interviews">;
  userId: string;
};

function CodeEditor({ interviewId, userId }: CodeEditorProps) {
  const { isInterviewer } = useUserRole();

  const saveSubmission = useMutation(api.submissions.saveSubmission);
  const runCode = useAction(api.runCode.runCode);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const isApplyingRemote = useRef(false);

  // Convex state
  const codeRoom = useQuery(api.codeRooms.getCodeRoom, { interviewId });

  const createCodeRoom = useMutation(api.codeRooms.createCodeRoom);
  const updateCode = useMutation(api.codeRooms.updateCode);
  const updateLanguage = useMutation(api.codeRooms.updateLanguage);
  const updateQuestion = useMutation(api.codeRooms.updateQuestion);

  // Local state
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(
    LANGUAGES[0].id
  );
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);
  const [output, setOutput] = useState("");
  // Candidate check
  const isCandidate = useMemo(() => {
    if (!codeRoom) return false;
    return codeRoom.updatedBy === userId || true; // adjust if needed
  }, [codeRoom, userId]);

  // Initialize code room
  useEffect(() => {
    if (!codeRoom) {
      createCodeRoom({
        interviewId,
        language,
        code,
        questionId: selectedQuestion.id,
        updatedBy: userId,
      });
    }
  }, [
    codeRoom,
    createCodeRoom,
    interviewId,
    language,
    code,
    selectedQuestion.id,
    userId,
  ]);

  // Sync server updates smoothly (live updates for interviewers)
  useEffect(() => {
    if (!codeRoom || !editorRef.current) return;
    if (codeRoom.updatedBy === userId) return; // ignore own edits

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const localCode = model.getValue();
    const remoteCode = codeRoom.code;

    if (localCode !== remoteCode) {
      isApplyingRemote.current = true; // prevent feedback
      const cursor = editor.getPosition();
      editor.executeEdits("", [
        { range: model.getFullModelRange(), text: remoteCode },
      ]);
      if (cursor) editor.setPosition(cursor);
      isApplyingRemote.current = false;
    }
  }, [codeRoom?.code, codeRoom?.updatedBy]);

  // Handle code changes from editor
  const handleCodeChange = (value: string | undefined) => {
    if (!isCandidate) return;
    if (isApplyingRemote.current) return; // ignore updates caused by remote edits
    if (!value) return;

    updateCode({
      interviewId,
      code: value,
      updatedBy: userId,
    });
  };

  // Handle language switch
  const handleLanguageChange = (
    newLanguage: "javascript" | "python" | "java"
  ) => {
    if (!isCandidate) return;
    if (codeRoom?.code !== selectedQuestion.starterCode[language]) {
      if (
        !window.confirm(
          "You have unsaved code. Switching languages will overwrite it. Continue?"
        )
      )
        return;
    }

    const newCode = selectedQuestion.starterCode[newLanguage];
    setLanguage(newLanguage);
    setCode(newCode);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.executeEdits("", [
          { range: model.getFullModelRange(), text: newCode },
        ]);
        editorRef.current.pushUndoStop();
      }
    }

    updateLanguage({
      interviewId,
      language: newLanguage,
      starterCode: newCode,
      updatedBy: userId,
    });
  };

  // Handle question switch
  const handleQuestionChange = (questionId: string) => {
    if (!isCandidate) return;

    // ❗ Confirm if current code differs from starter code
    if (codeRoom?.code !== selectedQuestion.starterCode[language]) {
      const confirmSwitch = window.confirm(
        "You have unsaved code. Switching questions will overwrite it. Continue?"
      );
      if (!confirmSwitch) return;
    }

    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);

    updateQuestion({
      interviewId,
      questionId,
      starterCode: question.starterCode[language],
      language,
      updatedBy: userId,
    });
  };

  // Run all examples

  const handleRun = async () => {
    if (!selectedQuestion) return;

    const examples = selectedQuestion.examples;
    if (!examples.length) return;

    let codeToRun = codeRoom?.code; // Candidate's code
    let wrappedCode = "";
    let inputStr = JSON.stringify(examples.map((ex) => ex.input));

    if (language === "javascript") {
      // Wrap JS code to run all test cases
      wrappedCode = `
  ${codeToRun}

  const inputs = ${inputStr};
  const expected = ${JSON.stringify(examples.map((ex) => ex.output))};

  inputs.forEach((ex, i) => {
    try {
      const result = ${selectedQuestion.starterCode.javascript.includes("twoSum") ? "twoSum" : "func"}(ex.nums, ex.target);
      console.log('Test Case', i+1);
      console.log('Input:', JSON.stringify(ex));
      console.log('Expected:', JSON.stringify(expected[i]));
      console.log('Output:', JSON.stringify(result));
      console.log('-----------------');
    } catch(err) {
      console.log('Test Case', i+1, 'Error:', err.message);
      console.log('-----------------');
    }
  });
  `;
    } else if (language === "python") {
      // Wrap Python code to run all test cases
      wrappedCode = `
  ${codeToRun}

  import json
  examples = json.loads('${inputStr}')

  expected = json.loads('${JSON.stringify(examples.map((ex) => ex.output))}')

  for i, ex in enumerate(examples):
      try:
          result = ${selectedQuestion.starterCode.python.includes("two_sum") ? "two_sum" : "func"}(ex["nums"], ex["target"])
          print("Test Case", i+1)
          print("Input:", ex)
          print("Expected:", expected[i])
          print("Output:", result)
          print("-----------------")
      except Exception as e:
          print("Test Case", i+1, "Error:", str(e))
          print("-----------------")
  `;
    } else if (language === "java") {
      // Wrap Java code to run all test cases
      const javaInputs = examples
        .map(
          (ex) => `new int[]{${ex.input.nums.join(",")}}, ${ex.input.target}`
        )
        .join(",\n");

      wrappedCode = `
  ${codeToRun}

  public class Main {
      public static void main(String[] args) {
          Object[][] testCases = new Object[][]{
              ${examples
                .map(
                  (ex) =>
                    `new Object[]{new int[]{${ex.input.nums.join(
                      ","
                    )}}, ${ex.input.target}, new int[]{${ex.output.join(",")}}}`
                )
                .join(",\n")}
          };

          Solution sol = new Solution();

          for (int i = 0; i < testCases.length; i++) {
              try {
                  int[] nums = (int[]) testCases[i][0];
                  int target = (int) testCases[i][1];
                  int[] expected = (int[]) testCases[i][2];
                  int[] result = sol.twoSum(nums, target);
                  System.out.println("Test Case " + (i+1));
                  System.out.println("Input: nums=" + java.util.Arrays.toString(nums) + ", target=" + target);
                  System.out.println("Expected: " + java.util.Arrays.toString(expected));
                  System.out.println("Output: " + java.util.Arrays.toString(result));
                  System.out.println("-----------------");
              } catch(Exception e) {
                  System.out.println("Test Case " + (i+1) + " Error: " + e.getMessage());
                  System.out.println("-----------------");
              }
          }
      }
  }
  `;
    }

    // Call the API once with all test cases
    const result = await runCode({
      language,
      code: wrappedCode,
    });

    let outputText =
      result.stdout || result.stderr || result.compile_output || "No output";

    setOutput(outputText);

    // Save submission to Convex
    await saveSubmission({
      interviewId,
      userId,
      questionId: selectedQuestion.id,
      code,
      language,
      output: outputText,
      score: 0, // calculate later
      isFinal: false, // 🚀 only mark final later
    });
  };
  function calculateScore(output: string, questionScore: number) {
    const testCases = output.split("-----------------"); // split by each test case
    let passed = 0;
    let total = 0;

    for (const t of testCases) {
      if (!t.trim()) continue;
      total++;
      const match = t.match(/Expected: (.+)\nOutput: (.+)/s);
      if (match) {
        const expected = match[1].trim();
        const actual = match[2].trim();
        if (expected === actual) passed++;
      }
    }

    // ✅ Only award score if all pass
    return total > 0 && passed === total ? questionScore : 0;
  }

  useEffect(() => {
    if (!isCandidate) return;

    const interval = setInterval(() => {
      if (!codeRoom) return;

      updateCode({
        interviewId,
        code: codeRoom?.code,
        updatedBy: userId,
      });

      console.log("Auto-saved code");
    }, 30000); // 30 seconds (use 60000 for 60s)

    return () => clearInterval(interval); // cleanup on unmount
  }, [codeRoom?.code, codeRoom, interviewId, updateCode, userId, isCandidate]);

  const handleFinalSubmit = async () => {
    if (!selectedQuestion) return;

    const examples = [
      ...selectedQuestion.examples,
      ...(selectedQuestion.hiddenTests || []),
    ];

    if (!examples.length) return;

    if (!codeRoom?.code) {
      throw new Error("No code available to submit");
    }
    const codeToRun = codeRoom.code;

    const inputStr = JSON.stringify(examples.map((ex) => ex.input));
    const expectedStr = JSON.stringify(examples.map((ex) => ex.output));
    let wrappedCode = "";

    if (language === "javascript") {
      wrappedCode = `
${codeToRun}

const inputs = ${inputStr};
const expected = ${expectedStr};
let passed = 0;

inputs.forEach((ex, i) => {
  try {
    const fn = ${selectedQuestion.starterCode.javascript.includes("twoSum") ? "twoSum" : "func"};
    const result = fn(ex.nums, ex.target);
    const ok = JSON.stringify(result) === JSON.stringify(expected[i]);
    if (ok) passed++;

    console.log('Test Case', i+1);
    console.log('Input:', JSON.stringify(ex));
    console.log('Expected:', JSON.stringify(expected[i]));
    console.log('Output:', JSON.stringify(result));
    console.log(ok ? "Passed" : "Failed");
    console.log('-----------------');
  } catch(err) {
    console.log('Test Case', i+1, 'Error:', err.message);
    console.log('-----------------');
  }
});

console.log('SCORE:', passed + '/' + inputs.length);
`;
    } else if (language === "python") {
      wrappedCode = `
${codeToRun}

import json
examples = json.loads('${inputStr}')
expected = json.loads('${expectedStr}')
passed = 0

for i, ex in enumerate(examples):
    try:
        fn = ${selectedQuestion.starterCode.python.includes("two_sum") ? "two_sum" : "func"}
        result = fn(ex["nums"], ex["target"])
        ok = result == expected[i]
        if ok: passed += 1

        print("Test Case", i+1)
        print("Input:", ex)
        print("Expected:", expected[i])
        print("Output:", result)
        print("Passed" if ok else "Failed")
        print("-----------------")
    except Exception as e:
        print("Test Case", i+1, "Error:", str(e))
        print("-----------------")

print("SCORE:", str(passed) + "/" + str(len(examples)))
`;
    } else if (language === "java") {
      wrappedCode = `
${codeToRun}

public class Main {
    public static void main(String[] args) {
        Object[][] testCases = new Object[][]{
            ${examples
              .map(
                (ex) =>
                  `new Object[]{new int[]{${ex.input.nums.join(",")}}, ${ex.input.target}, new int[]{${ex.output.join(",")}}}`
              )
              .join(",\n")}
        };

        Solution sol = new Solution();
        int passed = 0;

        for (int i = 0; i < testCases.length; i++) {
            try {
                int[] nums = (int[]) testCases[i][0];
                int target = (int) testCases[i][1];
                int[] expected = (int[]) testCases[i][2];
                int[] result = sol.twoSum(nums, target);

                boolean ok = java.util.Arrays.equals(result, expected);
                if(ok) passed++;

                System.out.println("Test Case " + (i+1));
                System.out.println("Input: nums=" + java.util.Arrays.toString(nums) + ", target=" + target);
                System.out.println("Expected: " + java.util.Arrays.toString(expected));
                System.out.println("Output: " + java.util.Arrays.toString(result));
                System.out.println(ok ? "Passed" : "Failed");
                System.out.println("-----------------");
            } catch(Exception e) {
                System.out.println("Test Case " + (i+1) + " Error: " + e.getMessage());
                System.out.println("-----------------");
            }
        }

        System.out.println("SCORE: " + passed + "/" + testCases.length);
    }
}
`;
    }

    // Run in sandbox
    const result = await runCode({ language, code: wrappedCode });

    const outputText =
      result.stdout || result.stderr || result.compile_output || "No output";
    setOutput(outputText);

    // Extract score
    const match = outputText.match(/SCORE:\s*(\d+)\/(\d+)/);
    let score = 0;
    if (match) {
      const correct = parseInt(match[1], 10);
      const total = parseInt(match[2], 10);
      score = Math.round((correct / total) * selectedQuestion.score);
    }

    // Save submission
    await saveSubmission({
      interviewId,
      userId,
      questionId: selectedQuestion.id,
      code: codeToRun,
      language,
      output: outputText,
      score,
      isFinal: true,
    });

    alert(`Final submission saved! Score: ${score}/${selectedQuestion.score}`);
  };

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[calc-100vh-4rem-1px]"
    >
      {/* QUESTION PANEL */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Question Selector */}
                  <Select
                    value={selectedQuestion.id}
                    onValueChange={handleQuestionChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Language Selector */}
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PROBLEM DESCRIPTION */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">
                      {selectedQuestion.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* EXAMPLES */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">
                            Example {index + 1}:
                          </p>
                          <ScrollArea className="h-full w-full rounded-md">
                            <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                              <div>
                                Input: {JSON.stringify(example.input, null, 2)}
                              </div>
                              <div>
                                Output:{" "}
                                {JSON.stringify(example.output, null, 2)}
                              </div>

                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">
                                  Explanation: {example.explanation}
                                </div>
                              )}
                            </pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map((constraint, index) => (
                        <li key={index} className="text-muted-foreground">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* CODE EDITOR PANEL */}
      <ResizablePanel defaultSize={80} maxSize={100}>
        <div className="h-full flex flex-col relative">
          {/* Editor container */}
          <div className="flex-1 overflow-auto relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              defaultValue={code} // initial code
              onChange={handleCodeChange}
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                wordWrap: "on",
                wrappingIndent: "indent",
                readOnly: !isCandidate,
              }}
            />

            {/* Candidate-only actions */}
            {!isInterviewer && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={handleRun}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Run Code
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => handleFinalSubmit()}
                >
                  Submit Final
                </button>
              </div>
            )}
          </div>

          {/* Output panel */}
          <div className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg h-28 overflow-auto flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">Output</span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-2 py-1 text-sm text-gray-300 bg-gray-800 rounded hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-words text-sm font-mono">
              {output || "Run code to see output..."}
            </pre>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;
