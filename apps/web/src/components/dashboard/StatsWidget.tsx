import { Card } from "@/components/ui/Card";

interface StatsWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatsWidget({ label, value, icon }: StatsWidgetProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent-light">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </Card>
  );
}
