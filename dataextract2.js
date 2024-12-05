import { useState } from "react";
import prettier from "xml-formatter";

const BeautifyXMLComponent: React.FC = () => {
  const [input, setInput] = useState<string>(
    `"raw-response": "\\"<response><data>RemoveThis</data><info>KeepThis</info><extra>RemoveThat</extra></response>\\""`
  );
  const [beautifiedXml, setBeautifiedXml] = useState<string>("");

  const handleBeautify = () => {
    try {
      let cleanedInput: string = input;

      // Step 1: Extract content using regex
      const match = cleanedInput.match(/"raw-response":\s*\\"(.*?)\\"/);
      if (match && match[1]) {
        cleanedInput = match[1];
      } else {
        throw new Error("No valid XML found in the input.");
      }

      // Step 2: Remove specific elements (hardcoded)
      const patternsToRemove = [
        /<data>.*?<\/data>/g, // Remove <data>...</data> tags
        /<extra>.*?<\/extra>/g, // Remove <extra>...</extra> tags
      ];
      patternsToRemove.forEach((pattern) => {
        cleanedInput = cleanedInput.replace(pattern, "");
      });

      // Step 3: Remove escaped quotes
      cleanedInput = cleanedInput.replace(/\\"/g, '"').trim();

      // Step 4: Validate that the content looks like XML
      if (!cleanedInput.startsWith("<") || !cleanedInput.endsWith(">")) {
        throw new Error("Extracted content is not valid XML.");
      }

      // Step 5: Beautify XML
      const formattedXml: string = prettier(cleanedInput, {
        indentation: "  ", // Indent with 2 spaces
        lineSeparator: "\n",
      });

      setBeautifiedXml(formattedXml);
    } catch (error) {
      console.error("Error beautifying XML:", error.message);
      setBeautifiedXml(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Beautify XML</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your input, e.g., "raw-response": "\\"<response>...</response>\\""'
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows={6}
      ></textarea>
      <button
        onClick={handleBeautify}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Beautify XML
      </button>
      {beautifiedXml && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Beautified XML:</h2>
          <pre className="bg-gray-100 p-4 border border-gray-300 rounded overflow-x-auto">
            {beautifiedXml}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BeautifyXMLComponent;
