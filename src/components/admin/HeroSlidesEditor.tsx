'use client';

import React, { useRef, useState } from 'react';
import {
  ArrowUp, ArrowDown, Trash2, Plus, UploadCloud, Loader2, X, Film, PlayCircle, RotateCcw,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  HeroSlide, HeroStat, EMPTY_HERO_SLIDE, getYouTubeId,
} from '@/lib/heroSlides';

const inputClass =
  'w-full bg-black/40 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]';
const labelClass = 'text-[10px] font-bold uppercase tracking-wider text-zinc-400';

const MAX_VIDEO_MB = 50;

// Video field: paste a YouTube link, or upload an mp4/webm file straight to storage.
function VideoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const youTubeId = getYouTubeId(value);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Only video files are allowed (MP4 or WebM recommended)');
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Video must be smaller than ${MAX_VIDEO_MB}MB. Compress it, or upload it to YouTube and paste the link.`);
      return;
    }

    setError('');
    setProgress(0);
    try {
      const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok || !signJson.uploadUrl) {
        throw new Error(signJson.detail || 'Could not prepare upload');
      }

      // XHR (not fetch) so we can show upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signJson.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);
      });

      onChange(signJson.publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error uploading video');
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="YouTube link or uploaded video URL (leave empty to show the image)"
            className={`${inputClass} pr-10`}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              aria-label="Remove video"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-[#dfc28c] text-xs font-bold uppercase tracking-wider rounded-xl border border-white/5 flex items-center gap-2 transition-all shrink-0"
        >
          {progress !== null ? <Loader2 className="animate-spin" size={14} /> : <UploadCloud size={14} />}
          <span>{progress !== null ? `${progress}%` : 'Upload video'}</span>
        </button>
        <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/*" onChange={handleFile} className="hidden" />
      </div>

      {progress !== null && (
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#dfc28c] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <span className="text-[10px] text-red-400 font-semibold">{error}</span>}

      {value && (
        <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5 w-fit max-w-full">
          {youTubeId ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${youTubeId}/mqdefault.jpg`}
                alt="YouTube preview"
                className="w-28 h-16 object-cover rounded-lg border border-white/10"
              />
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
                <PlayCircle size={14} className="text-red-500" /> YouTube video • plays muted on loop
              </span>
            </>
          ) : (
            <>
              <video src={value} muted playsInline preload="metadata" className="w-28 h-16 object-cover rounded-lg border border-white/10 bg-zinc-900" />
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
                <Film size={14} className="text-[#dfc28c]" /> Video file • plays muted on loop
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface HeroSlidesEditorProps {
  slides: HeroSlide[];
  onSlidesChange: (slides: HeroSlide[]) => void;
  stats: HeroStat[];
  onStatsChange: (stats: HeroStat[]) => void;
  usingSavedSlides: boolean;
  onResetToAutomatic: () => void;
}

export default function HeroSlidesEditor({
  slides,
  onSlidesChange,
  stats,
  onStatsChange,
  usingSavedSlides,
  onResetToAutomatic,
}: HeroSlidesEditorProps) {
  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    onSlidesChange(slides.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const moveSlide = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    onSlidesChange(next);
  };

  const removeSlide = (index: number) => {
    if (!confirm(`Remove slide ${index + 1}?`)) return;
    onSlidesChange(slides.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof HeroStat, value: string) => {
    onStatsChange(stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="pb-3 border-b border-white/5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Homepage Hero Slider</h3>
          <p className="text-[10px] text-zinc-500 mt-1 max-w-xl">
            Each slide shows a background image or video with its text and an Explore button. Videos play muted on loop;
            the image is shown while the video loads and on slides without a video. Click Save Configurations to publish.
          </p>
        </div>
        {usingSavedSlides && (
          <button
            type="button"
            onClick={onResetToAutomatic}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 flex items-center gap-2 shrink-0"
          >
            <RotateCcw size={12} /> Use featured properties instead
          </button>
        )}
      </div>

      {!usingSavedSlides && (
        <div className="p-3 rounded-xl bg-[#dfc28c]/10 border border-[#dfc28c]/20 text-[11px] text-[#dfc28c] font-semibold">
          The hero currently shows your featured properties automatically. These slides are a copy of what is live now —
          edit them and save to take manual control of the hero.
        </div>
      )}

      {slides.map((slide, index) => (
        <div key={index} className="flex flex-col gap-5 p-5 rounded-2xl border border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">
              Slide {index + 1}
              {slide.subtitle && <span className="text-zinc-500 font-semibold normal-case tracking-normal"> — {slide.subtitle}</span>}
            </h4>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30" aria-label="Move slide up">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30" aria-label="Move slide down">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => removeSlide(index)} disabled={slides.length <= 1}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-30" aria-label="Remove slide">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Background image</label>
            <ImageUploader value={slide.image} onChange={(url) => updateSlide(index, 'image', url)} placeholder="/assets/... or https://..." />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Background video (optional)</label>
            <VideoField value={slide.video} onChange={(url) => updateSlide(index, 'video', url)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Small heading (project name)</label>
              <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                placeholder="THE HORIZON RESIDENCY" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Location</label>
              <input type="text" value={slide.location} onChange={(e) => updateSlide(index, 'location', e.target.value)}
                placeholder="Luthuli Avenue, Bugolobi" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Main headline</label>
            <textarea rows={2} value={slide.title} onChange={(e) => updateSlide(index, 'title', e.target.value)}
              placeholder="Redefining Urban Living Through Premium Residences" className={`${inputClass} resize-y`} />
            <span className="text-[10px] text-zinc-600">Headlines over 60 characters are shown in a smaller font.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Price line</label>
              <input type="text" value={slide.price} onChange={(e) => updateSlide(index, 'price', e.target.value)}
                placeholder="Starting from $92,000" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>“Explore Property” button link</label>
              <input type="text" value={slide.link} onChange={(e) => updateSlide(index, 'link', e.target.value)}
                placeholder="/properties/horizon-residency" className={inputClass} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onSlidesChange([...slides, { ...EMPTY_HERO_SLIDE }])}
        className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-zinc-400 hover:text-[#dfc28c] hover:border-[#dfc28c]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={14} /> Add slide
      </button>

      <div className="flex flex-col gap-5">
        <div className="pb-2 border-b border-white/5">
          <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-white">Hero highlight numbers</h4>
          <p className="text-[10px] text-zinc-500 mt-1">The three figures in the box at the bottom right of the hero (desktop only).</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-black/20">
              <label className={labelClass}>Figure {index + 1}</label>
              <input type="text" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="10+" className={inputClass} />
              <input type="text" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Years Experience" className={inputClass} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
