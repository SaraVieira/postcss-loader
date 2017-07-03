'use strict'

const path = require("path");

const loaderUtils = require("loader-utils");

const postcss = require("postcss");
const smartImport = require("postcss-smart-import");
const cssnext = require("postcss-cssnext");
const postcssImageSet = require('postcss-image-set-polyfill');
const cssNano = require("cssnano");
const stylelint = require("stylelint");
const reporter = require("postcss-reporter");

module.exports = function loader (css, map) {
  const cb = this.async();
  const file = this.resourcePath;
  let config = loaderUtils.getOptions(this) || {};
  let options = Object.assign(
    {
      to: file,
      from: file,
      map: config.sourceMap
        ? config.sourceMap === "inline"
          ? { inline: true, annotation: false }
          : { inline: false, annotation: false }
        : false
    },
    config
  );

  let nextoptions = {};

  if (config.cssnext) {
    Object.keys(config.cssnext).forEach((key) => {
      nextoptions[key] = config.cssnext[key];
    });
  }

  const plugins = [smartImport(), postcssImageSet(), cssnext(nextoptions)];

  if (config.plugins) {
    config.plugins.map((plugin) => plugins.push(plugin()));
  }

  if (config.min) {
    plugins.push(cssNano());
  }

  if (config.lint) {
    plugins.push(stylelint({ configFile: config.lintFile || path.resolve('.stylelintrc') }));
    plugins.push(reporter({ clearMessages: true }))
  }

  return postcss(plugins).process(css, options).then((result) => {
    result.warnings().forEach((msg) => this.emitWarning(msg.toString()));

    result.messages.forEach((msg) => {
      if (msg.type === "dependency") this.addDependency(msg.file);
    });

    css = result.css;
    map = result.map ? result.map.toJSON() : null;

    if (map) {
      map.file = path.resolve(map.file);
      map.sources = map.sources.map((src) => path.resolve(src));
    }

    if (this.loaderIndex === 0) {
      return cb(null, `module.exports = ${JSON.stringify(css)}`, map);
    }
    return cb(null, css, map);
  }).catch((err) => console.error(err.stack)); // eslint-disable-line no-console
};
