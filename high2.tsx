import { useState } from 'react';

type JSONData = {
  id: number;
  text: string;
};

const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<JSONData[]>([]);
  const [jsonData2, setJsonData2] = useState<JSONData[]>([]);
  const [matchedText, setMatchedText] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Function to handle JSON input and set the state
  const handleJSONInput = (input: string, setJsonData: React.Dispatch<React.SetStateAction<JSONData[]>>) => {
    try {
      const parsedData = JSON.parse(input);
      if (Array.isArray(parsedData)) {
        setJsonData(parsedData);
        setError('');
      } else {
        setError('Invalid JSON format. Please enter a valid JSON array.');
      }
    } catch {
      setError('Invalid JSON format. Please enter a valid JSON array.');
    }
  };

  // Function to escape HTML/XML special characters
  const escapeHTML = (str: string) => {
    return str.replace(/[&<>"'/]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#47;',
      };
      return escapeMap[match] || match;
    });
  };

  // Function to handle newlines, hyphens, and double quotes in the text
  const formatText = (text: string) => {
    // Handle newline characters by converting \n to <br/>
    const formattedText = text.split('\n').map((line, index) => {
      return (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      );
    });

    return formattedText;
  };

  // Function to find matching texts between the two JSON data
  const findMatches = () => {
    const matches: string[] = [];
    jsonData1.forEach((data1) => {
      jsonData2.forEach((data2) => {
        if (data1.text === data2.text) {
          matches.push(data1.text);
        }
      });
    });
    setMatchedText(matches);
  };

  // Function to highlight the matching text
  const highlightText = (text: string) => {
    return text.split(' ').map((word, index) => {
      const escapedWord = escapeHTML(word);
      if (matchedText.includes(word)) {
        return <span key={index} style={{ backgroundColor: 'yellow' }}>{escapedWord} </span>;
      }
      return escapedWord + ' ';
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Highlight Matching Text</h1>

      {/* JSON Data Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">JSON Data 1</h2>
          <textarea
            onChange={(e) => handleJSONInput(e.target.value, setJsonData1)}
            placeholder='Paste JSON data here'
            className="w-full h-32 p-4 border border-gray-300 rounded-lg mt-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">JSON Data 2</h2>
          <textarea
            onChange={(e) => handleJSONInput(e.target.value, setJsonData2)}
            placeholder='Paste JSON data here'
            className="w-full h-32 p-4 border border-gray-300 rounded-lg mt-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Button to trigger matching */}
      <div className="flex justify-center">
        <button
          onClick={findMatches}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Find Matches
        </button>
      </div>

      {/* Displaying the results with highlighted text */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Matching Text</h2>
        <div className="mt-4">
          {matchedText.length > 0 ? (
            matchedText.map((text, index) => (
              <p key={index} className="text-gray-700">{highlightText(formatText(text))}</p>
            ))
          ) : (
            <p className="text-gray-500">No matches found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighlightMatchingText;
