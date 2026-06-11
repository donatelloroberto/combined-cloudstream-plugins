#!/usr/bin/env bash
# Quick install & run script for the Gay Torrents Stremio addon
set -e
echo "Installing dependencies..."
npm install
echo "Starting addon on port 7000..."
npm start
