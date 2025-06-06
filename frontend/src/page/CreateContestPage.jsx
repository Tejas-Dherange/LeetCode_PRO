import { useForm, useFieldArray } from "react-hook-form";
import { axiosInstance } from "../libs/axios.js";
import { useContestStore } from "../store/useContestStore.js";
import { useNavigate } from "react-router-dom";

function CreateContestPage() {
  const { createContest } = useContestStore();
  const navigate = useNavigate();

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
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Contest</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="text-error">Name is required</span>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="text-error">Description is required</span>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Start Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              {...register("startTime", { required: true })}
            />
            {errors.startTime && (
              <span className="text-error">Start time is required</span>
            )}
          </div>
          <div className="flex-1">
            <label className="label">End Time</label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              {...register("endTime", { required: true })}
            />
            {errors.endTime && (
              <span className="text-error">End time is required</span>
            )}
          </div>
        </div>
        <div>
          <label className="label">Problems</label>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end mb-2">
              <input
                className="input input-bordered"
                placeholder="Problem ID"
                {...register(`problems.${idx}.problemId`, { required: true })}
              />
              <input
                className="input input-bordered w-24"
                type="number"
                min="0"
                placeholder="Marks"
                {...register(`problems.${idx}.marks`, {
                  required: true,
                  min: 0,
                })}
              />
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary btn-sm mt-2"
            onClick={() => append({ problemId: "", marks: "" })}
          >
            Add Problem
          </button>
          {errors.problems && (
            <span className="text-error">At least one problem is required</span>
          )}
        </div>
        <button
          className="btn btn-success w-full"
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
