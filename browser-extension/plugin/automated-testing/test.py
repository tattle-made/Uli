from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

from time import sleep
from selenium.webdriver.remote.webelement import WebElement

# function to expand the shadow element to get the extension id on chrome://extensions
def expand_shadow_element(element):
  shadow_root = driver.execute_script('return arguments[0].shadowRoot', element)
  print("expand_shadow_element executed!")
  return shadow_root


# Configure the necessary command-line option
options = webdriver.ChromeOptions()

# TODO: Note that you will need to download the build of the extension and put the path to the dist folder 
options.add_argument(r'--load-extension=/home/aatman/Aatman/Tattle/Uli/browser-extension/plugin/dist/')

# installing chromedriver 
driver = webdriver.Chrome(service=Service(ChromeDriverManager(chrome_type=ChromeType.GOOGLE).install()), options = options)
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
# print("----PLUGIN IS ACTIVATED--------")

# Confirm page reload on activation
WebDriverWait(driver, 10).until(EC.alert_is_present())
driver.switch_to.alert.accept()
# print("----PAGE RELOAD KAR DIYA--------")

# Wait for the link to be clickable and then click
slur_home_page = driver.find_element('id', 'slur-link')
slur_home_page.click()
# print("----NAVIGATE TO SLUR--------")

# Click on the Add Slur Button
slur_add_btn = driver.find_element('id', 'add-slur-button')
slur_add_btn.click()
# print("----CLICK ON THE ADD BUTTON--------")

slur_form_label = driver.find_element('id', 'slur-form-label')
slur_form_label.send_keys("test1")
slur_form_label_meaning = driver.find_element('id', 'slur-form-label-meaning')
slur_form_label_meaning.send_keys("test1-meaning")

# categories_checkbox = driver.find_elements(By.NAME, 'categories')
# for category_checkbox in categories_checkbox:
#     if category_checkbox.get_attribute('value') in ['gender', 'religion']:
#         category_checkbox.click()

for category_value in ['gender', 'religion']:
    script = f'document.querySelector(\'input[name="categories"][value="{category_value}"]\').click();'
    driver.execute_script(script)

# slur_form_categories_container = driver.find_element('id', 'slur-form-categories')
# gender_checkbox = driver.find_element('xpath', "//label[text()='gender']")
# caste_checkbox = driver.find_element('xpath', "//label[text()='caste']")
# gender_checkbox.click()
# caste_checkbox.click()

input("Press Enter to close the browser...")
driver.quit()