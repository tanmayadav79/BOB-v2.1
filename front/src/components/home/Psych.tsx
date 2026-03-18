import { ExternalLink } from 'lucide-react'

const topics = [
  { id: 1, title: 'Understanding Anxiety', description: 'Learn symptoms and coping strategies.', link: 'https://www.mentalhealth.org.uk/a-to-z/a/anxiety', type: 'article', source: 'MentalHealth.org.uk', thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80&auto=format' },
  { id: 2, title: 'Depression Awareness', description: 'Causes, signs, and treatment options.', link: 'https://www.nimh.nih.gov/health/topics/depression', type: 'doc', source: 'NIMH', thumbnail: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80&auto=format' },
  { id: 3, title: 'Mindfulness and Meditation', description: 'Practices to improve mental wellness.', link: 'https://www.mindful.org/meditation/mindfulness-getting-started/', type: 'magazine', source: 'Mindful', thumbnail: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?w=800&q=80&auto=format' },
  { id: 4, title: 'Guided Breath: Short Practice', description: 'A 6-minute guided breathing exercise for beginners.', link: 'https://www.youtube.com/watch?v=inpok4MKVLM', type: 'video', source: 'YouTube', thumbnail: 'https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg' },
  { id: 5, title: 'Mental Wellness Magazine — Issue 5', description: 'Student stories, self-care tips and campus guidance.', link: 'https://example.com/magazine/issue5.pdf', type: 'magazine', source: 'Campus Wellness', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80&auto=format' },
  { id: 6, title: 'Stress Management for Students', description: 'Ways to handle academic pressure, deadlines, and burnout.', link: 'https://www.apa.org/topics/stress', type: 'article', source: 'APA.org', thumbnail: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80&auto=format' },
  { id: 7, title: 'Emotional Wellbeing 101', description: 'Understanding your emotions and managing them.', link: 'https://www.healthline.com/health/emotional-health', type: 'article', source: 'Healthline', thumbnail: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=800&q=80&auto=format' },
  { id: 8, title: 'Human Connection and Empathy', description: 'Why empathy and compassion matter in everyday life.', link: 'https://greatergood.berkeley.edu/topic/empathy', type: 'article', source: 'Berkeley Well-Being Institute', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format' },
  { id: 9, title: 'Healthy Sleep Habits for Students', description: 'Improve sleep to boost focus, mood, and productivity.', link: 'https://www.cdc.gov/sleep/index.html', type: 'article', source: 'CDC', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format' },
  { id: 10, title: 'Yoga for Beginners', description: 'Routine to reduce stress and improve mobility.', link: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', type: 'video', source: 'Yoga with Adriene', thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg' },
  { id: 11, title: 'Building Confidence and Self-Esteem', description: 'For students dealing with self-doubt and negative thoughts.', link: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/self-esteem/', type: 'article', source: 'Mind UK', thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80&auto=format' },
  { id: 12, title: 'How to Make Friends in College', description: 'Tips for social anxiety, networking, and building community.', link: 'https://www.psychologytoday.com/us/basics/social-life', type: 'article', source: 'Psychology Today', thumbnail: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=800&q=80&auto=format' },
]

const typeBadge: Record<string, string> = {
  article: 'bg-[var(--rose-light)] text-[var(--ink)]',
  video: 'bg-[var(--blue-light)] text-[var(--ink)]',
  doc: 'bg-[var(--rose-soft)] text-[var(--ink)]',
  magazine: 'bg-[var(--blue-medium)] text-[var(--ink)]',
}

export const PsychEducation = () => (
  <div className='px-6 sm:px-10 lg:px-16 py-10 pb-16 max-w-[1400px] mx-auto'>
    <span className='text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[var(--rose-medium)] block mb-2'>Learn & Grow</span>
    <h2 className='font-cormorant text-[clamp(2rem,3.5vw,3rem)] font-light text-[var(--ink)] leading-tight mb-2'>The more you know</h2>
    <p className='text-[var(--ink-muted)] text-[0.9rem] font-light leading-relaxed max-w-[540px] mb-8'>Curated articles, videos, and guides for mental health awareness and wellbeing.</p>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {topics.map(t => (
        <div key={t.id} className='bg-white rounded-[18px] overflow-hidden border-[1.5px] border-[rgba(255,167,166,0.15)] shadow-[0_4px_20px_rgba(44,44,44,0.04)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(44,44,44,0.1)] transition-all duration-300 flex flex-col'>
          <img src={t.thumbnail} alt={t.title} className='w-full h-[160px] object-cover' />
          <div className='p-4 flex flex-col flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <span className={`text-[0.62rem] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full ${typeBadge[t.type] || typeBadge.article}`}>{t.type}</span>
              <span className='text-[0.7rem] text-[var(--ink-muted)]'>{t.source}</span>
            </div>
            <div className='font-cormorant text-[1.1rem] font-normal text-[var(--ink)] mb-1 leading-snug'>{t.title}</div>
            <p className='text-[0.82rem] text-[var(--ink-muted)] font-light leading-relaxed flex-1 mb-3'>{t.description}</p>
            <a href={t.link} target='_blank' rel='noreferrer' className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--ink)] text-white text-[0.73rem] font-medium no-underline self-start hover:-translate-y-px transition-transform duration-200'><span>View Resource</span><ExternalLink size={11} /></a>
          </div>
        </div>
      ))}
    </div>
  </div>
)
