import React, { useState } from 'react';

// Utility functions
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

const unescapeHTML = (str: string): string =>
  str.replace(/&quot;/g, '"').replace(/&amp;/g, '&');

// Component
const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [error, setError] = useState<string>('');

  const handleMatch = () => {
    setError(''); // Clear any previous errors

    try {
      // Parse and validate JSON input with more specific error handling
      let parsedJson1;
      try {
        parsedJson1 = JSON.parse(unescapeHTML(jsonData1.trim()));
      } catch (e) {
        setError(`Invalid JSON in Data 1: ${e.message}`);
        return; 
      }

      let parsedJson2;
      try {
        parsedJson2 = JSON.parse(unescapeHTML(jsonData2.trim()));
      } catch (e) {
        setError(`Invalid JSON in Data 2: ${e.message}`);
        return;
      }

      // Create a map to organize the data by index
      const dataByIndex = new Map<string, { file1: any; file2: any }>();

      const organizeData = (json: any[], fileKey: string) => {
        // Check if json is an array before using forEach
        if (Array.isArray(json)) {  
          json.forEach((item) => {
            const { index, url, 'url-info': urlInfo, payload, 'raw-response': rawResponse } = item;
            if (index == null || url == null || urlInfo == null || payload == null || rawResponse == null) {
              return; // Skip incomplete data entries
            }

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
        } else {
          setError(`Invalid JSON input: Input data must be an array.`);
        }
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
    } catch (e: any) {
      // Handle any other unexpected errors
      setError(`An error occurred: ${e.message}`);
      setOutput([]);
    }
  };

  return ( 
    // ... (JSX - same as before)
  );
};

export default HighlightMatchingText;
