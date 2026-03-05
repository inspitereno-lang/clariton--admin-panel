import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, User as UserIcon, Palette, Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { userService } from '@/services/userService';
import type { User } from '@/types';
import { toast } from 'sonner';

export function Settings() {
  const { isGrayscale, toggleGrayscale } = useTheme();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const [firstName, lastName] = profile?.fullName?.split(' ') || ['', ''];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header
        title="Settings"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]}
      />

      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Settings */}
          <Card className="border-0 shadow-sm bg-card text-card-foreground">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-red-500" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {profile?.role !== 'admin' && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input id="firstName" defaultValue={firstName} className="mt-2 bg-background border-input" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input id="lastName" defaultValue={lastName} className="mt-2 bg-background border-input" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" defaultValue={profile?.Phone || ''} className="mt-2 bg-background border-input" />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input id="email" type="email" defaultValue={profile?.Email} className="mt-2 bg-background border-input" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-sm bg-card text-card-foreground">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Order Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-0 shadow-sm bg-card text-card-foreground">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-red-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Black & White Mode</p>
                  <p className="text-sm text-muted-foreground">Apply grayscale filter to the entire UI</p>
                </div>
                <Switch checked={isGrayscale} onCheckedChange={toggleGrayscale} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                <Input id="currentPassword" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                <Input id="newPassword" type="password" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="mt-2" />
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
