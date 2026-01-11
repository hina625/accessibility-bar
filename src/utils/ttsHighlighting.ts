// TTS Highlighting Utility - Sentence/Word highlighting

let currentHighlightSpan: HTMLSpanElement | null = null;
let selectedTextRange: Range | null = null;

export function clearAllHighlights(immediate: boolean = false) {
    if (currentHighlightSpan) {
        try {
            currentHighlightSpan.classList.remove('tts-highlight-current');
            if (!immediate) {
                currentHighlightSpan.classList.add('tts-highlight');
            }
            currentHighlightSpan = null;
        } catch (e) {
            // Ignore errors
        }
    }

    // Clear all highlight spans - use fade out animation instead of immediate removal
    // Also check in shadow DOM/embed contexts
    const clearHighlights = () => {
        const clearInDocument = (doc: Document | ShadowRoot) => {
            const allHighlights = (doc as any).querySelectorAll
                ? (doc as any).querySelectorAll('.tts-highlight, .tts-highlight-current')
                : [];
            allHighlights.forEach((span: HTMLElement) => {
                const element = span as HTMLElement;
                // Fade out before removing
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

        // Clear in main document
        clearInDocument(document);

        // Clear in shadow roots
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

export function highlightSelectedText() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
        return null;
    }

    // Clear previous highlights
    clearAllHighlights();
    selectedTextRange = range.cloneRange();

    try {
        // Wrap the selected text in a highlight span
        const contents = range.extractContents();
        const span = document.createElement('span');
        span.className = 'tts-highlight-current';

        // Move contents to span
        const fragment = document.createDocumentFragment();
        while (contents.firstChild) {
            fragment.appendChild(contents.firstChild);
        }
        span.appendChild(fragment);

        range.insertNode(span);
        currentHighlightSpan = span;

        // Scroll into view
        span.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

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
                parent.replaceChild(textNode, currentHighlightSpan);
                parent.normalize();
            }
            currentHighlightSpan = null;
        } catch (e) {
            // Ignore
        }
    }

    // Find the word at charIndex in the text by looking for word boundaries
    let wordStart = charIndex;
    let wordEnd = charIndex;

    // Find start of word
    while (wordStart > 0 && /\S/.test(text[wordStart - 1])) {
        wordStart--;
    }
    // Find end of word
    while (wordEnd < text.length && /\S/.test(text[wordEnd])) {
        wordEnd++;
    }

    if (wordStart >= wordEnd || wordStart < 0 || wordEnd > text.length) {
        return null;
    }

    const foundWord = text.substring(wordStart, wordEnd).trim();
    if (!foundWord) {
        return null;
    }

    // Find the word in the document - work with both regular DOM and embed/shadow DOM
    const searchInContainer = (searchContainer: HTMLElement | Document | ShadowRoot): HTMLSpanElement | null => {
        const rootElement = (searchContainer as Document).body || (searchContainer as ShadowRoot).host || (searchContainer as HTMLElement);
        if (!rootElement) return null;

        const walker = document.createTreeWalker(
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

        let node: Node | null;
        while ((node = walker.nextNode())) {
            const nodeText = node.textContent || '';
            if (!nodeText || nodeText.trim().length === 0) continue;

            // Find word using regex with word boundaries
            const wordRegex = new RegExp(`\\b${foundWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            const match = wordRegex.exec(nodeText);

            if (match && match.index !== undefined) {
                try {
                    const wordStartInNode = match.index;
                    const wordEndInNode = match.index + match[0].length;

                    const range = document.createRange();
                    range.setStart(node, wordStartInNode);
                    range.setEnd(node, wordEndInNode);

                    // Extract and wrap in highlight span
                    const contents = range.extractContents();
                    const span = document.createElement('span');
                    span.className = 'tts-highlight-current';

                    const fragment = document.createDocumentFragment();
                    while (contents.firstChild) {
                        fragment.appendChild(contents.firstChild);
                    }
                    span.appendChild(fragment);

                    range.insertNode(span);
                    currentHighlightSpan = span;

                    // Scroll into view
                    span.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

                    return span;
                } catch (e) {
                    console.warn('Error highlighting word:', e);
                    continue;
                }
            }
        }
        return null;
    };

    // Try container first (most specific)
    if (container) {
        const shadowRoot = container.getRootNode();
        if (shadowRoot instanceof ShadowRoot && shadowRoot !== document) {
            const result = searchInContainer(shadowRoot);
            if (result) return result;
        }
    }

    // Try container directly
    if (container && container !== document.body) {
        const result = searchInContainer(container);
        if (result) return result;
    }

    // Fallback to main document
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
    const walker = document.createTreeWalker(
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
            try {
                // Try to find the full sentence by looking ahead
                let endIndex = index + sentenceWords.length;
                let sentenceEnd = endIndex;

                // Look for sentence ending
                for (let i = endIndex; i < Math.min(endIndex + 200, nodeText.length); i++) {
                    if (/[.!?]/.test(nodeText[i])) {
                        sentenceEnd = i + 1;
                        break;
                    }
                }

                // If we found a likely sentence end, use it; otherwise use the original sentence length
                const range = document.createRange();
                range.setStart(node, index);
                range.setEnd(node, Math.min(sentenceEnd, index + targetSentence.length));

                const contents = range.extractContents();
                const span = document.createElement('span');
                span.className = 'tts-highlight-current';

                const fragment = document.createDocumentFragment();
                while (contents.firstChild) {
                    fragment.appendChild(contents.firstChild);
                }
                span.appendChild(fragment);

                range.insertNode(span);
                currentHighlightSpan = span;

                // Scroll into view
                span.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

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

    // If it's selected text, highlight the entire selection
    if (options.isSelectedText) {
        const highlightSpan = highlightSelectedText();
        if (!highlightSpan) {
            // Fallback: highlight first sentence
            highlightSentence(text, container, 0);
        }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    if (options.voice) {
        utterance.voice = options.voice;
    }

    // Track sentence by sentence for whole page reading
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    let currentSentenceIndex = 0;
    let accumulatedText = '';

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (options.isSelectedText) {
            // For selected text, highlight word by word within the selection
            if (event.name === 'word' && event.charIndex !== undefined) {
                // Remove the initial selection highlight before highlighting individual words
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
            } else if (currentHighlightSpan) {
                currentHighlightSpan.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
        } else if (event.name === 'word' || event.name === 'sentence') {
            // For whole page reading, highlight word by word
            if (!options.isSelectedText && event.charIndex !== undefined) {
                const charIndex = event.charIndex;

                // Highlight word for word-by-word
                if (event.name === 'word') {
                    highlightWord(text, container, charIndex);
                } else if (event.name === 'sentence') {
                    // Fallback to sentence highlighting if word highlighting fails
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
    };

    // Start by highlighting the first sentence
    if (!options.isSelectedText && sentences.length > 0) {
        highlightSentence(text, container, 0);
    }

    utterance.onend = () => {
        setTimeout(() => {
            clearAllHighlights();
        }, 1000);
        options.onEnd?.();
    };

    utterance.onerror = (event: ErrorEvent) => {
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
