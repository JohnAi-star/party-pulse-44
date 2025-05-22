import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const minGuests = searchParams.get('minGuests');
    const maxGuests = searchParams.get('maxGuests');

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('suppliers')
      .select(`
        *,
        supplier_services (
          id,
          name,
          description,
          price,
          min_guests,
          max_guests
        )
      `);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: suppliers, error } = await query;

    if (error) {
      console.error('Error fetching suppliers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch suppliers' },
        { status: 500 }
      );
    }

    // Filter by guest count if specified
    let filteredSuppliers = suppliers;
    if (minGuests || maxGuests) {
    interface SupplierService {
      id: number;
      name: string;
      description: string;
      price: number;
      min_guests: number;
      max_guests: number;
    }

    interface Supplier {
      [key: string]: any;
      supplier_services: SupplierService[];
    }

    const suppliersTyped: Supplier[] = suppliers as Supplier[];

    filteredSuppliers = suppliersTyped.filter((supplier: Supplier) =>
      supplier.supplier_services.some((service: SupplierService) => {
        const meetsMin = !minGuests || service.min_guests <= parseInt(minGuests);
        const meetsMax = !maxGuests || service.max_guests >= parseInt(maxGuests);
        return meetsMin && meetsMax;
      })
    );
    }

    return NextResponse.json(filteredSuppliers);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supplierData = await request.json();

    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();

    if (error) {
      console.error('Error creating supplier:', error);
      return NextResponse.json(
        { error: 'Failed to create supplier' },
        { status: 500 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}