import { init } from '@visma/formula/lib/dll';
import App from 'components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '@visma/public.config';

async function main() {
  await init(config.frontend);

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

main();
