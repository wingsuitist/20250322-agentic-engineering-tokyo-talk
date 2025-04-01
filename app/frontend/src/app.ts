import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import mermaid from 'mermaid';
import './styles.css';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

// Define the Alpine.js application
document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    prompt: '',
    diagram: '',
    loading: false,
    error: '',

    async generateDiagram() {
      if (!this.prompt.trim()) {
        this.error = 'Please enter a prompt';
        return;
      }

      this.loading = true;
      this.error = '';
      this.diagram = '';

      try {
        const response = await fetch('http://localhost:3001/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: this.prompt }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate diagram');
        }

        this.diagram = data.diagram;
        
        // Render the mermaid diagram
        setTimeout(() => {
          try {
            const container = document.getElementById('diagram-container');
            if (container) {
              container.innerHTML = `<div class="mermaid">${this.diagram}</div>`;
              mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }
          } catch (renderError) {
            console.error('Error rendering mermaid diagram:', renderError);
            this.error = 'Error rendering diagram. Please check the console for details.';
          }
        }, 100);
      } catch (error) {
        console.error('Error generating diagram:', error);
        this.error = error instanceof Error ? error.message : 'An unknown error occurred';
      } finally {
        this.loading = false;
      }
    },

    copyDiagramCode() {
      if (!this.diagram) return;
      
      navigator.clipboard.writeText(this.diagram)
        .then(() => {
          alert('Diagram code copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy diagram code:', err);
          alert('Failed to copy diagram code');
        });
    }
  }));
});

// Register Alpine.js plugins
Alpine.plugin(persist);

// Start Alpine.js
window.Alpine = Alpine;
Alpine.start();
