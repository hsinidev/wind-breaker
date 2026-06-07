#!/bin/bash
# Wind Breaker Manga Online - Deployment Script

echo "Starting deployment process for Wind Breaker Manga Online..."

# 1. Pull latest changes (if using git)
# git pull origin main

# 2. Install dependencies
echo "Installing dependencies..."
npm install

# 3. Build the application
echo "Building for production..."
npm run build

# 4. Sync files to the web server directory (e.g., /var/www/wind-breaker)
# Adjust the path based on your VPS setup
TARGET_DIR="/var/www/wind-breaker"

echo "Syncing files to $TARGET_DIR..."
# sudo mkdir -p $TARGET_DIR
# sudo rsync -av --delete dist/ $TARGET_DIR/
# sudo cp nginx.conf /etc/nginx/sites-available/wind-breaker
# sudo ln -sf /etc/nginx/sites-available/wind-breaker /etc/nginx/sites-enabled/

# 5. Restart Nginx
# echo "Restarting Nginx..."
# sudo systemctl restart nginx

echo "Deployment complete! The mission archive is now live."
