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

# Wait for the link to be clickable and then click
slur_home_page = driver.find_element('id', 'slur-link')
slur_home_page.click()

# Click on the Add Slur Button
slur_add_btn = driver.find_element('id', 'add-slur-button')
slur_add_btn.click()

# Fill the form
slur_form_label = driver.find_element('id', 'slur-form-label')
slur_form_label.send_keys("test1")
slur_form_label_meaning = driver.find_element('id', 'slur-form-label-meaning')
slur_form_label_meaning.send_keys("test1-meaning")
checkbox_gender = driver.find_element(By.CSS_SELECTOR, 'label[for="slur-gender"]')
checkbox_gender.click()
checkbox_caste = driver.find_element(By.CSS_SELECTOR, 'label[for="slur-caste"]')
checkbox_caste.click()
radio_button_true = driver.find_element(By.CSS_SELECTOR, 'label[for="true"]')
radio_button_true.click()
slur_form_appropriation_context = driver.find_element('id', 'slur-form-appropriation-context')
slur_form_appropriation_context.send_keys("test1")
slur_form_submit_btn = driver.find_element('id', 'slur-form-submit-button')
slur_form_submit_btn.click()

sleep(3)
# Click on the Edit button
slur_edit_button = driver.find_element('id', 'slur-edit-button')
slur_edit_button.click()
sleep(1)
# Now edit the form
edit_slur_form_label = driver.find_element('id', 'slur-form-label')
edit_slur_form_label.send_keys("-edit")
edit_slur_form_label_meaning = driver.find_element('id', 'slur-form-label-meaning')
edit_slur_form_label_meaning.send_keys("-edit")
edit_checkbox_caste = driver.find_element(By.CSS_SELECTOR, 'label[for="slur-caste"]')
edit_checkbox_caste.click()
edit_radio_button_true = driver.find_element(By.CSS_SELECTOR, 'label[for="false"]')
edit_radio_button_true.click()
edit_slur_form_appropriation_context = driver.find_element('id', 'slur-form-appropriation-context')
edit_slur_form_appropriation_context.send_keys("-edit")
edit_slur_form_save_btn = driver.find_element('id', 'slur-form-save-button')
edit_slur_form_save_btn.click()

sleep(2)
# Delete the Slur
slur_delete_btn = driver.find_element('id', 'slur-delete-button')
slur_delete_btn.click()
sleep(1)

# input("Press Enter to close the browser")
driver.quit()