import React, { useState } from "react"; // Import useState
import { makeStyles } from "@material-ui/core/styles";
import { Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core"; // Import Dialog components
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import AddIcon from "@material-ui/icons/Add";

import { Link } from "react-router-dom";
import { CardContent, Avatar } from "@material-ui/core"; 
import Button from '@material-ui/core/Button';
import { useNavigate } from "react-router-dom";

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
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },

    },
    iconButton: {
        color: "#ffffff",
        padding: theme.spacing(0.5),
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.8rem',
        },
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

const AddContactCard = ({ contact }) => {
    const classes = useStyles();

    return (
        <>
<Paper className={classes.card} style={{ width: '100%' }}>
    <div className={classes.name}>
        <div className={classes.initial}>{contact.contact_initial}</div>
        <Typography variant="h6" style={{ fontSize: '1rem' }}>{contact.contact_name}</Typography>
    </div>
    <div>
        <CardContent style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/group/create/${contact.userid}`)}
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
                <AddIcon />
            </Button>
        </CardContent>
    </div>
</Paper>

        </>
    );
};

export default AddContactCard;
