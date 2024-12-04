import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface ExtractedData {
  index: string;
  payload: string;
  url: string;
}

const FileDataExtractor = () => {
  const [data, setData] = useState<ExtractedData[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const extractedData: ExtractedData[] = [];

    for (const file of acceptedFiles) {
      const text = await file.text();

      // Use a DOM parser to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // Example: Extract specific data from HTML
      const index = doc.querySelector("index")?.textContent || "N/A";
      const payload = doc.querySelector("payload")?.textContent || "N/A";
      const url = doc.querySelector("url")?.textContent || "N/A";

      extractedData.push({ index, payload, url });
    }

    setData(extractedData);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag and drop HTML files here, or click to upload</p>
      </div>

      <div className="mt-6">
        {data.length > 0 && (
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Index</th>
                <th className="border px-4 py-2">Payload</th>
                <th className="border px-4 py-2">URL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{item.index}</td>
                  <td className="border px-4 py-2">{item.payload}</td>
                  <td className="border px-4 py-2">{item.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileDataExtractor;