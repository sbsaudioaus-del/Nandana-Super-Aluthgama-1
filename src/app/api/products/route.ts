import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort"); // 'price_asc' | 'price_desc' | 'newest'
    const availableOnly = searchParams.get("available") === "true";
    const featured = searchParams.get("featured") === "true";

    let products = getProducts();

    if (availableOnly) {
      products = products.filter((p) => p.is_available);
    }

    if (featured) {
      products = products.filter((p) => p.is_featured);
    }

    if (category && category !== "all") {
      products = products.filter(
        (p) => p.category_id === category || p.category_name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else {
      // Default: newest
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return NextResponse.json(products);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
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
    if (!body.name || body.price === undefined || !body.category_id) {
      return NextResponse.json(
        { error: "Product name, price, and category are required" },
        { status: 400 }
      );
    }

    const newProduct = createProduct({
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      category_id: body.category_id,
      image_url: body.image_url || "/images/placeholder.jpg",
      stock_quantity: Number(body.stock_quantity || 1),
      is_available: body.is_available ?? true,
      is_featured: body.is_featured ?? false,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
