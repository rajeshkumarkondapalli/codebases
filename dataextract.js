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

      // Filter fields
      const allowedFields = ['raw-response', 'url-info', 'payload', 'index'];
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

      // Generate output with URL
      const matchedOutput: (string | JSX.Element)[] = [];
      Object.entries(filteredJson1).forEach(([key, value], index) => {
        matchedOutput.push(
          <div key={index} className="mb-4">
            <p className="font-bold text-blue-600">{escapeHTML(key)}</p>
            {key === 'url-info' ? (
              <p className="text-blue-500">
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              </p>
            ) : (
              <pre className="bg-gray-100 p-2 rounded-lg border">{matchWords(value, processedSearchWords)}</pre>
            )}
          </div>
        );
      });

      setOutput(matchedOutput);
      setError('');
    } catch (e: any) {
      // Handle errors
      setError(`Invalid JSON input: ${e.message}`);
      setOutput([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Highlight Matching Text</h1>
      
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
          placeholder="Enter JSON Data 1"
          value={jsonData1}
          onChange={(e) => setJsonData1(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
          placeholder="Enter JSON Data 2"
          value={jsonData2}
          onChange={(e) => setJsonData2(e.target.value)}
        />
      </div>

      {/* Checkboxes for settings */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <input
            type="checkbox"
            checked={highlight}
            onChange={() => setHighlight(!highlight)}
            id="highlight-toggle"
            className="mr-2"
          />
          <label htmlFor="highlight-toggle" className="text-sm text-gray-700">
            Highlight matched words
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={() => setCaseSensitive(!caseSensitive)}
            id="case-sensitive-toggle"
            className="mr-2"
          />
          <label htmlFor="case-sensitive-toggle" className="text-sm text-gray-700">
            Case sensitive matching
          </label>
        </div>
      </div>

      {/* Match Button */}
      <button
        onClick={handleMatch}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Match
      </button>

      {/* Output Section */}
      <div className="mt-6">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-4 border border-gray-300 rounded-lg">
            {output.length > 0 ? (
              <div>
                {output.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {/* Add extra spacing here */}
                    {index < output.length - 1 && <div className="mb-4" />} 
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No output to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightMatchingText;