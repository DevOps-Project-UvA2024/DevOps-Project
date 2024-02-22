#!/bin/bash
cd /var/www/html/devopsportal
pm2 start npm --name "eduapp" -- run start
pm2 save
sudo pm2 startup systemd
