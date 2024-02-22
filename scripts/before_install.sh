#!/bin/bash
rm -rf /var/www/html/devopsportal/*
mkdir -p /var/www/html/devopsportal

pm2 stop eduapp || true # Ignores error if app is not found
