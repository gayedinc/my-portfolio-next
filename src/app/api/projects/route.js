import { NextResponse } from 'next/server';
import { getProjects } from '@/appwrite';

export const revalidate = 60; // ISR - 60 saniyede bir yeniden oluştur

export async function GET() {
  try {
    return NextResponse.json(await getProjects(), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Projeler API hatası:', error);
    return NextResponse.json(
      { error: 'Projeler yüklenemedi', details: error.message },
      { status: 500 }
    );
  }
}
