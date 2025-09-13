import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { getAuthHeaders } from '@/lib/auth'
import { apiRequest } from '@/lib/queryClient'
import { ChevronLeft, ChevronRight, Bookmark, StickyNote, Clock, CheckCircle, X, BookOpen } from 'lucide-react'
import type { TheorySlide } from '@/types'
import { t } from '@/lib/translations'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { LoadingScreen, Spinner } from '@/components/ui/spinner'

const TheoryViewer = ({ progress }: { progress?: any }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [bookmarkedSlides, setBookmarkedSlides] = useState<Set<number>>(new Set())
  const [slideNotes, setSlideNotes] = useState<Record<number, string>>({})
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [currentNoteText, setCurrentNoteText] = useState('')
  const [currentNoteSlideId, setCurrentNoteSlideId] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [, setLocation] = useLocation()

  const { data: slides = [], isLoading } = useQuery<TheorySlide[]>({
    queryKey: ['/api/student/theory'],
    queryFn: async () => {
      const response = await fetch('/api/student/theory', {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to fetch theory content')
      return response.json()
    },
  })

  const completeTheoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/student/theory/complete', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
      return response.json()
    },
    onSuccess: (data: { success: boolean; theoryToTest: boolean }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/progress'] })

      // Show transition overlay
      setIsTransitioning(true)

      if (data.theoryToTest) {
        // Theory to test is enabled - redirect to test with smooth transition
        toast({
          title: t('theoryCompleted'),
          description: 'Příprava testu...',
        })

        // Use React Router navigation instead of browser navigation to avoid white screen
        setTimeout(() => {
          setLocation('/student/test')
          setIsTransitioning(false)
        }, 1500)
      } else {
        // Theory to test is disabled - redirect to certificate/completion
        toast({
          title: t('theoryCompleted'),
          description: 'Přesměrování na dokončení kurzu...',
        })
        setTimeout(() => {
          setLocation('/student/certificate')
          setIsTransitioning(false)
        }, 1500)
      }
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  if (isLoading) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8">
          <LoadingScreen title="Načítání teorie..." description="Příprava studijního obsahu" />
        </CardContent>
      </Card>
    )
  }

  if (slides.length === 0) {
    return (
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No theory content available for this course.</p>
        </CardContent>
      </Card>
    )
  }

  const toggleBookmark = (slideId: number) => {
    const newBookmarks = new Set(bookmarkedSlides)
    if (newBookmarks.has(slideId)) {
      newBookmarks.delete(slideId)
    } else {
      newBookmarks.add(slideId)
    }
    setBookmarkedSlides(newBookmarks)
  }

  const openNoteModal = (slideId: number) => {
    setCurrentNoteSlideId(slideId)
    setCurrentNoteText(slideNotes[slideId] || '')
    setShowNoteModal(true)
  }

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1)
    }
  }

  const handleCompleteTheory = () => {
    if (!progress?.theoryCompleted) {
      completeTheoryMutation.mutate()
    } else {
      // Theory already completed, navigate back to dashboard
      setLocation('/student')
    }
  }

  const saveNote = () => {
    if (currentNoteSlideId !== null) {
      setSlideNotes((prev) => ({
        ...prev,
        [currentNoteSlideId]: currentNoteText,
      }))
    }
    setShowNoteModal(false)
    setCurrentNoteSlideId(null)
    toast({
      title: 'Úspěch',
      description: 'Poznámka byla přidána',
    })
  }

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const handleContentClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement
      openLightbox(img.src)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with course title and progress */}
      <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">Teorie kurzu</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Celkem {slides.length} témat k prostudování</p>
          </div>
        </CardContent>
      </Card>

      {/* Theory Slides Container - Compact Design */}
      {slides.length > 0 && (
        <div className="max-w-5xl mx-auto px-4">
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6">
              {/* Slide Title - Prominent at top */}
              <div className="mb-6 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {slides[currentSlideIndex]?.title || `Téma ${currentSlideIndex + 1}`}
                </h2>
              </div>

              {/* Slide Content - Responsive minimum height to prevent bouncing while ensuring accessibility */}
              <div className="min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] mb-6 flex flex-col">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 flex-grow theory-content"
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{
                    __html: slides[currentSlideIndex]?.content || 'Pro tento snímek není dostupný žádný obsah.',
                  }}
                />

                {/* Media content */}
                {slides[currentSlideIndex]?.mediaUrls &&
                  Array.isArray(slides[currentSlideIndex]?.mediaUrls) &&
                  slides[currentSlideIndex]?.mediaUrls.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {slides[currentSlideIndex]?.mediaUrls.map((url: string, mediaIndex: number) => (
                        <div key={mediaIndex} className="flex justify-center">
                          <img
                            src={url}
                            alt={`Slide media ${mediaIndex + 1}`}
                            className="max-w-full max-h-48 sm:max-h-60 lg:max-h-64 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => openLightbox(url)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Slide Actions */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6">
                <Button
                  onClick={() => toggleBookmark(slides[currentSlideIndex]?.id)}
                  variant="ghost"
                  size="sm"
                  className={`w-full sm:w-auto ${bookmarkedSlides.has(slides[currentSlideIndex]?.id) ? 'text-emerald-600' : 'text-gray-500'}`}
                >
                  <Bookmark
                    className={`h-4 w-4 mr-2 ${bookmarkedSlides.has(slides[currentSlideIndex]?.id) ? 'fill-current' : ''}`}
                  />
                  {bookmarkedSlides.has(slides[currentSlideIndex]?.id) ? 'Uloženo' : 'Uložit'}
                </Button>
                <Button
                  onClick={() => openNoteModal(slides[currentSlideIndex]?.id)}
                  variant="ghost"
                  size="sm"
                  className={`w-full sm:w-auto ${slideNotes[slides[currentSlideIndex]?.id] ? 'text-emerald-600' : 'text-gray-500'}`}
                >
                  <StickyNote
                    className={`h-4 w-4 mr-2 ${slideNotes[slides[currentSlideIndex]?.id] ? 'fill-current' : ''}`}
                  />
                  {slideNotes[slides[currentSlideIndex]?.id] ? 'Upravit poznámku' : 'Přidat poznámku'}
                </Button>
              </div>

              {/* Navigation Bar: Previous | Progress | Next */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Předchozí
                </Button>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:min-w-[250px] lg:min-w-[300px] order-1 sm:order-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <Progress value={((currentSlideIndex + 1) / slides.length) * 100} className="h-2 flex-1" />
                  {slides[currentSlideIndex]?.estimatedReadTime && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {slides[currentSlideIndex].estimatedReadTime}min
                    </span>
                  )}
                </div>

                <Button
                  onClick={nextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto order-3"
                >
                  Následující
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Complete theory button - only show if student has viewed all slides or theory is already completed */}
      {(currentSlideIndex === slides.length - 1 || progress?.theoryCompleted) && (
        <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {progress?.theoryCompleted
                  ? 'Studium teorie bylo dokončeno. Můžete se vrátit na dashboard.'
                  : 'Po prostudování všech témat pokračujte k dokončení teorie.'}
              </p>
              <Button
                onClick={handleCompleteTheory}
                disabled={completeTheoryMutation.isPending}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                {progress?.theoryCompleted ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Zpět na dashboard
                  </>
                ) : (
                  <>
                    {completeTheoryMutation.isPending ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        {t('loading')}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {t('completeTheory')}
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('addNote')}</h3>
              <Button onClick={() => setShowNoteModal(false)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <Label htmlFor="note" className="text-sm font-medium text-gray-900 dark:text-white">
                {t('notes')} pro vybrané téma:
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
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={() => setShowNoteModal(false)} variant="outline">
                {t('cancel')}
              </Button>
              <Button onClick={saveNote} className="bg-primary hover:bg-primary-dark">
                {t('saveNote')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-screen-lg max-h-screen-lg w-full h-full flex items-center justify-center">
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={closeLightbox}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-50 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded backdrop-blur-sm">
              Klikněte kamkoli pro zavření
            </div>
          </div>
        </div>
      )}

      {/* Loading Transition Overlay with enhanced duration */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <LoadingScreen title="Příprava testu..." description="Načítání otázek a testovacího prostředí" size="xl" />
        </div>
      )}
    </div>
  )
}

export default TheoryViewer
