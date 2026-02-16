import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '../state/settingsStore';
import { Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';

export default function SettingsPage() {
  const { soundEnabled, reducedMotion, toggleSound, toggleReducedMotion } = useSettingsStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Audio</CardTitle>
            <CardDescription>Control sound effects and music</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <Label htmlFor="sound">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable game sounds</p>
                </div>
              </div>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>Customize your gameplay experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {reducedMotion ? <ZapOff className="w-5 h-5 text-muted-foreground" /> : <Zap className="w-5 h-5" />}
                <div>
                  <Label htmlFor="motion">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and visual effects</p>
                </div>
              </div>
              <Switch id="motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
