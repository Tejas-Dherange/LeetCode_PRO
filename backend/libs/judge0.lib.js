export const getLanguageById = (language) => {
  const languageMap = {
    JAVASCRIPT: 63,
    "C++": 53,
    JAVA: 62,
    PYTHON: 71,
    C: 50,
  };

  return languageMap[language.toUppercase()] || null;
};

const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    },
  );

  console.log("Submission result ", data);

  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT}/submission/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encode: false,
        },
      },
    );

    const results = await data.submissions;

    const isAllDone = results.every(
      (res) => res.status_id !== 1 && res.status_id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }
};
