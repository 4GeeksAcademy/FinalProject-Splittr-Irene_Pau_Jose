
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

export const mapSharedObjective = async (setSharedObjective, userid ) => {

    try {
        const response = await fetch(urlBackend+"/objective/user/" + userid, {
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
        const response = await fetch(urlBackend+"/objective/" + objectiveid, {
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

export const getInfoConversation= async (setConversation, otheruserid) => {

    try {
        const response = await fetch(urlBackend+"/message/conversation/" + otheruserid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            ,})
        const data = await response.json()
        setConversation(data)
        
    } catch (error) {
        console.log(error);
        
    }
};


export const mapTransactions = async (setTransactions) => {
    try {
        const response = await fetch(urlBackend + "/transaction/user/" , {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log("Full transaction data received:", JSON.stringify(data));
        setTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};