const isProd = process.env.NODE_ENV === 'production'

const config = {
    isProd,
    serverUrlPrefix: isProd ? 'https://wd12.cloud-workshop.online/api' : 'http://localhost:1337/api'
}

export default config;