#!/bin/bash
# Navigate to your application directory (if necessary)
# Start the application with PM2
sudo pm2 start npm --name "eduapp" -- run start

# Save the PM2 list
sudo pm2 save