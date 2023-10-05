import React from 'react';

const CodeSnippet = ({ children }) => (
  <div className="code-container">
    <pre>
      <code style={{ color: 'white',backgroundColor: 'black', padding: '8px', borderRadius: '5px' }}>
        {children}
      </code>
    </pre>
  </div>
);

export default CodeSnippet;
