import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import AsyncState from '../components/AsyncState';
import { Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading, isError, error } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const isAuthenticated = !!identity;

  const handleEdit = () => {
    setDisplayName(profile?.displayName || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (displayName.trim()) {
      await saveProfile.mutateAsync(displayName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName('');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-muted-foreground mb-6">Please log in to view your profile and stats.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

      <AsyncState isLoading={isLoading} isError={isError} error={error}>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Information
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={30}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={!displayName.trim() || saveProfile.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      {saveProfile.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <Label>Display Name</Label>
                  <p className="text-2xl font-bold">{profile?.displayName || 'Unknown'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Runs Played</Label>
                  <p className="text-3xl font-bold">{Number(profile?.stats.runsPlayed || 0).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Best Score</Label>
                  <p className="text-3xl font-bold text-primary">{Number(profile?.stats.bestScore || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AsyncState>
    </div>
  );
}
