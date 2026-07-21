import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Upload } from "lucide-react";

export function ImagesPage() {
  return (
    <div>
      <Header
        title="Images"
        subtitle="Upload generated images for your documentary"
        actions={
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        }
      />

      <div className="p-8">
        <div className="border-2 border-dashed border-surface-300 rounded-xl p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-surface-400" />
          <p className="mt-4 text-gray-400">
            Drag and drop your images here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports PNG, JPG, WebP - generated from Google Flow or other providers
          </p>
          <Button className="mt-4">Browse Files</Button>
        </div>
      </div>
    </div>
  );
}
