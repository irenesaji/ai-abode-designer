import { useState } from "react";
import { Building2, Home, Sparkles, Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DesignResults from "@/components/DesignResults";

type ArchitecturalStyle = "Modern Minimalist" | "Traditional Indian" | "Luxury Contemporary" | "Eco-Friendly";
type ColorScheme = "Neutral Elegance" | "Warm Earth" | "Cool Blues" | "Vibrant Accent";

interface DesignPreferences {
  architecturalStyle: ArchitecturalStyle;
  roomLayout: string;
  colorScheme: ColorScheme;
  specialFeatures: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<DesignPreferences>({
    architecturalStyle: "Modern Minimalist",
    roomLayout: "Open floor plan",
    colorScheme: "Neutral Elegance",
    specialFeatures: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const architecturalStyles = [
    { name: "Modern Minimalist", description: "Clean lines, open spaces, neutral colors", icon: Building2 },
    { name: "Traditional Indian", description: "Classic architecture, warm colors, cultural elements", icon: Home },
    { name: "Luxury Contemporary", description: "Premium finishes, sophisticated design, high-end materials", icon: Sparkles },
    { name: "Eco-Friendly", description: "Sustainable materials, green technology, natural lighting", icon: Leaf }
  ];

  const colorSchemes = [
    { name: "Neutral Elegance", colors: ["#f5f5f0", "#e8e8e0", "#d1d1c8", "#b8b8a8"] },
    { name: "Warm Earth", colors: ["#f4e4d7", "#e8b882", "#d4753e", "#8b4513"] },
    { name: "Cool Blues", colors: ["#e3f2fd", "#90caf9", "#42a5f5", "#1e88e5"] },
    { name: "Vibrant Accent", colors: ["#fff8e1", "#ffecb3", "#ff6f00", "#1e88e5"] }
  ];

  const specialFeatures = [
    { id: "vastu", label: "Follow Vastu Shastra principles for positive energy" },
    { id: "solar", label: "Solar panels - Renewable energy system" },
    { id: "rainwater", label: "Rainwater harvesting - Water conservation system" },
    { id: "ventilation", label: "Natural ventilation - Energy-efficient cooling" }
  ];

  const handleFeatureToggle = (featureLabel: string) => {
    setPreferences(prev => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(featureLabel)
        ? prev.specialFeatures.filter(f => f !== featureLabel)
        : [...prev.specialFeatures, featureLabel]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-house-design', {
        body: { preferences }
      });

      if (error) throw error;

      setDesigns(data.designs);
      setShowResults(true);
      toast({
        title: "Design Generated!",
        description: "Your AI house design is ready to view."
      });
    } catch (error) {
      console.error('Error generating design:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate house design. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showResults) {
    return (
      <DesignResults 
        designs={designs} 
        preferences={preferences}
        onBack={() => setShowResults(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">AI House Designer</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">Design Your Dream Home</h2>
          <p className="text-lg text-muted-foreground">
            Tell us your preferences and our AI will create the perfect design for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Design Preferences */}
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Design Preferences</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Choose your preferred style and layout</p>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Architectural Style</Label>
                  <div className="space-y-2">
                    {architecturalStyles.map((style) => {
                      const Icon = style.icon;
                      return (
                        <Card
                          key={style.name}
                          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                            preferences.architecturalStyle === style.name
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setPreferences({ ...preferences, architecturalStyle: style.name as ArchitecturalStyle })}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-primary mt-1" />
                            <div>
                              <h4 className="font-semibold">{style.name}</h4>
                              <p className="text-sm text-muted-foreground">{style.description}</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Color Scheme</Label>
                  <div className="space-y-2">
                    {colorSchemes.map((scheme) => (
                      <Card
                        key={scheme.name}
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          preferences.colorScheme === scheme.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPreferences({ ...preferences, colorScheme: scheme.name as ColorScheme })}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{scheme.name}</span>
                          <div className="flex gap-2">
                            {scheme.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full border border-border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Special Features */}
          <div>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="text-xl font-semibold">Special Features</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Add special elements to your design</p>

              <div className="space-y-6">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="vastu"
                      checked={preferences.specialFeatures.includes(specialFeatures[0].label)}
                      onCheckedChange={() => handleFeatureToggle(specialFeatures[0].label)}
                    />
                    <div>
                      <Label htmlFor="vastu" className="text-base font-semibold cursor-pointer">
                        🕉️ Vastu Compliance
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {specialFeatures[0].label}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-accent" />
                    Eco-Friendly Features
                  </h4>
                  <div className="space-y-3">
                    {specialFeatures.slice(1).map((feature) => (
                      <div key={feature.id} className="flex items-start gap-3">
                        <Checkbox
                          id={feature.id}
                          checked={preferences.specialFeatures.includes(feature.label)}
                          onCheckedChange={() => handleFeatureToggle(feature.label)}
                        />
                        <Label htmlFor={feature.id} className="text-sm cursor-pointer leading-relaxed">
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating AI Design...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate AI Design
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
