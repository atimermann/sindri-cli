/**
 * **Created on 11/12/18**
 *
 * library/tool.js
 * @author André Timermann <andre.timermann@smarti.io>
 *
 *   Conjunto de funções auxiliares
 *
 */
'use strict'
process.env.SUPPRESS_NO_CONFIG_WARNING = true
process.env.LOGGER_CONSOLE_ENABLED = false

const SubClassOf = require('subclassof')
const Application = require('sindri-framework/application')
const { join, dirname } = require('path')
const fs = require('fs-extra')
const packageJsonFinder = require('find-package-json')

module.exports = {

  /**
   * Procura pela raiz do projeto, procurando pelo pacjage.json
   * @returns {Promise<string>}
   */
  async findRootPath () {
    try {
      return dirname(
        await packageJsonFinder(process.cwd())
          .next()
          .filename
      )
    } catch (err) {
      throw new Error('Invalid Project: Could not find project root directory (where package.json is).')
    }
  },

  /**
   * Valida se o projeto no diretório especificado é válido
   *
   * @param srcPath {string}  Diretório raiz do projeto (onde se encontra o package.json)
   *
   * @returns {boolean}
   */
  async validateProject (srcPath) {
    const mainFilePath = join(srcPath, 'main.js')

    // Valida se src/main.js existe
    if (!await fs.pathExists(mainFilePath)) throw new Error('Invalid project: main.js file does not exist')

    const project = require(mainFilePath)

    if (SubClassOf(project.constructor, Application, true)) {
      if (project.name !== undefined &&
        project.path !== undefined &&
        project.applications !== undefined &&
        project.options !== undefined &&
        project.id !== undefined) {
      } else {
        throw new Error('Invalid project: Check if main.js is returning instance of sindri-framework/instance')
      }
    } else {
      throw new Error('Invalid project: Project must be instance of sindri-framework/application')
    }
  },

  /**
   * Abre um arquivo template, altera variaveis e salva novamente
   *
   * @param file    {string}  Arquivo à ser editado
   * @param locals  {object}  Dicionario com a lista de bustituição
   *
   * @returns {Promise<void>}
   */
  async render (file, locals) {
    let content = (await fs.readFile(file)).toString()

    for (const [key, value] of Object.entries(locals)) {
      content = content.split(`{{${key}}}`).join(value)
    }

    await fs.writeFile(file, content)
  }

}
