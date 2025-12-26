// useVideoPreloader.ts
import { useEffect, useRef } from "react";

export function useVideoPreloader(urls: (string | undefined)[]) {
  const refs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    urls.forEach((url, i) => {
      if (!url) return;

      if (!refs.current[i]) {
        const video = document.createElement("video");
        video.src = url;
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.style.display = "none";

        document.body.appendChild(video);
        refs.current[i] = video;
      }
    });

    return () => {
      refs.current.forEach(v => {
        v.pause();
        v.remove();
      });
      refs.current = [];
    };
  }, [urls]);
}
