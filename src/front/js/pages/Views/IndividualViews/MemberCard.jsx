import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { red } from "@material-ui/core/colors";
import { removeUserFromGroup } from "../../../component/callToApi";

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
    color: red[500],  
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

const MemberCard = ({ member, groupId }) => {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    try {
       const response = await removeUserFromGroup(member.user_id, groupId);
       console.log(response.msg);
       

       if (onMemberRemoved) {
          onMemberRemoved(member.user_id);
       }
    } catch (error) {
       console.error("Error removing member:", error);
    }
 };

  return (
    <>
      <Paper className={classes.card}>
        <div className={classes.name}>
          <div className={classes.initial}>{member.initial}</div>
          <Typography variant="h6" style={{ fontSize: '1rem' }}>
            {member.user_name}
          </Typography>
        </div>
        <div>
          <IconButton className={classes.iconButton} onClick={handleDeleteClick}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </div>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete contact</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this member?
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
    </>
  );
};

export default MemberCard;
