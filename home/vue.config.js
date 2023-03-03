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
    description: 'BY20XX - Simply create, share and edit goals, no registration required. Try it out, its free!',
    version: 1.0,
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    themeColor: "#42b983",
    msTileColor: "#42b983",

    manifestOptions: {
      description: 'BY20XX - Simply create, share and edit goals, no registration required. Try it out, its free!',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black-translucent',
      themeColor: "#42b983",
      icons: [
        {
          src: '../img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '../img/icons/android-chrome-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '../img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '../img/icons/apple-touch-icon.png',
          type: 'image/png'
        },
        {
          src: 'favicon.ico',
          type: './image/ico'
        },
        {
          src: '../img/icons/favicon-16x16.png',
          type: 'image/png'
        },
        {
          src: '../img/icons/favicon-32x32.png',
          type: 'image/png'
        },
        {
          src: '../img/icons/safari-pinned-tab.svg',
          type: 'image/svg'
        },
        {
          src: '../img/icons/mstile-150x150.png',
          type: 'image/png'
        }
      ],
    },
    iconPaths: {
      favicon: 'favicon.ico',
      favicon32: '../img/icons/favicon-32x32.png',
      favicon16: '../img/icons/favicon-16x16.png',
      appleTouchIcon: '../img/icons/apple-touch-icon.png',
      maskIcon: '../img/icons/safari-pinned-tab.svg',
      msTileImage: '../img/icons/mstile-150x150.png',
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
        content: '../img/icons/by20xx.png',
      },
    ]
  },
})
