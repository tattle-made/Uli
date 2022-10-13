from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException
from time import sleep
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
import os

options = webdriver.ChromeOptions()
# add the absolute path to your extension here
options.add_argument(r'--load-extension=path\to\dist_folder_of_extension')

# initiate the driver for chrome
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options = options)
sleep(2)
# hardcode the tweet you wish to load up for testing, a sample url is alraedy present with a known slur
driver.get('https://twitter.com/jackantonoff/status/1579311659742416896')
sleep(5)
# Check if the extension worked and log the result.
try:
    # add the absolute path to the directory where your browser downloads files by default (you can verify this by commenting the files counting steps once an seeing where the new files are)
    initial_count = len(os.listdir(r'path\to\downloads_folder')) # count the number of files in your downloads directory
    twt_control_bar = driver.find_element(By.CLASS_NAME,'ogbv-tweetcontrol-bar') 
    icons = twt_control_bar.find_elements(By.TAG_NAME, 'svg')
    icons[0].click() # initiates download
    sleep(10)
    # sleep(100) if you wish to check where your download folder is
    final_count = len(os.listdir(r'C:\Users\bharg\Downloads')) #recount the number of files in your downloads folder
    if(final_count > initial_count):
        print('File archived successfully! :-)')  
    else:
        print('Please check the path to the downloads folder!') 
except NoSuchElementException:
    print('Failure! :-(')
finally:
    # Clean up.
    driver.quit()
    