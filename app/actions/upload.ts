'use server'

export async function uploadPdfAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Generate a unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return { error: 'Supabase credentials not configured on the server.' };
    }

    const buffer = await file.arrayBuffer();

    const response = await fetch(`${supabaseUrl}/storage/v1/object/learnx-pdfs/${uniqueFilename}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': file.type || 'application/pdf',
      },
      body: buffer,
    });

    if (!response.ok) {
      const err = await response.text();
      return { error: `Failed to upload to Supabase: ${err}` };
    }

    // Return the public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/learnx-pdfs/${uniqueFilename}`;
    return { url: publicUrl };

  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during upload' };
  }
}
