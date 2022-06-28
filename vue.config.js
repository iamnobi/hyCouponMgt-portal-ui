module.exports = {
  publicPath: '',
  devServer: {
    // when in mock mode, change the proxy to local express server.
    //proxy: 'http://ds-portal-itmx.tsaipowu.com/'
    proxy: 'http://localhost:8008/'
  },
  css: {
    extract: {
      filename: 'css/[name].css',
      chunkFilename: 'css/style.[chunkhash:8].css',
      sourceMap: false
    },
    // scss變數無法在main.scss中引用，因此在這邊餵給所有.vue檔
    loaderOptions: {
      sass: {
        data: '@import "@/style/theme.scss";'
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(CAB)$/i,
          use: [
            { loader: 'file-loader', options: { name: '[path][name].[ext]' } }
          ]
        },
        // Note: 為支援published前未做transpile處理，而無法支援IE11的node module(ex:vue-json-compare)
        {
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/view.[chunkhash:8].js'
    }
  },
  productionSourceMap: false
};
