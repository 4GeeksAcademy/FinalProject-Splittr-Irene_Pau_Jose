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
        <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5  }}>P</Avatar>
        <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5  }}>P</Avatar>
        <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5  }}>P</Avatar>
     
        <Typography>+4 more</Typography>
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

export default SharedObjectiveCard;
