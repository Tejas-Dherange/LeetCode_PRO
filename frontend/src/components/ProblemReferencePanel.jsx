import React from 'react';
import { Lightbulb, BookOpen, CheckCircle2, AlertCircle, Code2 } from 'lucide-react';

const ProblemReferencePanel = ({ sampleData }) => {
  return (
    <div className="space-y-8">
      {/* Header Section - matches form header height */}
      <div className="card bg-emerald-500/10 backdrop-blur-md shadow-lg border-2 border-emerald-500/30 mb-6">
        <div className="card-body p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-emerald-600">Reference Example</h3>
              <p className="text-xs text-base-content/60">Filled sample for guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information - matches form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="form-control md:col-span-2 mt-[75px]">
          <label className="label">
            <span className="label-text text-base md:text-lg font-semibold">Title</span>
          </label>
          <div className="input input-bordered w-full text-base md:text-lg bg-emerald-500/5 cursor-not-allowed">
            {sampleData.title}
          </div>
        </div>

        {/* Description */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text text-base md:text-lg font-semibold">Description</span>
          </label>
          <div className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 bg-emerald-500/5 cursor-not-allowed overflow-hidden">
            {sampleData.description}
          </div>
        </div>

        {/* Difficulty */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base md:text-lg font-semibold">Difficulty</span>
          </label>
          <div className="select select-bordered w-full text-base md:text-lg bg-emerald-500/5 cursor-not-allowed">
            {sampleData.difficulty}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="card bg-base-200 p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Tags
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                className="input input-bordered flex-1 bg-emerald-500/5 cursor-not-allowed"
                value={tag}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      {/* Company Tags Section */}
      <div className="card bg-base-200 p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Company Tags
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="input input-bordered flex-1 bg-emerald-500/5 cursor-not-allowed"
              value="Google"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Test Cases Section */}
      <div className="card bg-base-200 p-4 md:p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Test Cases
          </h3>
        </div>
        <div className="space-y-6">
          {/* All Test Cases */}
          {sampleData.testcases.map((testcase, idx) => (
            <div key={idx} className="card bg-base-100 shadow-md">
              <div className="card-body p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base md:text-lg font-semibold">Test Case #{idx + 1}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Input</span>
                    </label>
                    <div className="textarea textarea-bordered min-h-24 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
                      {testcase.input}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Expected Output</span>
                    </label>
                    <div className="textarea textarea-bordered min-h-24 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
                      {testcase.output}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor Sections - All 3 Languages */}
      {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
        <div key={language} className="card bg-base-200 p-4 md:p-6 shadow-md">
          <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-500" />
            {language}
          </h3>

          <div className="space-y-6">
            {/* Starter Code */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4 md:p-6">
                <h4 className="font-semibold text-base md:text-lg mb-4">Starter Code Template</h4>
                <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-xs overflow-x-auto max-h-96">
                  <pre className="whitespace-pre-wrap">{sampleData.codeSnippets?.[language] || "// Sample code..."}</pre>
                </div>
              </div>
            </div>

            {/* Reference Solution */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4 md:p-6">
                <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Reference Solution
                </h4>
                <div className="p-3 bg-gray-900 text-green-400 rounded-md font-mono text-xs overflow-x-auto max-h-96">
                  <pre className="whitespace-pre-wrap">{sampleData.referenceSolutions?.[language] || "// Sample solution..."}</pre>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4 md:p-6">
                <h4 className="font-semibold text-base md:text-lg mb-4">Example</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Input</span>
                    </label>
                    <div className="textarea textarea-bordered min-h-20 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
                      {sampleData.examples?.[language]?.input || ""}
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Output</span>
                    </label>
                    <div className="textarea textarea-bordered min-h-20 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
                      {sampleData.examples?.[language]?.output || ""}
                    </div>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Explanation</span>
                    </label>
                    <div className="textarea textarea-bordered min-h-24 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
                      {sampleData.examples?.[language]?.explanation || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Additional Information */}
      <div className="card bg-base-200 p-4 md:p-6 shadow-md">
        <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Additional Information
        </h3>
        <div className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Constraints</span>
            </label>
            <div className="textarea textarea-bordered min-h-24 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
              {sampleData.constraints}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Hints (Optional)</span>
            </label>
            <div className="textarea textarea-bordered min-h-24 w-full p-3 bg-amber-500/5 cursor-not-allowed">
              {sampleData.hints}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Editorial (Optional)</span>
            </label>
            <div className="textarea textarea-bordered min-h-32 w-full p-3 bg-emerald-500/5 cursor-not-allowed">
              {sampleData.editorial}
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="alert alert-info">
        <AlertCircle className="w-5 h-5" />
        <span>All reference fields align with form fields on the left</span>
      </div>
    </div>
  );
};

export default ProblemReferencePanel;
