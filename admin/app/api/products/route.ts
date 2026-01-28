/**
 * Next.js API Route - Proxy to Cloudflare Workers
 * This allows the frontend to make requests without CORS issues
 */

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:8787'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/products`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
