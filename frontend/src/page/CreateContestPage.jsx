import { useForm, useFieldArray } from "react-hook-form";
import { axiosInstance } from "../libs/axios.js";
import { useContestStore } from "../store/useContestStore.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";

function CreateContestPage() {
  const { createContest } = useContestStore();
  const navigate = useNavigate();
  const { problems, getAllProblems } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      problems: [{ problemId: "", marks: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems",
  });

  const onSubmit = async (data) => {
    try {
      // Convert marks to int and times to ISO string
      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        problems: data.problems.map((p) => ({
          ...p,
          marks: parseInt(p.marks),
        })),
      };
      console.log("Creating contest with payload:", payload);

      await createContest(payload);
      navigate("/dashboard/contest");
      reset();
    } catch (err) {
      alert(err?.response?.data?.message || "Error creating contest");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-base-200/80 rounded-3xl shadow-2xl border border-primary/20 mt-10 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight drop-shadow">
        Create a New Contest
      </h1>
      <p className="text-base-content/70 mb-8 text-lg">
        Fill in the details below to launch a new coding contest. Add problems,
        set marks, and schedule the event.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label font-semibold">Name</label>
            <input
              className="input input-bordered w-full text-lg"
              {...register("name", { required: true })}
              placeholder="Contest Name"
            />
            {errors.name && <span className="text-error">Name is required</span>}
          </div>
          <div>
            <label className="label font-semibold">Description</label>
            <textarea
              className="textarea textarea-bordered w-full text-lg min-h-[48px]"
              {...register("description", { required: true })}
              placeholder="Short contest description"
            />
            {errors.description && (
              <span className="text-error">Description is required</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label font-semibold">Start Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full text-lg"
              {...register("startTime", { required: true })}
            />
            {errors.startTime && (
              <span className="text-error">Start time is required</span>
            )}
          </div>
          <div>
            <label className="label font-semibold">End Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full text-lg"
              {...register("endTime", { required: true })}
            />
            {errors.endTime && (
              <span className="text-error">End time is required</span>
            )}
          </div>
        </div>
        <div className="mt-8">
          <label className="label font-bold text-lg mb-2">Problems</label>
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-3 items-end bg-base-100/80 rounded-xl p-4 shadow border border-primary/10"
              >
                <div className="flex-1">
                  <label className="label text-sm">Select Problem</label>
                  <select
                    className="input input-bordered w-full text-base"
                    {...register(`problems.${idx}.problemId`, { required: true })}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Problem
                    </option>
                    {problems.map((problem) => (
                      <option key={problem.id} value={problem.id}>
                        {problem.title || problem.name || `Problem ${problem.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-sm">Marks</label>
                  <input
                    className="input input-bordered w-24 text-base"
                    type="number"
                    min="0"
                    placeholder="Marks"
                    {...register(`problems.${idx}.marks`, {
                      required: true,
                      min: 0,
                    })}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-error btn-sm mt-4 md:mt-0"
                  onClick={() => remove(idx)}
                  disabled={fields.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-outline mt-4"
            onClick={() => append({ problemId: "", marks: "" })}
          >
            + Add Another Problem
          </button>
          {errors.problems && (
            <span className="text-error">At least one problem is required</span>
          )}
        </div>
        <button
          className="btn btn-success btn-lg w-full mt-8 shadow-xl text-lg tracking-wide"
          type="submit"
          disabled={isSubmitting}
        >
          Create Contest
        </button>
      </form>
    </div>
  );
}

export default CreateContestPage;
