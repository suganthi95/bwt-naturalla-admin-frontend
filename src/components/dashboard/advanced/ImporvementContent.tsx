export default function ImprovementContent() {
  const points = [
    "Response time is slow on mobile.",
    "Navigation can be confusing.",
    "Content needs better categorization.",
    `Server and Technical Issues: Address server and technical issues promptly to avoid delays and improve customer satisfaction.`,
    `Customer Feedback Management: Implement a system for managing and addressing customer feedback to improve service quality and address customer concerns.`,
  ];

  return (
    <div className="w-full p-4 border rounded-md">
      <h2 className="text-sm font-semibold text-[#242424] mb-1">
        Area of Improvement
      </h2>

      <h3 className="text-[#242424] font-bold text-base mb-4">
        1. Billing Counter Management:
      </h3>

      <ul className="list-disc list-inside space-y-2 text-neutral-700 text-sm">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
