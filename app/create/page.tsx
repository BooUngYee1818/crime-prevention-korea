"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { Character, Style, MoodReaction, STYLE_LABELS, STYLE_COLORS } from "@/lib/types";
import { saveCharacter } from "@/lib/store";

const STYLES: Style[] = ["drama", "variety", "humor", "adult", "gangster", "tsundere"];
const MOOD_OPTIONS: { value: MoodReaction; label: string; desc: string }[] = [
  { value: "match", label: "같이 흥분", desc: "내 감정 그대로 받아침" },
  { value: "comfort", label: "달래줌", desc: "부드럽게 위로해줌" },
  { value: "ignore", label: "무시", desc: "감정 무시, 캐릭터 유지" },
];

export default function CreatePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [styles, setStyles] = useState<Style[]>([]);
  const [mood, setMood] = useState<MoodReaction>("match");
  const [description, setDescription] = useState("");

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function toggleStyle(s: Style) {
    setStyles((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function handleSave() {
    if (!name.trim()) { alert("이름을 입력해주세요"); return; }
    if (styles.length === 0) { alert("스타일을 하나 이상 선택해주세요"); return; }
    saveCharacter({ id: Date.now().toString(), name: name.trim(), photo, style: styles, moodReaction: mood, description, createdAt: Date.now() } as Character);
    router.push("/");
  }

  const inputStyle = {
    width: "100%", background: "#1a1a1a", border: "0.5px solid #2a2a2a",
    borderRadius: 14, padding: "13px 16px", color: "#fff", fontSize: 14,
    outline: "none", display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0d0d0d" }}>

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "52px 20px 16px", flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#888" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>새 캐릭터 만들기</h1>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* 사진 업로드 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: 96, height: 96, borderRadius: "50%",
              background: "#1a1a1a", border: "1.5px dashed #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden",
            }}
          >
            {photo
              ? <img src={photo} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Camera size={28} color="#444" />
            }
          </button>
          <p style={{ color: "#555", fontSize: 12 }}>사진 업로드 (선택)</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </div>

        {/* 이름 */}
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>이름</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="캐릭터 이름"
            style={{ ...inputStyle, fontSize: 15 } as React.CSSProperties}
          />
        </div>

        {/* 스타일 */}
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 10 }}>대화 스타일 (복수 선택)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STYLES.map((s) => {
              const selected = styles.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleStyle(s)}
                  style={{
                    padding: "9px 18px", borderRadius: 30, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.15s",
                    background: selected ? STYLE_COLORS[s].bg : "transparent",
                    color: selected ? STYLE_COLORS[s].text : "#666",
                    border: selected ? `1px solid ${STYLE_COLORS[s].bg}` : "1px solid #2a2a2a",
                  }}
                >
                  {STYLE_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 감정 반응 */}
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 10 }}>내 감정에 어떻게 반응할까요?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMood(opt.value)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                  background: mood === opt.value ? "#1a1a2e" : "#1a1a1a",
                  border: mood === opt.value ? "1px solid #534AB7" : "0.5px solid #242424",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ color: mood === opt.value ? "#fff" : "#888", fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
                <span style={{ color: "#555", fontSize: 12 }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 설명 */}
        <div>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>캐릭터 설명 (선택)</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 20대 여자, 직설적이고 털털한 성격..."
            rows={3}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.6 } as React.CSSProperties}
          />
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 18,
            background: "#fff", color: "#000", fontWeight: 700, fontSize: 15,
            border: "none", cursor: "pointer", marginTop: 4,
          }}
        >
          캐릭터 만들기
        </button>
      </div>
    </div>
  );
}
