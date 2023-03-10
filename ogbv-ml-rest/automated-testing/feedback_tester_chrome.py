from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException
from time import sleep
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By


# function to expand the shadow element to get the extension id on chrome://extensions

def expand_shadow_element(element):
  shadow_root = driver.execute_script('return arguments[0].shadowRoot', element)
  print("Function executed!") # This message should be printed when the shadow element is successfully expanded
  return shadow_root




options = webdriver.ChromeOptions()
# add absolute path to the dist folder of the extension here
options.add_argument(r'--load-extension=path/to/dist/folder')

# loading up the webdriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options = options)
sleep(2)
# loading the extensions page to get extension id
driver.get('chrome://extensions')
sleep(5)
# finding various elements
try:
    
    # workflow with the chrome extensions page and its shadow elements
    
    root1  = driver.find_element(By.TAG_NAME, 'extensions-manager')
    shadow_root_1 = expand_shadow_element(root1)
    root2 = shadow_root_1.find_element(By.CSS_SELECTOR, 'extensions-item-list')
    shadow_root_2 = expand_shadow_element(root2)
    ele = shadow_root_2.find_element(By.CSS_SELECTOR, 'extensions-item')
    extension_id = ele.get_attribute("id")
    print(str(extension_id)) # printing the extension id

    # going to the extensions page

    url = "chrome-extension://" + extension_id + "/options.html"
    driver.get(url)
    
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
    sleep(8)
    twt_control_bar = driver.find_element(By.CLASS_NAME,'ogbv-tweetcontrol-bar') 
    icons = twt_control_bar.find_elements(By.TAG_NAME, 'svg')
    icons[2].click() # initiates feedback
    sleep(1)
    driver.find_element('xpath','//span[contains(text(),"Feedback Sent")]') # detecting the feedback sent notification
    sleep(2)
    print('Success! :-)')
except NoSuchElementException:
    print('Failure! :-(') #one of the elements is not detected
finally:
    # Clean up.
    driver.quit()