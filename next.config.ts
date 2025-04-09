import type { NextConfig } from 'next'

const myArray = (process.env.SOME_ENV_VAR || '').split(',')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    MY_ARRAY: myArray.join(','),
  },
}

export default nextConfig
