import React, { useEffect, useState } from 'react';
import { Card, Typography, Avatar, IconButton, Box, Tooltip } from "@material-ui/core";
import { Star, Mail, Edit, Close } from "@material-ui/icons";
import { Link, useParams } from "react-router-dom";
import { getGroupDebts } from "../../../component/callToApi";

const GroupCard = ({ group }) => {
  console.log(group);
  const [groupDebts, setGroupDebts] = useState([]);
  const participants = group.members || [];
  const {groupid}=useParams();
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = Math.max(0, participants.length - 3);

   useEffect(() => {
      getGroupDebts(setGroupDebts, groupid);
    }, []);
  return (
    <> <Link to={`/singlegroup/${group.group_id}`}>
      <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "auto", minWidth: "250px" }}>
        <Typography variant="h6" style={{ marginBottom: 10 }}>{group.group_name} </Typography>

        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center"
          style={{
            backgroundColor: "#383B40",
            borderRadius: 8,
            padding: 16,
            margin: "0 auto",
            marginBottom: 16,
            width: "70%",
            minHeight: 120,
      
          }}
        >
          <Typography variant="body2" style={{ marginBottom: 4 }}>
            Still to pay:
          </Typography>
          <Typography variant="h6">
            Still to pay
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          {visibleParticipants.map((participant, index) => (
            <Avatar
              key={participant.id || index}
              style={{ backgroundColor: "#b19cd9", marginRight: 5 }}
            >
              {participant.initial || "?"}
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <Typography>+{remainingCount} </Typography>
          )}
        </Box>

      </Card>
    </Link>
    </>
  );
};

export default GroupCard;
