import json
from datetime import datetime

DOMAIN = "https://wdbreaker.com"
OUTPUT_FILE = "public/sitemap.xml"

# Base Pages
pages = [
    {"url": "/", "priority": "1.0", "changefreq": "daily"},
    {"url": "/chapters.html", "priority": "0.9", "changefreq": "daily"},
    {"url": "/characters.html", "priority": "0.9", "changefreq": "weekly"},
    {"url": "/privacy-policy.html", "priority": "0.5", "changefreq": "monthly"},
    {"url": "/dmca.html", "priority": "0.5", "changefreq": "monthly"}
]

# Read Chapters
chapters_data = []
try:
    with open("public/chapters.json", "r", encoding="utf-8") as f:
        chapters_data = json.load(f)
except Exception as e:
    print(f"Error reading chapters.json: {e}")

# Add chapter URLs
for chapter in chapters_data:
    chapter_id = chapter.get("Name", "")
    if chapter_id:
        pages.append({
            "url": f"/reader.html?ch={chapter_id}",
            "priority": "0.8",
            "changefreq": "never"
        })

current_date = datetime.now().strftime("%Y-%m-%d")

# Generate XML
xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for page in pages:
    xml_content += '  <url>\n'
    xml_content += f'    <loc>{DOMAIN}{page["url"]}</loc>\n'
    xml_content += f'    <lastmod>{current_date}</lastmod>\n'
    if "changefreq" in page:
        xml_content += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
    if "priority" in page:
        xml_content += f'    <priority>{page["priority"]}</priority>\n'
    xml_content += '  </url>\n'

xml_content += '</urlset>\n'

# Write to sitemap.xml
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(xml_content)

print(f"Successfully generated sitemap.xml with {len(pages)} URLs.")
