
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export function SaveReminder() {
  const { t } = useLanguage();
  
  return (
    <Alert className="mt-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        {t('alert.save.reminder')}
      </AlertDescription>
    </Alert>
  );
}
