"use client";

import { forwardRef, useState } from "react";

export const AudioPlayer = forwardRef<HTMLAudioElement, { src: string; onTime: (seconds: number) => void }>(
  function AudioPlayer({ src, onTime }, ref) {
    const [rate, setRate] = useState(1);

    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-white/[0.03] p-3">
        <audio
          ref={ref}
          src={src}
          controls
          className="h-9 flex-1"
          onTimeUpdate={(event) => onTime(event.currentTarget.currentTime)}
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          Speed
          <select
            className="rounded border border-border bg-card px-2 py-1 text-xs text-white"
            value={rate}
            onChange={(event) => {
              const value = Number(event.target.value);
              setRate(value);
              const audio = (ref as React.RefObject<HTMLAudioElement>)?.current;
              if (audio) audio.playbackRate = value;
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
);
