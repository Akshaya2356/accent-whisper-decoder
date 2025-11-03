import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { languages, getCuisineRecommendations } from "@/lib/languages";

interface ResultsDisplayProps {
  prediction: {
    language: string;
    confidence: number;
    allScores: Array<{ language: string; score: number }>;
  };
}

export const ResultsDisplay = ({ prediction }: ResultsDisplayProps) => {
  const languageData = languages.find((l) => l.code === prediction.language);
  const cuisines = getCuisineRecommendations(prediction.language);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Main Prediction */}
      <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="mb-2 bg-success text-success-foreground">
              Predicted Native Language
            </Badge>
            <h3 className="text-3xl font-bold text-foreground">
              {languageData?.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {languageData?.region}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
              {(prediction.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Confidence</p>
          </div>
        </div>
        <Progress value={prediction.confidence * 100} className="h-2" />
      </Card>

      {/* All Predictions */}
      <Card className="p-6">
        <h4 className="font-semibold text-foreground mb-4">All Language Scores</h4>
        <div className="space-y-3">
          {prediction.allScores.map((score) => {
            const lang = languages.find((l) => l.code === score.language);
            return (
              <div key={score.language} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {lang?.name}
                  </span>
                  <span className="text-muted-foreground">
                    {(score.score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={score.score * 100} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Cuisine Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
            Personalized Recommendation
          </Badge>
        </div>
        <h4 className="text-xl font-semibold text-foreground mb-2">
          Suggested Cuisines from {languageData?.region}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Based on detected accent, here are authentic regional dishes you might enjoy
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.name}
              className="p-4 rounded-lg bg-card border border-border hover:border-accent/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cuisine.emoji}</span>
                <div>
                  <h5 className="font-semibold text-foreground">{cuisine.name}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cuisine.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
