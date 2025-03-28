import React from "react";
import { Card, Typography, Avatar, Box } from "@material-ui/core";
import { Link } from "react-router-dom";

const MessageCard = ({message, className}) => {
  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link to={`/message/conversation/${message.from_user_id}`} className={className}>
      <Card style={{ 
        backgroundColor: "#2C2F33", 
        color: "#fff", 
        padding: 16, 
        textAlign: "left", 
        borderRadius: 10, 
        width: "auto", 
        minWidth: "250px" 
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar style={{ 
              backgroundColor: "#b19cd9", 
              marginRight: 10, 
              width: 40, 
              height: 40 
            }}>
              {message.from_user_initial}
            </Avatar>
            <Box>
              <Typography variant="h6" style={{ marginBottom: 0 }}>
                {message.from_user_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ color: '#b9bbbe' }}>
                {message.message || 'No messages yet'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="textSecondary" style={{ color: '#b9bbbe' }}>
            {formatDate(message.sent_at)}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default MessageCard;