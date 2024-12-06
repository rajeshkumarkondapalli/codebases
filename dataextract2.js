import React, { useState } from 'react';

const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [error, setError] = useState<string>('');
  const [highlight, setHighlight] = useState<boolean>(false);

  const escapeHTML = (str: string) => {
    return str.replace(/[&<>"']/g, (char) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return escapeMap[char] || char;
    });
  };

  const unescapeHTML = (str: string) => {
    return str.replace(/&quot;/g, '"');
  };

  const flattenJSON = (data: any, prefix = ''): Record<string, string> => {
    let result: Record<string, string> = {};
    for (const key in data) {
      if (data[key] !== null && typeof data[key] === 'object') {
        result = { ...result, ...flattenJSON(data[key], `${prefix}${key}.`) };
      } else {
        result[`${prefix}${key}`] = String(data[key]);
      }
    }
    return result;
  };

  const matchWords = (text: string, searchWords: string[]) => {
    const escapedText = escapeHTML(text);
    return escapedText.split(' ').map((word, index) => {
      const isMatch = searchWords.some((searchWord) => word.includes(searchWord));
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

      const wordsToMatch = Object.values(flatJson2)
        .join(' ')
        .split(' ')
        .filter((word) => word);

      const matchedOutput: (string | JSX.Element)[] = [];
      Object.entries(flatJson1).forEach(([key, value], index) => {
        const matchedText = matchWords(value, wordsToMatch);
        matchedOutput.push(`${escapeHTML(key)}: `);
        matchedOutput.push(...matchedText, <br key={`${index}-break`} />);
      });

      setOutput(matchedOutput);
      setError('');
    } catch (e) {
      setError('Invalid JSON input. Please provide properly formatted JSON.');
      setOutput([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Generic JSON Matching Tool
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">JSON Data 1</h2>
          <textarea
            value={jsonData1}
            onChange={(e) => setJsonData1(e.target.value)}
            placeholder="Enter valid JSON"
            className="w-full h-48 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700">JSON Data 2</h2>
          <textarea
            value={jsonData2}
            onChange={(e) => setJsonData2(e.target.value)}
            placeholder="Enter valid JSON"
            className="w-full h-48 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
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

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="text-center mb-6">
        <button
          onClick={handleMatch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Find Matches
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Output</h2>
        <div className="mt-2">
          {output.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightMatchingText;