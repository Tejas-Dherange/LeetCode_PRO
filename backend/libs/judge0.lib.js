import axios from "axios";

export const getLanguageById = (language) => {
  const languageMap = {
    JAVASCRIPT: 63,
    "C++": 53,
    JAVA: 62,
    PYTHON: 71,
    C: 50,
  };

  console.log(languageMap[language.toUpperCase()]);

  return languageMap[language.toUpperCase()];
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const submitBatch = async (submissions) => {
  console.log("Batch -----", submissions);
  console.log("Key -----", process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT);

  const { data } = await axios.post(
    `${process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT}/submissions/batch?base64_encoded=false`,
    {
      submissions: submissions,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.JUDGE0_SULU_API_KEY}`,
      },
    },
  );

  console.log("Submission result ", data);

  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_BATCH_SUBMISSION_ENDPOINT}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JUDGE0_SULU_API_KEY}`,
        },
      },
    );

    const results = data.submissions;
    console.log("Submission  ", data);

    const isAllDone = results.every(
      (res) => res.status.id !== 1 && res.status.id !== 2,
    );

    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }
};

export const getLanguageNameById = (languageId) => {
  const languageMap = {
    63: "JAVASCRIPT",
    53: "C++",
    62: "JAVA",
    71: "PYTHON",
    50: "C",
  };

  return languageMap[languageId];
};
