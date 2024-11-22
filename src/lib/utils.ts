import { type ClassValue, clsx } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPastDate = (date: Date) => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

// calaculate remainig days
export const RemainingDays=(endate:Date)=>{
  const today =dayjs();
  const end =dayjs(endate);
  return end.diff(today,"day")
}

export const downloadBlobAsPDF = (blob: string) => {

  const pdfBlob = new Blob([blob], { type: "application/pdf" });

  // Create a temporary URL for the Blob
  const url = window.URL.createObjectURL(pdfBlob);

  // Create a temporary <a> element to trigger the download
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.setAttribute(
    "download",
    `intelliresponse_invoice_${dayjs(new Date())}.pdf`
  ); // Set the desired filename for the downloaded file

  // Append the <a> element to the body and click it to trigger the download
  document.body.appendChild(tempLink);
  tempLink.click();

  // Clean up the temporary elements and URL
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
};