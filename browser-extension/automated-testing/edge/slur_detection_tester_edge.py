from selenium import webdriver
from selenium.webdriver.edge.service import Service
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from webdriver_manager.core.os_manager import ChromeType
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from time import sleep
from selenium.webdriver.remote.webelement import WebElement


# function to expand the shadow element to get the extension id on chrome://extensions
def expand_shadow_element(element):
  shadow_root = driver.execute_script('return arguments[0].shadowRoot', element)
  print("expand_shadow_element executed!")
  return shadow_root


# Configure the necessary command-line option
options = webdriver.ChromeOptions()
# Note that you will need to download the build of the extension and put the path to the dist folder 
options.add_argument(r'--load-extension=/path/to/extension/dist/')

# installing chromedriver 
driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()), options = options)
sleep(2)

# loading the extensions page to get extension id
driver.get('chrome://extensions')
sleep(5)

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

# activate plugin
activate_button = driver.find_element('id', 'app_btn_activate') #activating account
activate_button.click()

# Confirm page reload on activation
WebDriverWait(driver, 10).until(EC.alert_is_present())
driver.switch_to.alert.accept()

# Save settings
save_button = driver.find_element('id', 'app_btn_save') #saving the settings
save_button.click()

# add a hardcoded url which you are using for testing 
driver.get('https://en.wikipedia.org/wiki/Bitch_(slang)')
### TODO: this is a testing workaround for a randomly appearing bug ### 
# Scroll page to get Uli to redact everytime successfully
driver.execute_script("window.scrollTo(0, 100)")
sleep(2)
driver.execute_script("window.scrollTo(0, 200)")
sleep(2)
driver.execute_script("window.scrollTo(0, 0)")
### END workaround ###
sleep(10)
# Check if the extension worked and log the result. 
try:
    # logic to check if the slur is replaced
    ele = driver.find_element('xpath','/html/body/div[2]/div/div[3]/main/div[3]/div[3]/div[1]/p[2]/i[1]/b[contains(text(),"▓")]')
    print('Success! :-)')
    # if no such span is present where the character - ▓ - is not present then the Failure message will show up
    # Note that this will return success if the tweet by default contains the replacement character 
except NoSuchElementException:
    print('Failure! :-(')
finally:
    ''' Clean up. '''
    driver.quit()