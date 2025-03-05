'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function MermaidInitializer() {
  const { resolvedTheme } = useTheme();

  const processMermaidDiagrams = async () => {
    try {
      const mermaid = (await import('mermaid')).default;

      const isDarkTheme = resolvedTheme === 'dark';

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'neutral',
        themeVariables: {
          primaryColor: isDarkTheme ? '#6366f1' : '#4338ca',
          primaryTextColor: isDarkTheme ? '#f9fafb' : '#111827',
          primaryBorderColor: isDarkTheme ? '#4f46e5' : '#3730a3',
          lineColor: isDarkTheme ? '#6366f1' : '#4338ca',
          secondaryColor: isDarkTheme ? '#4b5563' : '#d1d5db',
          tertiaryColor: isDarkTheme ? '#1f2937' : '#f3f4f6',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          nodeBorder: isDarkTheme ? '#6366f1' : '#4338ca',
          edgeLabelBackground: isDarkTheme ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          background: isDarkTheme ? '#111827' : '#ffffff',
          mainBkg: isDarkTheme ? '#1f2937' : '#f3f4f6',
          textColor: isDarkTheme ? '#f9fafb' : '#111827',
          arrowheadColor: isDarkTheme ? '#6366f1' : '#4338ca',
          labelColor: isDarkTheme ? '#f9fafb' : '#111827',
          labelTextColor: isDarkTheme ? '#f9fafb' : '#111827',
          edgeColor: isDarkTheme ? '#6366f1' : '#4338ca',
          nodeTextColor: isDarkTheme ? '#f9fafb' : '#111827',
          edgeTextColor: isDarkTheme ? '#f9fafb' : '#111827',
          edgeTextFontWeight: 'bold',
          edgeTextFontSize: '14px',
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          useMaxWidth: true,
          rankSpacing: 100,
          nodeSpacing: 80,
          padding: 20,
        },
      });

      const mermaidCodeBlocks = document.querySelectorAll('pre > code.language-mermaid');

      mermaidCodeBlocks.forEach((codeBlock, index) => {
        const content = codeBlock.textContent || '';

        const diagramContainer = document.createElement('div');
        diagramContainer.className = 'mermaid';
        diagramContainer.id = `mermaid-diagram-${index}`;
        diagramContainer.textContent = content;

        const preElement = codeBlock.parentElement;
        if (preElement && preElement.parentElement) {
          preElement.parentElement.replaceChild(diagramContainer, preElement);
        }
      });

      mermaid.run();
    } catch (error) {
      console.error('Erro ao processar diagramas Mermaid:', error);
    }
  };

  useEffect(() => {
    processMermaidDiagrams();
  }, [resolvedTheme]);

  return null;
} 