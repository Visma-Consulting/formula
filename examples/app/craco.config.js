const path = require('path');
const fsExtra = require('fs-extra');

module.exports = async ({ env }) => {
  let workspaceRoot = '../..';
  try {
    const packageJson = await fsExtra.readJson('../../../../package.json');
    if (packageJson.workspaces) {
      workspaceRoot = '../../../..';
    }
  } catch {}

  return {
    plugins: [(await import('@visma/craco-plugin-super-template')).default],
    webpack: {
      alias: {
        react: path.resolve(`${workspaceRoot}/node_modules/react`),
        'react-dom': path.resolve(`${workspaceRoot}/node_modules/react-dom`),
        '@material-ui': path.resolve(
          `${workspaceRoot}/node_modules/@material-ui`
        ),
        '@emotion/core': '@emotion/react'
      },
    },
  };
};
