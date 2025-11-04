import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioUploader } from "@/components/AudioUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FeatureSelector } from "@/components/FeatureSelector";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ComparativeAnalysis } from "@/components/ComparativeAnalysis";
import { Loader2, Wand2, Globe2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [featureMethod, setFeatureMethod] = useState<"hubert" | "mfcc">("hubert");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    setResults(null);

    try {
      const { processAudio } = await import('@/lib/audioProcessing');
      const prediction = await processAudio(audioFile, featureMethod);
      setResults(prediction);

      toast({
        title: "Analysis Complete",
        description: `Detected native language with ${(prediction.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setResults(null);
    setFeatureMethod("hubert");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Native Language Identifier
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Accent Detection for Indian English Speakers
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          {!audioFile && !results && (
            <div className="text-center mb-12 animate-in fade-in duration-500">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Identify Native Language from Speech
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Upload an audio file and our AI will analyze the accent patterns to predict
                the speaker's native language using advanced machine learning models
              </p>
            </div>
          )}

          {/* Upload Section */}
          {!audioFile && (
            <div className="animate-in slide-in-from-bottom duration-500">
              <AudioUploader onFileSelect={setAudioFile} />
            </div>
          )}

          {/* Processing Section */}
          {audioFile && !results && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Audio Analysis</h3>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-border hover:border-primary/50"
                >
                  Upload Different File
                </Button>
              </div>

              <AudioPlayer file={audioFile} />

              <FeatureSelector selected={featureMethod} onSelect={setFeatureMethod} />

              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all text-lg py-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Accent Patterns...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Analyze Audio
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Analysis Results</h3>
                <Button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all"
                >
                  Analyze Another Audio
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResultsDisplay prediction={results} />
                <ComparativeAnalysis prediction={results} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">
            Powered by HuBERT embeddings and MFCC feature extraction
          </p>
          <p>
            Native Language Identification using IndicAccentDb • Comparative analysis of accent modeling techniques
          </p>
          <p className="text-xs">
            Analyzing phonetic, prosodic, and spectral features to identify L1 influence on Indian English speech
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
