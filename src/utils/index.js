// import axios from 'axios'
import {getCity,setCity} from './city'
import {API} from './api'
const BMap = window.BMap
const getCurrentCity = () => {
    const curCity = getCity()
    if(!curCity) {
        return new Promise (resolve => {
            const myCity = new BMap.localCity()
            myCity.get(async (result) => {
                const cityName = result.name
                const res = await API.get ('/area/info?',{
                  params: {
                    name: cityName
                  }
                })
                const { label, value } = res.data.body
                resolve({label, value})
                setCity({label,value})
              })
        })
    }else {
        return Promise.resolve(curCity)
    }
}
export { getCurrentCity, setCity, getCity}
export {BASE_URL} from './url'
export {API} from './api'