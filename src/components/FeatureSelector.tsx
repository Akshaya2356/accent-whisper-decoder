import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureSelectorProps {
  selected: "hubert" | "mfcc";
  onSelect: (method: "hubert" | "mfcc") => void;
}

export const FeatureSelector = ({ selected, onSelect }: FeatureSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Feature Extraction Method</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card
          onClick={() => onSelect("hubert")}
          className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-medium ${
            selected === "hubert"
              ? "border-primary shadow-glow bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-foreground">HuBERT</h4>
            {selected === "hubert" && (
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                Selected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Self-supervised speech representation learning for capturing accent patterns
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs font-medium text-accent">Recommended</span>
          </div>
        </Card>

        <Card
          onClick={() => onSelect("mfcc")}
          className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-medium ${
            selected === "mfcc"
              ? "border-primary shadow-glow bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-foreground">MFCC</h4>
            {selected === "mfcc" && (
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                Selected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Traditional acoustic features for speech analysis and classification
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground">Classic Method</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
