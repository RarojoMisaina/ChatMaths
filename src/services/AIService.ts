import { pipeline } from '@xenova/transformers';

let generator: any;

export const analyzeMathProblem = async (problem: string): Promise<string> => {
  try {
    if (!generator) {
      generator = await pipeline('text-generation', 'Xenova/gpt2-medium');
    }

    const prompt = `
    Convert the following math problem to LaTeX and explain the solution step by step:
    Problem: ${problem}
    
    Answer in this format:
    \\text{Problem: } [LaTeX]
    \\text{Solution: }
    1. [Step 1 in LaTeX]
    2. [Step 2 in LaTeX]
    ...
    `;

    const response = await generator(prompt, {
      max_new_tokens: 150,
      temperature: 0.3,
      no_repeat_ngram_size: 2,
    });

    return response[0].generated_text;
  } catch (error) {
    console.error("AI Error:", error);
    return "\\text{Je n'ai pas pu analyser ce problème. Essayez une formulation différente.}";
  }
};