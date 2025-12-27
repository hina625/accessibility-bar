'use client';

import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function ContentFiltering() {
    const {
        hideImages, toggleHideImages,
        showImageDescriptions, toggleShowImageDescriptions,
        pauseAnimations, togglePauseAnimations,
        stopVideos, toggleStopVideos
    } = useAccessibility();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label
                    htmlFor="hide-images-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Hide Images
                </label>
                <button
                    id="hide-images-toggle"
                    onClick={toggleHideImages}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${hideImages ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={hideImages}
                    aria-label="Toggle hide images"
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hideImages ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <label
                    htmlFor="show-descriptions-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Image Descriptions
                </label>
                <button
                    id="show-descriptions-toggle"
                    onClick={toggleShowImageDescriptions}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showImageDescriptions ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={showImageDescriptions}
                    aria-label="Toggle show image descriptions"
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showImageDescriptions ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <label
                    htmlFor="pause-animations-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Pause Animations
                </label>
                <button
                    id="pause-animations-toggle"
                    onClick={togglePauseAnimations}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${pauseAnimations ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={pauseAnimations}
                    aria-label="Toggle pause animations"
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pauseAnimations ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <label
                    htmlFor="stop-videos-toggle"
                    className="text-[18px] font-normal text-black dark:text-gray-300 cursor-pointer"
                >
                    Stop Videos
                </label>
                <button
                    id="stop-videos-toggle"
                    onClick={toggleStopVideos}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${stopVideos ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    role="switch"
                    aria-checked={stopVideos}
                    aria-label="Toggle stop videos"
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stopVideos ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}
