export const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatMessageDate = (date) => {
  const messageDate = new Date(date);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() && 
      date1.getMonth() === date2.getMonth() && 
      date1.getDate() === date2.getDate()
    );
  };

  if(isSameDate(messageDate, today)) {
    return "Today";
  }

  if(isSameDate(messageDate, yesterday)) {
    return "Yesterday";
  }

  return messageDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};