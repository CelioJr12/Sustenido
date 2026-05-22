import { useNavigate } from 'react-router-dom'
import { mockLiveActivities, mockLiveDonations, mockLiveMessages, mockLiveStreams } from '../mocks/live'

const Dashboard = () => {
  const navigate = useNavigate()
  const featuredLive = mockLiveStreams[0]
  const totalViewers = mockLiveStreams.reduce((total, stream) => total + stream.viewers_count, 0)
  const peakViewers = Math.max(...mockLiveStreams.map((stream) => stream.peak_viewers))
  const totalDonations = mockLiveDonations.reduce((total, donation) => total + donation.amount, 0)

  const stats = [
    { label: 'Assistindo agora', value: totalViewers.toString(), detail: `${mockLiveStreams.length} lives ativas` },
    { label: 'Pico de audiencia', value: peakViewers.toString(), detail: featuredLive.title },
    { label: 'Donates hoje', value: `R$${totalDonations}`, detail: `${mockLiveDonations.length} contribuicoes` },
    { label: 'Mensagens no chat', value: mockLiveMessages.length.toString(), detail: 'ultimos minutos' },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="flex items-center justify-between px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
        <h1 className="text-[#FFD700] font-bold text-2xl"># SUSTENIDO</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/perfil')}
            className="bg-[#2A2A2A] text-white px-4 py-2 rounded-full hover:bg-[#3A3A3A] transition-all text-sm"
          >
            Voltar ao perfil
          </button>
          <button
            onClick={() => navigate('/live')}
            className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-full hover:opacity-90 transition-all text-sm"
          >
            Ir para live
          </button>
        </div>
      </header>

      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-1 mb-6">
          <p className="text-[#FFD700] text-sm font-bold">Dashboard do artista</p>
          <h2 className="text-3xl font-bold">Visao geral da live</h2>
          <p className="text-[#A0A0A0] text-sm">
            Primeira versao com dados mockados para acompanhar audiencia, chat e atividade.
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <p className="text-[#A0A0A0] text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-[#FFD700] text-xs mt-2">{stat.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-bold text-xl">{featuredLive.title}</h3>
                <p className="text-[#A0A0A0] text-sm mt-1">{featuredLive.description}</p>
              </div>
              <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-600 text-red-400 text-xs px-3 py-1 rounded-full font-bold shrink-0">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                AO VIVO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              {mockLiveStreams.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => navigate(`/watch/${stream.id}`)}
                  className="text-left bg-[#2A2A2A]/60 border border-[#3A3A3A] rounded-xl p-4 hover:border-[#FFD700]/60 transition-all"
                >
                  <p className="font-bold text-sm truncate">{stream.users.name}</p>
                  <p className="text-[#A0A0A0] text-xs mt-1 truncate">{stream.category}</p>
                  <p className="text-[#FFD700] text-sm mt-3">{stream.viewers_count} assistindo</p>
                </button>
              ))}
            </div>

            <div className="h-44 flex items-end gap-2 border-t border-[#2A2A2A] pt-5">
              {[42, 58, 73, 64, 91, 112, 138, 121, 156, 184, 171, 213].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                  <div
                    className="w-full rounded-t bg-[#FFD700] min-h-2"
                    style={{ height: `${Math.max(12, value / 2.4)}%` }}
                  ></div>
                  <span className="text-[10px] text-[#A0A0A0]">{index + 1}m</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">Chat recente</h3>
              <div className="flex flex-col gap-3">
                {mockLiveMessages.map((message) => (
                  <div key={`${message.user_id}-${message.created_at}`} className="bg-[#2A2A2A]/50 rounded-lg p-3">
                    <p className="text-[#FFD700] text-sm font-bold">{message.user_name}</p>
                    <p className="text-[#E0E0E0] text-sm mt-1">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">Atividade</h3>
              <div className="flex flex-col gap-3">
                {mockLiveActivities.map((activity) => (
                  <p key={activity} className="text-[#A0A0A0] text-sm border-b border-[#2A2A2A] pb-3 last:border-b-0 last:pb-0">
                    {activity}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
