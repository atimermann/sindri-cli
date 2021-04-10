#!/usr/bin/env node
/**
 * Created on 06/12/18
 *
 * bin/sindri-build.js
 *
 * @author André Timermann <andre.timermann@smarti.io>
 *
 * Gera um binário da aplicação no diretório "build"
 *
 * Para mais informações pkg -h se necessário adicionar novas customizações do comando
 *
 */

import program from 'commander'
import { spawn } from 'child_process'
import { join } from 'path'
import { findRootPath, validateProject } from './library/tool.mjs'

/// /////////////////////////////////////////////////////////////////////

program
  .description('Gera um binário da aplicação no diretório "build".')
  .option('-t, --targets [targets]', 'Add the specified type of cheese [marble]', undefined)

program.on('--help', function () {
  console.log('')
  console.log('Examples:')
  console.log('  – Makes executable for particular target machine\n')
  console.log('      $ pkg -t node6-alpine-x64 index.js\\n\')')

  console.log()
})

program.parse(process.argv)

/// /////////////////////////////////////////////////////////////////////

;(async () => {
  try {
    const rootPath = await findRootPath()
    const srcPath = join(rootPath, 'src')
    await validateProject(srcPath)

    if (program.targets === undefined) {
      console.error('Use the command "npm run build" for default target')
      process.exit()
    }

    const hdle = spawn('npx', ['pkg', '-t', program.targets, '--out-path', 'build', rootPath])

    hdle.stdout.on('data', data => console.log(data.toString()))
    hdle.stderr.on('data', data => console.error(data.toString()))

    hdle.on('close', code => {
      if (code === 0) {
        console.log('\n------------------------------------')
        console.log(`Binário gerado com sucesso em:\n\t./build/${require(join(rootPath, 'package.json')).name}`)
        console.log('------------------------------------\n\n')
      } else {
        console.log(`child process exited with code ${code}`)
      }
    })
  } catch (e) {
    console.error(e.stackTrace)
    process.exit()
  }
})()
