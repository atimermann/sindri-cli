/**
 * **Created on 09/04/2021**
 *
 * <File Reference Aqui: util.js>
 * @author André Timermann <andre@timermann.com.br>
 *
 */
'use strict'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { readFile } from 'fs/promises'

export function __dirname (importMetaURL) {
  return dirname(fileURLToPath(importMetaURL))
}

export async function loadJson (path) {
  return JSON.parse(await readFile(path))
}
