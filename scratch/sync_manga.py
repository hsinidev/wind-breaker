import os
import json
import re
from urllib.parse import quote

base_path = r'public\manga\Wind Breaker'
chapters_list = []
manga_data = {}

# Ensure the path exists
if not os.path.exists(base_path):
    print(f"Error: {base_path} not found")
    exit(1)

def get_chapter_num(name):
    # Try to extract the chapter number (handles decimals like 032.5)
    match = re.search(r'chapter-(\d+\.?\d*)', name)
    if match:
        return float(match.group(1))
    return 0

# List all directories
dirs = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d))]

# Sort folders by chapter number descending, then by name for sub-chapters
# This ensures chapter-556 comes BEFORE chapter-001
dirs.sort(key=lambda x: (get_chapter_num(x), x), reverse=True)

for d in dirs:
    chapter_path = os.path.join(base_path, d)
    # Get all jpg/png files
    images = [f for f in os.listdir(chapter_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) and f.lower() != 'hero.png']
    
    # Sort images (01.jpg, 02.jpg...) - use natural sort
    images.sort(key=lambda f: [int(c) if c.isdigit() else c for c in re.split(r'(\d+)', f)])
    
    if images:
        # Use URL-encoded path for the space in "Wind Breaker"
        # However, we only encode the specific parts that need it
        encoded_base = "Wind%20Breaker"
        thumbnail = f"/manga/{encoded_base}/{d}/{images[0]}"
        
        chapters_list.append({
            "Name": d,
            "Thumbnail": thumbnail
        })
        
        # Store full array of images for reader
        manga_data[d] = [f"/manga/{encoded_base}/{d}/{img}" for img in images]

# Write chapters.json
with open('public/chapters.json', 'w') as f:
    json.dump(chapters_list, f, indent=4)

# Write manga_data.json
with open('public/manga_data.json', 'w') as f:
    json.dump(manga_data, f, indent=4)

print(f"Generated {len(chapters_list)} chapters with URL-safe paths and numeric sorting.")
