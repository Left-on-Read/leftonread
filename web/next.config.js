const withImages = require('next-images')

module.exports = {
  ...withImages,
  images: {
    disableStaticImages: true,
  },
  async redirects() {
    return [
      {
        source: '/download',
        destination: '/?ref=download',
        permanent: false,
      },
      {
        source: '/wrapped',
        destination: '/?ref=wrapped',
        permanent: false,
      },
    ]
  },
}
