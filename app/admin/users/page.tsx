'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, Ban, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
  publicMetadata: { role?: string };
  createdAt: number;
  lastSignInAt: number | null;
  banned: boolean;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useUser();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      toast({ title: 'Success', description: 'User role updated successfully' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update role',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      setUpdating(userId);
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ban }),
      });

      if (!response.ok) throw new Error(ban ? 'Failed to ban user' : 'Failed to unban user');

      toast({ title: 'Success', description: `User ${ban ? 'banned' : 'unbanned'} successfully` });
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user status',
      });
    } finally {
      setUpdating(null);
    }
  };

  const toggleExpandUser = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const filteredUsers = users
    .filter(user => {
      const searchTerm = searchQuery.toLowerCase();
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = user.emailAddresses[0]?.emailAddress.toLowerCase() || '';
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    })
    .filter(user => roleFilter === 'all' || user.publicMetadata?.role === roleFilter);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isMobileView ? (
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="relative">
                <CardHeader 
                  className="pb-2 cursor-pointer" 
                  onClick={() => toggleExpandUser(user.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.imageUrl} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </div>
                    {expandedUser === user.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
                {expandedUser === user.id && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge variant={user.publicMetadata?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.publicMetadata?.role || 'user'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={user.banned ? 'destructive' : 'default'}>
                          {user.banned ? 'Banned' : 'Active'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Active</p>
                        <p>
                          {user.lastSignInAt 
                            ? new Date(user.lastSignInAt).toLocaleString() 
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                    {user.id !== currentUser?.id && (
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updating === user.id}
                          onClick={() => 
                            handleRoleUpdate(
                              user.id, 
                              user.publicMetadata?.role === 'admin' ? 'user' : 'admin'
                            )
                          }
                        >
                          {updating === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          {user.publicMetadata?.role === 'admin' ? 'Demote' : 'Promote'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updating === user.id}
                          onClick={() => handleBanUser(user.id, !user.banned)}
                        >
                          {updating === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Ban className="h-4 w-4 mr-2" />
                          )}
                          {user.banned ? 'Unban' : 'Ban'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="h-24 flex items-center justify-center">
                <p className="text-muted-foreground">No users found</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px] md:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-3">
                        <img 
                          src={user.imageUrl} 
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-8 w-8 rounded-full"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="line-clamp-1">
                                {user.firstName} {user.lastName}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.firstName} {user.lastName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="line-clamp-1">
                                {user.emailAddresses[0]?.emailAddress}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{user.emailAddresses[0]?.emailAddress}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.publicMetadata?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.publicMetadata?.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.banned ? 'destructive' : 'default'}>
                          {user.banned ? 'Banned' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.lastSignInAt 
                          ? new Date(user.lastSignInAt).toLocaleString() 
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.id !== currentUser?.id && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updating === user.id}
                              onClick={() => 
                                handleRoleUpdate(
                                  user.id, 
                                  user.publicMetadata?.role === 'admin' ? 'user' : 'admin'
                                )
                              }
                            >
                              {updating === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Shield className="h-4 w-4 mr-2" />
                              )}
                              {user.publicMetadata?.role === 'admin' ? 'Demote' : 'Promote'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updating === user.id}
                              onClick={() => handleBanUser(user.id, !user.banned)}
                            >
                              {updating === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Ban className="h-4 w-4 mr-2" />
                              )}
                              {user.banned ? 'Unban' : 'Ban'}
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}