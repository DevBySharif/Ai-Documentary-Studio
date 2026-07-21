import { useParams } from "react-router-dom";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Play, FileText, Image, Mic, Clock } from "lucide-react";

const workflowSteps = [
  { icon: FileText, label: "Script", desc: "Generate documentary script", status: "pending" },
  { icon: Image, label: "Prompt Pack", desc: "Generate image prompts", status: "pending" },
  { icon: Image, label: "Images", desc: "Upload generated images", status: "pending" },
  { icon: Mic, label: "Voice", desc: "Generate or upload voiceover", status: "pending" },
  { icon: Clock, label: "Timeline", desc: "Build synchronized timeline", status: "pending" },
  { icon: Play, label: "Preview", desc: "Preview and render", status: "pending" },
];

export function ProjectPage() {
  const { id } = useParams();

  return (
    <div>
      <Header
        title={id === "new" ? "New Project" : "Project"}
        subtitle="Documentary production workflow"
        actions={
          <Button variant="secondary">
            <Play className="mr-2 h-4 w-4" />
            Preview
          </Button>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          {workflowSteps.map((step) => (
            <Card key={step.label} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent-light">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">{step.label}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
