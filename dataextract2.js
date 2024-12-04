import React, { useState, useEffect } from 'react';

interface DataItem {
  url: string;
  urlInfo: string;
  index: number;
  payload: string;
}

const DataExtractor: React.FC<{ htmlString: string }> = ({ htmlString }) => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const extractData = (node: Node): DataItem[] => {
      let results: DataItem[] = [];
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.textContent?.includes('url-info')) {
          const urlInfo = node.textContent.match(/"url-info":\s*"([^"]*)"/)?.[1];
          const index = node.textContent.match(/"index":\s*(\d+)/)?.[1];
          const payload = node.textContent.match(/"payload":\s*"([^"]*)"/)?.[1];
          const url = node.textContent.match(/"url":\s*"([^"]*)"/)?.[1];

          if (urlInfo && index && payload && url) {
            results.push({ url, urlInfo, index: parseInt(index), payload });
          }
        }
        node.childNodes.forEach(child => results = results.concat(extractData(child)));
      }
      return results;
    };

    setData(extractData(doc.body));
  }, [htmlString]);

  return (
    <div>
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
