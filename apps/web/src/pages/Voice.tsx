import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function VoicePage() {
  return (
    <div>
      <Header
        title="Voice Engine"
        subtitle="Generate or upload voiceover narration"
        actions={
          <Button>
            Generate Voice
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        <Card>
          <h3 className="font-semibold text-gray-100 mb-2">Voice Settings</h3>
          <p className="text-sm text-gray-400">
            Configure voice provider, voice model, speed, and pitch settings.
          </p>
        </Card>
      </div>
    </div>
  );
}
