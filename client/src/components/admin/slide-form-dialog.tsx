import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "./rich-text-editor";
import type { TheorySlide } from "@/types";
import { t } from "@/lib/translations";

interface SlideFormDialogProps {
  slide?: TheorySlide | null;
  onSave: (data: any) => void;
  isLoading: boolean;
}

export default function SlideFormDialog({ slide, onSave, isLoading }: SlideFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slideOrder: 1,
    estimatedReadTime: 2
  });

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || '',
        content: slide.content || '',
        slideOrder: slide.slideOrder || 1,
        estimatedReadTime: slide.estimatedReadTime || 2
      });
    } else {
      setFormData({
        title: '',
        content: '',
        slideOrder: 1,
        estimatedReadTime: 2
      });
    }
  }, [slide]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" aria-describedby="slide-form-description">
      <DialogHeader>
        <DialogTitle className="text-gray-900 dark:text-white">
          {slide ? t('editSlide') : t('addSlide')}
        </DialogTitle>
        <div id="slide-form-description" className="text-sm text-gray-600 dark:text-gray-400">
          {t('richTextEditorDescription')}
        </div>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">{t('slideTitle')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('slideTitle')}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="estimatedReadTime">{t('estimatedReadTime')}</Label>
            <Input
              id="estimatedReadTime"
              type="number"
              min="1"
              max="30"
              value={formData.estimatedReadTime}
              onChange={(e) => setFormData({ ...formData, estimatedReadTime: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>



        <div>
          <Label htmlFor="content">Content</Label>
          <div className="mt-2">
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Enter slide content. You can add images, formatting, and more..."
              height={300}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark"
          >
            {isLoading ? 'Saving...' : (slide ? 'Update Slide' : 'Create Slide')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}