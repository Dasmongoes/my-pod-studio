import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShopifyImage, imageAlt } from "@/lib/shopify";

interface ProductGalleryProps {
  images: ShopifyImage[];
  index: number;
  onIndexChange: (index: number) => void;
  title: string;
}

// Swipe-to-change on touch, zoom-on-hover on desktop, arrow keys, and a full-screen view.
const ProductGallery = ({ images, index, onIndexChange, title }: ProductGalleryProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const current = images[index] ?? images[0];

  const go = (delta: number) => {
    if (count < 2) return;
    onIndexChange((index + delta + count) % count);
  };

  // Arrow keys (when not typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (!current) {
    return (
      <div className="aspect-[4/5] bg-muted flex items-center justify-center text-xs text-muted-foreground">
        No image available
      </div>
    );
  }

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-all";

  return (
    <div className="space-y-3">
      <div
        className="group aspect-[4/5] bg-muted relative overflow-hidden select-none lg:cursor-zoom-in"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setFullscreen(true)}
      >
        <img
          key={current.url}
          src={current.url}
          alt={imageAlt(current.altText, title)}
          draggable={false}
          className="w-full h-full object-cover animate-fade-in transition-transform duration-200 ease-out"
          style={
            zoom
              ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className={`${arrowClass} left-3 lg:opacity-0 lg:group-hover:opacity-100`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className={`${arrowClass} right-3 lg:opacity-0 lg:group-hover:opacity-100`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots (mobile) */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 lg:hidden">
              {images.map((img, i) => (
                <span
                  key={img.url}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/40"}`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center pointer-events-none lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <Expand className="w-4 h-4" />
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest bg-background/80 backdrop-blur px-2 py-1">
          {index + 1} / {count}
        </span>
      </div>

      {count > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, idx) => (
            <button
              key={image.url}
              type="button"
              onClick={() => onIndexChange(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-current={index === idx}
              className={`aspect-[4/5] bg-muted relative overflow-hidden border transition-all ${
                index === idx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={image.url} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-none w-screen h-[100dvh] p-0 border-0 bg-black/95 flex items-center justify-center [&>button]:hidden sm:rounded-none">
          <DialogTitle className="sr-only">{title} images</DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              key={current.url}
              src={current.url}
              alt={imageAlt(current.altText, title)}
              className="max-w-full max-h-full object-contain animate-fade-in"
            />
            <button
              type="button"
              aria-label="Close"
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {count > 1 && (
              <>
                <button type="button" aria-label="Previous image" onClick={() => go(-1)} className={`${arrowClass} left-4`}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" aria-label="Next image" onClick={() => go(1)} className={`${arrowClass} right-4`}>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-6 text-xs tracking-widest text-white/70">
                  {index + 1} / {count}
                </span>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
