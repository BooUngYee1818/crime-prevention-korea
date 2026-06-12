"use client";
import { useEffect, useRef, useState } from "react";

export default function BgmPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.15;
    audio.loop = true;

    // 첫 번째 클릭/터치 시 자동 재생 (브라우저 정책)
    const start = () => {
      if (!started) {
        audio.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {});
      }
    };
    document.addEventListener("click", start, { once: true });
    document.addEventListener("touchstart", start, { once: true });
    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
  }, [started]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" preload="auto" />
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
