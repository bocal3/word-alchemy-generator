import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { importDictionary } from "@/utils/dictionaryUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DictionaryImportExportProps {
  onImport?: () => void;
}

export const DictionaryImportExport: React.FC<DictionaryImportExportProps> = ({ onImport }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const success = await importDictionary(file);
      if (success) {
        toast({
          title: t('alert.success'),
          description: t('alert.import.success'),
        });
        onImport?.();
      }
    } catch (error) {
      toast({
        title: t('alert.error'),
        description: t('alert.import.error'),
        variant: "destructive",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
      >
        <Upload className="mr-2 h-4 w-4" />
        {t('dictionary.import')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // L'export est géré directement dans saveDictionary
          toast({
            title: t('alert.info'),
            description: t('alert.export.info'),
          });
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        {t('dictionary.export')}
      </Button>
    </div>
  );
}; 