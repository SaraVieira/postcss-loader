'use strict'

const path = require("path");

const loaderUtils = require("loader-utils");

const postcss = require("postcss");
const smartImport = require("postcss-smart-import");
const cssnext = require("postcss-cssnext");

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

  let nextoptions = { warnForDuplicates: false };

  if (config.cssnext) {
    Object.keys(config.cssnext).forEach((key) => {
      nextoptions[key] = config.cssnext[key];
    });
  }

  const plugins = [smartImport(), cssnext(nextoptions)];

  if (config.plugins) {
    config.plugins.map((plugin) => plugins.push(plugin()));
  }

  if (config.min) {
    plugins.push(require("cssnano")());
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
  });
};
