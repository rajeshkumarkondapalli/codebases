import React, { useState, useEffect } from 'react';

interface DataItem {
  url: string;
  urlInfo: string;
  index: number;
  payload: string;
}

const DataExtractor: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [htmlString, setHtmlString] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlString(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (!htmlString) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const extractData = (node: Node): DataItem[] => {
      let results: DataItem[] = [];
      if (node.nodeType === Node.ELEMENT_NODE) {
        const preElements = node.querySelectorAll('pre'); 
        preElements.forEach(pre => {
          try {
            const codeElement = pre.querySelector('code');
            if (codeElement) {
              const jsonText = codeElement.textContent || '';
              const jsonData = JSON.parse(jsonText);
              if (jsonData.url && jsonData['url-info'] && jsonData.index && jsonData.payload) {
                results.push({
                  url: jsonData.url,
                  urlInfo: jsonData['url-info'],
                  index: jsonData.index,
                  payload: jsonData.payload,
                });
              }
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        });
        node.childNodes.forEach(child => results = results.concat(extractData(child)));
      }
      return results;
    };

    setData(extractData(doc.body));
  }, [htmlString]);

  return (
    <div>
      {/* Here's the button (it's actually a file input element) */}
      <input type="file" accept=".html" onChange={handleFileChange} /> 

      <h2>Extracted Data:</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <p>URL: {item.url}</p>
            <p>URL Info: {item.urlInfo}</p>
            <p>Index: {item.index}</p>
            <p>Payload: {item.payload}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataExtractor;
