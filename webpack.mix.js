const mix = require('laravel-mix')
const webpack = require('webpack')
const path = require('path')

class NovaExtension {
  name() {
    return 'nova-extension'
  }

  register(name) {
    this.name = name
  }

  webpackPlugins() {
    return [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),

      new webpack.ProvidePlugin({
        _: 'lodash',
        Errors: 'form-backend-validation',
      }),
    ]
  }

  webpackConfig(webpackConfig) {
    webpackConfig.externals = {
      vue: 'Vue',
    }

    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      'laravel-nova': path.join(
        __dirname,
        './vendor/laravel/nova/resources/js/mixins/packages.js'
      ),
      'leaflet$': path.join(
        __dirname,
        './node_modules/leaflet/dist/leaflet-src.esm.js'
      ),
    }

    webpackConfig.output = {
      ...webpackConfig.output,
      uniqueName: this.name,
    }
  }
}

// Register your extension
mix.extend('nova', new NovaExtension())

mix
  .setPublicPath('dist')
  .js('resources/js/field.js', 'js')
  .vue({ version: 3 })
  .nova('genealabs/nova-map-marker-field') // your Nova package name
  .version()
