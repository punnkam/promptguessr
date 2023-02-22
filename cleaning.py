def parse_raw(file):
	arr = []
	with open(file, 'r') as f:
		lines = f.readlines()
		for line in lines:
			if line == '\n':
				lines.remove(line)
			line.split('|')
			arr.append(line)

	return arr

