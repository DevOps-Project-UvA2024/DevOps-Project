#!/bin/bash
cd /var/www/html/devopsportal
sudo apt update
sudo apt install nodejs npm -y
npm install
sudo npm install pm2 -g
