import { useRef, useEffect, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuideLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  guides: Array<{
    id: string;
    title: string;
  }>;
  selectedGuideId?: string;
  onGuideSelect: (guideId: string) => void;
}

export function GuideLayout({
  title,
  description,
  children,
  guides,
  selectedGuideId,
  onGuideSelect,
}: GuideLayoutProps) {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleBackToHelpCenter = () => {
    navigate('/help-center');
  };

  const handleGuideSelect = (guideId: string) => {
    onGuideSelect(guideId);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedGuideId]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full">
      {/* Header with back button */}
      <div className="pb-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHelpCenter}
              className="h-8 w-8"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl lg:text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground text-sm lg:text-md">{description}</p>
            </div>
          </div>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-8 w-8 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-[calc(100vh-169px)] lg:h-[calc(100vh-157px)] w-full">
        {/* Sidebar Navigation - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0 pt-6">
          <nav className="overflow-y-auto h-full pr-2 pl-4">
            <div className="space-y-1 border-l-2 border-l-primary pl-4">
              {guides.map((guide) => {
                const isSelected = selectedGuideId === guide.id;

                return (
                  <button
                    key={guide.id}
                    onClick={() => handleGuideSelect(guide.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      isSelected ? 'text-primary bg-primary/5' : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {guide.title}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-6 border-b">
            <nav className="px-4">
              <div className="space-y-2">
                {guides.map((guide) => {
                  const isSelected = selectedGuideId === guide.id;

                  return (
                    <button
                      key={guide.id}
                      onClick={() => handleGuideSelect(guide.id)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all text-sm ${
                        isSelected ? 'text-primary bg-primary/5' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {guide.title}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="overflow-y-auto h-full pt-4 lg:pt-6" ref={contentRef}>
          <div className="space-y-6 pb-8 px-4 lg:px-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
