var webpack = require("webpack");

module.exports = {
    entry: "./src/portage.js",
    module: {
        loaders: [{
            test: /src\/.+\.js$/,
            loader: 'babel'
        }]
    },
    output: {
        filename: "dist/portage.js",
        library: "portage",
        libraryTarget: "umd"
    },
    externals: [{
        lodash: {
          root: '_',
          commonjs2: 'lodash',
          commonjs: 'lodash',
          amd: 'lodash'
        },
        fuzzytree: {
          root: 'FuzzyTree',
          commonjs2: 'fuzzytree',
          commonjs: 'fuzzytree',
          amd: 'fuzzytree'
        }
    }],
    plugins: [
        new webpack.SourceMapDevToolPlugin(
            '[file].map', null, "../[resource-path]", "../[resource-path]")
    ]
}
