#!/bin/bash
echo "setting up docker to work with the app"
npm config set save-prefix ''
npm install
npm run db:setup:tables