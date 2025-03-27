import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper } from '@material-ui/core';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { mapTransactions } from './callToApi';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2),
        backgroundColor: '#2C2F33',
        color: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    chartContainer: {
        height: 300,
        width: '100%'
    },
    positiveFlow: {
        color: '#4CAF50'
    },
    negativeFlow: {
        color: '#F44336'
    },
    summaryItem: {
        padding: theme.spacing(1)
    },
    title: {
        marginBottom: theme.spacing(1),
        color: '#ffffff'
    }
}));
export default function FinancialDashboard() {
    const classes = useStyles();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const chartColors = {
        received: '#4CAF50',
        spent: '#F44336',
        groups: '#FFC107',
        objectives: '#FF9800'
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            await mapTransactions((data) => {
                console.log("Data received from API:", data); // Debug

                const totalReceived = data.received_payments.reduce((sum, payment) => sum + payment.amount, 0);
                const totalSpent = data.sent_payments.reduce((sum, payment) => sum + payment.amount, 0);
                const totalGroups = data.group_payments.reduce((sum, payment) => sum + payment.amount, 0);
                const totalObjectives = data.objective_contributions.reduce((sum, contribution) => sum + contribution.amount_contributed, 0);

                setChartData([
                    { name: 'Received', value: totalReceived, fill: chartColors.received },
                    { name: 'Spent', value: totalSpent, fill: chartColors.spent },
                    { name: 'Groups', value: totalGroups, fill: chartColors.groups },
                    { name: 'Objectives', value: totalObjectives, fill: chartColors.objectives },
                ]);
                setLoading(false);
            });
        };

        fetchTransactions();
    }, []);

    const getUserId = () => {
        return sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
    };

    if (loading) return <div style={{ color: '#ffffff' }}>Loading...</div>;

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" className={classes.title}>
                            Financial Summary
                        </Typography>

                        {chartData.length > 0 ? (
                            <div className={classes.chartContainer}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 10, right: 20, left: 20, bottom: 30 }} // Adjusted left margin
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#ffffff"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            stroke="#ffffff"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`€${value.toFixed(2)}`, 'Amount']}
                                            contentStyle={{
                                                backgroundColor: '#2C2F33',
                                                borderColor: '#424242',
                                                color: '#ffffff'
                                            }}
                                        />
                                        <Bar dataKey="value" barSize={30}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <Typography style={{ color: '#ffffff' }}>
                                No financial data available
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Summary Cards */}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" className={classes.title}>
                            Detailed Summary
                        </Typography>
                        <Grid container spacing={1}>
                            {chartData.map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item.name} className={classes.summaryItem}>
                                    <Typography variant="subtitle1" style={{ color: '#b9bbbe' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="h6" style={{ color: item.fill, fontSize: '1.1rem' }}>
                                        €{item.value.toFixed(2)}
                                    </Typography>
                                </Grid>
                            ))}
                            {chartData.length >= 2 && (
                                <Grid item xs={12} className={classes.summaryItem}>
                                    <Typography variant="subtitle1" style={{ color: '#b9bbbe' }}>
                                        Net Cash Flow
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        className={
                                            chartData[0]?.value - chartData[1]?.value >= 0
                                                ? classes.positiveFlow
                                                : classes.negativeFlow
                                        }
                                        style={{ fontSize: '1.1rem' }}
                                    >
                                        €{(chartData[0]?.value - chartData[1]?.value).toFixed(2)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}