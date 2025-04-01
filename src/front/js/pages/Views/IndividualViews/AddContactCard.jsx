import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, CardContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import Button from '@material-ui/core/Button';

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

const AddContactCard = ({ 
    contact, 
    onAddContact, 
    isSelected = false 
}) => {
    const classes = useStyles();

    const handleClick = () => {
        if (onAddContact) {
            onAddContact(contact);
        }
    };

    return (
        <Paper 
            className={`${classes.card} ${isSelected ? classes.selectedCard : ''}`} 
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
                        color={isSelected ? "secondary" : "primary"}
                        onClick={handleClick}
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
                        {isSelected ? <CheckIcon /> : <AddIcon />}
                    </Button>
                </CardContent>
            </div>
        </Paper>
    );
};

export default AddContactCard;