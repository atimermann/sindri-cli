/**
 * **Created on {{CREATED_DATE}}**
 *
 * apps/{{APP}}/controllers/helloWorld.js
 * @author {{AUTHOR}}
 *
 */
'use strict'


const Controller = require('sindri-framework/controller')
const logger = require('sindri-framework/logger')
const config = require('sindri-framework/config')

class HelloWorldController extends Controller {

  /**
   * Inicialização
   */
  setup() {

    logger.info('Configuring your project...')


  }

  /**
   * Middlware Pré
   */
  pre() {

    // Você pode manipular rotas do controller aqui!!! Pode ser usado para criar uma autenticação prévia
    // Rota pode ser acessado via "this.router"
    // Documentação como utilizar a rota usda no framework aqui:
    //          https://expressjs.com/pt-br/guide/routing.html#express-router
    //          https://expressjs.com/pt-br/guide/using-middleware.html
    // Autenticação:
    //          https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
    //
    // Lembre: utilize por exemplo this.router.use(...) em vez de this.use(...)


  }

  /**
   * Middlware Pós
   */
  pos() {


    setTimeout(() => {
      logger.info(`Seu novo projeto Sindri está online! Acesse pela url: http://localhost:${config.sindri.server.port}`)
    }, 2000)


  }

  /**
   * Configuração de Rotas
   */
  routes() {

    this.get('/', async (request, response) => {

      // partials e cache são atributos especiais que permitem configurar o template
      let renderedPage = await this.view('helloWorld.html', {
        title: 'Hello World - Sindri Framework',
        body: 'Hello World - Sindri Framework <p>',
        partials: {p: 'partial'},
        cache: false
      })

      response
        .status(200)
        .send(renderedPage)

    })

  }
}

module.exports = HelloWorldController
