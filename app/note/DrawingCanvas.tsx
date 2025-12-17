"use client";

import { useEffect, useRef, useState } from "react";

const DRAWING_KEY = "noteflow:note:drawing";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function setupCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make canvas sharp on retina screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset + scale
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }

  function loadDrawing() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const saved = localStorage.getItem(DRAWING_KEY);
    if (!saved) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = saved;
  }

  function saveDrawing() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    localStorage.setItem(DRAWING_KEY, dataUrl);
  }

  useEffect(() => {
    setupCanvas();
    loadDrawing();

    // optional: re-setup if window resizes (keeps it usable)
    const onResize = () => {
      setupCanvas();
      loadDrawing(); // re-draw saved image onto resized canvas
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

    // Save when a stroke finishes (efficient + feels instant)
    saveDrawing();
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    localStorage.removeItem(DRAWING_KEY);
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