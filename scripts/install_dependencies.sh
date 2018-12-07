#!/usr/bin/env bash


echo "Instalando dependencias..."

if [[ -x "$(command -v git)" ]]; then
    git init
fi

if ! [[ -x "$(command -v npx)" ]]; then
    npm i -g --loglevel warn npx
fi

npm i --save --loglevel warn sindri-framework
npm i --save --loglevel warn pkg
npm i --save --loglevel warn config
