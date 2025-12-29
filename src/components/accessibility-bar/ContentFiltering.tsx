'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';

export default function ContentFiltering() {
    const {
        hideImages, toggleHideImages,
        showImageDescriptions, toggleShowImageDescriptions,
        pauseAnimations, togglePauseAnimations,
        stopVideos, toggleStopVideos
    } = useAccessibility();

    return (
        <div className="space-y-2">
            <ToggleCheckbox
                id="hide-images-toggle"
                label="Hide Images"
                checked={hideImages}
                onChange={toggleHideImages}
            />
            <ToggleCheckbox
                id="show-descriptions-toggle"
                label="Image Descriptions"
                checked={showImageDescriptions}
                onChange={toggleShowImageDescriptions}
            />
            <ToggleCheckbox
                id="pause-animations-toggle"
                label="Pause Animations"
                checked={pauseAnimations}
                onChange={togglePauseAnimations}
            />
            <ToggleCheckbox
                id="stop-videos-toggle"
                label="Stop Videos"
                checked={stopVideos}
                onChange={toggleStopVideos}
            />
        </div>
    );
}
