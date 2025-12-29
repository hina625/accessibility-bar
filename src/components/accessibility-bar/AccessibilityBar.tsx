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
    barTheme,
    textToSpeech,
  } = useAccessibility();


  const currentTheme = BAR_THEMES[barTheme];

  const t = translations[language] || translations['en'];

  useEffect(() => {
    if (onPageDictionary || pageSummary) {
      setIsOpen(false);
      setSelectedCategory(null);
    }
  }, [onPageDictionary, pageSummary]);

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
    { id: 'reading', name: t.categories.reading, icon: '/reading1.jpg', colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
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
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <FontSizeControls />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <TextAlignControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <FontStyleSelector />
          </div>
        );
      case 'page':
        return (
          <div className="space-y-6">
            <ContentFiltering />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PageStructureControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PageSummaryControl />
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-6">
            <PlainTextModeControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <SimplifyLayoutControl />
          </div>
        );
      case 'visual':
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
      case 'navigation':
        return (
          <div className="space-y-4">
            <CursorSizeControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <ReduceMotionToggle />
          </div>
        );
      case 'speech':
        return (
          <div className="space-y-6">
            <VoiceNavigation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <TextToSpeech />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <SpeechToText />
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-4">
            <RealTimeTranslation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <KeyboardNavigation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <OnPageDictionary />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <PronunciationGuideToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: currentTheme.border }} />
            <SmartSuggestionsToggle />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <ThemeSelector />
            <div className="border-t-2 -mx-6" style={{ borderColor: `${currentTheme.text}66` }} />
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
      case 'top': return 'top-6 left-1/2 -translate-x-1/2';
      case 'bottom': return 'bottom-6 left-1/2 -translate-x-1/2';
      case 'left': return 'left-6 top-1/2 -translate-y-1/2';
      case 'right': return 'right-6 top-1/2 -translate-y-1/2';
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
              width: isVertical ? (selectedCategory ? '340px' : '64px') : '100%',
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
                className={`flex items-center p-2.5 ${isVertical
                  ? `flex-col w-16 space-y-3 h-full ${panelPosition === 'right' ? 'border-l' : 'border-r'}`
                  : `flex-row h-16 space-x-3 w-full ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
                  }`}
                style={{
                  background: currentTheme.background,
                  borderColor: currentTheme.border
                }}
              >


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
                  className={`${isVertical ? 'mb-2' : 'mr-2'} p-1.5 rounded-lg transition-colors pointer-events-auto`}
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

                <div className={`flex ${isVertical ? 'flex-col space-y-3' : 'flex-row space-x-3'} items-center`}>
                  {categories.filter(c => c.id !== 'settings').map((category, index) => (
                    <div key={category.id} className="relative group/category">
                      <button
                        data-category-btn
                        onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                        onClick={(e) => {
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
                          : { backgroundColor: currentTheme.hover }
                        }
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
                              } rounded-full border border-white/50 ${category.indicatorClass}`}
                          />
                        )}
                      </button>

                    </div>
                  ))}
                </div>

                <div className={`flex ${isVertical ? 'mt-auto flex-col space-y-3' : 'ml-auto flex-row space-x-3'} items-center`}>
                  <div className="relative group/category">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setSelectedOffset(rect.left + rect.width / 2);
                        setSelectedCategoryRect(rect);
                        setSelectedCategory(
                          selectedCategory === 'settings' ? null : 'settings'
                        );
                      }}
                      onMouseEnter={() => {
                        if (textToSpeech) {
                          speak('Settings');
                        }
                      }}
                      className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 overflow-hidden ${selectedCategory === 'settings'
                        ? 'text-white shadow-lg scale-110'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:scale-105'
                        }`}
                      style={selectedCategory === 'settings'
                        ? { background: currentTheme.active }
                        : { backgroundColor: currentTheme.hover }
                      }
                      aria-label="Settings"
                      title="Settings"
                    >
                      <Image
                        src="/first icon og accessibilty.png"
                        alt=""
                        width={22}
                        height={22}
                        className={`transition-all duration-200 scale-[2.2]`}
                      />
                    </button>

                  </div>

                  <button
                    onClick={resetAll}
                    className="flex flex-row items-center justify-center w-auto h-10 px-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{ backgroundColor: currentTheme.active, color: currentTheme.text }}
                    aria-label={t.common.reset}
                    title={t.common.reset}
                  >
                    <svg
                      className="h-4 w-4 mr-1"
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
                    <span className="text-[11px] font-bold uppercase tracking-tight">{t.common.reset}</span>
                  </button>


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
                    : `absolute ${panelPosition === 'bottom' ? 'bottom-[74px]' : 'top-[74px]'} w-[280px] shadow-2xl rounded-none animate-fade-in`
                    }`}
                  style={!isVertical ? {
                    left: `${Math.max(20, Math.min(window.innerWidth - 320, selectedOffset - 150))}px`,
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
                            className={`${selectedCategory === 'settings' ? 'scale-[2.2]' : (selectedCategory === 'speech' ? '' : 'brightness-0 invert')}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-[20px] font-extrabold uppercase tracking-tight leading-tight max-w-[150px]" style={{ color: currentTheme.text }}>
                            {selectedCategory === 'settings' ? t.categories.settings : categories.find((c) => c.id === selectedCategory)?.name}
                          </h2>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="absolute top-3 right-3 p-2 rounded-lg transition-all hover:bg-black/10"
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

                  <div className={`${isVertical ? 'flex-1' : 'h-[420px]'} overflow-y-auto overflow-x-hidden p-6 custom-scrollbar min-w-0 break-words`}>
                    {renderCategoryContent()}
                  </div>

                  {/* Bubble Arrow for both Vertical and Horizontal Layouts */}
                  {selectedCategoryRect && (
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
      )}

      {readingRuler && <ReadingRuler />}
      {readingGuide && <ReadingGuideLine />}
      {readingMask && <ReadingMaskOverlay />}
      {readingSpotlight && <ReadingSpotlightOverlay />}
      <DictionaryPopup />
      <PronunciationGuidePopup />
      <GoogleTranslate />
      <SmartSuggestions />
      <TtsPlayer />
    </>
  );
}
