import { useEffect, useState } from 'react'
import { projects } from './data/projects'
import { Scene } from './scene/Scene'
import { useScrollScene } from './scene/useScrollScene'

// TODO: ganti dengan data kamu
const NAME = 'Defarrel'
const FULL_NAME = 'Defarrel Danendra Praja'
const EMAIL = 'defarreldanendra@gmail.com'
const LINKS = [
  { label: 'YouTube — Gloy Space', href: 'https://www.youtube.com/@gloyspace' },
  { label: 'GitHub', href: 'https://github.com/Defarrel' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/defarreldanendrapraja/' },
]
const SKILLS = ['Flutter', 'Dart', 'Python', 'Machine Learning', 'SQL', 'REST API', 'Firebase', 'Git']
const TIMELINE = [
  { when: 'Now', what: 'Software Developer Apprentice', where: 'PT Tiga Serangkai Pustaka Mandiri · MagangHub' },
  { when: '2026', what: 'Associate Data Scientist', where: 'BNSP certification' },
  { when: '2025', what: 'Backend Developer Intern', where: 'Diskominfo Kabupaten Bantul' },
  { when: '2022', what: 'Information Technology · GPA 3.89', where: 'Universitas Muhammadiyah Yogyakarta · Database TA' },
]
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

// Which section is in the middle of the screen right now.
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    )
    document.querySelectorAll('main > section').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return active
}

// Text rolls up and is replaced by a glowing copy on hover.
function RollText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden leading-[1.3]">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full text-glow transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

function Label({ n, children }: { n: string; children: string }) {
  return (
    <p data-reveal className="text-xs tracking-[0.3em] text-dim uppercase">
      ({n}) {children}
    </p>
  )
}

const underline =
  'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:100%_100%] bg-no-repeat pb-1 transition-[background-size,color] duration-500 hover:bg-[length:100%_1px] hover:bg-[position:0_100%] focus-visible:bg-[length:100%_1px]'

export default function App() {
  useScrollScene()
  const active = useActiveSection()

  return (
    <>
      <Scene />
      <div className="vignette" aria-hidden />

      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-xs tracking-[0.25em] uppercase md:px-10">
        <a href="#top" className="group font-medium">
          <RollText>{NAME}</RollText>
        </a>
        <nav className="flex gap-5 md:gap-9">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="group relative" aria-current={active === n.id ? 'true' : undefined}>
              <RollText>{n.label}</RollText>
              <span
                className={`absolute -bottom-2.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-glow shadow-[0_0_8px_2px] shadow-glow/70 transition-all duration-500 ${
                  active === n.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              />
            </a>
          ))}
        </nav>
      </header>

      <main className="relative z-10">
        <section id="top" className="relative flex min-h-svh flex-col justify-center px-5 md:px-10">
          <p className="mb-6 text-xs tracking-[0.3em] text-dim uppercase">(00) Portfolio</p>
          <h1 className="max-w-5xl text-[13vw] leading-[0.9] font-light tracking-tight md:text-[8.5vw]">
            Exploring the <em className="font-serif text-glow">unknown</em>, one build at a time.
          </h1>
          <p className="mt-8 max-w-md text-dim">
            Flutter developer &amp; machine learning engineer from Yogyakarta. Also orbiting on YouTube at Gloy Space.
          </p>
          <div className="absolute inset-x-5 bottom-8 flex justify-between text-xs tracking-[0.3em] text-dim uppercase md:inset-x-10">
            <span>Scroll to explore ↓</span>
            <span className="hidden md:inline">K2-18b · 124 light-years</span>
          </div>
        </section>

        <section id="about" className="flex min-h-svh items-center px-5 py-28 md:px-10">
          <div className="max-w-xl">
            <Label n="01">About</Label>
            <p data-reveal className="mt-8 text-2xl leading-snug font-light md:text-4xl">
              I'm {NAME}. I build mobile apps end to end, and use machine learning to turn data into{' '}
              <em className="font-serif text-glow">clear</em> decisions.
            </p>
            <ul data-reveal className="mt-10 flex flex-wrap gap-2 text-sm text-dim">
              {SKILLS.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/15 px-4 py-1.5 transition-colors duration-300 hover:border-glow/60 hover:text-white"
                >
                  {s}
                </li>
              ))}
            </ul>
            <ol data-reveal className="mt-12 border-t border-white/10">
              {TIMELINE.map((t) => (
                <li key={t.what} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-white/10 py-4">
                  <span className={`pt-0.5 text-xs tracking-widest uppercase ${t.when === 'Now' ? 'text-leaf' : 'text-dim'}`}>
                    {t.when}
                  </span>
                  <span>
                    <span className="block">{t.what}</span>
                    <span className="block text-sm text-dim">{t.where}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="work" className="flex min-h-svh items-center px-5 py-32 md:justify-end md:px-10">
          <div className="w-full md:w-[58%]">
            <div className="mb-10 flex items-baseline justify-between">
              <Label n="02">Selected works</Label>
              <span data-reveal className="text-xs tracking-[0.3em] text-dim uppercase">
                {String(projects.length).padStart(2, '0')} projects
              </span>
            </div>

            <ol className="group/list">
              {projects.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal
                  className="border-t border-white/10 last:border-b"
                >
                  <a
                    href={p.url}
                    target={p.url ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group/row relative block py-7 outline-none transition-opacity duration-500 md:py-9 md:group-hover/list:opacity-35 md:hover:opacity-100!"
                  >
                    {/* glow wash that rises from the bottom on hover */}
                    <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-linear-to-t from-glow/10 to-transparent transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover/row:scale-y-100 group-focus-visible/row:scale-y-100" />

                    <div className="relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4">
                      <span className="text-xs text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-2xl font-light transition-[translate,color] duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover/row:translate-x-3 group-hover/row:text-glow md:text-4xl">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="hidden text-xs text-dim tabular-nums sm:inline">{p.year}</span>
                        {p.url && (
                          <span className="grid size-10 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover/row:border-glow group-hover/row:bg-glow group-hover/row:text-ink">
                            <span className="-rotate-45 transition-transform duration-500 group-hover/row:rotate-0">→</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* details: always shown on touch screens, slide open on hover on desktop */}
                    <div className="relative grid grid-rows-[1fr] pl-[3.5rem] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.76,0,.24,1)] md:grid-rows-[0fr] md:group-hover/row:grid-rows-[1fr] md:group-focus-visible/row:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="pt-4 text-sm text-dim md:max-w-md">{p.description}</p>
                        <ul className="flex flex-wrap gap-2 pt-4">
                          {p.tags.map((t) => (
                            <li key={t} className="rounded-full border border-leaf/30 px-3 py-1 text-[11px] tracking-wider text-leaf uppercase">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className="relative flex min-h-svh flex-col items-center justify-center px-5 text-center">
          <Label n="03">Contact</Label>
          <h2 data-reveal className="mt-8 text-[18vw] leading-none font-light md:text-[11vw]">
            Say <em className="font-serif text-glow">hello.</em>
          </h2>
          <a data-reveal href={`mailto:${EMAIL}`} className={`mt-10 text-lg hover:text-glow md:text-2xl ${underline}`}>
            {EMAIL}
          </a>
          <ul data-reveal className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs tracking-[0.2em] text-dim uppercase">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className={`hover:text-white ${underline}`}>
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="absolute bottom-6 text-xs text-dim">© {new Date().getFullYear()} {FULL_NAME}</p>
        </section>
      </main>
    </>
  )
}
