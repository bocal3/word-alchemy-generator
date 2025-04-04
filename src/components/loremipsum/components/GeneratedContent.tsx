
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GeneratedContentProps {
  generatedText: string[];
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ generatedText }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  if (generatedText.length === 0) {
    return null;
  }

  const handleCopy = () => {
    const textToCopy = generatedText.join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    
    toast({
      title: "Texte copié !",
      description: "Le texte généré a été copié dans le presse-papiers."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Texte généré</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy} 
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier
            </>
          )}
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto p-2">
        {generatedText.map((paragraph, index) => (
          <p key={index} className="text-sm text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default GeneratedContent;
