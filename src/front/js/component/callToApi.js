
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

export const updateGroup = async (groupId, updatedData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(urlBackend + "/group/update/" + groupId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
            throw new Error("Failed to update group");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating group:", error);
        throw error;
    }
};

export const createGroup = async (groupName, groupMembers) => {
    console.log('Creating group with:', {
        group_name: groupName, 
        members: groupMembers, 
    });

    try {
        const response = await fetch(`${urlBackend}/group/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                group_name: groupName, 
                members: groupMembers,  
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error response from API:', data);
            throw new Error(data.error || "Failed to create group");
        }

        console.log("Group created successfully:", data);
        return data;

    } catch (error) {
        console.error("Error creating group:", error.message);
        throw new Error(error.message || "An unexpected error occurred");
    }
};




export const getGroupDebts = async (setGroupDebts, groupId) => {
    try {
      const response = await fetch(urlBackend+"/group/group_debts/"+groupId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      setGroupDebts(data);
      console.log(data)

    } catch (error) {
      console.log(error);
    }
  };
  

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


  
export const getObjectiveContributions = async (setObjectiveContributions, objectiveId) => {
    try {
        const response = await fetch(urlBackend + "/objective/contribution/" + objectiveId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        setObjectiveContributions(data);
        console.log(data);

    } catch (error) {
        console.log(error);
    }
  };
  

  export const updateObjective = async (objectiveId, updatedData) => {
    try {
      const response = await fetch(urlBackend + "/objective/update/" + objectiveId, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update objective");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating objective:", error);
      throw error;
    }
  };


  export const createObjective = async (objectiveName, objectiveTargetAmount, objectiveMembers) => {
    console.log('Creating objective with:', {
        objectiveName,
        objectiveTargetAmount,
        objectiveMembers,
    });

    try {
        const response = await fetch(urlBackend + "/objective/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: objectiveName,
                target_amount: objectiveTargetAmount,
                members: objectiveMembers,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create objective");
        }

        const data = await response.json();
        console.log("Objective created:", data);
        return data;
    } catch (error) {
        console.error("Error creating objective:", error);
        throw error;
    }
};




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

export const sendMessage = async (sent_to_user_id, message, from_user_id) => {
    try {
      const response = await fetch(urlBackend + "/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token") 
        },
        body: JSON.stringify({ sent_to_user_id, message, from_user_id })
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      return { error: "Something went wrong" };
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


export const submitFeedback = async (email, message) => {
    try {
        const response = await fetch(urlBackend+ "/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, message })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return { error: "Something went wrong" };
    }
};

export const updateUser = async (updatedData, token) => {
    try {
        const response = await fetch(urlBackend + "/user/update", {  
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(updatedData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        return { error: "Something went wrong" };
    }
};

export const signUpUser = async (name, email, password) => {
    try {
        const response = await fetch(urlBackend+"/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error signing up:", error);
        return { error: "Something went wrong" };
    }
};

