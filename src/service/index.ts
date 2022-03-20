import axios from 'axios'

const client = axios.create({
    baseURL: "https://service-dr6kz64k-1302758757.gz.apigw.tencentcs.com/release"
})

export const getData = () => client.get('/api/list').then(res => res.data)