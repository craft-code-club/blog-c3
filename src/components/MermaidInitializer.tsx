'use client';

import { useEffect } from 'react';

export default function MermaidInitializer() {
  useEffect(() => {
    const processMermaidDiagrams = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose'
        });
        
        // Encontrar todos os blocos de código com classe 'language-mermaid'
        const mermaidCodeBlocks = document.querySelectorAll('pre > code.language-mermaid');
        
        // Para cada bloco de código mermaid
        mermaidCodeBlocks.forEach((codeBlock, index) => {
          // Obter o conteúdo do diagrama
          const content = codeBlock.textContent || '';
          
          // Criar um novo elemento div para o diagrama
          const diagramContainer = document.createElement('div');
          diagramContainer.className = 'mermaid';
          diagramContainer.id = `mermaid-diagram-${index}`;
          diagramContainer.textContent = content;
          
          // Substituir o bloco de código pelo novo elemento
          const preElement = codeBlock.parentElement;
          if (preElement && preElement.parentElement) {
            preElement.parentElement.replaceChild(diagramContainer, preElement);
          }
        });
        
        // Renderizar todos os diagramas
        mermaid.run();
      } catch (error) {
        console.error('Erro ao processar diagramas Mermaid:', error);
      }
    };
    
    // Executar o processamento após o carregamento da página
    processMermaidDiagrams();
  }, []);

  return null;
} 