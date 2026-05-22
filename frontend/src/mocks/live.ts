export const mockLiveStreams = [
  {
    id: 'mock-live-1',
    title: 'Pocket show acustico',
    description: 'Uma sessao intimista com autorais, releituras brasileiras e pedidos do chat.',
    is_live: true,
    started_at: '2026-05-21T22:15:00.000Z',
    viewers_count: 248,
    peak_viewers: 384,
    category: 'MPB / Acustico',
    users: {
      name: 'Lia Andrade',
      avatar_color: '#FFD700',
    },
  },
  {
    id: 'mock-live-2',
    title: 'Beatmaking ao vivo',
    description: 'Criando uma base do zero e mostrando o processo de producao.',
    is_live: true,
    started_at: '2026-05-21T21:40:00.000Z',
    viewers_count: 96,
    peak_viewers: 141,
    category: 'Producao musical',
    users: {
      name: 'DJ Murilo V',
      avatar_color: '#51CF66',
    },
  },
  {
    id: 'mock-live-3',
    title: 'Ensaio aberto de jazz',
    description: 'Improvisos, standards e conversa sobre harmonia.',
    is_live: true,
    started_at: '2026-05-21T20:55:00.000Z',
    viewers_count: 173,
    peak_viewers: 219,
    category: 'Jazz',
    users: {
      name: 'Quarteto Norte',
      avatar_color: '#339AF0',
    },
  },
]

export const mockLiveMessages = [
  {
    user_id: 'mock-user-1',
    user_name: 'Camila',
    content: 'Som ta limpo demais hoje!',
    created_at: '2026-05-21T22:17:00.000Z',
  },
  {
    user_id: 'mock-user-2',
    user_name: 'Rafa',
    content: 'Toca aquela autoral nova no final?',
    created_at: '2026-05-21T22:18:00.000Z',
  },
  {
    user_id: 'mock-user-3',
    user_name: 'Nina',
    content: 'Cheguei agora e ja amei a vibe.',
    created_at: '2026-05-21T22:20:00.000Z',
  },
  {
    user_id: 'mock-user-4',
    user_name: 'Joao',
    content: 'Esse arranjo no violao ficou lindo.',
    created_at: '2026-05-21T22:22:00.000Z',
  },
]

export const mockLiveDonations = [
  {
    id: 'mock-donation-1',
    amount: 25,
    created_at: '2026-05-21T22:19:00.000Z',
    users: { name: 'Camila' },
  },
  {
    id: 'mock-donation-2',
    amount: 50,
    created_at: '2026-05-21T22:24:00.000Z',
    users: { name: 'Rafa' },
  },
]

export const mockLiveActivities = [
  'Camila enviou um donate de R$25',
  'Rafa pediu uma musica no chat',
  '32 pessoas entraram nos ultimos 5 minutos',
]

export const getMockLiveStream = (streamId?: string) =>
  mockLiveStreams.find((stream) => stream.id === streamId) ?? mockLiveStreams[0]
