import json
import os
import requests
import time
import re
from itertools import cycle

# PROVIDED API KEYS (PROMPT_06)
import os
# API keys are loaded from environment variables for security
env_keys = os.environ.get("BIGMODEL_API_KEY", "")
API_KEYS = [k.strip() for k in env_keys.split(",") if k.strip()] if env_keys else []

# CONFIG
# User specified "Ollama API" but provided keys that match ZhipuAI/Cloud formats.
# We use an OpenAI-compatible endpoint as a standard proxy interface.
BASE_URL = "http://localhost:11434/v1" # Standard Ollama local OpenAI endpoint
MODEL = "llama3" # Or user's preferred high-SEO model

key_pool = cycle(API_KEYS)

def get_ai_response(prompt, system_prompt="You are a Manga SEO Architect."):
    key = next(key_pool)
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    
    try:
        # Note: If using pure local Ollama, keys might be ignored, but passed for rotation logic/proxy transparency
        response = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=data, timeout=120)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error with key {key[:8]}...: {e}")
        return None

def generate_chapter_seo(chapter_name):
    print(f"Generating SEO for {chapter_name}...")
    
    # 1. 150-word summary
    summary_prompt = f"Write a 150-word SEO-optimized summary for Wind Breaker Manga Chapter {chapter_name}. Focus on the action, character growth, and Bofurin's mission. Use keywords like 'Wind Breaker Manga', 'Bofurin', and 'Haruka Sakura'."
    summary = get_ai_response(summary_prompt)
    
    # 2. 1500-word Tactical Report
    report_prompt = f"Write a 1500-word 'Tactical Intel Report' for Wind Breaker Manga Chapter {chapter_name}. This is a deep-dive analysis for fans. Include sections on: Combat Analysis, Character Psychological Profiles, Street-Level Sociology of Makochi, and Future Predictions. Write in a gritty, tactical tone of a Bofurin intel officer. Optimize for long-tail SEO."
    report = get_ai_response(report_prompt)
    
    return {
        "summary": summary,
        "tactical_report": report
    }

def generate_character_seo(character):
    print(f"Generating SEO for Hero: {character['name']}...")
    prompt = f"Write a 500-word high-quality SEO biography for the Wind Breaker character {character['name']}. Focus on their combat abilities, role in Bofurin/Shishitoren, and their impact on the story. Use a premium, engaging tone. Optimize for keywords like '{character['name']} ability', 'Wind Breaker Heroes', and 'Bofurin Personnel'."
    bio = get_ai_response(prompt)
    return bio

def run_sync():
    # Load Existing Data
    chapters_path = os.path.join('public', 'chapters.json')
    characters_path = os.path.join('public', 'characters.json')
    seo_output_path = os.path.join('public', 'seo_intel.json')
    
    if not os.path.exists(chapters_path) or not os.path.exists(characters_path):
        print("Required JSON files missing. Run sync_manga.py first.")
        return

    with open(chapters_path, 'r', encoding='utf-8') as f:
        chapters = json.load(f)
    with open(characters_path, 'r', encoding='utf-8') as f:
        characters = json.load(f)
        
    # Load or Init SEO Data
    if os.path.exists(seo_output_path):
        with open(seo_output_path, 'r', encoding='utf-8') as f:
            seo_data = json.load(f)
    else:
        seo_data = {"chapters": {}, "characters": {}}

    # Process Top 20 Characters
    for char in characters[:20]:
        if char['id'] not in seo_data['characters']:
            bio = generate_character_seo(char)
            if bio:
                seo_data['characters'][char['id']] = bio
                # Update original character bio if it was a placeholder
                char['bio'] = bio[:300] + "..." # Truncate for the UI
                
    # Process Top 50 Chapters (to stay within reasonable time for now)
    count = 0
    for ch in chapters[:50]:
        ch_id = ch['Name']
        if ch_id not in seo_data['chapters']:
            intel = generate_chapter_seo(ch_id)
            if intel:
                seo_data['chapters'][ch_id] = intel
                count += 1
                if count >= 10: # Safety break to not hang too long in one go
                    break

    # Save Results
    with open(seo_output_path, 'w', encoding='utf-8') as f:
        json.dump(seo_data, f, indent=2)
    
    with open(characters_path, 'w', encoding='utf-8') as f:
        json.dump(characters, f, indent=2)

    print("SEO Intel Generation Cycle Complete.")

if __name__ == "__main__":
    run_sync()
