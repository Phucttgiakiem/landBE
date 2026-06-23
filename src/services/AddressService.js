
const getProvinces = async () => {
    try {
        const response = await fetch("https://production.cas.so/address-kit/2025-07-01/provinces");

        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch(e){
        throw e;
    }
}
const getCommune = async (codeProvince) => {
    try {
        const response = await fetch(`https://production.cas.so/address-kit/2025-07-01/provinces/${codeProvince}/communes`);
        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch(e){
        throw e;
    }
}
module.exports = {
    getProvinces,
    getCommune,
}