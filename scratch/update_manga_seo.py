import os
import re
import json

PUBLIC_DIR = r"c:\Users\hsini\Desktop\website manga projects\Wind Breaker\public\manga\Wind Breaker"
DIST_DIR = r"c:\Users\hsini\Desktop\website manga projects\Wind Breaker\dist\manga\Wind Breaker"

def process_file(filepath, chapter_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Track if we made changes
    modified = False

    # 1. Update Domains
    if 'windbreaker-manga.xyz' in content:
        content = content.replace('windbreaker-manga.xyz', 'wdbreaker.com')
        modified = True
        
    # 2. Update GA IDs
    if 'G-K5M96N6LY5' in content:
        content = content.replace('G-K5M96N6LY5', 'G-J6WCD43K95')
        modified = True

    # 3. Inject JSON-LD Schema
    if 'application/ld+json' not in content:
        schema = {
            "@context": "https://schema.org",
            "@type": "ComicIssue",
            "name": f"Wind Breaker {chapter_name}",
            "isPartOf": {
                "@type": "ComicSeries",
                "name": "Wind Breaker",
                "url": "https://wdbreaker.com/"
            },
            "url": f"https://wdbreaker.com/manga/Wind Breaker/{chapter_name}/index.html",
            "image": f"https://wdbreaker.com/manga/Wind Breaker/{chapter_name}/01.jpg",
            "description": f"Read Wind Breaker {chapter_name} online in high quality. Join Haruka Sakura and the Bofurin protectors in this action manga.",
            "inLanguage": "en"
        }
        
        schema_tag = f'\n    <!-- SEO Schema -->\n    <script type="application/ld+json">\n    {json.dumps(schema, indent=4)}\n    </script>\n</head>'
        content = content.replace('</head>', schema_tag)
        modified = True

    # 4. Inject Enhanced Meta/OG Tags
    if 'property="og:title"' not in content:
        meta_tags = f'''
    <!-- Open Graph & Twitter Cards -->
    <meta property="og:title" content="Read Wind Breaker - {chapter_name} Online">
    <meta property="og:description" content="Read Wind Breaker {chapter_name} online in high quality. Experience the Bofurin missions!">
    <meta property="og:image" content="https://wdbreaker.com/manga/Wind Breaker/{chapter_name}/01.jpg">
    <meta property="og:url" content="https://wdbreaker.com/manga/Wind Breaker/{chapter_name}/index.html">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Read Wind Breaker - {chapter_name} Online">
    <meta name="twitter:description" content="Read Wind Breaker {chapter_name} online.">
    <meta name="twitter:image" content="https://wdbreaker.com/manga/Wind Breaker/{chapter_name}/01.jpg">
</head>'''
        content = content.replace('</head>', meta_tags)
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def scan_and_update(directory):
    count = 0
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return count
        
    for root, _, files in os.walk(directory):
        for file in files:
            if file == 'index.html':
                filepath = os.path.join(root, file)
                chapter_name = os.path.basename(root)
                if process_file(filepath, chapter_name):
                    count += 1
    return count

if __name__ == "__main__":
    print("Updating public directory...")
    pub_count = scan_and_update(PUBLIC_DIR)
    print(f"Updated {pub_count} files in public directory.")

    print("Updating dist directory...")
    dist_count = scan_and_update(DIST_DIR)
    print(f"Updated {dist_count} files in dist directory.")
