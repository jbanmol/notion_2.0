/* ==========================================================================
   NEONOTION HOLOGRAPHIC COMMAND PALETTE & AI DECRYPTOR
   ========================================================================== */

import { state } from './state.js';

export class CommandPaletteComponent {
    constructor(editorRefreshCallback) {
        this.paletteEl = document.getElementById('command-palette');
        this.searchInputEl = document.getElementById('palette-search-input');
        this.resultsEl = document.getElementById('palette-results');
        
        this.editorRefreshCallback = editorRefreshCallback;
        
        this.isOpen = false;
        this.selectedIndex = 0;
        this.filteredItems = [];
        
        // Static Command Lists
        this.aiCommands = [
            {
                id: 'ai-summarize',
                title: '⚡ AI: Summarize Page Telemetry',
                subtitle: 'Neural network parses active page content into core abstracts',
                type: 'ai',
                icon: 'brain-circuit'
            },
            {
                id: 'ai-tasks',
                title: '📋 AI: Extract Core Action Items',
                subtitle: 'Generates active checklist nodes directly into this page',
                type: 'ai',
                icon: 'check-square'
            },
            {
                id: 'ai-related',
                title: '🔍 AI: Query Correlated Nodes',
                subtitle: 'Scans matrix workspace for semantically linked resources',
                type: 'ai',
                icon: 'network'
            },
            {
                id: 'ai-weekly',
                title: '📅 AI: Inject Weekly Operations Plan',
                subtitle: 'Deploys a pre-formatted operational calendar block',
                type: 'ai',
                icon: 'calendar-range'
            }
        ];

        this.initEventListeners();
    }

    initEventListeners() {
        // Toggle on search button click
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.toggleOpen());
        }

        // Global hotkeys: Cmd+K / Ctrl+K & Slash in body
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.toggleOpen();
            }

            if (e.key === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });

        // Close on backdrop click
        this.paletteEl.addEventListener('click', (e) => {
            if (e.target === this.paletteEl) {
                this.close();
            }
        });

        // Input keyboard routing & typing
        this.searchInputEl.addEventListener('input', () => this.handleSearch());
        this.searchInputEl.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    toggleOpen() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.paletteEl.classList.remove('hidden');
        this.searchInputEl.value = '';
        this.selectedIndex = 0;
        this.searchInputEl.focus();
        this.handleSearch(); // Populate defaults
    }

    close() {
        this.isOpen = false;
        this.paletteEl.classList.add('hidden');
    }

    handleSearch() {
        const query = this.searchInputEl.value.toLowerCase().trim();
        const activeDoc = state.getActiveDocument();
        const documents = state.getDocuments();

        // 1. Get available documents (excluding the current one)
        const docItems = documents
            .filter(doc => doc.id !== activeDoc.id)
            .map(doc => ({
                id: `switch-${doc.id}`,
                title: `🌐 Switch Node: ${doc.title}`,
                subtitle: `Jump immediately to sector data element [${doc.id}]`,
                type: 'doc',
                docId: doc.id,
                icon: doc.icon || 'file-text'
            }));

        // 2. Get static theme shifts
        const themeItems = [
            { id: 'theme-opt-obsidian', title: '🎨 Theme: Initialize Obsidian Core', subtitle: 'Midnight canvas with high-voltage purple elements', type: 'theme', value: 'theme-obsidian', icon: 'palette' },
            { id: 'theme-opt-vaporwave', title: '🎨 Theme: Calibrate Glitch Pink', subtitle: 'Neon magenta deck with subtle scanline overlays', type: 'theme', value: 'theme-vaporwave', icon: 'palette' },
            { id: 'theme-opt-amber', title: '🎨 Theme: Calibrate Tech Amber', subtitle: 'Retro-futuristic military golden tactical hud theme', type: 'theme', value: 'theme-amber', icon: 'palette' }
        ];

        const allItems = [...this.aiCommands, ...docItems, ...themeItems];

        // Filter list based on query
        if (query === '') {
            this.filteredItems = allItems;
        } else {
            this.filteredItems = allItems.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.subtitle.toLowerCase().includes(query)
            );
        }

        this.selectedIndex = Math.min(this.selectedIndex, this.filteredItems.length - 1);
        if (this.selectedIndex < 0) this.selectedIndex = 0;

        this.renderResults();
    }

    renderResults() {
        this.resultsEl.innerHTML = '';

        if (this.filteredItems.length === 0) {
            this.resultsEl.innerHTML = `
                <div class="font-mono text-center padding-20" style="padding: 24px; color: var(--text-muted);">
                    ⚠️ QUERY ERROR: NO CORRELATED COMMANDS IN SECTOR ARCHIVE
                </div>
            `;
            return;
        }

        this.filteredItems.forEach((item, index) => {
            const isActive = index === this.selectedIndex;
            
            const div = document.createElement('div');
            div.className = `palette-item ${isActive ? 'active' : ''}`;
            div.innerHTML = `
                <div class="palette-item-left">
                    <i data-lucide="${item.icon || 'terminal'}" class="${isActive ? 'cyan' : 'pink'}"></i>
                    <div>
                        <div style="font-weight: 500; font-size: 0.95rem;">${item.title}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.subtitle}</div>
                    </div>
                </div>
                <span class="palette-item-type">${item.type.toUpperCase()}</span>
            `;

            // Hover to set active selection
            div.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateActiveItemVisuals();
            });

            // Click to run
            div.addEventListener('click', () => {
                this.executeItem(item);
            });

            this.resultsEl.appendChild(div);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    updateActiveItemVisuals() {
        const itemEls = this.resultsEl.querySelectorAll('.palette-item');
        itemEls.forEach((el, index) => {
            if (index === this.selectedIndex) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredItems.length;
            this.updateActiveItemVisuals();
            this.resultsEl.children[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
            this.updateActiveItemVisuals();
            this.resultsEl.children[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.filteredItems[this.selectedIndex]) {
                this.executeItem(this.filteredItems[this.selectedIndex]);
            }
        }
    }

    executeItem(item) {
        this.close();

        if (item.type === 'doc') {
            state.setActiveDocument(item.docId);
            if (window.app) {
                window.app.loadActiveDocument();
            }
        } else if (item.type === 'theme') {
            state.setTheme(item.value);
            if (window.app) {
                window.app.applyTheme(item.value);
            }
        } else if (item.type === 'ai') {
            this.runAiSimulation(item.id);
        }
    }

    runAiSimulation(aiId) {
        const activeDoc = state.getActiveDocument();

        // 1. Spawns Holographic Matrix Terminal Overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(4, 5, 8, 0.92)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '32px';

        const container = document.createElement('div');
        container.className = 'glass-panel';
        container.style.width = '700px';
        container.style.maxHeight = '80vh';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.borderRadius = '12px';
        container.style.borderColor = 'var(--neon-secondary)';
        container.style.boxShadow = '0 0 30px var(--neon-secondary-glow)';
        container.style.overflow = 'hidden';

        const header = document.createElement('div');
        header.style.padding = '16px 24px';
        header.style.borderBottom = '1px solid var(--panel-border)';
        header.style.display = 'flex';
        header.style.justifyContent = 'between';
        header.className = 'font-mono cyan';
        header.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <i data-lucide="cpu" class="pulsing" style="color: var(--neon-secondary);"></i>
                <span>NEURAL_SATELLITE_LINK // COMMAND_DECRYPTOR</span>
            </div>
        `;
        container.appendChild(header);

        const terminalContent = document.createElement('div');
        terminalContent.style.padding = '32px';
        terminalContent.style.overflowY = 'auto';
        terminalContent.style.flexGrow = '1';
        terminalContent.className = 'font-mono';
        terminalContent.style.color = 'var(--text-main)';
        terminalContent.style.lineHeight = '1.8';
        terminalContent.style.fontSize = '0.9rem';
        container.appendChild(terminalContent);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        if (window.lucide) {
            window.lucide.createIcons();
        }

        // 2. Futuristic Matrix Print Simulation
        const logs = [
            `[INIT] Establishing neural bridge to sector [${activeDoc.id}]...`,
            `[PING] Satellite uplink stable. Latency: 4.8ms. Security layer checked: STABLE.`,
            `[READ] Scanning dynamic node files... Collected ${activeDoc.blocks.length} active content sectors.`,
            `[PROC] Re-allocating quantum capacitors for cognitive query parsing...`,
            `[MATH] Executing neural tensor matrix multiplication models...`
        ];

        let index = 0;
        const printNextLog = () => {
            if (index < logs.length) {
                const p = document.createElement('p');
                p.style.marginBottom = '8px';
                p.textContent = logs[index];
                
                // Add success color tags
                if (logs[index].startsWith('[INIT]')) p.style.color = 'var(--text-muted)';
                if (logs[index].startsWith('[PING]')) p.style.color = 'var(--neon-green)';
                if (logs[index].startsWith('[PROC]')) p.style.color = 'var(--neon-primary)';
                
                terminalContent.appendChild(p);
                terminalContent.scrollTop = terminalContent.scrollHeight;
                index++;
                setTimeout(printNextLog, 400);
            } else {
                // Complete processing and show actual futuristic AI results!
                setTimeout(() => this.displayAiResult(aiId, activeDoc, terminalContent, overlay), 500);
            }
        };

        printNextLog();
    }

    displayAiResult(aiId, activeDoc, terminalEl, overlayEl) {
        terminalEl.innerHTML = '';
        
        const resultContainer = document.createElement('div');
        resultContainer.style.animation = 'slide-up 0.3s ease';

        if (aiId === 'ai-summarize') {
            resultContainer.innerHTML = `
                <div style="border-left: 3px solid var(--neon-secondary); padding-left: 16px; margin-bottom: 24px;">
                    <h3 class="cyan" style="font-family: var(--font-header); font-size: 1.4rem; margin-bottom: 8px;">NODE SUMMARY REPORT</h3>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 16px;">PARSED FROM: ${activeDoc.title.toUpperCase()}</p>
                </div>
                
                <div class="font-sans" style="line-height: 1.6; font-size: 1.05rem; display: flex; flex-direction: column; gap: 14px;">
                    <p>⚡ <strong>Primary Objective:</strong> Secure active server node integrations across designated workspace networks.</p>
                    <p>🛡️ <strong>Threat Landscape:</strong> External probes are targeting Sector 4 firewalls utilizing dynamic proxy tunneling models.</p>
                    <p>💡 <strong>Key Resolution:</strong> Secondary proxy subnets are configured for immediate deployment to sequester network anomalies.</p>
                </div>

                <div class="sidebar-actions" style="margin-top: 32px; display:flex; justify-content:flex-end;">
                    <button class="cyber-btn glass-btn close-overlay-btn" style="width: 150px;">CLOSE_UPLINK</button>
                </div>
            `;
        } 
        
        else if (aiId === 'ai-tasks') {
            resultContainer.innerHTML = `
                <div style="border-left: 3px solid var(--neon-accent); padding-left: 16px; margin-bottom: 24px;">
                    <h3 class="pink" style="font-family: var(--font-header); font-size: 1.4rem; margin-bottom: 8px;">EXTRACTED NEURAL TASKS</h3>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 16px;">COMPILED DIRECTLY FROM SYSTEM FILES</p>
                </div>
                
                <div class="font-mono" style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(255,255,255,0.02); border-radius:6px; border: 1px solid var(--panel-border);">
                        <i data-lucide="check-square" class="pink"></i>
                        <span>DEPLOY SECURE FIREWALL TELEMETRY PROBES</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(255,255,255,0.02); border-radius:6px; border: 1px solid var(--panel-border);">
                        <i data-lucide="check-square" class="pink"></i>
                        <span>AUDIT ALL NIGHT_CITY DISTRICT NODE INTEGRITY</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(255,255,255,0.02); border-radius:6px; border: 1px solid var(--panel-border);">
                        <i data-lucide="check-square" class="pink"></i>
                        <span>TEST VOLTAGE RAIL TOLERANCE UNDER GRID OVERLOAD</span>
                    </div>
                </div>

                <div class="sidebar-actions" style="margin-top: 32px; display:flex; gap:16px; justify-content:flex-end;">
                    <button class="cyber-btn glass-btn close-overlay-btn" style="width: 150px; border-color:var(--text-muted); color:var(--text-muted);">CANCEL</button>
                    <button class="cyber-btn glass-btn inject-tasks-btn" style="width: 200px; border-color:var(--neon-accent); color:var(--neon-accent);">INJECT_TO_PAGE</button>
                </div>
            `;
        } 
        
        else if (aiId === 'ai-related') {
            resultContainer.innerHTML = `
                <div style="border-left: 3px solid var(--neon-secondary); padding-left: 16px; margin-bottom: 24px;">
                    <h3 class="cyan" style="font-family: var(--font-header); font-size: 1.4rem; margin-bottom: 8px;">SEMANTIC CORRELATION QUERY</h3>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 16px;">CROSS-REFERENCING ALL NODES IN GRIDS</p>
                </div>
                
                <div class="font-mono" style="display: flex; flex-direction: column; gap: 14px;">
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span class="cyan">👾 NEON_RUNNER_CREDENTIALS</span>
                            <span class="green">94% CORRELATION</span>
                        </div>
                        <div style="width:100%; height:4px; background:rgba(255,255,255,0.05); border-radius:2px;">
                            <div style="width:94%; height:100%; background:var(--neon-secondary); box-shadow: 0 0 6px var(--neon-secondary-glow); border-radius:2px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span class="pink">💾 DECK_HARDWARE_SPECS</span>
                            <span class="green">71% CORRELATION</span>
                        </div>
                        <div style="width:100%; height:4px; background:rgba(255,255,255,0.05); border-radius:2px;">
                            <div style="width:71%; height:100%; background:var(--neon-accent); box-shadow: 0 0 6px var(--neon-accent-glow); border-radius:2px;"></div>
                        </div>
                    </div>
                </div>

                <div class="sidebar-actions" style="margin-top: 32px; display:flex; justify-content:flex-end;">
                    <button class="cyber-btn glass-btn close-overlay-btn" style="width: 150px;">DISMISS</button>
                </div>
            `;
        } 
        
        else if (aiId === 'ai-weekly') {
            resultContainer.innerHTML = `
                <div style="border-left: 3px solid var(--neon-primary); padding-left: 16px; margin-bottom: 24px;">
                    <h3 style="font-family: var(--font-header); font-size: 1.4rem; color:var(--neon-primary); margin-bottom: 8px;">WEEKLY OPERATIONS BLOCK TEMPLATE</h3>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 16px;">GENERATED CHIP MATRIX SCHEDULE</p>
                </div>
                
                <div class="font-sans" style="line-height: 1.6;">
                    <p>Synthesized a 7-day Operational matrix for the document editor. Press Inject to append the schedule table directly into the active document workspace.</p>
                </div>

                <div class="sidebar-actions" style="margin-top: 32px; display:flex; gap:16px; justify-content:flex-end;">
                    <button class="cyber-btn glass-btn close-overlay-btn" style="width: 150px; border-color:var(--text-muted); color:var(--text-muted);">ABORT</button>
                    <button class="cyber-btn glass-btn inject-weekly-btn" style="width: 220px; border-color:var(--neon-primary); color:var(--neon-primary); box-shadow: 0 0 10px rgba(157, 0, 255, 0.2);">INJECT_MATRIX_TABLE</button>
                </div>
            `;
        }

        terminalEl.appendChild(resultContainer);

        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Close triggers
        const closeBtn = resultContainer.querySelector('.close-overlay-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(overlayEl);
            });
        }

        // Extract tasks inject
        const injectTasksBtn = resultContainer.querySelector('.inject-tasks-btn');
        if (injectTasksBtn) {
            injectTasksBtn.addEventListener('click', () => {
                document.body.removeChild(overlayEl);
                
                const taskBlocks = [
                    { id: 't1-' + Date.now(), type: 'heading-2', content: '🛡️ AI GENERATED PROTOCOLS' },
                    { id: 't2-' + Date.now(), type: 'checklist', content: 'Deploy secure firewall telemetry probes', checked: false },
                    { id: 't3-' + Date.now(), type: 'checklist', content: 'Audit all District 9 node integrity links', checked: false },
                    { id: 't4-' + Date.now(), type: 'checklist', content: 'Test voltage rail crystals under deep system stress load', checked: false }
                ];
                
                const newBlocks = [...activeDoc.blocks, ...taskBlocks];
                state.updateDocumentBlocks(activeDoc.id, newBlocks);
                
                if (this.editorRefreshCallback) {
                    this.editorRefreshCallback(activeDoc);
                }
            });
        }

        // Weekly schedule table inject
        const injectWeeklyBtn = resultContainer.querySelector('.inject-weekly-btn');
        if (injectWeeklyBtn) {
            injectWeeklyBtn.addEventListener('click', () => {
                document.body.removeChild(overlayEl);

                const tablePayload = {
                    headers: ['DAY_SECTOR', 'OPERATIONS_ASSIGNED', 'STATUS_CODE', 'SEC_INDEX'],
                    rows: [
                        ['MON_D1', 'Neural Firewall Calibration', 'PENDING', '92%'],
                        ['WED_D3', 'District Subgrid Sweep', 'ACTIVE', '64%'],
                        ['FRI_D5', 'Decrypt Decoy Subnets', 'STANDBY', '88%'],
                        ['SUN_D7', 'Orbital Relays Data Sync', 'LOCKED', '99%']
                    ]
                };

                const weeklyBlocks = [
                    { id: 'w1-' + Date.now(), type: 'heading-2', content: '📅 AI GENERATED WEEKLY OPERATIONS PLAN' },
                    { id: 'w2-' + Date.now(), type: 'table', content: JSON.stringify(tablePayload) }
                ];

                const newBlocks = [...activeDoc.blocks, ...weeklyBlocks];
                state.updateDocumentBlocks(activeDoc.id, newBlocks);

                if (this.editorRefreshCallback) {
                    this.editorRefreshCallback(activeDoc);
                }
            });
        }
    }
}
