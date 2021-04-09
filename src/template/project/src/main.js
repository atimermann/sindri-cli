/**
 * **Created on {{CREATED_DATE}}**
 *
 * {{MAIN}}
 * @author {{AUTHOR}}
 *
 * {{DESCRIPTION}}
 *
 */
'use strict'

const Application = require('sindri-framework/application')
const Server = require('sindri-framework/server')

let {{NAME}} = new Application(__dirname, '{{NAME}}')

if (require.main === module) {
  // Inicializa Servidor
  Server.init({{NAME}})
} else {
  module.exports = {{NAME}}
}
