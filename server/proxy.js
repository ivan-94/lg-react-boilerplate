const chalk = require('chalk')
const httpProxyMiddleware = require('http-proxy-middleware')
const pkg = require('../package.json')
const proxy = pkg.proxy

function onProxyError(proxy) {
  return function(err, req, res){
    let host = req.headers && req.headers.host;
    console.log(
      chalk.red('Proxy error:') + ' Could not proxy request ' + chalk.cyan(req.url) +
      ' from ' + chalk.cyan(host) + ' to ' + chalk.cyan(proxy) + '.'
    );
    console.log(
      'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' +
      chalk.cyan(err.code) + ').'
    );
    console.log();

    // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
    if (res.writeHead && !res.headersSent) {
        res.writeHead(500);
    }
    res.end('Proxy error: Could not proxy request ' + req.url + ' from ' +
      host + ' to ' + proxy + ' (' + err.code + ').'
    );
  }
}

module.exports = function setupProxy (app) {
  if (proxy == null) return
  // There are a few exceptions which we won't send to the proxy:
  // - /index.html (served as HTML5 history API fallback)
  // - /*.hot-update.json (WebpackDevServer uses this too for hot reloading)
  // - /sockjs-node/* (WebpackDevServer uses this for hot reloading)
  // Tip: use https://jex.im/regulex/ to visualize the regex
  let mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/;

  let hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
    target: proxy.config,
    logLevel: 'silent',
    onProxyReq (proxyReq) {
      // Browers may send Origin headers even with same-origin
      // requests. To prevent CORS issues, we have to change
      // the Origin to match the target URL.
      if (proxyReq.getHeader('origin')) {
        proxyReq.setHeader('origin', proxy.config.host);
      }
    },
    onError: onProxyError(proxy),
    secure: false,
    changeOrigin: true,
    ws: true,
    xfwd: true,
  })
  console.log(chalk.green('Proxy') + ':' + JSON.stringify(proxy))
  const path = RegExp(proxy.path)
  app.use(path, hpm);
}
