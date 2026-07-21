import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { StatsWidget } from "@/components/dashboard/StatsWidget";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { useProjectStore } from "@/stores/projectStore";
import { Plus, Film, FileText, Clock } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects } = useProjectStore();

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome to AI Documentary Studio"
        actions={
          <Button onClick={() => navigate("/projects/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <StatsWidget
            label="Total Projects"
            value={projects.length}
            icon={<Film className="h-5 w-5" />}
          />
          <StatsWidget
            label="Scripts Generated"
            value="0"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsWidget
            label="Videos Rendered"
            value="0"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Recent Projects
          </h2>
          {projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-surface-300 rounded-xl">
              <Film className="mx-auto h-12 w-12 text-surface-400" />
              <p className="mt-4 text-gray-400">
                No projects yet. Create your first documentary.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/projects/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
