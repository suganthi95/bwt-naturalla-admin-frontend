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

export const planFeatures = {
  standard: [
    {
      icon: "success",
      text: "Upto One Business Location"
    },
    {
      icon: "success",
      text: "Suitable For Single Business Owners",
    },
    {
      icon: "success",
      text: "Upto 60 Free Credits"
    },
    {
      icon: "success",
      text: "AI-Powered Responses"
    },
    {
      icon: "success",
      text: "Sentiment Analysis"
    },
    {
      icon: "success",
      text: "Analytics Dashboard"
    },
    {
      icon: "error",
      text: "Multilingual Support"
    },
    {
      icon: "error",
      text: "Workspace Integration"
    },
    {
      icon: "error",
      text: "Insights and Recommendations"
    },
  ],

  pro: [
    {
      icon: "success",
      text: "Upto Three Business Location"
    },
    {
      icon: "success",
      text: "Suitable For Franchisors Business Owners",
    },
    {
      icon: "success",
      text: "Upto 200 Free Credits"
    },
    {
      icon: "success",
      text: "AI-Powered Responses"
    },
    {
      icon: "success",
      text: "Sentiment Analysis"
    },
    {
      icon: "success",
      text: "Analytics Dashboard"
    },
    {
      icon: "coming soon",
      text: "Multilingual Support (Coming Soon)"
    },
    {
      icon: "coming soon",
      text: "Workspace Integration (Coming Soon)"
    },
    {
      icon: "coming soon",
      text: "Insights and Recommendations (Coming Soon)"
    },
  ],

  enterprise: [
    {
      icon: "success",
      text: "More Than Three Business Location"
    },
    {
      icon: "success",
      text: "Suitable For Multi-Business Owners",
    },
    {
      icon: "success",
      text: "Unlimited Free Credits"
    },
    {
      icon: "success",
      text: "AI-Powered Responses"
    },
    {
      icon: "success",
      text: "Sentiment Analysis"
    },
    {
      icon: "success",
      text: "Analytics Dashboard"
    },
    {
      icon: "coming soon",
      text: "Multilingual Support (Coming Soon)"
    },
    {
      icon: "coming soon",
      text: "Workspace Integration (Coming Soon)"
    },
    {
      icon: "coming soon",
      text: "Insights and Recommendations (Coming Soon)"
    },
  ],
}