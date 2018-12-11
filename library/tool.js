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
const path = require('path')
const fs = require('fs-extra')

module.exports = {

  /**
   * Valida se o projeto no diretório especificado é válido
   *
   * @param directory {string}  Caminho do diretório
   *
   * @returns {boolean}
   */
  validateProject(directory) {

    try {

      let project = require(path.join(directory, 'main'))

      if (SubClassOf(project.constructor, Application, true)) {

        if (project.name !== undefined
          && project.path !== undefined
          && project.applications !== undefined
          && project.options !== undefined
          && project.id !== undefined) {

          return true
        }

      }

      return false

    } catch (e) {

      return false
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
  async render(file, locals) {


    let content = (await fs.readFile(file)).toString()

    for (let [key, value] of Object.entries(locals)) {
      content = content.split(`{{${key}}}`).join(value)
    }

    await fs.writeFile(file, content)

  }

}