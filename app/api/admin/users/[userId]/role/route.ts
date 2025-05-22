import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the current user is an admin
    const currentUser = await clerkClient.users.getUser(currentUserId);
    if (currentUser.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent self-demotion
    if (params.userId === currentUserId) {
      return NextResponse.json(
        { error: 'You cannot modify your own role' },
        { status: 400 }
      );
    }

    const { role } = await request.json();

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Update the user's role
    await clerkClient.users.updateUser(params.userId, {
      publicMetadata: { ...currentUser.publicMetadata, role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}