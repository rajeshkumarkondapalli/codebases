import React, { useState } from "react";
import prettier from "xml-formatter";
import xpath from "xpath";
import { DOMParser, XMLSerializer } from "xmldom";

interface BeautifyXMLProps {}

const BeautifyXMLComponent: React.FC<BeautifyXMLProps> = () => {
  const [input, setInput] = useState<string>(
    `"raw-response": "\\"<response><data>RemoveThis</data><info>KeepThis</info><extra>RemoveThat</extra></response>\\""`
  );
  const [beautifiedXml, setBeautifiedXml] = useState<string>("");

  const handleBeautify = () => {
    try {
      // Step 1: Extract XML content using regex
      const match = input.match(/"raw-response":\s*\\?"(.*?)\\?"/s);
      if (!match || !match[1]) {
        throw new Error(
          "No valid XML found in the input. Ensure the input is in the format 'raw-response': \"<xml>\""
        );
      }
      let xmlString = match[1];

      // Step 2: Parse XML using xmldom
      const doc = new DOMParser().parseFromString(xmlString);

      // Step 3: Remove elements using XPath (remove <data> and <extra>)
      const nodesToRemove = xpath.select("//data | //extra", doc);
      nodesToRemove.forEach((node) => node.parentNode?.removeChild(node));

      // Step 4: Convert back to string and remove escaped quotes
      xmlString = new XMLSerializer().serializeToString(doc)
        .replace(/\\"/g, '"') // Remove escaped quotes
        .trim();

      // Step 5: Basic XML validation (ensure it starts with "<" and ends with ">")
      if (!xmlString.startsWith("<") || !xmlString.endsWith(">")) {
        throw new Error("Extracted content is not valid XML.");
      }

      // Step 6: Beautify the cleaned XML
      const formattedXml = prettier(xmlString, {
        indentation: "  ",
        lineSeparator: "\n",
      });

      setBeautifiedXml(formattedXml);
    } catch (error: any) {
      console.error("Error beautifying XML:", error);
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
