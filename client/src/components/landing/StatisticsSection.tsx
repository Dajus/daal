interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '2,500+', label: 'Absolventů' },
  { value: '13', label: 'Typů kurzů' },
  { value: '15+', label: 'Let zkušeností' },
  { value: '98%', label: 'Úspěšnost' },
]

export const StatisticsSection = () => (
  <section className="py-24 bg-gray-50 dark:bg-gray-800 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
