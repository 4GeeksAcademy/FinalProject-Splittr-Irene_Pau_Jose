import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, CardContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import Button from '@material-ui/core/Button';
import { addContactToGroup } from "../../../component/callToApi";

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        width: "100%",
        height: 70,
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing(1),
        backgroundColor: "#2C2F33",
        marginBottom: theme.spacing(1),
        borderRadius: 4,
        transition: 'background-color 0.3s ease',
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    selectedCard: {
        backgroundColor: '#3f51b5',
    },
    name: {
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem',
        },
    },
    initial: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#6c63ff",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        marginRight: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            width: 30,
            height: 30,
            fontSize: '0.8rem',
        },
    },
}));

const AddContactCardInEditGroup = ({ 
    contact, 
    groupId,
    onAddContact,
    isSelected = false
}) => {
    const classes = useStyles();
    const [isAdded, setIsAdded] = useState(isSelected); 

    const handleAddContact = async () => {
        try {
            if (!contact || !contact.user_id) {
                throw new Error("Invalid contact object or missing user_id.");
            }
            if (!groupId) {
                throw new Error("Missing groupId.");
            }

            const result = await addContactToGroup(contact.user_id, groupId);

            if (result.msg === 'User added to group successfully') {
                setIsAdded(true);
                if (onAddContact) {
                    onAddContact(contact);
                }
                alert("Contacto agregado exitosamente al grupo.");
            } else {
                throw new Error(result.msg || "Error desconocido.");
            }
        } catch (error) {
            console.error("Error adding contact to group:", error);
            alert("Error al agregar el contacto al grupo: " + (error.message || "Error desconocido."));
        }
    };

    return (
        <Paper 
            className={`${classes.card} ${isAdded ? classes.selectedCard : ''}`} 
            style={{ width: '100%' }}
        >
            <div className={classes.name}>
                <div className={classes.initial}>{contact.contact_initial}</div>
                <Typography variant="h6" style={{ fontSize: '1rem' }}>
                    {contact.contact_name}
                </Typography>
            </div>
            <div>
                <CardContent style={{ 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                }}>
                    <Button
                        variant="contained"
                        color={isAdded ? "secondary" : "primary"}
                        onClick={handleAddContact}
                        disabled={isAdded}
                        style={{
                            marginTop: '10px',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isAdded ? <CheckIcon /> : <AddIcon />}
                    </Button>
                </CardContent>
            </div>
        </Paper>
    );
};

export default AddContactCardInEditGroup;