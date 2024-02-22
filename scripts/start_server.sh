#!/bin/bash
cd /var/www/html/devopsportal
# Start the application with PM2
pm2 start npm --name "eduapp" -- run start

# Save the PM2 list
pm2 save