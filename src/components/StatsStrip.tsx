import type { LucideIcon } from 'lucide-react'

type CatalogStat = {
  label: string
  value: string
  icon: LucideIcon
}

type StatsStripProps = {
  isLoading: boolean
  stats: CatalogStat[]
}

export function StatsStrip({ isLoading, stats }: StatsStripProps) {
  return (
    <section className="border-b border-line bg-white/45">
      <div className="mx-auto grid max-w-[1500px] gap-3 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-lg border border-line bg-paper p-4">
              <span className="grid size-10 place-items-center rounded-md bg-mist text-cobalt">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-extrabold leading-none text-ink">{isLoading ? '-' : stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-muted">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
