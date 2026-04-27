'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function uploadFile(file: File, bucket: string): Promise<string | null> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error(`Upload Error (${bucket}):`, error);
    return null;
  }

  if (data) {
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }
  return null;
}

export async function createProduct(formData: FormData) {
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  const categoryId = formData.get('categoryId') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const condition = formData.get('condition') as string;
  const type = formData.get('type') as string;
  const badge = formData.get('badge') as string;
  const keyFeatures = formData.get('keyFeatures') as string;
  const imageFiles = formData.getAll('images') as File[];

  // Parse warranty items (comma-separated)
  const warrantyRaw = formData.get('warranty') as string;
  const warranty = warrantyRaw ? warrantyRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  // Parse detailed features (newline-separated)
  const detailedFeaturesRaw = formData.get('detailedFeatures') as string;
  const detailedFeatures = detailedFeaturesRaw ? detailedFeaturesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  // Parse specs (JSON-like pairs from form)
  const specsRaw = formData.get('specs') as string;
  let specs: { label: string; value: string }[] = [];
  if (specsRaw) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      // Try parsing line-by-line "label: value" format
      specs = specsRaw.split('\n').map(line => {
        const [label, ...rest] = line.split(':');
        return { label: label?.trim() || '', value: rest.join(':')?.trim() || '' };
      }).filter(s => s.label && s.value);
    }
  }

  if (!title) {
    return { error: 'Title is required' };
  }

  if (!slug) {
    slug = slugify(title);
  }

  // Upload product images
  const finalImages: string[] = [];
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const url = await uploadFile(file, 'product-images');
      if (url) {
        finalImages.push(url);
      }
    }
  }

  // Upload PDF documents
  const documents: { name: string; url: string }[] = [];
  const docFiles = formData.getAll('documents') as File[];
  const docNames = formData.getAll('documentNames') as string[];

  for (let i = 0; i < docFiles.length; i++) {
    const file = docFiles[i];
    if (file && file.size > 0) {
      const url = await uploadFile(file, 'product-images');
      if (url) {
        const name = docNames[i] || file.name.replace(/\.[^/.]+$/, '');
        documents.push({ name, url });
      }
    }
  }

  try {
    await prisma.product.create({
      data: {
        title,
        slug,
        categoryId: categoryId || null,
        price,
        description,
        condition,
        type,
        badge,
        keyFeatures,
        images: finalImages,
        warranty,
        detailedFeatures,
        specs: specs.length > 0 ? specs : undefined,
        documents: documents.length > 0 ? documents : undefined,
      }
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    return { error: `Failed to create product in database: ${error.message}` };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/refrigeration-equipment');
  redirect('/admin/products');
}
