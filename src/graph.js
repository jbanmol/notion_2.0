/* ==========================================================================
   NEONOTION HOLOGRAPHIC NEURAL LINK MAP CONTROLLER
   ========================================================================== */

import { state } from './state.js';

export class GraphController {
    constructor() {
        this.overlayEl = document.getElementById('neural-grid-graph-overlay');
        this.svgCanvas = document.getElementById('graph-svg-canvas');
        this.viewportEl = document.getElementById('graph-nodes-viewport');
        this.btnOpen = document.getElementById('view-graph-btn');
        this.btnClose = document.getElementById('close-graph-btn');

        this.isOpen = false;
        this.init();
    }

    init() {
        // Toggle view
        this.btnOpen.addEventListener('click', () => this.open());
        this.btnClose.addEventListener('click', () => this.close());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close graph on backdrop click (if clicking exactly the viewport area)
        this.viewportEl.addEventListener('click', (e) => {
            if (e.target === this.viewportEl) {
                this.close();
            }
        });

        // Resize handler to recalculate laser coordinates
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.renderMap();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.overlayEl.classList.remove('hidden');
        this.renderMap();
    }

    close() {
        this.isOpen = false;
        this.overlayEl.classList.add('hidden');
    }

    renderMap() {
        this.viewportEl.innerHTML = '';
        this.svgCanvas.innerHTML = '';

        const docs = state.getDocuments();
        const activeDoc = state.getActiveDocument();

        // 1. Get viewport size coordinates
        const width = this.viewportEl.clientWidth;
        const height = this.viewportEl.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // 2. Render Central Gateway Router Node Card
        const centerNode = document.createElement('div');
        centerNode.className = 'graph-node-bubble active-map-node';
        centerNode.style.left = `${centerX}px`;
        centerNode.style.top = `${centerY}px`;
        centerNode.innerHTML = `
            <i data-lucide="cpu" class="pink pulsing" style="color: var(--neon-accent); filter: drop-shadow(0 0 6px var(--neon-accent-glow));"></i>
            <div class="graph-node-title pink">SYS_GATEWAY.EXE</div>
            <div class="graph-node-meta font-mono cyan">GATEWAY_ACTIVE</div>
        `;
        this.viewportEl.appendChild(centerNode);

        // 3. Render Circular Document Nodes surrounding the core router
        const radius = Math.min(width, height) * 0.28; // Adjust radial spread based on space
        const docCount = docs.length;

        const docCoordinates = [];

        docs.forEach((doc, idx) => {
            const angle = (idx * 2 * Math.PI) / docCount - Math.PI / 2; // Distribute evenly
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);

            docCoordinates.push({ docId: doc.id, x: nodeX, y: nodeY });

            const nodeCard = document.createElement('div');
            const isActive = doc.id === activeDoc.id;
            nodeCard.className = `graph-node-bubble ${isActive ? 'active-map-node' : ''}`;
            nodeCard.style.left = `${nodeX}px`;
            nodeCard.style.top = `${nodeY}px`;

            // Setup custom matching lucide icon
            let iconName = doc.icon || 'file-text';
            if (doc.id === 'doc-security-audit') iconName = 'shield-alert';
            if (doc.id === 'doc-crew-logs') iconName = 'users';
            if (doc.id === 'doc-quantum-deck') iconName = 'cpu';
            if (doc.id === 'doc-timeline') iconName = 'git-branch';

            nodeCard.innerHTML = `
                <i data-lucide="${iconName}" class="${isActive ? 'cyan' : 'pink'}"></i>
                <div class="graph-node-title font-mono">${doc.title}</div>
                <div class="graph-node-meta font-mono">SECTOR_NOD_${idx + 1}</div>
            `;

            // Click navigates straight to workspace node and closes graph overlay drive
            nodeCard.addEventListener('click', () => {
                // Play futuristic key confirmation sound
                if (window.app && window.app.focus && window.app.focus.audio) {
                    window.app.focus.audio.playClick();
                }

                state.setActiveDocument(doc.id);
                if (window.app) {
                    window.app.loadActiveDocument();
                    window.app.sidebar.render();
                }
                
                // Close the graph view after choice
                setTimeout(() => this.close(), 180);
            });

            this.viewportEl.appendChild(nodeCard);
        });

        // 4. Render Glowing Pulsing SVG Laser Connectors linking pages to core gateway router
        docCoordinates.forEach(coord => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', coord.x);
            line.setAttribute('y2', coord.y);
            line.setAttribute('class', 'graph-laser-line');
            
            // Set dynamic glowing color values based on active/inactive states
            const isActive = coord.docId === activeDoc.id;
            line.setAttribute('stroke', isActive ? 'var(--neon-secondary)' : 'var(--neon-primary)');
            line.setAttribute('filter', `drop-shadow(0 0 4px ${isActive ? 'var(--neon-secondary-glow)' : 'var(--neon-primary-glow)'})`);
            
            this.svgCanvas.appendChild(line);
        });

        // Initialize Lucide glyph icons for floating graph bubbles
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
