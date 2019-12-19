export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/tailwind.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/apollo',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    optionsPath: './vuetify.options.js',
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.APOLLO_HTTP || 'http://localhost:4000',
        wsEndpoint: process.env.APOLLO_WS || 'ws://localhost:4000',
      },
    },
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'tailwindcss': {},
        'autoprefixer': {},
        ...(process.env.NODE_ENV === 'production'
        ? {'@fullhuman/postcss-purgecss': {
          content: [
            path.join(__dirname, './pages/**/*.vue'),
            path.join(__dirname, './layouts/**/*.vue'),
            path.join(__dirname, './components/**/*.vue')
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          whitelist: ['html', 'body', 'nuxt-progress']
        }} : {})
      },
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
