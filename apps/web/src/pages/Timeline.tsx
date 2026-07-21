import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";

export function TimelinePage() {
  return (
    <div>
      <Header
        title="Timeline"
        subtitle="Synchronize visuals with voiceover"
        actions={
          <Button>
            Auto Build
          </Button>
        }
      />

      <div className="p-8">
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-surface-300 rounded-xl">
          <p className="text-gray-400">
            Timeline will appear here after adding images and voiceover.
          </p>
        </div>
      </div>
    </div>
  );
}
