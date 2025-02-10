const apiUrlPrefix = process.env.REACT_APP_STATUS === "production" ? process.env.REACT_APP_PRODUCTION_URL : process.env.REACT_APP_DEVELOP_URL

const conf = {
    apiUrlPrefix,
    loginEndpoint: '/auth/local',
    jwtUserEndpoint: '/users/me',
    jwtSessionStorageKey: 'auth.jwt'
}

export default conf;