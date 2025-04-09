const myArray = (process.env.SOME_ENV_VAR || '').split(',')

const nextConfig = {
  reactStrictMode: true,
  env: {
    MY_ARRAY: myArray.join(','),
  },
}

module.exports = nextConfig
