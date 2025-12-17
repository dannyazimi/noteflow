"use client";

import { useEffect, useState } from "react";
import DrawingCanvas from "./DrawingCanvas";

const TEXT_KEY = "noteflow:note:text";

export default function NotePage() {
  const [text, setText] = useState("");

  // Load text once on mount
  useEffect(() => {
    const saved = localStorage.getItem(TEXT_KEY);
    if (saved !== null) setText(saved);
  }, []);

  // Save text whenever it changes (simple + works)
  useEffect(() => {
    localStorage.setItem(TEXT_KEY, text);
  }, [text]);

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>My First Note</h1>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your notes here..."
          style={{
            width: "100%",
            height: 150,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Drawing</h2>
        <DrawingCanvas />
      </section>
    </main>
  );
}