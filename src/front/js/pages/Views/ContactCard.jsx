import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, IconButton, Typography } from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    backgroundColor: "#2C2F33", 
    margin: theme.spacing(2),
    borderRadius: 4,
  },
  iconButton: {
    color: "#ffffff", 
  },
  name: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff", 
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
  },
}));

export default function ContactCard() {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <div className={classes.name}>
        <div className={classes.initial}>P</div>
        <Typography variant="h6">Pepito Grillo</Typography>
      </div>
      <div>
        <IconButton className={classes.iconButton}>
          <StarIcon />
        </IconButton>
        <IconButton className={classes.iconButton}>
          <MailIcon />
        </IconButton>
        <IconButton className={classes.iconButton}>
          <EditIcon />
        </IconButton>
        <IconButton className={classes.iconButton}>
          <CloseIcon />
        </IconButton>
      </div>
    </Paper>
  );
}