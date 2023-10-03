import csv
from collections import defaultdict
import json

def read_and_process_dataset(filename):
    # Dictionary to store song count for each artist for each year.
    yearly_counts = defaultdict(lambda: defaultdict(int))
    
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        # Count songs for each artist for each year.
        for row in reader:
            yearly_counts[row['year']][row['artist']] += 1

    # Convert the yearly_counts into the desired format.
    cumulative_counts = defaultdict(list)

    sorted_years = sorted(yearly_counts.keys())
    for year in sorted_years:
        for artist in yearly_counts[year]:
            cumulative_count = cumulative_counts[artist]
            previous_count = cumulative_count[-1] if cumulative_count else 0
            cumulative_count.append(previous_count + yearly_counts[year][artist])

    # Handle artists that might not have songs in every year.
    for artist_list in cumulative_counts.values():
        while len(artist_list) < len(sorted_years):
            artist_list.append(artist_list[-1] if artist_list else 0)

    return dict(cumulative_counts)

def export_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    input_filename = "dataset.csv"
    output_filename = "processed_data.json"

    data = read_and_process_dataset(input_filename)

    # Print the number of unique artists
    print(f"Total number of unique artists: {len(data)}")

    export_to_json(data, output_filename)
