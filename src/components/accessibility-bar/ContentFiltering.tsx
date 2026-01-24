'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';
import ToggleCheckbox from './ToggleCheckbox';
import FeatureWrapper from './FeatureWrapper';
import InfoPopupButton from './InfoPopupButton';
import { translations } from '@/contexts/accessibility/translations';

interface ContentFilteringProps {
    highlightedFeature?: string | null;
}

export default function ContentFiltering({ highlightedFeature }: ContentFilteringProps) {
    const {
        hideImages, toggleHideImages,
        showImageDescriptions, toggleShowImageDescriptions,
        pauseAnimations, togglePauseAnimations,
        muteAudio, toggleMuteAudio,
        stopVideos, toggleStopVideos,
        language
    } = useAccessibility();

    const t = translations[language] || translations['en'];

    return (
        <div className="space-y-4 pt-2">
            <FeatureWrapper featureId="hide-images" highlightedFeature={highlightedFeature || null}>
                <ToggleCheckbox
                    id="hide-images-toggle"
                    label="Hide Website Images"
                    checked={hideImages}
                    onChange={toggleHideImages}
                    labelClassName="text-[18px] font-medium"
                />
            </FeatureWrapper>
            <FeatureWrapper featureId="image-descriptions" highlightedFeature={highlightedFeature || null}>
                <ToggleCheckbox
                    id="show-descriptions-toggle"
                    label={
                        <div className="flex items-center gap-1">
                            <span>Image Descriptions</span>
                            <InfoPopupButton
                                title="Image Descriptions"
                                description={t.info?.images?.features?.["Image Descriptions"] || "Show alt text descriptions for images."}
                            />
                        </div>
                    }
                    checked={showImageDescriptions}
                    onChange={toggleShowImageDescriptions}
                    labelClassName="text-[18px] font-medium"
                />
            </FeatureWrapper>
            <FeatureWrapper featureId="pause-animations" highlightedFeature={highlightedFeature || null}>
                <ToggleCheckbox
                    id="pause-animations-toggle"
                    label="Pause Animations"
                    checked={pauseAnimations}
                    onChange={togglePauseAnimations}
                    labelClassName="text-[18px] font-medium"
                />
            </FeatureWrapper>
            <FeatureWrapper featureId="mute-audio" highlightedFeature={highlightedFeature || null}>
                <ToggleCheckbox
                    id="mute-audio-toggle"
                    label="Pause Audio"
                    checked={muteAudio}
                    onChange={toggleMuteAudio}
                    labelClassName="text-[18px] font-medium"
                />
            </FeatureWrapper>
            <FeatureWrapper featureId="stop-videos" highlightedFeature={highlightedFeature || null}>
                <ToggleCheckbox
                    id="stop-videos-toggle"
                    label="Stop Videos"
                    checked={stopVideos}
                    onChange={toggleStopVideos}
                    labelClassName="text-[18px] font-medium"
                />
            </FeatureWrapper>
        </div>
    );
}
