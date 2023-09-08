const {join} = require('path');

module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join('/tmp', '.cache', 'puppeteer'),
};
