from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver import ActionChains
import time
import csv

driver = webdriver.Firefox()

try: 
	driver.get("https://lexica.art/")

	time.sleep(2)

	# get all links
	links = []

	# scroll to bottom of page
	for i in range(10):
		driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
		time.sleep(2)
		# execute JS to get all divs with role=gridcell
		elements = driver.execute_script("return document.querySelectorAll('[role=gridcell]')")
		for elem in elements:
			url = elem.find_element(By.TAG_NAME, 'a').get_attribute('href')
			links.append(url)
	
	
	with open('data/lexica_raw.txt', 'w') as f:
		for link in links:
			driver.get(link)
			time.sleep(1)
			# scrape the text
			# Find the "p" tag
			p_tag = driver.find_element(By.TAG_NAME, "p")

			# Find all child "a" tags
			a_tags = p_tag.find_elements(By.TAG_NAME, "a")

			# Concatenate the text content of each "a" tag
			concatenated_text = ""
			for a_tag in a_tags:
				concatenated_text += a_tag.text + " "

			# get image link
			img = driver.find_element(By.TAG_NAME, "img")
			img_link = img.get_attribute('src')

			# Output the concatenated text and link
			print(concatenated_text)
			print(img_link)

			# write it to a csv
			f.write(f'{concatenated_text}| {img_link}\n')

	elements.clear()
except Exception as e:
	print(e)
finally: 
	f.close()
	driver.close()
