import pandas as pd
import numpy as np
import pickle

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
	
	return round(avg_len/len(arr)), round(avg_words/len(arr)), word_freq_tuple, median_len, median_words

def compute_median(arr):
	if len(arr) % 2 == 0:
		return (arr[len(arr)//2] + arr[len(arr)//2 - 1])/2
	else:
		return arr[len(arr)//2]

def clean_data(arr, avg_len, avg_words, median_len, median_words):

	for line, link in arr:
		too_short = len(line) < avg_len/2
		too_long = len(line) > avg_len + avg_len/2
		too_few_words = len(line.split()) < avg_words/2
		too_many_words = len(line.split()) > avg_words + avg_words/2
		contains_brackets = '{' in line or '}' in line or '[' in line or ']' or '(' in line or ')' in line

		if too_short or too_long or too_few_words or too_many_words or contains_brackets:
			arr.remove([line, link])
			
	return arr
	
def main():
	# parse the raw data
	arr = parse_raw('data/lexica_raw.txt')

	# compute the statistics of the data
	avg_len, avg_words, word_freq, median_len, median_words = data_stats(arr)
	print("number of prompts: ", len(arr))
	print("average length of prompts: ", avg_len)
	print("average number of words: ", avg_words)
	print("median length of prompts: ", median_len)
	print("median number of words: ", median_words)
	
	# clean the data
	clean_arr = clean_data(arr, avg_len, avg_words, median_len, median_words)
	print("number of prompts after cleaning: ", len(clean_arr))

	# write the cleaned data to a file as a dataframe
	df = pd.DataFrame(clean_arr, columns=['prompt', 'link'])

	# write the dataframe to pickle
	df.to_pickle('data/lexica_clean.pkl')

	# read the dataframe from pickle
	df = pd.read_pickle('data/lexica_clean.pkl')
	print(df.head())


main()