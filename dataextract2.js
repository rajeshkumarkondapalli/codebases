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

      // Filter fields (only relevant fields)
      const allowedFields = ['raw-response', 'url-info', 'payload', 'index', 'url', 'api-record'];
      const filteredJson1 = Object.fromEntries(
        Object.entries(flatJson1).filter(([key]) =>
          allowedFields.some((field) => key.endsWith(field))
        )
      );
      const filteredJson2 = Object.fromEntries(
        Object.entries(flatJson2).filter(([key]) =>
          allowedFields.some((field) => key.endsWith(field))
        )
      );

      const searchWords = Object.values(filteredJson2)
        .flatMap((value) => value.split(' '))
        .filter((word) => word);

      const processedSearchWords = caseSensitive
        ? searchWords
        : searchWords.map((word) => word.toLowerCase());

      // Group entries properly: `index` and `api-record` should be handled in their own group.
      const groupedOutput: Record<string, (string | JSX.Element)[]> = {};

      // Helper function to find and return the properties for an index
      const findIndexProperties = (index: string) => {
        const propertiesFromJson1 = Object.entries(filteredJson1).filter(([key]) =>
          key.includes(`index.${index}`)
        );
        const propertiesFromJson2 = Object.entries(filteredJson2).filter(([key]) =>
          key.includes(`index.${index}`)
        );

        return { propertiesFromJson1, propertiesFromJson2 };
      };

      Object.entries(filteredJson1).forEach(([key, value], index) => {
        // Handle 'index' and 'api-record' separately
        if (key.includes('index') || key.includes('api-record')) {
          const groupKey = key.includes('index') ? 'Index Group' : 'API Record Group';
          if (!groupedOutput[groupKey]) {
            groupedOutput[groupKey] = [];
          }

          // Extract index from the key
          const indexValue = key.split('.')[1];

          // Find associated properties for the index in both JSONs
          const { propertiesFromJson1, propertiesFromJson2 } = findIndexProperties(indexValue);

          // Add the index-related properties to the group
          groupedOutput[groupKey].push(
            <div key={index} className="mb-6">
              <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
              <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
                {matchWords(value, processedSearchWords)}
              </pre>

              <div className="mt-4">
                <div className="font-medium text-lg">Properties for Index {indexValue}</div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-600">JSON 1:</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
                    {propertiesFromJson1.map(([key, val]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {val}
                      </div>
                    ))}
                  </pre>
                  <h3 className="text-sm font-medium text-gray-600 mt-2">JSON 2:</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">
                    {propertiesFromJson2.map(([key, val]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {val}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          );
        } else {
          // Group other fields based on parent grouping
          const groupKey = key.split('.')[0]; // Parent grouping by the first part of the key (before '.')
          if (!groupedOutput[groupKey]) {
            groupedOutput[groupKey] = [];
          }
          groupedOutput[groupKey].push(
            <div key={index} className="mb-6">
              <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
              {key === 'url-info' || key === 'url' ? (
                <div className="text-blue-500">
                  <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {value}
                  </a>
                </div>
              ) : (
                <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{matchWords(value, processedSearchWords)}</pre>
              )}
            </div>
          );
        }
      });

      // Flatten the grouped output with spacing
      const finalOutput: (string | JSX.Element)[] = [];
      Object.entries(groupedOutput).forEach(([groupKey, groupEntries], index) => {
        finalOutput.push(
          <div key={groupKey} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{groupKey}</h2>
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

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleMatch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Highlight
        </button>

        <div>
          <label className="mr-4">
            <input
              type="checkbox"
              checked={highlight}
              onChange={(e) => setHighlight(e.target.checked)}
              className="mr-2"
            />
            Highlight Matches
          </label>

          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="mr-2"
            />
            Case Sensitive
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mt-6">{output}</div>
    </div>
  );
};

export default HighlightMatchingText;