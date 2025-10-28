import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DesignResultsProps {
  designs: Array<{ view: string; imageUrl: string }>;
  preferences: any;
  onBack: () => void;
}

const DesignResults = ({ designs, preferences, onBack }: DesignResultsProps) => {
  const viewLabels: Record<string, string> = {
    floor_plan: "Floor Plan",
    front_view: "Front View",
    back_view: "Back View",
    top_view: "Top View",
    side_view: "Side View"
  };

  const handleDownload = (imageUrl: string, viewName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `house-design-${viewName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Designer
            </Button>
            <h1 className="text-2xl font-bold text-primary">Your AI Generated Design</h1>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Design Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-xl font-semibold mb-4">Design Specifications</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {preferences.architecturalStyle}
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {preferences.colorScheme}
            </Badge>
            {preferences.specialFeatures.map((feature: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-base px-4 py-2">
                {feature}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Design Views Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {designs.map((design, index) => (
            <Card key={index} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={design.imageUrl}
                  alt={viewLabels[design.view]}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground text-base px-4 py-2">
                    {viewLabels[design.view]}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(design.imageUrl, design.view)}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Create New Design
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DesignResults;
