'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import { speak } from '@/utils/speechUtils';
import FontSizeControls from './FontSizeControls';
import FontStyleSelector from './FontStyleSelector';
import ContrastToggle from './ContrastToggle';
import GrayscaleToggle from './GrayscaleToggle';
import InvertColorsToggle from './InvertColorsToggle';
import ReadingRulerToggle from './ReadingRulerToggle';
import ReadingRuler from './ReadingRuler';
import ReadingGuideToggle from './ReadingGuideToggle';
import ReadingGuideLine from './ReadingGuideLine';
import ReadingMaskToggle from './ReadingMaskToggle';
import ReadingMaskOverlay from './ReadingMaskOverlay';
import ReadingSpotlightOverlay from './ReadingSpotlightOverlay';
import ReadingSpotlightToggle from './ReadingSpotlightToggle';
import ReduceMotionToggle from './ReduceMotionToggle';
import DarkModeToggle from './DarkModeToggle';
import HighlightLinksToggle from './HighlightLinksToggle';
import HighlightHeadingsToggle from './HighlightHeadingsToggle';
import TextSpacingControl from './TextSpacingControl';
import CursorSizeControl from './CursorSizeControl';
import PageZoomControl from './PageZoomControl';
import ColorBlindFilter from './ColorBlindFilter';
import LargeButtonsToggle from './LargeButtonsToggle';
import SpeechToText from './SpeechToText';
import KeyboardNavigation from './KeyboardNavigation';
import OnPageDictionary from './OnPageDictionary';
import TextAlignControl from './TextAlignControl';
import LanguageSelector from './LanguageSelector';
import PageBackgroundColor from './PageBackgroundColor';
import PositionControls from './PositionControls';
import FontOptions from './FontOptions';
import ContentFiltering from './ContentFiltering';
import PlainTextModeControl from './PlainTextModeControl';
import PageSummaryControl from './PageSummaryControl';
import DictionaryPopup from './DictionaryPopup';
import GoogleTranslate from './GoogleTranslate';
import PronunciationGuideToggle from './PronunciationGuideToggle';
import PronunciationGuidePopup from './PronunciationGuidePopup';
import SimplifyLayoutControl from './SimplifyLayoutControl';
import SimplifiedLayoutOverlay from './SimplifiedLayoutOverlay';
import MagnifierToggle from './MagnifierToggle';
import MagnifierOverlay from './MagnifierOverlay';
import SmartSuggestionsToggle from './SmartSuggestionsToggle';
import SmartSuggestions from './SmartSuggestions';
import { translations } from '@/contexts/accessibility/translations';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    readingRuler,
    readingGuide,
    readingMask,
    readingSpotlight,
    resetAll,
    buttonPosition,
    panelPosition,
    toggleHighContrast,
    increaseFontSize,
    language,
    onPageDictionary, // Added
    pageSummary       // Added
  } = useAccessibility();

  const t = translations[language] || translations['en'];

  useEffect(() => {
    if (onPageDictionary || pageSummary) {
      setIsOpen(false);
      setSelectedCategory(null);
    }
  }, [onPageDictionary, pageSummary]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Global Shortcuts
      if (e.altKey) {
        if (e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          toggleHighContrast();
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          increaseFontSize();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSelectedCategory(null);
        triggerRef.current?.focus();
      }

      // Focus trapping logic for accessibility menu
      if (isOpen && e.key === 'Tab' && panelRef.current) {
        const focusableElements = Array.from(panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    if (isOpen) {
      // Move focus to first element when bar opens
      setTimeout(() => {
        const firstBtn = panelRef.current?.querySelector('button');
        firstBtn?.focus();
      }, 100);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);


  const handleCategoryKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = categories.filter(c => c.id !== 'settings').length;
    let nextIndex = index;

    if (e.key === 'ArrowDown' || (isVertical && e.key === 'ArrowRight')) {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowUp' || (isVertical && e.key === 'ArrowLeft')) {
      nextIndex = (index - 1 + total) % total;
    } else {
      return;
    }

    e.preventDefault();
    const btns = panelRef.current?.querySelectorAll('[data-category-btn]');
    (btns?.[nextIndex] as HTMLElement)?.focus();
  };

  const categories = [
    { id: 'text', name: t.categories.text, icon: '/font-size.png', colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'page', name: t.categories.page, icon: '/proof-reading.png', colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'layout', name: t.categories.layout, icon: '/page.png', colorClass: 'from-teal-500 to-teal-600', indicatorClass: 'bg-teal-500' },
    { id: 'visual', name: t.categories.visual, icon: '/contrast.png', colorClass: 'from-purple-500 to-purple-600', indicatorClass: 'bg-purple-500' },
    { id: 'reading', name: t.categories.reading, icon: '/reading new.jpg', colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
    { id: 'navigation', name: t.categories.navigation, icon: '/gps-navigation.png', colorClass: 'from-orange-500 to-orange-600', indicatorClass: 'bg-orange-500' },
    { id: 'speech', name: t.categories.speech, icon: '/speak.png', colorClass: 'from-yellow-400 to-yellow-500', indicatorClass: 'bg-yellow-400' },
    { id: 'tools', name: t.categories.tools, icon: '/tools.png', colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'settings', name: t.categories.settings, icon: '/first icon og accessibilty.png', colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'text':
        return (
          <div className="space-y-6">
            <LanguageSelector />
            <FontSizeControls />
            <TextAlignControl />
            <FontStyleSelector />
          </div>
        );
      case 'page':
        return (
          <div className="space-y-6">
            <ContentFiltering />
            <PageSummaryControl />
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-6">
            <PlainTextModeControl />
            <SimplifyLayoutControl />
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
            <ReadingRulerToggle />
            <ReadingGuideToggle />
            <ReadingMaskToggle />
            <ReadingSpotlightToggle />
            <HighlightLinksToggle />
            <HighlightHeadingsToggle />
            <LargeButtonsToggle />
            <MagnifierToggle />
          </div>
        );
      case 'navigation':
        return (
          <div className="space-y-4">
            <CursorSizeControl />
            <ReduceMotionToggle />
          </div>
        );
      case 'speech':
        return (
          <div className="space-y-4">
            <SpeechToText />
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-4">
            <KeyboardNavigation />
            <OnPageDictionary />
            <PronunciationGuideToggle />
            <SmartSuggestionsToggle />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <PositionControls />
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonPositionClasses = () => {
    switch (buttonPosition) {
      case 'top-left': return 'top-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'bottom-right': return 'bottom-6 right-6';
      default: return 'bottom-6 right-6';
    }
  };

  const isVertical = panelPosition === 'left' || panelPosition === 'right';

  const getPanelPositionClasses = () => {
    switch (panelPosition) {
      case 'right':
        return isOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full';
      case 'left':
        return isOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full';
      case 'top':
        return isOpen ? 'top-0 translate-y-0' : 'top-0 -translate-y-full';
      case 'bottom':
        return isOpen ? 'bottom-0 translate-y-0' : 'bottom-0 translate-y-full';
      default:
        return isOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full';
    }
  };

  const panelBorderStyle = isVertical
    ? (panelPosition === 'right' ? 'border-l' : 'border-r')
    : (panelPosition === 'bottom' ? 'border-t' : 'border-b');

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`accessibility-bar a11y-embed-host group fixed z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full bg-white text-white shadow-2xl shadow-black/20 transition-all duration-300 ease-out hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 overflow-hidden ${getButtonPositionClasses()}`}
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        title="Accessibility Options (Ctrl+Shift+A)"
      >
        <Image
          src="/first icon og accessibilty.png"
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
            ref={panelRef}
            className={`accessibility-bar a11y-embed-host fixed z-[2147483647] bg-white dark:bg-gray-900 shadow-2xl ${panelBorderStyle} border-green-300/60 dark:border-green-900/60 transition-all duration-300 ease-out ${isVertical ? 'overflow-hidden' : 'overflow-visible'} ${getPanelPositionClasses()} ${isVertical ? 'top-0 bottom-0' : 'left-0 right-0'}`}
            style={{
              width: isVertical ? (selectedCategory ? '340px' : '64px') : '100%',
              height: isVertical ? '100%' : '64px',
              boxSizing: 'border-box',
              flexDirection: isVertical
                ? (panelPosition === 'right' ? 'row-reverse' : 'row')
                : (panelPosition === 'bottom' ? 'column-reverse' : 'column')
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility options"
          >
            <div className={`flex h-full w-full ${isVertical
              ? (panelPosition === 'right' ? 'flex-row-reverse' : 'flex-row')
              : 'flex-row'
              }`}>
              <div className={`bg-gradient-to-b from-green-50/50 to-lime-50/50 dark:from-green-950/20 dark:to-lime-950/20 border-green-300/60 dark:border-green-900/40 flex items-center p-2.5 ${isVertical
                ? `flex-col w-16 space-y-3 h-full ${panelPosition === 'right' ? 'border-l' : 'border-r'}`
                : `flex-row h-16 space-x-3 w-full ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
                }`}>

                {/* ICM Logo Branding - Only at start when vertical */}
                {isVertical && (
                  <div className="mb-2 group cursor-pointer w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                    <img
                      src="/include-me.png"
                      alt="ICM"
                      className="w-full h-full object-contain scale-[1.3] transform transition-transform duration-500 group-hover:scale-[1.5]"
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedCategory(null);
                  }}
                  className={`${isVertical ? 'mb-2' : 'mr-2'} p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors pointer-events-auto`}
                  aria-label="Close"
                >
                  <svg
                    className="h-5 w-5 text-gray-700 dark:text-gray-300"
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

                <div className={`flex ${isVertical ? 'flex-col space-y-3' : 'flex-row space-x-3'} items-center`}>
                  {categories.filter(c => c.id !== 'settings').map((category, index) => (
                    <button
                      key={category.id}
                      data-category-btn
                      onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setSelectedOffset(rect.left + rect.width / 2);
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        );
                      }}
                      className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 overflow-hidden ${selectedCategory === category.id
                        ? `bg-gradient-to-br ${category.colorClass} text-white shadow-lg scale-110`
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                        }`}
                      aria-label={category.name}
                      title={category.name}
                    >
                      <Image
                        src={category.icon}
                        alt=""
                        width={22}
                        height={22}
                        className={`transition-all duration-200 ${selectedCategory === category.id && !['speech'].includes(category.id)
                          ? 'brightness-0 invert'
                          : ''
                          } ${category.id === 'reading' ? 'scale-[2.2]' : ''}`}
                      />
                      {selectedCategory === category.id && (
                        <div
                          className={`absolute ${isVertical
                            ? `${panelPosition === 'right' ? '-left-1' : '-right-1'} top-1/2 -translate-y-1/2 w-0.5 h-6`
                            : `${panelPosition === 'bottom' ? '-top-1' : '-bottom-1'} left-1/2 -translate-x-1/2 h-0.5 w-6`
                            } rounded-full ${category.indicatorClass}`}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className={`flex ${isVertical ? 'mt-auto flex-col space-y-3' : 'ml-auto flex-row space-x-3'} items-center`}>
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setSelectedOffset(rect.left + rect.width / 2);
                      setSelectedCategory(
                        selectedCategory === 'settings' ? null : 'settings'
                      );
                    }}
                    className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 overflow-hidden ${selectedCategory === 'settings'
                      ? `bg-gradient-to-br from-green-500/80 to-green-600/80 text-white shadow-lg scale-110`
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                      }`}
                    aria-label="Position"
                    title="Position"
                  >
                    <Image
                      src="/first icon og accessibilty.png"
                      alt=""
                      width={22}
                      height={22}
                      className={`transition-all duration-200 scale-[2.2]`}
                    />
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex flex-row items-center justify-center w-auto h-10 px-1 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-black hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-200 hover:scale-105"
                    aria-label={t.common.reset}
                    title={t.common.reset}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-tighter -ml-0.5">{t.common.reset}</span>
                  </button>

                  {/* ICM Logo Branding - Only at end when horizontal */}
                  {!isVertical && (
                    <div className="ml-2 group cursor-pointer w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                      <img
                        src="/include-me.png"
                        alt="ICM"
                        className="w-full h-full object-contain scale-[1.3] transform transition-transform duration-500 group-hover:scale-[1.5]"
                      />
                    </div>
                  )}
                </div>
              </div>


              {selectedCategory && (
                <div
                  className={`flex flex-col min-w-0 ${isVertical
                    ? 'flex-1 h-full'
                    : `absolute ${panelPosition === 'bottom' ? 'bottom-[74px]' : 'top-[74px]'} w-[280px] bg-white dark:bg-gray-900 shadow-2xl border border-green-300/60 dark:border-green-900/60 rounded-2xl overflow-hidden animate-fade-in`
                    }`}
                  style={!isVertical ? {
                    left: `${Math.max(20, Math.min(window.innerWidth - 320, selectedOffset - 150))}px`
                  } : {}}
                >
                  <div className={`p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-50 to-lime-50 dark:from-gray-800 dark:to-gray-900`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-lime-500 text-white shadow-lg overflow-hidden">
                          <Image
                            src={
                              categories.find((c) => c.id === selectedCategory)
                                ?.icon || ''
                            }
                            alt=""
                            width={20}
                            height={20}
                            className={`${selectedCategory === 'settings' ? 'scale-[2.2]' : (selectedCategory === 'speech' ? '' : 'brightness-0 invert')}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-[20px] font-extrabold uppercase tracking-tight text-black dark:text-white">
                            {
                              categories.find((c) => c.id === selectedCategory)
                                ?.name
                            }
                          </h2>
                          <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
                            {t.common.customize}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        aria-label={t.common.close}
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

                  </div>

                  <div className={`${isVertical ? 'flex-1' : 'h-[420px]'} overflow-y-auto overflow-x-hidden p-6 custom-scrollbar min-w-0 break-words`}>
                    {renderCategoryContent()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {readingRuler && <ReadingRuler />}
      {readingGuide && <ReadingGuideLine />}
      {readingMask && <ReadingMaskOverlay />}
      {readingSpotlight && <ReadingSpotlightOverlay />}
      <DictionaryPopup />
      <PronunciationGuidePopup />
      <SimplifiedLayoutOverlay />
      <MagnifierOverlay />
      <SmartSuggestions />
      <GoogleTranslate />
    </>
  );
}
