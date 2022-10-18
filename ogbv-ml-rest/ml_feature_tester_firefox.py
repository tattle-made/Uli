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
driver.install_addon(r'C:\Work\playground\uli-tester\extension\dist_firefox_dev\web-ext-artifacts\31f8bff81027425aae30-0.1.10.xpi')
sleep(2)
 

# next we test the extension
try:
    
    # workflow to get the internal uuid of the extension instance

    driver.get('about:debugging#/runtime/this-firefox')
    sleep(2)
    uli_span = driver.find_element('xpath','//span[contains(text(),"uli")]')
    uli_span_parent = uli_span.find_element('xpath', './..')
    ids = uli_span_parent.find_elements(By.TAG_NAME, 'dd')
    extension_id = str(ids[1].text)
    
    sleep(2)
    
    url = "moz-extension://" + extension_id + "/options.html" # going to the options page
    driver.get(url)
    
    sleep(5)
    activate_button = driver.find_element('id', 'app_btn_activate') #activating account
    activate_button.click()
    sleep(5)
    enable_OGBV_filter = driver.find_element('xpath','//span[contains(text(),"Enable OGBV filter")]')
    enable_OGBV_filter.click() # enabling ogbv filter
    sleep(2)
    save_button = driver.find_element('id', 'app_btn_save') #saving the settings
    save_button.click()
    # add a hardcoded url of a known ogbv tweet here, a sample url is already provided
    driver.get('https://twitter.com/jackantonoff/status/1579311659742416896')
    sleep(5)
    driver.find_element('xpath','//p[contains(text(),"Uli detected this tweet to be oGBV")]') # detecting the banner
    print('Success! :-)')
except NoSuchElementException:
    print('Failure! :-(') #one of the elements is not detected
finally:
    # Clean up.
    driver.quit()