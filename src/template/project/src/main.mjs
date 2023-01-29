/**
 * **Created on {{CREATED_DATE}}**
 *
 * {{MAIN}}
 * @author {{AUTHOR}}
 *
 * {{DESCRIPTION}}
 *
 */
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Application } from '@agtm/sindri-framework'

const __dirname = dirname(fileURLToPath(import.meta.url))
const {{NAME}} = new Application(__dirname, '{{NAME}}')

export default {{NAME}}
