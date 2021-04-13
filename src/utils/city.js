const CITY_KEY = 'hkzf-city'
export const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY))
export const setCity = (curCity) => {
    localStorage.setItem(CITY_KEY,JSON.stringify(curCity))
}