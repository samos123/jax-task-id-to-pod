"use client";

import { useState } from "react";

export default function Home() {
  const [taskIdString, setTaskIdString] = useState("");
  const [podsPerSlice, setPodsPerSlice] = useState(512);
  const [podName, setPodName] = useState("");
  const [error, setError] = useState("");

  const calculatePodName = () => {
    setError("");
    setPodName("");

    if (!taskIdString || !podsPerSlice) {
      setError("Please fill in both fields.");
      return;
    }

    const match = taskIdString.match(/\/task:(\d+)/);
    const taskId = match ? parseInt(match[1], 10) : parseInt(taskIdString.split(':').pop() || 'NaN', 10);

    if (isNaN(taskId)) {
      setError("Invalid Task ID format. It should end with 'task:<number>' or just be the number.");
      return;
    }

    const pps = Number(podsPerSlice);
    if (isNaN(pps) || pps <= 0) {
      setError("Pods per slice must be a positive number.");
      return;
    }

    const slice_id = Math.floor(taskId / pps);
    const process_id = taskId % pps;

    setPodName(`job-${slice_id}-${process_id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          JAX Task ID to Pod Name Converter
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculatePodName();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
          <div>
            <label htmlFor="taskId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Task ID
            </label>
            <input
              id="taskId"
              type="text"
              value={taskIdString}
              onChange={(e) => setTaskIdString(e.target.value)}
              placeholder="/job:jax_worker/replica:0/task:2973"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="podsPerSlice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              K8s Pods Per Slice (GKE Nodepool)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">K8s pods per slice is generally the same as the jax processes or the amount of VMs per slice. For example, when using v5p-4096 slices, you would put 512 as pods per slice.</p>
            <input
              id="podsPerSlice"
              type="number"
              value={podsPerSlice}
              onChange={(e) => setPodsPerSlice(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Convert
        </button>
        </form>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {podName && (
          <div className="pt-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resulting Pod Name:</h2>
            <p className="mt-1 text-lg font-mono p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
              {podName}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
