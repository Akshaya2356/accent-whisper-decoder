import { Play, Pause, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  file: File;
}

export const AudioPlayer = ({ file }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = volume;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
      <audio ref={audioRef} src={URL.createObjectURL(file)} />
      
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={togglePlay}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:shadow-glow transition-all"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{formatTime(currentTime)}</span>
            <span className="text-xs font-medium text-foreground">{file.name}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24 cursor-pointer"
          />
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="h-24 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center gap-1 h-full px-4">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-primary via-accent to-primary rounded-full transition-all duration-150"
              style={{
                height: `${Math.random() * (isPlaying ? 80 : 20) + 20}%`,
                opacity: isPlaying ? 0.8 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
