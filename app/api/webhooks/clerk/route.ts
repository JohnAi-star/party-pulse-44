import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('No email found for user');
      return new Response('No email found for user', { status: 400 });
    }

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingProfile) {
        // Create new profile if it doesn't exist
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
      console.error('Error upserting user profile:', error);
      return new Response('Error creating user profile', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};