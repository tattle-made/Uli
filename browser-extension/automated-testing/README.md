
## Testing

Setup the test virtual environment and run test scripts

```
# Change directory
$ cd ../Uli/browser-extension/automated-testing

# Create python virtual environment
$ python3 -m venv venv_automated_testing

# Activate python virtual environment
$ source ./venv_automated_testing/bin/activate

# Install tools for installing packages
(venv_automated_testing) $ pip3 install --upgrade pip setuptools wheel

# Install package requirements
(venv_automated_testing) $ pip3 install -r requirements.txt

# Enable developer mode in Extensions in chrome/chromium/brave
# Set the dist folder path in the script to be tested
# Run the server and create the plugin using instructions from - https://github.com/tattle-made/Uli/tree/main/browser-extension

# Run browser specific scripts
(venv_automated_testing) $ cd <browser_to_be_tested>
(venv_automated_testing) $ python <script_to_be_tested>

# Deactivate python virtual environment
(venv_automated_testing) $ deactivate

```


# About the Scripts

| Script                          | Description                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| archiving_tester_chrome.py/archiving_tester_firefox.py                            | Tests the archiving feature, checking whether a screenshot of a tweet is downloaded locally for chrome/firefox.                               |
| feedback_tester_chrome.py                      | Tests the feedback feature, verifying whether the flag icon appears and whether upon pressing it the correct notification is received for chrome.  |
| ml_feature_tester_chrome.py/ml_feature_tester_firefox.py | Tests whether the OGBV banner appears for chrome/firefox                                      |
| slur_detection_tester_chrome.py/slur_detection_tester_firefox.py            | Tests whether the slur redaction feature works for chrome/firefox                                 |





