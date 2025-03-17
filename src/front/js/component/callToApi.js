
const urlBackend = process.env.BACKEND_URL

export const mapGroups = async (setGroups, userid) => {

    try {
        const response = await fetch(urlBackend+"group/user/" + userid)
        const data = await response.json()
        setGroups(data)

    } catch (error) {
        console.log(error);
        
    }
    
}

//Global groups fetch


export const getInfoGroup = async ( setSingleGroupInfo, groupid ) => {

    try {
        const response = await fetch(urlBackend+"group/"+ groupid)
        const data = await response.json()
        setSingleGroupInfo(data)
    } catch (error) {
        console.log(error);
    }
}

export const mapSharedObjective = async (setSharedObjective) => {

    try {
        const response = await fetch(urlBackend+"objective")
        const data = await response.json()
        setSharedObjective(data)
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}

export const getInfoSharedObjective = async (setInfoSharedObjective, objectiveid) => {

    try {
        const response = await fetch(urlBackend+"objective/" + objectiveid)
        const data = await response.json()
        setInfoSharedObjective(data)
        console.log(data);
    } catch (error) {
        console.log(error);
        
    }
    
}

export const mapContacts = async (setContacts) => {

    try {
        response
    } catch (error) {
        
    }
}