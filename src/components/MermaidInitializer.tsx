'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function MermaidInitializer() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const processMermaidDiagrams = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        // Configuração baseada no tema atual
        const isDarkTheme = resolvedTheme === 'dark';
        
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'neutral',
          themeVariables: {
            primaryColor: isDarkTheme ? '#6366f1' : '#5a67d8',
            primaryTextColor: isDarkTheme ? '#f9fafb' : '#ffffff',
            primaryBorderColor: isDarkTheme ? '#4f46e5' : '#4c51bf',
            lineColor: isDarkTheme ? '#6366f1' : '#5a67d8',
            secondaryColor: isDarkTheme ? '#4b5563' : '#6b7280',
            tertiaryColor: isDarkTheme ? '#1f2937' : '#f0f4f8',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '16px',
            nodeBorder: isDarkTheme ? '#6366f1' : '#5a67d8',
            edgeLabelBackground: isDarkTheme ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            background: isDarkTheme ? '#111827' : '#ffffff',
            mainBkg: isDarkTheme ? '#1f2937' : '#f0f4f8',
            textColor: isDarkTheme ? '#f9fafb' : '#333333',
          }
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
  }, [resolvedTheme]); // Adicionar resolvedTheme como dependência para re-renderizar quando o tema mudar

  return null;
} 