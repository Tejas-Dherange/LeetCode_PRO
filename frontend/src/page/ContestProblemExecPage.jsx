import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  GripVertical,
  GripHorizontal,
  Fullscreen,
  Maximize,
  Sun,
  Moon,
} from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import myCustomTheme from "../themes/customTheme";
import { useThemeStore } from "../store/useThemeStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLaguageId } from "../libs/utils";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import { useSubmissionStore } from "../store/useSubmissionStore";
import RunResultsTable from "../components/RunResultsTable";
import { useContestStore } from "../store/useContestStore";

const ContestProblemPage = () => {
  const { id, cid } = useParams();
  const { isProblemLoading, problem, getProblemById } = useProblemStore();
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVA");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  // Resizable split pane state
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [rightPanelEditorHeight, setRightPanelEditorHeight] = useState(70); // percentage - start with more editor space
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const containerRef = useRef(null);
  const rightPanelRef = useRef(null);

  const { theme, setTheme } = useThemeStore();

  // Toggle theme function matching navbar implementation
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Set Monaco theme based on app theme
  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("my-dark-theme", myCustomTheme);
    if (theme === "dark") {
      monaco.editor.setTheme("my-dark-theme");
    } else {
      monaco.editor.setTheme("vs-light");
    }
  };

  // React to theme changes
  useEffect(() => {
    if (window.monaco && window.monaco.editor) {
      if (theme === "dark") {
        window.monaco.editor.setTheme("my-dark-theme");
      } else {
        window.monaco.editor.setTheme("vs-light");
      }
    }
  }, [theme]);

  useEffect(() => {
    getProblemById(id);
    // /change here also
    getSubmissionCountForProblem(id);
    // Clear run results and submission when navigating to a new problem
    if (useExecutionStore.getState().clearRunResults) {
      useExecutionStore.getState().clearRunResults();
    }
    // Clear submission state if present
    if (useExecutionStore.getState().submission !== null) {
      useExecutionStore.setState({ submission: null });
    }
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippet?.[selectedLanguage] || "");
      setTestCases(
        problem.testcase.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || [],
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getContestSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippet?.[lang] || "");
  };

  // Horizontal resizable split pane handlers
  const handleHorizontalMouseDown = (e) => {
    setIsDraggingHorizontal(true);
    e.preventDefault();
  };

  const handleHorizontalMouseMove = (e) => {
    if (!isDraggingHorizontal || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Apply constraints: min 20%, max 80%
    const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftPanelWidth(constrainedWidth);
  };

  const handleHorizontalMouseUp = () => {
    setIsDraggingHorizontal(false);
  };

  // Vertical resizable split pane handlers for right panel
  const handleVerticalMouseDown = (e) => {
    setIsDraggingVertical(true);
    e.preventDefault();
  };

  const handleVerticalMouseMove = (e) => {
    if (!isDraggingVertical || !rightPanelRef.current) return;

    const rightPanelRect = rightPanelRef.current.getBoundingClientRect();
    const newEditorHeight =
      ((e.clientY - rightPanelRect.top) / rightPanelRect.height) * 100;

    // Apply constraints: min 30%, max 100% (allow full height)
    const constrainedHeight = Math.max(30, Math.min(100, newEditorHeight));
    setRightPanelEditorHeight(constrainedHeight);
  };

  const handleVerticalMouseUp = () => {
    setIsDraggingVertical(false);
  };

  useEffect(() => {
    if (isDraggingHorizontal) {
      document.addEventListener("mousemove", handleHorizontalMouseMove);
      document.addEventListener("mouseup", handleHorizontalMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
      if (!isDraggingVertical) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
      if (!isDraggingVertical) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isDraggingHorizontal]);

  useEffect(() => {
    if (isDraggingVertical) {
      document.addEventListener("mousemove", handleVerticalMouseMove);
      document.addEventListener("mouseup", handleVerticalMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
      if (!isDraggingHorizontal) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
      if (!isDraggingHorizontal) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isDraggingVertical]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose prose-lg max-w-none">
            {/* Problem Title */}
            <h1 className="text-3xl mb-4 text-success font-bold">
              {problem?.title}
            </h1>
            
            {/* Problem Description */}
            <div className="mb-8">
              <div className="text-base-content/90 leading-relaxed whitespace-pre-wrap">
                {problem?.description}
              </div>
            </div>

            {problem?.examples && (
              <>
                <h3 className="text-2xl font-bold mb-4 text-primary">Examples:</h3>
                {Object.entries(problem?.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 border border-base-300"
                    >
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-bold uppercase tracking-wide">
                          Input:
                        </div>
                        <div className="bg-base-300 px-4 py-3 rounded-lg font-mono text-sm">
                          <pre className="whitespace-pre-wrap break-words">{example.input}</pre>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-primary mb-2 text-base font-bold uppercase tracking-wide">
                          Output:
                        </div>
                        <div className="bg-base-300 px-4 py-3 rounded-lg font-mono text-sm">
                          <pre className="whitespace-pre-wrap break-words">{example.output}</pre>
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-success mb-2 text-base font-bold uppercase tracking-wide">
                            Explanation:
                          </div>
                          <div className="text-base-content/80 text-base leading-relaxed whitespace-pre-wrap">
                            {example.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </>
            )}

            {problem?.constraints && (
              <>
                <h3 className="text-2xl font-bold mb-4 text-warning">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6 border border-base-300">
                  <div className="bg-base-300 px-4 py-3 rounded-lg font-mono text-sm">
                    <pre className="whitespace-pre-wrap break-words">{problem.constraints}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={contestSubmissions}
            isLoading={isContestLoading}
          />
        );
      default:
        return null;
    }
  };

  const {
    runCode,
    submitCode,
    runResults,
    submission,
    isSubmitExecuting,
    isRunExecuting,
  } = useExecutionStore();

  const {
    contestSubmitCode,
    isContestLoading,
    contestSubmissions,
    getContestSubmissionForProblem,
    contestSubmission,
  } = useContestStore();

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLaguageId(selectedLanguage);
      const stdin = problem.testcase.map((tc) => tc.input);

      const expected_outputs = problem.testcase.map((tc) => tc.output);
      console.log(expected_outputs);
      runCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("error in executing code", error);
    }
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLaguageId(selectedLanguage);
      const stdin = problem.testcase.map((tc) => tc.input);
      const expected_outputs = problem.testcase.map((tc) => tc.output);
      // Clear previous contest submission output before submitting new code
      useContestStore.setState({ contestSubmission: null });
      contestSubmitCode(code, language_id, stdin, expected_outputs, id, cid);
      // getContestSubmissionForProblem(id);
    } catch (error) {
      console.error("error in submitting code", error);
    }
  };

  const renderBottomPanel = () => {
    if (runResults) {
      return <RunResultsTable results={runResults} />;
    } else if (contestSubmission) {
      return <Submission submission={contestSubmission} />;
    } else {
      return (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Test Cases</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected Output</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((testCase, index) => (
                  <tr key={index}>
                    <td className="font-mono">{testCase.input}</td>
                    <td className="font-mono">{testCase.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen w-[98vw] ">
      {/* Navigation */}
      <nav className="w-full  shadow-lg px-4 md:px-10 py-2 border-b border-base-300 z-10 sticky top-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
          {/* Breadcrumb and Problem Title */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <Home className="w-6 h-6" />
              <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-base-content/80 font-semibold text-lg truncate max-w-[200px] md:max-w-xs lg:max-w-sm">
              {problem?.title || "..."}
            </span>
          </div>

          {/* Problem Info */}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className={`btn btn-ghost btn-circle ${
                isBookmarked ? "text-primary" : ""
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost btn-circle" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              className="btn btn-ghost btn-circle hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors" 
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <select
              className="select select-bordered select-primary w-32 md:w-40"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(problem?.codeSnippet || {}).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Centered small Run/Submit buttons */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 items-center z-20">
            {/* Run Button */}
            <button
              className="btn btn-primary btn-sm gap-2 min-w-[90px] flex items-center justify-center"
              onClick={handleRunCode}
              disabled={isRunExecuting}
            >
              {isRunExecuting ? (
                <span className="loading loading-spinner w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Run</span>
            </button>

            {/* Submit Button */}
            <button
              className="btn btn-success btn-sm gap-2 min-w-[90px] flex items-center justify-center"
              onClick={handleSubmitCode}
              disabled={isContestLoading}
            >
              {isContestLoading ? (
                <span className="loading loading-spinner w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Submit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Resizable Split Layout */}
      <div className="h-[calc(100vh-68px)] flex gap-1 " ref={containerRef}>
        {/* Left Panel - Problem Description */}
        <div
          className="bg-base-100 shadow-xl rounded-xl border-1 border-gray-600 flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Tabs */}
          <div className="tabs tabs-bordered rounded-t-xl bg-base-300">
            <button
              className={`tab gap-2 ${
                activeTab === "description" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              <FileText className="w-4 h-4" />
              Description
            </button>
            <button
              className={`tab gap-2 ${
                activeTab === "submissions" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              <Code2 className="w-4 h-4" />
              Submissions
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
        </div>

        {/* Horizontal Resizable Divider */}
        <div
          className={`w-[4px] bg-base-300 hover:bg-blue-700 cursor-ew-resize flex items-center justify-center transition-colors ${
            isDraggingHorizontal ? "bg-primary/30" : ""
          }`}
          onMouseDown={handleHorizontalMouseDown}
        >
          <GripVertical className="w-4 h-4 text-base-content/50" />
        </div>

        {/* Right Panel - Code Editor and Results */}
        <div
          className="bg-base-100 shadow-xl flex flex-col gap-1 min-w-[200px] min-h-0 rounded-xl "
          style={{ width: `${100 - leftPanelWidth}%` }}
          ref={rightPanelRef}
        >
          {/* Code Editor Section */}
          <div
            className="flex flex-col rounded-xl min-h-0   border-1 border-gray-600"
            style={{ height: `${rightPanelEditorHeight}%` }}
          >
            {/* Code Editor Header */}
            <div className="tabs tabs-bordered flex-shrink-0 border-b bg-base-300 rounded-t-xl border-base-300">
              <button className="tab tab-active gap-2">
                <Terminal className="w-4 h-4 " />
                Code Editor
              </button>
              <div className="flex-1"></div>
              <button
                className="cursor-pointer p-2 rounded-xl hover:bg-base-100 btn-sm mr-2"
                onClick={() =>
                  setRightPanelEditorHeight(
                    rightPanelEditorHeight === 100 ? 70 : 100,
                  )
                }
              >
                {rightPanelEditorHeight === 100 ? "Show Results" : <Maximize />}
              </button>
            </div>
            <div className="flex-1 min-h-0  rounded-xl overflow-hidden">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                onMount={handleEditorMount}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 18,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  smoothScrolling: true,
                  glyphMargin: true,
                  folding: true,
                  foldingStrategy: "indentation",
                  showFoldingControls: "always",
                  lineNumbersMinChars: 3,
                  mouseWheelZoom: true,
                  roundedSelection: true,
                  }}
              />
            </div>
          </div>

          {/* Vertical Resizable Divider - Hide when editor is fullscreen */}
          {rightPanelEditorHeight < 100 && (
            <div
              className={`h-[4px] bg-base-300 hover:bg-blue-700 cursor-ns-resize flex items-center justify-center transition-colors flex-shrink-0 ${
                isDraggingVertical ? "bg-primary/30" : ""
              }`}
              onMouseDown={handleVerticalMouseDown}
            >
              <GripHorizontal className="w-4 h-4 text-base-content/50" />
            </div>
          )}

          {/* Results Section - Hide when editor is fullscreen */}
          {rightPanelEditorHeight < 100 && (
            <div
              className="flex-1 overflow-y-auto  border-1 border-gray-600 rounded-xl p-4 bg-base-50 min-h-[100px]"
              style={{
                height: `${100 - rightPanelEditorHeight}%`,
                minHeight: "100px",
              }}
            >
              {renderBottomPanel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestProblemPage;
