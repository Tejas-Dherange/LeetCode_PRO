import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";
import useAiStore from "../store/useAiStore";
import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Submission = ({ submission }) => {
  console.log("submission after", submission);

  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  const { isLLMLoading, complexity: rawComplexity, getComplexity } = useAiStore();

  // Parse complexity if it's a string (e.g., '["O(1)", "O(1)"]')
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
  return (
    <div className="space-y-6 relative">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div
              className={`text-lg font-bold ${
                submission.status === "Accepted" ? "text-success" : "text-error"
              }`}
            >
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">{successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{avgTime.toFixed(3)} s</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className=" flex justify-between">
            <h2 className="card-title mb-4">Test Cases Results</h2>
            <h2>
              {successRate === 100 ? (
                <button
                  className="p-2 border-1 hover:bg-base-300 cursor-pointer text-pink-500 bg-base-100 rounded-xl"
                  onClick={handleComplexityClick}
                >
                  Get Complexities
                </button>
              ) : null}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono">{testCase.expected}</td>
                    <td className="font-mono">{testCase.stdout || "null"}</td>
                    <td>{testCase.memory}</td>
                    <td>{testCase.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Complexity Popup */}
      {showComplexityPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            ref={popupRef}
            className="bg-base-100 rounded-xl shadow-2xl p-8 min-w-[340px] max-w-lg relative animate-fade-in"
          >
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
              onClick={() => setShowComplexityPopup(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-center text-primary">Time & Space Complexity</h3>
            {isLLMLoading ? (
              <div className="text-center text-base-content/70 py-8">Loading...</div>
            ) : Array.isArray(complexity) && complexity.length === 2 ? (
              <>
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-4">
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base-content/70 mb-1">Time Complexity</div>
                    <div className="text-lg font-bold text-blue-600 bg-blue-100 rounded-lg px-4 py-2 inline-block">
                      {complexity[0]}
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-semibold text-base-content/70 mb-1">Space Complexity</div>
                    <div className="text-lg font-bold text-green-600 bg-green-100 rounded-lg px-4 py-2 inline-block">
                      {complexity[1]}
                    </div>
                  </div>
                </div>
                {/* Graph */}
                <div className="my-4">
                  <Bar
                    data={{
                      labels: ["Time", "Space"],
                      datasets: [
                        {
                          label: "Big O Complexity (relative)",
                          data: [
                            complexity[0].replace(/[^0-9]/g, "") || 1,
                            complexity[1].replace(/[^0-9]/g, "") || 1,
                          ],
                          backgroundColor: ["#3b82f6", "#22c55e"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return [
                                context.dataIndex === 0
                                  ? `Time: ${complexity[0]}`
                                  : `Space: ${complexity[1]}`,
                              ];
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            callback: function (value) {
                              return value;
                            },
                          },
                          title: {
                            display: true,
                            text: "Relative Complexity (O notation)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-base-content/70 py-8">No complexity info available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Submission;
