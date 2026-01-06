'use client';

import { useState, useEffect, useRef } from 'react';
import AZFeatureList from './AZFeatureList';



import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import { speak } from '@/utils/speechUtils';
import { playAudioPing } from '@/utils/audioPingUtils';
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

import ReadingProgressBar from './ReadingProgressBar';
import ReduceMotionToggle from './ReduceMotionToggle';
import DarkModeToggle from './DarkModeToggle';
import HighlightLinksToggle from './HighlightLinksToggle';
import HighlightHeadingsToggle from './HighlightHeadingsToggle';
import TextSpacingControls from './TextSpacingControls';
import CursorSizeControl from './CursorSizeControl';
import PageZoomControl from './PageZoomControl';
import ColorBlindFilter from './ColorBlindFilter';
import LineHeightControl from './LineHeightControl';
import SpacingControl from './SpacingControl';
import LargeButtonsToggle from './LargeButtonsToggle';
import KeyboardNavigation from './KeyboardNavigation';
import profileIcon from '@/assets/icons/profile.png?inline';
import accessTriggerIcon from '@/assets/icons/access_trigger.png?inline';
import logoIcon from '@/assets/icons/logo_of_ab.png?inline';
import fontSizeIcon from '@/assets/icons/font-size.png?inline';
import contrastIcon from '@/assets/icons/contrast.png?inline';
import layoutIcon from '@/assets/icons/layout.png?inline';
import bookIcon from '@/assets/icons/book.png?inline';
import navigationIcon from '@/assets/icons/navigation.png?inline';
import cursorIcon from '@/assets/icons/cursor (1).png?inline';
import photoIcon from '@/assets/icons/photo.png?inline';
import speakIcon from '@/assets/icons/speak (1).png?inline';
import translateIcon from '@/assets/icons/translate.png?inline';
import generativeIcon from '@/assets/icons/generative.png?inline';
import feedbackIcon from '@/assets/icons/feedback (1).png?inline';
const resetIcon = '/reset.png';
const resetCategoryIcon = '/reset.png';
import infoIcon from '@/assets/icons/info.png?inline';
import informationButtonIcon from '@/assets/icons/information-button.png?inline';
import spacingCategoryIcon from '@/assets/icons/capital-letter.png?inline';
import lineCategoryIcon from '@/assets/icons/line.png?inline';
const letterSpacingIcon = '/letter.png';
import zoomInIcon from '@/assets/icons/zoom-in.png?inline';
import moveUiIcon from '@/assets/icons/move_ui.png?inline';
import sidebarShowIcon from '@/assets/icons/show_sidebar.png?inline';
import sidebarHideIcon from '@/assets/icons/hide_sidebar.png?inline';
import OnPageDictionary from './OnPageDictionary';
import TextAlignControl from './TextAlignControl';
import LanguageSelector from './LanguageSelector';
import PageBackgroundColor from './PageBackgroundColor';
import PositionControls from './PositionControls';

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
import FeedbackControl from './FeedbackControl';
import ThemeSelector from './ThemeSelector';
import SelectionTranslator from './SelectionTranslator';
import InfoPage from './InfoPage';
import SidebarTutorial from './SidebarTutorial';
import VisualConfirmation from './VisualConfirmation';
import FeedbackPopup from './FeedbackPopup';
import { translations } from '@/contexts/accessibility/translations';

import { THEME, BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const [selectedCategoryRect, setSelectedCategoryRect] = useState<DOMRect | null>(null);
  const [showSidebarTutorial, setShowSidebarTutorial] = useState(false);
  const [hasSeenSidebarTutorial, setHasSeenSidebarTutorial] = useState(false);
  const [tutorialIcon, setTutorialIcon] = useState<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showActiveFeaturesList, setShowActiveFeaturesList] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const context = useAccessibility();
  const {
    readingRuler,
    readingGuide,
    readingMask,
    readingSpotlight,
    resetAll,
    decreaseFontSize,
    toggleDarkMode,
    toggleGrayscale,
    toggleInvertColors,
    toggleReadingGuide,
    toggleReadingRuler,
    toggleReadingMask,
    toggleHighlightLinks,
    toggleHighlightHeadings,
    toggleTextToSpeech,
    toggleSpeechToText,
    toggleOnPageDictionary,
    toggleSimplifiedLayout,
    togglePageStructure,
    toggleMagnifier,
    setPageZoom,
    pageZoom,
    toggleHighContrast,
    increaseFontSize,
    language,
    onPageDictionary,
    pageSummary,
    pageStructure,
    textToSpeech,
    showActiveIndicators,
    getActiveFeaturesWithActions,
    isPanelPinned,
    togglePanelPin,
    audioPingEnabled
  } = context;
  const barTheme = (context as any).barTheme as BarTheme | undefined;
  const buttonPosition = (context as any).buttonPosition as string | undefined || 'bottom-right';
  const panelPosition = (context as any).panelPosition as string | undefined || 'left';

  const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];

  const t = translations[language] || translations['en'];

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (onPageDictionary || pageSummary || pageStructure) {
      setIsOpen(false);
      setSelectedCategory(null);
    }
  }, [onPageDictionary, pageSummary, pageStructure]);

  const handleResetSelected = () => {
    setShowActiveFeaturesList(true);
  };

  // Use refs to store latest function references to avoid dependency array issues
  const functionsRef = useRef({
    decreaseFontSize,
    increaseFontSize,
    resetAll,
    setPageZoom,
    toggleDarkMode,
    toggleGrayscale,
    toggleHighlightHeadings,
    toggleHighlightLinks,
    toggleHighContrast,
    toggleInvertColors,
    toggleMagnifier,
    toggleOnPageDictionary,
    togglePageStructure,
    toggleReadingGuide,
    toggleReadingMask,
    toggleReadingRuler,
    toggleSimplifiedLayout,
    toggleSpeechToText,
    toggleTextToSpeech,
  });

  // Update refs when functions change
  useEffect(() => {
    functionsRef.current = {
      decreaseFontSize,
      increaseFontSize,
      resetAll,
      setPageZoom,
      toggleDarkMode,
      toggleGrayscale,
      toggleHighlightHeadings,
      toggleHighlightLinks,
      toggleHighContrast,
      toggleInvertColors,
      toggleMagnifier,
      toggleOnPageDictionary,
      togglePageStructure,
      toggleReadingGuide,
      toggleReadingMask,
      toggleReadingRuler,
      toggleSimplifiedLayout,
      toggleSpeechToText,
      toggleTextToSpeech,
    };
  }, [
    decreaseFontSize,
    increaseFontSize,
    resetAll,
    setPageZoom,
    toggleDarkMode,
    toggleGrayscale,
    toggleHighlightHeadings,
    toggleHighlightLinks,
    toggleHighContrast,
    toggleInvertColors,
    toggleMagnifier,
    toggleOnPageDictionary,
    togglePageStructure,
    toggleReadingGuide,
    toggleReadingMask,
    toggleReadingRuler,
    toggleSimplifiedLayout,
    toggleSpeechToText,
    toggleTextToSpeech,
  ]);

  const pageZoomRef = useRef(pageZoom);
  useEffect(() => {
    pageZoomRef.current = pageZoom;
  }, [pageZoom]);


  useEffect(() => {
    if (selectedCategory) {
      // We don't want to auto-unpin here since it's a dedicated tool now
      // setIsPanelPinned(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const funcs = functionsRef.current;
      const currentZoom = pageZoomRef.current;

      if (e.altKey) {

        if (e.shiftKey) {
          switch (key) {
            case 'f':
              e.preventDefault();
              funcs.decreaseFontSize();
              return;
            case 'd':
              e.preventDefault();
              funcs.toggleOnPageDictionary();
              return;
            case 'm':
              e.preventDefault();
              funcs.toggleMagnifier();
              return;
          }
        }


        if (!e.shiftKey) {
          switch (key) {
            case 'a':
              e.preventDefault();
              setIsOpen((prev) => !prev);
              return;
            case 'c':
              e.preventDefault();
              funcs.toggleHighContrast();
              return;
            case 'f':
              e.preventDefault();
              funcs.increaseFontSize();
              return;
            case 'd':
              e.preventDefault();
              funcs.toggleDarkMode();
              return;
            case 'g':
              e.preventDefault();
              funcs.toggleGrayscale();
              return;
            case 'i':
              e.preventDefault();
              funcs.toggleInvertColors();
              return;
            case 'r':
              e.preventDefault();
              funcs.toggleReadingGuide();
              return;
            case 'u':
              e.preventDefault();
              funcs.toggleReadingRuler();
              return;
            case 'm':
              e.preventDefault();
              funcs.toggleReadingMask();
              return;
            case 'l':
              e.preventDefault();
              funcs.toggleHighlightLinks();
              return;
            case 'h':
              e.preventDefault();
              funcs.toggleHighlightHeadings();
              return;
            case 't':
              e.preventDefault();
              funcs.toggleTextToSpeech();
              return;
            case 'v':
              e.preventDefault();
              funcs.toggleSpeechToText();
              return;
            case 's':
              e.preventDefault();
              funcs.toggleSimplifiedLayout();
              return;
            case 'p':
              e.preventDefault();
              funcs.togglePageStructure();
              return;
            case '+':
            case '=':
              e.preventDefault();
              funcs.setPageZoom(Math.min(currentZoom + 10, 200));
              return;
            case '-':
              e.preventDefault();
              funcs.setPageZoom(Math.max(currentZoom - 10, 50));
              return;
            case '0':
              e.preventDefault();
              funcs.resetAll();
              return;
          }
        }
      }


      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'a') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setSelectedCategory(null);
        triggerRef.current?.focus();
        return;
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


  const getActiveFeaturesCount = (categoryId: string): number => {
    const ctx = context as any;
    let count = 0;

    switch (categoryId) {
      case 'font':
        if (ctx.fontSize && ctx.fontSize !== 16) count++;
        if (ctx.fontStyle && ctx.fontStyle !== 'default') count++;
        break;
      case 'textSpacing':
        if (ctx.textAlign && ctx.textAlign !== 'left') count++;
        break;
      case 'lineHeight':
        if (ctx.lineHeight && ctx.lineHeight !== 1.5) count++;
        break;
      case 'letterSpacing':
        if (ctx.characterSpacing && ctx.characterSpacing !== 0) count++;
        if (ctx.wordSpacing && ctx.wordSpacing !== 0) count++;
        break;
      case 'contrast':
        if (ctx.highContrast) count++;
        if (ctx.darkMode) count++;
        if (ctx.grayscale) count++;
        if (ctx.invertColors) count++;
        if (ctx.colorBlindFilter && ctx.colorBlindFilter !== 'none') count++;
        break;
      case 'quick_zoom':
        if (ctx.pageZoom && ctx.pageZoom !== 100) count++;
        break;
      case 'reading':
        if (readingRuler) count++;
        if (readingGuide) count++;
        if (readingMask) count++;
        if (readingSpotlight) count++;
        if (ctx.largeButtons) count++;
        if (ctx.magnifier) count++;
        break;
      case 'layout':
        if (pageStructure) count++;
        if (ctx.plainTextMode) count++;
        if (ctx.simplifiedLayout) count++;
        if (ctx.highlightLinks) count++;
        if (ctx.highlightHeadings) count++;
        break;
      case 'cursor':
        if (ctx.cursorSize && ctx.cursorSize !== 1) count++;
        if (ctx.cursorStyle && ctx.cursorStyle !== 'white') count++;
        if (ctx.cursorColor && ctx.cursorColor !== '#000000' && ctx.cursorColor !== '#000') count++;
        if (ctx.reduceMotion) count++;
        break;
      case 'images':
        if (ctx.hideImages) count++;
        if (ctx.showImageDescriptions) count++;
        if (ctx.pauseAnimations) count++;
        if (ctx.stopVideos) count++;
        break;
      case 'speech':
        if (ctx.voiceNavigation) count++;
        if (textToSpeech) count++;
        break;
      case 'language':
        if (language && language !== 'en-GB') count++;
        if (ctx.realTimeTranslation) count++;
        if (onPageDictionary) count++;
        if (ctx.pronunciationGuide) count++;
        if (ctx.smartSuggestions) count++;
        break;
      default:
        count = 0;
    }

    return count;
  };

  const categories = [
    { id: 'reset', name: `RESET`, icon: resetIcon, colorClass: 'from-red-500 to-red-600', indicatorClass: 'bg-red-500' },
    { id: 'position', name: `CUSTOMISE\nTOOLBAR`, icon: profileIcon, colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
    { id: 'move_ui', name: `SIDEBAR\nPOSITION`, icon: moveUiIcon, colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
    { id: 'font', name: `FONT TOOLS`, icon: fontSizeIcon, colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'textSpacing', name: `TEXT\nALIGNMENT`, icon: spacingCategoryIcon, colorClass: 'from-lime-500 to-lime-600', indicatorClass: 'bg-lime-500' },
    { id: 'lineHeight', name: `LINE HEIGHT`, icon: lineCategoryIcon, colorClass: 'from-green-500 to-green-600', indicatorClass: 'bg-green-500' },
    { id: 'letterSpacing', name: `Letter/Word\nSpacing`, icon: letterSpacingIcon, colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'contrast', name: `CONTRAST`, icon: contrastIcon, colorClass: 'from-purple-500 to-purple-600', indicatorClass: 'bg-purple-500' },
    { id: 'reading', name: `READING TOOLS`, icon: bookIcon, colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
    { id: 'cursor', name: `CURSOR OPTIONS`, icon: cursorIcon, colorClass: 'from-orange-500 to-orange-600', indicatorClass: 'bg-orange-500' },
    { id: 'navigation', name: `KEYBOARD\nSHORTCUTS`, icon: navigationIcon, colorClass: 'from-violet-500 to-violet-600', indicatorClass: 'bg-violet-500' },
    { id: 'layout', name: `PAGE LAYOUT`, icon: layoutIcon, colorClass: 'from-teal-500 to-teal-600', indicatorClass: 'bg-teal-500' },
    {
      id: 'quick_zoom', name: `QUICK PAGE
ZOOM`, icon: zoomInIcon, colorClass: 'from-blue-500 to-cyan-500', indicatorClass: 'bg-blue-500'
    },
    {
      id: 'images', name: `IMAGES AND
ANIMATION`, icon: '/hide.png', colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500'
    },
    { id: 'speech', name: `TEXT TO\nSPEECH`, icon: speakIcon, colorClass: 'from-yellow-400 to-yellow-500', indicatorClass: 'bg-yellow-400' },
    { id: 'language', name: `LANGUAGE\nTOOLS`, icon: translateIcon, colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'ai', name: `AI SUPPORT`, icon: generativeIcon, colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'feedback', name: `FEEDBACK`, icon: feedbackIcon, colorClass: 'from-pink-500 to-rose-500', indicatorClass: 'bg-pink-500' },
    { id: 'info', name: `INFO`, icon: infoIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },
    { id: 'az', name: `A-Z\nLIST`, icon: navigationIcon, colorClass: 'from-slate-700 to-slate-800', indicatorClass: 'bg-slate-700' },
  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'az':
        return (
          <AZFeatureList
            onNavigate={(cat) => {
              if (audioPingEnabled) playAudioPing();
              setSelectedCategory(cat);
            }}
            onCloseBar={() => setIsOpen(false)}
            onOpenFeedback={() => {

              setShowFeedbackPopup(true);
              setIsOpen(false);
            }}
            onOpenPosition={() => setSelectedCategory('position')}
          />
        );
      case 'position':
        return (
          <div className="space-y-4">
            <PositionControls />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '4px', boxShadow: 'none' }} />
            <ThemeSelector />
          </div>
        );
      case 'font':
        return (
          <div className="space-y-6">
            <FontSizeControls />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FontStyleSelector />
          </div>
        );
      case 'textSpacing':
        return (
          <div className="space-y-6">
            <TextAlignControl />
          </div>
        );
      case 'lineHeight':
        return (
          <div className="space-y-6">
            <LineHeightControl />
          </div>
        );
      case 'letterSpacing':
        return (
          <div className="space-y-6">
            <SpacingControl />
          </div>
        );
      case 'contrast':
        return (
          <div className="space-y-4">
            <ColorBlindFilter />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <DarkModeToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <ContrastToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <GrayscaleToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <InvertColorsToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <PageBackgroundColor />
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-6">
            <PageStructureControl />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <PlainTextModeControl />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <SimplifyLayoutControl />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <HighlightLinksToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <HighlightHeadingsToggle />
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <ReadingRulerToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <ReadingGuideToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <ReadingMaskToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <ReadingSpotlightToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <MagnifierToggle />
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <LargeButtonsToggle />
          </div>
        );
      case 'navigation':
        return (
          <div className="space-y-4">
            <KeyboardNavigation />
          </div>
        );
      case 'quick_zoom':
        return (
          <div className="space-y-6">
            <PageZoomControl />
          </div>
        );
      case 'cursor':
        return (
          <div className="space-y-4">
            <CursorSizeControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
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
            <TextToSpeech />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <VoiceNavigation />
          </div>
        );
      case 'language':
        return (
          <div className="space-y-4">
            <LanguageSelector />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <RealTimeTranslation />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <OnPageDictionary />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <PronunciationGuideToggle />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <SmartSuggestionsToggle />
          </div>
        );
      case 'ai':
        const aiShortcuts = [
          {
            id: 'page_summary',
            name: 'Page Summary',
            desc: 'AI-powered page condensation',
            icon: generativeIcon,
            action: () => { /* This one stays here */ }
          },
          {
            id: 'simplify_layout',
            name: 'Simplify Page Layout',
            desc: 'Remove clutter using AI',
            icon: layoutIcon,
            targetCategory: 'layout'
          },
          {
            id: 'voice_nav',
            name: 'AI Voice Navigation',
            desc: 'Navigate using voice commands',
            icon: speakIcon,
            targetCategory: 'speech'
          },
          {
            id: 'realtime_translate',
            name: 'Real-Time Translation',
            desc: 'AI translation of content',
            icon: translateIcon,
            targetCategory: 'language'
          },
          {
            id: 'smart_suggestions',
            name: 'Smart Suggestions',
            desc: 'AI-based accessibility tips',
            icon: generativeIcon,
            targetCategory: 'language'
          },
          {
            id: 'selection_translate',
            name: 'Selection Translator',
            desc: 'Translate highlighted text',
            icon: translateIcon,
            targetCategory: 'language'
          },
        ];

        return (
          <div className="space-y-4">
            <PageSummaryControl />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <h3 className="text-[14px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: currentTheme.text }}>
              AI Powered Tools
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {aiShortcuts.filter(s => s.id !== 'page_summary').map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => {
                    if (shortcut.targetCategory) {
                      setSelectedCategory(shortcut.targetCategory);
                      // Scroll to top of content when switching
                      const contentEl = panelRef.current?.querySelector('[data-category-content]');
                      if (contentEl) contentEl.scrollTop = 0;
                    }
                  }}
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/shortcut text-left"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.text}15, ${currentTheme.text}08)`,
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    border: `4px solid ${currentTheme.text}30`,
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.active}35, ${currentTheme.active}20)`;
                    e.currentTarget.style.borderColor = `${currentTheme.active}ff`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${currentTheme.text}15, ${currentTheme.text}08)`;
                    e.currentTarget.style.borderColor = `${currentTheme.text}30`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: barTheme === 'white' ? '4px solid #000000' : 'none'
                    }}
                  >
                    <Image
                      src={shortcut.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="brightness-0"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold leading-tight" style={{ color: currentTheme.text }}>
                      {shortcut.name}
                    </div>
                    <div className="text-[12px] opacity-70 truncate" style={{ color: currentTheme.text }}>
                      {shortcut.desc}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 opacity-40 group-hover/shortcut:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: currentTheme.text }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="space-y-6">
            <FeedbackControl />
          </div>
        );
      case 'info':
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-bold mb-4 px-2" style={{ color: currentTheme.text }}>Feature Guide</h3>
            <div className="space-y-2">
              {Object.entries(t.info || {}).map(([key, data]: [string, any]) => {
                const description = typeof data === 'string' ? data : data.description;
                const features = typeof data === 'object' && data.features ? data.features : null;
                const categoryName = categories.find(c => c.id === key)?.name || key;
                const isExpanded = expandedInfoId === key;

                if (key === 'reset' || key === 'info' || key === 'feedback') return null;

                return (
                  <div
                    key={key}
                    className="rounded-xl overflow-hidden border transition-all duration-300"
                    style={{
                      borderColor: isExpanded ? `${currentTheme.active}ff` : `${currentTheme.border}cc`,
                      borderWidth: '4px',
                      background: isExpanded
                        ? `linear-gradient(135deg, ${currentTheme.background}ee, ${currentTheme.background}dd)`
                        : `linear-gradient(135deg, ${currentTheme.text}08, ${currentTheme.text}05)`,
                      backdropFilter: 'blur(10px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                      boxShadow: 'none'
                    }}
                  >
                    <button
                      onClick={() => setExpandedInfoId(isExpanded ? null : key)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-black/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                            backdropFilter: 'blur(10px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                            border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                            boxShadow: 'none'
                          }}
                        >
                          <Image
                            src={categories.find(c => c.id === key)?.icon || infoIcon}
                            alt=""
                            width={24}
                            height={24}
                            style={{ filter: 'brightness(0)' }}
                          />
                        </div>
                        <div className="font-extrabold text-lg uppercase" style={{ color: currentTheme.text }}>{categoryName}</div>
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: currentTheme.text }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-4 pt-0 border-t" style={{ borderColor: `${currentTheme.border}66`, borderTopWidth: '4px' }}>
                        <div className="text-[15px] opacity-80 mb-4 mt-4 leading-relaxed" style={{ color: currentTheme.text }}>{description}</div>

                        {features && (
                          <div className="grid gap-3 mb-4">
                            {Object.entries(features).map(([featureName, featureDesc]: [string, any]) => (
                              <div key={featureName} className="pl-3 border-l-2" style={{ borderColor: `${currentTheme.active}ff`, borderLeftWidth: '4px' }}>
                                <span className="font-bold text-[14px] block" style={{ color: currentTheme.text }}>{featureName}</span>
                                <span className="text-[13px] opacity-70 block leading-snug" style={{ color: currentTheme.text }}>{featureDesc}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`accessibility-bar a11y-embed-host group fixed z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden cursor-pointer ${getButtonPositionClasses()}`}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.background}CC, ${currentTheme.background}B3)`,
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            border: `4px solid ${currentTheme.border}4D`,
            boxShadow: 'none',
            pointerEvents: 'auto'
          }}
          aria-label="Open accessibility menu"
          aria-expanded={isOpen}
          title="Accessibility Options (Ctrl+Shift+A)"
        >
          <Image
            src={accessTriggerIcon}
            alt=""
            width={70}
            height={70}
            className="h-full w-full object-contain"
            priority={true}
          />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2147483646] animate-fade-in"
            onClick={() => {
              if (!isPanelPinned) {
                setIsOpen(false);
                setSelectedCategory(null);
              }
            }}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            className={`accessibility-bar a11y-embed-host fixed z-[2147483647] ${panelBorderStyle} transition-all duration-300 ease-out ${isVertical ? 'overflow-hidden' : 'overflow-visible'} ${getPanelPositionClasses()} ${isVertical ? 'top-0 bottom-0' : 'left-0 right-0'}`}
            style={{
              width: isVertical ? (selectedCategory ? (isMobile ? '100%' : '380px') : (isMobile ? '80px' : '100px')) : '100%',
              height: isVertical ? '100%' : '80px',
              boxSizing: 'border-box',
              flexDirection: isVertical
                ? (panelPosition === 'right' ? 'row-reverse' : 'row')
                : (panelPosition === 'bottom' ? 'column-reverse' : 'column'),
              background: currentTheme.background,
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderTopWidth: !isVertical && panelPosition === 'bottom' ? '4px' : '0px',
              borderBottomWidth: !isVertical && panelPosition === 'top' ? '4px' : '0px',
              borderLeftWidth: isVertical && panelPosition === 'right' ? '4px' : '0px',
              borderRightWidth: isVertical && panelPosition === 'left' ? '4px' : '0px',
              borderStyle: 'solid',
              borderColor: `${currentTheme.border}4D`, // Semi-transparent border for glass feel (30%)
              boxShadow: 'none',
              WebkitBoxShadow: 'none'
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
                className={`flex items-center p-1.5 ${isVertical
                  ? `flex-col w-20 sm:w-[100px] gap-3 sm:gap-4 h-full overflow-y-auto custom-scrollbar`
                  : `flex-row h-full w-full justify-center overflow-x-auto custom-scrollbar gap-2 ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
                  }`}
                style={{
                  background: isVertical
                    ? 'transparent'
                    : `linear-gradient(135deg, ${currentTheme.background}dd, ${currentTheme.background}cc)`,
                  backdropFilter: isVertical ? 'none' : 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: isVertical ? 'none' : 'blur(10px) saturate(180%)',
                  borderColor: isVertical
                    ? (selectedCategory ? currentTheme.border : 'transparent')
                    : currentTheme.border,
                  borderRightWidth: isVertical && panelPosition === 'left' && selectedCategory ? '4px' : '0px',
                  borderLeftWidth: isVertical && panelPosition === 'right' && selectedCategory ? '4px' : '0px',
                  borderTopWidth: !isVertical ? '4px' : '0px',
                  borderBottomWidth: !isVertical ? '4px' : '0px',
                  borderStyle: 'solid',
                  boxShadow: 'none'
                }}
              >
                {/* Plus Button - Side of Icon Bar */}
                <div
                  className="absolute z-[2147483649]"
                  style={{
                    ...(isVertical
                      ? {
                        [panelPosition === 'right' ? 'right' : 'left']: '100%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        [panelPosition === 'right' ? 'marginRight' : 'marginLeft']: '-6px'
                      }
                      : {
                        [panelPosition === 'bottom' ? 'bottom' : 'top']: '100%',
                        right: '20px',
                        [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '-6px'
                      })
                  }}
                >
                  <button
                    onClick={() => {
                      if (audioPingEnabled) playAudioPing();
                      setShowSettingsDropdown(!showSettingsDropdown);
                    }}
                    className="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      background: showSettingsDropdown
                        ? 'linear-gradient(135deg, #00D9FF, #00B8D4)'
                        : 'linear-gradient(135deg, #00E5FF, #00BCD4)',
                      border: '4px solid #FFFFFF',
                      boxShadow: '0 6px 20px rgba(0, 229, 255, 0.4)'
                    }}
                    aria-label="Settings Menu"
                    title="Settings"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300"
                      style={{ transform: showSettingsDropdown ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showSettingsDropdown && (
                    <div
                      className="absolute rounded-2xl shadow-2xl overflow-hidden"
                      style={{
                        ...(isVertical
                          ? {
                            [panelPosition === 'right' ? 'right' : 'left']: '100%',
                            top: '0',
                            [panelPosition === 'right' ? 'marginRight' : 'marginLeft']: '12px'
                          }
                          : {
                            [panelPosition === 'bottom' ? 'bottom' : 'top']: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '12px'
                          }),
                        background: `linear-gradient(135deg, ${currentTheme.background}f5, ${currentTheme.background}e8)`,
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: `3px solid ${currentTheme.border}`,
                        minWidth: '200px',
                        zIndex: 2147483650
                      }}
                    >
                      <button
                        onClick={() => {
                          if (audioPingEnabled) playAudioPing();
                          // Size functionality will be added later
                          setShowSettingsDropdown(false);
                        }}
                        className="w-full px-6 py-4 text-left font-bold text-[17px] transition-all hover:scale-[1.02]"
                        style={{
                          color: currentTheme.text,
                          backgroundColor: 'transparent',
                          borderBottom: `2px solid ${currentTheme.border}`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.hover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Size
                      </button>
                      <button
                        onClick={() => {
                          if (audioPingEnabled) playAudioPing();
                          // Profiles functionality will be added later
                          setShowSettingsDropdown(false);
                        }}
                        className="w-full px-6 py-4 text-left font-bold text-[17px] transition-all hover:scale-[1.02]"
                        style={{
                          color: currentTheme.text,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.hover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Profiles
                      </button>
                    </div>
                  )}
                </div>

                {/* Logo removed as per user request */}

                <button
                  onClick={() => {
                    if (audioPingEnabled) playAudioPing();
                    setIsOpen(false);
                    setSelectedCategory(null);

                    // Interaction counting for Feedback Popup
                    const countKey = 'accessibility_bar_close_count';
                    const feedbackGivenKey = 'accessibility_feedback_given';

                    // Forcing popup to show "abi kelye" (for now) as requested, ignoring previous state
                    // if (!localStorage.getItem(feedbackGivenKey)) {
                    const currentCount = parseInt(localStorage.getItem(countKey) || '0');
                    const newCount = currentCount + 1;
                    localStorage.setItem(countKey, newCount.toString());

                    // Show popup on close if feedback not given (matches "whenever cross is clicked")
                    setShowFeedbackPopup(true);
                    // }
                  }}
                  className={`p-2 rounded-xl transition-all duration-300 pointer-events-auto hover:brightness-110 active:scale-95`}
                  style={{
                    background: barTheme === 'white'
                      ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                    width: isVertical ? '55px' : '58px',
                    height: isVertical ? '55px' : '58px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'none'
                  }}
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

                <div className="relative">
                  <button
                    onClick={() => {
                      if (audioPingEnabled) playAudioPing();
                      togglePanelPin();
                    }}
                    className={`p-2 rounded-xl transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95 z-10 flex items-center justify-center shadow-md`}
                    style={{
                      background: isPanelPinned ? '#FFD700' : (barTheme === 'white'
                        ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))'),
                      backdropFilter: 'blur(10px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                      width: isVertical ? '55px' : '58px',
                      height: isVertical ? '55px' : '58px',
                      boxShadow: 'none'
                    }}
                    title={isPanelPinned ? "Unpin Panel" : "Pin Panel"}
                  >
                    <Image
                      src="/office-push-pin.png"
                      alt="Pin"
                      width={32}
                      height={32}
                      className={`transition-all ${isPanelPinned ? 'opacity-100' : 'opacity-60'}`}
                      style={{ filter: 'brightness(0)' }}
                    />
                  </button>

                  {/* Red 'X' Dismiss Button */}
                  {isPanelPinned && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center border-2 border-white z-20 pointer-events-none"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (audioPingEnabled) playAudioPing();
                    setSelectedCategory(selectedCategory === 'az' ? null : 'az');
                  }}
                  className={`p-2 rounded-xl transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95 z-10 flex flex-col items-center justify-center shadow-md`}
                  style={{
                    background: selectedCategory === 'az' ? '#FFD700' : (barTheme === 'white'
                      ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))'),
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                    width: isVertical ? '55px' : '58px',
                    height: isVertical ? '55px' : '58px',
                    boxShadow: 'none'
                  }}
                  title="A-Z List"
                >
                  <div className="flex flex-col items-center justify-center scale-95">
                    <span className="text-[17px] font-black tracking-widest text-black leading-none">A-Z</span>
                    <div
                      className="px-1.5 rounded-md mt-[-1px]"
                      style={{
                        color: '#000000'
                      }}
                    >
                      <span className="text-[13px] font-black uppercase tracking-tight leading-none">List</span>
                    </div>
                  </div>
                </button>

                <div className={`accessibility-bar pointer-events-auto flex ${isVertical ? 'flex-col space-y-3 sm:space-y-4 items-center flex-shrink-0' : 'flex-row items-center flex-grow px-1 gap-2'}`}>


                  {(() => {
                    // Exclude constant categories from paginated list
                    const constantCategoryIds = ['reset', 'az', 'move_ui_extra']; // az and reset are handled separately
                    const paginatedCategories = categories.filter(c => c.id !== 'reset' && c.id !== 'az');
                    const shouldPaginate = isVertical;
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const visibleCategories = shouldPaginate
                      ? paginatedCategories.slice(startIndex, startIndex + itemsPerPage)
                      : categories;
                    const totalPages = shouldPaginate ? Math.ceil(paginatedCategories.length / itemsPerPage) : 1;

                    return (
                      <>
                        {/* Reset button - rendered constantly before paginated list */}
                        {shouldPaginate && (() => {
                          const resetCategory = categories.find(c => c.id === 'reset');
                          if (!resetCategory) return null;
                          return (
                            <div key="reset-constant" className="relative group/category">
                              <button
                                data-category-btn
                                onClick={() => setShowResetConfirm(true)}
                                onKeyDown={(e) => handleCategoryKeyDown(e, 0)}
                                onMouseEnter={() => textToSpeech && speak(resetCategory.name)}
                                className={`group relative flex flex-col items-center justify-center ${isVertical ? 'w-[78px] h-[80px]' : 'w-[58px] h-[58px]'} rounded-xl transition-all duration-300 overflow-hidden hover:scale-105`}
                                style={{
                                  background: 'linear-gradient(135deg, #FF0000, #CC0000)',
                                  backdropFilter: 'blur(5px) saturate(180%)',
                                  WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                  border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.1)' : '4px solid rgba(255,255,255,0.2)',
                                  boxShadow: 'none'
                                }}
                                aria-label={resetCategory.name}
                                title={resetCategory.name}
                              >
                                <Image
                                  src={resetCategory.icon || ''}
                                  alt=""
                                  width={isVertical ? 50 : 44}
                                  height={isVertical ? 50 : 44}
                                  style={{ filter: 'brightness(0) invert(1)' }}
                                  className="transition-all duration-300 translate-y-0"
                                />
                              </button>
                            </div>
                          );
                        })()}

                        {visibleCategories.map((category, index) => (
                          <div key={category.id} className="relative group/category">
                            <button
                              data-category-btn
                              onKeyDown={(e) => handleCategoryKeyDown(e, shouldPaginate ? index + 1 : index)}
                              onClick={(e) => {
                                if (audioPingEnabled) playAudioPing();
                                if (category.id === 'reset') {
                                  setShowResetConfirm(true);
                                  return;
                                }
                                if (category.id === 'move_ui') {
                                  if (!hasSeenSidebarTutorial) {
                                    setTutorialIcon(category.icon);
                                    setShowSidebarTutorial(true);
                                    setHasSeenSidebarTutorial(true);
                                    localStorage.setItem('accessibility-seen-sidebar-tutorial', 'true');
                                    return;
                                  }
                                  const positions = ['left', 'right', 'top', 'bottom'];
                                  const currentIndex = positions.indexOf(panelPosition || 'left');
                                  const nextIndex = (currentIndex + 1) % positions.length;
                                  (context as any).setPanelPosition(positions[nextIndex]);
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
                              className={`group relative flex flex-col items-center justify-center ${isVertical ? 'w-[78px] h-[80px]' : 'w-[58px] h-[58px]'} rounded-xl transition-all duration-300 overflow-hidden ${selectedCategory === category.id
                                ? 'text-black scale-105'
                                : 'hover:scale-105'
                                }`}
                              style={
                                category.id === 'reset'
                                  ? {
                                    background: 'linear-gradient(135deg, #FF0000, #CC0000)',
                                    backdropFilter: 'blur(5px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.1)' : '4px solid rgba(255,255,255,0.2)',
                                    boxShadow: 'none'
                                  }
                                  : selectedCategory === category.id
                                    ? {
                                      background: `linear-gradient(135deg, ${barTheme === 'yellow' ? '#87CEEB' : '#FFD700'}, ${barTheme === 'yellow' ? '#6BB6D6' : '#E6C200'})`,
                                      backdropFilter: 'blur(5px) saturate(180%)',
                                      WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.4)' : '4px solid rgba(255,255,255,0.4)',
                                      boxShadow: 'none'
                                    }
                                    : {
                                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                                      backdropFilter: 'blur(5px) saturate(180%)',
                                      WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                                      boxShadow: 'none'
                                    }
                              }
                              aria-label={category.name}
                              title={category.name}
                            >
                              <Image
                                src={
                                  category.id === 'move_ui'
                                    ? (panelPosition === 'left' ? sidebarShowIcon : panelPosition === 'right' ? sidebarHideIcon : category.icon as any)
                                    : category.icon || ''
                                }
                                alt=""
                                width={isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))}
                                height={isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))}
                                style={{
                                  filter: category.id === 'reset' ? 'brightness(0) invert(1)' : (category.id === 'info' ? 'none' : 'brightness(0)'),
                                  ...(category.id === 'reset' ? {} : {})
                                }}
                                className={`transition-all duration-300 translate-y-[-5px] ${isVertical ? 'mb-0.5' : ''} ${selectedCategory === category.id
                                  ? ''
                                  : 'opacity-70 group-hover:opacity-100'
                                  }`}
                              />
                              {isVertical && category.id !== 'reset' && category.id !== 'az' && (
                                <span
                                  className={`text-[9px] font-bold leading-tight text-center px-0.5 whitespace-pre-line uppercase opacity-100 ${category.id === 'images' ? 'translate-y-[-6px]' : 'translate-y-[-3px]'}`}
                                  style={{ color: '#000000', letterSpacing: '0.02em' }}
                                >
                                  {category.name}
                                </span>
                              )}

                              {/* Active features indicator lines */}
                              {(() => {
                                const activeCount = getActiveFeaturesCount(category.id);
                                if (activeCount === 0 || !showActiveIndicators) return null;

                                // Show max 5 lines
                                const linesToShow = Math.min(activeCount, 5);

                                return (
                                  <div
                                    className={`absolute bottom-0.5 flex gap-0.5 z-10 ${linesToShow <= 3 ? 'left-1/2 -translate-x-1/2' : 'left-1'}`}
                                  >
                                    {Array.from({ length: linesToShow }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-2 h-2 rounded-full shadow-sm"
                                        style={{ backgroundColor: '#FF0000' }}
                                      />
                                    ))}
                                  </div>
                                );
                              })()}

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

                        {/* Pagination Control - for vertical sidebar */}
                        {shouldPaginate && totalPages > 1 && (
                          <div className="flex flex-col items-center py-0.5 space-y-0.5 mt-0">
                            {/* Directional Arrow */}
                            <button
                              onClick={() => setCurrentPage(p => p === totalPages ? 1 : p + 1)}
                              className="flex items-center justify-center mb-0 mt-[-14px] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                              aria-label="Next Page"
                            >
                              <svg width="50" height="15" viewBox="0 0 60 20" fill="none">
                                <path
                                  d="M5 10 H55 M45 3 L55 10 L45 17"
                                  stroke={currentTheme.text}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            {/* Page Indicator Pill */}
                            <div
                              className="px-1 py-0.5 rounded-full flex gap-1 items-center backdrop-blur-md"
                              style={{
                                background: `${currentTheme.text}1A`, // 10% opacity
                                border: `1px solid ${currentTheme.text}1A`
                              }}
                            >
                              {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                  key={i + 1}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black transition-all`}
                                  style={{
                                    backgroundColor: currentPage === i + 1 ? currentTheme.text : 'transparent',
                                    color: currentPage === i + 1 ? currentTheme.background : currentTheme.text,
                                    opacity: currentPage === i + 1 ? 1 : 0.6
                                  }}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}


                </div>

                {/* Reset button area */}
                <div className={`flex ${isVertical ? 'mt-auto flex-col space-y-2 sm:space-y-3' : 'ml-auto flex-row space-x-5'} items-center flex-shrink-0`}>
                </div>
              </div>



              {selectedCategory && selectedCategory !== 'info' && (
                <div
                  className={`accessibility-bar pointer-events-auto flex flex-col min-w-0 ${isVertical
                    ? 'relative flex-1 h-full'
                    : `fixed z-[2147483647] ${panelPosition === 'bottom' ? (isMobile ? 'bottom-[90px]' : 'bottom-[94px]') : (isMobile ? 'top-[90px]' : 'top-[94px]')} ${isMobile ? 'w-[calc(100vw-20px)] left-[10px]' : 'w-[270px]'} shadow-2xl rounded-none overflow-hidden animate-fade-in`
                    }`}
                  style={!isVertical ? {
                    left: isMobile ? '10px' : `${Math.max(10, Math.min(window.innerWidth - 280, selectedOffset - 135))}px`,
                    background: `linear-gradient(135deg, ${currentTheme.background}E6, ${currentTheme.background}D9)`,
                    backdropFilter: 'blur(10px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(190%)',
                    borderTop: `4px solid ${currentTheme.border}4D`,
                    borderBottom: `4px solid ${currentTheme.border}4D`,
                    borderLeft: `4px solid ${currentTheme.border}4D`,
                    borderRight: `4px solid ${currentTheme.border}4D`,
                    maxHeight: isMobile ? '70vh' : 'auto',
                    boxShadow: 'none'
                  } : {
                    background: 'transparent',
                    border: 'none'
                  }}
                >
                  <div
                    className="p-6 border-b-4 relative"
                    style={{
                      borderColor: `${currentTheme.border}`,
                      borderBottomWidth: '4px',
                      background: `linear-gradient(180deg, ${currentTheme.background}00, ${currentTheme.background}15)`,
                      backdropFilter: 'blur(2.5px)',
                      WebkitBackdropFilter: 'blur(2.5px)',
                      boxShadow: 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 pr-10">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, #FFD700, #E6C200)`,
                            backdropFilter: 'blur(10px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                            color: '#000000',
                            border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.3)' : '4px solid rgba(255,255,255,0.3)',
                            boxShadow: 'none'
                          }}
                        >
                          {selectedCategory === 'az' ? (
                            <div className="flex flex-col items-center justify-center scale-[1.2] translate-y-[-1px]">
                              <span className="text-[14px] font-black tracking-widest text-black leading-none">A-Z</span>
                              <div className="mt-[-4px]">
                                <span className="text-[10px] font-black uppercase tracking-tight leading-none">List</span>
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={
                                categories.find((c) => c.id === selectedCategory)
                                  ?.icon || ''
                              }
                              alt=""
                              width={selectedCategory === 'position' ? 36 : 32}
                              height={selectedCategory === 'position' ? 36 : 32}
                              className={`${selectedCategory === 'speech' ? '' : 'brightness-0'} -translate-y-0.5`}
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h2 className={`text-[16px] sm:text-[20px] font-extrabold uppercase tracking-tight leading-[1.2] mt-2 sm:mt-[12px] whitespace-pre-line`} style={{ color: currentTheme.text }}>
                            {categories.find((c) => c.id === selectedCategory)?.name}
                          </h2>
                        </div>
                      </div>
                      <div className="flex items-center absolute top-0 right-0">

                        <button
                          onClick={() => {
                            if (audioPingEnabled) playAudioPing();
                            setSelectedCategory(null);
                          }}
                          className="p-3 pr-4 rounded-none transition-all hover:bg-black/10 z-10 flex items-center gap-1.5"
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
                          <span className="text-sm font-semibold uppercase tracking-wide">Close</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  <div
                    data-category-content
                    className={`${isVertical ? 'flex-1' : (isMobile ? 'h-[350px]' : 'h-[420px]')} overflow-y-auto overflow-x-hidden p-4 sm:p-6 custom-scrollbar min-w-0 break-words`}
                  >
                    {renderCategoryContent()}
                  </div>

                  {/* Indicator Arrow */}
                  {selectedCategory && !isVertical && !isMobile && (
                    <div
                      className="fixed z-[2147483647] pointer-events-none"
                      style={{
                        width: '30px',
                        height: '15px',
                        backgroundColor: currentTheme.background,
                        left: `${selectedOffset - 15}px`,
                        ...(panelPosition === 'bottom'
                          ? { bottom: '80px', clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }
                          : { top: '80px', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }
                        ),
                        border: `4px solid ${currentTheme.border}`,
                        // Since clip-path cuts off borders, we'll try a different approach or SVG if needed, 
                        // but let's try a simple SVG for better border control first as shown below.
                      }}
                    >
                    </div>
                  )}
                  {/* Better SVG Arrow Implementation */}
                  {selectedCategory && !isVertical && !isMobile && (
                    <div
                      className="fixed z-[2147483650] pointer-events-none"
                      style={{
                        left: `${selectedOffset - 15}px`,
                        ...(panelPosition === 'bottom'
                          ? { bottom: '85px' }
                          : { top: '85px' }
                        ),
                        filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
                      }}
                    >
                      <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
                        {panelPosition === 'bottom' ? (
                          <path
                            d="M0 0 L15 15 L30 0"
                            fill={currentTheme.background}
                            stroke={currentTheme.border}
                            strokeWidth="4"
                          />
                        ) : (
                          <path
                            d="M0 20 L15 5 L30 20"
                            fill={currentTheme.background}
                            stroke={currentTheme.border}
                            strokeWidth="4"
                          />
                        )}
                      </svg>
                    </div>
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
      <ReadingProgressBar />
      <DictionaryPopup />
      <SelectionTranslator />
      <PronunciationGuidePopup />
      <GoogleTranslate />
      <SmartSuggestions />
      <TtsPlayer />
      <SimplifiedLayoutOverlay />
      <MagnifierOverlay />
      <PageStructureOverlay />
      <PageSummaryOverlay />
      <style jsx global>{`
        html.highlight-links a:not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-links body a:not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-links * a:not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: #FFD700 !important;
          background: #FFD700 !important;
          color: #000000 !important;
          background-image: none !important;
          text-decoration: underline !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-weight: bold !important;
          opacity: 1 !important;
                    box-shadow: none !important;
        }
        html.highlight-headings :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-headings body :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-headings * :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: #FFD700 !important;
          background: #FFD700 !important;
          color: #000000 !important;
          background-image: none !important;
          display: inline-block !important;
          padding: 3px 6px !important;
          border-radius: 3px !important;
          opacity: 1 !important;
                    box-shadow: none !important;
          font-weight: bold !important;
        }
      `}</style>

      {/* Reset Popup Overlay */}
      {showResetConfirm && (
        <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowResetConfirm(false);
              setTimeout(() => setShowActiveFeaturesList(false), 300);
            }}
          />
          <div
            className="relative w-full max-w-lg rounded-[40px] overflow-hidden border-4 animate-in zoom-in-95 duration-300"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.background}ee, ${currentTheme.background}dd)`,
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderColor: `${currentTheme.border}`,
              color: currentTheme.text,
              boxShadow: 'none'
            }}
          >
            <div className="p-8 pb-4 text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group"
                style={{
                  background: `linear-gradient(135deg, ${barTheme === 'yellow' ? '#87CEEB' : '#FFD700'}, ${barTheme === 'yellow' ? '#6BB6D6' : '#E6C200'})`,
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  color: '#000000',
                  border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.3)' : '4px solid rgba(255,255,255,0.3)',
                  boxShadow: 'none'
                }}
              >
                <Image src={resetIcon} alt="" width={60} height={60} className="brightness-0 transition-transform" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-4">
                {showActiveFeaturesList
                  ? (t.common?.resetSelectInstructions || "Please select/delete which features you want to reset:")
                  : (t.common?.resetConfirmTitle || "Do you want to reset all features or only some selected features?")
                }
              </h3>
            </div>

            {!showActiveFeaturesList ? (
              <div className="p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    resetAll();
                    setShowResetConfirm(false);
                  }}
                  className="group relative overflow-hidden px-8 py-5 rounded-2xl text-black font-black tracking-widest hover:scale-[1.02] transition-all active:scale-95 border-4"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #E6C200)',
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    borderColor: 'rgba(0,0,0,0.2)',
                    boxShadow: 'none'
                  }}
                >
                  <span className="relative z-10">{t.common?.resetAllBtn || "Reset All"}</span>
                </button>

                <button
                  onClick={() => {
                    if (audioPingEnabled) playAudioPing();
                    handleResetSelected();
                  }}
                  className="group relative overflow-hidden px-8 py-5 rounded-2xl font-black tracking-widest hover:scale-[1.02] transition-all active:scale-95 border-2"
                  style={{
                    background: barTheme === 'white'
                      ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))',
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    borderColor: barTheme === 'white' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
                    color: currentTheme.text,
                    boxShadow: 'none'
                  }}
                >
                  <span className="relative z-10">{t.common?.resetSelectedBtn || "Reset Selected"}</span>
                </button>
              </div>
            ) : (
              <div className="p-8 pt-0 flex flex-col gap-4 items-center">
                <div className="flex flex-wrap gap-2 justify-center mb-0 max-h-[150px] overflow-y-auto px-4 w-full custom-scrollbar">
                  {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language'].map((catId) => {
                    const features = getActiveFeaturesWithActions(catId);
                    if (features.length === 0) return null;
                    return (
                      <div key={catId} className="contents">
                        {features.map((feature, idx) => (
                          <div
                            key={`${catId}-${idx}`}
                            className="px-3 py-1.5 rounded-full shadow-sm border font-bold text-[13px] whitespace-nowrap flex items-center gap-2 animate-in zoom-in-50 duration-200"
                            style={{
                              backgroundColor: currentTheme.background,
                              color: currentTheme.text,
                              borderColor: currentTheme.border
                            }}
                          >
                            <span>{feature.label}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                feature.onRemove();
                              }}
                              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                              style={{ backgroundColor: '#EF4444', color: 'white' }}
                              aria-label={`Remove ${feature.label}`}
                              title="Remove"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language'].every(catId => getActiveFeaturesWithActions(catId).length === 0) && (
                    <span className="text-sm opacity-60">No active features to reset.</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    setTimeout(() => setShowActiveFeaturesList(false), 300);
                  }}
                  className="mt-6 px-12 py-3.5 rounded-2xl text-[18px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all active:scale-95 border-2"
                  style={{
                    background: `linear-gradient(135deg, ${barTheme === 'yellow' ? '#87CEEB' : '#FFD700'}, ${barTheme === 'yellow' ? '#6BB6D6' : '#E6C200'})`,
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    color: '#000000',
                    borderColor: 'rgba(0,0,0,0.2)',
                    boxShadow: 'none'
                  }}
                >
                  Save
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowResetConfirm(false);
                setTimeout(() => setShowActiveFeaturesList(false), 300);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl hover:bg-black/5 transition-colors opacity-40 hover:opacity-100"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Info Page Overlay */}
      {isOpen && selectedCategory === 'info' && (
        <InfoPage onClose={() => setSelectedCategory(null)} categories={categories} />
      )}

      {/* Sidebar Tutorial Popup */}
      {showSidebarTutorial && (
        <SidebarTutorial
          onClose={() => setShowSidebarTutorial(false)}
          icon={tutorialIcon || moveUiIcon}
        />
      )}

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <FeedbackPopup
          onClose={() => {
            setShowFeedbackPopup(false);
            // Do NOT mark as given on simple close, only on submit (handled inside component or separately)
            // This allows it to show again until submitted
          }}
          onSubmit={() => {
            localStorage.setItem('accessibility_feedback_given', 'true');
            setShowFeedbackPopup(false);
          }}
        />
      )}

      <style jsx>{`
        html.highlight-links a:not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-links body a:not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-links * a:not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: #FFFF00 !important;
          background: #FFFF00 !important;
          color: #000000 !important;
          background-image: none !important;
          display: inline-block !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-weight: bold !important;
          opacity: 1 !important;
                    box-shadow: none !important;
        }
        html.highlight-headings :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-headings body :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *),
        html.highlight-headings * :is(h1, h2, h3, h4, h5, h6):not(.accessibility-bar *):not(.a11y-embed-host *) {
          background-color: ${currentTheme.background} !important;
          background: ${currentTheme.background} !important;
          color: ${currentTheme.text} !important;
          background-image: none !important;
          display: inline-block !important;
          padding: 3px 6px !important;
          border-radius: 3px !important;
          opacity: 1 !important;
                    box-shadow: none !important;
          font-weight: bold !important;
        }
      `}</style>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px !important;
          height: 5px !important;
          background: transparent !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${currentTheme.active}cc !important;
          border-radius: 10px !important;
          transition: background-color 0.2s ease !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: ${currentTheme.active} !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
        }
      `}</style>
      <VisualConfirmation />
    </>
  );
}
