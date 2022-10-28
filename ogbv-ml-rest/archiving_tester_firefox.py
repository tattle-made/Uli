from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.common.exceptions import NoSuchElementException
from time import sleep
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
import os

# Configure the necessary command-line option
options = webdriver.FirefoxOptions()

driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options = options)
# Note that you will need to run the web-ext command inside the dist folder
# put the location to the xpi file here, it should end in /path/to/folder/web-ext-artifacts/[id].xpi
driver.install_addon('path/to/xpi-file')
sleep(5)
# add a hardcoded url leading to a particular tweet which you are using for testing 
driver.get('https://twitter.com/jackantonoff/status/1579311659742416896')

sleep(5)
# Check if the extension worked and log the result.
try:
    # add the absolute path to the directory where your browser downloads files by default (you can verify this by commenting the files counting steps once an seeing where the new files are)
    initial_count = len(os.listdir('path/to/downloads-folder')) # count the number of files in your downloads directory
    twt_control_bar = driver.find_element(By.CLASS_NAME,'ogbv-tweetcontrol-bar') 
    icons = twt_control_bar.find_elements(By.TAG_NAME, 'svg')
    icons[0].click() # initiates download
    sleep(10)
    # sleep(100) if you wish to check where your download folder is
    final_count = len(os.listdir('path/to/downloads-folder')) #recount the number of files in your downloads folder
    if(final_count > initial_count):
        print('File archived successfully! :-)')  
    else:
        print('Please check the path to the downloads folder!') 
except NoSuchElementException:
    print('Failure! :-(')
finally:
    # Clean up.
    driver.quit()