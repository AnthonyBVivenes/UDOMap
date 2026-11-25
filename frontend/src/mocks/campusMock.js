export const MOCK_META = {
  versionHash: 'v1.0.0-init',
  updatedAt: '2026-11-25T00:00:00Z',
};

export const MOCK_NODES = [
  {
    id: 'BIB-CENTRAL',
    name: 'Biblioteca Central Dr. Luis García Pelissier',
    code: 'BIB-01',
    type: 'SERVICE',
    department: 'Servicios Generales',
    lat: 10.1342,
    lng: -64.6661,
    photoUrl: '',
  },
  {
    id: 'LAB-CISCO',
    name: 'Laboratorio Cisco / Redes',
    code: 'CISCO',
    type: 'LAB',
    department: 'Computación y Sistemas',
    lat: 10.1335,
    lng: -64.6652,
    photoUrl: '',
  },
  {
    id: 'AULA-LPS1',
    name: 'Laboratorio de Programación y Sistemas 1',
    code: 'LPS1',
    type: 'LAB',
    department: 'Computación y Sistemas',
    lat: 10.1338,
    lng: -64.6649,
    photoUrl: '',
  },
  {
    id: 'EDIF-DECA',
    name: 'Decanato Núcleo de Anzoátegui',
    code: 'DECA',
    type: 'OFFICE',
    department: 'Decanato',
    lat: 10.1348,
    lng: -64.6668,
    photoUrl: '',
  },
];

export const MOCK_EDGES = [
  { id: 'E1', from: 'BIB-CENTRAL', to: 'AULA-LPS1', distanceMeters: 140, ease: 1, safety: 0.9 },
  { id: 'E2', from: 'AULA-LPS1', to: 'LAB-CISCO', distanceMeters: 45, ease: 1, safety: 0.95 },
  { id: 'E3', from: 'BIB-CENTRAL', to: 'EDIF-DECA', distanceMeters: 95, ease: 1, safety: 0.95 },
];

export const MOCK_SCHEDULES = [
  {
    id: 'SCH-1',
    nodeId: 'AULA-LPS1',
    subject: 'Estructuras de Datos',
    professor: 'Prof. Plácido Malavé',
    day: 'Miércoles',
    startTime: '08:00',
    endTime: '10:00',
  },
];