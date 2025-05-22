import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await clerkClient.users.getUser(userId);
    if (currentUser.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users with pagination
    const users = await clerkClient.users.getUserList({
      limit: 100, // Adjust based on your needs
      orderBy: '-created_at',
    });

    // Format the response
    const formattedUsers = users.data.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses,
      imageUrl: user.imageUrl,
      publicMetadata: user.publicMetadata,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      banned: user.banned,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}