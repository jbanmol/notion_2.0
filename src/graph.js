/* ==========================================================================
   NEONOTION HOLOGRAPHIC NEURAL LINK MAP CONTROLLER (Task 1.1)
   ========================================================================== */

import { state } from './state.js';

export class GraphController {
    constructor() {
        this.overlayEl  = document.getElementById('neural-grid-graph-overlay');
        this.svgCanvas  = document.getElementById('graph-svg-canvas');
        this.viewportEl = document.getElementById('graph-nodes-viewport');
        this.btnOpen    = document.getElementById('view-graph-btn');
        this.btnClose   = document.getElementById('close-graph-btn');

        this.isOpen = false;
        this.init();
    }

    init() {
        if (this.btnOpen) {
            this.btnOpen.addEventListener('click', () => this.open());
        }
        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.close());
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close graph on backdrop click
        if (this.viewportEl) {
            this.viewportEl.addEventListener('click', (e) => {
                if (e.target === this.viewportEl) {
                    this.close();
                }
            });
        }

        // Resize handler to recalculate laser coordinates
        window.addEventListener('resize', () => {
            if (this.isOpen) {
                this.renderMap();
            }
        });
    }

    open() {
        this.isOpen = true;
        if (this.overlayEl) {
            this.overlayEl.classList.remove('hidden');
        }
        this.renderMap();
        
        // Log telemetry
        if (window.app && window.app.log) {
            window.app.log('SYS_MAP_ENGAGED // LOADING_ORBITAL_COORDS');
        }
    }

    close() {
        this.isOpen = false;
        if (this.overlayEl) {
            this.overlayEl.classList.add('hidden');
        }
        
        // Log telemetry
        if (window.app && window.app.log) {
            window.app.log('SYS_MAP_DISENGAGED // UPLINK_STANDBY');
        }
    }

    renderMap() {
        if (!this.viewportEl || !this.svgCanvas) return;

        this.viewportEl.innerHTML = '';
        this.svgCanvas.innerHTML = '';

        const docs = state.getDocuments();
        const activeDoc = state.getActiveDocument();

        // 1. Get viewport size coordinates
        const width = this.viewportEl.clientWidth || window.innerWidth;
        const height = this.viewportEl.clientHeight || window.innerHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // 2. Render Central Gateway Router Node Card
        const centerNode = document.createElement('div');
        centerNode.className = 'graph-node-bubble active-map-node';
        centerNode.style.left = `${centerX}px`;
        centerNode.style.top = `${centerY}px`;
        centerNode.innerHTML = `
            <div class="logo-icon-container" style="margin: 0 auto 6px auto;">
                <i data-lucide="cpu" class="pink pulsing" style="color: var(--neon-accent); filter: drop-shadow(0 0 6px var(--neon-accent-glow));"></i>
            </div>
            <div class="graph-node-title pink font-mono" style="font-size: 0.8rem; font-weight: bold; letter-spacing: 0.05em;">SYS_GATEWAY.EXE</div>
            <div class="graph-node-meta font-mono cyan" style="font-size: 0.6rem;">CORE_ACTIVE</div>
        `;
        this.viewportEl.appendChild(centerNode);

        // 3. Render Circular Document Nodes surrounding the core router
        const radius = Math.min(width, height) * 0.28;
        const docCount = docs.length;

        const docCoordinates = [];

        docs.forEach((doc, idx) => {
            const angle = (idx * 2 * Math.PI) / docCount - Math.PI / 2;
            const nodeX = centerX + radius * Math.cos(angle);
            const nodeY = centerY + radius * Math.sin(angle);

            docCoordinates.push({ docId: doc.id, x: nodeX, y: nodeY });

            const nodeCard = document.createElement('div');
            const isActive = doc.id === activeDoc.id;
            nodeCard.className = `graph-node-bubble ${isActive ? 'active-map-node' : ''}`;
            nodeCard.style.left = `${nodeX}px`;
            nodeCard.style.top = `${nodeY}px`;

            // Setup custom emoji/icon picker glyph
            const iconGlyph = doc.icon || '📄';

            nodeCard.innerHTML = `
                <div class="graph-node-icon-wrapper" style="font-size: 1.3rem; margin-bottom: 4px; line-height: 1;">${iconGlyph}</div>
                <div class="graph-node-title font-mono" style="font-size: 0.72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${doc.title}</div>
                <div class="graph-node-meta font-mono" style="font-size: 0.58rem; color: var(--text-muted);">SECTOR_NOD_${idx + 1}</div>
            `;

            // Click navigates straight to workspace node and closes graph overlay
            nodeCard.addEventListener('click', () => {
                state.setActiveDocument(doc.id);
                if (window.app) {
                    window.app.loadActiveDocument();
                    window.app.sidebar.render();
                    // Log
                    window.app.log(`WARPED_TO_NODE // ID: ${doc.id}`);
                }
                
                // Play refined key confirmation sound
                if (window.app && window.app.focusMode && window.app.focusMode.audio && !state.isGlobalAudioMuted()) {
                    window.app.focusMode.audio.warm();
                    window.app.focusMode.audio.playSoftClick();
                }
                
                setTimeout(() => this.close(), 200);
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
            
            const isActive = coord.docId === activeDoc.id;
            line.setAttribute('stroke', isActive ? 'var(--neon-secondary)' : 'var(--neon-primary)');
            line.setAttribute('filter', `drop-shadow(0 0 4px ${isActive ? 'var(--neon-secondary-glow)' : 'var(--neon-primary-glow)'})`);
            
            this.svgCanvas.appendChild(line);
        });

        // Initialize Lucide glyph icons inside bubbles
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
