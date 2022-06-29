![Cover Image](../docs/browser-extension-repo-cover.png)

# Developing Locally

All the code is organized into the `/src` folder. The extension uses content-script and popup page, both of which are bundled by parcel and placed in the `/dist` folder.

In three different tabs, run the following commands - `npm run start:options` and `npm run start:contentScript` and `npm run moveBuildArtefactsToDistDir` one after the other.
These commands should place a few files in the `/dist` folder. The files of interest are - `options.html`, `options.js` and `content-script.js`

At this point, try to load the plugin by following an online guide like [this](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)

Since Parcel runs a development server with live reload, any changes you make to your `/src` files will be bundled and served in the `/dist` folder and you should be able to try it out on extension right away.

Sometimes you might have to press the reload button of your extension in the chrome://extensions tab.

# Building The Extension

run `npm run build` and it will give you a bundled and minified files in the `/dist` folder. This can then be shared to share the extension with others.

![Preferences Page in English](../assets/ogbv-preferences-en.png)
![Preferences Page in Hindi](../assets/ogbv-preferences-hi.png)

# Code Organization

| Directory                   | Description                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| scripts/                    | helper scripts that aren't directly part of the bundled extension                                    |
| src/twitter/                | all code related to parsing and processing data from twitter and injecting UI elements into twitter  |
| src/ui-components/{atoms,molecules}       | react components that serve as the building blocks for the UI.                                         |
| src/ui-components/pages     | these correspond to UI pages you see in the extension's option page                                  |
| src/content-script.js       | entry point into the extension                                                                       |
| src/background.js           | empty for now. meant to store background workers for performing long running tasks in the background |
| src/config.js               | configurable options of the plugin                                                                   |

## Entry Points :

The Chrome Extension has 2 entry points - content-script.js and options.html.
Content Script is a javascript file that is loaded on every page that this plugin is permitted to, in our case twitter.com. Optionsl.html is the UI of the plugin that can be accessed by clicking on the UI icon in the browser.
