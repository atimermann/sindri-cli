#!/usr/bin/env node
/**
 * **Created on 07/12/18**
 *
 * bin/sindri-create-controller
 * @author André Timermann <andre@timermann.com.br>
 *
 */
import program from 'commander'
import { join } from 'path'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import changeCase from 'change-case'
import { findRootPath, render, validateProject } from './library/tool.mjs'

import moment from 'moment'
import { __dirname, loadJson } from '@agtm/utils'

(async () => {
  try {

    moment.locale('pt-br')

    const DIRNAME = __dirname(import.meta.url)

    program
      .description('Cria um novo controller.')
      .parse(process.argv)

    const templateAppPath = join(DIRNAME, './template', 'app')
    const rootPath = await findRootPath()
    const srcPath = join(rootPath, 'src')
    await validateProject(srcPath)

    /// /////////////////////////////////////////////////////////
    // Valida pasta apps
    /// /////////////////////////////////////////////////////////
    if (!await fs.pathExists(join(srcPath, 'apps'))) {
      console.error('Invalid project, app directory not found!')
      process.exit(1)
    }

    /// /////////////////////////////////////////////////////////
    // Questões
    /// /////////////////////////////////////////////////////////
    // Traduzir
    const questions = [
      {
        name: 'app',
        message: 'Selecione app:',
        type: 'list',
        choices: await fs.readdir(join(srcPath, 'apps'))
      },
      {
        name: 'controller',
        message: 'Nome do controller padrão?',
        default: 'HelloWorld',
        validate: input => input.match(/^[a-zA-Z0-9]+$/) ? true : 'Nome deve contar apenas caracteres simples (a-Z 0-9)'
      }
    ]

    const answers = await inquirer.prompt(questions)

    const appsPath = join(srcPath, 'apps', answers.app)
    const controllerFileName = changeCase.camelCase(answers.controller) + '.mjs'

    /// /////////////////////////////////////////////////////////
    // Valida se diretório existe
    /// /////////////////////////////////////////////////////////
    if (!await fs.pathExists(appsPath)) {
      console.error(`App '${answers.app}' does not exists!`)
      process.exit(1)
    }

    /// /////////////////////////////////////////////////////////
    // Renomeia Diretório app
    /// /////////////////////////////////////////////////////////

    const controllerPath = join(appsPath, 'controllers', controllerFileName)
    if (await fs.pathExists(controllerPath)) {
      const replace = await inquirer.prompt([
        {
          name: 'confirm',
          message: `Controller "${answers.controller}" já existe. Deseja substituir?`,
          type: 'confirm',
          default: false,
          choices: await fs.readdir(join(srcPath, 'apps'))
        }
      ])

      if (!replace.confirm) {
        process.exit()
      }
    }

    console.log(`Criando controller "${answers.controller}"...`)
    await fs.copy(
      join(templateAppPath, 'controllers', '__controller_template.mjs'),
      join(appsPath, 'controllers', controllerFileName)
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
      CONTROLLER_NAME: changeCase.pascalCase(answers.controller)
    })

    console.log('\n------------------------------------')
    console.log('Controller criado com sucesso!')
    console.log('------------------------------------\n')
  } catch (e) {
    console.error(e.message)
    console.error(e.stack)
    process.exit(1)
  }
})()
