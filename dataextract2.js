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
      // Parse and validate JSON
      const parsedJson1 = JSON.parse(unescapeHTML(jsonData1.trim()));
      const parsedJson2 = JSON.parse(unescapeHTML(jsonData2.trim()));

      const flatJson1 = flattenJSON(parsedJson1);
      const flatJson2 = flattenJSON(parsedJson2);

      // Extract api-record keys from both JSONs
      const apiRecordKeys1 = Object.keys(flatJson1).filter((key) => key.endsWith('api-record'));
      const apiRecordKeys2 = Object.keys(flatJson2).filter((key) => key.endsWith('api-record'));

      // Group entries based on index within each api-record
      const groupedOutput: Record<string, Record<string, string[]>> = {};

      apiRecordKeys1.forEach((apiRecordKey1) => {
        const index = apiRecordKey1.split('.')[1]; // Extract index from apiRecordKey1
        const apiRecordName = apiRecordKey1.split('.')[0]; // Extract api-record name

        if (!groupedOutput[apiRecordName]) {
          groupedOutput[apiRecordName] = {};
        }
        if (!groupedOutput[apiRecordName][index]) {
          groupedOutput[apiRecordName][index] = [];
        }

        // Add properties from JSON1 for the current api-record and index
        Object.entries(flatJson1).forEach(([key, value]) => {
          if (key.startsWith(`${apiRecordName}.${index}.`)) {
            groupedOutput[apiRecordName][index].push(`${escapeHTML(key)}: ${escapeHTML(value)}`);
          }
        });

        // Find corresponding api-record in JSON2 and add its properties
        const correspondingApiRecordKey2 = apiRecordKeys2.find((key) => key.startsWith(`${apiRecordName}.${index}.`));
        if (correspondingApiRecordKey2) {
          Object.entries(flatJson2).forEach(([key, value]) => {
            if (key.startsWith(`${apiRecordName}.${index}.`)) {
              groupedOutput[apiRecordName][index].push(`${escapeHTML(key)}: ${escapeHTML(value)}`);
            }
          });
        }
      });

      // Flatten the grouped output with spacing
      const finalOutput: (string | JSX.Element)[] = [];
      Object.entries(groupedOutput).forEach(([apiRecordName, indices]) => {
        finalOutput.push(
          <div key={apiRecordName} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">API Record: {apiRecordName}</h2>
            {Object.entries(indices).map(([index, entries]) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Index: {index}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{entries.join('\n')}</pre>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{entries.join('\n')}</pre>
                </div>
              </div>
            ))}
          </div>
        );
      });

      setOutput(finalOutput);
      setError('');
    } catch (e: any) {
      setError(`Invalid JSON input: ${e.message}`);
      setOutput([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Highlight Matching Text</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          placeholder="Enter JSON Data 1"
          value={jsonData1}
          onChange={(e) => setJsonData1(e.target.value)}
        />
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          placeholder="Enter JSON Data 2"
          value={jsonData2}
          onChange={(e) => setJsonData2(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={highlight}
            onChange={() => setHighlight(!highlight)}
            id="highlight-toggle"
            className="mr-3 rounded-sm text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="highlight-toggle" className="text-sm text-gray-700">
            Highlight matched words
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive(!caseSensitive)}
            id="case-sensitive-toggle"
            className="mr-3 rounded-sm text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="case-sensitive-toggle" className="text-sm text-gray-700">
            Case sensitive matching
          </label>
        </div>
      </div>

      <button
        onClick={handleMatch}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        Match
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8">{output}</div>
    </div>
  );
};

export default HighlightMatchingText;