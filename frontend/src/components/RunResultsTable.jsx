import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, AlertCircle } from 'lucide-react';

const RunResultsTable = ({ results }) => {

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-base-content/30 mb-3" />
        <div className="text-center text-base-content/70">No results to display.</div>
      </div>
    );
  }

  // Calculate averages
  const memoryArr = results.map(r => parseFloat(r.memory || 0));
  const timeArr = results.map(r => parseFloat(r.time || 0));
  const avgMemory = memoryArr.reduce((a, b) => a + b, 0) / memoryArr.length;
  const avgTime = timeArr.reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = results.filter(tc => tc.passed).length;
  const totalTests = results.length;
  const successRate = (passedTests / totalTests) * 100;

  console.log("RunResultsTable - Results:", results);
  
  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</h3>
            <div className={`text-2xl font-bold mt-1 flex items-center gap-2 ${
              passedTests === totalTests ? 'text-success' : 'text-error'
            }`}>
              {passedTests === totalTests ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Accepted
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  Failed
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
            <div className="text-2xl font-bold mt-1 font-mono">
              {isNaN(avgTime) ? '-' : (avgTime * 1000).toFixed(2) + ' ms'}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
          <div className="card-body p-5">
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1">
              <Memory className="w-3 h-3" />
              Avg. Memory
            </h3>
            <div className="text-2xl font-bold mt-1 font-mono">
              {isNaN(avgMemory) ? '-' : (avgMemory / 1024).toFixed(2) + ' MB'}
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Cases Results
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  <th className="bg-base-200">Status</th>
                  <th className="bg-base-200">Input</th>
                  <th className="bg-base-200">Expected</th>
                  <th className="bg-base-200">Output</th>
                  <th className="bg-base-200">Memory</th>
                  <th className="bg-base-200">Time</th>
                  <th className="bg-base-200">Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((testCase, idx) => (
                  <tr key={idx} className="border-b border-base-200 hover:bg-base-200/50 transition-colors">
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
                        <pre className="whitespace-pre-wrap break-words">{testCase.stdin ?? '-'}</pre>
                      </div>
                    </td>
                    <td>
                      <div className="bg-base-300 px-3 py-2 rounded font-mono text-sm max-w-xs">
                        <pre className="whitespace-pre-wrap break-words">{testCase.expected ?? '-'}</pre>
                      </div>
                    </td>
                    <td>
                      <div className={`px-3 py-2 rounded font-mono text-sm max-w-xs ${
                        testCase.passed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        <pre className="whitespace-pre-wrap break-words">{testCase.stdout ?? 'null'}</pre>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{testCase.memory ?? '-'}</td>
                    <td className="font-mono text-sm">{testCase.time ?? '-'}</td>
                    <td>
                      {testCase.stderr || testCase.compileOutput ? (
                        <div className="bg-error/10 text-error px-3 py-2 rounded text-xs max-w-xs">
                          <pre className="whitespace-pre-wrap break-words">{testCase.stderr || testCase.compileOutput}</pre>
                        </div>
                      ) : (
                        <span className="text-base-content/40">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing import
const FileText = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default RunResultsTable;
