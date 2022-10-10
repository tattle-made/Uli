from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException

from time import sleep
from selenium.webdriver.remote.webelement import WebElement





# Configure the necessary command-line option
options = webdriver.ChromeOptions()
# Note that you will need to download the build of the extension and put the path to the dist folder 
options.add_argument(r'--load-extension=path\to\dist_folder_of_extension')

# installing chromedriver 
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options = options)
sleep(2)
# add a hardcoded url leading to a particular tweet which you are using for testing 
driver.get('your url here')
sleep(5)
# Check if the extension worked and log the result. 
try:
    # logic to check if the slur is replaced
    ele = driver.find_element('xpath','//span[contains(text(),"▓")]')
    print('Success! :-)')
    # if no such span is present where the character - ▓ - is not present then the Failure message will show up
    # Note that this will return success if the tweet by default contains the replacement character 
except NoSuchElementException:
    print('Failure! :-(')
finally:
    ''' Clean up. '''
    driver.quit()