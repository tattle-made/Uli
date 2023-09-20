
## Testing

1. Go to the following url and download the extension zip file present in the release: https://github.com/tattle-made/OGBV/releases
2. Extract the files locally and put the path to the dist folder present in the newly extracted files in the "options.add_argument" function in the slur_detection_tester.py file
3. Run the following in your test environment (in order):

```
pip install selenium
pip install webdriver-manager
```

4. Find a tweet with a known slur, you can look them up here: https://github.com/tattle-made/OGBV/blob/main/browser-extension/plugin/src/slur-replace.js. You'll need to hardcode the url in the "driver.get()" function. A known url is the following: https://twitter.com/jackantonoff/status/1579311659742416896. This should set you up for running the code.

### Using Docker-Compose for testing

1. Start the following backend services using the docker-compose:

    1. SQL Database
    2. REST API Server for Uli
    3. OGBV ML REST

```
cd browser-extension
docker-compose up
```

2. Getting a local build (if you are making changes or in case the build at https://github.com/tattle-made/OGBV/releases is outdated):

```
cd browser-extension/plugin
npm run dev:chrome
or
npm run dev:firefox
```


Now you should have a build of the plugin in the browser-extension/plugin/dist folder

In case you are facing issues regarding this, please visit https://github.com/tattle-made/OGBV/blob/main/browser-extension/README.md. This should resolve the most basic issues regarding the above commands

3. Starting a development server:

```
cd browser-extension/api-server
nodemon index.js
```

This should start a local server at port 3000. Please visit https://github.com/tattle-made/OGBV/blob/main/browser-extension/api-server/README.md for more information

4. Running tests: 

    1. If you are on chrome, just putting the absolute path to the dist folder inside the scripts for chrome should be fine to run the tests. The codes have a directive on where to put those paths.
    2. If you are on firefox, do the following: 
        1. Note that in order to run the following you need to have `node` installed on your machine. Once that is taken care of, run the following command:
            ```bash

            npm install --global web-ext

            ```
        2. Next, you will need to run the following command inside the dist folder generated upon running a development server:
            ```bash

            web-ext sign --api-key=$WEB_EXT_API_KEY --api-secret=$WEB_EXT_API_SECRET

            ```
            In order to generate your own api key and api secret you may visit the following [page](https://addons.mozilla.org/en-US/developers/addon/api/key/)

        3. This should give you an xpi file inside a "web-ext-artifacts" folder. The response upon successfully running the command should be something like this: 

            ![output for running web-ext sign](./docs/xpi-file-creation.png)

        4. Use the path to this '.xpi' file in the firefox testing scripts for loading the extension in the browser wherever needed. 
        5. Note that currently if you extension's size goes above 4MB, Firefox does not allow you to create an extension file. We are exploring a suitable workaround for Uli for the same currently.


# About the Scripts

| Script                          | Description                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| archiving_tester_chrome.py/archiving_tester_firefox.py                            | Tests the archiving feature, checking whether a screenshot of a tweet is downloaded locally for chrome/firefox.                               |
| feedback_tester_chrome.py                      | Tests the feedback feature, verifying whether the flag icon appears and whether upon pressing it the correct notification is received for chrome.  |
| ml_feature_tester_chrome.py/ml_feature_tester_firefox.py | Tests whether the OGBV banner appears for chrome/firefox                                      |
| slur_detection_tester_chrome.py/slur_detection_tester_firefox.py            | Tests whether the slur redaction feature works for chrome/firefox                                 |





