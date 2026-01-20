'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';




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
import accessibilityIcon from '@/assets/icons/first icon og accessibilty.png?inline';
import scalabilityIcon from '@/assets/icons/scalability.png?inline';
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
import ToggleCheckbox from './ToggleCheckbox';
import InfoPopupButton from './InfoPopupButton';
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
  const [hasSeenSidebarTutorialThisSession, setHasSeenSidebarTutorialThisSession] = useState(false);
  const [tutorialIcon, setTutorialIcon] = useState<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const iconsContainerRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef<boolean>(false);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showActiveFeaturesList, setShowActiveFeaturesList] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const settingsModalRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'size' | 'profiles'>('main');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const lastOpenTimeRef = useRef<number>(0);
  const [showFirstTimeTtsPopup, setShowFirstTimeTtsPopup] = useState(false);
  const [hasShownTtsPopupThisSession, setHasShownTtsPopupThisSession] = useState(false);
  const [positionPage, setPositionPage] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const categoryContentRef = useRef<HTMLDivElement>(null);
  const settingsContentRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const handleScrollShowHint = useCallback((e: any) => {
    const el = e.target;
    if (!el) return;
    const isScrollable = el.scrollHeight > el.clientHeight;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    setShowScrollHint(isScrollable && !atBottom);
  }, []);

  useEffect(() => {
    const catEl = categoryContentRef.current;
    const setEl = settingsContentRef.current;

    const checkInitial = (el: HTMLElement | null) => {
      if (el) {
        const isScrollable = el.scrollHeight > el.clientHeight;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
        setShowScrollHint(isScrollable && !atBottom);
      }
    };

    if (selectedCategory) {
      setTimeout(() => checkInitial(categoryContentRef.current), 100);
      const el = categoryContentRef.current;
      el?.addEventListener('scroll', handleScrollShowHint);
      return () => el?.removeEventListener('scroll', handleScrollShowHint);
    } else if (showSettingsDropdown) {
      setTimeout(() => checkInitial(settingsContentRef.current), 100);
      const el = settingsContentRef.current;
      el?.addEventListener('scroll', handleScrollShowHint);
      return () => el?.removeEventListener('scroll', handleScrollShowHint);
    } else {
      setShowScrollHint(false);
    }
  }, [selectedCategory, showSettingsDropdown, handleScrollShowHint]);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    resetIconStyle,
    setResetIconStyle,
    barTheme,
    setBarTheme,
    buttonPosition,
    setButtonPosition,
    panelPosition,
    setPanelPosition,
    readingProgressBar,
    readingProgressBarColor,
    toggleReadingProgressBar,
    toggleAudioPing,
    toggleShowActiveIndicators,
    ttsVoiceGender,
    ttsReadWholePage,
    stopTts
  } = context;

  const isVertical = panelPosition === 'left' || panelPosition === 'right';

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
        setStopVideos?.(true);
        break;
      case 'adhd':
        setReadingMask?.(true);
        setReadingRuler?.(true);
        setHighlightLinks?.(true);
        setHighlightHeadings?.(true);
        setReadingSpotlight?.(true);
        break;
      case 'photosensitive':
        toggleDarkMode?.();
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

  const currentTheme = BAR_THEMES[barTheme as BarTheme] || BAR_THEMES['purple'];
  const modalBorderColor = ['purple', 'oceanBlue', 'navy', 'black', 'grayscale', 'pink'].includes(barTheme)
    ? 'rgba(255, 255, 255, 0.6)'
    : 'rgba(0, 0, 0, 0.6)';

  const t = translations[language] || translations['en'];

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    setMounted(true);
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    const isTopPosition = buttonPosition === 'top' || buttonPosition === 'top-left' || buttonPosition === 'top-right';
    const isPanelTop = panelPosition === 'top';

    if ((isOpen && isTopPosition) || (isOpen && isPanelTop)) {

      const baseHeight = isMobile ? 80 : 90;
      const calculatedHeight = baseHeight * (isPanelTop ? sidebarIconSize : 1);
      const paddingTop = `${calculatedHeight}px`;

      document.body.style.paddingTop = paddingTop;
      document.body.style.transition = 'padding-top 0.3s ease';
    } else {
      document.body.style.paddingTop = '';
    }

    return () => {
      document.body.style.paddingTop = '';
    };
  }, [isOpen, buttonPosition, panelPosition, isMobile, sidebarIconSize]);


  useEffect(() => {
    if (onPageDictionary || pageSummary || pageStructure) {
      setIsOpen(false);
      setSelectedCategory(null);
    }
  }, [onPageDictionary, pageSummary, pageStructure]);


  const checkScrollState = () => {
    if (!iconsContainerRef.current) return;
    const container = iconsContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };


  useEffect(() => {
    const isTopPosition = panelPosition === 'top';
    const isHorizontal = panelPosition !== 'left' && panelPosition !== 'right';

    if (isOpen && isHorizontal && isTopPosition) {

      setTimeout(() => {
        checkScrollState();
      }, 100);

      const container = iconsContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollState);
        window.addEventListener('resize', checkScrollState);


        const observer = new MutationObserver(() => {
          setTimeout(() => checkScrollState(), 50);
        });
        observer.observe(container, { childList: true, subtree: true });

        return () => {
          container.removeEventListener('scroll', checkScrollState);
          window.removeEventListener('resize', checkScrollState);
          observer.disconnect();
        };
      }
    }
  }, [isOpen, panelPosition, sidebarIconSize]);

  useEffect(() => {
    const calculateItems = () => {
      if (isVertical) {
        setItemsPerPage(5);
      } else {

        if (sidebarIconSize === 1.3) {
          setItemsPerPage(15);
        } else if (sidebarIconSize === 1.5) {
          setItemsPerPage(14);
        } else {

          const zoomFactor = pageZoom ? pageZoom / 100 : 1;
          const iconWidth = 58 * sidebarIconSize;
          const gap = 8;

          const containerWidth = window.innerWidth / zoomFactor;
          const closeBtnWidth = isMobile ? 60 : 63;
          const azWidth = 58 * sidebarIconSize;
          const resetWidth = 58 * sidebarIconSize;
          const reserved = closeBtnWidth + azWidth + resetWidth + (isMobile ? 40 : 80);
          const available = containerWidth - reserved;
          const count = Math.floor(available / (iconWidth + gap));
          setItemsPerPage(Math.max(1, count));
        }
      }
    };
    calculateItems();
    window.addEventListener('resize', calculateItems);
    return () => window.removeEventListener('resize', calculateItems);
  }, [isVertical, sidebarIconSize, isMobile, panelPosition, pageZoom]);

  useEffect(() => {
    setCurrentPage(1);
  }, [isVertical, sidebarIconSize, panelPosition]);


  const handleResetSelected = () => {
    setShowActiveFeaturesList(true);
  };


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
    if (selectedCategory && !isVertical && isOpen) {
      const updateOffset = () => {

        let selectedButton: HTMLElement | null = null;


        if (iconsContainerRef.current) {
          selectedButton = iconsContainerRef.current.querySelector(
            `[data-category-btn][data-category-id="${selectedCategory}"]`
          ) as HTMLElement;
        }

        if (!selectedButton) {
          selectedButton = document.querySelector(
            `.a11y-embed-host [data-category-btn][data-category-id="${selectedCategory}"]`
          ) as HTMLElement;
        }

        if (!selectedButton) {
          selectedButton = document.querySelector(
            `[data-category-btn][data-category-id="${selectedCategory}"]`
          ) as HTMLElement;
        }

        if (selectedButton) {

          const scrollContainer = selectedButton.closest('.overflow-x-auto, .custom-scrollbar');
          if (scrollContainer) {
            selectedButton.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
          }

          requestAnimationFrame(() => {
            const rect = selectedButton.getBoundingClientRect();

            if (rect.width > 0 && rect.height > 0) {
              const offset = rect.left + rect.width / 2;
              setSelectedOffset(offset);
            }
          });
          return true;
        }
        return false;
      };


      const timeouts: NodeJS.Timeout[] = [];

      const rafId = requestAnimationFrame(() => {
        if (updateOffset()) return;

        [50, 150, 350, 500].forEach(delay => {
          timeouts.push(setTimeout(() => updateOffset(), delay));
        });
      });

      return () => {
        cancelAnimationFrame(rafId);
        timeouts.forEach(clearTimeout);
      };
    }
  }, [panelPosition, selectedCategory, isVertical, isOpen, windowWidth]);

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (!isOpen || isPanelPinned) return;


      if (showSettingsDropdown) return;

      const target = event.target as Node;
      const path = event.composedPath();

      const isOutsidePanel =
        (panelRef.current && !path.includes(panelRef.current)) &&
        !path.some(el => (el as Element)?.classList?.contains?.('accessibility-bar'));

      const isOutsideTrigger = !triggerRef.current || !triggerRef.current.contains(target);

      const isEmbedHost = path.some(el =>
        (el as Element)?.id === 'a11y-embed-host-react' ||
        (el as Element)?.classList?.contains?.('a11y-embed-host')
      );

      if (isEmbedHost) return;

      if (isOutsidePanel && isOutsideTrigger) {

        if (selectedCategory) {
          if (selectedCategory === 'info') return;

          setSelectedCategory(null);
        }

      }
    };

    if (isOpen) {
      lastOpenTimeRef.current = Date.now();

      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isPanelPinned, selectedCategory, showSettingsDropdown]);


  useEffect(() => {
    if (!showSettingsDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const path = event.composedPath();

      const isOutsideModal = settingsModalRef.current && !path.includes(settingsModalRef.current);
      const isOutsideButton = settingsButtonRef.current && !settingsButtonRef.current.contains(target);

      if (isOutsideModal && isOutsideButton) {
        setShowSettingsDropdown(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsDropdown]);

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
    { id: 'reset', name: `RESET`, icon: resetIcon, colorClass: 'from-red-500 to-red-600', indicatorClass: 'bg-red-500' },
    { id: 'font', name: `Font Tools`, icon: fontSizeIcon, colorClass: 'from-blue-500 to-blue-600', indicatorClass: 'bg-blue-500' },
    { id: 'textSpacing', name: `Text Align`, icon: spacingCategoryIcon, colorClass: 'from-lime-500 to-lime-600', indicatorClass: 'bg-lime-500' },
    { id: 'lineHeight', name: `Line Height`, icon: lineCategoryIcon, colorClass: 'from-green-500 to-green-600', indicatorClass: 'bg-green-500' },
    { id: 'letterSpacing', name: `Letter\nSpacing`, icon: letterSpacingIcon, colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'contrast', name: `Contrast`, icon: contrastIcon, colorClass: 'from-purple-500 to-purple-600', indicatorClass: 'bg-purple-500' },
    { id: 'reading', name: `Reading Tools`, icon: bookIcon, colorClass: 'from-emerald-500 to-emerald-600', indicatorClass: 'bg-emerald-500' },
    { id: 'cursor', name: `Cursor Options`, icon: cursorIcon, colorClass: 'from-orange-500 to-orange-600', indicatorClass: 'bg-orange-500' },
    { id: 'navigation', name: `Keyboard\nShortcuts`, icon: navigationIcon, colorClass: 'from-violet-500 to-violet-600', indicatorClass: 'bg-violet-500' },
    { id: 'layout', name: `Page Layout`, icon: layoutIcon, colorClass: 'from-teal-500 to-teal-600', indicatorClass: 'bg-teal-500' },
    {
      id: 'quick_zoom', name: `Quick Zoom`, icon: zoomInIcon, colorClass: 'from-blue-500 to-cyan-500', indicatorClass: 'bg-blue-500'
    },
    {
      id: 'images', name: `Images/ Animations`, icon: hideIcon, colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500'
    },
    { id: 'speech', name: `Text To\nSpeech`, icon: speakIcon, colorClass: 'from-yellow-400 to-yellow-500', indicatorClass: 'bg-yellow-400' },
    { id: 'language', name: `Language\nTools`, icon: translateIcon, colorClass: 'from-indigo-500 to-indigo-600', indicatorClass: 'bg-indigo-500' },
    { id: 'ai', name: `AI Support`, icon: generativeIcon, colorClass: 'from-cyan-500 to-blue-500', indicatorClass: 'bg-cyan-500' },
    { id: 'az', name: `A-Z List`, icon: azIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },
    { id: 'position', name: `Sidebar\nPosition`, icon: moveUiIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },
    { id: 'feedback', name: `Feedback`, icon: feedbackIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },
    { id: 'info', name: `Info`, icon: infoIcon, colorClass: 'from-gray-500 to-gray-600', indicatorClass: 'bg-gray-500' },

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
              onOpenSettings={() => setShowSettingsDropdown(true)}
            />
          </div>
        );
      case 'position':
        return (
          <div className="space-y-4">
            <PositionControls />
            {/* <div className="border-b-4 -mx-6 my-4" style={{ borderColor: `${currentTheme.border}`, borderBottomWidth: '4px', boxShadow: 'none' }} /> */}
            {/* <ThemeSelector /> */}
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
              <TextToSpeech onClosePanel={() => setIsOpen(false)} />
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
            <h3 className="text-[15px] font-normal uppercase tracking-wider mb-2 px-1" style={{ color: currentTheme.text }}>
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
                    <div className="text-[17px] font-normal leading-tight" style={{ color: currentTheme.text }}>
                      {shortcut.name}
                    </div>
                    <div className="text-[15px] opacity-70 truncate" style={{ color: currentTheme.text }}>
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
            <h3 className="text-[24px] font-bold mb-4 px-2" style={{ color: currentTheme.text }}>Feature Guide</h3>
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
                            width={28}
                            height={28}
                            style={{ filter: 'brightness(0)' }}
                          />
                        </div>
                        <div className="font-extrabold text-lg" style={{ color: currentTheme.text }}>{categoryName}</div>
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
                        <div className="text-[19px] opacity-80 mb-4 mt-4 leading-relaxed" style={{ color: currentTheme.text }}>{description}</div>

                        {features && (
                          <div className="grid gap-3 mb-4">
                            {Object.entries(features).map(([featureName, featureDesc]: [string, any]) => (
                              <div key={featureName} className="pl-3 border-l-2" style={{ borderColor: `${currentTheme.active}ff`, borderLeftWidth: '4px' }}>
                                <span className="font-bold text-[18px] block" style={{ color: currentTheme.text }}>{featureName}</span>
                                <span className="text-[17px] opacity-70 block leading-snug" style={{ color: currentTheme.text }}>{featureDesc}</span>
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
        <>
          <div
            className={`fixed z-[2147483646] h-20 w-20 rounded-full animate-ping ${getButtonPositionClasses()}`}
            style={{
              backgroundColor: currentTheme.active || '#3b82f6',
              opacity: 0.6,
              pointerEvents: 'none',
              animationDuration: '2s'
            }}
          />
          <button
            type="button"
            ref={triggerRef}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onMouseEnter={() => {
              if (textToSpeech) {
                speak('Accessibility Options', ttsVoiceGender);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Enable text to speech by default and show popup once per page load
              setTextToSpeech?.(true);
              // Show popup only once per page load/refresh
              if (!hasShownTtsPopupThisSession) {
                setShowFirstTimeTtsPopup(true);
                setHasShownTtsPopupThisSession(true);
              }

              // Speak once on open and prevent other speech for a moment
              if (textToSpeech) {
                speak('Accessibility Options', ttsVoiceGender);
              }
              justOpenedRef.current = true;
              setTimeout(() => {
                justOpenedRef.current = false;
              }, 500);

              setIsOpen(true);
            }}
            className={`accessibility-bar a11y-embed-host fixed z-[2147483647] flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden cursor-pointer ${getButtonPositionClasses()}`}
            style={{
              background: barTheme === 'pink'
                ? `linear-gradient(135deg, #EC5DD6CC, #EC5DD6B3)`
                : barTheme === 'Turquoise'
                  ? `linear-gradient(135deg, #38FFC3CC, #38FFC3B3)`
                  : `linear-gradient(135deg, ${currentTheme.background}CC, ${currentTheme.background}B3)`,
              backdropFilter: 'blur(20px) saturate(190%)',
              WebkitBackdropFilter: 'blur(20px) saturate(190%)',
              border: barTheme === 'pink'
                ? `4px solid #F472B64D`
                : barTheme === 'Turquoise'
                  ? `4px solid #0abd87ff4D`
                  : `4px solid ${currentTheme.border}4D`,
              boxShadow: 'none',
              pointerEvents: 'auto',
              zoom: '1', // Prevent browser zoom influence
              transform: 'none', // Prevent transform scaling
              fontSize: '20px' // Force base font size
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
        </>
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
                  ? (isMobile ? '100vw' : (selectedCategory === 'az' ? `min(calc(600px + ${120 * sidebarIconSize}px), 95vw)` : `min(calc(280px + ${120 * sidebarIconSize}px), 95vw)`))
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
              ...(panelPosition === 'top' ? { top: '0', left: '0', right: '0' } : {}),
              ...(panelPosition === 'bottom' ? { bottom: '0', left: '0', right: '0' } : {}),
              ...(panelPosition === 'left' ? { left: '0', top: '0', bottom: '0' } : {}),
              ...(panelPosition === 'right' ? { right: '0', top: '0', bottom: '0' } : {}),
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

            <div
              className={`absolute z-[2147483650] pointer-events-auto transition-all duration-300`}
              style={{
                ...(isVertical
                  ? {
                    [panelPosition === 'right' ? 'right' : 'left']: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    [panelPosition === 'right' ? 'marginRight' : 'marginLeft']: '0px',
                    width: '36px',
                    height: '333px',
                  }
                  : {
                    [panelPosition === 'bottom' ? 'bottom' : 'top']: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '0px',
                    width: isMobile ? 'calc(100vw - 20px)' : '800px',
                    maxWidth: '800px',
                    height: '36px',
                  })
              }}
            >
              <div
                className={`w-full h-full flex ${isVertical ? 'flex-col' : 'flex-row overflow-x-auto custom-scrollbar'} items-center justify-between pointer-events-auto`}
                style={{
                  gap: '5px'
                }}
              >
                {/* 1. AZ List */}
                {!isVertical && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioPingEnabled) playAudioPing();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setSelectedOffset(rect.left + rect.width / 2);
                      setSelectedCategoryRect(rect);
                      setSelectedCategory('az');
                      setShowSettingsDropdown(false); // Close settings when selecting category
                      setHighlightedFeature(null);
                    }}
                    onMouseEnter={() => {
                      if (textToSpeech && !justOpenedRef.current) {
                        speak('A to Z List', ttsVoiceGender);
                      }
                    }}
                    className="flex-[7] flex items-center justify-center pointer-events-auto transition-all duration-300 w-full h-full p-0 border-0 focus:outline-none ease-out"
                    style={{
                      borderRadius: '0px',
                      background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                      boxShadow: `0 4px 12px ${currentTheme.border}33`,
                      border: `1px solid ${currentTheme.border}4D`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      filter: 'brightness(1)',
                      minWidth: isMobile && !isVertical ? '140px' : 'auto'
                    }}
                    title="A-Z List"
                  >
                    <div className={`flex ${isVertical ? 'flex-col gap-0.5' : 'flex-row gap-1'} items-center justify-center leading-none h-full p-0 m-0`}>
                      <span className={`${isVertical ? 'text-base' : 'text-base'} font-normal`} style={{ color: currentTheme.text }}>A-Z</span>
                      <span className={`${isVertical ? 'text-base' : 'text-base'} font-normal`} style={{ color: currentTheme.text }}>List</span>
                    </div>
                  </button>
                )}

                {/* 2. Position */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (audioPingEnabled) playAudioPing();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSelectedOffset(rect.left + rect.width / 2);
                    setSelectedCategoryRect(rect);
                    setSelectedCategory('position');
                    setShowSettingsDropdown(false);
                  }}
                  onMouseEnter={() => {
                    if (textToSpeech && !justOpenedRef.current) {
                      speak('Sidebar Position', ttsVoiceGender);
                    }
                  }}
                  className="flex-[7] flex items-center justify-center pointer-events-auto transition-all duration-300 w-full h-full p-0 border-0 focus:outline-none ease-out"
                  style={{
                    borderRadius: '0px',
                    background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                    boxShadow: `0 4px 12px ${currentTheme.border}33`,
                    border: `1px solid ${currentTheme.border}4D`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    filter: 'brightness(1)',
                    minWidth: isMobile && !isVertical ? '140px' : 'auto'
                  }}
                  title="Sidebar Position"
                >
                  <Image
                    src={moveUiIcon}
                    alt="Position"
                    width={20}
                    height={20}
                    className="object-contain"
                    style={{
                      filter: currentTheme.text === '#FFFFFF' ? 'brightness(0) invert(1)' : 'brightness(0)',
                      transform: isVertical
                        ? (panelPosition === 'right' ? 'rotate(-90deg)' : 'rotate(0deg)')
                        : (panelPosition === 'bottom' ? 'rotate(180deg) scaleX(-1)' : 'rotate(90deg)'),
                      opacity: 0.9
                    }}
                  />
                </button>

                {/* 3. Settings (Center) */}
                <button
                  ref={settingsButtonRef}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (audioPingEnabled) playAudioPing();
                    const newShowSettings = !showSettingsDropdown;
                    setShowSettingsDropdown(newShowSettings);
                    if (newShowSettings) {
                      setSelectedCategory(null); // Close any open category panel when opening settings
                    }
                  }}
                  onMouseEnter={() => {
                    if (textToSpeech && !justOpenedRef.current) {
                      speak('Customise', ttsVoiceGender);
                    }
                  }}
                  className={`flex-[8] flex items-center justify-center pointer-events-auto transition-all duration-300 w-full h-full p-0 border-0 focus:outline-none ease-out`}
                  style={{
                    borderRadius: '0px',
                    background: showSettingsDropdown
                      ? `linear-gradient(135deg, ${currentTheme.active}, ${currentTheme.active}dd)`
                      : `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                    boxShadow: `0 4px 12px ${currentTheme.border}33`,
                    border: `1px solid ${currentTheme.border}4D`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    filter: 'brightness(1)',
                    minWidth: isMobile && !isVertical ? '140px' : 'auto'
                  }}
                  aria-label="Customise"
                  title="Customise"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={currentTheme.text === '#FFFFFF' ? '#FFFFFF' : '#000000'}
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

                {/* 4. Feedback */}
                {!isVertical && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioPingEnabled) playAudioPing();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setSelectedOffset(rect.left + rect.width / 2);
                      setSelectedCategoryRect(rect);
                      setSelectedCategory('feedback');
                      setShowSettingsDropdown(false); // Close settings when selecting category
                    }}
                    onMouseEnter={() => {
                      if (textToSpeech && !justOpenedRef.current) {
                        speak('Feedback', ttsVoiceGender);
                      }
                    }}
                    className="flex-[7] flex items-center justify-center pointer-events-auto transition-all duration-300 w-full h-full p-0 border-0 focus:outline-none ease-out"
                    style={{
                      borderRadius: '0px',
                      background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                      boxShadow: `0 4px 12px ${currentTheme.border}33`,
                      border: `1px solid ${currentTheme.border}4D`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      filter: 'brightness(1)',
                      minWidth: isMobile && !isVertical ? '140px' : 'auto'
                    }}
                    title="Toolbar Feedback"
                  >
                    <Image
                      src={feedbackIcon}
                      alt="Toolbar Feedback"
                      width={20}
                      height={20}
                      className="object-contain"
                      style={{
                        filter: currentTheme.text === '#FFFFFF' ? 'brightness(0) invert(1)' : 'brightness(0)',
                        opacity: 0.9
                      }}
                    />
                  </button>
                )}

                {/* 5. Info */}
                {!isVertical && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioPingEnabled) playAudioPing();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setSelectedOffset(rect.left + rect.width / 2);
                      setSelectedCategoryRect(rect);
                      setSelectedCategory('info');
                      setShowSettingsDropdown(false); // Close settings when selecting category
                    }}
                    onMouseEnter={() => {
                      if (textToSpeech && !justOpenedRef.current) {
                        speak('Information', ttsVoiceGender);
                      }
                    }}
                    className="flex-[7] flex items-center justify-center pointer-events-auto transition-all duration-300 w-full h-full p-0 border-0 focus:outline-none ease-out"
                    style={{
                      borderRadius: '0px',
                      background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.hover})`,
                      boxShadow: `0 4px 12px ${currentTheme.border}33`,
                      border: `1px solid ${currentTheme.border}4D`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      filter: 'brightness(1)',
                      minWidth: isMobile && !isVertical ? '140px' : 'auto'
                    }}
                    title="Information"
                  >
                    <Image
                      src={infoIcon}
                      alt="Information"
                      width={20}
                      height={20}
                      className="object-contain"
                      style={{
                        filter: currentTheme.text === '#FFFFFF' ? 'brightness(0) invert(1)' : 'brightness(0)',
                        opacity: 0.9
                      }}
                    />
                  </button>
                )}
              </div>

              {/* Settings Modal (2x5 Grid) */}
              {(() => {
                const canRenderPortal = Boolean(showSettingsDropdown && isMobile && mounted && typeof window !== 'undefined' && document?.body);
                return canRenderPortal ? createPortal(
                  <div
                    ref={settingsModalRef}
                    className="fixed z-[2147483651] rounded-none shadow-2xl border-4 flex flex-col pointer-events-auto"
                    onMouseEnter={() => {
                      if (textToSpeech && !justOpenedRef.current) {
                        speak('Customise', ttsVoiceGender);
                      }
                    }}
                    style={{
                      bottom: isVertical
                        ? '0'
                        : (panelPosition === 'bottom' ? `${85 * sidebarIconSize}px` : 'auto'),
                      top: isVertical
                        ? '0'
                        : (panelPosition === 'top' ? `${85 * sidebarIconSize}px` : 'auto'),
                      left: isVertical
                        ? (panelPosition === 'left' ? `${85 * sidebarIconSize}px` : 'auto')
                        : '50%',
                      right: isVertical
                        ? (panelPosition === 'right' ? `${85 * sidebarIconSize}px` : 'auto')
                        : 'auto',
                      transform: isVertical ? 'none' : 'translateX(-50%)',
                      [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: '0',
                      [panelPosition === 'left' ? 'marginLeft' : 'marginRight']: '0',
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      width: isVertical ? `calc(100vw - ${95 * sidebarIconSize}px)` : 'calc(100vw - 20px)',
                      maxWidth: '1200px',
                      maxHeight: isVertical ? '100vh' : `calc(100vh - ${100 * sidebarIconSize}px)`,
                      height: 'auto',
                      position: 'fixed',
                      color: currentTheme.text
                    }}
                  >
                    {/* Indicator Arrow for Settings Modal - hidden on mobile */}

                    <div className="flex flex-col overflow-hidden rounded-none h-full flex-1 flex-shrink-0 relative" style={{ backgroundColor: currentTheme.background, borderColor: modalBorderColor, borderWidth: '4px', borderStyle: 'solid', color: currentTheme.text }}>
                      {/* Compact Header */}
                      <div className="px-3 sm:px-4 md:px-5 py-2 border-b flex items-center justify-center relative flex-shrink-0" style={{ borderColor: modalBorderColor }}>
                        <div className={`absolute ${isMobile ? 'left-2' : 'left-4 md:left-6'} flex items-center`}>
                          <img
                            src={logoIcon}
                            alt=""
                            className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
                            style={{ filter: currentTheme.text === '#FFFFFF' ? 'invert(1)' : 'none' }}
                          />
                        </div>
                        <h2
                          className={`font-normal tracking-tight text-center ${isMobile ? 'text-[18px] leading-snug px-8' : 'text-[20px] md:text-[20px] leading-[1.1]'
                            }`}
                          style={{ color: currentTheme.text }}
                        >
                          {isMobile ? 'Customise' : 'Customise Your Experience'}
                        </h2>
                        <button
                          onClick={() => setShowSettingsDropdown(false)}
                          className={`absolute ${isMobile ? 'right-2' : 'right-4 md:right-6'} flex items-center ${isMobile ? 'gap-1 px-1.5 py-1' : 'gap-2 px-2 py-1'} rounded-lg transition-all hover:brightness-110 active:scale-95`}
                          style={{ backgroundColor: 'transparent', color: currentTheme.text }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          {!isMobile && <span className="text-sm font-normal" style={{ color: currentTheme.text }}>Close</span>}
                        </button>
                      </div>

                      {/* Unified 2x6 Grid - Scrollable Content */}
                      <div
                        ref={settingsContentRef}
                        className="grid gap-0 overflow-y-auto icons-scroll-hidden flex-1 min-h-0"
                        style={{
                          WebkitOverflowScrolling: 'touch',
                          overscrollBehavior: 'contain',
                          touchAction: 'pan-y',
                          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1.2fr 1.2fr 1.2fr 0.6fr 0.6fr',
                          maxHeight: '100%'
                        }}
                      >
                        {/* Row 1, Cell 1: Language */}
                        <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'}`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>1. Select Language:</h3>
                          <LanguageSelector />
                        </section>

                        {/* Row 1, Cell 2: Accessibility Setting (Paginated) */}
                        <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'}`} style={{ borderColor: modalBorderColor }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>2. Accessibility Position Button:</h3>
                            {accessibilityIcon && (
                              <img
                                src={typeof accessibilityIcon === 'string' ? accessibilityIcon : (accessibilityIcon as any).src || accessibilityIcon}
                                alt=""
                                width={45}
                                height={45}
                                className="object-contain"
                                style={{ filter: 'none' }}
                              />
                            )}
                          </div>
                          <div className="mb-2"></div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'top-left', label: 'Top Left' }, { id: 'top-right', label: 'Top Right' },
                              { id: 'bottom-left', label: 'Bottom Left' }, { id: 'bottom-right', label: 'Bottom Right' },
                              { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Bottom' },
                              { id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }
                            ].slice(positionPage * 4, (positionPage + 1) * 4).map((pos) => (
                              <button
                                key={pos.id}
                                onClick={() => setButtonPosition(pos.id as any)}
                                className={`px-1 py-1.5 rounded-md border transition-all duration-300 flex items-center justify-center text-center leading-tight min-h-[44px] font-normal hover:scale-105 active:scale-95`}
                                style={{
                                  borderColor: buttonPosition === pos.id ? currentTheme.text : `${currentTheme.border}4D`,
                                  backgroundColor: buttonPosition === pos.id ? `${currentTheme.active}40` : `${currentTheme.text}08`,
                                  color: currentTheme.text,
                                  fontSize: '11px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {pos.label}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                if (audioPingEnabled) playAudioPing('menu');
                                setPositionPage(p => p === 0 ? 1 : 0);
                              }}
                              className="col-span-2 p-1.5 rounded-md border transition-all duration-300 flex items-center justify-center hover:bg-black/5 hover:scale-[1.02] active:scale-95 min-h-[36px]"
                              style={{
                                borderColor: `${currentTheme.border}4D`,
                                backgroundColor: `${currentTheme.text}08`,
                                color: currentTheme.text
                              }}
                              aria-label={positionPage === 0 ? "Show more" : "Show less"}
                            >
                              {positionPage === 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                  <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </section>

                        {/* Row 1, Cell 3: Feature Indicators */}
                        <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'} relative`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>3. Apply Active Circle Dots to Menu Icons when a Feature is Selected:</h3>
                          <ToggleCheckbox
                            id="show-active-indicators"
                            label={<span>Active Circle<br />(Red Dots)</span>}
                            checked={showActiveIndicators}
                            onChange={toggleShowActiveIndicators}
                          />
                          <div className="absolute top-2 right-2">
                            <InfoPopupButton
                              title="Feature Indicators"
                              description="Displays red circles on menu icons to indicate which features are currently active."
                            />
                          </div>
                        </section>

                        {/* Row 1, Cell 4: Icon Size */}
                        <section className={`pt-1 ${isMobile ? 'px-3' : 'px-2'} pb-0 border-b`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>4. Choose Sidebar Icon Size:</h3>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { id: 'standard', name: 'Standard', multiplier: 1 },
                              { id: 'medium', name: 'Medium', multiplier: 1.15 },
                              { id: 'large', name: 'Large', multiplier: 1.3 },
                              { id: 'xl', name: 'XL', multiplier: 1.5 }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  if (audioPingEnabled) playAudioPing('menu');
                                  setSidebarIconSize(opt.multiplier);
                                }}
                                className={`flex flex-col items-center justify-center p-1.5 rounded-[12px] border-2 transition-all duration-300 gap-1 ${sidebarIconSize === opt.multiplier ? 'scale-105' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'} active:scale-95`}
                                style={{
                                  borderColor: sidebarIconSize === opt.multiplier ? currentTheme.text : `${currentTheme.border}33`,
                                  backgroundColor: `${currentTheme.text}08`,
                                }}
                              >
                                {/* Swatch-like Box */}
                                <div
                                  className="w-10 h-10 rounded-[10px] border-2 shadow-sm flex items-center justify-center relative mb-1"
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: sidebarIconSize === opt.multiplier ? currentTheme.text : 'rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <img
                                    src={typeof scalabilityIcon === 'string' ? scalabilityIcon : (scalabilityIcon as any).src || scalabilityIcon}
                                    alt=""
                                    style={{
                                      width: `${18 * opt.multiplier}px`,
                                      height: `${18 * opt.multiplier}px`,
                                      filter: 'brightness(0)'
                                    }}
                                    className="object-contain"
                                  />

                                  {sidebarIconSize === opt.multiplier && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-black/10">
                                      <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Label */}
                                <span
                                  className={`text-[13px] font-normal uppercase tracking-wider text-center leading-tight`}
                                  style={{ color: currentTheme.text }}
                                >
                                  {opt.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </section>

                        {/* Row 1 & 2, Cell 5/6: Colour (Themes) */}
                        <section className={`${isMobile ? '' : 'col-span-2 row-span-2'} ${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-l' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4 leading-relaxed`} style={{ color: currentTheme.text }}>9. Choose a Colour Theme for the Sidebar Menu:</h3>

                          {/* Dark Themes Section */}
                          <div className="space-y-1.5 mb-2" style={{ marginTop: '0.75rem' }}>
                            <h4 className="text-[14px] font-normal tracking-wide mb-1.5" style={{ color: currentTheme.text }}>Dark Modes:</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {Object.entries(BAR_THEMES)
                                .filter(([key]) => ['black', 'navy', 'grayscale', 'purple', 'oceanBlue'].includes(key))
                                .map(([key, theme]) => {
                                  const isSelected = barTheme === key;
                                  const label = key === 'grayscale' ? (
                                    <span>Gray<br />Scale</span>
                                  ) : key === 'oceanBlue' ? (
                                    <span>Ocean<br />Blue</span>
                                  ) : (
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                  );
                                  const labelText = typeof label === 'string' ? label : key === 'grayscale' ? 'Grayscale' : key === 'oceanBlue' ? 'Ocean Blue' : key.charAt(0).toUpperCase() + key.slice(1);
                                  return (
                                    <button
                                      key={key}
                                      onClick={() => {
                                        if (audioPingEnabled) playAudioPing('menu');
                                        setBarTheme(key as BarTheme);
                                      }}
                                      className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-[1.03] shadow-sm'}`}
                                      style={{
                                        borderColor: isSelected ? theme.active : currentTheme.border,
                                        backgroundColor: isSelected ? `${theme.active}30` : `${currentTheme.text}08`,
                                      }}
                                      title={labelText}
                                    >
                                      <div
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12 mb-0.5"
                                        style={{
                                          backgroundColor: theme.background,
                                          borderColor: theme.border,
                                          color: theme.text
                                        }}
                                      >
                                        <span className="text-base font-normal">A</span>
                                        {isSelected && (
                                          <div
                                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                                          >
                                            <svg className="w-6 h-6 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-normal uppercase tracking-tight text-center leading-tight" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.9 }}>
                                        {label}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>

                          {/* Light Themes Section */}
                          <div className="space-y-1.5">
                            <h4 className="text-[14px] font-normal tracking-wide mb-1.5" style={{ color: currentTheme.text }}>Light Modes:</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {Object.entries(BAR_THEMES)
                                .filter(([key]) => ['white', 'yellow', 'Turquoise', 'pink'].includes(key))
                                .map(([key, theme]) => {
                                  const isSelected = barTheme === key;
                                  const label = key === 'Turquoise' ? 'Turq' : key.charAt(0).toUpperCase() + key.slice(1);
                                  return (
                                    <button
                                      key={key}
                                      onClick={() => {
                                        if (audioPingEnabled) playAudioPing('menu');
                                        setBarTheme(key as BarTheme);
                                      }}
                                      className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-[1.03] shadow-sm'}`}
                                      style={{
                                        borderColor: isSelected ? theme.active : currentTheme.border,
                                        backgroundColor: isSelected ? `${theme.active}30` : `${currentTheme.text}08`,
                                      }}
                                      title={label}
                                    >
                                      <div
                                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12 mb-0.5"
                                        style={{
                                          backgroundColor: theme.background,
                                          borderColor: theme.border,
                                          color: theme.text
                                        }}
                                      >
                                        <span className="text-base font-normal">A</span>
                                        {isSelected && (
                                          <div
                                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                                          >
                                            <svg className="w-6 h-6 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight whitespace-nowrap" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.9 }}>
                                        {label}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        </section>

                        {/* Row 2, Cell 1: Scrolling Progress Bar */}
                        <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>5. Scrolling Progress Bar:</h3>
                          <ToggleCheckbox
                            id="reading-progress-bar"
                            label="Active on Scrolling"
                            checked={readingProgressBar}
                            onChange={toggleReadingProgressBar}
                          />
                          {readingProgressBar && (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {['#000000', '#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#17D1C6'].map(color => (
                                <button
                                  key={color}
                                  onClick={() => {
                                    if (audioPingEnabled) playAudioPing('menu');
                                    setReadingProgressBarColor(color);
                                  }}
                                  className="w-full aspect-square rounded-md transition-all duration-300 relative shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
                                  style={{
                                    backgroundColor: color,
                                    border: color === '#FFFFFF' ? '2px solid rgba(0,0,0,0.1)' : 'none',
                                    boxShadow: readingProgressBarColor === color
                                      ? `0 0 0 2px ${currentTheme.background}, 0 0 0 4px ${currentTheme.active}`
                                      : 'none'
                                  }}
                                  aria-label={`Colour ${color}`}
                                >
                                  {readingProgressBarColor === color && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={['#FFFF00', '#00FF00', '#FFFFFF', '#17D1C6'].includes(color) ? '#000000' : '#FFFFFF'} strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </section>

                        {/* Row 2, Cell 2: Reset Icon */}
                        <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>6. Select 'Reset' Icon Button Colour:</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'red-black', color: '#FF0000' },
                              { id: 'yellow-black', color: '#FFD700' },
                              { id: 'turquoise-black', color: '#17D1C6' },
                              { id: 'white-black', color: '#FFFFFF' },
                              { id: 'black-white', color: '#000000' },
                              { id: 'pink-white', color: '#EC5DD6' }
                            ].map((style) => (
                              <button
                                key={style.id}
                                onClick={() => {
                                  if (audioPingEnabled) playAudioPing('menu');
                                  setResetIconStyle(style.id as any);
                                }}
                                className="w-full aspect-square rounded-md transition-all duration-300 relative shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
                                style={{
                                  backgroundColor: style.color,
                                  border: style.id === 'white-black' ? '2px solid rgba(0,0,0,0.1)' : (style.id === 'pink-white' && resetIconStyle === style.id ? '2px solid #FFFFFF' : 'none'),
                                  boxShadow: resetIconStyle === style.id
                                    ? `0 0 0 2px ${currentTheme.background}, 0 0 0 4px ${currentTheme.active}`
                                    : 'none'
                                }}
                                aria-label={`Reset Style ${style.id}`}
                              >
                                {resetIconStyle === style.id && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={style.id === 'white-black' || style.id === 'yellow-black' || style.id === 'turquoise-black' ? '#000000' : '#FFFFFF'} strokeWidth={4}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </section>

                        {/* Row 2, Cell 3: Audio Ping */}
                        <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>7. Apply Audio Ping:</h3>
                          <ToggleCheckbox
                            id="audio-ping-enabled"
                            label="Audio Ping on select or deselect features"
                            checked={audioPingEnabled}
                            onChange={toggleAudioPing}
                          />
                        </section>

                        {/* Row 2, Cell 4: Pick a Profile */}
                        <section className={`${isMobile ? 'p-3' : 'p-2'} flex flex-col border-t`} style={{ borderColor: modalBorderColor }}>
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4 leading-relaxed`} style={{ color: currentTheme.text }}>8. Pick a Profile:</h3>
                          <div
                            className="flex-1 overflow-y-auto custom-scrollbar pr-1"
                            style={{ maxHeight: 'none' }}
                          >
                            <div className="grid grid-cols-1 gap-1 h-[160px] overflow-y-auto custom-scrollbar pr-1">
                              {[
                                { id: 'motor', name: 'Motor Impaired' },
                                { id: 'blindness', name: 'Blindness' },
                                { id: 'colorblind', name: 'Colour Blind' },
                                { id: 'dyslexia', name: 'Dyslexia' },
                                { id: 'lowvision', name: 'Visually Impaired' },
                                { id: 'cognitive', name: 'Cognitive Disability' },
                                { id: 'seizure', name: 'Seizure Safe' },
                                { id: 'adhd', name: 'ADHD Friendly' },
                                { id: 'photosensitive', name: 'Photosensitive' },
                                { id: 'elderly', name: 'Elderly' },
                                { id: 'hearing', name: 'Hearing Impaired' },
                                { id: 'reading', name: 'Reading Support' }
                              ].map((profile) => (
                                <button
                                  key={profile.id}
                                  onClick={() => applyProfile(profile.id)}
                                  className={`w-full py-1.5 px-3 rounded-lg border text-[14px] font-normal transition-all text-left flex items-center justify-between leading-relaxed ${activeProfile === profile.id ? 'shadow-inner' : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'}`}
                                  style={{
                                    borderColor: activeProfile === profile.id ? currentTheme.text : `${currentTheme.border}4D`,
                                    backgroundColor: activeProfile === profile.id ? `${currentTheme.active}40` : `${currentTheme.text}08`,
                                    color: currentTheme.text
                                  }}
                                >
                                  <span className="flex-1">{profile.name}</span>
                                  <div
                                    className="w-6 h-6 rounded flex items-center justify-center transition-all ml-3 flex-shrink-0"
                                    style={{
                                      backgroundColor: activeProfile === profile.id ? currentTheme.active : 'rgba(255, 255, 255, 0.9)',
                                      border: activeProfile === profile.id ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'
                                    }}
                                  >
                                    {activeProfile === profile.id && (
                                      <svg className="w-4 h-4" style={{ color: currentTheme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </section>
                      </div>

                      {/* Scroll Hint */}
                      {showScrollHint && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none z-50 flex flex-col items-center">
                          <div
                            className="backdrop-blur-md px-3 py-1 rounded-full shadow-lg border flex items-center gap-2"
                            style={{
                              backgroundColor: `${currentTheme.background}CC`,
                              borderColor: `${currentTheme.border}4D`
                            }}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.text }}>Scroll down</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: currentTheme.text }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  , document.body) : null;
              })()}
              {showSettingsDropdown && !isMobile && (
                <div
                  ref={settingsModalRef}
                  className="absolute z-[2147483651] rounded-none shadow-2xl border-4 flex flex-col"
                  onMouseEnter={() => {
                    if (textToSpeech) {
                      speak('Customise', ttsVoiceGender);
                    }
                  }}
                  style={{
                    bottom: isVertical ? 'auto' : (panelPosition === 'bottom' ? '100%' : 'auto'),
                    top: isVertical ? '50%' : (panelPosition === 'top' ? '100%' : 'auto'),
                    left: isVertical ? (panelPosition === 'left' ? '100%' : 'auto') : '50%',
                    right: isVertical ? (panelPosition === 'right' ? '100%' : 'auto') : 'auto',
                    transform: isVertical ? 'translateY(-50%)' : 'translateX(-50%)',
                    [panelPosition === 'bottom' ? 'marginBottom' : 'marginTop']: isVertical ? '0' : '20px',
                    [panelPosition === 'left' ? 'marginLeft' : 'marginRight']: isVertical ? '20px' : '0',
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    width: isVertical ? 'min(calc(100vw - 200px), 1200px)' : 'calc(100vw - 40px)',
                    maxWidth: '1200px',
                    maxHeight: 'min(800px, 85vh)',
                    height: 'auto',
                    color: currentTheme.text
                  }}
                >
                  {/* Indicator Arrow for Settings Modal */}
                  {!isMobile && (
                    <div
                      className="absolute pointer-events-none z-[2147483653]"
                      style={{
                        left: isVertical ? (panelPosition === 'left' ? '-14px' : 'auto') : '50%',
                        right: isVertical ? (panelPosition === 'right' ? '-14px' : 'auto') : 'auto',
                        top: isVertical ? '50%' : (panelPosition === 'top' ? '-14px' : 'auto'),
                        bottom: isVertical ? 'auto' : (panelPosition === 'bottom' ? '-14px' : 'auto'),
                        transform: isVertical ? 'translateY(-50%)' : 'translateX(-50%)',
                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                      }}
                    >
                      <svg
                        width="30"
                        height="20"
                        viewBox="0 0 30 20"
                        fill="none"
                        style={{
                          transform: isVertical
                            ? (panelPosition === 'left' ? 'rotate(-90deg)' : 'rotate(90deg)')
                            : (panelPosition === 'top' ? 'rotate(0deg)' : 'rotate(180deg)')
                        }}
                      >
                        <path
                          d={isVertical
                            ? (panelPosition === 'left' ? "M0 20 L15 5 L30 20" : "M0 0 L15 15 L30 0")
                            : (panelPosition === 'top' ? "M0 20 L15 5 L30 20" : "M0 0 L15 15 L30 0")
                          }
                          fill={currentTheme.background}
                          stroke={currentTheme.border}
                          strokeWidth="4"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-col overflow-hidden rounded-none h-full flex-1 flex-shrink-0 relative" style={{ backgroundColor: currentTheme.background, borderColor: modalBorderColor, borderWidth: '4px', borderStyle: 'solid', color: currentTheme.text }}>
                    {/* Compact Header */}
                    <div className="px-3 sm:px-4 md:px-5 py-2 border-b flex items-center justify-center relative flex-shrink-0" style={{ borderColor: modalBorderColor }}>
                      <div className={`absolute ${isMobile ? 'left-2' : 'left-4 md:left-6'} flex items-center`}>
                        <img
                          src={logoIcon}
                          alt=""
                          className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
                          style={{ filter: currentTheme.text === '#FFFFFF' ? 'invert(1)' : 'none' }}
                        />
                      </div>
                      <h2
                        className={`font-normal tracking-tight text-center ${isMobile ? 'text-[18px] leading-snug px-8' : 'text-[20px] md:text-[20px] leading-[1.1]'
                          }`}
                        style={{ color: currentTheme.text }}
                      >
                        {isMobile ? 'Customise' : 'Customise Your Experience'}
                      </h2>
                      <button
                        onClick={() => setShowSettingsDropdown(false)}
                        className={`absolute ${isMobile ? 'right-2' : 'right-4 md:right-6'} flex items-center ${isMobile ? 'gap-1 px-1.5 py-1' : 'gap-2 px-2 py-1'} rounded-lg transition-all hover:brightness-110 active:scale-95`}
                        style={{ backgroundColor: 'transparent', color: currentTheme.text }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        {!isMobile && <span className="text-sm font-normal" style={{ color: currentTheme.text }}>Close</span>}
                      </button>
                    </div>

                    {/* Unified 2x6 Grid - Scrollable Content */}
                    <div
                      ref={settingsContentRef}
                      className="grid gap-0 overflow-y-auto custom-scrollbar flex-1"
                      style={{
                        gridTemplateColumns: isMobile
                          ? '1fr'
                          : windowWidth < 1024
                            ? '1fr 1fr'
                            : windowWidth < 1400
                              ? '1.2fr 1.2fr 1.2fr 1.2fr'
                              : '1.2fr 1.2fr 1.2fr 1.2fr 0.6fr 0.6fr',
                        maxHeight: '100%'
                      }}
                    >

                      {/* Row 1, Cell 1: Language */}
                      <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'}`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>1. Select Language:</h3>
                        <LanguageSelector />
                      </section>

                      {/* Row 1, Cell 2: Accessibility Setting (Paginated) */}
                      <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'}`} style={{ borderColor: modalBorderColor }}>
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>2. Accessibility Position Button:</h3>
                          {accessibilityIcon && (
                            <img
                              src={typeof accessibilityIcon === 'string' ? accessibilityIcon : (accessibilityIcon as any).src || accessibilityIcon}
                              alt=""
                              width={45}
                              height={45}
                              className="object-contain"
                              style={{ filter: 'none' }}
                            />
                          )}
                        </div>
                        <div className="mb-2"></div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'top-left', label: 'Top Left' }, { id: 'top-right', label: 'Top Right' },
                            { id: 'bottom-left', label: 'Bottom Left' }, { id: 'bottom-right', label: 'Bottom Right' },
                            { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Bottom' },
                            { id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }
                          ].slice(positionPage * 4, (positionPage + 1) * 4).map((pos) => (
                            <button
                              key={pos.id}
                              onClick={() => setButtonPosition(pos.id as any)}
                              className={`px-1 py-1.5 rounded-md border transition-all duration-300 flex items-center justify-center text-center leading-tight min-h-[44px] font-normal hover:scale-105 active:scale-95`}
                              style={{
                                borderColor: buttonPosition === pos.id ? currentTheme.text : `${currentTheme.border}4D`,
                                backgroundColor: buttonPosition === pos.id ? `${currentTheme.active}40` : `${currentTheme.text}08`,
                                color: currentTheme.text,
                                fontSize: '14px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {pos.label}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              if (audioPingEnabled) playAudioPing('menu');
                              setPositionPage(p => p === 0 ? 1 : 0);
                            }}
                            className="col-span-2 p-1.5 rounded-md border transition-all duration-300 flex items-center justify-center hover:bg-black/5 hover:scale-[1.02] active:scale-95 min-h-[36px]"
                            style={{
                              borderColor: `${currentTheme.border}4D`,
                              backgroundColor: `${currentTheme.text}08`,
                              color: currentTheme.text
                            }}
                            aria-label={positionPage === 0 ? "Show more" : "Show less"}
                          >
                            {positionPage === 0 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </section>

                      {/* Row 1, Cell 3: Feature Indicators */}
                      <section className={`pt-1 ${isMobile ? 'px-3' : 'px-4'} pb-0 ${!isMobile ? 'border-r border-b' : 'border-b'} relative`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>3. Apply Active Circle Dots to Menu Icons when a Feature is Selected:</h3>
                        <ToggleCheckbox
                          id="show-active-indicators"
                          label={<span>Active Circle<br />(Red Dots)</span>}
                          checked={showActiveIndicators}
                          onChange={toggleShowActiveIndicators}
                        />
                        <div className="absolute bottom-2 right-2">
                          <InfoPopupButton
                            title="Feature Indicators"
                            description="Displays red circles on menu icons to indicate which features are currently active."
                          />
                        </div>
                      </section>

                      {/* Row 1, Cell 4: Icon Size */}
                      <section className={`pt-1 ${isMobile ? 'px-3' : 'px-2'} pb-0 border-b`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>4. Choose Sidebar Icon Size:</h3>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'standard', name: 'Standard', multiplier: 1 },
                            { id: 'medium', name: 'Medium', multiplier: 1.15 },
                            { id: 'large', name: 'Large', multiplier: 1.3 },
                            { id: 'xl', name: 'XL', multiplier: 1.5 }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (audioPingEnabled) playAudioPing('menu');
                                setSidebarIconSize(opt.multiplier);
                              }}
                              className={`flex flex-col items-center justify-center p-1.5 rounded-[12px] border-2 transition-all duration-300 gap-1 ${sidebarIconSize === opt.multiplier ? 'scale-105' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'} active:scale-95`}
                              style={{
                                borderColor: sidebarIconSize === opt.multiplier ? currentTheme.text : `${currentTheme.border}33`,
                                backgroundColor: `${currentTheme.text}08`,
                              }}
                            >
                              {/* Swatch-like Box */}
                              <div
                                className="w-10 h-10 rounded-[10px] border-2 shadow-sm flex items-center justify-center relative mb-1"
                                style={{
                                  backgroundColor: '#FFFFFF',
                                  borderColor: sidebarIconSize === opt.multiplier ? currentTheme.text : 'rgba(0,0,0,0.1)'
                                }}
                              >
                                <img
                                  src={typeof scalabilityIcon === 'string' ? scalabilityIcon : (scalabilityIcon as any).src || scalabilityIcon}
                                  alt=""
                                  style={{
                                    width: `${18 * opt.multiplier}px`,
                                    height: `${18 * opt.multiplier}px`,
                                    filter: 'brightness(0)'
                                  }}
                                  className="object-contain"
                                />

                                {sidebarIconSize === opt.multiplier && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-black/10">
                                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Label */}
                              <span
                                className={`text-[13px] font-normal uppercase tracking-wider text-center leading-tight`}
                                style={{ color: currentTheme.text }}
                              >
                                {opt.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Row 1 & 2, Cell 5/6: Colour (Themes) */}
                      <section className={`${isMobile ? '' : 'col-span-2 row-span-2'} ${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-l' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-0.5 leading-relaxed`} style={{ color: currentTheme.text }}>9. Choose a Colour Theme for the Sidebar Menu:</h3>

                        {/* Dark Themes Section */}
                        <div className="space-y-1.5 mb-2" style={{ marginTop: '0.75rem' }}>
                          <h4 className="text-[14px] font-normal tracking-wide mb-1.5" style={{ color: currentTheme.text }}>Dark Modes:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(BAR_THEMES)
                              .filter(([key]) => ['black', 'navy', 'grayscale', 'purple', 'oceanBlue'].includes(key))
                              .map(([key, theme]) => {
                                const isSelected = barTheme === key;
                                const label = key === 'grayscale' ? (
                                  <span>Gray<br />Scale</span>
                                ) : key === 'oceanBlue' ? (
                                  <span>Ocean<br />Blue</span>
                                ) : (
                                  key.charAt(0).toUpperCase() + key.slice(1)
                                );
                                const labelText = typeof label === 'string' ? label : key === 'grayscale' ? 'Grayscale' : key === 'oceanBlue' ? 'Ocean Blue' : key.charAt(0).toUpperCase() + key.slice(1);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (audioPingEnabled) playAudioPing('menu');
                                      setBarTheme(key as BarTheme);
                                    }}
                                    className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-[1.03] shadow-sm'}`}
                                    style={{
                                      borderColor: isSelected ? theme.active : currentTheme.border,
                                      backgroundColor: isSelected ? `${theme.active}30` : `${currentTheme.text}08`,
                                    }}
                                    title={labelText}
                                  >
                                    <div
                                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12 mb-0.5"
                                      style={{
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                        color: theme.text
                                      }}
                                    >
                                      <span className="text-base font-bold">A</span>
                                      {isSelected && (
                                        <div
                                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                                        >
                                          <svg className="w-6 h-6 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.9 }}>
                                      {label}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        {/* Light Themes Section */}
                        <div className="space-y-1.5">
                          <h4 className="text-[14px] font-normal tracking-wide mb-1.5" style={{ color: currentTheme.text }}>Light Modes:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(BAR_THEMES)
                              .filter(([key]) => ['white', 'yellow', 'Turquoise', 'pink'].includes(key))
                              .map(([key, theme]) => {
                                const isSelected = barTheme === key;
                                const label = key === 'Turquoise' ? 'Turq' : key.charAt(0).toUpperCase() + key.slice(1);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (audioPingEnabled) playAudioPing('menu');
                                      setBarTheme(key as BarTheme);
                                    }}
                                    className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-[1.03] shadow-sm'}`}
                                    style={{
                                      borderColor: isSelected ? theme.active : currentTheme.border,
                                      backgroundColor: isSelected ? `${theme.active}30` : `${currentTheme.text}08`,
                                    }}
                                    title={label}
                                  >
                                    <div
                                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transform transition-transform group-hover:rotate-12 mb-0.5"
                                      style={{
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                        color: theme.text
                                      }}
                                    >
                                      <span className="text-base font-bold">A</span>
                                      {isSelected && (
                                        <div
                                          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10 animate-in fade-in duration-300"
                                        >
                                          <svg className="w-6 h-6 text-white filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight whitespace-nowrap" style={{ color: currentTheme.text, opacity: isSelected ? 1 : 0.9 }}>
                                      {label}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </section>

                      {/* Row 2, Cell 1: Scrolling Progress Bar */}
                      <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>5. Scrolling Progress Bar:</h3>
                        <ToggleCheckbox
                          id="reading-progress-bar"
                          label="Active on Scrolling"
                          checked={readingProgressBar}
                          onChange={toggleReadingProgressBar}
                        />
                        {readingProgressBar && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {['#000000', '#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#17D1C6'].map(color => (
                              <button
                                key={color}
                                onClick={() => {
                                  if (audioPingEnabled) playAudioPing('menu');
                                  setReadingProgressBarColor(color);
                                }}
                                className="w-full aspect-square rounded-md transition-all duration-300 relative shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
                                style={{
                                  backgroundColor: color,
                                  border: color === '#FFFFFF' ? '2px solid rgba(0,0,0,0.1)' : 'none',
                                  boxShadow: readingProgressBarColor === color
                                    ? `0 0 0 2px ${currentTheme.background}, 0 0 0 4px ${currentTheme.active}`
                                    : 'none'
                                }}
                                aria-label={`Colour ${color}`}
                              >
                                {readingProgressBarColor === color && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={['#FFFF00', '#00FF00', '#FFFFFF', '#17D1C6'].includes(color) ? '#000000' : '#FFFFFF'} strokeWidth={4}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </section>

                      {/* Row 2, Cell 2: Reset Icon */}
                      <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>6. Select 'Reset' Icon Button Colour:</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'red-black', color: '#FF0000' },
                            { id: 'yellow-black', color: '#FFD700' },
                            { id: 'turquoise-black', color: '#17D1C6' },
                            { id: 'white-black', color: '#FFFFFF' },
                            { id: 'black-white', color: '#000000' },
                            { id: 'pink-white', color: '#EC5DD6' }
                          ].map((style) => (
                            <button
                              key={style.id}
                              onClick={() => {
                                if (audioPingEnabled) playAudioPing('menu');
                                setResetIconStyle(style.id as any);
                              }}
                              className="w-full aspect-square rounded-md transition-all duration-300 relative shadow-sm hover:scale-105 active:scale-95 flex-shrink-0"
                              style={{
                                backgroundColor: style.color,
                                border: style.id === 'white-black' ? '2px solid rgba(0,0,0,0.1)' : (style.id === 'pink-white' && resetIconStyle === style.id ? '2px solid #FFFFFF' : 'none'),
                                boxShadow: resetIconStyle === style.id
                                  ? `0 0 0 2px ${currentTheme.background}, 0 0 0 4px ${currentTheme.active}`
                                  : 'none'
                              }}
                              aria-label={`Reset Style ${style.id}`}
                            >
                              {resetIconStyle === style.id && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={style.id === 'white-black' || style.id === 'yellow-black' || style.id === 'turquoise-black' ? '#000000' : '#FFFFFF'} strokeWidth={4}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Row 2, Cell 3: Audio Ping */}
                      <section className={`${isMobile ? 'p-3' : 'p-2'} ${!isMobile ? 'border-r' : 'border-t'}`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4`} style={{ color: currentTheme.text, lineHeight: '1' }}>7. Apply Audio Ping:</h3>
                        <ToggleCheckbox
                          id="audio-ping-enabled"
                          label="Audio Ping on select or deselect features"
                          checked={audioPingEnabled}
                          onChange={toggleAudioPing}
                        />
                      </section>

                      {/* Row 2, Cell 4: Pick a Profile */}
                      <section className={`${isMobile ? 'p-3' : 'p-2'} flex flex-col border-t`} style={{ borderColor: modalBorderColor }}>
                        <h3 className={`${isMobile ? 'text-[15px]' : 'text-[16px]'} font-normal mb-4 leading-relaxed`} style={{ color: currentTheme.text }}>8. Pick a Profile:</h3>
                        <div
                          className="flex-1 overflow-y-auto custom-scrollbar pr-1"
                          style={{ maxHeight: 'none' }}
                        >
                          <div className="grid grid-cols-1 gap-1 h-[160px] overflow-y-auto custom-scrollbar pr-1">
                            {[
                              { id: 'motor', name: 'Motor Impaired' },
                              { id: 'blindness', name: 'Blindness' },
                              { id: 'colorblind', name: 'Colour Blind' },
                              { id: 'dyslexia', name: 'Dyslexia' },
                              { id: 'lowvision', name: 'Visually Impaired' },
                              { id: 'cognitive', name: 'Cognitive Disability' },
                              { id: 'seizure', name: 'Seizure Safe' },
                              { id: 'adhd', name: 'ADHD Friendly' },
                              { id: 'photosensitive', name: 'Photosensitive' },
                              { id: 'elderly', name: 'Elderly' },
                              { id: 'hearing', name: 'Hearing Impaired' },
                              { id: 'reading', name: 'Reading Support' }
                            ].map((profile) => (
                              <button
                                key={profile.id}
                                onClick={() => applyProfile(profile.id)}
                                className={`w-full py-1.5 px-3 rounded-lg border text-[16px] font-black transition-all text-left flex items-center justify-between leading-relaxed ${activeProfile === profile.id ? 'shadow-inner' : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'}`}
                                style={{
                                  borderColor: activeProfile === profile.id ? currentTheme.text : `${currentTheme.border}4D`,
                                  backgroundColor: activeProfile === profile.id ? `${currentTheme.active}40` : `${currentTheme.text}08`,
                                  color: currentTheme.text
                                }}
                              >
                                <span className="flex-1">{profile.name}</span>
                                <div
                                  className="w-6 h-6 rounded flex items-center justify-center transition-all ml-3 flex-shrink-0"
                                  style={{
                                    backgroundColor: activeProfile === profile.id ? currentTheme.active : 'rgba(255, 255, 255, 0.9)',
                                    border: activeProfile === profile.id ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  {activeProfile === profile.id && (
                                    <svg className="w-4 h-4" style={{ color: currentTheme.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Scroll Hint */}
                    {showScrollHint && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none z-50 flex flex-col items-center">
                        <div
                          className="backdrop-blur-md px-3 py-1 rounded-full shadow-lg border flex items-center gap-2"
                          style={{
                            backgroundColor: `${currentTheme.background}CC`,
                            borderColor: `${currentTheme.border}4D`
                          }}
                        >
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.text }}>Scroll for more</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: currentTheme.text }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div >
            <div className={`flex h-full w-full ${isVertical
              ? (panelPosition === 'right' ? 'flex-row-reverse' : 'flex-row')
              : 'flex-row'
              }`}>
              <div
                className={`flex items-center p-1.5 ${isVertical
                  ? `flex-col w-[100px] sm:w-[130px] gap-3 sm:gap-4 h-full overflow-y-auto custom-scrollbar`
                  : `${panelPosition === 'top' ? 'flex-row items-center relative overflow-x-auto icons-scroll-hidden' : 'flex-row items-center overflow-x-auto custom-scrollbar'} h-full w-full justify-start gap-2 ${panelPosition === 'bottom' ? 'border-t' : 'border-b'}`
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
                  onMouseEnter={() => {
                    // Speak "Exit" when cursor hovers over close button
                    if (textToSpeech) {
                      speak('Exit', ttsVoiceGender);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Prevent immediate close if just opened (race condition)
                    if (Date.now() - lastOpenTimeRef.current < 300) return;
                    if (audioPingEnabled) playAudioPing('menu'); // Using menu sound

                    // Speak "Exit" when close button is clicked (only if TTS is enabled)
                    if (textToSpeech) {
                      speak('Exit', ttsVoiceGender);
                    }

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
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    border: '2px solid rgba(0,0,0,0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    width: isVertical ? '60px' : '63px',
                    height: isVertical ? '60px' : '63px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close"
                >
                  <svg
                    className="h-6 w-6"
                    style={{ color: '#000000' }}
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

                <div
                  ref={iconsContainerRef}
                  className={`accessibility-bar pointer-events-auto flex relative ${isVertical ? 'flex-col space-y-3 sm:space-y-4 items-center flex-shrink-0' : `flex-row items-center flex-grow gap-2 ${panelPosition === 'top' ? 'icons-scroll-hidden' : ''}`}`}
                  style={!isVertical && panelPosition === 'top' ? {
                    overflowX: 'scroll', // Needed for programmatic scrolling
                    overflowY: 'hidden', // Prevent vertical scrolling
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none', // Firefox - hide scrollbar
                    msOverflowStyle: 'none', // IE/Edge - hide scrollbar
                    userSelect: 'none', // Prevent text selection
                    WebkitUserSelect: 'none',
                  } : {}}
                  onMouseDown={(e) => {
                    // Prevent drag selection
                    if (!isVertical) {
                      const target = e.target as HTMLElement;
                      if (!target.closest('button') && !target.closest('[data-category-btn]')) {
                        e.preventDefault();
                      }
                    }
                  }}
                >


                  {(() => {
                    // Exclude constant categories from paginated list
                    const constantCategoryIds = ['reset', 'az', 'move_ui_extra']; // reset and az are handled separately
                    const paginatedCategories = categories.filter(c => !['reset', 'az', 'position', 'feedback', 'info'].includes(c.id));
                    // Disable pagination for all sizes (Standard, Medium, Large, XL) to show all icons
                    // This prevents icons from disappearing when zooming - all sizes behave like Large/XL
                    const shouldPaginate = !isVertical ? false : true;
                    const startIndex = shouldPaginate ? (currentPage - 1) * itemsPerPage : 0;
                    const visibleCategories = shouldPaginate
                      ? paginatedCategories.slice(startIndex, startIndex + itemsPerPage)
                      : paginatedCategories; // Show all icons when pagination is disabled
                    const totalPages = shouldPaginate ? Math.ceil(paginatedCategories.length / itemsPerPage) : 1;

                    return (
                      <>
                        {/* 3 Constant Icons: A-Z and Reset (Close is rendered before this container) */}
                        {(() => {
                          const resetCategory = categories.find(c => c.id === 'reset');
                          const azCategory = categories.find(c => c.id === 'az');

                          return (
                            <>
                              {/* A-Z Button Removed */}

                              {resetCategory && (
                                <div key="reset-constant" className="relative group/category">
                                  <button
                                    type="button"
                                    data-category-btn
                                    data-category-id="reset"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (audioPingEnabled) playAudioPing('menu');
                                      setShowResetConfirm(true);
                                    }}
                                    onKeyDown={(e) => handleCategoryKeyDown(e, 0)}
                                    onMouseEnter={() => textToSpeech && !justOpenedRef.current && speak(resetCategory.name.replace(/\n/g, ' '), ttsVoiceGender)}
                                    className={`group relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-hidden hover:scale-105`}
                                    style={{
                                      background: resetIconStyle === 'red-black'
                                        ? 'linear-gradient(135deg, #FF0000, #CC0000)'
                                        : resetIconStyle === 'yellow-black'
                                          ? '#FFD700'
                                          : resetIconStyle === 'turquoise-black'
                                            ? '#17D1C6'
                                            : resetIconStyle === 'white-black'
                                              ? '#FFFFFF'
                                              : resetIconStyle === 'pink-white'
                                                ? '#EC4899'
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
                              data-category-id={category.id}
                              onKeyDown={(e) => handleCategoryKeyDown(e, shouldPaginate ? index + 1 : index)}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (audioPingEnabled) playAudioPing('menu');
                                if (category.id === 'reset') {
                                  setShowResetConfirm(true);
                                  return;
                                }
                                if (category.id === 'move_ui') {
                                  // Sidebar tutorial removed - directly cycle through positions
                                  // After showing once in this session, cycle through positions
                                  const positions = ['top', 'bottom', 'left', 'right'];
                                  const currentIndex = positions.indexOf(panelPosition || 'top');
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
                                if (selectedCategory !== category.id) {
                                  setShowSettingsDropdown(false); // Close settings when selecting a new category
                                }
                              }}
                              onMouseEnter={() => {
                                if (textToSpeech && !justOpenedRef.current) {
                                  const textToSpeak = category.id === 'az' ? 'A to Z List' : category.name.replace(/\n/g, ' ');
                                  speak(textToSpeak, ttsVoiceGender);
                                }
                              }}
                              className={`group relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 overflow-visible px-1 py-1 ${selectedCategory === category.id
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
                                        : resetIconStyle === 'turquoise-black'
                                          ? '#17D1C6'
                                          : resetIconStyle === 'white-black'
                                            ? '#FFFFFF'
                                            : resetIconStyle === 'pink-white'
                                              ? '#EC4899'
                                              : '#000000',
                                    backdropFilter: 'blur(5px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.1)' : '4px solid rgba(255,255,255,0.2)',
                                    boxShadow: 'none',
                                    width: (isVertical ? 78 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px',
                                    height: (isVertical ? 80 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px'
                                  }
                                  : category.id === 'az' // A-Z button always white background
                                    ? {
                                      background: '#FFFFFF',
                                      backdropFilter: 'none',
                                      WebkitBackdropFilter: 'none',
                                      border: '2px solid rgba(0,0,0,0.2)',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                      width: selectedCategory === category.id
                                        ? (isVertical ? 78 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px'
                                        : (isVertical ? 55 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 64 : 58) * sidebarIconSize + 'px',
                                      height: selectedCategory === category.id
                                        ? (isVertical ? 80 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px'
                                        : (isVertical ? 55 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 64 : 58) * sidebarIconSize + 'px'
                                    }
                                    : selectedCategory === category.id
                                      ? {
                                        background: `linear-gradient(135deg, ${barTheme === 'yellow' ? '#87CEEB' : '#FFD700'}, ${barTheme === 'yellow' ? '#6BB6D6' : '#E6C200'})`,
                                        backdropFilter: 'blur(5px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                        border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.4)' : '4px solid rgba(255,255,255,0.4)',
                                        boxShadow: 'none',
                                        width: (isVertical ? 78 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px',
                                        height: (isVertical ? 80 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px'
                                      }
                                      : {
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                                        backdropFilter: 'blur(5px) saturate(180%)',
                                        WebkitBackdropFilter: 'blur(5px) saturate(180%)',
                                        border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.25)' : '4px solid rgba(255,255,255,0.25)',
                                        boxShadow: 'none',
                                        width: (isVertical ? 78 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 80 : 58) * sidebarIconSize + 'px',
                                        height: (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5))
                                          ? (64 * sidebarIconSize + 10) + 'px'
                                          : (isVertical ? 80 : 58) * sidebarIconSize + 'px'
                                      }
                                )
                              }}
                              aria-label={category.name}
                              title={category.name}
                            >
                              {category.id === 'az' ? (
                                <div
                                  className={`flex flex-col items-center justify-center leading-none gap-2.5 transition-all duration-300 ${selectedCategory === category.id
                                    ? ''
                                    : 'opacity-70 group-hover:opacity-100'
                                    }`}
                                  style={{
                                    width: 32 * sidebarIconSize,
                                    height: 32 * sidebarIconSize,
                                    color: '#000000',
                                  }}
                                >
                                  <span style={{ fontSize: `${(isVertical ? 16 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 11 : 15) * sidebarIconSize}px`, display: 'block', lineHeight: '1', fontWeight: 'normal', whiteSpace: 'nowrap' }}>A to Z</span>
                                  <span style={{ fontSize: `${(isVertical ? 16 : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? 11 : 15) * sidebarIconSize}px`, display: 'block', lineHeight: '1', fontWeight: 'normal' }}>List</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center" style={{ paddingTop: (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? '16px' : (isVertical ? '4px' : '2px') }}>
                                  <Image
                                    src={
                                      category.id === 'move_ui'
                                        ? (panelPosition === 'left' ? sidebarShowIcon : panelPosition === 'right' ? sidebarShowIcon : panelPosition === 'bottom' ? sidebarHideIcon : sidebarShowIcon)
                                        : category.icon || ''
                                    }
                                    alt=""
                                    width={(isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? (category.id === 'reset' ? 38 : (category.id === 'images' ? 34 : (category.id === 'info' ? 34 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))) * sidebarIconSize}
                                    height={(isVertical ? (category.id === 'reset' ? 50 : (category.id === 'images' ? 38 : (category.id === 'info' ? 36 : 30))) : (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)) ? (category.id === 'reset' ? 38 : (category.id === 'images' ? 34 : (category.id === 'info' ? 34 : 30))) : (category.id === 'reset' ? 40 : (category.id === 'images' ? 36 : (category.id === 'info' ? 36 : 30)))) * sidebarIconSize}
                                    style={{
                                      filter: category.id === 'reset'
                                        ? (resetIconStyle === 'black-white' ? 'brightness(0) invert(1)' : 'brightness(0)')
                                        : (category.id === 'info' ? 'none' : 'brightness(0)'),
                                      ...(category.id === 'reset' ? {} : {}),
                                      ...(category.id === 'move_ui' ? {
                                        transform: isVertical
                                          ? (panelPosition === 'right' ? 'rotate(-90deg)' : 'rotate(0deg)')
                                          : (panelPosition === 'bottom' ? 'rotate(180deg) scaleX(-1)' : 'rotate(90deg)')
                                      } : {})
                                    }}
                                    className={`transition-all duration-300 ${selectedCategory === category.id
                                      ? ''
                                      : 'opacity-70 group-hover:opacity-100'
                                      }`}
                                  />
                                </div>
                              )}
                              {((isVertical || (!isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5))) && category.id !== 'reset') && (
                                <span
                                  className={`font-normal leading-tight text-center px-0.5 whitespace-pre-line opacity-100 break-words ${category.id === 'images' ? 'translate-y-[-2px]' : 'translate-y-0'}`}
                                  style={{
                                    color: '#000000',
                                    letterSpacing: '0.02em',
                                    fontSize: !isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5)
                                      ? `${11 * sidebarIconSize}px`
                                      : (isVertical ? '13px' : undefined),
                                    marginTop: !isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5) ? '10px' : (isVertical ? '2px' : undefined),
                                    paddingBottom: !isVertical && (sidebarIconSize === 1.3 || sidebarIconSize === 1.5) ? '16px' : '2px'
                                  }}
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
                                    className={`absolute top-0.5 right-0.5 flex gap-0.5 z-10`}
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
                        {isVertical && shouldPaginate && totalPages > 1 && (
                          <div className="flex flex-col items-center py-0.5 space-y-1.5 mt-0">
                            {/* Directional Arrow */}
                            <div className="flex flex-col items-center">
                              {currentPage < totalPages && (
                                <span
                                  className="text-[19px] font-black uppercase mb-0.5 opacity-90"
                                  style={{ color: currentTheme.text }}
                                >
                                  Next
                                </span>
                              )}
                              {currentPage === totalPages && (
                                <span
                                  className="text-[19px] font-black uppercase mb-0.5 opacity-90"
                                  style={{ color: currentTheme.text }}
                                >
                                  Previous
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (audioPingEnabled) playAudioPing('menu');
                                  if (currentPage < totalPages) {
                                    setCurrentPage(p => p + 1);
                                  } else {
                                    setCurrentPage(1);
                                  }
                                }}
                                className="flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                aria-label={currentPage < totalPages ? "Next Page" : "Previous Page"}
                              >
                                <Image
                                  src={paginationArrowIcon}
                                  alt=""
                                  width={45}
                                  height={12}
                                  className="transition-transform duration-300"
                                  style={{
                                    transform: currentPage < totalPages ? 'rotate(0deg)' : 'rotate(180deg)',
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


                </div>

                {/* Reset button area */}
                <div className={`flex ${isVertical ? 'mt-auto flex-col space-y-2 sm:space-y-3' : 'ml-auto flex-row space-x-5'} items-center flex-shrink-0`
                }>
                </div>
              </div>



              {selectedCategory && selectedCategory !== 'info' && (
                <>
                  <div
                    className={`accessibility-bar pointer-events-auto flex flex-col min-w-0 ${isVertical
                      ? 'relative flex-1 h-full'
                      : `fixed z-[2147483647] ${isMobile ? 'w-[calc(100vw-20px)] left-[10px]' : (selectedCategory === 'az' ? 'w-[min(680px,calc(100vw-40px))]' : 'w-[min(350px,calc(100vw-40px))]')} shadow-2xl rounded-none overflow-hidden animate-fade-in`
                      }`}
                    style={!isVertical ? {
                      left: isMobile ? '10px' : selectedCategory === 'az'
                        ? `${Math.max(10, Math.min(window.innerWidth - Math.min(690, window.innerWidth - 10), selectedOffset - 340))}px`
                        : `${Math.max(10, Math.min(window.innerWidth - Math.min(360, window.innerWidth - 10), selectedOffset - 175))}px`,
                      [panelPosition === 'bottom' ? 'bottom' : 'top']: `${80 * sidebarIconSize + 36 + (isMobile ? 10 : 20)}px`,
                      background: `linear-gradient(135deg, ${currentTheme.background}F2, ${currentTheme.background}E6)`, // Increased opacity slightly since blur is gone
                      borderTop: `4px solid ${currentTheme.border}4D`,
                      borderBottom: `4px solid ${currentTheme.border}4D`,
                      borderLeft: `4px solid ${currentTheme.border}4D`,
                      borderRight: `4px solid ${currentTheme.border}4D`,
                      maxHeight: isMobile ? '70vh' : 'min(700px, 75vh)',
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
                      <div className="flex items-center justify-between mb-4 pt-2">
                        <div className="flex items-center gap-3 pt-1">
                          <div
                            className={`flex ${selectedCategory === 'az' ? 'h-9 w-9' : 'h-10 w-10'} flex-shrink-0 items-center justify-center rounded-xl overflow-hidden`}
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
                              <div className="flex flex-col items-center justify-center leading-none gap-0.5" style={{ color: '#000000', width: '100%', height: '100%', padding: '1px' }}>
                                <span style={{ fontSize: '10px', display: 'block', lineHeight: '1', fontWeight: 'normal', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'clip' }}>A to Z</span>
                                <span style={{ fontSize: '10px', display: 'block', lineHeight: '1', fontWeight: 'normal', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'clip' }}>List</span>
                              </div>
                            ) : (
                              <Image
                                src={
                                  categories.find((c) => c.id === selectedCategory)
                                    ?.icon || ''
                                }
                                alt=""
                                width={selectedCategory === 'position' ? 22 : 28}
                                height={selectedCategory === 'position' ? 22 : 28}
                                className={`${selectedCategory === 'speech' ? '' : 'brightness-0'} ${selectedCategory === 'position' ? '' : 'translate-y-1'}`}
                              />
                            )}
                          </div>
                          <div className="flex flex-col pt-1">
                            <h2
                              className={`${selectedCategory === 'az' ? 'text-[32px]' : 'text-[26px]'} font-extrabold tracking-tight leading-[1.1] mt-2 sm:mt-[12px] ${selectedCategory === 'az' ? 'whitespace-nowrap' : (['font', 'layout', 'reading', 'ai'].includes(selectedCategory || '')
                                ? 'whitespace-nowrap max-w-[180px] sm:max-w-[240px]'
                                : 'whitespace-normal line-clamp-2 max-w-[180px] sm:max-w-[240px]'
                              )}`}
                              style={{ color: currentTheme.text }}
                            >
                              {selectedCategory === 'az' ? 'A to Z List' : selectedCategory === 'feedback' ? 'Toolbar Feedback' : selectedCategory === 'info' ? 'Information' : (() => {
                                const categoryName = categories.find((c) => c.id === selectedCategory)?.name || '';
                                // Split camelCase words (e.g., KeyboardShortcuts -> Keyboard Shortcuts)
                                const withSpaces = categoryName.replace(/([a-z])([A-Z])/g, '$1 $2');
                                return withSpaces.replace(/\n/g, ' ').toLowerCase().split(' ').map(word => {
                                  // Handle AI specifically
                                  if (word === 'ai') return 'AI';
                                  // Handle words with slashes
                                  return word.split('/').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('/');
                                }).join(' ');
                              })()}
                            </h2>
                          </div>
                        </div>
                        <button
                          onMouseEnter={() => {
                            // Speak "Exit" when cursor hovers over close button
                            if (textToSpeech) {
                              speak('Exit', ttsVoiceGender);
                            }
                          }}
                          onClick={() => {
                            if (audioPingEnabled) playAudioPing('menu');
                            // Speak "Exit" when close button is clicked (only if TTS is enabled)
                            if (textToSpeech) {
                              speak('Exit', ttsVoiceGender);
                            }
                            setSelectedCategory(null);
                          }}
                          className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-2 rounded-none transition-all hover:bg-black/10 z-10 m-0"
                          style={{ color: currentTheme.text, margin: 0 }}
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
                          <span className="text-base font-semibold tracking-wide">Close</span>
                        </button>
                      </div>

                    </div>

                    <div
                      ref={categoryContentRef}
                      data-category-content
                      className={`${isVertical ? 'flex-1' : (selectedCategory === 'az' ? 'h-[70vh] sm:h-[600px] max-h-[80vh]' : 'h-auto max-h-full')} ${selectedCategory === 'az' ? 'overflow-hidden p-0' : 'overflow-y-auto p-4 sm:p-6'} overflow-x-hidden custom-scrollbar min-w-0 break-words`}
                      style={{ marginTop: 0, paddingTop: selectedCategory === 'az' ? '0' : undefined }}
                    >
                      {renderCategoryContent()}
                    </div>

                    {/* Scroll Hint */}

                  </div>

                  {/* Indicator Arrow */}
                  {!isVertical && !isMobile && (
                    <div
                      className="fixed pointer-events-none"
                      style={{
                        left: `${selectedOffset - 15}px`,
                        [panelPosition === 'bottom' ? 'bottom' : 'top']: `${80 * sidebarIconSize + 36 + (isMobile ? 10 : 20) + (panelPosition === 'bottom' ? 14 : -5)}px`,
                        zIndex: 2147483651,
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
                </>
              )}
            </div>
          </div >
        </>
      )
      }


      {/* Reset Popup Overlay */}
      {
        showResetConfirm && (
          <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483647] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setShowResetConfirm(false);
                setTimeout(() => setShowActiveFeaturesList(false), 300);
              }}
            />
            <div
              className="relative w-full max-w-2xl rounded-[40px] overflow-hidden border-4 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
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
                        resetIconStyle === 'turquoise-black' ? '#17D1C6' :
                          resetIconStyle === 'white-black' ? '#FFFFFF' :
                            resetIconStyle === 'black-white' ? '#000000' :
                              resetIconStyle === 'pink-white' ? '#EC4899' :
                                currentTheme.background,
                    backdropFilter: 'blur(10px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                    color: (resetIconStyle === 'white-black' || resetIconStyle === 'yellow-black' || resetIconStyle === 'turquoise-black') ? '#000000' : '#FFFFFF',
                    border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.3)' : '4px solid rgba(255,255,255,0.3)',
                    boxShadow: 'none'
                  }}
                >
                  <Image
                    src={resetIcon}
                    alt=""
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                    className={`transition-transform ${(resetIconStyle === 'white-black' || resetIconStyle === 'yellow-black' || resetIconStyle === 'turquoise-black') ? 'brightness(0)' : 'brightness(0) invert'}`}
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
                    {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'position'].map((catId) => {
                      const features = getActiveFeaturesWithActions(catId);
                      if (features.length === 0) return null;
                      return (
                        <div key={catId} className="contents">
                          {features.map((feature, idx) => (
                            <div
                              key={`${catId}-${idx}`}
                              className="px-3 py-1.5 rounded-full shadow-sm border font-bold text-[18px] whitespace-nowrap flex items-center gap-2 animate-in zoom-in-50 duration-200"
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
                    {['font', 'contrast', 'reading', 'layout', 'cursor', 'images', 'speech', 'language', 'position'].every(catId => getActiveFeaturesWithActions(catId).length === 0) && (
                      <span className="text-sm opacity-60">No active features to reset.</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (audioPingEnabled) playAudioPing('menu');
                      setShowResetConfirm(false);
                      setTimeout(() => setShowActiveFeaturesList(false), 300);
                    }}
                    className="mt-6 px-12 py-3.5 rounded-2xl text-[26px] font-black uppercase tracking-widest transition-all border-2"
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
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl hover:bg-black/5 transition-colors opacity-40 hover:opacity-100 z-10"
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

      {/* Sidebar Tutorial Popup - Removed as per user request */}

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



      {/* First Time Text to Speech Popup */}
      {
        showFirstTimeTtsPopup && (
          <div className="accessibility-bar pointer-events-auto fixed inset-0 z-[2147483649] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                // Don't allow closing by clicking outside on first time
              }}
            />
            <div
              className="relative rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg w-full m-4 z-10 animate-scale-up border-[4px] sm:border-[6px] max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                borderColor: currentTheme.border
              }}
            >
              <div className="text-center w-full mb-6">
                <div className="flex flex-col items-center justify-center mb-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-xl mb-4 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, #FFD700, #E6C200)`,
                      backdropFilter: 'blur(10px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                      border: barTheme === 'white' ? '4px solid rgba(0,0,0,0.3)' : '4px solid rgba(255,255,255,0.3)',
                      boxShadow: 'none'
                    }}
                  >
                    <Image
                      src={speakIcon}
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain brightness-0"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black leading-tight">
                    Text to Speech support is on by default. Would you like to?
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                  <button
                    onClick={() => {
                      // Keep it on - close the popup
                      setShowFirstTimeTtsPopup(false);
                    }}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-lg sm:text-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 border-2"
                    style={{
                      backgroundColor: currentTheme.active,
                      color: currentTheme.text,
                      borderColor: currentTheme.border
                    }}
                  >
                    Keep it on
                  </button>
                  <button
                    onClick={() => {
                      // Switch off Text to Speech - close the popup
                      setTextToSpeech?.(false);
                      setShowFirstTimeTtsPopup(false);
                    }}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-lg sm:text-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 border-2"
                    style={{
                      backgroundColor: currentTheme.active,
                      color: currentTheme.text,
                      borderColor: currentTheme.border
                    }}
                  >
                    Switch it off
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }


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
        .icons-scroll-hidden::-webkit-scrollbar {
          display: none !important;
        }
        .icons-scroll-hidden {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      <VisualConfirmation />
    </>
  );
}
