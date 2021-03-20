const path = require("path");

module.exports={
    mode: process.env.NODE_ENV || "development",
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"index.dist.js",
        library:"treeObjectUtils",
        libraryTarget:"umd"
    },
    module: {
      rules: [{
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      }]
    },
}