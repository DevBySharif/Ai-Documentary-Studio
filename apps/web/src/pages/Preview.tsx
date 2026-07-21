import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";

export function PreviewPage() {
  return (
    <div>
      <Header
        title="Preview & Render"
        subtitle="Preview your documentary before final export"
        actions={
          <Button>
            Render Video
          </Button>
        }
      />

      <div className="p-8">
        <div className="aspect-video bg-surface-200 rounded-xl border flex items-center justify-center">
          <p className="text-gray-400">Preview player</p>
        </div>
      </div>
    </div>
  );
}
