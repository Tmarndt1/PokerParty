const path = require('path');

module.exports = {
    entry: "./src/main.tsx",
    output: {
        filename: "main.js",
        path: path.resolve("./dist")
    },

    mode: "production",
    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {
                        attrs: [
                            ":data-src"
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpe|jpg|woff|woff2|eot|ttf|svg|gif)(\?.*$|$)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                        }
                    }
                ]
            }
        ]
    },
};