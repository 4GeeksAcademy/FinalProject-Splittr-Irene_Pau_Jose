import React, { useState } from 'react';
import { Fab, Menu, MenuItem, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AssignmentIcon from '@material-ui/icons/Assignment';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: '200px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function FloatingActionButtonMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const actions = [
    { 
      icon: <PaymentIcon />, 
      name: 'Make Payment',
      onClick: () => {
        // Add your make payment logic
        handleClose();
      }
    },
    { 
      icon: <GroupAddIcon />, 
      name: 'Create Group',
      onClick: () => {
        // Add your create group logic
        handleClose();
      }
    },
    { 
      icon: <AssignmentIcon />, 
      name: 'Create Objective',
      onClick: () => {
        // Add your create objective logic
        handleClose();
      }
    },
  ];

  return (
    <>
      <Fab 
        color="primary" 
        className={classes.fab} 
        onClick={handleClick}
      >
        <AddIcon />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {actions.map((action) => (
          <MenuItem 
            key={action.name} 
            onClick={action.onClick} 
            className={classes.menuItem}
          >
            {action.icon}
            {action.name}
          </MenuItem>
        ))}
      </Menu>
      <Backdrop 
        open={open} 
        onClick={handleClose} 
        className={classes.backdrop}
      />
    </>
  );
}