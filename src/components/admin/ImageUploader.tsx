'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  placeholder = 'No image selected',
  className = '',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson?.detail || 'Upload failed');
      }

      const data = await res.json();
      if (data?.success && data?.url) {
        onChange(data.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error uploading file');
    } finally {
      setUploading(false);
      // Reset input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Main Text Input URL (keeps manual input option alive!) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/5 pl-4 pr-10 py-2.5 rounded-xl text-xs outline-none focus:border-[#dfc28c]"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={triggerFileInput}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-[#dfc28c] hover:text-[#d4af37] text-xs font-bold uppercase tracking-wider rounded-xl border border-white/5 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {uploading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <UploadCloud size={14} />
          )}
          <span>{uploading ? 'Uploading' : 'Upload'}</span>
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && <span className="text-[10px] text-red-400 font-semibold">{error}</span>}

      {/* Preview container */}
      {value && (
        <div className="mt-1 flex items-start gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5 w-fit">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center shrink-0 group">
            {/* Standard img tag handles fallback and external domains seamlessly */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // If invalid path, show placeholder icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <ImageIcon size={14} className="text-[#dfc28c]" />
            </div>
          </div>
          <div className="flex flex-col text-[10px] text-zinc-500 font-semibold justify-center min-h-[64px]">
            <span className="text-zinc-400 text-xs font-bold truncate max-w-[200px]">Preview Loaded</span>
            <span className="truncate max-w-[200px] mt-0.5">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
}
