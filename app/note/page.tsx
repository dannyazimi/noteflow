"use client";

import DrawingCanvas from "./DrawingCanvas";
import TiptapEditor from "./TiptapEditor";

const TEXT_KEY = "noteflow:note:tiptap";

export default function NotePage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>My First Note</h1>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Text</h2>
        <TiptapEditor storageKey={TEXT_KEY} />
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Drawing</h2>
        <DrawingCanvas />
      </section>
    </main>
  );
}