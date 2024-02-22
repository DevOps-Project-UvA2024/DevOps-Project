#!/bin/bash
pm2 stop eduapp || true
pm2 delete eduapp || true
