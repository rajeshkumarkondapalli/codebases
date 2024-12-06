import { useState } from 'react';

type JSONData = {
  id: number;
  text: string;
};

const HighlightMatchingText: React.FC = () => {
  // State to hold JSON data inputs and the matching results
  const [jsonData1, setJsonData1] = useState<JSONData[]>([
    { id: 1, text: 'Hello world' },
    { id: 2, text: 'How are you?' },
  ]);
  const [jsonData2, setJsonData2] = useState<JSONData[]>([
    { id: 1, text: 'Hello there' },
    { id: 2, text: 'How is everything?' },
  ]);
  const [matchedText, setMatchedText] = useState<string[]>([]);

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
      if (matchedText.includes(word)) {
        return <span key={index} style={{ backgroundColor: 'yellow' }}>{word} </span>;
      }
      return word + ' ';
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Highlight Matching Text</h1>

      {/* JSON Data Inputs */}
      <div className="mt-4">
        <h2 className="text-lg">JSON Data 1</h2>
        <pre>{JSON.stringify(jsonData1, null, 2)}</pre>
        <h2 className="text-lg mt-4">JSON Data 2</h2>
        <pre>{JSON.stringify(jsonData2, null, 2)}</pre>
      </div>

      {/* Button to trigger matching */}
      <button
        onClick={findMatches}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Find Matches
      </button>

      {/* Displaying the results with highlighted text */}
      <div className="mt-4">
        <h2 className="text-lg">Matching Text</h2>
        <div>
          {matchedText.length > 0 ? (
            matchedText.map((text, index) => (
              <p key={index}>{highlightText(text)}</p>
            ))
          ) : (
            <p>No matches found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighlightMatchingText;
