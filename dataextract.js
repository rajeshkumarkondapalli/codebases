import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface ExtractedData {
  index: number;
  payload?: string;
  url?: string;
  status: string;
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

      // Find all <pre> tags recursively
      const preTags = Array.from(doc.getElementsByTagName("pre"));
      preTags.forEach((preTag) => {
        if (preTag.className.includes("copyText-response")) {
          try {
            // Parse the JSON within the <pre> tag
            const jsonContent = JSON.parse(preTag.textContent || "{}");

            // Extract data from the JSON structure
            const apiRecords = jsonContent["bnc-common:api-status"]?.["api-record"] || [];
            apiRecords.forEach((record: any) => {
              extractedData.push({
                index: record.index,
                payload: record.payload,
                url: record["url-info"],
                status: record.status,
              });
            });
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
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
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{item.index}</td>
                  <td className="border px-4 py-2">{item.payload || "N/A"}</td>
                  <td className="border px-4 py-2">{item.url || "N/A"}</td>
                  <td className="border px-4 py-2">{item.status}</td>
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