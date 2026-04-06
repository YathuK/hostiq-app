const statusColors: Record<string, string> = {
  pending: "bg-gray-400",
  dispatched: "bg-yellow-400",
  confirmed: "bg-orange-400",
  in_progress: "bg-blue-400",
  complete: "bg-green-400",
  damage_flagged: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  dispatched: "Dispatched",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  complete: "Complete",
  damage_flagged: "Damage Flagged",
};

export default function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`w-2.5 h-2.5 rounded-full ${statusColors[status] || "bg-gray-400"}`} />
      {statusLabels[status] || status}
    </span>
  );
}
