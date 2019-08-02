const path = require('path');

module.exports = {
    entry: "./main.tsx",
    output: {
        filename: "cbundle.js",
        path: path.resolve("../../dist")
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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
            { 
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: "file-loader?name=/public/icons/[name].[ext]"
            }
        ]
    },
};