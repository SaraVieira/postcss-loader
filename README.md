<div align="center">
  <img hspace="10"
    alt="Skyva Logo"
    src="http://i.imgur.com/i9ZwJlR.png">
  <h1>Skyva Loader</h1>
  <h2>A postCSS loader with awesome presets to help you write future proof CSS</h2>
</div>

<h2 align="center">Install</h2>

```bash
yarn add skyva-loader --dev
```

```bash
npm install skyva-loader --save-dev
```

<h2 align="center">Why?</h2>

Over time I started to realize I always used the same plugins for all projects and I just kept copying configs from one side to the other so I decided to automate this and create a loader for the plugins and options I use and help me write future proof CSS.

Any other options or plugins would be awesome !

<h2 align="center">Included Plugins</h2>

* [cssnext](http://cssnext.io/)
* [postcss-smart-import](https://github.com/sebastian-software/postcss-smart-import)
* [cssnano](http://cssnano.co/)
* [postcss-image-set-polyfill](https://github.com/SuperOl3g/postcss-image-set-polyfill)

<h2 align="center">Usage</h2>

### `Add`

[![Greenkeeper badge](https://badges.greenkeeper.io/SaraVieira/skyva-loader.svg)](https://greenkeeper.io/)

**webpack.config.js**
```js
{
  test: /\.(css)$/,
  include: [
    path.resolve(__dirname, 'src/components'),
  ],
  use: [
    {
      loader: 'css-loader'
    },
    {
      loader: 'skyva-loader',
    },
  ]
},
```

### `Options`

  * min: Adds cssnano to the build,
  * plugins: An array of plugins you would like to add
  * cssnext: Options to pass to cssnext

  **webpack.config.js**
  ```js
  const writeSVG = require('postcss-write-svg');
  ...
  {
    test: /\.(css)$/,
    include: [
      path.resolve(__dirname, 'src/components'),
    ],
    use: [
      {
        loader: 'css-loader'
      },
      {
        loader: 'skyva-loader',
        options: {
          min: true,
          plugins: [writeSVG],
          cssnext: {
            applyRule: false,
          },
        },
      },
    ]
  },
