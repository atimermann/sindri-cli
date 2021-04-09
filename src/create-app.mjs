#!/usr/bin/env node
/**
 * **Created on 07/12/18**
 *
 * bin/create-app
 * @author André Timermann <andre.timermann@smarti.io>
 *
 */
'use strict'

const program = require('commander')
const { join, basename } = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const changeCase = require('change-case')
const { findRootPath, validateProject, render } = require('../library/tool')

const moment = require('moment')
moment.locale('pt-br')

program
  .description('Cria um novo app com os arquivos necessários utilizando o Sindri Framework.')
  .parse(process.argv)

;(async () => {
  try {

    const templateAppPath = join(__dirname, '../template', 'app')
    const rootPath = await findRootPath()
    const srcPath = join(rootPath, 'src')
    await validateProject(srcPath)

    /// /////////////////////////////////////////////////////////
    // Valida se Projeto é válido
    /// /////////////////////////////////////////////////////////
    if (!await fs.pathExists(join(srcPath, 'apps'))) {
      console.error('Project invalid!')
      process.exit(1)
    }

    /// /////////////////////////////////////////////////////////
    // Questões
    /// /////////////////////////////////////////////////////////
    // Traduzir
    const questions = [
      {
        name: 'app',
        message: 'Nome do App?',
        default: basename(rootPath),
        validate: input => input.match(/^[a-zA-Z0-9-]+$/) ? true : 'Nome deve contar apenas caracteres simples (a-Z 0-9 -)'
      },
      {
        name: 'controller',
        message: 'Nome do controller padrão?',
        default: 'HelloWorld',
        validate: input => input.match(/^[a-zA-Z0-9]+$/) ? true : 'Nome deve contar apenas caracteres simples (a-Z 0-9)'
      }
    ]

    const answers = await inquirer.prompt(questions)

    const appPath = join(srcPath, 'apps', answers.app)
    const controllerFileName = changeCase.camelCase(answers.controller) + '.js'

    /// /////////////////////////////////////////////////////////
    // Valida se diretório existe
    /// /////////////////////////////////////////////////////////
    if (await fs.pathExists(appPath)) {
      console.error(`Directory '${appPath}' already exists!`)
      process.exit(1)
    }

    /// /////////////////////////////////////////////////////////
    // Copia Template
    /// /////////////////////////////////////////////////////////
    console.log(`Criando app em ${appPath}`)
    await fs.copy(templateAppPath, appPath)

    /// /////////////////////////////////////////////////////////
    // Renomeia Diretório app
    /// /////////////////////////////////////////////////////////

    console.log(`Criando app "${answers.app}"`)
    await fs.move(
      join(appPath, 'controllers', '__controller_template.js'),
      join(appPath, 'controllers', controllerFileName)
    )

    /// /////////////////////////////////////////////////////////
    // Altera Arquivos
    /// /////////////////////////////////////////////////////////

    /// /// controllerFileName //////
    await render(join(srcPath, 'apps', answers.app, 'controllers', controllerFileName), {
      CREATED_DATE: moment().format('L'),
      APP: answers.app.replace(/-/g, '_'),
      AUTHOR: require(join(rootPath, 'package.json')).author,
      CONTROLLER_FILE_NAME: controllerFileName,
      CONTROLLER_NAME: changeCase.pascalCase(answers.controller)
    })

    console.log('\n------------------------------------')
    console.log('App criado com sucesso!')
    console.log('\nPara testar, execute o script: \n\t"sindri install-assets"')
    console.log('\nEm seguida:\n\t "npm run dev"')
    console.log('------------------------------------\n\n')
  } catch (e) {
    console.error(e.stack)
    process.exit()
  }
})()
