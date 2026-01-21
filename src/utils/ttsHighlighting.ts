

let currentHighlightSpan: HTMLSpanElement | null = null;
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
    

    if (isEmbedMode()) {
        
        const accessibleContent = htmlElement.closest('#accessible-content');
        if (!accessibleContent) {
            
            return false;
        }
    }
    
    return true;
};

export function clearAllHighlights(immediate: boolean = false) {
    if (currentHighlightSpan) {
        try {
            currentHighlightSpan.classList.remove('tts-highlight-current');
            if (!immediate) {
                currentHighlightSpan.classList.add('tts-highlight');
            }
            currentHighlightSpan = null;
        } catch (e) {
        
        }
    }

  
    const clearHighlights = () => {
        const clearInDocument = (doc: Document | ShadowRoot) => {
            const allHighlights = (doc as any).querySelectorAll
                ? (doc as any).querySelectorAll('.tts-highlight, .tts-highlight-current')
                : [];
            allHighlights.forEach((span: HTMLElement) => {
                const element = span as HTMLElement;
              
                element.style.transition = 'opacity 0.3s ease-out';
                element.style.opacity = '0';

                setTimeout(() => {
                    const parent = element.parentNode;
                    if (parent && element.textContent) {
                        const textNode = document.createTextNode(element.textContent);
                    
                        parent.replaceChild(textNode, element);
                        parent.normalize();
                    }
                }, 300);
            });
        };

        
        clearInDocument(document);

   
        document.querySelectorAll('*').forEach(el => {
            const root = el.getRootNode();
            if (root instanceof ShadowRoot) {
                clearInDocument(root);
            }
        });

    };

    if (immediate) {
        clearHighlights();
    } else {
        setTimeout(clearHighlights, 500);
    }
}

// Helper to apply highlight styles inline (essential for embed/shadow DOM where global CSS might not apply)
const applyHighlightStyles = (span: HTMLElement, isCurrent: boolean) => {
    span.style.backgroundColor = isCurrent ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 255, 0, 0.5)';
    span.style.outline = isCurrent ? '3px solid #FFA500' : '2px solid #FFD700';
    span.style.outlineOffset = '2px';
    span.style.borderRadius = '3px';
    span.style.transition = 'all 0.2s ease';
    // Don't change font-weight to preserve original text style
    // Ensure visibility
    span.style.display = 'inline';
    span.style.position = 'relative';
    span.style.zIndex = '2147483647'; // Max z-index
};

// Scroll into view with embed mode support and visibility check
const scrollIntoViewSafely = (element: HTMLElement) => {
    // Don't scroll in embed mode to avoid unnecessary scrolling
    if (isEmbedMode()) {
        return;
    }
    
    try {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        // Define "safe area" (padding) to determine if scroll is needed
        // We only want to scroll if the element is OUTSIDE this safe area
        const padding = 50;

        const isAbove = rect.top < padding;
        const isBelow = rect.bottom > (viewportHeight - padding);
        const isLeft = rect.left < padding;
        const isRight = rect.right > (viewportWidth - padding);

        // Only scroll if actually necessary (element is not comfortably visible)
        if (isAbove || isBelow || isLeft || isRight) {
            // Only scroll within current window/document - don't scroll parent window in embed mode
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    } catch (e) {
        // Fallback to simple scrollIntoView
        try {
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch (e2) {
            // Ignore
        }
    }
};

export function highlightSelectedText() {
    // Only check current window/document - don't access parent window in embed mode
    let selection = window.getSelection();
    let doc = document;

    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
        return null;
    }

    // Check if we're allowed to modify the selected element
    const startContainer = range.startContainer;
    if (!isElementAllowedForModification(startContainer)) {
        // Selection is not within allowed scope, don't modify
        return null;
    }

    // Clear previous highlights
    clearAllHighlights();
    selectedTextRange = range.cloneRange();

    try {
        // Wrap the selected text in a highlight span
        const contents = range.extractContents();
        const span = doc.createElement('span'); // Use correct document
        span.className = 'tts-highlight-current';
        applyHighlightStyles(span, true); // Inline styles

        // Move contents to span
        const fragment = doc.createDocumentFragment(); // Use correct document
        while (contents.firstChild) {
            fragment.appendChild(contents.firstChild);
        }
        span.appendChild(fragment);

        range.insertNode(span);
        currentHighlightSpan = span;

        // Scroll into view
        scrollIntoViewSafely(span);

        return span;
    } catch (e) {
        console.warn('Error highlighting selection:', e);
        return null;
    }
}

export function highlightWord(text: string, container: HTMLElement, charIndex: number): HTMLSpanElement | null {
    // Clear previous current highlight - remove it completely instead of keeping it highlighted
    if (currentHighlightSpan) {
        try {
            const parent = currentHighlightSpan.parentNode;
            if (parent && currentHighlightSpan.textContent) {
                const textNode = document.createTextNode(currentHighlightSpan.textContent);
                // Try to use correct document scope
                // const doc = parent.ownerDocument || document;
                // const textNode = doc.createTextNode(currentHighlightSpan.textContent);
                parent.replaceChild(textNode, currentHighlightSpan);
                parent.normalize();
            }
            currentHighlightSpan = null;
        } catch (e) {
            // Ignore
        }
    }

    // Find the word bound at charIndex
    let start = 0;
    let end = 0;
    let foundWord = '';

    // Simple word boundary check (same as before)
    const boundaryRegex = /\s|[.,!?;:()\[\]"']/;

    // Find start of word
    for (let i = charIndex; i >= 0; i--) {
        if (boundaryRegex.test(text[i])) {
            start = i + 1;
            break;
        }
        if (i === 0) start = 0;
    }

    // Find end of word
    for (let i = charIndex; i < text.length; i++) {
        if (boundaryRegex.test(text[i])) {
            end = i;
            break;
    }
        if (i === text.length - 1) end = text.length;
    }

    foundWord = text.substring(start, end).trim();
    if (!foundWord) return null;

    // Find the word in the document - work with both regular DOM and embed/shadow DOM
    const searchInContainer = (searchContainer: HTMLElement | Document | ShadowRoot): HTMLSpanElement | null => {
        const rootElement = (searchContainer as Document).body || (searchContainer as ShadowRoot).host || (searchContainer as HTMLElement);
        if (!rootElement) return null;

        // Determine the correct document context
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
                    // Skip already highlighted elements
                    if (parent.classList?.contains('tts-highlight') || parent.classList?.contains('tts-highlight-current')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        // Count characters as we walk through the DOM to match charIndex
        let domCharIndex = 0;
        let node: Node | null;
        while ((node = walker.nextNode())) {
            const nodeText = node.textContent || '';
            if (!nodeText || nodeText.trim().length === 0) continue;

            // Check if charIndex falls within this node's text range
            const nodeStartIndex = domCharIndex;
            const nodeEndIndex = domCharIndex + nodeText.length;

            if (charIndex >= nodeStartIndex && charIndex < nodeEndIndex) {
                // charIndex is in this node, find the word at the relative position
                const relativeCharIndex = charIndex - nodeStartIndex;
                
                // Find word boundaries within this node
                let wordStart = relativeCharIndex;
                let wordEnd = relativeCharIndex;
                const boundaryRegex = /\s|[.,!?;:()\[\]"']/;

                // Find start of word
                for (let i = relativeCharIndex; i >= 0; i--) {
                    if (boundaryRegex.test(nodeText[i])) {
                        wordStart = i + 1;
                        break;
                    }
                    if (i === 0) wordStart = 0;
                }

                // Find end of word
                for (let i = relativeCharIndex; i < nodeText.length; i++) {
                    if (boundaryRegex.test(nodeText[i])) {
                        wordEnd = i;
                        break;
                    }
                    if (i === nodeText.length - 1) wordEnd = nodeText.length;
                }

                const wordText = nodeText.substring(wordStart, wordEnd).trim();
                if (wordText && wordText.toLowerCase() === foundWord.toLowerCase()) {
                    // Check if we're allowed to modify this element
                    if (!isElementAllowedForModification(node)) {
                        // Skip this node if it's not within allowed scope
                        continue;
                    }
                    
                    try {
                        const range = doc.createRange();
                        range.setStart(node, wordStart);
                        range.setEnd(node, wordEnd);

                    // Extract and wrap in highlight span
                    const contents = range.extractContents();
                        const span = doc.createElement('span');
                    span.className = 'tts-highlight-current';
                        applyHighlightStyles(span, true);

                        const fragment = doc.createDocumentFragment();
                    while (contents.firstChild) {
                        fragment.appendChild(contents.firstChild);
                    }
                    span.appendChild(fragment);

                    range.insertNode(span);
                    currentHighlightSpan = span;

                        scrollIntoViewSafely(span);

                    return span;
                } catch (e) {
                    console.warn('Error highlighting word:', e);
                    continue;
                }
            }
            }

            // Update character index for next node
            domCharIndex += nodeText.length;
        }
        return null;
    };

    // Try container first (most specific)
    if (container) {
        // If container is a document or ShadowRoot, handle accordingly
        if (container.nodeType === Node.DOCUMENT_NODE || container instanceof ShadowRoot) {
            const result = searchInContainer(container as any);
            if (result) return result;
        } else {
            // It's an element
            const shadowRoot = container.getRootNode();
            if (shadowRoot instanceof ShadowRoot) {
                const result = searchInContainer(shadowRoot);
                if (result) return result;
            } else {
                // Try searching within the container itself or its owner document
        const result = searchInContainer(container);
        if (result) return result;
            }
        }
    }

    // Fallback to main document (or correct parent document if in embed)
    return searchInContainer(document);
}

export function highlightSentence(text: string, container: HTMLElement, sentenceIndex: number = 0): HTMLSpanElement | null {
    // Clear previous current highlight - remove it completely instead of keeping it highlighted
    if (currentHighlightSpan) {
        try {
            const parent = currentHighlightSpan.parentNode;
            if (parent && currentHighlightSpan.textContent) {
                const textNode = document.createTextNode(currentHighlightSpan.textContent);
                parent.replaceChild(textNode, currentHighlightSpan);
                parent.normalize();
            }
            currentHighlightSpan = null;
        } catch (e) {
            // Ignore
        }
    }

    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

    if (sentenceIndex >= sentences.length) {
        return null;
    }

    const targetSentence = sentences[sentenceIndex].trim();
    if (!targetSentence) {
        return null;
    }

    // Build accumulated text up to this sentence to find position
    let accumulatedText = '';
    for (let i = 0; i < sentenceIndex; i++) {
        accumulatedText += sentences[i];
    }

    // Find the sentence in the document using a more robust approach
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
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    // Try to find sentence by matching first few words
    const sentenceWords = targetSentence.split(/\s+/).slice(0, 3).join(' ').toLowerCase();

    let node: Node | null;
    while ((node = walker.nextNode())) {
        const nodeText = node.textContent || '';
        const lowerText = nodeText.toLowerCase();
        const index = lowerText.indexOf(sentenceWords);

        if (index !== -1) {
            
            if (!isElementAllowedForModification(node)) {
            
                continue;
            }
            
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

                const contents = range.extractContents();
                const span = doc.createElement('span'); 
                span.className = 'tts-highlight-current';
                applyHighlightStyles(span, true); 

                const fragment = doc.createDocumentFragment(); 
                while (contents.firstChild) {
                    fragment.appendChild(contents.firstChild);
                }
                span.appendChild(fragment);

                range.insertNode(span);
                currentHighlightSpan = span;

                scrollIntoViewSafely(span);

                return span;
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
        const highlightSpan = highlightSelectedText();
        if (!highlightSpan) {
            
            highlightSentence(text, container, 0);
        }
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
            
            if (event.name === 'word' && event.charIndex !== undefined) {
                
                if (event.charIndex >= lastProcessedCharIndex) {
                    lastProcessedCharIndex = event.charIndex;
                
                if (currentHighlightSpan) {
                    try {
                        const parent = currentHighlightSpan.parentNode;
                        if (parent && currentHighlightSpan.textContent) {
                            const textNode = document.createTextNode(currentHighlightSpan.textContent);
                            parent.replaceChild(textNode, currentHighlightSpan);
                            parent.normalize();
                        }
                        currentHighlightSpan = null;
                    } catch (e) {
                        // Ignore
                    }
                }
                highlightWord(text, container, event.charIndex);
                }
            } else if (currentHighlightSpan) {
                scrollIntoViewSafely(currentHighlightSpan);
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
        }, 1000);
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
