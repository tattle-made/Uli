# How It Works

When you visit a URL of the form http://twitter.com/*, Uli injects a [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) into page. This script is located at `browser extension/plugin/src/content-script.js`. This is the entry point for all Uli features.

The control flow is as follows :

```
┌───────────────────────┐                  ┌───────────────────────┐
│ set MutationObserver  ├────onMutation───►│  check if added node  │       ┌─────────┐
│ on the <main> element │                  │  is <section>         ├──No──►│ Drop It │
└───────────────────────┘                  └───────────┬───────────┘       └─────────┘
                                                       │
                                                      Yes
                                                       │
┌───────────────────────┐                              ▼
│ set Message Listener  │                    ┌───────────────────┐
│ on Chrome Runtime     ├─────onUrlChange────┤ hande new page    │
└───────────────────────┘                    └─┬─────────────────┘
                                               │
                                               │  ┌────────────────────────┐
                                          ┌────┼─►│ process existing nodes │
                                          │    │  └────────────────────────┘
                                          │    │
                                          │    │  ┌───────────────────────────┐
                                          │    └─►│set listener for new nodes │
                                          │       └─────────┬─────────────────┘
                                          │                 │
                                          └─onNewNode───────┘
```

## Listening for URL changes
Prerequisite : 
- a background service worker(`background.js`) that runs in the background all the time and sends a 'URL_CHANGED' message to the content script 
- `a chrome.runtime.onMessage` listener configured in the `content-script.js` which processes the page whenever url changes

If anything breaks in this setup, the tweet control UI will work inconsistently.  You will see that it is injected into the twitter UI correctly the first time you load a twitter page but if you click on any links within that page and arrive at a new page, it won't be injected on that page.



# Debugging Parser Logic

Every page has its `getTimeline` function defined in `src/twitter/pages`
Try copy pasting it in your Browser's dev console