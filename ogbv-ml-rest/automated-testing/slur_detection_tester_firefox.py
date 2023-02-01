from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.common.exceptions import NoSuchElementException
from time import sleep
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By


# Configure the necessary command-line option
options = webdriver.FirefoxOptions()

driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options = options)
# Note that you will need to run the web-ext command inside the dist folder
# put the location to the xpi file here, it should end in /path/to/folder/web-ext-artifacts/[id].xpi
driver.install_addon('path/to/xpi-file')
sleep(5)
# add a hardcoded url leading to a particular tweet which you are using for testing 
# a test url is already given
driver.get('https://twitter.com/jackantonoff/status/1579311659742416896')


sleep(5)
# Check if the extension worked and log the result.
try:
    # logic to check if the slur is replaced
    ele = driver.find_element('xpath','//span[contains(text(),"▓")]')

    # if no such span is present where the character - ▓ - is not present then the Failure message will show up
    # Note that this will return success if the tweet by default contains the replacement character 
    
    print('Success! :-)')
except NoSuchElementException:
    print('Failure! :-(')
finally:
    # Clean up.
    driver.quit()
