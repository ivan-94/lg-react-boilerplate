const path = require('path');
const express = require('express')
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

// Dev middleware
const addDevMiddlewares = (app, {
  wpDevMiddleware,
  wpHotMiddleware,
  webpackConfig,
  html5Fallback,
  beforeHtml5Fallback,
}) => {
  const outputPath = webpackConfig.output.path || path.resolve(process.cwd(), 'build');
  app.use(wpDevMiddleware);
  app.use(wpHotMiddleware);

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = wpDevMiddleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '');
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  if (beforeHtml5Fallback) beforeHtml5Fallback()

  if (html5Fallback) {
    app.get('*', (req, res) => {
      fs.readFile(path.resolve(outputPath, 'index.html'), (err, file) => {
        if (err) {
          res.sendStatus(404);
        } else {
          res.send(file.toString());
        }
      });
    });
  }
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const { webpackConfig, html5Fallback, beforeHtml5Fallback } = options
  const publicPath = webpackConfig.output.publicPath || '/';
  const outputPath = webpackConfig.output.Path || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  if (beforeHtml5Fallback) beforeHtml5Fallback()

  // HTML fallback
  if (html5Fallback) {
    app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
  }
};

/**
 * Front-end middleware
 */
module.exports = (app, options: {
  wpDevMiddleware?: Function,
  wpHotMiddleware?: Function,
  webpackConfig: Object,
  html5Fallback?: boolean,
  beforeHtml5Fallback?: Function,
}) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    addProdMiddlewares(app, options)
  } else {
    addDevMiddlewares(app, options)
  }

  return app;
};
