import os
import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from tqdm import tqdm

cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
app = firebase_admin.initialize_app(cred)
db = firestore.client()

def upload_data():
	# upload data to firebase with the following structure:
	# id: index of row
	# prompt: text of prompt
	# image: image link
	# length: length of prompt

	df = pd.read_pickle('scraping/data/lexica_clean.pkl')
	for i in tqdm(range(len(df))):
		prompt = df.iloc[i, 0]
		link = df.iloc[i, 1]
		hint_words = df.iloc[i, 2]
		length = df.iloc[i, 3]

		if type(hint_words) != list: 
			hint_words = hint_words.tolist()
		
		db.collection('prompts').document(str(i)).set({
			'prompt': prompt,
			'image': link,
			'hint_words': hint_words,
			'length': int(length)
		})

upload_data()