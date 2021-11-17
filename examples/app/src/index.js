import App from 'components/App';
import React from 'react';
import ReactDOM from 'react-dom';

async function main() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

main();
