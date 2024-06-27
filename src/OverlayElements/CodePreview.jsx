import * as React from 'react';
import { useEffect } from 'react';

const codeString = `
  function hellowWorld()
    print("Hello, World!") 
  end
`;

const CodePreview = React.forwardRef((props, ref) => {
  useEffect(() => {
    // ensure prism is loade before attempting to highlight'
    if (window.Prism) {
      console.log('highlighting code');
      window.Prism.highlightAll();
    }
  }, []);

  return (
    <div className="code-preview">
      <pre>
        <code className="language-lua">
          {codeString}
        </code>
      </pre>
    </div>
  )
});

export default CodePreview;
