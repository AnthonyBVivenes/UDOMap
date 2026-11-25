import { useState, useMemo } from 'react';

export function useClassroomSearch(nodes, schedules) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return nodes.filter((node) => {
      const matchesCat = selectedCategory === 'ALL' || node.type === selectedCategory;
      if (!matchesCat) return false;
      if (!term) return true;

      const inNode =
        node.name.toLowerCase().includes(term) ||
        (node.code && node.code.toLowerCase().includes(term)) ||
        (node.department && node.department.toLowerCase().includes(term));

      const inSchedule = schedules.some(
        (s) =>
          s.nodeId === node.id &&
          (s.subject.toLowerCase().includes(term) || s.professor.toLowerCase().includes(term))
      );

      return inNode || inSchedule;
    });
  }, [nodes, schedules, query, selectedCategory]);

  return { query, setQuery, results, selectedCategory, setSelectedCategory };
}