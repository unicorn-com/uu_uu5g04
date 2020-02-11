# Development and Usage

See following guidelines:

- [uuAppg01Devkit Documentation](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-e884539c8511447a977c7ff070e7f2cf/book)
- [uuSubApp Instance Descriptor](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-289fcd2e11d34f3e9b2184bedb236ded/book/page?code=uuSubAppInstanceDescriptor)
- [uu5 Library Project](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-e884539c8511447a977c7ff070e7f2cf/book/page?code=stepByStepLib)

## Using uu5g04
- [uu5 Library Documentation](https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book)

Usage in applications created by other tools, such as create-react-app, is also possible.
In such case the uu5g04 will be typically bundled into the main application file.

- The application must have dependency on **uu5g04** in its _package.json_ (**dependencies** field).
- Next to _package.json_ must exist _.npmrc_ file, where it is necessary to write `registry=https://repo.plus4u.net/repository/npm/`
- Run `npm install`
- Assets of uu5g04 (color schemas, images of flags, ...) must be available at some URL, i.e. _assets_
folder must be copied from _node_modules/uu5g04/dist/assets/_ somewhere to _public/_ folder. 
Afterwards, the path to the assets parent folder must be set into `UU5.Environment.basePath` (see example below).
- Submodules **uu5g04-bricks, ...**, must be imported using `import "uu5g04/bricks"` -
slash character is used instead of dash.

Example below renders a blue button and a language selector, showcasing that importing 
`uu5g04/bricks` works and that assets (blue color schema, flags) are loaded properly in browser.


```// src/uu5-environment.js
window.UU5 = {
  Environment: {
    basePath: process.env.PUBLIC_URL // assuming ./node_modules/uu5g04/dist/assets/* is copied to ./public/assets/*
  }
};

// src/index.js
import './uu5-environment';
import React from 'react';
...

// src/App.js
import React from 'react';
import './App.css';
import UU5 from 'uu5g04';
import 'uu5g04/bricks';

function App() {
  return (
    <UU5.Bricks.Container>
      <UU5.Bricks.Button colorSchema="blue">
        <UU5.Bricks.Lsi lsi={{en: "blue button", cs: "modré tlačítko"}} />
      </UU5.Bricks.Button>
      <UU5.Bricks.LanguageSelector displayedLanguages={["en", "cs"]} />
    </UU5.Bricks.Container>
  );
}

export default App;
```

If using uu5strings, only components that are already loaded in the page can be used.
I.e. if you want to use e.g. `<UU5.CodeKit.CodeViewer ... />` (which is in `uu5codekitg01`
library) in uu5string, it is necessary that the application imports `uu5codekitg01` directly.
On-demand loading of components would demand presence of SystemJS loader and more complex 
configuration - in such case it is advised to use [uu_appg01_devkit](https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-e884539c8511447a977c7ff070e7f2cf/book) tooling.
