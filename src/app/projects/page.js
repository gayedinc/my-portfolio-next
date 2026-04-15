'use client';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Project from '../../components/Project';

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <Suspense fallback={<div className="loading">{t('projects_loading')}</div>}>
        <Project variant="editorial" />
      </Suspense>
    </>
  );
} 