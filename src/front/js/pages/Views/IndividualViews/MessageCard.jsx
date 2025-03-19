import React from "react";
import { Card, Typography, Avatar, Box } from "@material-ui/core";
import { Link } from "react-router-dom";

const MessageCard = ({message}) => {
    return (
        <>
            <Link to={`/message/conversation/${message.from_user_id}`}>
                <Card style={{ backgroundColor: "#2C2F33", color: "#fff", padding: 16, textAlign: "left", borderRadius: 10, width: "auto", minWidth: "250px" }}>
                    <Box display="flex" justifyContent="left" alignItems="center"> 
                        <Avatar style={{ backgroundColor: "#b19cd9", marginRight: 5, marginBottom: "0px" }}>{message.from_user_initial} </Avatar>
                        <Typography variant="h6" style={{ marginBottom: 0 }}>{message.from_user_name}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="left" marginTop={2}>
                        <Typography style={{
                            color: "#A9A9A9",
                            justifyContent: "left",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                           {message.message}
                        </Typography>
                    </Box>
                </Card>
            </Link>
        </>
    );
};

export default MessageCard;