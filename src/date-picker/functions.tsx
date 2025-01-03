export const formatDateTime = (date: Date): string => {
  const newDate = new Date(date);
  const offset = newDate.getTimezoneOffset() * 60000;
  const localDate = new Date(newDate.getTime() - offset);

  const year = localDate.getFullYear();
  const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
  const day = localDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDate = (dateTime: string | null) => {
  const formattedData = new Date(dateTime ? dateTime : "");
  const day = formattedData.getDate();
  const month = formattedData
    .toLocaleString("en-US", {
      month: "short",
    })
    .toLowerCase();
  const hour = formattedData
    ? formattedData.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "";
  return {
    formattedData,
    day,
    month,
    hour,
  };
};
