// import express from express;

import LLM from "../libs/ai.lib.js";

const getTimeComplexity = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "code not found" });
    }

    const prompt = `You are a code analysis assistant. Analyze the time complexity of the
 following code. Analyze the following code and return only its time and space 
 complexity in this exact format:
["Time Complexity", "Space Complexity"]

Do not provide any explanation or additional text.
Code:
\`\`\`
${code}
\`\`\`

Make sure to:
- Detect the programming language automatically.
`;
    const response = await LLM(prompt);

    if (!response) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    const complexity=response.text;
    return res
      .status(200)
      .json({ message: "response received sucesssfully", complexity });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { getTimeComplexity };
