#!/usr/bin/env bash


echo "Instalando dependencias..."


# Não obrigar usar git
#if [[ -x "$(command -v git)" ]]; then
#    git init
#fi

if ! [[ -x "$(command -v npx)" ]]; then
    npm i -g --loglevel warn npx
fi

npm i --save --loglevel warn sindri-framework@2.1
npm i --save --loglevel warn pkg@4.4.0
# Foi incorporado ao projeto  TODO: remover depois de testado
# npm i --save --loglevel warn config

npm i --save-dev --loglevel warn nodemon
