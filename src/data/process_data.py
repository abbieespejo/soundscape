import csv
import json

# Input and output paths
input_file = 'dataset.csv'
output_file = 'output_file_2.json'

# Data structures to hold processed data
artists = {}


# Read CSV data and process it
with open(input_file, 'r') as f:
    csv_reader = csv.DictReader(f)
    for row in csv_reader:
        artist_name = row['artist']
        song_name = row['song']
        genres = row['genre'].split(',')  # Splitting genres using comma
        popularity = int(row['popularity'])

        # If the artist is not in the dictionary, add them
        if artist_name not in artists:
            artists[artist_name] = {
                'name': artist_name,
                'children': [{
                    'name': '',
                    'children': [],
                    'genres': set()  # Temporary set to hold unique genres
                }]
            }

        # Add the song under the artist's genre child
        artists[artist_name]['children'][0]['children'].append({
            'name': song_name,
            'value': popularity
        })

        # Update the genres set for the artist
        artists[artist_name]['children'][0]['genres'].update(genres)

# Process unique genres and format the genre strings for each artist
for artist in artists.values():
    unique_genres = sorted(list(artist['children'][0]['genres']))
    artist['children'][0]['name'] = ', '.join(unique_genres).strip()
    del artist['children'][0]['genres']  # Remove temporary genres set

# Convert the dictionary values to a list and wrap into a root "artist"
output_data = {'name': 'artist', 'children': list(artists.values())}

# Save the processed data to a JSON file
with open(output_file, 'w') as f:
    json.dump(output_data, f, indent=4)

print(f"Processed data saved to {output_file}")