import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../../constants.js'; // assuming you have the GEMINI_API_KEY in constants.js

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);  // Initialize the API with your key
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Converts an image buffer to the required format for the generative AI model.
 * @param {Buffer} imageBuffer - The image buffer.
 * @param {string} mimeType - The MIME type of the image (e.g., "image/jpeg").
 * @returns {object} The formatted object for generative AI.
 */
function fileToGenerativePart(imageBuffer, mimeType) {
  return {
    inlineData: {
      data: imageBuffer.toString("base64"), // Convert binary buffer to base64
      mimeType, // Use the provided MIME type
    },
  };
}
/**
 * Analyzes the image and dictionary of variables, sends a request to the model, and returns the response.
 * @param {Buffer} image - Image buffer for processing.
 * @param {object} dictOfVars - Dictionary of variables.
 * @returns {Promise<object[]>} - The response from the model after analysis.
 */
async function analyzeImage(imageBuffer, dictOfVars) {
  const dict_of_vars_str = JSON.stringify(dictOfVars);

  const prompt = `
    f"You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. "
        f"Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction. "
        f"For example: "
        f"Q. 2 + 3 * 4 "
        f"(3 * 4) => 12, 2 + 12 = 14. "
        f"Q. 2 + 3 + 5 * 4 - 8 / 2 "
        f"5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. "
        f"YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME: "
        f"Following are the cases: "
        f"1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE DICT [{{'expr': given expression, 'result': calculated answer}}]. "
        f"2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for the given variable, and the format should be a COMMA SEPARATED LIST OF DICTS, with dict 1 as {{'expr': 'x', 'result': 2, 'assign': True}} and dict 2 as {{'expr': 'y', 'result': 5, 'assign': True}}. This example assumes x was calculated as 2, and y as 5. Include as many dicts as there are variables. "
        f"3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the dict called {{'assign': True}}, keeping the variable as 'expr' and the value as 'result' in the original dictionary. RETURN AS A LIST OF DICTS. "
        f"4. Analyzing Graphical Math problems, which are word problems represented in drawing form, such as cars colliding, trigonometric problems, problems on the Pythagorean theorem, adding runs from a cricket wagon wheel, etc. These will have a drawing representing some scenario and accompanying information with the image. PAY CLOSE ATTENTION TO DIFFERENT COLORS FOR THESE PROBLEMS. You need to return the answer in the format of a LIST OF ONE DICT [{{'expr': given expression, 'result': calculated answer}}]. "
        f"5. Detecting Abstract Concepts that a drawing might show, such as love, hate, jealousy, patriotism, or a historic reference to war, invention, discovery, quote, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE ANSWER, where 'expr' will be the explanation of the drawing, and 'result' will be the abstract concept. "
        f"Analyze the equation or expression in this image and return the answer according to the given rules: "
        f"Make sure to use extra backslashes for escape characters like \\f -> \\\\f, \\n -> \\\\n, etc. "
        f"Here is a dictionary of user-assigned variables. If the given expression has any of these variables, use its actual value from this dictionary accordingly: {dict_of_vars_str}. "
        f"DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. "
        f"PROPERLY QUOTE THE KEYS AND VALUES IN THE DICTIONARY FOR EASIER PARSING WITH Python's ast.literal_eval."
  `;

  try {
    const mimeType = "image/jpeg"; // Ensure this matches the image format (adjust if necessary)
    const imagePart = fileToGenerativePart(imageBuffer, mimeType);

    // Send the prompt and image to the Gemini model
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    console.log("Response from Gemini:", responseText);

    // Clean the response text by removing Markdown formatting and normalizing quotes
    const cleanedResponse = responseText
      .replace(/```json/g, '') // Remove the opening Markdown code block
      .replace(/```/g, '')     // Remove the closing Markdown code block
      .replace(/'/g, '"')     // Replace single quotes with double quotes for valid JSON
      .replace(/True/g, 'true').replace(/False/g, 'false');  // Replace True with true as Js accepts true unlike Python which accepts True
    // Try parsing the cleaned response
    let answers = [];
    try {
      answers = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.error("Cleaned response:", cleanedResponse); // Log the cleaned response for debugging
    }

    return answers;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}




export { analyzeImage };
