import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  
  // Verify the secret to prevent unauthorized revalidation
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  
  const { path, tag } = await request.json();
  
  try {
    if (path) {
      revalidatePath(path);
    }
    if (tag) {
      revalidateTag(tag);
    }
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now() 
    });
  } catch (error) {
    return NextResponse.json({ 
      revalidated: false, 
      error: 'Error revalidating' 
    }, { status: 500 });
  }
}

export const runtime = 'edge';
export const preferredRegion = 'ams1';
