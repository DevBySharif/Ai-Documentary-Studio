import { Card } from "@/components/ui/Card";
import type { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  draft: "text-gray-400",
  scripting: "text-blue-400",
  prompting: "text-yellow-400",
  generating_images: "text-purple-400",
  uploading_images: "text-cyan-400",
  voicing: "text-green-400",
  timeline: "text-orange-400",
  rendering: "text-red-400",
  complete: "text-accent-light",
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card onClick={onClick} className="group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-300">
            <FileText className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100 group-hover:text-accent-light transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-gray-500">
              Created {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-medium capitalize ${statusColors[project.status] || "text-gray-400"}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>
    </Card>
  );
}
