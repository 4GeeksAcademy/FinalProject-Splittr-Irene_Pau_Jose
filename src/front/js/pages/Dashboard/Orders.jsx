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


  console.log("Current transactions state:", transactions);
  const formattedTransactions = [
    ...transactions.group_payments.map((tx) => ({
      id: `group_${tx.id}`,
      date: new Date(tx.payed_at),
      type: "Group Payment",
      from: tx.payer_name,
      to: `${tx.group_name} (to ${tx.receiver_name})`,
      amount: tx.amount
    })),
    ...transactions.objective_contributions.map((tx) => ({
      id: `objective_${tx.id}`,
      date: new Date(tx.contributed_at),
      type: "Objective Contribution",
      from: tx.user_name,
      to: tx.objective_name,
      amount: tx.amount_contributed
    })),
    ...transactions.received_payments.map((tx) => ({
      id: `received_${tx.id}`,
      date: new Date(tx.payed_at),
      type: "Received Payment",
      from: tx.payer_name,
      to: tx.receiver_name,
      amount: tx.amount
    })),
    ...transactions.sent_payments.map((tx) => ({
      id: `sent_${tx.id}`,
      date: new Date(tx.payed_at),
      type: "Sent Payment",
      from: tx.payer_name,
      to: tx.receiver_name,
      amount: tx.amount
    }))
  ];

  const sortedTransactions = formattedTransactions.sort((a, b) => b.date - a.date);
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
              <TableCell align="right">{tx.amount} €</TableCell>
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