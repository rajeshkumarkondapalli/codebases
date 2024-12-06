import React, { useState } from 'react';

// Utility function to escape HTML characters
const escapeHTML = (str: string): string =>
  str.replace(/[&<>"']/g, (char) => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return escapeMap[char] || char;
  });

// Component
const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [error, setError] = useState<string>('');

  const handleMatch = () => {
    try {
      // Parse and validate JSON input without unescaping HTML
      const parsedJson1 = JSON.parse(jsonData1.trim());
      const parsedJson2 = JSON.parse(jsonData2.trim());

      // Create a map to organize the data by index
      const dataByIndex: Map<string, any> = new Map();

      const organizeData = (json: any[], fileKey: string) => {
        json.forEach((item) => {
          const { index, url, 'url-info': urlInfo, payload, 'raw-response': rawResponse } = item;
          if (!dataByIndex.has(index)) {
            dataByIndex.set(index, { file1: {}, file2: {} });
          }
          const data = dataByIndex.get(index);
          if (fileKey === 'file1') {
            data.file1 = { url, 'url-info': urlInfo, payload, 'raw-response': rawResponse };
          } else {
            data.file2 = { url, 'url-info': urlInfo, payload, 'raw-response': rawResponse };
          }
        });
      };

      // Organize data from both files
      organizeData(parsedJson1, 'file1');
      organizeData(parsedJson2, 'file2');

      // Generate output JSX
      const outputElements = Array.from(dataByIndex.entries()).map(([index, data]) => (
        <div key={index} className="mb-8 border rounded-lg p-4 bg-gray-50 shadow-md">
          <h2 className="text-lg font-bold mb-4 text-blue-600">Index: {index}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File 1 Data */}
            <div>
              <h3 className="text-md font-semibold mb-2 text-green-600">File 1</h3>
              {Object.entries(data.file1).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <p className="font-medium text-gray-700">{escapeHTML(key)}:</p>
                  {key === 'url-info' ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {value}
                    </a>
                  ) : (
                    <pre className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm">{value}</pre>
                  )}
                </div>
              ))}
            </div>

            {/* File 2 Data */}
            <div>
              <h3 className="text-md font-semibold mb-2 text-red-600">File 2</h3>
              {Object.entries(data.file2).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <p className="font-medium text-gray-700">{escapeHTML(key)}:</p>
                  {key === 'url-info' ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {value}
                    </a>
                  ) : (
                    <pre className="bg-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm">{value}</pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ));

      setOutput(outputElements);
      setError('');
    } catch (e: any) {
      // Handle invalid JSON errors
      setError(`Invalid JSON input: ${e.message}`);
      setOutput([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-center text-gray-700">Compare JSON Data</h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
          placeholder="Enter JSON Data 1"
          value={jsonData1}
          onChange={(e) => setJsonData1(e.target.value)}
        />
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
          placeholder="Enter JSON Data 2"
          value={jsonData2}
          onChange={(e) => setJsonData2(e.target.value)}
        />
      </div>

      {/* Match Button */}
      <div className="text-center">
        <button
          onClick={handleMatch}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Match
        </button>
      </div>

      {/* Output Section */}
      <div className="mt-6">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="bg-white p-6 border border-gray-300 rounded-lg">
            {output.length > 0 ? (
              <div>{output}</div>
            ) : (
              <p className="text-gray-500 text-center">No output to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightMatchingText;