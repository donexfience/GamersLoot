import date from "date-and-time";
export const getPassedDateOnwardDateForInput = (inputDateString) => {
  const inputDate = new Date(inputDateString);
  const formattedDate = date.format(inputDate, "YYYY-MM-DD");
  return formattedDate;
};

export const getStatusDates = (status, statusHistory) => {
  const filterResultStatus = statusHistory.find(
    (item) => item.status === status
  );

  const filterdStatus = new Date(filterResultStatus.date);
  const formattedDate = date.format(filterdStatus, "DD, MM,YYYY");
  return formattedDate ? formattedDate : "NA";
};

//payment modifiler just changing text to correct format

export const modifyPaymentText = (mode) => {
  if (mode === "cashOnDelivery") {
    return "Cash on Delivery";
  }
};
