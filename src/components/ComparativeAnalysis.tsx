import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Waves, TrendingUp, Layers } from "lucide-react";

interface AnalysisProps {
  prediction: {
    language: string;
    confidence: number;
    method: string;
    features: string;
    layerAnalysis?: {
      totalLayers: number;
      bestLayer: number;
      layerInsights: Array<{
        layer: number;
        score: number;
        description: string;
      }>;
    };
  };
}

export const ComparativeAnalysis = ({ prediction }: AnalysisProps) => {
  const isHubert = prediction.method === "hubert";

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Method Overview */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            {isHubert ? <Brain className="h-5 w-5 text-primary" /> : <Waves className="h-5 w-5 text-primary" />}
            <CardTitle>Analysis Method: {prediction.method.toUpperCase()}</CardTitle>
          </div>
          <CardDescription>
            {isHubert 
              ? "HuBERT embeddings capture deep phonetic and prosodic features for accent detection"
              : "MFCC features analyze spectral characteristics and acoustic patterns"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Feature Type</span>
              <Badge variant="secondary">{prediction.features}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confidence Score</span>
              <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer-wise Analysis for HuBERT */}
      {isHubert && prediction.layerAnalysis && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle>HuBERT Layer-wise Analysis</CardTitle>
            </div>
            <CardDescription>
              Insights from different transformer layers encoding accent cues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Total Layers</span>
                <Badge variant="outline">{prediction.layerAnalysis.totalLayers}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Best Performing Layer</span>
                <Badge className="bg-primary">{prediction.layerAnalysis.bestLayer}</Badge>
              </div>
              
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Top Layer Representations
                </h4>
                {prediction.layerAnalysis.layerInsights.map((insight) => (
                  <div key={insight.layer} className="p-3 border rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Layer {insight.layer}</span>
                      <Badge variant="secondary">{(insight.score * 100).toFixed(0)}%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Insights */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Feature Insights</CardTitle>
          <CardDescription>
            Understanding how {isHubert ? "HuBERT" : "MFCC"} captures accent characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {isHubert ? (
              <>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Phonetic Encoding:</span> HuBERT's self-supervised learning captures subtle phonetic variations influenced by L1 (native language)
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Prosodic Patterns:</span> Deep layers encode rhythm, intonation, and stress patterns characteristic of Indian English accents
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Contextual Features:</span> Transformer architecture captures long-range dependencies in speech that reveal L1 influence
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Spectral Analysis:</span> MFCCs capture frequency characteristics shaped by vowel quality and consonant articulation
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Acoustic Patterns:</span> Mel-frequency cepstral coefficients reveal acoustic traces of native language phonology
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Temporal Features:</span> Frame-level analysis captures speaking rate and rhythm variations across accents
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generalization Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Model Generalization</h4>
            <p className="text-xs text-muted-foreground">
              This model analyzes accent patterns from IndicAccentDb dataset covering diverse age groups and linguistic proficiency levels. 
              The {isHubert ? "HuBERT embeddings provide robust" : "MFCC features offer reliable"} accent identification across speaker variations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
