import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  logoutButton: {
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  dialogPaper: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function LogoutButton() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>

      <Tooltip title="Log out" arrow>
        <IconButton 
          className={classes.logoutButton} 
          onClick={handleOpenDialog}
          aria-label="logout"
        >
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>

   
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Confirm Log Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleLogout} 
            color="primary"
            autoFocus
            startIcon={<ExitToAppIcon />}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}