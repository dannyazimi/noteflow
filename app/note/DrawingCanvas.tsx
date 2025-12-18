"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string | null; // dataURL (png) or null
  onChange: (nextValue: string | null) => void;
};

export default function DrawingCanvas({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function setupCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }

  function drawImage(dataUrl: string) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = dataUrl;
  }

  function saveToParent() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL("image/png"));
  }

  useEffect(() => {
    setupCanvas();
    if (value) drawImage(value);

    const onResize = () => {
      setupCanvas();
      if (value) drawImage(value);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent value changes later, redraw it
  useEffect(() => {
    if (value) drawImage(value);
  }, [value]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
    canvas.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    setIsDrawing(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
    saveToParent(); // save after each stroke
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    onChange(null);
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        onClick={clear}
        style={{
          width: 120,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: "pointer",
          background: "white",
        }}
      >
        Clear
      </button>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 300,
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "white",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}