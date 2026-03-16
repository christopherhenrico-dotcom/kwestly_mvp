import { FC } from 'react';
import { useQuestStore } from '@/stores/appStore';

const filters = [
  { label: 'ALL', value: 'all' },
  { label: 'EASY', value: 'easy' },
  { label: 'MEDIUM', value: 'medium' },
  { label: 'HARD', value: 'hard' },
  { label: 'ELITE', value: 'elite' },
];

const FilterBar: FC = () => {
  const { filter, setFilter } = useQuestStore();

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all duration-200 ${
            filter === f.value
              ? 'bg-primary/10 text-primary border-primary glow-cyan'
              : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
