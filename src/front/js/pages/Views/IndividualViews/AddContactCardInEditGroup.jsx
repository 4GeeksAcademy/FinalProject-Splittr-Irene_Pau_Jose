import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, CardContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import Button from '@material-ui/core/Button';
import { addUserToGroup } from '../../../component/callToApi.js'; // Assuming you have this method


const useStyles = makeStyles((theme) => ({
    card: {
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      border: '1px solid #ccc',
    },
    selectedCard: {
      backgroundColor: theme.palette.success.light, // Puedes definir tus propios colores
    },
    name: {
      display: 'flex',
      alignItems: 'center',
    },
    initial: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main, // O el color que desees
      color: theme.palette.common.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing(1),
      fontSize: '1rem',
    },
  }));


const AddContactCardInEditGroup = ({ 
    contact, 
    groupId,
    onAddContact 
}) => {
    const classes = useStyles();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddContact = async () => {
        try {
            const result = await addContactToGroup(contact.user_id, groupId);
            setIsAdded(true);
            if (onAddContact) {
                onAddContact(contact);
            }
            alert("Contact added to group successfully!");
        } catch (error) {
            console.error("Error adding contact to group:", error); // Muestra el error completo.
            alert("Failed to add contact to group");
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