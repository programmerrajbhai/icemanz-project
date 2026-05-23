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

export async function updateProduct(productId: string, formData: FormData) {
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;
  const categoryId = formData.get('categoryId') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const condition = formData.get('condition') as string;
  const type = formData.get('type') as string;
  const badge = formData.get('badge') as string;
  const keyFeatures = formData.get('keyFeatures') as string;
  const brand = formData.get('brand') as string;
  const sku = formData.get('sku') as string;
  const imageFiles = formData.getAll('images') as File[];

  const existingImagesRaw = formData.get('existingImages') as string;
  let existingImages: string[] = [];
  if (existingImagesRaw) {
    try {
      existingImages = JSON.parse(existingImagesRaw);
    } catch {
      console.error("Failed to parse existing images JSON");
    }
  }

  // Parse arrays
  const warrantyRaw = formData.get('warranty') as string;
  const warranty = warrantyRaw ? warrantyRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const detailedFeaturesRaw = formData.get('detailedFeatures') as string;
  const detailedFeatures = detailedFeaturesRaw ? detailedFeaturesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  // Parse specs
  const specsRaw = formData.get('specs') as string;
  let specs: { label: string; value: string }[] = [];
  if (specsRaw) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      console.error("Failed to parse specs JSON");
    }
  }

  // Parse documents
  const existingDocsRaw = formData.get('existingDocuments') as string;
  let documents: { name: string; url: string }[] = [];
  if (existingDocsRaw) {
    try {
      documents = JSON.parse(existingDocsRaw);
    } catch {
      console.error("Failed to parse existing documents JSON");
    }
  }

  // Parse product options
  const productOptionsRaw = formData.get('productOptions') as string;
  let productOptions: any[] = [];
  if (productOptionsRaw) {
    try {
      productOptions = JSON.parse(productOptionsRaw);
    } catch {
      console.error("Failed to parse productOptions JSON");
    }
  }

  // Parse FAQs
  const faqsRaw = formData.get('faqs') as string;
  let faqs: any[] = [];
  if (faqsRaw) {
    try {
      faqs = JSON.parse(faqsRaw);
    } catch {
      console.error("Failed to parse faqs JSON");
    }
  }

  // Parse features
  const featuresRaw = formData.get('features') as string;
  let features: any = null;
  if (featuresRaw) {
    try {
      features = JSON.parse(featuresRaw);
    } catch {
      console.error("Failed to parse features JSON");
    }
  }

  if (!title) {
    return { error: 'Title is required' };
  }

  if (!slug) {
    slug = slugify(title);
  }

  // Handle images
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { images: true },
  });

  const previouslyStoredImages = existingProduct?.images || [];

  // Find images that were deleted
  const imagesToDelete = previouslyStoredImages.filter(img => !existingImages.includes(img));

  if (imagesToDelete.length > 0) {
    const supabase = getSupabase();
    try {
      const fileNames = imagesToDelete.map((url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      await supabase.storage.from('product-images').remove(fileNames);
    } catch (e) {
      console.error("Failed to delete old images:", e);
    }
  }

  let finalImages = [...existingImages];

  // Upload new images
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const url = await uploadFile(file, 'product-images');
      if (url) {
        finalImages.push(url);
      }
    }
  }

  // Upload new PDFs
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
    await prisma.product.update({
      where: { id: productId },
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
        brand,
        sku,
        warranty,
        detailedFeatures,
        specs: specs.length > 0 ? specs : undefined,
        documents: documents.length > 0 ? documents : undefined,
        productOptions: productOptions.length > 0 ? productOptions : undefined,
        faqs: faqs.length > 0 ? faqs : undefined,
        features: features && Object.keys(features).length > 0 ? features : undefined,
        images: finalImages,
      }
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    return { error: `Failed to update product: ${error.message}` };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/refrigeration-equipment');
  redirect('/admin/products');
}
