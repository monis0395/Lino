/* eslint-disable */
const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    devServer: { contentBase: './dist' },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: { fs: 'empty' },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    }
};