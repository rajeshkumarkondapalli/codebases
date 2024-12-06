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

// Function to flatten nested JSON
const flattenJSON = (data: any, prefix = ''): Record<string, string> => {
  let result: Record<string, string> = {};
  for (const key in data) {
    if (data[key] && typeof data[key] === 'object') {
      result = { ...result, ...flattenJSON(data[key], `${prefix}${key}.`) };
    } else {
      result[`${prefix}${key}`] = String(data[key]);
    }
  }
  return result;
};

// Component
const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [error, setError] = useState<string>('');
  const [highlight, setHighlight] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  const matchWords = (text: string, searchWords: string[]): (string | JSX.Element)[] => {
    const processedText = caseSensitive ? text : text.toLowerCase();
    return processedText.split(' ').map((word, index) => {
      const isMatch = searchWords.some((searchWord) =>
        word.includes(caseSensitive ? searchWord : searchWord.toLowerCase())
      );
      return highlight && isMatch ? (
        <span
          key={index}
          style={{
            backgroundColor: 'yellow',
            padding: '0 2px',
            borderRadius: '3px',
          }}
        >
          {word}{' '}
        </span>
      ) : (
        `${word} `
      );
    });
  };

  const handleMatch = () => {
    try {
      const parsedJson1 = JSON.parse(unescapeHTML(jsonData1.trim()));
      const parsedJson2 = JSON.parse(unescapeHTML(jsonData2.trim()));

      const flatJson1 = flattenJSON(parsedJson1);
      const flatJson2 = flattenJSON(parsedJson2);

      const apiRecordKeys1 = Object.keys(flatJson1).filter((key) => key.endsWith('api-record'));
      const apiRecordKeys2 = Object.keys(flatJson2).filter((key) => key.endsWith('api-record'));

      const groupedOutput: Record<string, Record<string, string[]>> = {};

      apiRecordKeys1.forEach((apiRecordKey1) => {
        const index = apiRecordKey1.split('.')[1];
        const apiRecordName = apiRecordKey1.split('.')[0];

        groupedOutput[apiRecordName] = groupedOutput[apiRecordName] || {};
        groupedOutput[apiRecordName][index] = groupedOutput[apiRecordName][index] || [];

        // Collect entries from JSON1
        Object.entries(flatJson1).forEach(([key, value]) => {
          if (key.startsWith(`${apiRecordName}.${index}.`) && key !== apiRecordKey1) {
            groupedOutput[apiRecordName][index].push(`${escapeHTML(key)}: ${escapeHTML(value)}`);
          }
        });

        // Find corresponding api-record in JSON2 and collect entries
        const correspondingApiRecordKey2 = apiRecordKeys2.find((key) => key.startsWith(`${apiRecordName}.${index}.`));
        if (correspondingApiRecordKey2) {
          Object.entries(flatJson2).forEach(([key, value]) => {
            if (key.startsWith(`${apiRecordName}.${index}.`) && key !== correspondingApiRecordKey2) {
              groupedOutput[apiRecordName][index].push(`${escapeHTML(key)}: ${escapeHTML(value)}`);
            }
          });
        }
      });

      const finalOutput: (string | JSX.Element)[] = [];
      Object.entries(groupedOutput).forEach(([apiRecordName, indices]) => {
        finalOutput.push(
          <div key={apiRecordName} className="mb-8 bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{apiRecordName} API Record</h2>
            {Object.entries(indices).map(([index, entries]) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Index: {index}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
                    {entries.join('\n')}
                  </pre>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
                    {entries.join('\n')}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        );
      });

      setOutput(finalOutput);
      setError('');
    } catch (e: any) {
      console.error(e);
      setError(`Invalid JSON input: ${e.message}`);
      setOutput([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Highlight Matching Text</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg mb-4"
          rows={8}
          placeholder="Enter JSON data 1"
          value={jsonData1}
          onChange={(e) => setJsonData1(e.target.value)}
        />
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg mb-4"
          rows={8}
          placeholder="Enter JSON data 2"
          value={jsonData2}
          onChange={(e) => setJsonData2(e.target.value)}
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={highlight}
          onChange={(e) => setHighlight(e.target.checked)}
        />
        <span className="text-gray-700">Highlight matching words</span>
      </div>

      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          className="mr-2"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        />
        <span className="text-gray-700">Case Sensitive</span>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleMatch}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
        >
          Match JSON
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="output">
        {output.length > 0 ? (
          output
        ) : (
          <div className="text-gray-500">No matching data found or no valid input.</div>
        )}
      </div>
    </div>
  );
};

export default HighlightMatchingText;
