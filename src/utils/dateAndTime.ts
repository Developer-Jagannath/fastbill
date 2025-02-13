export const getFormattedDateTime = (): { date: string; time: string } => {
    const now = new Date();
  
    // Format the date as DD/MM/YYYY
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
  
    const date = `${day}/${month}/${year}`;
  
    // Format the time as HH:mm
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    const time = `${hours}:${minutes}`;
  
    return { date, time };
  };
  