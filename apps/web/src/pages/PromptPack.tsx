import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PromptPackPage() {
  return (
    <div>
      <Header
        title="Prompt Pack"
        subtitle="Generate image prompts for each scene"
        actions={
          <Button>
            Generate Prompts
          </Button>
        }
      />

      <div className="p-8">
        <Card>
          <p className="text-sm text-gray-400">
            Generate a script first to create prompt packs for each scene.
          </p>
        </Card>
      </div>
    </div>
  );
}
