import React from "react";
import { Card, Typography, Avatar, Box } from "@material-ui/core";
import { PieChart, Pie, Cell, Label } from "recharts";
import { Link } from "react-router-dom";

const SharedObjectiveCard = ({ sharedObjective }) => {
  const totalAmount = sharedObjective.target_amount;
  const contributedAmount = sharedObjective.total_contributed || 0;
  const remainingAmount = sharedObjective.remaining_amount || totalAmount;

  const percentageCompleted = totalAmount > 0 ? ((contributedAmount / totalAmount) * 100).toFixed(1) : 0;

  const totalAmountFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalAmount);

  const remainingAmountFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(remainingAmount);

  const pieData = [
    { name: "Completed", value: contributedAmount, fill: "#6a89cc" },
    { name: "Remaining", value: remainingAmount, fill: "#2C2F33" }
  ];

  const participants = sharedObjective.participants || [];
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = Math.max(0, participants.length - 3);

  return (
    <Link to={`/singleobjective/${sharedObjective.id}`}>  
      <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "center", borderRadius: 10, width: "auto", minWidth: "250px" }}>
        <Typography variant="h6" style={{ marginBottom: 10 }}>{sharedObjective.name} </Typography>
        <Typography variant="body2" style={{ marginTop: 10 }}>Target: {totalAmountFormatted} </Typography>
        
        
        <Box display="flex" justifyContent="center" alignItems="center">
          <PieChart width={150} height={150}>
            <Pie 
              data={pieData} 
              dataKey="value" 
              innerRadius={50} 
              outerRadius={60} 
              startAngle={90} 
              endAngle={-270}
              >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                value={`${percentageCompleted}%`}
                position="center"
                fill="white"
                fontSize={18}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </Box>
        
        <Typography variant="body2" style={{ marginTop: 10 }}>Remaining Amount: {remainingAmountFormatted} </Typography>

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
  );
};

export default SharedObjectiveCard;
