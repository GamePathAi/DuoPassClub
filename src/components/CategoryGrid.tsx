import React from 'react';
import { 
  Utensils, 
  Scissors, 
  Gamepad2, 
  Dumbbell, 
  ShoppingBag, 
  Wrench 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const categories = [
  { id: 'gastronomy', icon: Utensils, color: 'from-[#F6C100] to-[#C91F1F]' },
  { id: 'beauty', icon: Scissors, color: 'from-[#C91F1F] to-[#F6C100]' },
  { id: 'leisure', icon: Gamepad2, color: 'from-[#333333] to-[#C91F1F]' },
  { id: 'fitness', icon: Dumbbell, color: 'from-[#F6C100] to-[#333333]' },
  { id: 'shopping', icon: ShoppingBag, color: 'from-[#C91F1F] to-[#333333]' },
  { id: 'services', icon: Wrench, color: 'from-[#333333] to-[#F6C100]' },
];

interface CategoryGridProps {
  onCategorySelect?: (category: string) => void;
}

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF] hover:border-[#F6C100] hover:shadow-xl transition-all group"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#333333] text-center">
              {t(`category.${category.id}`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}