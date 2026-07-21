import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";

export function SettingsPage() {
  return (
    <div>
      <Header title="Settings" subtitle="Configure your preferences" />

      <div className="p-8 max-w-2xl space-y-6">
        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">Profile</h3>
          <p className="text-sm text-gray-400">Manage your account settings</p>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">Channel DNA</h3>
          <p className="text-sm text-gray-400">
            Configure default channel DNA profiles
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">Integrations</h3>
          <p className="text-sm text-gray-400">
            Connect external providers (Google Flow, ElevenLabs, etc.)
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">Knowledge Base</h3>
          <p className="text-sm text-gray-400">
            Edit story rules, prompt rules, visual rules, and more
          </p>
        </Card>
      </div>
    </div>
  );
}
