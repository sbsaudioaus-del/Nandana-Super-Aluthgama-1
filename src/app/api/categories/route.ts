import { NextResponse } from "next/server";
import { getCategories, createCategory, getProducts } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const categories = getCategories();
    const products = getProducts();

    // Attach dynamic product counts
    const categoriesWithCount = categories.map((cat) => {
      const count = products.filter((p) => p.category_id === cat.id).length;
      return {
        ...cat,
        product_count: count,
      };
    });

    return NextResponse.json(categoriesWithCount);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const newCat = createCategory({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description || "",
      image_url: body.image_url || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(newCat, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
