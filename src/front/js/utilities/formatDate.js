import React from "react";

export function formatDate(dateString) {

  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'N/A';
  }
}