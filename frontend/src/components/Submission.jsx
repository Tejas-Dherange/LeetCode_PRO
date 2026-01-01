import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import useAiStore from "../store/useAiStore";
import { useState, useRef, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Submission = ({ submission }) => {
  console.log("submission after", submission);

  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m))
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t))
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  const { isLLMLoading, complexity: rawComplexity, getComplexity } = useAiStore();

  // Parse complexity if it's a string
  let complexity = rawComplexity;
  if (typeof rawComplexity === "string") {
    try {
      const parsed = JSON.parse(rawComplexity);
      if (Array.isArray(parsed)) complexity = parsed;
    } catch (e) {
      // fallback: show as string
    }
  }
  const [showComplexityPopup, setShowComplexityPopup] = useState(false);
  const popupRef = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    if (!showComplexityPopup) return;
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowComplexityPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showComplexityPopup]);

  const handleComplexityClick = (e) => {
    const code = submission.sourceCode;
    getComplexity(code);
    setShowComplexityPopup(true);
  };

  // Map complexity notation to numeric values for visualization
  const complexityToValue = (notation) => {
    const map = {
      "O(1)": 1,
      "O(log n)": 2,
      "O(n)": 3,
      "O(n log n)": 4,
      "O(n^2)": 5,
      "O(n^3)": 6,
      "O(2^n)": 7,
      "O(n!)": 8,
    };
    return map[notation] || 1;
  };

  return (
    <div className="space-y-6 relative">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</h3>
            <div
              className={`text-2xl font-bold mt-1 flex items-center gap-2 ${
                submission.status === "Accepted" ? "text-success" : "text-error"
              }`}
            >
              {submission.status === "Accepted" ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Accepted
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  {submission.status}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Test Cases</h3>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {passedTests}/{totalTests}
              </div>
              <div className="w-full bg-base-300 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    successRate === 100 ? 'bg-success' : successRate >= 50 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Avg. Runtime
            </h3>
            <div className="text-2xl font-bold mt-1 font-mono">{(avgTime * 1000).toFixed(2)} ms</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1">
              <Memory className="w-3 h-3" />
              Avg. Memory
            </h3>
            <div className="text-2xl font-bold mt-1 font-mono">{(avgMemory / 1024).toFixed(2)} MB</div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl">Test Cases Results</h2>
            {successRate === 100 && (
              <button
                className="btn btn-primary gap-2"
                onClick={handleComplexityClick}
              >
                <Sparkles className="w-4 h-4" />
                Analyze Complexity
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="bg-base-200">Status</th>
                  <th className="bg-base-200">Expected</th>
                  <th className="bg-base-200">Output</th>
                  <th className="bg-base-200">Memory</th>
                  <th className="bg-base-200">Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id} className="border-b border-base-200 hover:bg-base-200/50 transition-colors">
                    <td>
                      {testCase.passed ? (
                        <div className="badge badge-success gap-2 py-3">
                          <CheckCircle2 className="w-4 h-4" />
                          Passed
                        </div>
                      ) : (
                        <div className="badge badge-error gap-2 py-3">
                          <XCircle className="w-4 h-4" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="bg-base-300 px-3 py-2 rounded font-mono text-sm max-w-xs">
                        <pre className="whitespace-pre-wrap break-words">{testCase.expected}</pre>
                      </div>
                    </td>
                    <td>
                      <div className={`px-3 py-2 rounded font-mono text-sm max-w-xs ${
                        testCase.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        <pre className="whitespace-pre-wrap break-words">{testCase.stdout || "null"}</pre>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{testCase.memory}</td>
                    <td className="font-mono text-sm">{testCase.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Complexity Popup */}
      {showComplexityPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            ref={popupRef}
            className="bg-base-100 rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-2xl w-full mx-4 relative border border-base-300"
          >
            <button
              className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
              onClick={() => setShowComplexityPopup(false)}
              aria-label="Close"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Time & Space Complexity</h3>
            </div>

            {isLLMLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="text-base-content/70 mt-4">Analyzing your code...</p>
              </div>
            ) : Array.isArray(complexity) && complexity.length === 2 ? (
              <>
                {/* Complexity Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                    <div className="card-body p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <div className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                          Time Complexity
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        {complexity[0]}
                      </div>
                    </div>
                  </div>
                  <div className="card bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20">
                    <div className="card-body p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Memory className="w-5 h-5 text-success" />
                        <div className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                          Space Complexity
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-success">
                        {complexity[1]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modern Graph */}
                <div className="bg-base-200 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-4 text-center">Complexity Comparison</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div>
                      <Bar
                        data={{
                          labels: ["Time", "Space"],
                          datasets: [
                            {
                              label: "Complexity Level",
                              data: [
                                complexityToValue(complexity[0]),
                                complexityToValue(complexity[1]),
                              ],
                              backgroundColor: [
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(34, 197, 94, 0.8)",
                              ],
                              borderColor: [
                                "rgba(59, 130, 246, 1)",
                                "rgba(34, 197, 94, 1)",
                              ],
                              borderWidth: 2,
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: { display: false },
                            title: { 
                              display: true,
                              text: 'Complexity Levels',
                              font: { size: 14, weight: 'bold' }
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  const complexities = [complexity[0], complexity[1]];
                                  return `${complexities[context.dataIndex]}`;
                                },
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 8,
                              ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                  const labels = ["", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)"];
                                  return labels[value] || "";
                                },
                              },
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Doughnut Chart */}
                    <div>
                      <Doughnut
                        data={{
                          labels: ["Time", "Space"],
                          datasets: [
                            {
                              data: [
                                complexityToValue(complexity[0]),
                                complexityToValue(complexity[1]),
                              ],
                              backgroundColor: [
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(34, 197, 94, 0.8)",
                              ],
                              borderColor: [
                                "rgba(59, 130, 246, 1)",
                                "rgba(34, 197, 94, 1)",
                              ],
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 15,
                                font: { size: 12 },
                              },
                            },
                            title: {
                              display: true,
                              text: 'Distribution',
                              font: { size: 14, weight: 'bold' }
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  const complexities = [complexity[0], complexity[1]];
                                  return `${context.label}: ${complexities[context.dataIndex]}`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Complexity Reference */}
                  <div className="mt-6 p-4 bg-base-100 rounded-lg">
                    <p className="text-xs text-base-content/60 text-center font-mono">
                      Lower values indicate better performance • O(1) is best • O(n!) is worst
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-base-content/70 py-8">
                No complexity info available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Submission;

