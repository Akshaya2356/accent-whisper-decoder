import { Upload, FileAudio } from "lucide-react";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
}

export const AudioUploader = ({ onFileSelect }: AudioUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const audioFile = files.find((file) =>
        file.type.startsWith("audio/")
      );

      if (audioFile) {
        onFileSelect(audioFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file",
          variant: "destructive",
        });
      }
    },
    [onFileSelect, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      }`}
    >
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="audio-upload"
      />
      <label
        htmlFor="audio-upload"
        className="flex flex-col items-center gap-4 cursor-pointer"
      >
        <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
          <FileAudio className="w-12 h-12 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground mb-1">
            Upload Audio File
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports MP3, WAV, M4A and other audio formats
          </p>
        </div>
      </label>
    </div>
  );
};
