# Outline

- uuApp Local Deployment
- uuApp Distribution Package Creation
- Other

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
