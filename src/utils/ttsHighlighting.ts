
// Initialize CSS Highlight API styles
// Initialize CSS Highlight API styles
export const injectHighlightStyles = () => {
    if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
        // Check if styles check already exists to avoid duplicates
        if (document.head.querySelector('#tts-highlight-styles')) return;

        try {
            const style = document.createElement('style');
            style.id = 'tts-highlight-styles';
            style.textContent = `
                ::highlight(tts-active) {
                    background-color: #FFD700 !important;
                    color: #000000 !important;
                }
                ::highlight(tts-background) {
                    background-color: rgba(255, 255, 0, 0.25) !important;
                }
            `;
            document.head.appendChild(style);
        } catch (e) {
            console.warn('Failed to inject TTS highlight styles', e);
        }
    }
};

// Auto-inject on import
if (typeof document !== 'undefined') {
    injectHighlightStyles();
}

// Global highlight state
let currentHighlightRange: Range | null = null;
let currentSentenceRange: Range | null = null;
let selectedTextRange: Range | null = null;

const isEmbedMode = (): boolean => {
    try {
        return !!(
            document.getElementById('a11y-embed-host-react') ||
            document.querySelector('.a11y-embed-host') ||
            (window.parent && window.parent !== window && document.querySelector('[class*="a11y-embed"]'))
        );
    } catch (e) {
        return false;
    }
};

const isElementAllowedForModification = (element: Node | HTMLElement): boolean => {
    if (!element) return false;

    const htmlElement = element.nodeType === Node.TEXT_NODE
        ? (element.parentElement as HTMLElement)
        : (element as HTMLElement);

    if (!htmlElement) return false;


    if (htmlElement.closest('.accessibility-bar') || htmlElement.closest('.a11y-embed-host')) {
        return false;
    }

    // Check for invisible parents
    const style = window.getComputedStyle(htmlElement);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
    }

    return true;
};

export function clearAllHighlights(immediate: boolean = false) {
    // Clear ranges
    currentHighlightRange = null;
    currentSentenceRange = null;

    const clearAPI = () => {
        if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
            CSS.highlights.delete('tts-active');
            CSS.highlights.delete('tts-background');
        }
    };

    if (immediate) {
        clearAPI();
    } else {
        // Debounce slightly to prevent flicker
        setTimeout(clearAPI, 50);
    }
}

// Scroll into view logic (same as before but takes a Range or Element)
const scrollIntoViewSafely = (target: HTMLElement | Range) => {
    try {
        let element: HTMLElement;
        let rect: DOMRect;

        if (target instanceof Range) {
            element = target.commonAncestorContainer.parentElement as HTMLElement;
            rect = target.getBoundingClientRect();
        } else {
            element = target;
            rect = element.getBoundingClientRect();
        }

        if (!element) return;

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        // Use 30% of viewport to keep content nicely centered
        const padding = Math.min(viewportHeight * 0.3, 200);

        const isAbove = rect.top < padding;
        const isBelow = rect.bottom > (viewportHeight - padding);
        const isLeft = rect.left < 50;
        const isRight = rect.right > (viewportWidth - 50);

        if (isAbove || isBelow || isLeft || isRight) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    } catch (e) {
        // Ignore
    }
};

export function highlightSelectedText() {
    let selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
        return null;
    }

    // Validation (optional, but good)
    const startContainer = range.startContainer;
    if (!isElementAllowedForModification(startContainer)) {
        return null;
    }

    // Clear previous
    clearAllHighlights(true); // Immediate clear to avoid overlap
    selectedTextRange = range.cloneRange();
    currentSentenceRange = selectedTextRange;

    // Register highlight
    if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
        const highlight = new Highlight(selectedTextRange);
        CSS.highlights.set('tts-background', highlight);
    }

    // Scroll
    scrollIntoViewSafely(selectedTextRange);

    // Return a dummy element if needed by caller, or refactor caller.
    // The previous caller expected a span to use as a container.
    // We can return the common ancestor container parent.
    return range.commonAncestorContainer.parentElement as HTMLElement;
}

export function highlightWord(text: string, container: HTMLElement, charIndex: number): HTMLElement | null {
    // Clear previous active word
    currentHighlightRange = null;
    if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
        CSS.highlights.delete('tts-active');
    }

    // Find the word bound at charIndex
    let start = 0;
    let end = 0;
    let foundWord = '';

    const boundaryRegex = /\s|[.,!?;:()\[\]"']/;

    for (let i = charIndex; i >= 0; i--) {
        if (boundaryRegex.test(text[i])) {
            start = i + 1;
            break;
        }
        if (i === 0) start = 0;
    }

    for (let i = charIndex; i < text.length; i++) {
        if (boundaryRegex.test(text[i])) {
            end = i;
            break;
        }
        if (i === text.length - 1) end = text.length;
    }

    foundWord = text.substring(start, end).trim();
    if (!foundWord) return null;

    if (/^[.,!?;:()\[\]"']+$/.test(foundWord)) return null;

    // Search for the word in the DOM
    // ... Copy the search logic but create a RANGE instead of a SPAN ...

    const searchInContainer = (searchContainer: HTMLElement | Document | ShadowRoot): HTMLElement | null => {
        const rootElement = (searchContainer as Document).body || (searchContainer as ShadowRoot).host || (searchContainer as HTMLElement);
        if (!rootElement) return null;

        const doc = rootElement.ownerDocument || document;
        const walker = doc.createTreeWalker(
            rootElement as HTMLElement,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    if (parent.closest('.accessibility-bar') || parent.closest('.a11y-embed-host')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (parent) {
                        const style = window.getComputedStyle(parent);
                        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let domCharIndex = 0;
        let node: Node | null;
        while ((node = walker.nextNode())) {
            const nodeText = node.textContent || '';
            if (!nodeText || nodeText.trim().length === 0) continue;

            const nodeStartIndex = domCharIndex;
            const nodeEndIndex = domCharIndex + nodeText.length;

            if (charIndex >= nodeStartIndex && charIndex < nodeEndIndex) {
                const relativeCharIndex = charIndex - nodeStartIndex;

                let wordStart = relativeCharIndex;
                let wordEnd = relativeCharIndex;
                const boundaryRegex = /\s|[.,!?;:()\[\]"']/;

                for (let i = relativeCharIndex; i >= 0; i--) {
                    if (boundaryRegex.test(nodeText[i])) {
                        wordStart = i + 1;
                        break;
                    }
                    if (i === 0) wordStart = 0;
                }
                for (let i = relativeCharIndex; i < nodeText.length; i++) {
                    if (boundaryRegex.test(nodeText[i])) {
                        wordEnd = i;
                        break;
                    }
                    if (i === nodeText.length - 1) wordEnd = nodeText.length;
                }

                const wordText = nodeText.substring(wordStart, wordEnd).trim();

                if (wordText && wordText.toLowerCase() === foundWord.toLowerCase()) {
                    try {
                        const range = doc.createRange();
                        range.setStart(node, wordStart);
                        range.setEnd(node, wordEnd);

                        currentHighlightRange = range;

                        if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
                            const highlight = new Highlight(range);
                            CSS.highlights.set('tts-active', highlight);
                        }

                        scrollIntoViewSafely(range);
                        return range.commonAncestorContainer.parentElement as HTMLElement;
                    } catch (e) {
                        continue;
                    }
                }
            }
            domCharIndex += nodeText.length;
        }
        return null;
    };

    if (container) {
        if (container.nodeType === Node.DOCUMENT_NODE || container instanceof ShadowRoot) {
            const result = searchInContainer(container as any);
            if (result) return result;
        } else {
            const shadowRoot = container.getRootNode();
            if (shadowRoot instanceof ShadowRoot) {
                const result = searchInContainer(shadowRoot);
                if (result) return result;
            } else {
                const result = searchInContainer(container);
                if (result) return result;
            }
        }
    }
    return searchInContainer(document);
}


export function highlightSentence(text: string, container: HTMLElement, sentenceIndex: number = 0): HTMLElement | null {
    currentSentenceRange = null;
    // Don't clear active word here, just sentence background? 
    // Actually speakWithHighlighting clears everything first usually.

    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

    if (sentenceIndex >= sentences.length) {
        return null;
    }

    const targetSentence = sentences[sentenceIndex].trim();
    if (!targetSentence) {
        return null;
    }

    const doc = container.ownerDocument || document;
    const walker = doc.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (parent?.closest('.accessibility-bar') || parent?.closest('.a11y-embed-host')) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent) {
                    const style = window.getComputedStyle(parent);
                    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const sentenceWords = targetSentence.split(/\s+/).slice(0, 3).join(' ').toLowerCase();

    let node: Node | null;
    while ((node = walker.nextNode())) {
        const nodeText = node.textContent || '';
        const lowerText = nodeText.toLowerCase();
        const index = lowerText.indexOf(sentenceWords);

        if (index !== -1) {
            try {
                let endIndex = index + sentenceWords.length;
                let sentenceEnd = endIndex;

                for (let i = endIndex; i < Math.min(endIndex + 200, nodeText.length); i++) {
                    if (/[.!?]/.test(nodeText[i])) {
                        sentenceEnd = i + 1;
                        break;
                    }
                }

                const range = doc.createRange();
                range.setStart(node, index);
                range.setEnd(node, Math.min(sentenceEnd, index + targetSentence.length));

                currentSentenceRange = range;
                if (typeof CSS !== 'undefined' && 'highlights' in CSS) {
                    const highlight = new Highlight(range);
                    CSS.highlights.set('tts-background', highlight);
                }

                scrollIntoViewSafely(range);
                return range.commonAncestorContainer.parentElement as HTMLElement;
            } catch (e) {
                console.warn('Error highlighting sentence:', e);
            }
        }
    }
    return null;
}

export function speakWithHighlighting(
    text: string,
    container: HTMLElement,
    options: {
        rate?: number;
        pitch?: number;
        voice?: SpeechSynthesisVoice;
        onEnd?: () => void;
        onError?: (error: Error) => void;
        isSelectedText?: boolean;
    } = {}
): () => void {
    if (!window.speechSynthesis) {
        options.onError?.(new Error('Speech synthesis not supported'));
        return () => { };
    }

    clearAllHighlights();

    if (options.isSelectedText) {
        highlightSelectedText();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
    if (options.voice) {
        utterance.voice = options.voice;
    }

    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    let currentSentenceIndex = 0;
    let accumulatedText = '';
    let lastProcessedCharIndex = -1;

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (options.isSelectedText) {
            // For selected text, we assume the selection is already highlighted as background
            // We just overlay the active word
            if (event.name === 'word' && event.charIndex !== undefined) {
                if (event.charIndex >= lastProcessedCharIndex) {
                    lastProcessedCharIndex = event.charIndex;
                    highlightWord(text, container, event.charIndex);
                }
            } else if (currentHighlightRange) {
                // Scroll to active word
                scrollIntoViewSafely(currentHighlightRange);
            }
        } else if (event.name === 'word' || event.name === 'sentence') {
            if (!options.isSelectedText && event.charIndex !== undefined) {
                const charIndex = event.charIndex;

                if (charIndex >= lastProcessedCharIndex) {
                    lastProcessedCharIndex = charIndex;

                    if (event.name === 'word') {
                        highlightWord(text, container, charIndex);
                    } else if (event.name === 'sentence') {
                        accumulatedText = text.substring(0, charIndex);
                        let currentSentenceEnd = 0;
                        for (let i = 0; i < sentences.length; i++) {
                            currentSentenceEnd += sentences[i].length;
                            if (charIndex <= currentSentenceEnd) {
                                if (i !== currentSentenceIndex) {
                                    currentSentenceIndex = i;
                                    highlightSentence(text, container, currentSentenceIndex);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    if (!options.isSelectedText && sentences.length > 0) {
        highlightSentence(text, container, 0);
    }

    utterance.onend = () => {
        setTimeout(() => {
            clearAllHighlights();
        }, 100);
        options.onEnd?.();
    };

    utterance.onerror = (event: any) => {
        clearAllHighlights();
        options.onError?.(new Error(`Speech synthesis error: ${event.message || 'Unknown error'}`));
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
        window.speechSynthesis.cancel();
        clearAllHighlights();
    };
}

let syncAnimationId: number | null = null;

export function stopAIHighlightingSync() {
    if (syncAnimationId !== null) {
        cancelAnimationFrame(syncAnimationId);
        syncAnimationId = null;
    }
}

export function startAIHighlightingSync(
    audio: HTMLAudioElement,
    text: string,
    container: HTMLElement,
    speed: number = 1.0
) {
    stopAIHighlightingSync();
    clearAllHighlights();

    // Map characters to "weight" (perceived duration)
    const weights: number[] = [];
    let totalWeight = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let weight = 1;

        if (char === '.' || char === '!' || char === '?') {
            weight = 25;
        } else if (char === ',') {
            weight = 15;
        } else if (char === ';' || char === ':') {
            weight = 10;
        } else if (/\s/.test(char)) {
            weight = 2.5;
        }

        weights.push(weight);
        totalWeight += weight;
    }

    const cumulativeWeights: number[] = [];
    let currentSum = 0;
    for (const w of weights) {
        currentSum += w;
        cumulativeWeights.push(currentSum);
    }

    let lastWordIndex = -1;
    const baseWeightPerSecond = 18;

    const update = () => {
        if (!audio.paused && !audio.ended) {
            let progress = 0;

            if (isFinite(audio.duration) && audio.duration > 0) {
                progress = audio.currentTime / audio.duration;
            } else {
                const estimatedTotalDuration = totalWeight / (baseWeightPerSecond * speed);
                progress = audio.currentTime / estimatedTotalDuration;
                if (progress > 0.99) progress = 0.99;
            }

            const targetWeight = progress * totalWeight;

            let charIndex = 0;
            for (let i = 0; i < cumulativeWeights.length; i++) {
                if (cumulativeWeights[i] >= targetWeight) {
                    charIndex = i;
                    break;
                }
            }

            if (charIndex !== lastWordIndex) {
                lastWordIndex = charIndex;
                highlightWord(text, container, charIndex);
            }
        }

        if (audio.ended) {
            stopAIHighlightingSync();
            setTimeout(() => clearAllHighlights(), 100);
            return;
        }

        syncAnimationId = requestAnimationFrame(update);
    };

    audio.addEventListener('play', () => {
        syncAnimationId = requestAnimationFrame(update);
    }, { once: true });

    audio.addEventListener('pause', () => stopAIHighlightingSync());
    audio.addEventListener('ended', () => stopAIHighlightingSync());

    if (!audio.paused) {
        syncAnimationId = requestAnimationFrame(update);
    }
}
