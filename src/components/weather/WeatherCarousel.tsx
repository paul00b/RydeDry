import { useState, useRef } from 'react';
import { WeatherCard } from './WeatherCard';
import { WeatherTimeline } from './WeatherTimeline';
import { WeatherSlot } from '../../types';

interface WeatherCarouselProps {
  weather: WeatherSlot | null;
  upcomingSlots: WeatherSlot[];
  loading: boolean;
  error: string | null;
  location: string;
}

export function WeatherCarousel({ weather, upcomingSlots, loading, error, location }: WeatherCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    { id: 'weather', label: 'Météo actuelle' },
    { id: 'timeline', label: 'Prochaines heures' }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="space-y-3">
      {/* Carousel container */}
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slide 1: Météo actuelle */}
          <div className="w-full flex-shrink-0">
            <WeatherCard weather={weather} loading={loading} error={error} location={location} />
          </div>

          {/* Slide 2: Prochaines heures */}
          <div className="w-full flex-shrink-0">
            <WeatherTimeline slots={upcomingSlots} location={location} />
          </div>
        </div>
      </div>

      {/* Indicateurs de position */}
      <div className="flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index
                ? 'w-8 bg-[var(--color-primary)]'
                : 'w-2 bg-[var(--color-text-lighter)]'
            }`}
            aria-label={slide.label}
          />
        ))}
      </div>
    </div>
  );
}