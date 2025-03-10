import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, IconButton, Typography } from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { flexbox } from '@material-ui/system';



const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    width: "100%",
    minHeight: 70, // Use minHeight instead of fixed height
    minWidth: 250,
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    backgroundColor: "#2C2F33",
    margin: theme.spacing(0),
    borderRadius: 4,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1), // Smaller padding on mobile
      
    },
  },
  iconButton: {
    color: "#ffffff",
    padding: theme.spacing(0.5), // Smaller padding around icons
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem', // Smaller icon size on mobile
    },
  },
  name: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem', // Smaller text on mobile
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
      fontSize: '0.8rem', // Smaller text inside the circle
    },
  },
}));

export default function ContactCard() {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <div className={classes.name}>
        <div className={classes.initial}>P</div>
        <Typography variant="h6" style={{ fontSize: '1rem' }}>Pepito Grillo</Typography>
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
        <IconButton className={classes.iconButton}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Paper>
  );
}