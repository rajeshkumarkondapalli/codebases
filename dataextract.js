import { useState } from 'react';

const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [matches, setMatches] = useState<string[]>([]);
  const [nonMatches, setNonMatches] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Escape special characters for safe rendering
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

  // Recursively flatten JSON into key-value pairs
  const flattenJSON = (data: any, prefix = ''): Record<string, string> => {
    let result: Record<string, string> = {};

    for (const key in data) {
      if (data[key] !== null && typeof data[key] === 'object') {
        result = { ...result, ...flattenJSON(data[key], `${prefix}${key}.`) };
      } else {
        result[`${prefix}${key}`] = String(data[key]); // Convert to string for consistency
      }
    }

    return result;
  };

  const handleMatch = () => {
    try {
      // Parse and flatten both JSON inputs
      const parsedJson1 = JSON.parse(jsonData1.trim()); // Trim to avoid whitespace issues
      const parsedJson2 = JSON.parse(jsonData2.trim());

      const flatJson1 = flattenJSON(parsedJson1);
      const flatJson2 = flattenJSON(parsedJson2);

      const allKeys1 = Object.keys(flatJson1);
      const allKeys2 = Object.keys(flatJson2);

      const matchingValues: string[] = [];
      const nonMatchingValues: string[] = [];

      // Compare both sets of keys and values
      allKeys1.forEach((key, index) => {
        const value1 = flatJson1[key];
        const value2 = flatJson2[allKeys2[index]]; // Ensure both are compared correctly by index

        if (value1 === value2) {
          matchingValues.push(value1); // Match found
        } else {
          nonMatchingValues.push(value1); // No match, add to non-matches
        }
      });

      setMatches(matchingValues);
      setNonMatches(nonMatchingValues);
      setError('');
    } catch (e) {
      setError('Invalid JSON input. Please provide properly formatted JSON.');
      setMatches([]);
      setNonMatches([]);
    }
  };

  const highlightText = (text: string, type: 'match' | 'non-match') => {
    const color = type === 'match' ? 'yellow' : 'red'; // Use different colors for match/non-match
    return escapeHTML(text)
      .split(' ')
      .map((word, index) => (
        <span
          key={index}
          style={{
            backgroundColor: color,
            fontWeight: 'bold',
            color: 'black',
            padding: '0 2px',
            borderRadius: '3px',
          }}
        >
          {word}{' '}
        </span>
      ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Generic JSON Matching Tool
      </h1>

      {/* Input Fields */}
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

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Match Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleMatch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Find Matches
        </button>
      </div>

      {/* Display Matches */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Matching Text</h2>
        <div className="mt-2">
          {matches.length > 0 ? (
            matches.map((text, index) => (
              <p key={index} className="text-gray-800">
                {highlightText(text, 'match')}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No matching values found.</p>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mt-4">Non-Matching Text</h2>
        <div className="mt-2">
          {nonMatches.length > 0 ? (
            nonMatches.map((text, index) => (
              <p key={index} className="text-gray-800">
                {highlightText(text, 'non-match')}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No non-matching values found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighlightMatchingText;