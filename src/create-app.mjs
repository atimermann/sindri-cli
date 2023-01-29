#!/usr/bin/env node
/**
 * **Created on 07/12/18**
 *
 * bin/create-app
 * @author André Timermann <andre@timermann.com.br>
 *
 */
import program from 'commander'
import { basename, join } from 'path'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import changeCase from 'change-case'
import { findRootPath, render, validateProject } from './library/tool.mjs'
import { __dirname, loadJson } from '@agtm/utils'

import moment from 'moment'

moment.locale('pt-br')
const DIRNAME = __dirname(import.meta.url)

;(async () => {
  try {

    program
      .description('Cria um novo app com os arquivos necessários utilizando o Sindri Framework.')
      .parse(process.argv)

    const templateAppPath = join(DIRNAME, './template', 'app')
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
    const controllerFileName = changeCase.paramCase(answers.controller) + '.mjs'

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
      join(appPath, 'controllers', '__controller_template.mjs'),
      join(appPath, 'controllers', controllerFileName)
    )

    /// /////////////////////////////////////////////////////////
    // Altera Arquivos
    /// /////////////////////////////////////////////////////////
    console.log('Processando arquivos...')
    const packageJson = await loadJson(join(rootPath, 'package.json'))

    /// /// controllerFileName //////
    await render(join(srcPath, 'apps', answers.app, 'controllers', controllerFileName), {
      CREATED_DATE: moment().format('L'),
      APP: answers.app.replace(/-/g, '_'),
      AUTHOR: packageJson.author,
      CONTROLLER_FILE_NAME: controllerFileName,
      CONTROLLER_ROUTE_NAME: changeCase.paramCase(answers.controller),
      CONTROLLER_NAME: changeCase.pascalCase(answers.controller)
    })

    console.log('\n------------------------------------')
    console.log('App criado com sucesso!')
    console.log('\nPara testar, execute o script: \n\t"npm run install-assets"')
    console.log('\nEm seguida:\n\t "npm run dev"')
    console.log('------------------------------------\n\n')
  } catch (e) {
    console.error(e.stack)
    process.exit()
  }
})()
