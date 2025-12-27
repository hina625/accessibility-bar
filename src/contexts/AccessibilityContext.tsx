'use client';

export * from './accessibility';
export { AccessibilityProvider as default } from './accessibility';

// The following code snippet is provided by the user.
// It appears to be intended for use within a React component or custom hook,
// as it uses `useState` and references other state variables like `readingSpotlight`,
// `setReadingRuler`, `setReadingGuide`, `setReadingMask`, etc.
//
// To make the file syntactically correct, these definitions cannot be placed
// at the top level of the module. They would typically reside inside the
// `AccessibilityProvider` component (defined in './accessibility') or a
// related custom hook.
//
// As per the instructions to return the full contents of the new code document
// after the change and ensure it's syntactically correct, and given that
// the provided snippet cannot be directly inserted at the top level without
// causing a syntax error (due to `useState` call outside a component/hook),
// I am placing it here as a commented block.
//
// If the intention was to modify the `AccessibilityProvider` component itself,
// that modification would need to happen in the `./accessibility` file.
//
// If these functions and state are meant to be exported from this file,
// they would need to be wrapped in a custom hook or a component.

/*
export const toggleReadingSpotlight = () => {
    if (!readingSpotlight) {
      setReadingRuler(false);
      setReadingGuide(false);
      setReadingMask(false);
      setPronunciationGuide(false);
    }
    setReadingSpotlight(!readingSpotlight);
  };

  const [pronunciationGuide, setPronunciationGuide] = useState(false);
  export const togglePronunciationGuide = () => {
    if (!pronunciationGuide) {
      setReadingRuler(false);
      setReadingGuide(false);
      setReadingMask(false);
      setReadingSpotlight(false);
    }
    setPronunciationGuide(!pronunciationGuide);
  };
*/
