const path = require('path');
const nodeExternals = require('webpack-node-externals');
const fs = require("fs");

var nodeModules = {};

// hack to get socket io working
fs.readdirSync('../../node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
    target: "node",
    entry: "./app.ts",
    mode: "production",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname)
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader" 
            },
        ]
    },
    node: {
        net: "empty",
    },
    externals: [nodeModules, nodeExternals()]
};