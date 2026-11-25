import { useState } from 'react';

export default function CommentBox({ comments, canSubmit, onSubmit }) {
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSend} className="flex gap-1.5">
        <input
          type="text"
          maxLength={64}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aviso rápido del lugar (máx. 64 chars)..."
          className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-700"
        />
        <button
          type="submit"
          disabled={!canSubmit || !text.trim()}
          className="rounded-xl bg-blue-800 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Enviar
        </button>
      </form>

      <div className="space-y-1">
        {comments.map((c) => (
          <p key={c.id} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            {c.text} <span className="text-[10px] text-slate-400">· {c.createdAt}</span>
          </p>
        ))}
      </div>
    </div>
  );
}