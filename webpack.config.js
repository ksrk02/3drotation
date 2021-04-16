const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    resolve: {
        fallback: { 'crypto': false, 'http': false, 'querystring': false, 'url': false, 'zlib': false, 'path': false, 'stream': false }
    }
};