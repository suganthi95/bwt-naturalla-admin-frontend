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
export const RemainingDays = (endate: Date) => {
  const today = dayjs().startOf("day");
  const end = dayjs(endate).startOf("day");
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
    `invoice_${dayjs(new Date())}.pdf`
  ); // Set the desired filename for the downloaded file

  // Append the <a> element to the body and click it to trigger the download
  document.body.appendChild(tempLink);
  tempLink.click();

  // Clean up the temporary elements and URL
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
};

export const downloadPDF = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = "specifications.pdf";
    link.click();

    // Clean up the object URL
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Download failed:', error);
  }
};


export const planFeatures = {
  standard: [
    {
      icon: "success",
      text: "features.oneLocation"
    },
    {
      icon: "success",
      text: "features.oneOwner",
    },
    {
      icon: "success",
      text: "features.sixtyCredits"
    },
    {
      icon: "success",
      text: "features.aiResponses"
    },
    {
      icon: "success",
      text: "features.sentiment"
    },
    {
      icon: "success",
      text: "features.dashboard"
    },
    {
      icon: "error",
      text: "features.multilingual"
    },
    {
      icon: "error",
      text: "features.workspace"
    },
    {
      icon: "error",
      text: "features.insights"
    },
  ],

  pro: [
    {
      icon: "success",
      text: "features.threeLocation"
    },
    {
      icon: "success",
      text: "features.franchiseOwners",
    },
    {
      icon: "success",
      text: "features.twoHundredCredits"
    },
    {
      icon: "success",
      text: "features.comingSoon"
    },
    {
      icon: "success",
      text: "features.moreThanThree"
    },
    {
      icon: "success",
      text: "features.multiOwners"
    },
    {
      icon: "coming soon",
      text: "features.multilingual_support"
    },
    {
      icon: "coming soon",
      text: "features.workspace_integration"
    },
    {
      icon: "coming soon",
      text: "features.insights_and_recommendations"
    },
  ],

  enterprise: [
    {
      icon: "success",
      text: "features.more_than_three_business_locations"
    },
    {
      icon: "success",
      text: "features.suitable_for_multi_business_owners",
    },
    {
      icon: "success",
      text: "features.unlimited_free_credits"
    },
    {
      icon: "success",
      text: "features.ai_powered_responses"
    },
    {
      icon: "success",
      text: "features.sentiment_analysis"
    },
    {
      icon: "success",
      text: "features.analytics_dashboard"
    },
    {
      icon: "coming soon",
      text: "features.multilingual_support"
    },
    {
      icon: "coming soon",
      text: "features.workspace_integration"
    },
    {
      icon: "coming soon",
      text: "features.insights_and_recommendations"
    },
  ],
}