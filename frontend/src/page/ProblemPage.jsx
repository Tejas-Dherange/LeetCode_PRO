import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Cpu,
  Settings,
  X,
  Check
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
import useAuthStore from "../store/useAuthStore";
import { mergeStudentCodeWithTemplate } from "../utils/codeTemplateMerger";

const ProblemPage = () => {
  const { id } = useParams();
  const { isProblemLoading, problem, getProblemById } = useProblemStore();
  
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    submissionbyuser,
    getSubmissionByUserAndProblem,
  } = useSubmissionStore();
  
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVA");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  // Editor Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 18,
    fontLigatures: true,
    tabSize: 4,
    wordWrap: "on",
    lineNumbers: "on", // "on", "off", "relative"
    minimap: false,
  });

  // Resizable split pane state
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [rightPanelEditorHeight, setRightPanelEditorHeight] = useState(70);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const containerRef = useRef(null);
  const rightPanelRef = useRef(null);

  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleEditorMount = (editor, monaco) => {
    monaco.editor.defineTheme("my-dark-theme", myCustomTheme);
    if (theme === "dark") {
      monaco.editor.setTheme("my-dark-theme");
    } else {
      monaco.editor.setTheme("vs-light");
    }
  };

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
    getSubmissionCountForProblem(id);
    if (useExecutionStore.getState().clearRunResults) {
      useExecutionStore.getState().clearRunResults();
    }
    if (useExecutionStore.getState().submission !== null) {
      useExecutionStore.setState({ submission: null });
    }
  }, [id]);

  useEffect(() => {
    if (problem) {
      const snippetToUse = problem.studentCodeSnippet?.[selectedLanguage] 
        || problem.codeSnippet?.[selectedLanguage] 
        || "";
      
      setCode(snippetToUse);
      
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
      getSubmissionByUserAndProblem(id, useAuthStore.getState().authUser.id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const snippetToUse = problem.studentCodeSnippet?.[lang] 
      || problem.codeSnippet?.[lang] 
      || "";
    setCode(snippetToUse);
  };

  // Horizontal Resize Handlers
  const handleHorizontalMouseDown = (e) => {
    setIsDraggingHorizontal(true);
    e.preventDefault();
  };

  const handleHorizontalMouseMove = (e) => {
    if (!isDraggingHorizontal || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
    setLeftPanelWidth(constrainedWidth);
  };

  const handleHorizontalMouseUp = () => setIsDraggingHorizontal(false);

  // Vertical Resize Handlers
  const handleVerticalMouseDown = (e) => {
    setIsDraggingVertical(true);
    e.preventDefault();
  };

  const handleVerticalMouseMove = (e) => {
    if (!isDraggingVertical || !rightPanelRef.current) return;
    const rightPanelRect = rightPanelRef.current.getBoundingClientRect();
    const newEditorHeight = ((e.clientY - rightPanelRect.top) / rightPanelRect.height) * 100;
    const constrainedHeight = Math.max(30, Math.min(100, newEditorHeight));
    setRightPanelEditorHeight(constrainedHeight);
  };

  const handleVerticalMouseUp = () => setIsDraggingVertical(false);

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
      if (!isDraggingVertical) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }
    return () => {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
      if (!isDraggingVertical) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isDraggingVertical]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose prose-lg max-w-none prose-invert pb-10">
            <h1 className="text-3xl mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {problem?.title}
            </h1>
            
            <div className="mb-8 p-6 bg-base-200/40 rounded-2xl border border-base-content/5 shadow-inner">
              <div className="text-base-content/90 leading-relaxed whitespace-pre-wrap font-medium">
                {problem?.description}
              </div>
            </div>

            {problem?.examples && (
              <>
                <h3 className="text-xl font-bold mb-4 text-base-content flex items-center gap-2">
                   <Code2 className="w-5 h-5 text-emerald-500" />
                   Examples:
                </h3>
                {Object.entries(problem?.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200/50 p-6 rounded-xl mb-6 border border-base-content/5 hover:border-emerald-500/20 transition-colors"
                    >
                      <div className="mb-4">
                        <div className="text-base-content/60 mb-2 text-xs font-bold uppercase tracking-wider">Input</div>
                        <div className="bg-base-300/50 px-4 py-3 rounded-lg font-mono text-sm border border-base-content/5 text-base-content">
                          <pre className="whitespace-pre-wrap break-words">{example.input}</pre>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-base-content/60 mb-2 text-xs font-bold uppercase tracking-wider">Output</div>
                        <div className="bg-base-300/50 px-4 py-3 rounded-lg font-mono text-sm border border-base-content/5 text-base-content">
                          <pre className="whitespace-pre-wrap break-words">{example.output}</pre>
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-500 mb-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                             <Lightbulb className="w-3 h-3" />
                             Explanation
                          </div>
                          <div className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-emerald-500/30">
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
                <h3 className="text-xl font-bold mb-4 text-base-content flex items-center gap-2">
                   <Zap className="w-5 h-5 text-amber-500" />
                   Constraints:
                </h3>
                <div className="bg-base-200/50 p-6 rounded-xl mb-6 border border-base-content/5">
                  <div className="bg-base-300/50 px-4 py-3 rounded-lg font-mono text-sm text-base-content/80">
                    <pre className="whitespace-pre-wrap break-words">{problem.constraints}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return <SubmissionsList submissions={submissionbyuser} isLoading={isSubmissionsLoading} />;
      case "discussion":
        return (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px] text-base-content/60">
            <MessageSquare className="w-12 h-12 mb-4 text-base-content/20" />
            <h3 className="text-lg font-bold mb-2">Discussion Section</h3>
            <p>No discussions started yet.</p>
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
                <div className="text-base-content/90 leading-relaxed whitespace-pre-wrap flex gap-3">
                   <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  {problem.hints}
                </div>
              </div>
            ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px] text-base-content/60">
                <Lightbulb className="w-12 h-12 mb-4 text-base-content/20" />
                <h3 className="text-lg font-bold mb-2">No Hints Available</h3>
                <p>Try to solve this without hints first!</p>
              </div>
            )}
          </div>
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
    cooldownSeconds,
  } = useExecutionStore();

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const fullTemplate = problem.codeSnippet?.[selectedLanguage] || "";
      const executableCode = mergeStudentCodeWithTemplate(code, fullTemplate);
      const language_id = getLaguageId(selectedLanguage);
      const stdin = problem.testcase.map((tc) => tc.input);
      const expected_outputs = problem.testcase.map((tc) => tc.output);
      runCode(executableCode, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("error in executing code", error);
    }
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const fullTemplate = problem.codeSnippet?.[selectedLanguage] || "";
      const executableCode = mergeStudentCodeWithTemplate(code, fullTemplate);
      const language_id = getLaguageId(selectedLanguage);
      const stdin = problem.testcase.map((tc) => tc.input);
      const expected_outputs = problem.testcase.map((tc) => tc.output);
      submitCode(executableCode, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("error in submitting code", error);
    }
  };

  const renderBottomPanel = () => {
    if (runResults) {
      return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-base-content/10 hover:scrollbar-thumb-base-content/20">
          <RunResultsTable results={runResults} />
        </div>
      );
    } else if (submission) {
      return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-base-content/10 hover:scrollbar-thumb-base-content/20">
          <Submission submission={submission} />
        </div>
      );
    } else {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-base-100/95 backdrop-blur-sm p-1 z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
               <Terminal className="w-4 h-4" />
               Test Cases
            </h3>
          </div>
          <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-base-content/10 hover:scrollbar-thumb-base-content/20">
            <table className="table table-sm w-full text-left">
              <thead>
                <tr className="border-b border-base-content/10">
                  <th className="bg-transparent text-base-content/60 font-semibold p-3 pl-4">Input</th>
                  <th className="bg-transparent text-base-content/60 font-semibold p-3">Expected Output</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {testCases.map((testCase, index) => (
                  <tr key={index} className="border-b border-base-content/5 hover:bg-base-content/5 transition-colors cursor-default">
                    <td className="p-3 pl-4 text-emerald-500">{testCase.input}</td>
                    <td className="p-3 text-base-content/70">{testCase.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-screen w-full bg-base-100 overflow-hidden relative font-sans selection:bg-emerald-500/30">
       {/* Premium Animated Background */}
       <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-100 to-base-200/50" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-20%] w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" 
        />
      </div>

      {/* Editor Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-base-100 w-[90%] max-w-md rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden">
              <div className="p-4 border-b border-base-content/5 flex items-center justify-between bg-base-200/30">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-500" />
                  Editor Settings
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Font Size */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content">Font Size</span>
                    <span className="text-xs text-base-content/50">Control the text size in editor</span>
                  </div>
                  <select 
                    value={editorSettings.fontSize}
                    onChange={(e) => setEditorSettings({...editorSettings, fontSize: parseInt(e.target.value)})}
                    className="select select-bordered select-sm w-24 cursor-pointer bg-base-200"
                  >
                    {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Font Ligatures */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content">Font Ligatures</span>
                    <span className="text-xs text-base-content/50">Enable special character combinations</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success cursor-pointer"
                    checked={editorSettings.fontLigatures}
                    onChange={(e) => setEditorSettings({...editorSettings, fontLigatures: e.target.checked})}
                  />
                </div>

                {/* Word Wrap */}
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                    <span className="font-semibold text-base-content">Word Wrap</span>
                    <span className="text-xs text-base-content/50">Wrap long lines to fit usage</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success cursor-pointer"
                    checked={editorSettings.wordWrap === "on"}
                    onChange={(e) => setEditorSettings({...editorSettings, wordWrap: e.target.checked ? "on" : "off"})}
                  />
                </div>

                {/* Line Numbers */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content">Relative Line Numbers</span>
                    <span className="text-xs text-base-content/50">Show numbers relative to cursor</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success cursor-pointer"
                    checked={editorSettings.lineNumbers === "relative"}
                    onChange={(e) => setEditorSettings({...editorSettings, lineNumbers: e.target.checked ? "relative" : "on"})}
                  />
                </div>

                 {/* Tab Size */}
                 <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-base-content">Tab Size</span>
                    <span className="text-xs text-base-content/50">Spaces per tab indentation</span>
                  </div>
                  <select 
                    value={editorSettings.tabSize}
                    onChange={(e) => setEditorSettings({...editorSettings, tabSize: parseInt(e.target.value)})}
                    className="select select-bordered select-sm w-24 cursor-pointer bg-base-200"
                  >
                     <option value={2}>2 Spaces</option>
                     <option value={4}>4 Spaces</option>
                     <option value={8}>8 Spaces</option>
                  </select>
                </div>
              </div>
              <div className="p-4 border-t border-base-content/5 bg-base-200/30 flex justify-end">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="btn btn-primary btn-sm px-6 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="relative z-20 w-full px-4 h-[60px] flex items-center border-b border-base-content/5 bg-base-100/60 backdrop-blur-xl">
        <div className="flex items-center justify-between w-full h-full">
          {/* Breadcrumb and Problem Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-base-200/50 text-base-content/60 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-base-content/30" />
            <span className="text-base-content font-bold text-lg truncate max-w-[200px] md:max-w-md bg-transparent select-none">
              {problem?.title || "Loading Problem..."}
            </span>
          </div>

          {/* Centered Run/Submit buttons */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 p-1 bg-base-100/80 backdrop-blur-md rounded-xl border border-base-content/10 shadow-lg">
            <button
               className="btn btn-sm btn-ghost gap-2 text-base-content hover:bg-base-200 hover:text-emerald-500 rounded-lg h-9 px-4 font-bold transition-all cursor-pointer"
               onClick={handleRunCode}
               disabled={isRunExecuting || cooldownSeconds > 0}
            >
               {cooldownSeconds > 0 ? (
                 <>
                   <span className="loading loading-spinner w-3 h-3" />
                   <span className="text-xs">{cooldownSeconds}s</span>
                 </>
               ) : isRunExecuting ? (
                 <span className="loading loading-spinner w-4 h-4" />
               ) : (
                 <Play className="w-4 h-4 text-emerald-500" />
               )}
               <span className="hidden sm:inline text-xs uppercase tracking-wider">
                 {cooldownSeconds > 0 ? 'Wait' : 'Run'}
               </span>
            </button>
            <div className="w-px h-6 bg-base-content/10 my-auto mx-1"></div>
            <button
              className="btn btn-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white border-none rounded-lg h-9 px-6 gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all font-bold cursor-pointer"
              onClick={handleSubmitCode}
              disabled={isSubmitExecuting || cooldownSeconds > 0}
            >
              {cooldownSeconds > 0 ? (
                <>
                  <span className="loading loading-spinner w-3 h-3 text-white" />
                  <span className="text-xs">{cooldownSeconds}s</span>
                </>
              ) : isSubmitExecuting ? (
                <span className="loading loading-spinner w-4 h-4 text-white" />
              ) : (
                <Cpu className="w-4 h-4 text-white" />
              )}
              <span className="hidden sm:inline text-xs uppercase tracking-wider">
                {cooldownSeconds > 0 ? 'Wait' : 'Submit'}
              </span>
            </button>
          </div>

           {/* Right Actions */}
           <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-base-200/80 rounded-lg p-0.5 border border-base-content/5">
                <select
                  className="select select-xs select-ghost w-32 focus:outline-none focus:bg-transparent font-mono text-xs cursor-pointer bg-base-200"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  {Object.keys(problem?.codeSnippet || {}).map((lang) => (
                    <option key={lang} value={lang} className="bg-base-100">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
             </div>

             <div className="flex items-center gap-1 border-l border-base-content/10 pl-3 ml-2">
                 <button className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:bg-base-content/5 cursor-pointer" onClick={toggleTheme}>
                   {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
                 <button 
                  className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:bg-base-content/5 cursor-pointer"
                  onClick={() => setShowSettings(true)}
                  title="Editor Settings"
                 >
                    <Settings className="w-4 h-4" />
                 </button>
                 <button className="btn btn-ghost btn-xs btn-square text-base-content/60 hover:bg-base-content/5 cursor-pointer"><Share2 className="w-4 h-4" /></button>
             </div>
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 h-[calc(100vh-60px)] p-2 flex gap-2" ref={containerRef}>
        
        {/* Left Panel */}
        <div
          className="bg-base-100/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-base-content/5 flex flex-col overflow-hidden"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Tabs */}
          <div className="flex px-2 pt-2 gap-1 border-b border-base-content/5 bg-base-200/30">
             {[
               { id: 'description', icon: FileText, label: 'Description' },
               { id: 'submissions', icon: Code2, label: 'Submissions' },
               { id: 'hints', icon: Lightbulb, label: 'Hints' }
             ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-colors relative cursor-pointer ${activeTab === tab.id ? 'text-emerald-500 bg-base-100 shadow-sm' : 'text-base-content/50 hover:bg-base-200/50 hover:text-base-content'}`}
               >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-base-content/10 hover:scrollbar-thumb-base-content/20">
             {renderTabContent()}
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-[6px] rounded-full hover:bg-emerald-500/50 cursor-ew-resize flex items-center justify-center transition-all group ${
            isDraggingHorizontal ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-transparent"
          }`}
          onMouseDown={handleHorizontalMouseDown}
        >
          <div className="h-8 w-1 rounded-full bg-base-content/20 group-hover:bg-white transition-colors"></div>
        </div>

        {/* Right Panel */}
        <div
          className="flex flex-col gap-2 min-w-[200px] min-h-0"
          style={{ width: `${100 - leftPanelWidth}%` }}
          ref={rightPanelRef}
        >
          {/* Editor */}
          <div
            className="flex flex-col rounded-2xl overflow-hidden border border-base-content/5 bg-base-100/60 backdrop-blur-xl shadow-2xl"
            style={{ height: `${rightPanelEditorHeight}%` }}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-base-200/30 border-b border-base-content/5">
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
                  <Terminal className="w-4 h-4" />
                  Code Editor
               </div>
               <div className="flex items-center gap-1">
                 <button 
                  className="p-1.5 rounded-lg hover:bg-base-content/5 text-base-content/60 transition-colors cursor-pointer"
                  onClick={() => setShowSettings(true)}
                 >
                    <Settings className="w-3.5 h-3.5" />
                 </button>
                 <button
                  className="p-1.5 rounded-lg hover:bg-base-content/5 text-base-content/60 transition-colors cursor-pointer"
                  onClick={() => setRightPanelEditorHeight(rightPanelEditorHeight === 100 ? 70 : 100)}
                >
                  {rightPanelEditorHeight === 100 ? <GripHorizontal className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
               </div>
            </div>
            
            <div className="flex-1 min-h-0 relative">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                onMount={handleEditorMount}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: editorSettings.minimap },
                  fontSize: editorSettings.fontSize,
                  lineNumbers: editorSettings.lineNumbers,
                  wordWrap: editorSettings.wordWrap,
                  fontLigatures: editorSettings.fontLigatures,
                  tabSize: editorSettings.tabSize,
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  padding: { top: 16 },
                  mouseWheelZoom: true,
                  theme: theme === 'dark' ? 'my-dark-theme' : 'vs-light'
                }}
              />
            </div>
          </div>

          {/* Vertical Divider */}
          {rightPanelEditorHeight < 100 && (
            <div
              className={`h-[6px] w-full rounded-full hover:bg-emerald-500/50 cursor-ns-resize flex items-center justify-center transition-all group ${
                isDraggingVertical ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-transparent"
              }`}
              onMouseDown={handleVerticalMouseDown}
            >
               <div className="w-8 h-1 rounded-full bg-base-content/20 group-hover:bg-white transition-colors"></div>
            </div>
          )}

          {/* Results */}
          {rightPanelEditorHeight < 100 && (
            <div
              className="flex-1 overflow-hidden border border-base-content/5 rounded-2xl bg-base-100/60 backdrop-blur-xl shadow-2xl p-4 flex flex-col"
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

export default ProblemPage;
