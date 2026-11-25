import { useState } from 'react';
import { MOCK_META, MOCK_NODES, MOCK_EDGES, MOCK_SCHEDULES } from '../mocks/campusMock';

export function useCampusData() {
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshData = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 400);
  };

  return {
    nodes: MOCK_NODES,
    edges: MOCK_EDGES,
    schedules: MOCK_SCHEDULES,
    graph: null,
    isOffline: false,
    isSyncing,
    versionHash: MOCK_META.versionHash,
    refreshData,
  };
}