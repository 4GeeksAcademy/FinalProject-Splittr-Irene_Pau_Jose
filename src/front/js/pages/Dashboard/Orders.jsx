import React, { useEffect, useState, useContext } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title.jsx";
import { Context } from "../../store/appContext.js";
import { useParams } from "react-router-dom";
import { mapTransactions } from "../../component/callToApi.js";
import { formatDate } from "../../utilities/formatDate.js";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  const { store, actions } = useContext(Context);
  const [transactions, setTransactions] = useState({
    group_payments: [],
    objective_contributions: [],
    received_payments: [],
    sent_payments: [],
  });

  useEffect(() => {
    mapTransactions(setTransactions);
  }, []);

  // Enhanced date parsing function
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    try {
      // Handle both ISO format and "Thu, 27 Mar 2025 19:04:25 GMT" format
      return dateString.includes(',') ? new Date(dateString) : new Date(dateString.replace(' ', 'T'));
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return new Date();
    }
  };

  ("Current transactions state:", transactions);

  const allTransactions = [
    ...(transactions.group_payments || []).map((tx) => {
      const parsedDate = parseDate(tx.payed_at);
      ("Group Payment Date:", tx.payed_at, parsedDate);
      return {
        id: `group_${tx.id}`,
        date: parsedDate,
        type: "Group Payment",
        from: tx.payer_name || "Unknown",
        to: tx.group_name ? `${tx.group_name}${tx.receiver_name ? ` (to ${tx.receiver_name})` : ''}` : "Unknown Group",
        amount: Number(tx.amount) || 0
      };
    }),
    ...(transactions.objective_contributions || []).map((tx) => {
      const parsedDate = parseDate(tx.contributed_at);
      ("Objective Contribution Date:", tx.contributed_at, parsedDate);
      return {
        id: `objective_${tx.id}`,
        date: parsedDate,
        type: "Objective Contribution",
        from: tx.user_name || "Unknown",
        to: tx.objective_name || "Unknown Objective",
        amount: Number(tx.amount_contributed) || 0
      };
    }),
    ...(transactions.received_payments || []).map((tx) => {
      const parsedDate = parseDate(tx.payed_at);
      ("Received Payment Date:", tx.payed_at, parsedDate);
      return {
        id: `received_${tx.id}`,
        date: parsedDate,
        type: "Received Payment",
        from: tx.payer_name || "Unknown",
        to: tx.receiver_name || "Unknown",
        amount: Number(tx.amount) || 0
      };
    }),
    ...(transactions.sent_payments || []).map((tx) => {
      const parsedDate = parseDate(tx.payed_at);
      ("Sent Payment Date:", tx.payed_at, parsedDate);
      return {
        id: `sent_${tx.id}`,
        date: parsedDate,
        type: "Sent Payment",
        from: tx.payer_name || "Unknown",
        to: tx.receiver_name || "Unknown",
        amount: Number(tx.amount) || 0
      };
    })
  ];

  // Optimized sorting with fallback for invalid dates
  const sortedTransactions = [...allTransactions].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date();
    const dateB = b.date instanceof Date ? b.date : new Date();
    if (isNaN(dateA.getTime())) console.warn("Invalid dateA:", a.date);
    if (isNaN(dateB.getTime())) console.warn("Invalid dateB:", b.date);
    return dateB - dateA;
  });

  // Debug transformed data
  ("Formatted transactions:", allTransactions);
  ("Sorted transactions:", sortedTransactions);

  return (
    <React.Fragment>
      <Title>Recent Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell align="right">Amount (€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.from}</TableCell>
              <TableCell>{tx.to}</TableCell>
              <TableCell align="right">{tx.amount.toFixed(2)} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={(e) => e.preventDefault()}>
          See more transactions
        </Link>
      </div>
    </React.Fragment>
  );
}