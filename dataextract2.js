import React, { useState } from 'react';

// ... (your utility functions: escapeHTML, unescapeHTML, flattenJSON)

const HighlightMatchingText: React.FC = () => {
  // ... (your state variables)

  // ... (your matchWords and handleMatch functions)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      {/* ... (your JSX for input, checkboxes, and button) */}

      {/* Output Section */}
      <div className="mt-6">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white p-4 border border-gray-300 rounded-lg">
            {output.length > 0 ? (
              <div>
                {output.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {/* Add extra spacing here */}
                    {index < output.length - 1 && <div className="mb-4" />} 
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No output to display</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightMatchingText;
