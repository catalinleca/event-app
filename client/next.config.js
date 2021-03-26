// next will be executed with some webpack config
// in stead of watching for file changes in an automated fashion
// pull all changes once every 300 ms

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
