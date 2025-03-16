import React from "react";
import { Card, Typography, Avatar, IconButton, Box, Tooltip } from "@material-ui/core";
import { Star, Mail, Edit, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";


const GroupCard = ({group}) => {
  console.log(group);
  
  return (
    <> <Link to={`/singlegroup/${group.group_id}`}>
    <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "auto", minWidth: "250px" }}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>{group.group_name} </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5 }}> {group.members.length} </Avatar>
    
      </Box>
      <Box display="flex" justifyContent="space-around" marginTop={2}>
        <Tooltip title="Favorite"><IconButton><Star style={{ color: "#fff" }} /></IconButton></Tooltip>
        <Tooltip title="Edit"><IconButton><Edit style={{ color: "#fff" }} /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton><Close style={{ color: "#ff4d4d" }} /></IconButton></Tooltip>
      </Box>
    </Card>
    </Link>
    </>
  );
};

export default GroupCard;
