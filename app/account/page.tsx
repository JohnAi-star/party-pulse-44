"use client";

import { useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
    const { user, isSignedIn } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        notifications: {
            email: true,
            marketing: false,
        }
    });

    const handleProfileUpdate = async () => {
        try {
            setLoading(true);
            await user?.update({
                firstName: profileData.fullName.split(' ')[0],
                lastName: profileData.fullName.split(' ')[1] || '',
            });

            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update profile. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        try {
            setLoading(true);
            // In a real app, you would update these preferences in your backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

            toast({
                title: "Preferences Updated",
                description: "Your notification preferences have been saved.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update preferences. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isSignedIn) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
                <p className="text-muted-foreground mb-4">You need to be signed in to access your account settings.</p>
                <UserButton afterSignOutUrl="/account" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <UserButton afterSignOutUrl="/account" />
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and how it appears on your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-sm text-muted-foreground">
                                    To change your email, please visit your Clerk account settings.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what notifications you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive booking confirmations and updates.
                                    </p>
                                </div>
                                <Switch
                                    checked={profileData.notifications.email}
                                    onCheckedChange={(checked) =>
                                        setProfileData({
                                            ...profileData,
                                            notifications: { ...profileData.notifications, email: checked }
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive offers and updates about new activities.
                                    </p>
                                </div>
                                <Switch
                                    checked={profileData.notifications.marketing}
                                    onCheckedChange={(checked) =>
                                        setProfileData({
                                            ...profileData,
                                            notifications: { ...profileData.notifications, marketing: checked }
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="bg-gradient-to-r from-purple-600 to-pink-600"
                                onClick={handleNotificationUpdate}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Preferences
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your account security and authentication methods.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <p className="text-sm text-muted-foreground">
                                    Your password is managed through Clerk. Click below to update it.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        window.open("https://clerk.dev/account/security", "_blank");
                                    }}
                                >
                                    Change Password
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        window.open("https://clerk.dev/account/security", "_blank");
                                    }}
                                >
                                    Setup 2FA
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}