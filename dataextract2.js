import React, { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const PreTagProcessor: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    const processPreTags = (element: HTMLElement) => {
      const preTags = element.querySelectorAll('pre');
      preTags.forEach(preTag => {
        // Your code to process each pre tag goes here
        console.log(preTag.textContent); // Example: Log the content of the pre tag
      });
    };

    // Get the component's root element
    const rootElement = document.getElementById('pre-tag-processor'); 
    if (rootElement) {
      processPreTags(rootElement);
    }
  }, [children]); // Re-run the effect if children change

  return (
    <div id="pre-tag-processor"> 
      {children}
    </div>
  );
};

export default PreTagProcessor;
