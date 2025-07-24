declare module "*.svg" {
  import React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Adicionar tipagem para evitar confusão entre src e tagName
declare module "*.svg?react" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Tipagem adicional para garantir uso correto
declare module "*.svg?url" {
  const src: string;
  export default src;
}