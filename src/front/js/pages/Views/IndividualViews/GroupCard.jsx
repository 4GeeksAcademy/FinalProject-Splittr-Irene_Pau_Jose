import React from "react";
import { Card, Typography, Avatar, IconButton, Box, Tooltip } from "@material-ui/core";
import { Star, Mail, Edit, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";


const GroupCard = ({ group }) => {
  console.log(group);

  const participants = group.participants || [];

  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = Math.max(0, participants.length - 3);

  return (
    <> <Link to={`/singlegroup/${group.group_id}`}>
      <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "auto", minWidth: "250px" }}>
        <Typography variant="h6" style={{ marginBottom: 10 }}>{group.group_name} </Typography>
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
