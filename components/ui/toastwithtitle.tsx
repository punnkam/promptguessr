'use client';

import { useToast } from '@/hooks/ui/usetoast';

import { Button } from '@/components/ui/button';

export function ToastWithTitle() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Submission Successful!',
          description: 'Check below to see your score',
        });
      }}
    >
      Show Toast
    </Button>
  );
}
