import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';
import { t } from '@/lib/translations';
import { useEffect, useState } from 'react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a small delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify({
      essential: true,
      analytical: true,
      marketing: true
    }));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-preferences', JSON.stringify({
      essential: true,
      analytical: false,
      marketing: false
    }));
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl shadow-lg border-emerald-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('cookieConsentTitle')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('cookieConsentMessage')}
              </p>
              
              {!showSettings ? (
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleAccept}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {t('cookieAccept')}
                  </Button>
                  <Button 
                    onClick={handleDecline}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    {t('cookieDecline')}
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('cookieSettings')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{t('essentialCookies')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Nezbytné pro funkčnost webu</p>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">Vždy aktivní</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{t('analyticalCookies')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Pomáhají zlepšovat web</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only" />
                        <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{t('marketingCookies')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Pro personalizovaný obsah</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only" />
                        <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button 
                      onClick={handleAccept}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Uložit předvolby
                    </Button>
                    <Button 
                      onClick={() => setShowSettings(false)}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {t('back')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}