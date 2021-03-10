module.exports = {
  images: {
    domains: ['images.ctfassets.net', 'api.contentful.com']
  },
  webpack: (config, { dev, isServer }) => {
    // if (isServer) {
    //   require('./scripts/generate-sitemap')
    // }
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat'
      })
    }

    return config
  }
}
