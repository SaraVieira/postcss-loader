'use strict'

const path = require('path')

module.exports = (config) => {
  return {
    target: 'node',
    devtool: 'source-map',
    context: path.join(__dirname, 'configs'),
    entry: `./${config.file}.js`,
    output: {
      path: path.join(__dirname, 'builds'),
      filename: `${config.file}.test.js`
    },
    module: {
      rules: [
        {
          test: /\.(css)$/,
          use: [
            {
              loader: path.resolve('./'),
              options: config.options || {}
            }
          ]
        }
      ]
    }
  }
}
