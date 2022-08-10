export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'polska web_client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "" }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/logo.png' }
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
    '@/assets/styles/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/infinite-loading.js', ssr: false},
    {src: '~/plugins/masonry', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    'nuxt-fontawesome',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },

  env: {
    mediaRoot: process.env.MEDIA_ROOT || 'https://d2ftcjbc5xnow6.cloudfront.net',
    apiRoot: 'https://gagtqlvh3hhhgxtzaqwr2o52jq0vwhpl.lambda-url.eu-central-1.on.aws',
  },

  googleAnalytics: {
    id: 'UA-104928215-4',
    dev: false,
  },

  fontawesome: {
    component: 'fa', 
    imports: [
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['faTwitter', 'faFacebook', 'faInstagram']
      },
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['faPlay', 'faPause', 'faEllipsisH', 'faShare', 'faBug', 'faClipboard', 'faSpinner', 'faExclamation', 'faImage']
      },
    ]
  }
}
