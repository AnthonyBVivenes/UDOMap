import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

const UDO_CENTER = [10.1341, -64.6657];

export default function MapView({ nodes, userCoords, selectedNodeId, onSelectNode, children }) {
  return (
    <MapContainer
      center={UDO_CENTER}
      zoom={17}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {nodes.map((node) => {
        const isSelected = node.id === selectedNodeId;
        return (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lng]}
            radius={isSelected ? 11 : 8}
            pathOptions={{
              color: isSelected ? '#1e3a8a' : '#2563eb',
              fillColor: isSelected ? '#1d4ed8' : '#3b82f6',
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => onSelectNode(node.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {node.code || node.name}
            </Tooltip>
          </CircleMarker>
        );
      })}

      {userCoords && (
        <CircleMarker
          center={[userCoords.lat, userCoords.lng]}
          radius={7}
          pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 1 }}
        />
      )}

      {children}
    </MapContainer>
  );
}