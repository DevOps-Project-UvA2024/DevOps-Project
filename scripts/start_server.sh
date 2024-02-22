#!/bin/bash
cd /var/www/html/devopsportal
pm2 kill
pm2 start npm --name "eduapp" -- run start
