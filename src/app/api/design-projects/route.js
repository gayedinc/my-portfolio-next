import { NextResponse } from 'next/server';
import { getAppwriteStorageFileUrl, getDesignProjects } from '@/appwrite';

export const revalidate = 60;

export async function GET() {
  try {
    const designProjects = (await getDesignProjects()).map((project) => ({
      ...project,
      heroImageUrl: getAppwriteStorageFileUrl(project.heroImageId),
    }));

    return NextResponse.json(designProjects, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('UI/UX projeleri API hatası:', error);
    return NextResponse.json(
      { error: 'UI/UX projeleri yüklenemedi', details: error.message },
      { status: 500 }
    );
  }
}
