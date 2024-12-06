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

      // Extract indices from both JSONs
      const indices1 = Object.keys(flatJson1)
        .filter((key) => key.includes('index'))
        .map((key) => key.split('.')[1]);
      const indices2 = Object.keys(flatJson2)
        .filter((key) => key.includes('index'))
        .map((key) => key.split('.')[1]);

      // Combine indices and remove duplicates
      const allIndices = [...new Set([...indices1, ...indices2])];

      // Group entries based on index
      const groupedOutput: Record<string, (string | JSX.Element)[]> = {};

      allIndices.forEach((index) => {
        groupedOutput[index] = [];

        // Add properties from JSON1 for the current index
        Object.entries(flatJson1).forEach(([key, value]) => {
          if (key.includes(`.${index}.`) || (!key.includes('.index.') && index === 'default')) {
            groupedOutput[index].push(
              <div key={`json1-${key}`} className="mb-6">
                <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
                {key === 'url-info' || key === 'url' ? (
                  <div className="text-blue-500">
                    <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {value}
                    </a>
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{matchWords(value, Object.values(flatJson2).flat())}</pre>
                )}
              </div>
            );
          }
        });

        // Add properties from JSON2 for the current index
        Object.entries(flatJson2).forEach(([key, value]) => {
          if (key.includes(`.${index}.`) || (!key.includes('.index.') && index === 'default')) {
            groupedOutput[index].push(
              <div key={`json2-${key}`} className="mb-6">
                <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
                {key === 'url-info' || key === 'url' ? (
                  <div className="text-blue-500">
                    <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {value}
                    </a>
                  </div>
                ) : (
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{matchWords(value, Object.values(flatJson1).flat())}</pre>
                )}
              </div>
            );
          }
        });
      });

      // Flatten the grouped output with spacing
      const finalOutput: (string | JSX.Element)[] = [];
      Object.entries(groupedOutput).forEach(([groupKey, groupEntries], index) => {
        finalOutput.push(
          <div key={groupKey} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Group {groupKey}</h2>
            {groupEntries}
          </div>
        );

        // Add spacing between groups (except after the last group)
        if (index < Object.keys(groupedOutput).length - 1) {
          finalOutput.push(<div key={`spacer-${index}`} className="mb-8" />);
        }
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
