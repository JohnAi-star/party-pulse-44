import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Webhook } from 'svix';

// Enable dynamic behavior for webhook endpoint
export const dynamic = 'force-dynamic';
export const preferredRegion = 'home';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Get headers for verification
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  // Get and stringify the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies });

  // Handle specific event types
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response('Missing email in event data', { status: 400 });
    }

    try {
      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingProfile) {
        // Insert new profile
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id,
            email,
            name: [first_name, last_name].filter(Boolean).join(' '),
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
      }

      return new Response(JSON.stringify(existingProfile), { status: 200 });
    } catch (error) {
      console.error('Error upserting profile:', error);
      return new Response('Error creating/updating user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
export const dynamicParams = false;
export const revalidate = 0; // Disable caching for webhook responses