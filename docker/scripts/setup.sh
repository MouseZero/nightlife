#!/bin/bash
echo "setting up docker to work with the app"
cp -rf "/node/docker/scripts/${APP_ENV}/node.config.json" /node/config.json
npm install
npm run db:setup:tables