import React, { useState } from "react"; // Import useState
import { makeStyles } from "@material-ui/core/styles";
import { Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core"; // Import Dialog components
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    width: "100%",
    minHeight: 70,
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

const ContactCard = ({ contact }) => {
    const classes = useStyles();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Add state variable

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = () => {
        setOpenDeleteDialog(false);
        // aquí el código para eliminar el contacto
    };

    return (
        <>
            <Link to={`/singlecontact/${contact.contact_id}`}>
                <Paper className={classes.card}>
                    <div className={classes.name}>
                        <div className={classes.initial}>{contact.contact_initial}</div>
                        <Typography variant="h6" style={{ fontSize: '1rem' }}>{contact.contact_name}</Typography>
                    </div>
                    <div>
                        <IconButton className={classes.iconButton}>
                            <StarIcon fontSize="small" />
                        </IconButton>
                        <IconButton className={classes.iconButton}>
                            <MailIcon fontSize="small" />
                        </IconButton>
                        <IconButton className={classes.iconButton}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton className={classes.iconButton} onClick={handleDeleteClick}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Delete contact</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this contact?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Link>
        </>
    );
};

export default ContactCard;