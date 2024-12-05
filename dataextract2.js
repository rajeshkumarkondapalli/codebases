import React, { useState } from "react";
import prettier from "xml-formatter";
import xpath from "xpath";
import { DOMParser, XMLSerializer } from "xmldom";

interface BeautifyXMLProps {}

const BeautifyXMLComponent: React.FC<BeautifyXMLProps> = () => {
  const [input, setInput] = useState<string>(
    `"raw-response": "\\"<response xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\"><data>...</data><info>...</info></response>\\""`
  );
  const [beautifiedXml, setBeautifiedXml] = useState<string>("");

  const handleBeautify = () => {
    try {
      // Step 1: Extract XML content from raw-response
      const match = input.match(/"raw-response":\s*\\?"(.*?)\\?"/s);
      if (!match || !match[1]) {
        throw new Error(
          "No valid XML found in the input. Ensure the input is in the format 'raw-response': \"<xml>\""
        );
      }

      // Decode the escaped XML
      let xmlString = match[1]
        .replace(/\\n/g, "") // Remove escaped newlines
        .replace(/\\"/g, '"') // Remove escaped quotes
        .trim();

      // Step 2: Parse XML using xmldom
      const doc = new DOMParser().parseFromString(xmlString, "application/xml");

      // Step 3: Remove elements using XPath (e.g., remove <data> elements)
      const nodesToRemove = xpath.select("//data | //extra", doc); // Adjust XPath to match unwanted elements
      nodesToRemove.forEach((node) => node.parentNode?.removeChild(node));

      // Step 4: Serialize back to string
      const cleanedXml = new XMLSerializer().serializeToString(doc);

      // Step 5: Beautify XML
      const formattedXml = prettier(cleanedXml, {
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
        placeholder="Paste the input containing 'raw-response'"
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
