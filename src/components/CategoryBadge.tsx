import React from 'react'; 
 
 interface CategoryBadgeProps { 
   category: string; 
   type: 'experience' | 'offer'; 
 } 
 
 const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, type }) => { 
   const getStyle = () => { 
     if (type === 'experience') { 
       return 'bg-purple-100 text-purple-800 border-purple-200'; 
     } 
     return 'bg-blue-100 text-blue-800 border-blue-200'; 
   }; 
 
   const getIcon = () => { 
     const icons = { 
       // Experiências 
       'Gastronomia': '🍽️', 
       'Entretenimento': '🎭', 
       'Cultura': '🎨', 
       'Arte': '🖼️', 
       'Música': '🎵', 
       'Teatro': '🎭', 
       
       // Ofertas 
       'Limpeza': '🧹', 
       'Beleza': '💄', 
       'Retail': '🛍️', 
       'Serviços': '🔧', 
       'Saúde': '⚕️', 
       'Tecnologia': '💻' 
     }; 
      
     return icons[category as keyof typeof icons] || '📦'; 
   }; 
 
   return ( 
     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStyle()}`}> 
       <span className="mr-1">{getIcon()}</span> 
       {category} 
     </span> 
   ); 
 }; 
 
 export default CategoryBadge;