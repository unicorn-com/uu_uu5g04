# Outline

- uuApp Local Deployment
- uuApp Distribution Package Creation
- Other
- Creating uuAppBox while uu5g05 1.x is not public

# uuApp Local Deployment

1. Prepare workspace
2. Install and run client

## 1. Prepare workspace

Prepare workspace according to the [documentation](https://plus4u.net/ues/sesm?SessFree=ues%253AVPH-BT%253AUAFTEMPLATE)

## 2. Install and run client

1. Installation

    Execute install in command line:

    > npm install

2. Run

    Execute command:

    > npm start

    For viewing demo pages open Index in browser - http://localhost:4321/

# uuApp Distribution Package Creation

1. Install npm modules if they are not installed

    > npm install

2. Build client

    Execute command:

    > npm run dist [version]

    Performs build into `target/` folder.

3. Deploy client

    Execute command:

    > npm run deploy

    Deploys npm package to npm repository, uploads built CDN pack and descriptor
    files into uuAppBox artifact and deploys CDN pack onto CDN.

    Login is done automatically via browser.

# Other

<div style="color: gray; font-style: italic;"><!-- doesn't work -->

## Running Documentation

1. Installation

    Open client folder and execute install in command line:

    > cd doc/main/client

    > npm install

2. Run

    Execute command (in folder doc/main/client):

    > npm start

    For viewing documentation open Index in browser - http://localhost:1234/

</div>


## Uploading Examples to uuBookKit

1. Update list of components for examples update

    /main/doc/cmd/update-examples.js

2. Run

    Execute command:

    > npm run docUpdateExamples

    Login is by default taken from `~/.uu/login` file.

## Building Offline Version of uu5g04

1. Execute command:

    > npm run buildOffline [false]

    If `false` is given as last argument, distribution build is skipped, i.e.
    files from `target/dist/` (possibly from previous build) will be used.

## Uploading Offline Version of uu5g04 to uuBookKit

1. Execute command:

    > npm run deployOffline [false]

    If `false` is given as last argument, offline build is skipped, i.e.
    file `target/uu5g04-offline.zip` (possibly from previous build) will be used.

    Login is by default taken from `~/.uu/login` file.

# Creating uuAppBox while uu5g05 1.x is not public

1. If there are not-yet-released changes in uu5g05 and uu5stringg01 that need to be present for uu5g04:

    - Build uu5g05 / uu5stringg01 locally (`npm run package` in respective Git root).
    - Copy contents of built `target/uu5g05-<version>.tgz` into `uu5g04/node_modules/uu5g05/`. Similar for uu5stringg01.

2. If there are no such changes then just ensure that your uu5g05 and uu5stringg01 versions are up-to-date (`uu5g04/node_modules/uu5g05/package.json` has latest version; similar for uu5stringgg01).

    - If versions are not latest or if installed devkit is &lt; 4.2.0, update uu5g05 version in `devDependencies` in uu5g04's `package.json` and re-install modules (remove `package-lock.json` and `node_modules` and then do `npm install`).

3. Run `npm run uuAppBox` in uu5g04 Git root.
