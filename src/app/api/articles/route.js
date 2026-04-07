import { NextResponse } from 'next/server';
import { fetchFromAppwrite } from '@/appwrite';

export const revalidate = 60; // ISR - 60 saniyede bir yeniden oluştur

export async function GET() {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const articlesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID;

    if (!databaseId || !articlesCollectionId) {
      return NextResponse.json(
        { error: 'Eksik ortam değişkenleri' },
        { status: 500 }
      );
    }

    const response = await fetchFromAppwrite(
      'GET',
      `/databases/${databaseId}/collections/${articlesCollectionId}/documents`
    );

    return NextResponse.json(response.documents, {
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
