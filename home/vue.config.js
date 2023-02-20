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
    title: 'BY20XX',
    name: 'BY20XX',
    version: 1.0,
    appleMobileWebAppCapable: 'yes',
    themeColor: "#42b983",
    msTileColor: "#42b983",
    appleMobileWebAppStatusBarStyle: "black-translucent", // set the appleMobileWebAppStatusBarStyle property
    manifestOptions: {
      background_color: "#42b983",
      theme_color: "#42b983", // set the theme_color property
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png',

    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/mstile-150x150.png',
    },
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        name: 'description',
        content: 'Simply create, share and edit goals, no registration required.',
      },
      {
        property: 'og:title',
        content: 'BY20XX',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'BY20XX',
      },
      {
        name: 'twitter:description',
        content: 'Simply create, share and edit goals, no registration required. Try it out, its free!',
      },
      {
        name: 'twitter:image',
        content: 'img/icons/by20xx.png',
      },
    ]
  },
})
