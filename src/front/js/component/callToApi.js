
const urlBackend = process.env.BACKEND_URL

export const mapGroups = async (setGroups, userid) => {

    try {
        const response = await fetch(urlBackend+"/group/user/" + userid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        })
        const data = await response.json()
        setGroups(data)

    } catch (error) {
        console.log(error);
        
    }
    
}

//Global groups fetch


export const getInfoGroup = async ( setSingleGroupInfo, groupid ) => {

    try {
        const response = await fetch(urlBackend+"/group/"+ groupid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }, 
        })
        const data = await response.json()
        setSingleGroupInfo(data)
        console.log(data);
        
    } catch (error) {
        console.log(error);
    }
}

export const mapSharedObjective = async (setSharedObjective) => {

    try {
        const response = await fetch(urlBackend+"objective", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
    })
        const data = await response.json()
        setSharedObjective(data)
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}

export const getInfoSharedObjective = async (setInfoSharedObjective, objectiveid) => {

    try {
        const response = await fetch(urlBackend+"objective/" + objectiveid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            ,})
        const data = await response.json()
        setInfoSharedObjective(data)
        
    } catch (error) {
        console.log(error);
        
    }
    
}


export const mapMessages = async (setMessages, userid) => {

    try {
        const response = await fetch(urlBackend+"/message/user/" + userid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        })
        const data = await response.json()
        setMessages(data)

    } catch (error) {
        console.log(error);
        
    }
    
}

export const getInfoMessage= async (setInfoMessage, messageid) => {

    try {
        const response = await fetch(urlBackend+"message/" + messageid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            ,})
        const data = await response.json()
        setInfoMessage(data)
        console.log(data);
    } catch (error) {
        console.log(error);
        
    }
    
}