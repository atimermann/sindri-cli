#!/usr/bin/env node
/**
 * **Created on 06/12/18**
 *
 * bin/sindri-create.js
 *
 * @author André Timermann <andre.timermann@smarti.io>
 *
 *  Cria novo projeto Sindri Framework basado em um template
 *  Importante Manter atualizado sempre que realizar alteração no sindri framework
 *  Manter controle sobre a versão compatível com Sindri Framework, validando.
 *
 */

import program from 'commander'
import fs from 'fs-extra'
import { basename, join } from 'path'
import inquirer from 'inquirer'
import moment from 'moment'
import { render } from './library/tool.mjs'
import { __dirname } from '@agtm/utils'
import semver from 'semver'
import emptyDir from 'empty-dir'

moment.locale('pt-br')

const DIRNAME = __dirname(import.meta.url)
// const INSTALL_DEPENDENCIES_SCRIPT = join(DIRNAME, '../scripts/install_dependencies.sh')

// Atualizar sempre que mudar a versão do node no PKG
// Atualizar versão no pkg no script
// const NPM_BUILD_COMMAND = 'npx pkg -t node14-linux-x64 --out-path build . && (cd build && mkdir -p config) && cp config/default.yaml build/config'

program
  .description('Cria um novo projeto com os arquivos necessários utilizando o Sindri Framework.')
  .parse(process.argv)

;(async () => {
  try {
    const templatePath = join(DIRNAME, './template/project')

    const rootPath = process.cwd()

    // Diretório src para copia dos arquivos
    const srcPath = join(rootPath, 'src')

    if (!rootPath) {
      console.error('Invalid rootPath')
      process.exit()
    }

    /// /////////////////////////////////////////////////////////
    // Valida se diretório está vazio
    /// /////////////////////////////////////////////////////////
    if (!emptyDir.sync(rootPath)) {
      console.warn('ATENÇÃO: Diretório não está vazio')
      if (!(await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        default: false,
        message: 'Continuar?'
      })).confirm) {
        process.exit(1)
      }
    }

    // Traduzir
    const questions = [
      {
        name: 'name',
        message: 'Nome do projeto?',
        default: basename(rootPath),
        validate: input => input.match(/^[a-zA-Z0-9-]+$/) ? true : 'Nome deve contar apenas caracteres simples (a-Z 0-9)'
      },
      {
        name: 'description',
        message: 'Descrição do projeto:',
        validate: input => input !== ''
      },
      {
        name: 'version',
        message: 'Versão',
        default: '0.0.1',
        validate: input => (semver.valid(input) === null) ? 'Versão inválida' : true
      },
      {
        name: 'author',
        message: 'Seu nome:',
        validate: input => input !== ''
      },
      {
        name: 'mail',
        message: 'Informe um e-mail válido',
        validate: input => input.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) ? true : 'Informe um e-mail válido'
      },
      {
        name: 'app',
        message: 'Você precisa criar pelo menos um app para este projeto, selecione um nome:',
        default: basename(rootPath),
        validate: input => input.match(/^[a-zA-Z0-9-]+$/) ? true : 'Nome deve contar apenas caracteres simples (a-Z 0-9)'
      }
      // {
      //   type: 'checkbox',
      //   name: 'apps',
      //   message: 'Selecions os apps que deseja carregar (deve estar instalado via "npm i"):',
      //   choices: ['sindri-admin']
      // },
    ]

    const answers = await inquirer.prompt(questions)

    console.log('Verifique as respostas inseridas:\n')
    for (const [key, value] of Object.entries(answers)) {
      console.log(`  ${key}:  ${value}`)
    }

    if (!(await inquirer.prompt({
      name: 'confirm',
      type: 'confirm',
      default: true,
      message: 'Continuar?'
    })).confirm) {
      process.exit()
    }

    /// /////////////////////////////////////////////////////////
    // Valida NODEJS Version
    // Sempre atualizar com a ultima versão do node disponível no PKG e configurado no sindri-framework
    /// /////////////////////////////////////////////////////////
    console.log(`NodeJs Version: ${process.version}`)

    if (semver.lt(process.version, '12.0.0')) {
      console.error('Required version of nodejs greater than 12.0.0')
      process.exit(2)
    }

    // Verifique ultima versão disponível em ~/.pkg-cache. Teste novas versões
    if (semver.gtr(process.version, '12.2.0')) {
      console.warn('WARN: If you wanted to compile a project using "node-pkg", remember that it will be compiled with the latest version available for "node-pkg", which is currently 12.2.0 LTS')
    }

    /// /////////////////////////////////////////////////////////
    // Copia Template
    /// /////////////////////////////////////////////////////////
    console.log(`Criando projeto em ${rootPath}`)
    await fs.copy(templatePath, rootPath)

    /// /////////////////////////////////////////////////////////
    // Altera Arquivos
    /// /////////////////////////////////////////////////////////

    /// /// package.json //////
    await render(join(rootPath, 'package.json'), {
      PACKAGE_NAME: answers.name,
      PACKAGE_DESCRIPTION: answers.description,
      PACKAGE_AUTHOR: `${answers.author} <${answers.mail}>`,
      PACKAGE_VERSION: answers.version,
      PACKAGE_MAIN: 'src/main.js'
      // PACKAGE_BUILD: NPM_BUILD_COMMAND
    })

    /// /// main.js //////
    await render(join(srcPath, 'main.js'), {
      CREATED_DATE: moment().format('L'),
      NAME: answers.name.replace(/-/g, '_'),
      DESCRIPTION: answers.description,
      AUTHOR: `${answers.author} <${answers.mail}>`,
      MAIN: 'main.js'
    })

    /// /// helloWorld.js //////
    await render(join(srcPath, 'apps', '__app_template', 'controllers', 'helloWorld.js'), {
      CREATED_DATE: moment().format('L'),
      APP: answers.app,
      AUTHOR: `${answers.author} <${answers.mail}>`
    })

    /// /////////////////////////////////////////////////////////
    // Renomeia Diretório app
    /// /////////////////////////////////////////////////////////

    console.log(`Criando app "${answers.app}"`)
    await fs.move(
      join(srcPath, 'apps', '__app_template'),
      join(srcPath, 'apps', answers.app)
    )

    console.log('\n------------------------------------')
    console.log('Projeto criado com sucesso!')
    console.log('\nDigite comando abaixo para configurar o projeto: \n\tnpm run config')
    console.log('\nPara testar, execute o script: \n\tsindri install-assets')
    console.log('\nEm seguida:\n\t npm run dev')
    console.log('\nPara gerar binário:\n\t npm run build')
    console.log('------------------------------------\n\n')

  } catch (e) {
    console.error(e.message)
    console.error(e.stack)
    process.exit()
  }
})()
