import React from "react";
import { Card, Typography, Avatar, IconButton, Box, Tooltip } from "@material-ui/core";
import { Star, Mail, Edit, Close } from "@material-ui/icons";
import { PieChart, Pie } from "recharts";
import { Link } from "react-router-dom";


const SharedObjectiveCard = ({sharedObjective}) => {

  const price = sharedObjective.target_amount
  const totalPriceEur = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
  }).format(price);

  const participants = sharedObjective.participants || [];
  
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = Math.max(0, participants.length - 3);

  return (
    <>
    <Link to={`/singleobjective/${sharedObjective.id}`}>  
    <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "auto", minWidth: "250px" }}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>{sharedObjective.name} </Typography>
      <Typography variant="body2" style={{ marginTop: 10 }}>Target: {totalPriceEur} </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <PieChart width={120} height={120}>
          <Pie data={[{ name: "Completed", value: 70, fill: "#6a89cc" }, { name: "Remaining", value: 30, fill: "#2C2F33" }]} dataKey="value" innerRadius={40} outerRadius={50} />
        </PieChart>
      </Box>
      
      
      
      <Box display="flex" justifyContent="center" alignItems="center" gap={1} marginTop={1}>
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

export default SharedObjectiveCard;
