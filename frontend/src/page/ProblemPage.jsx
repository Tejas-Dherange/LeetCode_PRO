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
} from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import myCustomTheme from "../themes/customTheme";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLaguageId } from "../libs/utils";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import { useSubmissionStore } from "../store/useSubmissionStore";
import RunResultsTable from "../components/RunResultsTable";

const ProblemPage = () => {
  const { id } = useParams();
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

  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("my-dark-theme", myCustomTheme);
    monaco.editor.setTheme("my-dark-theme");
  };

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    // Clear run results when navigating to a new problem
    useExecutionStore.getState().clearRunResults && useExecutionStore.getState().clearRunResults();
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
      getSubmissionForProblem(id);
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
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
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
    const newEditorHeight = ((e.clientY - rightPanelRect.top) / rightPanelRect.height) * 100;
    
    // Apply constraints: min 30%, max 100% (allow full height)
    const constrainedHeight = Math.max(30, Math.min(100, newEditorHeight));
    setRightPanelEditorHeight(constrainedHeight);
  };

  const handleVerticalMouseUp = () => {
    setIsDraggingVertical(false);
  };

  useEffect(() => {
    if (isDraggingHorizontal) {
      document.addEventListener('mousemove', handleHorizontalMouseMove);
      document.addEventListener('mouseup', handleHorizontalMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
      if (!isDraggingVertical) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
      if (!isDraggingVertical) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isDraggingHorizontal]);

  useEffect(() => {
    if (isDraggingVertical) {
      document.addEventListener('mousemove', handleVerticalMouseMove);
      document.addEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      if (!isDraggingHorizontal) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      if (!isDraggingHorizontal) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [isDraggingVertical]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem?.description}</p>

            {problem?.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem?.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </>
            )}

            {problem?.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const { runCode, submitCode, runResults, submission, isSubmitExecuting, isRunExecuting } =
    useExecutionStore();

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
      submitCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("error in submitting code", error);
    }
  };

  const renderBottomPanel = () => {
    if (runResults) {
      return <RunResultsTable results={runResults} />;
    } else if (submission) {
      return <Submission submission={submission} />;
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
    <div className="min-h-screen w-[90vw] bg-gradient-to-br from-base-300 to-base-200">
      {/* Navigation */}
      <nav className="navbar bg-base-100 shadow-lg px-10">
        <div className="flex-1 gap-2">
          <Link to={"/dashboard"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem?.title}</h1>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem?.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-bordered select-primary w-40"
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
      </nav>

      {/* Main Content - Resizable Split Layout */}
      <div className="h-[calc(100vh-120px)] flex" ref={containerRef}>
        {/* Left Panel - Problem Description */}
        <div 
          className="bg-base-100 shadow-xl border-r border-base-300 flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Tabs */}
          <div className="tabs tabs-bordered bg-gray-700">
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
            <button
              className={`tab gap-2 ${
                activeTab === "discussion" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("discussion")}
            >
              <MessageSquare className="w-4 h-4" />
              Discussion
            </button>
            <button
              className={`tab gap-2 ${
                activeTab === "hints" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("hints")}
            >
              <Lightbulb className="w-4 h-4" />
              Hints
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Horizontal Resizable Divider */}
        <div
          className={`w-3 bg-base-300 hover:bg-primary/20 cursor-col-resize flex items-center justify-center transition-colors ${
            isDraggingHorizontal ? 'bg-primary/30' : ''
          }`}
          onMouseDown={handleHorizontalMouseDown}
        >
          <GripVertical className="w-6 h-7 text-base-content/50" />
        </div>

        {/* Right Panel - Code Editor and Results */}
        <div 
          className="bg-base-100 shadow-xl flex flex-col"
          style={{ width: `${100 - leftPanelWidth}%` }}
          ref={rightPanelRef}
        >
          {/* Code Editor Section */}
          <div 
            className="flex flex-col"
            style={{ height: `${rightPanelEditorHeight}%` }}
          >
            {/* Code Editor Header */}
            <div className="tabs tabs-bordered flex-shrink-0 border-b border-base-300">
              <button className="tab tab-active gap-2">
                <Terminal className="w-4 h-4" />
                Code Editor
              </button>
              <div className="flex-1"></div>
              <button 
                className="btn hover:btn-primary btn-sm mr-2"
                onClick={() => setRightPanelEditorHeight(rightPanelEditorHeight === 100 ? 70 : 100)}
              >
                {rightPanelEditorHeight === 100 ? 'Show Results' : <Maximize/>}
              </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                onMount={handleEditorMount}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 22,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-base-300 bg-base-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <button
                  className={`btn btn-primary gap-2 ${
                    isRunExecuting ? "loading" : ""
                  }`}
                  onClick={handleRunCode}
                  disabled={isRunExecuting}
                >
                  {!isRunExecuting && <Play className="w-4 h-4" />}
                  Run Code
                </button>

                <button
                  className={`btn btn-success gap-2 ${
                    isSubmitExecuting ? "loading" : ""
                  }`}
                  onClick={handleSubmitCode}
                  disabled={isSubmitExecuting}
                >
                  {!isSubmitExecuting && <Play className="w-4 h-4" />}
                  Submit Solution
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Resizable Divider - Hide when editor is fullscreen */}
          {rightPanelEditorHeight < 100 && (
            <div
              className={`h-1 bg-base-300 hover:bg-primary/20 cursor-row-resize flex items-center justify-center transition-colors flex-shrink-0 ${
                isDraggingVertical ? 'bg-primary/30' : ''
              }`}
              onMouseDown={handleVerticalMouseDown}
            >
              <GripHorizontal className="w-4 h-4 text-base-content/50" />
            </div>
          )}

          {/* Results Section - Hide when editor is fullscreen */}
          {rightPanelEditorHeight < 100 && (
            <div 
              className="flex-1 overflow-y-auto p-4 bg-base-50"
              style={{ height: `${100 - rightPanelEditorHeight}%`, minHeight: '100px' }}
            >
              {renderBottomPanel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;