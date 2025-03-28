
const urlBackend = process.env.BACKEND_URL

export const mapGroups = async (setGroups, userid) => {

    try {
        const response = await fetch(urlBackend + "/group/user/" + userid, {
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


export const getInfoGroup = async (setSingleGroupInfo, groupid) => {
    try {
        const response = await fetch(urlBackend + "/group/" + groupid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en getInfoGroup:", errorData);
            throw new Error(`Error al obtener información del grupo: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSingleGroupInfo(data);
        return data;

    } catch (error) {
        console.error("Error en getInfoGroup:", error);
        throw error;
    }
}

export const getGroupMembers = async (groupId) => {
    try {
        const response = await fetch(urlBackend + "/group/" + groupId, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching group members:", errorData);
            throw new Error(`Error fetching group members: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.members;
    } catch (error) {
        console.error("Error in getGroupMembers:", error);
        throw error;
    }
};

export const getNonGroupMembers = async (setNonMembers, userId, groupId) => {
    try {

        const allContacts = await mapContacts(null, userId);

        if (!Array.isArray(allContacts)) {
            console.error("Error: 'allContacts' no es un array o es null", allContacts);
            return;
        }

        console.log("All contacts:", allContacts);

        const groupMembers = await getGroupMembers(groupId);

        if (!Array.isArray(groupMembers)) {
            console.error("Error: 'groupMembers' no es un array o es null", groupMembers);
            return;
        }

        console.log("Group members:", groupMembers);


        const memberIds = new Set(groupMembers.map(member => member.id));


        const nonMembers = allContacts.filter(contact => contact && !memberIds.has(contact.id));


        setNonMembers(nonMembers);

        console.log("Non-members:", nonMembers);
    } catch (error) {
        console.error("Error in getNonGroupMembers:", error);
    }
};




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


export const addContactToGroup = async (userId, groupId) => {
    try {
        console.log("Datos enviados:", { userId, groupId });
        
        if (!userId || !groupId) {
            throw new Error("userId o groupId faltante");
        }

        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token no encontrado");
        }

        const response = await fetch(urlBackend + "/group_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                group_id: groupId
            })
        });

        console.log("Respuesta del servidor:", response);
        const data = await response.json();
        console.log("Datos recibidos:", data);
        return data;

    } catch (error) {
        console.error("Error agregando contacto al grupo:", error);
        throw error;
    }
};



export const removeUserFromGroup = async (userId, groupId) => {
    try {


        const token = localStorage.getItem("token");
        const response = await fetch(urlBackend + "/group_user/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                group_id: groupId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error details:", errorText);
            throw new Error(`Failed to remove user from group: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error removing user from group:", error);
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
        const response = await fetch(urlBackend + "/group/group_debts/" + groupId, {
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


export const mapSharedObjective = async (setSharedObjective, userid) => {

    try {
        const response = await fetch(urlBackend + "/objective/user/" + userid, {
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
        const response = await fetch(urlBackend + "/objective/" + objectiveid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
            ,
        })
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

        const contributions = Array.isArray(data) ? data : [];

        setObjectiveContributions(contributions);
        console.log(contributions);

    } catch (error) {
        console.log(error);

        setObjectiveContributions([]);
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
        const response = await fetch(urlBackend + "/user_contacts/" + userid, {
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

export const addUserContactByEmail = async (contactEmail) => {
    try {
        const response = await fetch(urlBackend + "/user_contacts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contact_email: contactEmail })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding contact:", error);
    }
};



export const getContactInfo = async (setSingleContactInfo, contactId) => {
    // Add a check to ensure contactId is valid
    if (!contactId) {
        console.error("No contact ID provided");
        return;
    }

    try {
        const response = await fetch(`${urlBackend}/singlecontact/${contactId}`, {
            method: 'GET', // Explicitly specify GET method
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle non-200 responses
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Additional check to ensure data is valid
        if (data) {
            setSingleContactInfo(data);
            console.log("Contact data:", data);
        } else {
            console.error("No contact data received");
        }
    } catch (error) {
        console.error("Error fetching contact info:", error);
    }
};

export const deleteUserContact = async (contactId) => {
    try {
        const response = await fetch(`${urlBackend}/user_contacts/${contactId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            // If the response is not OK (status is not in 200-299 range)
            const errorData = await response.json();
            throw new Error(errorData.msg || "Failed to delete contact");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error;
    }
};


export const mapMessages = async (setMessages, currentUserId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${urlBackend}/message/user/${currentUserId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch messages');
        }

        const data = await response.json();
        
        // Transform data to include conversation context
        const transformedMessages = data.map(msg => ({
            ...msg,
            conversation_context: `Conversation with ${msg.from_user_id === currentUserId ? msg.to_user_name : msg.from_user_name}`
        }));

        setMessages(transformedMessages);
        return transformedMessages;

    } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
        return []; 
    }
}

export const mapConversations = async (setMappedConversations, userId) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/conversations/mapped/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch mapped conversations');
        }

        const data = await response.json();
        
        // Sort conversations by last message timestamp
        const sortedData = data.map(userConversations => ({
            ...userConversations,
            conversations: userConversations.conversations.sort((a, b) => 
                new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp)
            )
        }));

        setMappedConversations(sortedData);
        return sortedData;

    } catch (error) {
        console.error('Error mapping conversations:', error);
        return null;
    }
};


export const getInfoConversation = async (setConversation, otheruserid) => {
    try {
        const response = await fetch(urlBackend + "/message/conversation/" + otheruserid, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch conversation');
        }

        const data = await response.json()
        setConversation(data)

    } catch (error) {
        console.error("Error fetching conversation:", error);
        setConversation([]);
    }
};


export const sendMessage = async (sent_to_user_id, message) => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Validate input before sending
        if (!sent_to_user_id || !message?.trim()) {
            throw new Error('Recipient and message are required');
        }

        if (isNaN(parseInt(sent_to_user_id))) {
            throw new Error('Invalid recipient ID');
        }

        const response = await fetch(`${urlBackend}/message/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // Use the token we got from localStorage
            },
            body: JSON.stringify({ 
                sent_to_user_id: parseInt(sent_to_user_id), 
                message: message.trim() 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.msg || 'Failed to send message');
        }

        return {
            success: true,
            message: data.message,
            conversation_id: data.conversation_id
        };

    } catch (error) {
        console.error("Error sending message:", error);
        return { 
            success: false,
            error: error.message || "Failed to send message" 
        };
    }
};


export const mapTransactions = async (callback) => {
    try {
        const response = await fetch(urlBackend + "/transaction/user/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        callback({
            sent_payments: data.sent_payments?.map((p) => ({
                ...p,
                amount: Number(p.amount) || 0,
                payer_id: String(p.payer_id || ""),
                receiver_id: String(p.receiver_id || ""),
                payed_at: p.payed_at, // Ensure this field is included
            })) || [],
            received_payments: data.received_payments?.map((p) => ({
                ...p,
                amount: Number(p.amount) || 0,
                payer_id: String(p.payer_id || ""),
                receiver_id: String(p.receiver_id || ""),
                payed_at: p.payed_at, // Ensure this field is included
            })) || [],
            group_payments: data.group_payments?.map((gp) => ({
                ...gp,
                amount: Number(gp.amount) || 0,
                payer_id: String(gp.payer_id || ""),
                receiver_id: String(gp.receiver_id || ""),
                payed_at: gp.payed_at, // Ensure this field is included
            })) || [],
            objective_contributions: data.user_contributions?.map((oc) => ({
                ...oc,
                amount_contributed: Number(oc.amount_contributed) || 0,
                user_id: String(oc.user_id || ""),
                objective_id: String(oc.objective_id || ""),
                contributed_at: oc.contributed_at, // Ensure this field is included
            })) || [],
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        callback({
            sent_payments: [],
            received_payments: [],
            group_payments: [],
            objective_contributions: [],
        });
    }
};




export const submitFeedback = async (email, message) => {
    try {
        const response = await fetch(urlBackend + "/feedback", {
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
        const response = await fetch(urlBackend + "/signup", {
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


export const fetchUserInfo = async (user_id) => {
    try {
        const response = await fetch(urlBackend + "/user/" + user_id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};


export const makeObjectiveContribution = async (objectiveId, amount) => {
    const user_id = sessionStorage.getItem("user_id")

    try {
        const parsedAmount = parseFloat(amount);

        const response = await fetch(`${urlBackend}/objective/${objectiveId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            }
        });

        const objectiveData = await response.json();
        const remainingAmount = objectiveData.remaining_amount || 0;

        if (parsedAmount > remainingAmount) {
            alert(`Your contribution of €${parsedAmount.toFixed(2)} exceeds the remaining amount of €${remainingAmount.toFixed(2)}. 
Please reduce your contribution.`);
            return {
                success: false,
                message: "Contribution exceeds remaining amount"
            };
        }

        const contributionResponse = await fetch(`${urlBackend}/objective/contribution`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                objective: objectiveId,
                amount: parsedAmount,
                user: user_id
            })
        });

        const contributionData = await contributionResponse.json();

        if (!contributionResponse.ok) {
            return {
                success: false,
                message: contributionData.error || 'Failed to make contribution'
            };
        }

        window.location.reload();
        return {
            success: true,
            message: contributionData.msg
        };

    } catch (error) {
        console.error('Contribution Error:', error);
        return {
            success: false,
            message: error.message
        };
    }
};


export const createPayment = async (amount, user_id, contactid, debt_id = null) => {
    try {
        const payload = {
            amount: parseFloat(amount),
            payer_id: user_id,
            receiver_id: contactid
        };

        // Add debt_id to payload if provided
        if (debt_id) {
            payload.debt_id = debt_id;
        }

        const response = await fetch(`${urlBackend}/payment/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Payment creation failed');
        }

        return data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};


export const deleteObjective = async (objectiveId) => {
    try {
        const response = await fetch(urlBackend + "/objective/delete/" + objectiveId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete objective');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting objective:", error);
        throw error;
    }
};