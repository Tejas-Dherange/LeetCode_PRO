import React from 'react'
import CreateProblemForm from '../components/CreateProblemForm'
import { FileText, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AddProblemPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 py-8 px-4">
      <div className="p-6 mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-ghost btn-sm gap-2 mb-4 hover:bg-emerald-500/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                Create New Problem
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                Add a new coding problem to the platform
              </p>
            </div>
          </div>
        </div>
        
        {/* Form Component */}
        <CreateProblemForm />
      </div>
    </div>
  )
}

export default AddProblemPage
