import pandas as pd
import numpy as np
import pickle
from nltk.corpus import stopwords
from unidecode import unidecode

def parse_raw(file):
	arr = []
	with open(file, 'r') as f:
		lines = f.readlines()
		for i in range(len(lines)):
			line = lines[i]
			if line == '\n':
				lines.remove(line)
			line = line[:-1]
			line_split = line.split(' | ')
			# remove the newline character
			arr.append(line_split)

	return arr

def data_stats(arr):
	avg_len = 0
	avg_words = 0
	word_freq = {}
	median_words = 0
	prompt_words = []
	median_len = 0
	prompt_len = []

	for line, link in arr:
		avg_len += len(line)
		prompt_len.append(len(line))

		words = line.split()
		avg_words += len(words)
		prompt_words.append(len(words))

		for word in words:
			if word in word_freq:
				word_freq[word] += 1
			else:
				word_freq[word] = 1

	# convert word_freq into a list of tuples sorted by frequency in descending order
	word_freq_tuple = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

	prompt_len = sorted(prompt_len, reverse=True)
	prompt_words = sorted(prompt_words, reverse=True)

	# compute the median
	median_len = compute_median(prompt_len)
	median_words = compute_median(prompt_words)
	
	return round(avg_len/len(arr)), round(avg_words/len(arr)), word_freq_tuple, median_len, median_words, word_freq

def compute_median(arr):
	if len(arr) % 2 == 0:
		return (arr[len(arr)//2] + arr[len(arr)//2 - 1])/2
	else:
		return arr[len(arr)//2]

def clean_data(arr, avg_len, avg_words, median_len, median_words, word_freq):
	for line, link in arr:
		
		too_short = len(line) < avg_len/2
		too_long = len(line) > avg_len + avg_len/2
		too_few_words = len(line.split()) < avg_words/2
		too_many_words = len(line.split()) > avg_words + avg_words/2
		contains_brackets = ('{' in line or '}' in line or '[' in line or ']' in line or '(' in line or ')' in line)

		
		if too_short or too_long or too_few_words or too_many_words or contains_brackets:
			arr.remove([line, link])
			continue

		# TODO: revisit whether we want to remove prompts with words that appear less than 2 times
		sentence = line.split()
		for word in sentence: 
			if word_freq[word] < 2:
				arr.remove([line, link])
				break

	return arr

def addHints(df):
	# loop through dataframe and select two words randomly from each prompt to be the hint words
	# use the nltk stopwords list to remove common words
	stop_words = set(stopwords.words('english'))
	for i in range(len(df)):
		prompt = df.iloc[i, 0]
		prompt = prompt.split()
		hint_words = []
		for word in prompt:
			if word not in stop_words:
				hint_words.append(word)
		if len(hint_words) > 2:
			hint_words = np.random.choice(hint_words, size=2, replace=False)
		# add hint words to dataframe as a new column
		# strip punctuation from hint words
		df.at[i, 'hint_words'] = hint_words

def process_df(df):
	# add column "hint words" to dataframe
	addHints(df)

	# add column "prompt_length" to dataframe
	df['prompt_length'] = df['prompt'].apply(lambda x: len(x.split()))

	# create new dataframe that only contains prompts with between 5 and 20 words
	df = df[(df['prompt_length'] >= 5) & (df['prompt_length'] <= 20)]
	# reset the index to be sequential
	df = df.reset_index(drop=True)

	# remove accents from prompts
	df['prompt'] = df['prompt'].apply(lambda x: unidecode(x))

	return df

	
def main():
	# parse the raw data
	arr = parse_raw('scraping/data/lexica_raw.txt')

	# compute the statistics of the data
	avg_len, avg_words, word_freq_tuple, median_len, median_words, word_freq = data_stats(arr)
	print("number of prompts: ", len(arr))
	print("average length of prompts: ", avg_len)
	print("average number of words: ", avg_words)
	print("median length of prompts: ", median_len)
	print("median number of words: ", median_words)
	print("most frequent words: ", word_freq_tuple[:10])
	print("least frequent words: ", word_freq_tuple[-10:])
	
	# clean the data
	clean_arr = clean_data(arr, avg_len, avg_words, median_len, median_words, word_freq)
	print("number of prompts after cleaning: ", len(clean_arr))

	# convert all prompts to lowercase
	clean_arr = [[prompt.lower(), link] for prompt, link in clean_arr]

	# convert to dataframe
	df = pd.DataFrame(clean_arr, columns=['prompt', 'link'])

	df = process_df(df)

	# write the dataframe to pickle
	df.to_pickle('scraping/data/lexica_clean.pkl')

	# read the dataframe from pickle
	df = pd.read_pickle('scraping/data/lexica_clean.pkl')
	print(df[:])


main()