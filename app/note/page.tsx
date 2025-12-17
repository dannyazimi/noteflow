import DrawingCanvas from "./DrawingCanvas";

export default function NotePage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>My First Note</h1>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Text</h2>
        <textarea
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