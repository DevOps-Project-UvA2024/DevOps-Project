#!/bin/bash
cd /var/www/html/devopsportal

# Start the application with PM2
pm2 start app.js --name "devopsportal"

# Save the process list for resurrection on reboot
pm2 save

# Set up PM2 to restart on system boot
pm2 startup
