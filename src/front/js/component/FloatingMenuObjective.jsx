import React, { useState } from 'react';
import { 
  Fab, 
  Menu, 
  MenuItem, 
  Backdrop, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PaymentIcon from '@material-ui/icons/Payment';
import { makeObjectiveContribution } from './callToApi';

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
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  }
}));

export default function FloatingMenuObjective({ objectiveid }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const user_id = sessionStorage.getItem("user_id");

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContributionOpen = () => {
    handleClose();
    setContributionDialogOpen(true);
  };

  const handleContributionClose = () => {
    setContributionDialogOpen(false);
    setContributionAmount('');
  };

  const handleContributionSubmit = async () => {
    const result = await makeObjectiveContribution(objectiveid, contributionAmount);
    
    if (result.success) {
      setContributionDialogOpen(false);
    }
  }; 

  const actions = [
    {
      icon: <PaymentIcon />,
      name: 'Make Contribution',
      onClick: handleContributionOpen
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

      <Dialog
        open={contributionDialogOpen}
        onClose={handleContributionClose}
        aria-labelledby="contribution-dialog-title"
      >
        <DialogTitle id="contribution-dialog-title">Make a Contribution</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            autoFocus
            margin="dense"
            label="Contribution Amount"
            type="number"
            fullWidth
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            InputProps={{
              endAdornment: '€',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleContributionClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleContributionSubmit} 
            color="primary" 
            disabled={!contributionAmount}
          >
            Contribute
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}