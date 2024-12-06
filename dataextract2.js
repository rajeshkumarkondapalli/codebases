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
  // ... (state variables remain the same)

  const matchWords = (text: string, searchWords: string[]): (string | JSX.Element)[] => {
    // ... (matchWords function remains the same)
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
      const groupedOutput: Record<string, Record<string, (string | JSX.Element)[]>> = {};

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
            groupedOutput[apiRecordName][index].push(
              <div key={`json1-${key}`} className="mb-6">
                <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
                <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{matchWords(value, Object.values(flatJson2).flat())}</pre>
              </div>
            );
          }
        });

        // Find corresponding api-record in JSON2 and add its properties
        const correspondingApiRecordKey2 = apiRecordKeys2.find((key) => key.startsWith(`${apiRecordName}.${index}.`));
        if (correspondingApiRecordKey2) {
          Object.entries(flatJson2).forEach(([key, value]) => {
            if (key.startsWith(`${apiRecordName}.${index}.`)) {
              groupedOutput[apiRecordName][index].push(
                <div key={`json2-${key}`} className="mb-6">
                  <div className="font-medium text-lg text-indigo-600">{escapeHTML(key)}</div>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm">{matchWords(value, Object.values(flatJson1).flat())}</pre>
                </div>
              );
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
                {entries}
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

  // ... (rest of the component remains the same)
};

export default HighlightMatchingText;
