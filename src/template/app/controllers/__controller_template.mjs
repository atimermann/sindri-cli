/**
 * **Created on {{CREATED_DATE}}**
 *
 * apps/{{APP}}/controllers/{{CONTROLLER_FILE_NAME}}
 * @author {{AUTHOR}}
 *
 */
import { Controller, logger, config } from '@agtm/sindri-framework'

export default class {{CONTROLLER_NAME}}Controller extends Controller {
  /**
   * Inicialização
   */

  setup () {
    logger.info(`App "{{APP}}" Controller "{{CONTROLLER_FILE_NAME}}" OK. Port: ${config('server.port')}`)
  }

  /**
   * Configuração de Rotas
   */
  routes () {
    this.get('/{{CONTROLLER_NAME}}', async (request, response) => {
      response
        .status(200)
        .send('OK')
    })
  }
}

