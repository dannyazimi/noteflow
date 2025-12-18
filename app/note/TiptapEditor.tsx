"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type Props = {
  value: any; // TipTap JSON
  onChange: (nextValue: any) => void;
};

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class: "ProseMirror",
        style:
          "min-height:140px; padding:12px; border:1px solid #ccc; border-radius:8px; outline:none; background:white;",
      },
    },
  });

  // If parent value changes (load/reset), update editor once
  useEffect(() => {
    if (!editor) return;
    if (!value) return;
    editor.commands.setContent(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Emit updates to parent
  useEffect(() => {
    if (!editor) return;

    const handler = () => onChange(editor.getJSON());
    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}