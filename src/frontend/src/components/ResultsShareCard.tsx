import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { renderCardToImage, downloadBlob } from '../utils/renderCardToImage';

interface ResultsShareCardProps {
  score: number;
  mode: string;
  rank?: number;
}

export default function ResultsShareCard({ score, mode, rank }: ResultsShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = `I scored ${score.toLocaleString()} points in Velocity Shift ${mode} mode!${
    rank ? ` Rank #${rank}` : ''
  } Can you beat my score?`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await renderCardToImage(cardRef.current);
      downloadBlob(blob, `velocity-shift-${score}.png`);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="space-y-4">
      <Card ref={cardRef} className="bg-gradient-to-br from-card to-accent">
        <CardHeader>
          <CardTitle className="text-center">Your Score</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-5xl font-bold text-primary">{score.toLocaleString()}</div>
          <div className="text-muted-foreground">
            {mode} Mode {rank && `• Rank #${rank}`}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
      </div>
    </div>
  );
}
