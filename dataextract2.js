import { useState } from "react";
import prettier from "xml-formatter";

const BeautifyXMLComponent: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [beautifiedXml, setBeautifiedXml] = useState<string>("");

  const handleBeautify = () => {
    try {
      let cleanedInput: string = input;

      // Step 1: Extract content from "payload" or "raw_response"
      const match = cleanedInput.match(/"payload":\s*"(.*)"|"raw_response":\s*"(.*)"/);
      if (match) {
        cleanedInput = match[1] || match[2] || cleanedInput;
      }

      // Step 2: Remove escaped quotes (\") and other escape sequences
      cleanedInput = cleanedInput.replace(/\\"/g, '"');

      // Step 3: Remove surrounding quotes if they exist
      if (cleanedInput.startsWith('"') && cleanedInput.endsWith('"')) {
        cleanedInput = cleanedInput.slice(1, -1);
      }

      // Step 4: Beautify the XML
      const formattedXml: string = prettier(cleanedInput, {
        indentation: "  ", // Indent with 2 spaces
        lineSeparator: "\n",
      });

      setBeautifiedXml(formattedXml);
    } catch (error) {
      console.error("Error beautifying XML:", error);
      setBeautifiedXml("Error: Invalid XML input.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Beautify XML</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your XML input, e.g., "payload": "<request>...</request>"'
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
