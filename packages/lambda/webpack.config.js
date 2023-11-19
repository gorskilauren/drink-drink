const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
target: 'node',
mode: 'development',
entry: './src/lambda.ts',
output: {
path: path.resolve(__dirname, 'dist'),
filename: 'lambda.js',
libraryTarget: 'commonjs'
},
plugins: [
    new CopyPlugin({
        patterns: [
            { from: './src/public', to: './public' },
            // Add more patterns if needed for specific files or folders
        ],
    })
],
resolve: {
extensions: [".webpack.js", ".ts", ".js"],
modules: ["node_modules", `${__dirname}/node_modules`]
},
module: {
rules: [
{test: /\.ts?$/, loader: "ts-loader"}
]
}
};