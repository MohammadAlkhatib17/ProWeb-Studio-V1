import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Contact route reached!');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Return success for now
    return NextResponse.json({ 
      ok: true, 
      message: 'Bericht succesvol verzonden' 
    });
    
  } catch (error) {
    console.error('Error in contact route:', error);
    return NextResponse.json(
      { ok: false, error: 'Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }
}