'use client';

import { useToast } from '@/hooks/ui/usetoast';

import { Button } from '@/components/ui/button';

export function ToastWithTitle({ title, description }: any) {
    const { toast } = useToast();

    return (
        <Button
            onClick={() => {
                toast({
                    title: title,
                    description: description,
                });
            }}
        >
            Show Toast
        </Button>
    );
}
