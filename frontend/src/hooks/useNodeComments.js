import { useState } from 'react';

export function useNodeComments() {
  const [comments, setComments] = useState([]);

  const submitComment = (text) => {
    const trimmed = text.trim().slice(0, 64);
    if (!trimmed) return;
    setComments((prev) => [
      { id: Date.now().toString(), text: trimmed, createdAt: 'Ahora' },
      ...prev,
    ]);
  };

  return {
    comments,
    isLoading: false,
    canSubmit: true,
    submitComment,
    reportComment: () => {},
  };
}