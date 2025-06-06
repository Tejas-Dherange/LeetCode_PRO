import { CheckCircle2, XCircle, Clock, MemoryStick as Memory } from 'lucide-react';

const RunResultsTable = ({ results }) => {


  if (!results || results.length === 0) {
    return <div className="text-center text-base-content/70">No results to display.</div>;
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
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div className={`text-lg font-bold ${
              passedTests === totalTests ? 'text-success' : 'text-error'
            }`}>
              {passedTests === totalTests ? 'Accepted' : 'Wrong Answer'}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">
              {isNaN(avgTime) ? '-' : avgTime.toFixed(3) + ' s'}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">
              {isNaN(avgMemory) ? '-' : avgMemory.toFixed(0) + ' KB'}
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Test Cases Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Input</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {results.map((testCase, idx) => (
                  <tr key={idx}>
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
                    <td className="font-mono">{testCase.stdin ?? '-'}</td>
                    <td className="font-mono">{testCase.expected ?? '-'}</td>
                    <td className="font-mono">{testCase.stdout ?? 'null'}</td>
                    <td>{testCase.memory ?? '-'}</td>
                    <td>{testCase.time ?? '-'}</td>
                    <td className="text-xs text-red-400">{testCase.stderr || testCase.compileOutput || '-'}</td>
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

export default RunResultsTable;