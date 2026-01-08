'use client';

import { useState, useEffect, useRef } from 'react';




import { useAccessibility } from '@/contexts/AccessibilityContext';
import Image from 'next/image';
import { safeStorage } from '@/utils/safeStorage';
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
import resetIcon from '@/assets/icons/reset.png?inline';
const resetCategoryIcon = resetIcon;
import infoIcon from '@/assets/icons/info.png?inline';
import informationButtonIcon from '@/assets/icons/information-button.png?inline';
import spacingCategoryIcon from '@/assets/icons/capital-letter.png?inline';
import lineCategoryIcon from '@/assets/icons/line.png?inline';
import letterIcon from '@/assets/icons/letter.png?inline';
const letterSpacingIcon = letterIcon;
import hideIcon from '@/assets/icons/hide.png?inline';
import zoomInIcon from '@/assets/icons/zoom-in.png?inline';
import moveUiIcon from '@/assets/icons/move_ui.png?inline';
import sidebarShowIcon from '@/assets/icons/show_sidebar.png?inline';
import sidebarHideIcon from '@/assets/icons/hide_sidebar.png?inline';
import pinIcon from '@/assets/icons/office-push-pin.png?inline';
const azIcon = accessTriggerIcon;
import paginationArrowIcon from '@/assets/icons/arrow-right.png?inline';
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
import FeatureWrapper from './FeatureWrapper';
import FeedbackPopup from './FeedbackPopup';
import AZFeatureList from './AZFeatureList';
import { translations } from '@/contexts/accessibility/translations';

import { THEME, BAR_THEMES, BarTheme } from '@/contexts/accessibility/theme';

export default function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  const [selectedOffset, setSelectedOffset] = useState<number>(0);
  const [selectedCategoryRect, setSelectedCategoryRect] = useState<DOMRect | null>(null);
  const [showSidebarTutorial, setShowSidebarTutorial] = useState(false);
  const [hasSeenSidebarTutorial, setHasSeenSidebarTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return safeStorage.getItem('accessibility-seen-sidebar-tutorial') === 'true';
    }
    return false;
  });
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
  const [settingsView, setSettingsView] = useState<'main' | 'size' | 'profiles'>('main');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const lastOpenTimeRef = useRef<number>(0);

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
    audioPingEnabled,
    sidebarIconSize,
    setSidebarIconSize,
    toggleLargeButtons,
    setMagnifierScale,
    setReadingGuideColor,
    setReadingRulerColor,
    setReadingMaskColor,
    setFontStyle,
    setLineHeight,
    setCharacterSpacing,
    setWordSpacing,
    setCursorSize,
    setCursorStyle,
    setBackgroundColor,
    setTextColor,
    setHeadingColor,
    setReadingSpotlightBrightness,
    setReadingRulerWidth,
    setReadingMaskSize,
    setReadingProgressBarColor,
    setPlainTextSize,
    setLargeButtons,
    setKeyboardNavigation,
    setTextToSpeech,
    setSpeechToText,
    setOnPageDictionary,
    setSimplifiedLayout,
    setPageStructure,
    setHighContrast,
    setGrayscale,
    setInvertColors,
    setDarkMode,
    setReadingRuler,
    setReadingGuide,
    setReadingMask,
    setReadingSpotlight,
    setMagnifier,
    setHighlightLinks,
    setHighlightHeadings,
    setReduceMotion,
    setPauseAnimations,
    setStopVideos,
    setPageSummary,
    setHideImages,
    setShowImageDescriptions,
    setPlainTextMode,
    setSmartSuggestions,
    setRealTimeTranslation,
    softReset, // Import softReset
    resetIconStyle
  } = context;

  const applyProfile = (profileId: string) => {
    softReset();
    setActiveProfile(profileId);

    switch (profileId) {
      case 'motor':
        setLargeButtons?.(true);
        setKeyboardNavigation?.(true);
        setSpeechToText?.(true);
        setCursorSize?.(1.5);
        setSimplifiedLayout?.(true);
        togglePanelPin?.();
        break;
      case 'blindness':
        setTextToSpeech?.(true);
        setSpeechToText?.(true);
        setKeyboardNavigation?.(true);
        setPageStructure?.(true);
        break;
      case 'colorblind':
        setHighContrast?.(true);
        setHighlightLinks?.(true);
        setHighlightHeadings?.(true);
        break;
      case 'dyslexia':
        setFontStyle?.('dyslexic');
        setLineHeight?.(1.5);
        setCharacterSpacing?.(0.1);
        setWordSpacing?.(0.16);
        increaseFontSize();
        increaseFontSize();
        setReadingRuler?.(true);
        setHighlightHeadings?.(true);
        break;
      case 'lowvision':
        increaseFontSize();
        increaseFontSize();
        increaseFontSize();
        increaseFontSize();
        setHighContrast?.(true);
        setMagnifier?.(true);
        setCursorSize?.(1.5);
        setCursorStyle?.('black');
        setHighlightLinks?.(true);
        setTextColor?.('#000000');
        setBackgroundColor?.('#ffffff');
        break;
      case 'cognitive':
        setSimplifiedLayout?.(true);
        setReadingMask?.(true);
        setHighlightHeadings?.(true);
        setHighlightLinks?.(true);
        setOnPageDictionary?.(true);
        break;
      case 'seizure':
        setGrayscale?.(true);
        setPauseAnimations?.(true);
        setReduceMotion?.(true);
        setStopVideos?.(true); // Added as per user request
        break;
      case 'adhd':
        setReadingMask?.(true);
        setReadingRuler?.(true);
        setHighlightLinks?.(true);
        setHighlightHeadings?.(true);
        setReadingSpotlight?.(true);
        break;
      case 'photosensitive':
        toggleDarkMode?.(); // Or setBackgroundColor('#333'); setTextColor('#fff');
        setPauseAnimations?.(true);
        setReduceMotion?.(true);
        break;
      case 'elderly':
        increaseFontSize();
        increaseFontSize();
        increaseFontSize();
        increaseFontSize();
        setSimplifiedLayout?.(true);
        break;
      case 'hearing':
        setHighlightHeadings?.(true);
        break;
      case 'reading':
        setReadingRuler?.(true);
        setReadingGuide?.(true);
        setLineHeight?.(1.5);
        setWordSpacing?.(0.16);
        break;
      case 'custom':

        break;
    }

    if (audioPingEnabled) playAudioPing();
  };
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
    // Handler for clicking outside the panel
    const handleClickOutside = (event: MouseEvent) => {
      // If panel is closed or pinned, do nothing
      if (!isOpen || isPanelPinned) return;

      const target = event.target as Node;
      const path = event.composedPath();

      // Check if click is outside panel using composedPath for Shadow DOM support
      const isOutsidePanel =
        (panelRef.current && !path.includes(panelRef.current)) &&
        !path.some(el => (el as Element)?.classList?.contains?.('accessibility-bar'));

      // Check if click is outside trigger button (if it exists)
      const isOutsideTrigger = !triggerRef.current || !triggerRef.current.contains(target);

      // CRITICAL FIX FOR EMBED MODE:
      // In embed mode (Shadow DOM), the event target might look like the host element to the outside document.
      // We need to check if the click path includes our specific embed host ID or class.
      const isEmbedHost = path.some(el =>
        (el as Element)?.id === 'a11y-embed-host-react' ||
        (el as Element)?.classList?.contains?.('a11y-embed-host')
      );

      // If it IS the embed host, we consider it "inside" for this check, 
      // because the internal click handling (inside the shadow root) will handle the specific button clicks.
      // If we don't return here, this "outside" listener will fire and close the panel immediately.
      if (isEmbedHost) return;

      if (isOutsidePanel && isOutsideTrigger) {
        // Only close the expanded panel (category), do not close the main bar
        if (selectedCategory) {
          // Verify if we are in Info mode (full screen), if so, ignore outside clicks
          if (selectedCategory === 'info') return;
          setSelectedCategory(null);
        }
      }
    };

    if (isOpen) {
      lastOpenTimeRef.current = Date.now();
      // Use short delay to prevent the opening click from being caught
      const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    return () => {
        clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
    }
  }, [isOpen, isPanelPinned, selectedCategory]);

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
        // Prevent immediate close on Escape if just opened
        if (Date.now() - lastOpenTimeRef.current < 300) return;
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
        if (ctx.lineHeight && ctx.lineHeight !== 1) count++;
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
    { id: 'az', name: `A-Z LIST`, icon: azIcon, colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'reset', name: `RESET`, icon: resetIcon, colorClass: 'from-red-500 to-red-600', indicatorClass: 'bg-red-500' },
    { id: 'move_ui', name: `SIDEBAR\nPOSITION`, icon: moveUiIcon, colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
    { id: 'position', name: `CUSTOMISE\nTOOLBAR`, icon: profileIcon, colorClass: 'from-slate-500 to-slate-600', indicatorClass: 'bg-slate-500' },
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
ANIMATION`, icon: hideIcon, colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500'
    },
    { id: 'speech', name: `TEXT TO\nSPEECH`, icon: speakIcon, colorClass: 'from-yellow-400 to-yellow-500', indicatorClass: 'bg-yellow-400' },
    { id: 'language', name: `LANGUAGE\nTOOLS`, icon: translateIcon, colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'ai', name: `AI SUPPORT`, icon: generativeIcon, colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'feedback', name: `FEEDBACK`, icon: feedbackIcon, colorClass: 'from-pink-500 to-rose-500', indicatorClass: 'bg-pink-500' },

    { id: 'info', name: `INFO`, icon: infoIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },

  ];

  const renderCategoryContent = () => {
    switch (selectedCategory) {

      case 'az':
        return (
          <div className="h-full">
            <AZFeatureList
              onNavigate={(cat, featureId) => {
                setSelectedCategory(cat);
                setHighlightedFeature(featureId || null);
              }}
              onCloseBar={() => setIsOpen(false)}
              onOpenFeedback={() => setSelectedCategory('feedback')}
              onOpenPosition={() => setSelectedCategory('position')}
            />
          </div>
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
            <FeatureWrapper featureId="font-size" highlightedFeature={highlightedFeature}>
              <FontSizeControls />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="font-style" highlightedFeature={highlightedFeature}>
              <FontStyleSelector />
            </FeatureWrapper>
          </div>
        );
      case 'textSpacing':
        return (
          <div className="space-y-6">
            <FeatureWrapper featureId="text-align" highlightedFeature={highlightedFeature}>
              <TextAlignControl />
            </FeatureWrapper>
          </div>
        );
      case 'lineHeight':
        return (
          <div className="space-y-6">
            <FeatureWrapper featureId="line-height" highlightedFeature={highlightedFeature}>
              <LineHeightControl />
            </FeatureWrapper>
          </div>
        );
      case 'letterSpacing':
        return (
          <div className="space-y-6">
            <SpacingControl highlightedFeature={highlightedFeature} />
          </div>
        );
      case 'contrast':
        return (
          <div className="space-y-4">
            <FeatureWrapper featureId="color-blind" highlightedFeature={highlightedFeature}>
              <ColorBlindFilter />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="dark-mode" highlightedFeature={highlightedFeature}>
              <DarkModeToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="contrast-toggle" highlightedFeature={highlightedFeature}>
              <ContrastToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="grayscale" highlightedFeature={highlightedFeature}>
              <GrayscaleToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="invert-colors" highlightedFeature={highlightedFeature}>
              <InvertColorsToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="page-background" highlightedFeature={highlightedFeature}>
              <PageBackgroundColor />
            </FeatureWrapper>
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-6">
            <FeatureWrapper featureId="page-structure" highlightedFeature={highlightedFeature}>
              <PageStructureControl />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="plain-text" highlightedFeature={highlightedFeature}>
              <PlainTextModeControl />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="simplify-layout" highlightedFeature={highlightedFeature}>
              <SimplifyLayoutControl />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="highlight-links" highlightedFeature={highlightedFeature}>
              <HighlightLinksToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="highlight-headings" highlightedFeature={highlightedFeature}>
              <HighlightHeadingsToggle />
            </FeatureWrapper>
          </div>
        );
      case 'reading':
        return (
          <div className="space-y-4">
            <FeatureWrapper featureId="reading-ruler" highlightedFeature={highlightedFeature}>
              <ReadingRulerToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="reading-guide" highlightedFeature={highlightedFeature}>
              <ReadingGuideToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="reading-mask" highlightedFeature={highlightedFeature}>
              <ReadingMaskToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="reading-spotlight" highlightedFeature={highlightedFeature}>
              <ReadingSpotlightToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="magnifier" highlightedFeature={highlightedFeature}>
              <MagnifierToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-6" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="large-buttons" highlightedFeature={highlightedFeature}>
              <LargeButtonsToggle />
            </FeatureWrapper>
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
            <CursorSizeControl highlightedFeature={highlightedFeature} />
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="reduce-motion" highlightedFeature={highlightedFeature}>
              <ReduceMotionToggle />
            </FeatureWrapper>
          </div>
        );
      case 'images':
        return (
          <div className="space-y-6">
            <ContentFiltering highlightedFeature={highlightedFeature} />
          </div>
        );
      case 'speech':
        return (
          <div className="space-y-6">
            <FeatureWrapper featureId="text-to-speech" highlightedFeature={highlightedFeature}>
              <TextToSpeech />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="voice-navigation" highlightedFeature={highlightedFeature}>
              <VoiceNavigation />
            </FeatureWrapper>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6">
            <FeatureWrapper featureId="language-selector" highlightedFeature={highlightedFeature}>
              <LanguageSelector />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="real-time-translation" highlightedFeature={highlightedFeature}>
              <RealTimeTranslation />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="dictionary" highlightedFeature={highlightedFeature}>
              <OnPageDictionary />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="pronunciation-guide" highlightedFeature={highlightedFeature}>
              <PronunciationGuideToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <FeatureWrapper featureId="smart-suggestions" highlightedFeature={highlightedFeature}>
              <SmartSuggestionsToggle />
            </FeatureWrapper>
            <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '3px', boxShadow: 'none' }} />
            <SelectionTranslator />
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
          type="button"
          ref={triggerRef}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`accessibility-bar a11y-embed-host fixed z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden cursor-pointer ${getButtonPositionClasses()}`}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.background}CC, ${currentTheme.background}B3)`,
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            border: `4px solid ${currentTheme.border}4D`,
            boxShadow: 'none',
            pointerEvents: 'auto',
            zoom: '1', // Prevent browser zoom influence
            transform: 'none', // Prevent transform scaling
            fontSize: '16px' // Force base font size
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
            ref={panelRef}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            className={`accessibility-bar a11y-embed-host fixed z-[2147483647] ${panelBorderStyle} transition-all duration-300 ease-out overflow-visible pointer-events-auto ${getPanelPositionClasses()} ${isVertical ? 'top-0 bottom-0' : 'left-0 right-0'}`}
            style={{
              width: isVertical
                ? (selectedCategory
                  ? (isMobile ? '100vw' : `min(calc(280px + ${120 * sidebarIconSize}px), 95vw)`)
                  : (isMobile ? 'clamp(70px, 15vw, 90px)' : `${120 * sidebarIconSize}px`))
                : '100vw',
              height: isVertical ? '100%' : `${80 * sidebarIconSize}px`,
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
            {/* Plus Button - Truly Outside Positioning */}
            <div
              className="absolute z-[2147483650]"
              style={{
                ...(isVertical
                  ? {
                    [panelPosition === 'right' ? 'right' : 'left']: '100%',
                    top: '38%',
                    transform: 'translateY(-50%)',
                    [panelPosition === 'right' ? 'marginRight' : 'marginLeft']: '0px'
                  }
                  : {
                    [panelPosition === 'bottom' ? 'bottom' : 'top']: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '0px'
                  })
              }}
            >
              <button
                onClick={() => {
                  if (audioPingEnabled) playAudioPing();
                  setShowSettingsDropdown(!showSettingsDropdown);
                }}
                className={`relative flex items-center justify-center ${isVertical ? 'w-6 h-[220px]' : 'w-[220px] h-6'} rounded-none transition-all duration-300 hover:brightness-110 active:scale-95 shadow-xl`}
                style={{
                  zoom: '1', // Isolate from zoom
                  fontSize: '16px', // Isolate from font size
                  background: showSettingsDropdown
                    ? `linear-gradient(135deg, ${currentTheme.active}, ${currentTheme.active}dd)`
                    : `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                  border: 'none',
                  boxShadow: `0 8px 32px ${currentTheme.border}4D`
                }}
                aria-label="Settings Menu"
                title="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
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
                  className="absolute z-[2147483651] overflow-hidden rounded-[24px] shadow-2xl"
                  style={{
                    ...(isVertical
                      ? {
                        [panelPosition === 'right' ? 'right' : 'left']: '100%',
                        top: '-50px',
                        [panelPosition === 'right' ? 'marginRight' : 'marginLeft']: '20px'
                      }
                      : {
                        [panelPosition === 'bottom' ? 'bottom' : 'top']: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '20px'
                      }),
                    background: `linear-gradient(165deg, ${currentTheme.background}F2, ${currentTheme.background})`,
                    border: `2px solid ${currentTheme.border}`,
                    width: '320px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="flex flex-col">
                    {/* Header */}
                    {/* Header */}
                    {/* Header */}
                    {/* Header */}
                    <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.8)' }}>
                      {settingsView === 'main' ? (
                        <h3 className="text-[14px] font-black tracking-[0.15em]" style={{ color: currentTheme.text }}>
                          Accessibility Settings
                        </h3>
                      ) : (
                        <button
                          onClick={() => setSettingsView('main')}
                          className="p-2 -ml-2 rounded-xl hover:bg-black/10 transition-colors flex items-center gap-1.5 group"
                          style={{ color: currentTheme.text }}
                        >
                          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                          <span className="text-[13px] font-black tracking-wider opacity-100">Settings</span>
                        </button>
                      )}

                      {/* Close Button "X" */}
                      <button
                        onClick={() => setShowSettingsDropdown(false)}
                        className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition-colors opacity-100 shadow-md"
                        title="Close Settings"
                        aria-label="Close Settings"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Content Switcher */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[450px]">
                      {settingsView === 'main' && (
                        <div className="py-2 flex flex-col">
                          {[
                            { id: 'size', name: 'Larger Menu Icons', icon: 'M4 8V6a2 2 0 012-2h4M4 16v2a2 2 0 002 2h4M20 8V6a2 2 0 00-2-2h-4M20 16v2a2 2 0 01-2 2h-4' },
                            { id: 'profiles', name: 'Pick a Profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (audioPingEnabled) playAudioPing('menu');
                                setSettingsView(item.id as any);
                              }}
                              className="px-6 py-5 flex items-center gap-4 transition-all hover:bg-black/10 active:bg-black/20 group border-b"
                              style={{ borderColor: 'rgba(255, 255, 255, 0.8)', color: currentTheme.text }}
                            >
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner" style={{ backgroundColor: `${currentTheme.border}0D` }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                              </div>
                              <span className="font-extrabold text-[16px] flex-1">{item.name}</span>
                              <svg className="w-5 h-5 opacity-100 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      )}

                      {settingsView === 'size' && (
                        <div className="p-5 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-2 h-6 rounded-full" style={{ backgroundColor: currentTheme.active }} />
                            <span className="font-bold text-[17px]" style={{ color: currentTheme.text }}>Larger Menu Icons</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'standard', name: 'Standard', multiplier: 1, icon: 12 },
                              { id: 'medium', name: 'Medium', multiplier: 1.08, icon: 16 },
                              { id: 'large', name: 'Large', multiplier: 1.12, icon: 20 },
                              { id: 'xl', name: 'Extra Large', multiplier: 1.18, icon: 24 }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  if (audioPingEnabled) playAudioPing('menu');
                                  setSidebarIconSize(opt.multiplier);
                                }}
                                className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-[22px] transition-all duration-300 border-2 ${sidebarIconSize === opt.multiplier ? 'scale-[1.05] shadow-xl' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                                style={{
                                  backgroundColor: sidebarIconSize === opt.multiplier ? `${currentTheme.active}33` : 'transparent',
                                  borderColor: sidebarIconSize === opt.multiplier ? currentTheme.active : 'rgba(255, 255, 255, 0.4)',
                                  color: currentTheme.text
                                }}
                              >
                                <div
                                  className="flex items-center justify-center rounded-lg mb-1"
                                  style={{
                                    width: '36px',
                                    height: '28px',
                                    background: sidebarIconSize === opt.multiplier ? currentTheme.active : `${currentTheme.text}11`,
                                    border: `1.5px solid ${sidebarIconSize === opt.multiplier ? 'transparent' : currentTheme.text + '22'}`
                                  }}
                                >
                                  <div
                                    className="rounded-[2px]"
                                    style={{
                                      width: `${opt.icon - 4}px`,
                                      height: `${opt.icon - 4}px`,
                                      backgroundColor: sidebarIconSize === opt.multiplier ? '#000000' : currentTheme.text,
                                      opacity: sidebarIconSize === opt.multiplier ? 1 : 0.8
                                    }}
                                  />
                                </div>
                                <span className="font-extrabold text-[12px] uppercase tracking-wider">{opt.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsView === 'profiles' && (
                        <div className="p-5 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2 h-6 rounded-full" style={{ backgroundColor: currentTheme.active }} />
                              <span className="font-extrabold text-[18px]" style={{ color: currentTheme.text }}>Pick a Profile</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest opacity-30" style={{ color: currentTheme.text }}>Quick Setup</span>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { id: 'lowvision', name: 'Low Vision', desc: 'Larger text, ruler, high contrast', icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
                              { id: 'colorblind', name: 'Colour Blind', desc: 'Colour filters, high contrast', icon: 'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-14.414V18.414A6.002 6.002 0 0 0 12 20a6 6 0 0 0 0-12 6.002 6.002 0 0 0-1 2.414z' },
                              { id: 'blindness', name: 'Blind', desc: 'Text-to-speech, screen reader', icon: 'M12 3a4 4 0 0 1 4 4c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4zm-2 15v4H8v-4c0-.55-.45-1-1-1s-1 .45-1 1v4H4v-4c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5v4h-2v-4c0-.55-.45-1-1-1s-1 .45-1 1v4h-2v-4H10z' },
                              { id: 'photosensitive', name: 'Photosensitive', desc: 'Dark / Grey mode, few animations', icon: 'M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z' },
                              { id: 'motor', name: 'Motor Impaired', desc: 'Large buttons, keyboard nav', icon: 'M21 11H3c-.55 0-1 .45-1 1v8c0 1.65 1.35 3 3 3h14c1.65 0 3-1.35 3-3v-8c0-.55-.45-1-1-1zm-9 9h-2v-2h2v2zm2-4h-2v-2h2v2zm-4 4H8v-2h2v2zm0-4H8v-2h2v2zm4 0h2v2h-2v-2zm-6 4H6v-2h2v2zm0-4H6v-2h2v2zm9 4h-2v-2h2v2zm0-4h-2v-2h2v2zM12 2C8.13 2 5 5.13 5 9h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7z' },
                              { id: 'dyslexia', name: 'Dyslexia Friendly', desc: 'Special font, spacing adjustments', icon: 'M9.6 3H7.8C4.5 3 2 5.5 2 8.6v.6c0 1.2.3 2.5 1 3.5.8 1.1 1.9 1.9 3.2 2.3-.9 1.4-2 3.3-3.6 5.5l1.6 1.2c2-2.7 3.3-5 4.3-6.9.3.2.7.4 1.1.4 1.7 0 3-1.3 3-3V5.4C12.6 4.1 11.2 3 9.6 3zm1.2 5.6c0 .8-.8 1.4-1.8 1.4-.9 0-1.8-.7-1.8-1.5V6c0-.9.8-1.5 1.8-1.5s1.8.6 1.8 1.5v2.6zM20.2 3h-1.8c-3.3 0-5.8 2.5-5.8 5.6v.6c0 1.2.3 2.5 1 3.5.8 1.1 1.9 1.9 3.2 2.3-.9 1.4-2 3.3-3.6 5.5l1.6 1.2c2-2.7 3.3-5 4.3-6.9.3.2.7.4 1.1.4 1.7 0 3-1.3 3-3V5.4c0-1.3-1.4-2.4-3-2.4zm1.2 5.6c0 .8-.8 1.4-1.8 1.4-.9 0-1.8-.7-1.8-1.5V6c0-.9.8-1.5 1.8-1.5s1.8.6 1.8 1.5v2.6z' },
                              { id: 'adhd', name: 'ADHD', desc: 'Focus tools, reading mask', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
                              { id: 'cognitive', name: 'Cognitive Disability', desc: 'Simplified layout, reading mask, dictionary', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z' },
                              { id: 'seizure', name: 'Seizure & Epileptic', desc: 'Stop animations, reduce motion', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                              { id: 'elderly', name: 'Elderly / Senior', desc: 'Extra-large text, simple UI', icon: 'M21 14h-5.26c.92-1.33 1.69-3.14 1.94-5H21c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1h-3.38A5.95 5.95 0 0 0 13 2c-3.31 0-6 2.69-6 6 0 2.97 2.16 5.43 5 5.91V14H6c-2.21 0-4 1.79-4 4v2h2v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2h2v-2c0-2.21-1.79-4-4-4zm-8-3c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' },
                              { id: 'hearing', name: 'Hearing Impaired', desc: 'Visual indicators, Captions', icon: 'M19 3h-8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6.5 13.5c-2.48 0-4.5-2.02-4.5-4.5S10.02 7.5 12.5 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zM3.5 10v4c1.1 0 2-.9 2-2s-.9-2-2-2zM7 6v12c2.21 0 4-1.79 4-4s-1.79-4-4-4z' },
                              { id: 'reading', name: 'Reading Support', desc: 'Reading Aids, Spacing, Guides', icon: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 14v-2h12v2H6zm0-4v-2h12v2H6z' },
                              { id: 'custom', name: 'My Profile', desc: 'Build your own custom experience', icon: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z' }
                            ].map((profile) => (
                              <button
                                type="button"
                                key={profile.id}
                                onClick={() => {
                                  if (audioPingEnabled) playAudioPing('menu');
                                  applyProfile(profile.id);
                                }}
                                className={`w-full p-4 rounded-[24px] flex items-center gap-4 border-2 transition-all hover:bg-white/5 active:scale-[0.98] group text-left ${activeProfile === profile.id ? 'scale-[1.02] shadow-lg' : ''}`}
                                style={{
                                  borderColor: activeProfile === profile.id ? currentTheme.active : 'rgba(255, 255, 255, 0.4)',
                                  backgroundColor: activeProfile === profile.id ? `${currentTheme.active}22` : 'transparent',
                                  color: currentTheme.text
                                }}
                              >
                                <div
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner"
                                  style={{
                                    backgroundColor: activeProfile === profile.id ? currentTheme.active : `${currentTheme.border}0D`,
                                    color: activeProfile === profile.id ? '#FFFFFF' : 'inherit'
                                  }}
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={profile.icon} />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-black text-[17px] leading-tight mb-0.5">{profile.name}</div>
                                  <div className="text-[14px] font-medium opacity-80">{profile.desc}</div>
                                </div>
                                <div
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-opacity ${activeProfile === profile.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                  style={{
                                    borderColor: currentTheme.active,
                                    backgroundColor: activeProfile === profile.id ? currentTheme.active : 'transparent'
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={activeProfile === profile.id ? '#FFFFFF' : currentTheme.active} strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                  </svg>
                                </div>
                              </button>
                            ))}
                          </div>


                        </div>
                      )}
                    </div>

                    {/* Footer - Only on main view */}
                    {settingsView === 'main' && (
                      <div
                        className="px-6 py-5 mt-2 transition-all hover:bg-black/20 cursor-pointer flex justify-center border-t border-dashed"
                        style={{ background: `${currentTheme.active}11`, borderColor: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => setShowSettingsDropdown(false)}
                      >
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: '#FFFFFF' }}>
                          Close Settings
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={`flex h-full w-full ${isVertical
              ? (panelPosition === 'right' ? 'flex-row-reverse' : 'flex-row')
              : 'flex-row'
              }`}>
              <div
                className={`flex items-center p-1.5 ${isVertical
                  ? `flex-col w-[90px] sm:w-[120px] gap-3 sm:gap-4 h-full overflow-y-auto custom-scrollbar`
                  : `${sidebarIconSize >= 1.3 ? 'flex-wrap overflow-y-auto content-start py-2' : 'flex-row items-center overflow-x-auto'} h-full w-full justify-start custom-scrollbar gap-2 ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
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
                {/* Logo removed as per user request */}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Prevent immediate close if just opened (race condition)
                    if (Date.now() - lastOpenTimeRef.current < 300) return;
                    if (audioPingEnabled) playAudioPing('menu'); // Using menu sound
                    setIsOpen(false);
                    setSelectedCategory(null);

                    // Interaction counting for Feedback Popup
                    const countKey = 'accessibility_bar_close_count';
                    const feedbackGivenKey = 'accessibility_feedback_given';

                    // Forcing popup to show "abi kelye" (for now) as requested, ignoring previous state
                    // if (!localStorage.getItem(feedbackGivenKey)) {
                    const usage = JSON.parse(safeStorage.getItem('accessibility-usage') || '{}');
                    const currentCount = parseInt(safeStorage.getItem(countKey) || '0');
                    const newCount = currentCount + 1;
                    safeStorage.setItem(countKey, newCount.toString());

                    // Show popup on close if feedback not given (matches "whenever cross is clicked")
                    setShowFeedbackPopup(true);
                    // }
                  }}
                  className={`p-2 rounded-xl transition-all duration-300 pointer-events-auto hover:brightness-110 active:scale-95 sticky top-0 left-0 right-0 z-[100]`}
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
                      if (audioPingEnabled) playAudioPing('menu');
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
                    aria-label={isPanelPinned ? "Unpin Toolbar" : "Pin Toolbar"}
                  >
                    <Image
                      src={pinIcon}
                      alt="Pin Toolbar"
                      width={20}
                      height={20}
                      className={`transition-transform duration-300 ${isPanelPinned ? 'scale-110' : ''}`}
                      style={{ opacity: isPanelPinned ? 1 : 0.6 }}
                    />
                  </button>

                  {/* Red 'X' Dismiss Button */}
                  {isPanelPinned && (
                    <button
                      onClick={() => {
                        togglePanelPin();
                        setIsOpen(false);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-50"
                      title="Close Toolbar"
                      aria-label="Close Toolbar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-white"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>



                <div className={`accessibility-bar pointer-events-auto flex ${isVertical ? 'flex-col space-y-3 sm:space-y-4 items-center flex-shrink-0' : 'flex-row items-center flex-grow gap-2'}`}>


                  {(() => {
                    // Exclude constant categories from paginated list
                    const constantCategoryIds = ['reset', 'az', 'move_ui_extra']; // reset and az are handled separately
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
                          const azCategory = categories.find(c => c.id === 'az');

                          return (
                            <>
                              {/* A-Z Button - Rendered FIRST */}
                              {azCategory && (
                                <div key="az-constant" className="relative group/category">
                                  <button
                                    data-category-btn
                                    onClick={() => {
                                      if (audioPingEnabled) playAudioPing('menu');
                                      setSelectedCategory('az');
                                      setIsOpen(true);
                                    }}
                                    onKeyDown={(e) => handleCategoryKeyDown(e, 0)}
                                    className={`group relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden hover:scale-105`}
                                    style={{
                                      background: barTheme === 'white'
                                        ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))',
                                      backdropFilter: 'blur(10px) saturate(180%)',
                                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                                      width: (isVertical ? 55 : 58) * sidebarIconSize + 'px',
                                      height: (isVertical ? 55 : 58) * sidebarIconSize + 'px',
                                      boxShadow: 'none'
                                    }}
                                    aria-label={azCategory.name}
                                    title={azCategory.name}
                                  >
                                    <div
                                      className={`flex flex-col items-center justify-center font-black leading-none transition-all duration-300 ${isVertical ? '' : 'translate-y-[2px]'}`}
                                      style={{
                                        width: 32 * sidebarIconSize,
                                        height: 32 * sidebarIconSize,
                                        color: currentTheme.text,
                                      }}
                                    >
                                      <span style={{ fontSize: `${(isVertical ? 16 : 18) * sidebarIconSize}px` }}>A-Z</span>
                                      <span style={{ fontSize: `${(isVertical ? 10 : 12) * sidebarIconSize}px`, marginTop: isVertical ? '-2px' : '4px' }}>List</span>
                                    </div>
                                  </button>
                                </div>
                              )}

                              {resetCategory && (
                                <div key="reset-constant" className="relative group/category">
                                  <button
                                    type="button"
                                    data-category-btn
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (audioPingEnabled) playAudioPing('menu');
                                      setShowResetConfirm(true);
                                    }}
                                    onKeyDown={(e) => handleCategoryKeyDown(e, 0)}
                                    onMouseEnter={() => textToSpeech && speak(resetCategory.name)}
                                    className={`group relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden hover:scale-105`}
                                    style={{
                                      background: resetIconStyle === 'red-black'
                                        ? 'linear-gradient(135deg, #FF0000, #CC0000)'
                                        : resetIconStyle === 'yellow-black'
                                          ? '#FFD700'
                                          : resetIconStyle === 'white-black'
                                            ? '#FFFFFF'
                                            : '#000000',
                                      backdropFilter: 'blur(5px) saturate(180%)',
                                      WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.1)' : '4px solid rgba(255,255,255,0.2)',
                                      width: (isVertical ? 78 : 58) * sidebarIconSize + 'px',
                                      height: (isVertical ? 80 : 58) * sidebarIconSize + 'px',
                                      boxShadow: 'none'
                                    }}
                                    aria-label={resetCategory.name}
                                    title={resetCategory.name}
                                  >
                                    <Image
                                      src={resetCategory.icon || ''}
                                      alt=""
                                      width={(isVertical ? 50 : 44) * sidebarIconSize}
                                      height={(isVertical ? 50 : 44) * sidebarIconSize}
                                      style={{
                                        filter: resetIconStyle === 'black-white' ? 'brightness(0) invert(1)' : 'brightness(0)',
                                      }}
                                      className={`transition-all duration-300 ${isVertical ? '' : 'translate-y-[2px]'}`}
                                    />
                                  </button>
                                </div>
                              )}
                            </>
                          );
                        })()}

                        {visibleCategories.map((category, index) => (
                          <div key={category.id} className="relative group/category">
                            <button
                              type="button"
                              data-category-btn
                              onKeyDown={(e) => handleCategoryKeyDown(e, shouldPaginate ? index + 1 : index)}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (audioPingEnabled) playAudioPing('menu');
                                if (category.id === 'reset') {
                                  setShowResetConfirm(true);
                                  return;
                                }
                                if (category.id === 'move_ui') {
                                  if (!hasSeenSidebarTutorial) {
                                    setTutorialIcon(category.icon);
                                    setShowSidebarTutorial(true);
                                    setHasSeenSidebarTutorial(true);
                                    safeStorage.setItem('accessibility-seen-sidebar-tutorial', 'true');
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
                              className={`group relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden ${selectedCategory === category.id
                                ? 'text-black scale-105'
                                : 'hover:scale-105'
                                }`}
                              style={{
                                ...(category.id === 'reset'
                                  ? {
                                    background: resetIconStyle === 'red-black'
                                      ? 'linear-gradient(135deg, #FF0000, #CC0000)'
                                      : resetIconStyle === 'yellow-black'
                                        ? '#FFD700'
                                        : resetIconStyle === 'white-black'
                                          ? '#FFFFFF'
                                          : '#000000',
                                    backdropFilter: 'blur(5px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.1)' : '4px solid rgba(255,255,255,0.2)',
                                    boxShadow: 'none',
                                    width: (isVertical ? 78 : 58) * sidebarIconSize + 'px',
                                    height: (isVertical ? 80 : 58) * sidebarIconSize + 'px'
                                  }
                                  : category.id === 'az' && selectedCategory !== category.id // Apply pin-like style to AZ when not selected
                                    ? {
                                      background: barTheme === 'white'
                                        ? 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))',
                                      backdropFilter: 'blur(10px) saturate(180%)',
                                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                                      boxShadow: 'none',
                                      width: (isVertical ? 55 : 58) * sidebarIconSize + 'px',
                                      height: (isVertical ? 55 : 58) * sidebarIconSize + 'px'
                                    }
                                    : selectedCategory === category.id
                                      ? {
                                        background: `linear-gradient(135deg, ${barTheme === 'yellow' ? '#87CEEB' : '#FFD700'}, ${barTheme === 'yellow' ? '#6BB6D6' : '#E6C200'})`,
                                        backdropFilter: 'blur(5px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                        border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.4)' : '4px solid rgba(255,255,255,0.4)',
                                        boxShadow: 'none',
                                        width: (isVertical ? 78 : 58) * sidebarIconSize + 'px',
                                        height: (isVertical ? 80 : 58) * sidebarIconSize + 'px'
                                      }
                                      : {
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                                        backdropFilter: 'blur(5px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                        border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                                        boxShadow: 'none',
                                        width: (isVertical ? 78 : 58) * sidebarIconSize + 'px',
                                        height: (isVertical ? 80 : 58) * sidebarIconSize + 'px'
                                      }
                                )
                              }}
                              aria-label={category.name}
                              title={category.name}
                            >
                              {category.id === 'az' ? (
                                <div
                                  className={`flex flex-col items-center justify-center font-black leading-none transition-all duration-300 ${!isVertical ? 'translate-y-[-3px]' : ''} ${isVertical ? 'mb-0.5' : ''} ${selectedCategory === category.id
                                    ? ''
                                    : 'opacity-70 group-hover:opacity-100'
                                    }`}
                                  style={{
                                    width: 32 * sidebarIconSize,
                                    height: 32 * sidebarIconSize,
                                    color: selectedCategory === category.id ? '#000000' : currentTheme.text,
                                  }}
                                >
                                  <span style={{ fontSize: `${(isVertical ? 14 : 12) * sidebarIconSize}px` }}>A-Z</span>
                                  <span style={{ fontSize: `${(isVertical ? 9 : 7) * sidebarIconSize}px`, marginTop: '0px' }}>List</span>
                                </div>
                              ) : (
                                <Image
                                  src={
                                    category.id === 'move_ui'
                                      ? (panelPosition === 'left' ? sidebarShowIcon : panelPosition === 'right' ? sidebarHideIcon : category.icon as any)
                                      : category.icon || ''
                                  }
                                  alt=""
                                  width={(isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))) * sidebarIconSize}
                                  height={(isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))) * sidebarIconSize}
                                  style={{
                                    filter: category.id === 'reset'
                                      ? (resetIconStyle === 'black-white' ? 'brightness(0) invert(1)' : 'brightness(0)')
                                      : (category.id === 'info' ? 'none' : 'brightness(0)'),
                                    ...(category.id === 'reset' ? {} : {})
                                  }}
                                  className={`transition-all duration-300 ${!isVertical ? 'translate-y-[-3px]' : ''} ${isVertical ? 'mb-0.5' : ''} ${selectedCategory === category.id
                                    ? ''
                                    : 'opacity-70 group-hover:opacity-100'
                                    }`}
                                />
                              )}
                              {isVertical && category.id !== 'reset' && (
                                <span
                                  className={`text-[9px] font-bold leading-tight text-center px-0.5 whitespace-pre-line uppercase opacity-100 ${category.id === 'images' ? 'translate-y-[-2px]' : 'translate-y-0'}`}
                                  style={{ color: '#000000', letterSpacing: '0.02em' }}
                                >
                                  {category.name}
                                </span>
                              )}


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
                                    ? `${panelPosition === 'right' ? '-left-1' : '-right-1'} top-1/2 -translate-y-1/2 w-1.5 h-1.5`
                                    : `${panelPosition === 'bottom' ? '-top-1' : '-bottom-1'} left-1/2 -translate-x-1/2 h-1.5 w-1.5`
                                    } rounded-full border border-white/50 ${category.indicatorClass}`}
                                />
                              )}
                            </button>
                          </div>
                        ))}
                        {/* Pagination Control - for vertical sidebar */}
                        {shouldPaginate && totalPages > 1 && (
                          <div className="flex flex-col items-center py-0.5 space-y-1.5 mt-0">
                            {/* Directional Arrow */}
                            <div className="flex flex-col items-center">
                              {currentPage < 4 && (
                                <span className="text-[15px] font-black uppercase text-white mb-0.5 opacity-90">
                                  Next
                                </span>
                              )}
                              {currentPage === 4 && (
                                <span className="text-[15px] font-black uppercase text-white mb-0.5 opacity-90">
                                  Previous
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (audioPingEnabled) playAudioPing('menu');
                                  if (currentPage < 4) {
                                    setCurrentPage(p => p + 1);
                                  } else {
                                    setCurrentPage(1);
                                  }
                                }}
                                className="flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                aria-label={currentPage < 4 ? "Next Page" : "Previous Page"}
                              >
                                <Image
                                  src={paginationArrowIcon}
                                  alt=""
                                  width={45}
                                  height={12}
                                  className="transition-transform duration-300"
                                  style={{
                                    transform: currentPage < 4 ? 'rotate(0deg)' : 'rotate(180deg)',
                                    filter: 'brightness(0) invert(1)' // Make it white
                                  }}
                                />
                              </button>
                            </div>

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


                </div >

                {/* Reset button area */}
                < div className={`flex ${isVertical ? 'mt-auto flex-col space-y-2 sm:space-y-3' : 'ml-auto flex-row space-x-5'} items-center flex-shrink-0`
                }>
                </div>
              </div>



              {selectedCategory && selectedCategory !== 'info' && (
                <div
                  className={`accessibility-bar pointer-events-auto flex flex-col min-w-0 ${isVertical
                    ? 'relative flex-1 h-full'
                    : `fixed z-[2147483647] ${panelPosition === 'bottom' ? (isMobile ? 'bottom-[90px]' : 'bottom-[94px]') : (isMobile ? 'top-[90px]' : 'top-[94px]')} ${isMobile ? 'w-[calc(100vw-20px)] left-[10px]' : 'w-[350px]'} shadow-2xl rounded-none overflow-hidden animate-fade-in`
                    }`}
                  style={!isVertical ? {
                    left: isMobile ? '10px' : `${Math.max(10, Math.min(window.innerWidth - 360, selectedOffset - 175))}px`,
                    background: `linear-gradient(135deg, ${currentTheme.background}F2, ${currentTheme.background}E6)`, // Increased opacity slightly since blur is gone
                    borderTop: `4px solid ${currentTheme.border}4D`,
                    borderBottom: `4px solid ${currentTheme.border}4D`,
                    borderLeft: `4px solid ${currentTheme.border}4D`,
                    borderRight: `4px solid ${currentTheme.border}4D`,
                    maxHeight: isMobile ? '70vh' : '80vh',
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
                            <div className="flex flex-col items-center justify-center font-black leading-none -translate-y-0.5" style={{ color: '#000000' }}>
                              <span style={{ fontSize: '18px' }}>A-Z</span>
                              <span style={{ fontSize: '10px', marginTop: '-2px' }}>List</span>
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
                          <h2
                            className={`text-[16px] sm:text-[20px] font-extrabold uppercase tracking-tight leading-[1.1] mt-2 sm:mt-[12px] max-w-[180px] sm:max-w-[240px] ${['font', 'layout', 'reading', 'ai'].includes(selectedCategory || '')
                              ? 'whitespace-nowrap'
                              : 'whitespace-normal line-clamp-2'
                              }`}
                            style={{ color: currentTheme.text }}
                          >
                            {categories.find((c) => c.id === selectedCategory)?.name?.replace(/\n/g, ' ')}
                          </h2>
                        </div>
                      </div>
                      <div className="flex items-center absolute top-0 right-0">

                        <button
                          onClick={() => {
                            if (audioPingEnabled) playAudioPing('menu');
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
                          <span className="text-sm font-semibold tracking-wide">Close</span>
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
                  {/* Indicator Arrow */}
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
          </div >
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
      {
        showResetConfirm && (
          <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowResetConfirm(false);
                setTimeout(() => setShowActiveFeaturesList(false), 300);
              }}
            />
            <div
              className="relative w-full max-w-2xl rounded-[40px] overflow-hidden border-4 animate-in zoom-in-95 duration-300"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.background}ee, ${currentTheme.background}dd)`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderColor: `${currentTheme.border}`,
                color: currentTheme.text,
                boxShadow: 'none'
              }}
            >
              <div className="p-4 sm:p-8 pb-4 text-center">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group"
                  style={{
                    background: resetIconStyle === 'red-black' ? '#FF0000' :
                      resetIconStyle === 'yellow-black' ? '#FFD700' :
                        resetIconStyle === 'white-black' ? '#FFFFFF' :
                          resetIconStyle === 'black-white' ? '#000000' :
                            currentTheme.background,
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    color: (resetIconStyle === 'white-black' || resetIconStyle === 'yellow-black') ? '#000000' : '#FFFFFF',
                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.3)' : '4px solid rgba(255,255,255,0.3)',
                    boxShadow: 'none'
                  }}
                >
                  <Image
                    src={resetIcon}
                    alt=""
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                    className={`transition-transform ${(resetIconStyle === 'white-black' || resetIconStyle === 'yellow-black') ? 'brightness(0)' : 'brightness(0) invert'}`}
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-relaxed mb-4 text-center">
                  {showActiveFeaturesList
                    ? (t.common?.resetSelectInstructions || "Please select/delete which features you want to reset:")
                    : (t.common?.resetConfirmTitle || "Do you want to reset all features or only some selected features?")
                  }
                </h2>
              </div>

              {!showActiveFeaturesList ? (
                <div className="p-4 sm:p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      if (audioPingEnabled) playAudioPing('menu');
                      resetAll();
                      setShowResetConfirm(false);
                    }}
                    className="group relative overflow-hidden px-6 py-4 rounded-2xl text-black font-black tracking-widest transition-all border-4"
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
                      if (audioPingEnabled) playAudioPing('menu'); // Using menu sound for bulk action
                      handleResetSelected();
                    }}
                    className="group relative overflow-hidden px-6 py-4 rounded-2xl text-black font-black tracking-widest transition-all border-4"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #E6C200)',
                      backdropFilter: 'blur(10px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                      borderColor: 'rgba(0,0,0,0.2)',
                      boxShadow: 'none'
                    }}
                  >
                    <span className="relative z-10">{t.common?.resetSelectedBtn || "Reset Selected"}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-8 pt-0 flex flex-col gap-3 sm:gap-4 items-center">
                  <div className="flex flex-wrap gap-2 justify-center mb-0 max-h-[120px] sm:max-h-[150px] overflow-y-auto px-2 sm:px-4 w-full custom-scrollbar">
                    {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'move_ui'].map((catId) => {
                      const features = getActiveFeaturesWithActions(catId);
                      if (features.length === 0) return null;
                      return (
                        <div key={catId} className="contents">
                          {features.map((feature, idx) => (
                            <div
                              key={`${catId}-${idx}`}
                              className="px-3 py-1.5 rounded-full shadow-sm border font-bold text-[14px] whitespace-nowrap flex items-center gap-2 animate-in zoom-in-50 duration-200"
                              style={{
                                backgroundColor: currentTheme.background,
                                color: currentTheme.text,
                                borderColor: currentTheme.border
                              }}
                            >
                              <span>{feature.label.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); })}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (audioPingEnabled) playAudioPing('menu');
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
                    {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'move_ui'].every(catId => getActiveFeaturesWithActions(catId).length === 0) && (
                      <span className="text-sm opacity-60">No active features to reset.</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (audioPingEnabled) playAudioPing('menu');
                      setShowResetConfirm(false);
                      setTimeout(() => setShowActiveFeaturesList(false), 300);
                    }}
                    className="mt-6 px-12 py-3.5 rounded-2xl text-[18px] font-black uppercase tracking-widest transition-all border-2"
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
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )
      }

      {/* Info Page Overlay */}
      {
        isOpen && selectedCategory === 'info' && (
          <InfoPage onClose={() => setSelectedCategory(null)} categories={categories} />
        )
      }

      {/* Sidebar Tutorial Popup */}
      {
        showSidebarTutorial && (
          <SidebarTutorial
            onClose={() => setShowSidebarTutorial(false)}
            icon={tutorialIcon || moveUiIcon}
          />
        )
      }

      {/* Feedback Popup */}
      {
        showFeedbackPopup && (
          <FeedbackPopup
            onClose={() => {
              setShowFeedbackPopup(false);

            }}
            onSubmit={() => {
              safeStorage.setItem('accessibility_feedback_given', 'true');
              setShowFeedbackPopup(false);
            }}
          />
        )
      }

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
