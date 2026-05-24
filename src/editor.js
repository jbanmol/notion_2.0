/* ==========================================================================
   NEONOTION DYNAMIC BLOCK-BASED WORKSPACE EDITOR
   ========================================================================== */

import { state } from './state.js';

export class EditorComponent {
    constructor() {
        this.titleInputEl = document.getElementById('document-title');
        this.workspaceEl = document.getElementById('editor-workspace');
        
        this.activeDoc = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Document Title Change listener
        this.titleInputEl.addEventListener('input', () => {
            if (this.activeDoc) {
                const newTitle = this.titleInputEl.value;
                state.updateDocumentTitle(this.activeDoc.id, newTitle);
                
                // Trigger sidebar & breadcrumbs refresh via state subscription in app.js
            }
        });
    }

    loadDocument(doc) {
        this.activeDoc = doc;
        this.titleInputEl.value = doc.title;
        this.renderBlocks();
    }

    renderBlocks() {
        this.workspaceEl.innerHTML = '';

        if (!this.activeDoc || !this.activeDoc.blocks || this.activeDoc.blocks.length === 0) {
            this.workspaceEl.innerHTML = `<div class="font-mono text-muted">[EMPTY NODE SECTOR. SPAWNING NEW RECORD...]</div>`;
            return;
        }

        this.activeDoc.blocks.forEach((block, index) => {
            const blockEl = this.createBlockElement(block, index);
            this.workspaceEl.appendChild(blockEl);
        });

        // Initialize Lucide icons for embedded components
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    createBlockElement(block, index) {
        const div = document.createElement('div');
        div.className = `editor-block block-${block.type}`;
        div.dataset.id = block.id;
        div.dataset.index = index;

        // Custom drag handles (HTML5 drag and drop ready)
        const dragHandle = document.createElement('div');
        dragHandle.className = 'block-drag-handle';
        dragHandle.innerHTML = `<i data-lucide="grip-vertical"></i>`;
        div.appendChild(dragHandle);

        // Core block container depending on block type
        const contentContainer = document.createElement('div');
        contentContainer.className = 'block-content';

        if (block.type === 'checklist') {
            // Checklist checkbox input
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'checklist-chk';
            chk.checked = !!block.checked;
            
            if (block.checked) {
                div.classList.add('checked');
            }

            chk.addEventListener('change', () => {
                block.checked = chk.checked;
                if (chk.checked) {
                    div.classList.add('checked');
                } else {
                    div.classList.remove('checked');
                }
                this.saveCurrentBlockState();
            });
            div.appendChild(chk);
        }

        if (block.type === 'table') {
            // Cyber Table Visual Mock
            let tableData = { headers: [], rows: [] };
            try {
                tableData = JSON.parse(block.content);
            } catch (e) {
                console.error("JSON formatting error inside block table specs", e);
            }

            const table = document.createElement('table');
            table.className = 'cyber-table';

            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            tableData.headers.forEach(h => {
                const th = document.createElement('th');
                th.textContent = h;
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            tableData.rows.forEach(r => {
                const tr = document.createElement('tr');
                r.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            tbody.appendChild(tbody);
            table.appendChild(tbody);

            contentContainer.appendChild(table);
        } else if (block.type === 'timeline') {
            // Interactive Hologram Timeline component
            let timelineEvents = [];
            try {
                timelineEvents = JSON.parse(block.content);
            } catch (e) {
                console.error("JSON formatting error inside block timeline specs", e);
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'timeline-block-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.gap = '20px';
            wrapper.style.width = '100%';
            wrapper.style.margin = '16px 0';

            // Left Side: Vertical nodes list
            const nodesContainer = document.createElement('div');
            nodesContainer.className = 'timeline-nodes-container';
            nodesContainer.style.flexGrow = '1';
            nodesContainer.style.display = 'flex';
            nodesContainer.style.flexDirection = 'column';
            nodesContainer.style.position = 'relative';
            nodesContainer.style.paddingLeft = '30px';

            // Central vertical glowing line track
            const trackLine = document.createElement('div');
            trackLine.className = 'timeline-track-line';
            nodesContainer.appendChild(trackLine);

            // Right Side: Futuristic diagnostic control console HUD
            const consolePanel = document.createElement('div');
            consolePanel.className = 'timeline-diagnostic-panel glass-panel';
            consolePanel.innerHTML = `
                <div class="console-header font-mono">
                    <i data-lucide="terminal" class="cyan"></i>
                    <span>DIAGNOSTIC_CONSOLE.EXE</span>
                </div>
                <div class="console-screen font-mono" id="timeline-console-screen-${block.id}">
                    <p class="text-muted">> SELECT A NEURAL TIMELINE NODE IN THE DECK TO INITIATE LIVE TRACE AUDITS...</p>
                </div>
            `;

            timelineEvents.forEach((ev, idx) => {
                const card = document.createElement('div');
                card.className = `timeline-node-card glass-panel node-${ev.color || 'cyan'}`;
                card.dataset.index = idx;
                
                let badgeClass = 'status-badge ';
                if (ev.status === 'ONLINE') badgeClass += 'green';
                if (ev.status === 'COMPLETED') badgeClass += 'cyan';
                if (ev.status === 'WARNING') badgeClass += 'pink';
                if (ev.status === 'PENDING') badgeClass += 'muted';

                card.innerHTML = `
                    <div class="node-bullet-glow"></div>
                    <div class="node-meta font-mono">
                        <span class="node-time">${ev.time}</span>
                        <span class="${badgeClass}">${ev.status}</span>
                    </div>
                    <div class="node-body">
                        <div class="node-title font-header">
                            <i data-lucide="${ev.icon || 'circle'}" class="node-icon"></i>
                            <span>${ev.title}</span>
                        </div>
                        <p class="node-desc">${ev.details}</p>
                    </div>
                `;

                // Hover / click behavior to update console HUD panel!
                card.addEventListener('click', () => {
                    // Reset old highlights
                    nodesContainer.querySelectorAll('.timeline-node-card').forEach(c => c.classList.remove('active-node-highlight'));
                    card.classList.add('active-node-highlight');

                    // Play typing sound when interacting with console
                    if (window.app && window.app.focus && window.app.focus.audio) {
                        window.app.focus.audio.playClick();
                    }

                    // Print glowing diagnostic traces on the console screen
                    const screen = consolePanel.querySelector('.console-screen');
                    screen.innerHTML = '';
                    
                    const logs = [
                        `[LOG] ACCESSING NODE PROTOCOL FOR: ${ev.title.toUpperCase()}`,
                        `[TIME] PARAMETER SECTOR: ${ev.time}`,
                        `[STATUS] HARDWARE STATE: ${ev.status}`,
                        `[CORR] CROSS-GRID COGNITION RATE: ${Math.floor(80 + Math.random() * 20)}%`,
                        `[TRACE] INJECTING SUBNET INTRUSION DECRYPTS...`,
                        `[PAYLOAD] DATA SUMMARY: ${ev.details}`
                    ];

                    let logIdx = 0;
                    const printLog = () => {
                        if (logIdx < logs.length) {
                            const p = document.createElement('p');
                            p.textContent = `> ${logs[logIdx]}`;
                            if (logs[logIdx].includes('LOG')) p.className = 'cyan';
                            if (logs[logIdx].includes('STATUS')) p.className = ev.status === 'WARNING' ? 'pink' : 'green';
                            screen.appendChild(p);
                            screen.scrollTop = screen.scrollHeight;
                            logIdx++;
                            setTimeout(printLog, 150);
                        }
                    };
                    printLog();
                });

                nodesContainer.appendChild(card);
            });

            wrapper.appendChild(nodesContainer);
            wrapper.appendChild(consolePanel);
            contentContainer.appendChild(wrapper);
        } else if (block.type === 'embed') {
            // Embed holographic card mock
            const embedCard = document.createElement('div');
            embedCard.className = 'embed-info';
            embedCard.innerHTML = `
                <div class="embed-preview-box">
                    <i data-lucide="globe"></i>
                </div>
                <div class="embed-details">
                    <div class="embed-title font-mono">${block.title || 'EXTERNAL TELEMETRY LINK'}</div>
                    <div class="embed-url font-mono cyan">${block.url}</div>
                </div>
            `;
            
            // Set styles of dynamic flex
            contentContainer.appendChild(embedCard);
            contentContainer.style.display = 'flex';
            contentContainer.style.alignItems = 'center';
            contentContainer.style.gap = '16px';
        } else {
            // General text elements (paragraphs, headers, code snippets)
            contentContainer.contentEditable = true;
            contentContainer.innerHTML = block.content || '';
            contentContainer.setAttribute('placeholder', this.getPlaceholderForType(block.type));

            // Content changes listeners
            contentContainer.addEventListener('blur', () => this.saveCurrentBlockState());
            contentContainer.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e, index));
        }

        div.appendChild(contentContainer);
        return div;
    }

    getPlaceholderForType(type) {
        switch (type) {
            case 'heading-1': return 'HEADING_1_SECTOR...';
            case 'heading-2': return 'HEADING_2_SECTOR...';
            case 'heading-3': return 'HEADING_3_SECTOR...';
            case 'code': return 'Write custom telemetry algorithm code here...';
            default: return 'Start writing cyber logs (type / for commands)...';
        }
    }

    saveCurrentBlockState() {
        if (!this.activeDoc) return;

        const blockEls = this.workspaceEl.querySelectorAll('.editor-block');
        const updatedBlocks = [];

        blockEls.forEach(el => {
            const id = el.dataset.id;
            const index = parseInt(el.dataset.index);
            const originalBlock = this.activeDoc.blocks[index];

            if (!originalBlock) return;

            let content = '';
            let checked = originalBlock.checked;

            if (originalBlock.type === 'checklist') {
                const chk = el.querySelector('.checklist-chk');
                checked = chk ? chk.checked : false;
                const contentEl = el.querySelector('.block-content');
                content = contentEl ? contentEl.innerHTML : '';
            } else if (originalBlock.type === 'table' || originalBlock.type === 'embed') {
                content = originalBlock.content; // Static payload configurations
            } else {
                const contentEl = el.querySelector('.block-content');
                content = contentEl ? contentEl.innerHTML : '';
            }

            updatedBlocks.push({
                ...originalBlock,
                content: content,
                checked: checked
            });
        });

        state.updateDocumentBlocks(this.activeDoc.id, updatedBlocks);
    }

    handleKeyboardNavigation(e, index) {
        // Minimal editor commands for initial scaffolding
        if (e.key === 'Enter') {
            e.preventDefault();
            // Enter key spawns a standard paragraph text block below current block
            const currentBlock = this.activeDoc.blocks[index];
            const newBlock = {
                id: 'block-' + Date.now(),
                type: 'text',
                content: ''
            };

            const updatedBlocks = [...this.activeDoc.blocks];
            updatedBlocks.splice(index + 1, 0, newBlock);
            
            state.updateDocumentBlocks(this.activeDoc.id, updatedBlocks);
            this.renderBlocks();

            // Auto focus on next block element
            setTimeout(() => {
                const nextBlockEl = this.workspaceEl.querySelector(`[data-index="${index + 1}"] .block-content`);
                if (nextBlockEl) nextBlockEl.focus();
            }, 50);
        }

        if (e.key === 'Backspace') {
            const contentEl = e.target;
            // If the block is completely empty, delete it
            if (contentEl.textContent.trim() === '' && this.activeDoc.blocks.length > 1) {
                e.preventDefault();
                const updatedBlocks = this.activeDoc.blocks.filter((_, idx) => idx !== index);
                state.updateDocumentBlocks(this.activeDoc.id, updatedBlocks);
                this.renderBlocks();

                // Focus on previous block
                setTimeout(() => {
                    const prevIndex = Math.max(0, index - 1);
                    const prevBlockEl = this.workspaceEl.querySelector(`[data-index="${prevIndex}"] .block-content`);
                    if (prevBlockEl) prevBlockEl.focus();
                }, 50);
            }
        }
    }
}
