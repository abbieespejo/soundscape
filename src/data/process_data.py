import csv
import json

# Input and output paths
input_file = 'dataset.csv'
output_file = 'output_file.json'

# Data structures to hold processed data
artists = {}

# Read CSV data and process it
with open(input_file, 'r') as f:
    csv_reader = csv.DictReader(f)
    for row in csv_reader:
        artist_name = row['artist']
        song_name = row['song']
        genre = ', '.join(sorted(list(set(row['genre'].split(','))))).strip()  # Unique genres, sorted
        popularity = int(row['popularity'])

        # If the artist is not in the dictionary, add them
        if artist_name not in artists:
            artists[artist_name] = {
                'name': artist_name,
                'children': []
            }

        # Check if the song already exists for the artist
        song_exists = False
        for song in artists[artist_name]['children']:
            if song['name'] == song_name:
                song_exists = True
                song['children'].append({
                    'name': genre,
                    'value': popularity
                })
                break

        # If song does not exist, create a new entry for it
        if not song_exists:
            artists[artist_name]['children'].append({
                'name': song_name,
                'children': [{
                    'name': genre,
                    'value': popularity
                }]
            })

# Convert the dictionary values to a list and wrap into a root "artists"
output_data = {'name': 'artists', 'children': list(artists.values())}

# Save the processed data to a JSON file
with open(output_file, 'w') as f:
    json.dump(output_data, f, indent=4)

print(f"Processed data saved to {output_file}")
