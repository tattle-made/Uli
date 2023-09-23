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
driver.install_addon('/home/aatman/Aatman/Tattle/Uli/browser-extension/plugin/dist', temporary=True)
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

# Save settings
save_button = driver.find_element('id', 'app_btn_save') #saving the settings
save_button.click()
# need sleep() here - else page tries to migrate to '/preferences' which fails
sleep(5)