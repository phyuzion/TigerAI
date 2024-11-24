const path = require('path');

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './extension.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        vscode: 'commonjs vscode',
        fs: 'commonjs fs', // Node.js 기본 모듈 처리
        path: 'commonjs path', // Node.js 기본 모듈 처리
    },
    resolve: {
        extensions: ['.js']
    }
};
