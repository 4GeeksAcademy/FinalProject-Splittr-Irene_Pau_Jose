import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import MailIcon from '@material-ui/icons/Mail';

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
  nameContainer: {
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
  textContainer: {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  name: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  message: {
    color: '#b9bbbe',
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
    [theme.breakpoints.down('sm')]: {
      maxWidth: "150px",
    },
  },
  time: {
    color: '#b9bbbe',
    marginLeft: theme.spacing(1),
    whiteSpace: "nowrap",
  },
  link: {
    textDecoration: "none",
    display: "block",
    width: "100%",
    marginBottom: theme.spacing(1),
  },
}));

const MessageCard = ({ message, className }) => {
  const classes = useStyles();

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link 
      to={`/message/conversation/${message.from_user_id}`} 
      className={classes.link}
    >
      <Paper className={classes.card}>
        <div className={classes.nameContainer}>
          <div className={classes.initial}>{message.from_user_initial}</div>
          <div className={classes.textContainer}>
            <Typography variant="subtitle1" className={classes.name}>
              {message.from_user_name}
            </Typography>
            <Typography variant="caption" className={classes.message}>
              {message.message ? `: ${message.message}` : 'No messages yet'}
            </Typography>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="caption" className={classes.time}>
            {formatDate(message.sent_at)}
          </Typography>
          <IconButton className={classes.iconButton}>
            <MailIcon fontSize="small" />
          </IconButton>
        </div>
      </Paper>
    </Link>
  );
};

export default MessageCard;