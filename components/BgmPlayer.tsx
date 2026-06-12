"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function getSrc(pathname: string) {
  if (pathname === "/") return "/music-main.mp3";
  if (pathname.startsWith("/crime/")) return "/music-simulation.mp3";
  return "/music-other.mp3";
}

export default function BgmPlayer() {
  const pathname  = usePathname();
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(false);
  const startedRef = useRef(false);
  const src = getSrc(pathname);

  // 첫 로드: 자동재생 or 첫 클릭 시 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.15;
    audio.loop   = true;

    audio.play().then(() => {
      setPlaying(true);
      startedRef.current = true;
    }).catch(() => {
      const start = () => {
        if (startedRef.current) return;
        audio.play().then(() => {
          setPlaying(true);
          startedRef.current = true;
        }).catch(() => {});
      };
      document.addEventListener("click",      start, { once: true });
      document.addEventListener("touchstart", start, { once: true });
    });
  }, []);

  // 경로 변경 시 음악 교체 (부드럽게 페이드)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !startedRef.current || muted) return;

    const newSrc = getSrc(pathname);
    if (audio.getAttribute("data-src") === newSrc) return;
    audio.setAttribute("data-src", newSrc);

    // 페이드 아웃
    const fadeOut = setInterval(() => {
      if (audio.volume > 0.02) {
        audio.volume = Math.max(0, audio.volume - 0.02);
      } else {
        clearInterval(fadeOut);
        audio.pause();
        audio.src  = newSrc;
        audio.load();
        audio.play().then(() => {
          // 페이드 인
          audio.volume = 0;
          const fadeIn = setInterval(() => {
            if (audio.volume < 0.14) {
              audio.volume = Math.min(0.15, audio.volume + 0.02);
            } else {
              audio.volume = 0.15;
              clearInterval(fadeIn);
            }
          }, 60);
        }).catch(() => {});
      }
    }, 60);

    return () => clearInterval(fadeOut);
  }, [pathname, muted]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      setMuted(true);
    } else {
      if (!startedRef.current) {
        audio.src = src;
        audio.load();
      }
      audio.play().then(() => {
        setPlaying(true);
        setMuted(false);
        startedRef.current = true;
      }).catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} data-src={src} preload="auto" />
      <button
        onClick={toggle}
        title={playing ? "음악 끄기" : "음악 켜기"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)",
          border: "1.5px solid #e2e8f0",
          cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px #00000018",
          backdropFilter: "blur(12px)",
        }}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}
