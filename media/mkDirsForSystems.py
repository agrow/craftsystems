import csv
import os

with open('data/craftingDimensionsMessy.tsv', 'rb') as tsvfile, open('data/craftingDimensions.tsv', 'wb') as outfile:
	tsvfile = csv.reader(tsvfile, delimiter='\t')
	writer = csv.writer(outfile, delimiter='\t')
	
	count = 0
	for row in tsvfile:
		if count > 0:
			# CLEAN UP THAT DOCUMENT! These can't be directories
			# And honestly we should try to use less special characters...
			# Note: we do it this way to save a clean output file...
			row[0] = row[0].replace('"', '')
			row[0] = row[0].replace('/', ', ')
			row[0] = row[0].replace('?', '')
			
			row[1] = row[1].replace('"', '')
			row[1] = row[1].replace('/', ', ')
			row[1] = row[1].replace('?', '')
			
			str = row[0] + " " + row[1]
			
			print row[1]
			
			directory = "systems/" + str
			
			if not os.path.exists(directory):
				print "Making dir... " + directory
				os.makedirs(directory)
		
		writer.writerow(row)
		count = count + 1