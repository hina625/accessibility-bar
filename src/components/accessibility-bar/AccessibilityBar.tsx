'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import FontSizeControls from './FontSizeControls';
import FontStyleSelector from './FontStyleSelector';
import ContrastToggle from './ContrastToggle';
import GrayscaleToggle from './GrayscaleToggle';
import InvertColorsToggle from './InvertColorsToggle';
import ReadingGuideToggle from './ReadingGuideToggle';
import ReadingMaskToggle from './ReadingMaskToggle';
import ReadingMaskOverlay from './ReadingMaskOverlay';
import ReduceMotionToggle from './ReduceMotionToggle';
import DarkModeToggle from './DarkModeToggle';
import HighlightLinksToggle from './HighlightLinksToggle';
import HighlightHeadingsToggle from './HighlightHeadingsToggle';
import TextSpacingControl from './TextSpacingControl';
import CursorSizeControl from './CursorSizeControl';
import PageZoomControl from './PageZoomControl';
import ColorBlindFilter from './ColorBlindFilter';
import LargeButtonsToggle from './LargeButtonsToggle';
import TextToSpeech from './TextToSpeech';
import SpeechToText from './SpeechToText';
import KeyboardNavigation from './KeyboardNavigation';
import OnPageDictionary from './OnPageDictionary';
import TextAlignControl from './TextAlignControl';
import LanguageSelector from './LanguageSelector';
import ReadingGuideLine from './ReadingGuideLine';
import PageBackgroundColor from './PageBackgroundColor';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { readingGuide, readingMask, resetAll } = useAccessibility();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSelectedCategory(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const categories = [
    { id: 'text', name: 'Text & Font', icon: '/font-size.png', colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'visual', name: 'Visual', icon: '/contrast.png', colorClass: 'from-purple-500 to-purple-600', indicatorClass: 'bg-purple-500' },
    { id: 'reading', name: 'Reading', icon: '/proof-reading.png', colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
    { id: 'navigation', name: 'Navigation', icon: '/gps-navigation.png', colorClass: 'from-orange-500 to-orange-600', indicatorClass: 'bg-orange-500' },
    { id: 'speech', name: 'Speech', icon: '/speak.png', colorClass: 'from-pink-500 to-pink-600', indicatorClass: 'bg-pink-500' },
    { id: 'tools', name: 'Tools', icon: '/tools.png', colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'text':
        return (
          <div className="space-y-4">
            <FontSizeControls />
            <FontStyleSelector />
            <TextSpacingControl />
            <TextAlignControl />
          </div>
        );
      case 'visual':
        return (
          <div className="space-y-4">
            <PageBackgroundColor />
            <DarkModeToggle />
            <ContrastToggle />
            <GrayscaleToggle />
            <InvertColorsToggle />
            <ColorBlindFilter />
            <PageZoomControl />
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <ReadingGuideToggle />
            <ReadingMaskToggle />
          </div>
        );
      case 'navigation':
        return (
          <div className="space-y-4">
            <HighlightLinksToggle />
            <HighlightHeadingsToggle />
            <LargeButtonsToggle />
            <CursorSizeControl />
            <ReduceMotionToggle />
          </div>
        );
      case 'speech':
        return (
          <div className="space-y-4">
            <TextToSpeech />
            <SpeechToText />
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-4">
            <KeyboardNavigation />
            <OnPageDictionary />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-bar a11y-embed-host group fixed bottom-6 right-6 z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full bg-white text-white shadow-2xl shadow-black/20 transition-all duration-300 ease-out hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 overflow-hidden"
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        title="Accessibility Options (Ctrl+Shift+A)"
      >
        <Image
          src="/ICON PIC.png"
          alt=""
          width={80}
          height={80}
          className="transition-transform duration-300 group-hover:rotate-12 scale-[1.3]"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[2147483646] animate-fade-in"
            onClick={() => {
              setIsOpen(false);
              setSelectedCategory(null);
            }}
            aria-hidden="true"
          />
          <div
            className={`accessibility-bar a11y-embed-host fixed left-0 top-0 bottom-0 z-[2147483647] bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'translate-x-0 animate-slide-in-left' : '-translate-x-full'
              }`}
            style={{ width: selectedCategory ? '420px' : '80px', boxSizing: 'border-box' }}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility options"
          >
            <div className="flex h-full">

              <div className="w-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedCategory(null);
                  }}
                  className="mb-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="h-5 w-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )
                    }
                    className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${selectedCategory === category.id
                      ? `bg-gradient-to-br ${category.colorClass} text-white shadow-lg scale-110`
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    aria-label={category.name}
                    title={category.name}
                  >
                    <Image
                      src={category.icon}
                      alt=""
                      width={24}
                      height={24}
                      className={`transition-all duration-200 ${selectedCategory === category.id
                        ? 'brightness-0 invert'
                        : ''
                        }`}
                    />
                    {selectedCategory === category.id && (
                      <div
                        className={`absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full ${category.indicatorClass}`}
                      />
                    )}
                  </button>
                ))}

                <div className="mt-auto">
                  <button
                    onClick={resetAll}
                    className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-105"
                    aria-label="Reset all"
                    title="Reset All"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>


              {selectedCategory && (
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                          <Image
                            src={
                              categories.find((c) => c.id === selectedCategory)
                                ?.icon || ''
                            }
                            alt=""
                            width={20}
                            height={20}
                            className="brightness-0 invert"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {
                              categories.find((c) => c.id === selectedCategory)
                                ?.name
                            }
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Customize your experience
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        aria-label="Close panel"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <LanguageSelector />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar min-w-0 break-words">
                    {renderCategoryContent()}
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {readingGuide && <ReadingGuideLine />}
      {readingMask && <ReadingMaskOverlay />}
    </>
  );
}
