import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight, Bookmark, StickyNote, Clock, CheckCircle, X } from "lucide-react";
import type { TheorySlide } from "@/types";
import { t } from "@/lib/translations";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TheoryViewer({ progress }: { progress?: any }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [bookmarkedSlides, setBookmarkedSlides] = useState<Set<number>>(new Set());
  const [slideNotes, setSlideNotes] = useState<Record<number, string>>({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNoteText, setCurrentNoteText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: slides = [], isLoading } = useQuery<TheorySlide[]>({
    queryKey: ['/api/student/theory'],
    queryFn: async () => {
      const response = await fetch('/api/student/theory', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch theory content');
      return response.json();
    }
  });

  const completeTheoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/student/theory/complete', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (data: { success: boolean; theoryToTest: boolean }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/progress'] });
      
      if (data.theoryToTest) {
        // Theory to test is enabled - redirect to test
        toast({
          title: t('theoryCompleted'),
          description: t('redirectingToTest') + "..."
        });
        setTimeout(() => {
          window.location.href = '/student/test';
        }, 2000);
      } else {
        // Theory to test is disabled - redirect to certificate/completion
        toast({
          title: t('theoryCompleted'),
          description: "Přesměrování na dokončení kurzu..."
        });
        setTimeout(() => {
          window.location.href = '/student/certificate';
        }, 2000);
      }
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (slides.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No theory content available for this course.</p>
        </CardContent>
      </Card>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progressPercentage = ((currentSlideIndex + 1) / slides.length) * 100;
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const isFirstSlide = currentSlideIndex === 0;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (!progress?.theoryCompleted) {
      completeTheoryMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleBookmark = () => {
    const newBookmarks = new Set(bookmarkedSlides);
    if (newBookmarks.has(currentSlide.id)) {
      newBookmarks.delete(currentSlide.id);
    } else {
      newBookmarks.add(currentSlide.id);
    }
    setBookmarkedSlides(newBookmarks);
  };

  const openNoteModal = () => {
    setCurrentNoteText(slideNotes[currentSlide.id] || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    setSlideNotes(prev => ({
      ...prev,
      [currentSlide.id]: currentNoteText
    }));
    setShowNoteModal(false);
    toast({
      title: "Úspěch",
      description: "Poznámka byla přidána"
    });
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        {/* Progress Navigation */}
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <Button
            onClick={handlePrevious}
            disabled={isFirstSlide}
            variant="ghost"
            className="flex items-center gap-2 text-emerald-700 hover:bg-emerald-50"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('previousQuestion')}
          </Button>
          <div className="flex items-center space-x-4 flex-1 mx-6">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Slide {currentSlideIndex + 1} {t('of')} {slides.length}
            </span>
            <Progress value={progressPercentage} className="flex-1 h-2" />
          </div>
          <Button
            onClick={handleNext}
            disabled={completeTheoryMutation.isPending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLastSlide ? (
              progress?.theoryCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
Dokončeno
                </>
              ) : (
                <>
                  {completeTheoryMutation.isPending ? t('loading') : t('completeTheory')}
                  <CheckCircle className="h-4 w-4" />
                </>
              )
            ) : (
              <>
                {t('nextQuestion')}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Slide Content */}
        <div className="theory-content max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentSlide.title || `Slide ${currentSlide.slideOrder}`}
          </h2>
          
          {/* Render slide content */}
          <div 
            className="theory-text text-lg text-gray-700 mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: currentSlide.content || 'No content available for this slide.' 
            }}
          />

          {/* Media content if available */}
          {currentSlide.mediaUrls && Array.isArray(currentSlide.mediaUrls) && currentSlide.mediaUrls.length > 0 && (
            <div className="theory-media mb-8 space-y-6">
              {currentSlide.mediaUrls.map((url: string, index: number) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={url}
                    alt={`Slide ${currentSlide.slideOrder} media ${index + 1}`}
                    className="max-w-full max-h-96 rounded-xl shadow-lg border border-gray-200 transition-transform hover:scale-105 cursor-zoom-in"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleBookmark}
              variant="ghost"
              className={`text-sm ${bookmarkedSlides.has(currentSlide.id) ? 'text-primary' : 'text-gray-600'} hover:text-primary`}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${bookmarkedSlides.has(currentSlide.id) ? 'fill-current' : ''}`} />
              {bookmarkedSlides.has(currentSlide.id) ? t('bookmarked') : t('bookmark')}
            </Button>
            <Button 
              onClick={openNoteModal}
              variant="ghost" 
              className={`text-sm ${slideNotes[currentSlide.id] ? 'text-primary' : 'text-gray-600'} hover:text-primary`}
            >
              <StickyNote className={`h-4 w-4 mr-2 ${slideNotes[currentSlide.id] ? 'fill-current' : ''}`} />
              {slideNotes[currentSlide.id] ? t('editNote') : t('addNote')}
            </Button>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Estimated time: {currentSlide.estimatedReadTime} minutes
          </div>
        </div>
      </CardContent>
      
      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{t('addNote')}</h3>
              <Button
                onClick={() => setShowNoteModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <Label htmlFor="note" className="text-sm font-medium">
                {t('notes')} pro slide {currentSlideIndex + 1}:
              </Label>
              <Textarea
                id="note"
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder={`${t('addNote')}...`}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
                onClick={() => setShowNoteModal(false)}
                variant="outline"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={saveNote}
                className="bg-primary hover:bg-primary-dark"
              >
                {t('saveNote')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
