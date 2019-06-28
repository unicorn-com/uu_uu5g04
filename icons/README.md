------------------------------------------------------------
Library Template
------------------------------------------------------------

This directory serves for component development of version 3.00 and higher.

# Outline

- Local development
- Minifying files
- Library
- Changing version
- Project structure

# Local development

1) Name your library in package.json in attribute name.
2) Run 'npm install' (only the first time).
3) Run 'npm start'.
4) When the process is running, you can develop your components and run demos - any changes are bundled immediately.
5) Run demo pages by opening the address in a browser, e. g. "http://localhost:4320/demo/icons.html".
Warning: Opening a demo page straight from Ruby Mine will not work!

*!* If you need to open demo page on a remote device, use the URL above but exchange the 'localhost'
*!* for your computer IP address.

# Minifying files

1) Run 'npm run dist'.
2) You will find minified library files in 'dist' folder.
3) You can run demo pages with minified files by running 'npm run start-prod', using same URL as above.

# Library

1) Run 'npm run dist'.
2) Run 'npm pack'.
3) You will find a .tgz file in project root folder, which is the distribution of library.

# Changing version

If you want to change version of the project, you can do so in /package.json file by rewriting the version number.



# Project structure

    config/
This folder contains configuration file(s) - config.js in which you can configure development & build settings
such as web server port, etc.

    dist/
This folder contains minified files after running the 'npm run dist' task.

    tools/
This folder contains tools and webpack configuration.

