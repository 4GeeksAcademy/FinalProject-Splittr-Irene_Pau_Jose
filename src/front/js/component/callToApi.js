
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
        const response = await fetch(urlBackend+"group/"+ groupid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }, 
        })
        const data = await response.json()
        setSingleGroupInfo(data)
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
        console.log(data);
    } catch (error) {
        console.log(error);
        
    }
    
}


export const mapContacts = async (setContacts, userid) => {
    try {
        const response = await fetch(urlBackend+"/user_contacts/" + userid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        })
        const data = await response.json()
        setContacts(data);
        console.log(data);
        
    } catch (error) {
        console.log(error);
    }
};
    
export const getContactInfo = async (setSingleContactInfo, contactId) => {
    try {
        const response = await fetch(urlBackend + "/singlecontact/"+ contactId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        setSingleContactInfo(data);
            console.log(data);
    } catch (error) {
        console.log(error);
    }
};



export const deleteContact = async (userId, contactId, isActive) => {
    try {
        const response = await fetch(`${urlBackend}/user_contacts/${contactId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_active: isActive }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "An error occurred");
        }

        const data = await response.json();
        console.log(data.msg); 
        return data; 

    } catch (error) {
        console.error("Error updating contact status:", error);
        throw error;
    }
};

    
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
};
