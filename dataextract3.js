import React, { useState } from 'react';

const HighlightMatchingText: React.FC = () => {
  const [jsonData1, setJsonData1] = useState<string>('');
  const [jsonData2, setJsonData2] = useState<string>('');
  const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
  const [error, setError] = useState<string>('');
  const [highlight, setHighlight] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  const escapeHTML = (str: string) => {
    const element = document.createElement('div');
    if (str) {
      element.innerText = str;
      element.textContent = str;
    }
    return element.innerHTML;
  };

  const unescapeHTML = (str: string) => {
    const element = document.createElement('div');
    if (str) {
      element.innerHTML = str;
    }
    return element.textContent || '';
  };

  const flattenJSON = (obj: any, prefix = ''): Record<string, any> => {
    let result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        result = { ...result, ...flattenJSON(value, newKey) };
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const matchWords = (text: string, searchWords: string[]): (string | JSX.Element)[] => {
    const processedText = caseSensitive ? text : text.toLowerCase();
    return processedText.split(' ').map((word, index) => {
      const isMatch = searchWords.some((searchWord) =>
        word.includes(caseSensitive ? searchWord : searchWord.toLowerCase())
      );
      return highlight && isMatch ? (
        <span key={index} className="bg-yellow-200 p-1 rounded">
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

      const indices1 = Object.keys(flatJson1)
        .filter((key) => key.includes('index'))
        .map((key) => key.split('.')[1]);
      const indices2 = Object.keys(flatJson2)
        .filter((key) => key.includes('index'))
        .map((key) => key.split('.')[1]);

      const allIndices = [...new Set([...indices1, ...indices2])];

      const groupedOutput: Record<string, (string | JSX.Element)[]> = {};

      allIndices.forEach((index) => {
        groupedOutput[index] = [];

        Object.entries(flatJson1).forEach(([key, value]) => {
          if (key.includes(`.${index}.`) || (!key.includes('.index.') && index === 'default')) {
            groupedOutput[index].push(
              <div key={`json1-${key}`} className="mb-4">
                <div className="font-medium text-gray-800">{escapeHTML(key)}</div>
                {key === 'url-info' || key === 'url' ? (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {value}
                  </a>
                ) : (
                  <pre className="text-gray-600 whitespace-pre-wrap break-words text-sm">{matchWords(value, Object.values(flatJson2).flat())}</pre>
                )}
              </div>
            );
          }
        });

        Object.entries(flatJson2).forEach(([key, value]) => {
          if (key.includes(`.${index}.`) || (!key.includes('.index.') && index === 'default')) {
            groupedOutput[index].push(
              <div key={`json2-${key}`} className="mb-4">
                <div className="font-medium text-gray-800">{escapeHTML(key)}</div>
                {key === 'url-info' || key === 'url' ? (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {value}
                  </a>
                ) : (
                  <pre className="text-gray-600 whitespace-pre-wrap break-words text-sm">{matchWords(value, Object.values(flatJson1).flat())}</pre>
                )}
              </div>
            );
          }
        });
      });

      const finalOutput: (string | JSX.Element)[] = [];
      Object.entries(groupedOutput).forEach(([groupKey, groupEntries], index) => {
        finalOutput.push(
          <div key={groupKey} className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Group {groupKey}</h2>
            {groupEntries}
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Highlight Matching Text</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition duration-200"
          placeholder="Enter JSON Data 1"
          value={jsonData1}
          onChange={(e) => setJsonData1(e.target.value)}
        />
        <textarea
          className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 transition duration-200"
          placeholder="Enter JSON Data 2"
          value={jsonData2}
          onChange={(e) => setJsonData2(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={highlight}
            onChange={() => setHighlight(!highlight)}
            id="highlight-toggle"
            className="mr-2 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500"
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
            className="mr-2 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="case-sensitive-toggle" className="text-sm text-gray-700">
            Case sensitive matching
          </label>
        </div>
      </div>

      <button
        onClick={handleMatch}
        className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
      >
        Match
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="mt-8">
        {output}
      </div>
    </div>
  );
};

export default HighlightMatchingText;
