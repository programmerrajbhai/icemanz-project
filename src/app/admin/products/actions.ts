'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function deleteProduct(productId: string) {
  try {
    // Fetch product to get image URLs for cleanup
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { images: true },
    });

    if (!product) {
      return { error: 'Product not found' };
    }

    // Delete images from Supabase storage if any exist
    if (product.images.length > 0) {
      try {
        const supabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const fileNames = product.images.map((url) => {
          const parts = url.split('/');
          return parts[parts.length - 1];
        });

        await supabase.storage
          .from('product-images')
          .remove(fileNames);
      } catch (storageError) {
        console.error("Failed to delete images from storage:", storageError);
        // Continue with product deletion even if image cleanup fails
      }
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return { error: `Failed to delete product: ${error.message}` };
  }
}
