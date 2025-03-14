
const urlBackend = process.env.BACKEND_URL

export const mapGroups = async (setGroups) => {

    try {
        const response = await fetch(urlBackend+"groups")
        const data = await response.json()
        setGroups(data)

    } catch (error) {
        console.log(error);
        
    }
    
}

//Global groups fetch


export const getInfoGroup = async ( setSingleGroupInfo, idgroup ) => {

    try {
        const response = await fetch(urlBackend+"groups/"+ idgroup)
        const data = await response.json()
        setSingleGroupInfo(data)
    } catch (error) {
        console.log(error);
    }
}