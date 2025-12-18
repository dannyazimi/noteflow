"use client";

import { useEffect, useMemo, useState } from "react";
import TiptapEditor from "./TiptapEditor";
import DrawingCanvas from "./DrawingCanvas";

type Block =
  | { id: string; type: "text"; content: any }
  | { id: string; type: "drawing"; content: string | null };

const NOTE_KEY = "noteflow:note:blocks";

function newId() {
  // good enough for now (we’ll use UUID later)
  return Math.random().toString(36).slice(2, 10);
}

export default function NotePage() {
  const [blocks, setBlocks] = useState<Block[]>(() => [
    { id: newId(), type: "text", content: { type: "doc", content: [{ type: "paragraph" }] } },
  ]);

  // Load once
  useEffect(() => {
    const saved = localStorage.getItem(NOTE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Block[];
      if (Array.isArray(parsed) && parsed.length > 0) setBlocks(parsed);
    } catch {
      // ignore corrupted save
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(NOTE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const addText = () => {
    setBlocks((prev) => [
      ...prev,
      { id: newId(), type: "text", content: { type: "doc", content: [{ type: "paragraph" }] } },
    ]);
  };

  const addDrawing = () => {
    setBlocks((prev) => [...prev, { id: newId(), type: "drawing", content: null }]);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, content } as Block) : b)));
  };

  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Note</h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={addText}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", background: "white" }}
          >
            + Text
          </button>
          <button
            onClick={addDrawing}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", background: "white" }}
          >
            + Drawing
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        {blocks.map((block) => (
          <section key={block.id} style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: 14, opacity: 0.8 }}>{block.type.toUpperCase()}</strong>
              <button
                onClick={() => removeBlock(block.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>

            {block.type === "text" ? (
              <TiptapEditor value={block.content} onChange={(next) => updateBlock(block.id, next)} />
            ) : (
              <DrawingCanvas value={block.content} onChange={(next) => updateBlock(block.id, next)} />
            )}
          </section>
        ))}
      </div>
    </main>
  );
}