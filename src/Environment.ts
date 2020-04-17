import axios from 'axios'

export const production = () => {
    return window.location.port !== '3000'
}

export const configure = () => {
    axios.defaults.baseURL = backend()
    console.log('base', axios.defaults.baseURL)
}

const backend = () => {
    return production() ?
        '/backend' : 'http://localhost:8081'
}
