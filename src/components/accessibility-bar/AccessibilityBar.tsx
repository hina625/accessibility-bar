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
import PageStructureControl from './PageStructureControl';
import PageStructureOverlay from './PageStructureOverlay';
import PageSummaryOverlay from './PageSummaryOverlay';
import RealTimeTranslation from './RealTimeTranslation';
import VoiceNavigation from './VoiceNavigation';
import TextToSpeech from './TextToSpeech';
import TtsPlayer from './TtsPlayer';
import ThemeSelector from './ThemeSelector';
import { translations } from '@/contexts/accessibility/translations';

import { THEME, BAR_THEMES } from '@/contexts/accessibility/theme';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const [selectedCategoryRect, setSelectedCategoryRect] = useState<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
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
    onPageDictionary,
    pageSummary,
    pageStructure,
    barTheme,
    textToSpeech,
    isMobile,
  } = useAccessibility();


  const currentTheme = BAR_THEMES[barTheme];

  const t = translations[language] || translations['en'];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (onPageDictionary || pageSummary || pageStructure) {
      setIsOpen(false);
      setSelectedCategory(null);
    }
  }, [onPageDictionary, pageSummary, pageStructure]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {

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


      if (isOpen && e.key === 'Tab' && panelRef.current) {
        const focusableElements = Array.from(panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
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

      setTimeout(() => {
        const firstBtn = panelRef.current?.querySelector('button');
        firstBtn?.focus();
      }, 100);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);


  const handleCategoryKeyDown = (e: React.KeyboardEvent, index: number) => {
    const btns = panelRef.current?.querySelectorAll('[data-category-btn]');
    const total = btns?.length || 0;
    if (total === 0) return;

    let nextIndex = index;

    if (e.key === 'ArrowDown' || (isVertical && e.key === 'ArrowRight')) {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowUp' || (isVertical && e.key === 'ArrowLeft')) {
      nextIndex = (index - 1 + total) % total;
    } else {
      return;
    }

    e.preventDefault();
    (btns?.[nextIndex] as HTMLElement)?.focus();
  };

  const categories = [
    { id: 'position', name: `CUSTOMISE\nTOOLBAR`, icon: '/first icon og accessibilty.png', colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
    { id: 'font', name: `Font`, icon: '/font-size.png', colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'contrast', name: `Contrast`, icon: '/contrast.png', colorClass: 'from-purple-500 to-purple-600', indicatorClass: 'bg-purple-500' },
    { id: 'layout', name: `Layout`, icon: '/layout.png', colorClass: 'from-teal-500 to-teal-600', indicatorClass: 'bg-teal-500' },
    { id: 'reading', name: `Reading`, icon: '/book.png', colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
    { id: 'cursor', name: `Cursor`, icon: '/cursor (1).png', colorClass: 'from-orange-500 to-orange-600', indicatorClass: 'bg-orange-500' },
    { id: 'images', name: `Images`, icon: '/photo.png', colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'speech', name: `Speech`, icon: '/speak (1).png', colorClass: 'from-yellow-400 to-yellow-500', indicatorClass: 'bg-yellow-400' },
    { id: 'language', name: `Language`, icon: '/translate.png', colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'ai', name: `AI SUPPORT`, icon: '/generative.png', colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'reset', name: `RESET`, icon: '/reset_icon.png', colorClass: 'from-red-500 to-red-600', indicatorClass: 'bg-red-500' },
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'position':
        return (
          <div className="space-y-4">
            <PositionControls />
            <div className="border-t-2 -mx-6 my-4" style={{ borderColor: `${currentTheme.text}66` }} />
            <ThemeSelector />
          </div>
        );
      case 'font':
        return (
          <div className="space-y-6">

            <FontSizeControls />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <TextAlignControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <FontStyleSelector />
          </div>
        );
      case 'contrast':
        return (
          <div className="space-y-4">
            <PageBackgroundColor />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <DarkModeToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ContrastToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <GrayscaleToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <InvertColorsToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ColorBlindFilter />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PageZoomControl />
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-6">
            <PageStructureControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PlainTextModeControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <SimplifyLayoutControl />
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <ReadingRulerToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ReadingGuideToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ReadingMaskToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ReadingSpotlightToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <HighlightLinksToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <HighlightHeadingsToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <LargeButtonsToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <MagnifierToggle />
          </div>
        );
      case 'cursor':
        return (
          <div className="space-y-4">
            <CursorSizeControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <KeyboardNavigation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ReduceMotionToggle />
          </div>
        );
      case 'images':
        return (
          <div className="space-y-6">
            <ContentFiltering />
          </div>
        );
      case 'speech':
        return (
          <div className="space-y-6">
            <VoiceNavigation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <TextToSpeech />
          </div>
        );
      case 'language':
        return (
          <div className="space-y-4">
            <LanguageSelector />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <RealTimeTranslation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <OnPageDictionary />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PronunciationGuideToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <SmartSuggestionsToggle />
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-6">
            <PageSummaryControl />
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonPositionClasses = () => {
    switch (buttonPosition) {
      case 'top-left': return isMobile ? 'top-4 left-4' : 'top-6 left-6';
      case 'top-right': return isMobile ? 'top-4 right-4' : 'top-6 right-6';
      case 'bottom-left': return isMobile ? 'bottom-4 left-4' : 'bottom-6 left-6';
      case 'bottom-right': return isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6';
      case 'top': return isMobile ? 'top-4 left-1/2 -translate-x-1/2' : 'top-6 left-1/2 -translate-x-1/2';
      case 'bottom': return isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : 'bottom-6 left-1/2 -translate-x-1/2';
      case 'left': return isMobile ? 'left-4 top-1/2 -translate-y-1/2' : 'left-6 top-1/2 -translate-y-1/2';
      case 'right': return isMobile ? 'right-4 top-1/2 -translate-y-1/2' : 'right-6 top-1/2 -translate-y-1/2';
      default: return isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6';
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

  if (!mounted) return null;

  return (
    <>
      {!isOpen && (
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`accessibility-bar a11y-embed-host group fixed z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full text-white shadow-2xl shadow-black/20 transition-all duration-300 ease-out hover:scale-110 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden ${getButtonPositionClasses()}`}
          style={{
            background: currentTheme.background,
            boxShadow: `0 4px 20px ${currentTheme.border}40`
          }}
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
      )}

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
            className={`accessibility-bar a11y-embed-host fixed z-[2147483647] shadow-2xl ${panelBorderStyle} transition-all duration-300 ease-out ${isVertical ? 'overflow-hidden' : 'overflow-visible'} ${getPanelPositionClasses()} ${isVertical ? 'top-0 bottom-0' : 'left-0 right-0'}`}
            style={{
              width: isVertical ? (selectedCategory ? (isMobile ? '100%' : '340px') : (isMobile ? '56px' : '64px')) : '100%',
              height: isVertical ? '100%' : '64px',
              boxSizing: 'border-box',
              flexDirection: isVertical
                ? (panelPosition === 'right' ? 'row-reverse' : 'row')
                : (panelPosition === 'bottom' ? 'column-reverse' : 'column'),
              background: currentTheme.background,
              border: `4px solid ${currentTheme.border}`,
              borderColor: currentTheme.border
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Accessibility options"
          >
            <div className={`flex h-full w-full ${isVertical
              ? (panelPosition === 'right' ? 'flex-row-reverse' : 'flex-row')
              : 'flex-row'
              }`}>
              <div
                className={`flex items-center p-2 sm:p-2.5 ${isVertical
                  ? `flex-col w-14 sm:w-16 space-y-2 sm:space-y-3 h-full ${panelPosition === 'right' ? 'border-l' : 'border-r'}`
                  : `flex-row h-16 w-full justify-between overflow-x-auto custom-scrollbar-hide ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
                  }`}
                style={{
                  background: currentTheme.background,
                  borderColor: currentTheme.border
                }}
              >


                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedCategory(null);
                  }}
                  className={`${isVertical ? 'mb-4' : 'mr-2'} p-1.5 rounded-lg transition-colors pointer-events-auto`}
                  style={{ backgroundColor: `${currentTheme.active}30` }}
                  aria-label="Close"
                >
                  <svg
                    className="h-5 w-5"
                    style={{ color: currentTheme.text }}
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
                {/* Logo Section */}
                {!selectedCategory && (
                  <div className={`flex items-center justify-center flex-shrink-0 ${isVertical ? 'w-12 h-12 mb-2' : 'w-12 h-12 mr-2'}`}>
                    <Image
                      src="/ICON PIC.png"
                      alt="Logo"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className={`flex ${isVertical ? 'flex-col space-y-2 sm:space-y-3 items-center flex-shrink-0' : 'flex-row w-full justify-between items-center flex-grow px-4 sm:px-12'}`}>
                  {(() => {
                    const allCategories = categories; // No longer valid to filter settings
                    const shouldPaginate = panelPosition === 'bottom';
                    const visibleCategories = shouldPaginate
                      ? allCategories.slice(categoryStartIndex, categoryStartIndex + 4)
                      : allCategories;

                    return (
                      <>
                        {visibleCategories.map((category, index) => (
                          <div key={category.id} className="relative group/category">
                            <button
                              data-category-btn
                              onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                              onClick={(e) => {
                                if (category.id === 'reset') {
                                  resetAll();
                                  return;
                                }
                                const rect = e.currentTarget.getBoundingClientRect();
                                setSelectedOffset(rect.left + rect.width / 2);
                                setSelectedCategoryRect(rect);
                                setSelectedCategory(
                                  selectedCategory === category.id ? null : category.id
                                );
                              }}
                              onMouseEnter={() => {
                                if (textToSpeech) {
                                  speak(category.name);
                                }
                              }}
                              className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 overflow-hidden ${selectedCategory === category.id
                                ? 'text-white shadow-lg scale-110'
                                : 'text-gray-600 hover:scale-105'
                                }`}
                              style={selectedCategory === category.id
                                ? { background: currentTheme.active }
                                : { backgroundColor: '#ffffff' }
                              }
                              aria-label={category.name}
                              title={category.name}
                            >
                              <Image
                                src={category.icon}
                                alt=""
                                width={26}
                                height={26}
                                className={`transition-all duration-200 ${selectedCategory === category.id && !['speech', 'language'].includes(category.id)
                                  ? 'brightness-0 invert'
                                  : ''
                                  }`}
                              />
                              {selectedCategory === category.id && (
                                <div
                                  className={`absolute ${isVertical
                                    ? `${panelPosition === 'right' ? '-left-1' : '-right-1'} top-1/2 -translate-y-1/2 w-0.5 h-6`
                                    : `${panelPosition === 'bottom' ? '-top-1' : '-bottom-1'} left-1/2 -translate-x-1/2 h-0.5 w-6`
                                    } rounded-full border border-white/50 ${category.indicatorClass}`}
                                />
                              )}
                            </button>
                          </div>
                        ))}

                        {shouldPaginate && (
                          <div className="relative group/category">
                            <button
                              data-category-btn
                              onKeyDown={(e) => handleCategoryKeyDown(e, visibleCategories.length)}
                              onClick={() => {
                                setCategoryStartIndex((prev) => {
                                  const next = prev + 4;
                                  return next >= allCategories.length ? 0 : next;
                                });
                              }}
                              className="group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 overflow-hidden text-gray-600 hover:scale-105"
                              style={{ backgroundColor: currentTheme.hover, color: currentTheme.text }}
                              aria-label="More categories"
                              title="Show more"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Removed separate settings and reset buttons */}
                <div className={`flex ${isVertical ? 'mt-auto flex-col space-y-2 sm:space-y-3' : 'ml-auto flex-row space-x-2 sm:space-x-3'} items-center flex-shrink-0`}>
                  {/* Include Me logo preserved */}
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
                    : `absolute ${panelPosition === 'bottom' ? (isMobile ? 'bottom-[66px]' : 'bottom-[74px]') : (isMobile ? 'top-[66px]' : 'top-[74px]')} ${isMobile ? 'w-[calc(100vw-20px)]' : 'w-[280px]'} shadow-2xl rounded-none animate-fade-in`
                    }`}
                  style={!isVertical ? {
                    left: `${Math.max(10, Math.min(window.innerWidth - (isMobile ? window.innerWidth - 10 : 320), selectedOffset - (isMobile ? (window.innerWidth - 20) / 2 : 150)))}px`,
                    backgroundColor: currentTheme.background,
                    border: `4px solid ${currentTheme.border}`
                  } : {
                    backgroundColor: currentTheme.background,
                    border: `4px solid ${currentTheme.border}`
                  }}
                >
                  <div
                    className="p-6 border-b-4 relative"
                    style={{
                      background: currentTheme.background,
                      borderColor: currentTheme.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 pr-10">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-none shadow-lg overflow-hidden"
                          style={{ background: currentTheme.active, color: currentTheme.text }}
                        >
                          <Image
                            src={
                              categories.find((c) => c.id === selectedCategory)
                                ?.icon || ''
                            }
                            alt=""
                            width={20}
                            height={20}
                            className={`${selectedCategory === 'speech' ? '' : 'brightness-0 invert'}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2 className={`text-[16px] sm:text-[20px] font-extrabold uppercase tracking-tight leading-[1.2] mt-2 sm:mt-[12px] ${selectedCategory === 'position' ? 'whitespace-pre-line' : (['text', 'ai', 'layout', 'speech'].includes(selectedCategory || '') ? 'whitespace-nowrap' : (selectedCategory === 'visual' ? 'max-w-[120px] sm:max-w-[140px]' : ''))}`} style={{ color: currentTheme.text }}>
                            {categories.find((c) => c.id === selectedCategory)?.name}
                          </h2>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="absolute top-0 right-0 p-3 rounded-none transition-all hover:bg-black/10 z-10"
                        style={{ color: currentTheme.text }}
                        aria-label={t.common.close}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
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

                  <div
                    data-category-content
                    className={`${isVertical ? 'flex-1' : (isMobile ? 'h-[350px]' : 'h-[420px]')} overflow-y-auto overflow-x-hidden p-4 sm:p-6 custom-scrollbar min-w-0 break-words`}
                  >
                    {renderCategoryContent()}
                  </div>

                  {/* Bubble Arrow for both Vertical and Horizontal Layouts */}
                  {selectedCategoryRect && !isMobile && (
                    <>
                      {/* Arrow Border */}
                      <div
                        className="absolute border-[11px]"
                        style={{
                          borderColor: 'transparent',
                          ...(isVertical
                            ? {
                              top: `${Math.max(10, Math.min(390, selectedCategoryRect.top - (Math.max(10, Math.min(window.innerHeight - 440, selectedCategoryRect.top + (selectedCategoryRect.height / 2) - 220))) + (selectedCategoryRect.height / 2) - 11))}px`,
                              [panelPosition === 'left' ? 'left' : 'right']: '-22px',
                              [panelPosition === 'left' ? 'borderRightColor' : 'borderLeftColor']: currentTheme.border
                            }
                            : {
                              left: `${Math.max(10, Math.min(260, selectedOffset - Math.max(20, Math.min(window.innerWidth - 320, selectedOffset - 150)) - 11))}px`,
                              ...(panelPosition === 'bottom'
                                ? { bottom: '-22px', borderTopColor: currentTheme.border }
                                : { top: '-22px', borderBottomColor: currentTheme.border }
                              )
                            }
                          )
                        }}
                      />
                      {/* Arrow Fill */}
                      <div
                        className="absolute border-[10px]"
                        style={{
                          borderColor: 'transparent',
                          ...(isVertical
                            ? {
                              top: `${Math.max(11, Math.min(391, selectedCategoryRect.top - (Math.max(10, Math.min(window.innerHeight - 440, selectedCategoryRect.top + (selectedCategoryRect.height / 2) - 220))) + (selectedCategoryRect.height / 2) - 10))}px`,
                              [panelPosition === 'left' ? 'left' : 'right']: '-20px',
                              [panelPosition === 'left' ? 'borderRightColor' : 'borderLeftColor']: currentTheme.background
                            }
                            : {
                              left: `${Math.max(11, Math.min(261, selectedOffset - Math.max(20, Math.min(window.innerWidth - 320, selectedOffset - 150)) - 10))}px`,
                              ...(panelPosition === 'bottom'
                                ? { bottom: '-20px', borderTopColor: currentTheme.background }
                                : { top: '-20px', borderBottomColor: currentTheme.background }
                              )
                            }
                          )
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )
      }

      {readingRuler && <ReadingRuler />}
      {readingGuide && <ReadingGuideLine />}
      {readingMask && <ReadingMaskOverlay />}
      {readingSpotlight && <ReadingSpotlightOverlay />}
      <DictionaryPopup />
      <PronunciationGuidePopup />
      <GoogleTranslate />
      <SmartSuggestions />
      <TtsPlayer />
      <SimplifiedLayoutOverlay />
      <MagnifierOverlay />
      <PageStructureOverlay />
      <PageSummaryOverlay />
      <style jsx global>{`
        .highlight-links a:not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: rgba(255, 255, 0, 0.4) !important;
          color: #000 !important;
          text-decoration: underline !important;
        }
        .highlight-headings :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: rgba(255, 255, 0, 0.4) !important;
          color: #000 !important;
          display: inline-block !important;
        }
      `}</style>
    </>
  );
}
