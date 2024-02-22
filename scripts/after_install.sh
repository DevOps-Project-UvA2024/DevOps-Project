#!/bin/bash
cd /var/www/html/devopsportal
apt update
apt install nodejs npm -y
npm install
npm install pm2 -g
