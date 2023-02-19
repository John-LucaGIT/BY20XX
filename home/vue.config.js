const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: false
      }
    },
  },
  pwa: {
    // appleMobileWebAppCapable: true,
    name: 'BY20XX',
    version: 1.0,
    appleMobileWebAppCapable: 'yes',
    themeColor: "#42b983",
    msTileColor: "#42b983",
    appleMobileWebAppStatusBarStyle: "#42b983", // set the appleMobileWebAppStatusBarStyle property
    manifestOptions: {
      background_color: "#42b983",
      theme_color: "#42b983", // set the theme_color property
    }
  },
})
