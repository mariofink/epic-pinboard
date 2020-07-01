# 📌 Epic Pinboard

A Pinboard extension with a clean user interface.

## Install dependencies

    npm install

## Development

    npm run dev

This runs and watches the Webpack build and starts web-ext run to open a Firefox instance that has the extension installed. When you make changes, the extension will be updated automatically.

## Building the extension

    npm run build-extension

This bumps the patch version, builds the Webpack bundles and then runs the web-ext build – resulting in a newly built extension zip ready for upload inside the web-ext-artifacts folder.
