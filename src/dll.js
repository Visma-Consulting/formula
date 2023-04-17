import * as materialUICore from '@material-ui/core';
import * as materialUIStyles from '@material-ui/styles';
import * as xDatePickers from '@mui/x-date-pickers';
import * as muiBase from '@mui/base';
import * as muiMaterial from '@mui/material';
import * as emotionCore from '@emotion/core';
import * as emotionStyled from '@emotion/styled';
import * as emotionReact from '@emotion/react';
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
  '@emotion/react': emotionReact,
  '@emotion/core': emotionCore,
  '@mui/x-date-pickers': xDatePickers,
  '@emotion/styled': emotionStyled,
  '@mui/base': muiBase,
  '@mui/material': muiMaterial,
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
