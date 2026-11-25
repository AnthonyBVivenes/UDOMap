import { useState, useMemo } from 'react';
import { Navigation, Flame, Search, WifiOff, RefreshCw, Compass } from 'lucide-react';

import { useCampusData } from './hooks/useCampusData';
import { useGeolocation } from './hooks/useGeolocation';
import { useRoutePlanner } from './hooks/useRoutePlanner';
import { useClassroomSearch } from './hooks/useClassroomSearch';
import { useNodeComments } from './hooks/useNodeComments';

import MapView from './components/MapView';
import RouteLayer from './components/RouteLayer';
import HeatmapLayer from './components/HeatmapLayer';
import ClassroomCard from './components/ClassroomCard';
import CommentBox from './components/CommentBox';

const ROUTE_CRITERIA = [
  { id: 'shortest', label: 'Más corta' },
  { id: 'easiest', label: 'Más fácil' },
  { id: 'safest', label: 'Más segura' },
];

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [originNodeId, setOriginNodeId] = useState(null);
  const [routeCriteria, setRouteCriteria] = useState('shortest');
  const [showHeatmap, setShowHeatmap] = useState(false);

  const {
    nodes,
    edges,
    schedules,
    graph,
    isOffline,
    isSyncing,
    versionHash,
    refreshData,
  } = useCampusData();

  const {
    coords: userCoords,
    error: geoError,
    isTracking,
    toggleTracking,
  } = useGeolocation();

  const {
    query,
    setQuery,
    results: searchResults,
    selectedCategory,
    setSelectedCategory,
  } = useClassroomSearch(nodes, schedules);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const effectiveOriginId = useMemo(() => {
    if (originNodeId) return originNodeId;
    if (userCoords && graph?.findNearestNode) {
      return graph.findNearestNode(userCoords.lat, userCoords.lng)?.id || null;
    }
    return null;
  }, [originNodeId, userCoords, graph]);

  const {
    routeResult,
    remainingDistance,
    clearRoute,
  } = useRoutePlanner({
    graph,
    originId: effectiveOriginId,
    targetId: selectedNodeId,
    criteria: routeCriteria,
    userCoords,
  });

  const {
    comments,
    isLoading: isLoadingComments,
    canSubmit,
    submitComment,
    reportComment,
  } = useNodeComments(selectedNodeId);

  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setQuery('');
  };

  const handleCloseCard = () => {
    setSelectedNodeId(null);
    clearRoute();
  };

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-slate-100 text-slate-900 select-none">
      {/* Barra superior: marca, buscador y estado de sincronización */}
      <header className="pointer-events-none absolute top-0 right-0 left-0 z-1000 flex flex-col gap-2 p-3 sm:max-w-md">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
          <Compass className="h-5 w-5 shrink-0 text-blue-800" />
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca un aula, laboratorio o docente..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {isOffline ? (
            <span
              title="Modo sin conexión (caché local)"
              className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
            >
              <WifiOff className="h-3.5 w-3.5" />
              Offline
            </span>
          ) : (
            <button
              type="button"
              onClick={refreshData}
              disabled={isSyncing}
              title={`Sincronizar datos (${versionHash || 'local'})`}
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-blue-700' : ''}`} />
            </button>
          )}
        </div>

        {/* Filtros rápidos por tipo de espacio */}
        <div className="pointer-events-auto flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'Todo' },
            { id: 'CLASSROOM', label: 'Aulas' },
            { id: 'LAB', label: 'Laboratorios' },
            { id: 'OFFICE', label: 'Departamentos' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-800 text-white'
                  : 'bg-white/95 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Desplegable de resultados de búsqueda */}
        {query.trim().length > 0 && (
          <ul className="pointer-events-auto max-h-60 overflow-y-auto rounded-2xl bg-white shadow-lg divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <li className="px-4 py-3 text-xs text-slate-500">
                No se encontraron espacios o docentes para "{query}".
              </li>
            ) : (
              searchResults.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectNode(item.id)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.code || item.department || item.type}
                      </p>
                    </div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                      Ver
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </header>

      {/* Controles flotantes derechos: GPS y Mapa de Calor */}
      <aside className="absolute top-28 right-3 z-1000 flex flex-col gap-2">
        <button
          type="button"
          onClick={toggleTracking}
          title={geoError || 'Activar ubicación GPS'}
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
            isTracking ? 'bg-blue-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Navigation className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowHeatmap((prev) => !prev)}
          title="Alternar mapa de calor de seguridad/tránsito"
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
            showHeatmap ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Flame className="h-4 w-4" />
        </button>
      </aside>

      {/* Lienzo principal del mapa (Leaflet) */}
      <main className="h-full w-full">
        <MapView
          nodes={nodes}
          userCoords={userCoords}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
        >
          {routeResult && <RouteLayer route={routeResult} />}
          {showHeatmap && <HeatmapLayer nodes={nodes} edges={edges} />}
        </MapView>
      </main>

      {/* Panel inferior: Ficha del espacio, selector de criterio de ruta y comentarios */}
      {selectedNode && (
        <section className="absolute right-0 bottom-0 left-0 z-1000 max-h-[62dvh] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl sm:right-auto sm:bottom-4 sm:left-4 sm:w-96 sm:rounded-3xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {ROUTE_CRITERIA.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRouteCriteria(item.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    routeCriteria === item.id
                      ? 'bg-white text-blue-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCloseCard}
              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Cerrar
            </button>
          </div>

          <ClassroomCard
            node={selectedNode}
            schedules={schedules}
            routeResult={routeResult}
            remainingDistance={remainingDistance}
            nodes={nodes}
            originNodeId={effectiveOriginId}
            onChangeOrigin={setOriginNodeId}
          />

          <div className="mt-4 border-t border-slate-100 pt-3">
            <CommentBox
              nodeId={selectedNode.id}
              comments={comments}
              isLoading={isLoadingComments}
              canSubmit={canSubmit}
              onSubmit={submitComment}
              onReport={reportComment}
            />
          </div>
        </section>
      )}
    </div>
  );
}