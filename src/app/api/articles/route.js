import { NextResponse } from 'next/server';
import { getArticles } from '@/appwrite';

export const revalidate = 60; // ISR - 60 saniyede bir yeniden oluştur

export async function GET() {
  try {
    return NextResponse.json(await getArticles(), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Makaleler API hatası:', error);
    return NextResponse.json(
      { error: 'Makaleler yüklenemedi', details: error.message },
      { status: 500 }
    );
  }
}
