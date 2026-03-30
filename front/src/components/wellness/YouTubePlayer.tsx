import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'

interface Video {
  id: string
  title: string
  channel: string
  duration: string
  tag: string
  tagColor: string
}

const VIDEOS: Video[] = [
  { id: 'dknTQktH5Z0', title: 'Anxiety Explained Clearly', channel: 'YouTube', duration: '-', tag: 'Anxiety', tagColor: 'bg-[var(--rose-light)] text-[var(--rose-medium)]' },
  { id: 'Ii53BtHLnGk', title: 'Depression Broken Down Simply', channel: 'YouTube', duration: '-', tag: 'Depression', tagColor: 'bg-[var(--blue-light)] text-[#3b6cb7]' },
  { id: 'Mo1A45ShcMo', title: 'Stress Explained with Ease', channel: 'YouTube', duration: '-', tag: 'Stress', tagColor: 'bg-[var(--rose-soft)] text-[#b05a00]' },
  { id: 'Q9yKaI0vLJs', title: 'OCD Demystified Simply', channel: 'YouTube', duration: '-', tag: 'OCD', tagColor: 'bg-[var(--rose-light)] text-[var(--rose-medium)]' },
  { id: '-NVoikSV-cQ', title: 'ADHD Explained Clearly', channel: 'YouTube', duration: '-', tag: 'ADHD', tagColor: 'bg-[var(--blue-light)] text-[#3b6cb7]' },
  { id: 'F45Al_62Lz4', title: 'Sleep Disorders Made Clear', channel: 'YouTube', duration: '-', tag: 'Sleep', tagColor: 'bg-[var(--rose-soft)] text-[#b05a00]' },
  { id: 'ttHu_N-zAnQ', title: 'Mental Health Simplified Guide', channel: 'YouTube', duration: '-', tag: 'Mental Health', tagColor: 'bg-[rgba(176,162,210,0.12)] text-[#6b5b9e]' },
  { id: 'gyQX6bU1NIY', title: 'Fix Your Sleep Easily', channel: 'YouTube', duration: '-', tag: 'Sleep', tagColor: 'bg-[var(--rose-soft)] text-[#b05a00]' },
  { id: 'CDFxLsF4d4Q', title: 'Relax Your Mind Quickly', channel: 'YouTube', duration: '-', tag: 'Relaxation', tagColor: 'bg-green-50 text-green-700' },
  { id: 'J0shA9J-4Nc', title: 'Mental Health Made Clear', channel: 'YouTube', duration: '-', tag: 'Mental Health', tagColor: 'bg-[rgba(176,162,210,0.12)] text-[#6b5b9e]' },
  { id: 'awhOrqGb-TU', title: 'Reduce Stress with Ease', channel: 'YouTube', duration: '-', tag: 'Stress', tagColor: 'bg-[var(--rose-soft)] text-[#b05a00]' },
  { id: 'u_qfAtvX8Os', title: 'OCD Thoughts Explained Simply', channel: 'YouTube', duration: '-', tag: 'OCD', tagColor: 'bg-[var(--rose-light)] text-[var(--rose-medium)]' },
  { id: '7fWo_Yme2G0', title: 'OCD Habits Made Clear', channel: 'YouTube', duration: '-', tag: 'OCD', tagColor: 'bg-[var(--rose-light)] text-[var(--rose-medium)]' },
  { id: 'sqyTEcLlt88', title: 'ADHD Daily Life Simplified', channel: 'YouTube', duration: '-', tag: 'ADHD', tagColor: 'bg-[var(--blue-light)] text-[#3b6cb7]' },
  { id: 'Eqw0K676F5M', title: 'Improve Focus with ADHD', channel: 'YouTube', duration: '-', tag: 'ADHD', tagColor: 'bg-[var(--blue-light)] text-[#3b6cb7]' },
]

function VideoCard({ video, isPlaying, onPlay }: { video: Video; isPlaying: boolean; onPlay: () => void }) {
  const thumb = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`

  return (
    <div className='bg-white rounded-[18px] overflow-hidden border-[1.5px] border-[rgba(255,167,166,0.18)] shadow-[0_4px_16px_rgba(44,44,44,0.05)] hover:shadow-[0_10px_30px_rgba(44,44,44,0.1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col'>
      {isPlaying ? (
        <div className='relative w-full' style={{ paddingTop: '56.25%' }}>
          <iframe className='absolute inset-0 w-full h-full' src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`} title={video.title} frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        </div>
      ) : (
        <button onClick={onPlay} className='relative w-full border-none p-0 cursor-pointer bg-transparent' style={{ paddingTop: '56.25%' }}>
          <img src={thumb} alt={video.title} className='absolute inset-0 w-full h-full object-cover' />
          <div className='absolute inset-0 bg-[rgba(44,44,44,0.28)] flex items-center justify-center hover:bg-[rgba(44,44,44,0.16)] transition-colors duration-200'>
            <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.22)]'>
              <Play size={18} fill='var(--ink)' className='text-[var(--ink)] ml-0.5' />
            </div>
          </div>
        </button>
      )}
      <div className='p-4 flex-1 flex flex-col'>
        <div className='flex items-center gap-2 mb-2'>
          <span className={`text-[0.6rem] font-medium tracking-[0.08em] uppercase px-2 py-0.5 rounded-full ${video.tagColor}`}>{video.tag}</span>
          <span className='text-[0.72rem] text-[var(--ink-muted)]'>{video.duration}</span>
        </div>
        <p className='font-cormorant text-[1.05rem] font-normal text-[var(--ink)] leading-snug flex-1'>{video.title}</p>
        <p className='text-[0.75rem] text-[var(--ink-muted)] font-light mt-1 mb-3'>{video.channel}</p>
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 text-[0.7rem] text-[var(--ink-muted)] no-underline hover:text-[var(--rose-medium)] transition-colors duration-200'>
          <ExternalLink size={11} />
          Watch on YouTube
        </a>
      </div>
    </div>
  )
}

export default function YouTubePlayer() {
  const [playing, setPlaying] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const tags = ['All', ...Array.from(new Set(VIDEOS.map(v => v.tag)))]
  const shown = filter === 'All' ? VIDEOS : VIDEOS.filter(v => v.tag === filter)

  return (
    <div className='bg-white rounded-[24px] p-6 sm:p-8 border-[1.5px] border-[rgba(255,167,166,0.2)] shadow-[0_6px_30px_rgba(44,44,44,0.05)]'>
      <span className='text-[0.68rem] font-medium tracking-[0.12em] uppercase text-[var(--rose-medium)] block mb-1'>Guided Videos</span>
      <h3 className='font-cormorant text-[1.7rem] font-light text-[var(--ink)] leading-tight mb-1'>Watch & Unwind</h3>
      <p className='text-[0.84rem] text-[var(--ink-muted)] font-light mb-5'>Play directly here - no need to leave the page.</p>

      <div className='flex gap-2 flex-wrap mb-6'>
        {tags.map(t => (
          <button key={t} onClick={() => { setFilter(t); setPlaying(null) }} className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium border-[1.5px] cursor-pointer transition-all duration-200 ${filter === t ? 'bg-[var(--ink)] text-white border-[var(--ink)]' : 'bg-[var(--rose-whisper)] text-[var(--ink-muted)] border-transparent hover:border-[var(--rose-medium)] hover:text-[var(--rose-medium)]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {shown.map(v => (
          <VideoCard key={v.id} video={v} isPlaying={playing === v.id} onPlay={() => setPlaying(playing === v.id ? null : v.id)} />
        ))}
      </div>
    </div>
  )
}
