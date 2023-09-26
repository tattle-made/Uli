from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.common.exceptions import NoSuchElementException
from time import sleep
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By

from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))

# TODO: Add path to dist folder without trailing separator ('/')
driver.install_addon('path/to/dist', temporary=True)
sleep(5)

# workflow
driver.get('about:debugging#/runtime/this-firefox')
sleep(2)
uli_span = driver.find_element('xpath','//span[contains(text(),"uli")]')
uli_span_parent = uli_span.find_element('xpath', './..')
ids = uli_span_parent.find_elements(By.TAG_NAME, 'dd')
# get Internal UUID instead of extension ID for automated testing
internal_UUID = str(ids[2].text)
sleep(2)
print(internal_UUID)

# going to the options page
url = "moz-extension://" + internal_UUID + "/options.html"
driver.get(url)
sleep(5)

# Activate Uli
activate_button = driver.find_element('id', 'app_btn_activate')
activate_button.click()

# Confirm page reload on activation
WebDriverWait(driver, 10).until(EC.alert_is_present())
driver.switch_to.alert.accept()

# Reload page manually for automated handling - '/preferences' page load fails
url = "moz-extension://" + internal_UUID + "/options.html"
driver.get(url)
sleep(5)

# Save settings
save_button = driver.find_element('id', 'app_btn_save') #saving the settings
save_button.click()
### TODO: this is a testing workaround for a randomly appearing bug ###
# Reload page manually for automated handling - '/preferences' page load fails
# this workaround also fails but rarely
url = "moz-extension://" + internal_UUID + "/options.html"
driver.get(url)
### END workaround ###

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

    # if no such span is present where the character - ▓ - is not present then the Failure message will show up
    # Note that this will return success if the tweet by default contains the replacement character 
    
    print('Success! :-)')
except NoSuchElementException:
    print('Failure! :-(')
finally:
    # Clean up.
    driver.quit()
