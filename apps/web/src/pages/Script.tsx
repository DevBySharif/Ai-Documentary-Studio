import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function ScriptPage() {
  return (
    <div>
      <Header
        title="Script Engine"
        subtitle="Generate documentary scripts from your idea"
        actions={
          <Button>
            Generate Script
          </Button>
        }
      />

      <div className="p-8 max-w-3xl space-y-6">
        <div className="space-y-4">
          <Input
            id="idea"
            label="Your Documentary Idea"
            placeholder="E.g., The rise and fall of the Roman Empire..."
          />
          <Button>Generate from Idea</Button>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Generated Scripts</h2>
          <Card>
            <p className="text-sm text-gray-400">No scripts generated yet. Enter an idea to begin.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
