#!/bin/bash
# Navigate to your application directory (if necessary)
# Start the application with PM2
pm2 start npm --name "eduapp" -- run start

# Save the PM2 list
pm2 save