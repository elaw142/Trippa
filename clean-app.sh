#!/bin/zsh

cd datadons-app
rm -rf node_modules
npm install --legacy-peer-deps
npm start