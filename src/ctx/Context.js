/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-lib-ims:Context', { provider: 'debug' })

/**
 * The `Context` abstract class provides an interface to manage the IMS configuration contexts on behalf of
 * the Adobe I/O Lib IMS Library.
 */
class Context {
  constructor (keyNames) {
    this.keyNames = keyNames
  }

  /**
   * Gets the current context name.
   *
   * @returns {Promise<string>} the current context name
   */
  async getCurrent () {
    aioLogger.debug('get current')
    return this.getConfigValue(this.keyNames.CURRENT)
  }

  /**
   * Sets the current context name in the local configuration
   *
   * @param {string} contextName The name of the context to use as the current context
   * @returns {Promise<any>} returns an instance of the Config object
   */
  async setCurrent (contextName) {
    aioLogger.debug('set current=%s', contextName)
    // enforce to local config, current should not conflict with global IMS contexts such as `cli`
    await this.setConfigValue(this.keyNames.CURRENT, contextName, true)
  }

  /**
   * Returns an object representing the named context.
   * If the contextName parameter is empty or missing, it defaults to the
   * current context name. The result is an object with two properties:
   *
   *   - `name`: The actual context name used
   *   - `data`: The IMS context data
   *
   * @param {string} contextName Name of the context information to return.
   * @returns {Promise<object>} The configuration object
   */
  async get (contextName) {
    aioLogger.debug('get(%s)', contextName)

    if (!contextName) {
      contextName = await this.getCurrent()
    }

    if (contextName) {
      return {
        name: contextName,
        data: await this.getContextValue(contextName)
      }
    }

    // missing context and no current context
    return { name: contextName, data: undefined }
  }

  /**
   * Updates the named configuration with new configuration data. If a configuration
   * object for the named context already exists it is completely replaced with this new
   * configuration.
   *
   * @param {string} contextName Name of the context to update
   * @param {object} contextData The configuration data to store for the context
   * @param {boolean} local Persist in local or global configuration. When running in
   *      Adobe I/O Runtime, this has no effect unless `contextData` contains an
   *      `access_token` or `refresh_token` field, in which case setting `local=true` will
   *      prevent the persistence of those fields in the [`State
   *      SDK`](https://github.com/adobe/aio-lib-state). Please note that when calling
   *      `getToken` in an I/O Runtime Action, generated tokens will always be persisted
   *      as `getToken` internally calls `context.set` with `local=false`.
   *
   */
  async set (contextName, contextData, local = false) {
    aioLogger.debug('set(%s, %o)', contextName, contextData, !!local)

    let current
    if (!contextName) {
      current = await this.getCurrent()
      contextName = current
    }
    if (!contextName) {
      throw new Error('Missing IMS context label to set context data for')
    }

    await this.setContextValue(contextName, contextData, !!local)
  }

  /**
   * Returns the names of the configured contexts as an array of strings.
   *
   * @returns {Promise<string[]>} The names of the currently known configurations.
   */
  async keys () {
    aioLogger.debug('keys()')
    return this.contextKeys()
  }

  /**
   * Gets the list of configured token creation plugins. This base
   * implementation returns an empty array. Extensions supporting
   * token creation plugins must override to return the list of
   * plugins which can be require-d.
   *
   * @returns {Promise<string[]>} empty list of token creation plugins
   */
  async getPlugins () {
    aioLogger.debug('getPlugins() (none)')
    return []
  }

  /**
   * Sets the list of configured token creation plugins. This base
   * implementation throws an Error as plugins are not supported.
   * Extensions supporting token creation plugins must override to
   * check and persist the list of plugins which can be require-d.
   *
   * If the plugins parameter is an empty array or null, the current
   * plugins configuration is removed. Otherwise the current
   * configuration is replaced by the new list of plugins.
   *
   * Note, that implementations are only required to validate that
   * the plugins parameter is a possibly empty array of strings or
   * null. Actually provided string values need not be validated.
   *
   * @param {string[]} plugins An array of plugins to configure
   * @param {boolean} [local=false] set to true to save to local config, false for global config
   */
  async setPlugins (plugins, local = false) {
    aioLogger.debug('setPlugins(%o, %b)', plugins, !!local)
    throwNotImplemented()
  }

  /* To be implemented */

  /**
   *
   * @param {string} configName config name
   * @returns {Promise<any>} config value
   * @protected
   * @ignore
   */
  async getConfigValue (configName) {
    throwNotImplemented()
  }

  /**
   * @param {string} configName config name
   * @param {any} configValue config value
   * @param {boolean} isLocal write local or not
   * @protected
   * @ignore
   */
  async setConfigValue (configName, configValue, isLocal) {
    throwNotImplemented()
  }

  /**
   * @param {string} contextName context name
   * @returns {Promise<any>} context value
   * @protected
   * @ignore
   */
  async getContextValue (contextName) {
    throwNotImplemented()
  }

  /**
   * @param {string} contextName config name
   * @param {any} ctxValue config value
   * @param {boolean} isLocal write local or not
   * @protected
   * @ignore
   */
  async setContextValue (contextName, ctxValue, isLocal) {
    throwNotImplemented()
  }

  /**
   * @ignore
   * @protected
   * @returns {Promise<string[]>} return defined contexts
   */
  async contextKeys () {
    throwNotImplemented()
  }
}

/** @private */
function throwNotImplemented () {
  throw new Error('abstract method is not implemented')
}

module.exports = Context
