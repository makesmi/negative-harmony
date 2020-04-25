import axios from 'axios'

export const production = () => {
    return !development()
}

export const development = () => {
    return window.location.port === '3000'
}

export const configure = () => {
    axios.defaults.baseURL = backend()
}

const backend = () => {
    return production() ?
        '/backend' : 'http://localhost:8086'
}
