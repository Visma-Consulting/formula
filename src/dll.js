import * as materialUICore from '@material-ui/core';
import * as materialUIStyles from '@material-ui/styles';
import * as react from 'react';
import * as reactDom from 'react-dom';
import * as reactIntl from 'react-intl';
import { globalVar, version } from '../dll';

const DLL = {};

export default DLL;

const externals = {
  '@material-ui/core': materialUICore,
  '@material-ui/styles': materialUIStyles,
  react,
  'react-dom': reactDom,
  'react-intl': reactIntl,
};

export const init = async (url) => {
  for (const [name, module] of Object.entries(externals)) {
    window[`${globalVar}_${name}`] = module;
  }

  const dllDir = `${url}/dll/${version}/`;

  const manifestResponse = await fetch(dllDir + 'manifest.json');
  const manifest = await manifestResponse.json();

  await import(/* webpackIgnore: true */ dllDir + manifest['main.js']);

  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = dllDir + manifest['main.css'];
  document.head.appendChild(linkElement);

  Object.assign(DLL, window.__formula);
};
