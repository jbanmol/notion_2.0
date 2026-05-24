/* ==========================================================================
   NEONOTION DYNAMIC BLOCK-BASED WORKSPACE EDITOR
   ========================================================================== */

import { state } from './state.js';

const BLOCK_TYPES = [
    { type: 'text',              label: 'Text',              icon: 'type',          hotkey: '/text'     },
    { type: 'heading-1',          label: 'Heading 1',         icon: 'heading-1',     hotkey: '/h1'       },
    { type: 'heading-2',          label: 'Heading 2',         icon: 'heading-2',     hotkey: '/h2'       },
    { type: 'heading-3',          label: 'Heading 3',         icon: 'heading-3',     hotkey: '/h3'       },
    { type: 'code',              label: 'Code',              icon: 'code',          hotkey: '/code'     },
    { type: 'checklist',         label: 'Checklist',         icon: 'check-square',  hotkey: '/check'    },
    { type: 'hologram-timeline', label: 'Hologram Timeline', icon: 'git-branch',    hotkey: '/timeline' },
];

export class EditorComponent {
    constructor() {
        this.titleInputEl  = document.getElementById('document-title');
        this.workspaceEl   = document.getElementById('editor-workspace');
        this.wordCountEl   = document.getElementById('word-count-display');
        this.slashMenuEl   = document.getElementById('slash-menu');

        this.activeDoc      = null;
        this.slashActiveIdx = -1;   // index of block that triggered slash menu
        this.slashQuery     = '';
        this.slashSelected  = 0;    // keyboard nav index
        this.dragFromIndex  = -1;

        // WPM telemetry queues (Task 2.2)
        this.keypresses = [];
        this.wpm = 0;

        this._initSlashMenu();
        this._initEventListeners();

        // Bind WPM keyboard tracker to editor workspace
        this.workspaceEl.addEventListener('keydown', (e) => {
            const isPrintable = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter';
            if (isPrintable && e.target.classList.contains('block-content')) {
                this.keypresses.push(Date.now());
                this._calculateWPM();
            }
        });

        // WPM decay polling loop
        setInterval(() => {
            this._calculateWPM();
        }, 2000);

        // Selection change tracker (caret coordinates logging)
        this.workspaceEl.addEventListener('keyup', (e) => this._trackCaret(e));
        this.workspaceEl.addEventListener('mouseup', (e) => this._trackCaret(e));
    }

    /* -----------------------------------------------------------------------
       SLASH COMMAND MENU (Tasks 2.2 – 2.5)
    ----------------------------------------------------------------------- */

    _initSlashMenu() {
        // Close slash menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.slashMenuEl.contains(e.target)) {
                this._closeSlashMenu();
            }
        });
    }

    _openSlashMenu(blockIndex, anchorEl) {
        this.slashActiveIdx = blockIndex;
        this.slashQuery     = '';
        this.slashSelected  = 0;
        this._renderSlashItems(BLOCK_TYPES);

        // Position below the cursor/block
        const rect = anchorEl.getBoundingClientRect();
        let top = rect.bottom + 6;
        const menuH = 280; // estimated
        if (top + menuH > window.innerHeight) top = rect.top - menuH - 6;

        this.slashMenuEl.style.top  = `${top}px`;
        this.slashMenuEl.style.left = `${Math.max(rect.left, 8)}px`;
        this.slashMenuEl.classList.remove('hidden');
        lucide.createIcons();
    }

    _closeSlashMenu() {
        this.slashMenuEl.classList.add('hidden');
        this.slashActiveIdx = -1;
        this.slashQuery     = '';
    }

    _renderSlashItems(items) {
        this.slashSelected = Math.max(0, Math.min(this.slashSelected, items.length - 1));
        this.slashMenuEl.innerHTML = items.length
            ? items.map((item, i) => `
                <div class="slash-item ${i === this.slashSelected ? 'active' : ''}" data-type="${item.type}">
                    <i data-lucide="${item.icon}" class="slash-item-icon"></i>
                    <span class="slash-item-label">${item.label}</span>
                    <span class="slash-item-hotkey font-mono">${item.hotkey}</span>
                </div>`).join('')
            : `<div class="slash-empty font-mono">NO_COMMANDS_FOUND</div>`;

        // Bind click on each item
        this.slashMenuEl.querySelectorAll('.slash-item').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault(); // don't blur the contenteditable
                this._selectSlashItem(el.dataset.type);
            });
        });
    }

    _filterSlashMenu(query) {
        this.slashQuery    = query;
        this.slashSelected = 0;
        const filtered = BLOCK_TYPES.filter(b =>
            b.label.toLowerCase().includes(query.toLowerCase()) ||
            b.hotkey.includes(query.toLowerCase())
        );
        this._renderSlashItems(filtered);
        lucide.createIcons();
    }

    _selectSlashItem(newType) {
        if (this.slashActiveIdx < 0) return;
        this._closeSlashMenu();
        this.convertBlockType(this.slashActiveIdx, newType);
    }

    /* -----------------------------------------------------------------------
       BLOCK TYPE CONVERSION (Tasks 2.5, 4.2)
    ----------------------------------------------------------------------- */

    convertBlockType(index, newType) {
        if (!this.activeDoc) return;
        const block = this.activeDoc.blocks[index];
        if (!block) return;

        // Grab current text content from DOM before state update
        const blockEl = this.workspaceEl.querySelector(`[data-index="${index}"] .block-content`);
        const currentContent = blockEl ? (blockEl.textContent || '') : (block.content || '');

        const updated = this.activeDoc.blocks.map((b, i) =>
            i === index ? { ...b, type: newType, content: currentContent, checked: false } : b
        );
        state.updateDocumentBlocks(this.activeDoc.id, updated);
        this.activeDoc.blocks = updated;
        this.renderBlocks();

        if (window.app && window.app.log) {
            window.app.log(`BLOCK_MORPHED // INDEX: ${index} // TYPE: ${newType.toUpperCase()}`);
        }

        // Refocus the same block
        setTimeout(() => {
            const el = this.workspaceEl.querySelector(`[data-index="${index}"] .block-content`);
            if (el) { el.focus(); this._placeCaretAtEnd(el); }
        }, 30);
    }

    _placeCaretAtEnd(el) {
        const range = document.createRange();
        const sel   = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /* -----------------------------------------------------------------------
       CORE EDITOR EVENT LISTENERS
    ----------------------------------------------------------------------- */

    _initEventListeners() {
        this.titleInputEl.addEventListener('input', () => {
            if (this.activeDoc) {
                state.updateDocumentTitle(this.activeDoc.id, this.titleInputEl.value);
            }
        });

        // Global keydown for slash menu navigation
        document.addEventListener('keydown', (e) => {
            if (this.slashMenuEl.classList.contains('hidden')) return;
            const items = [...this.slashMenuEl.querySelectorAll('.slash-item')];
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.slashSelected = Math.min(this.slashSelected + 1, items.length - 1);
                this._renderSlashItems(this._currentFilteredItems());
                lucide.createIcons();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.slashSelected = Math.max(this.slashSelected - 1, 0);
                this._renderSlashItems(this._currentFilteredItems());
                lucide.createIcons();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const active = this.slashMenuEl.querySelector('.slash-item.active');
                if (active) this._selectSlashItem(active.dataset.type);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                // Remove the typed /query from the block
                this._removeSlashQuery();
                this._closeSlashMenu();
            }
        });
    }

    _currentFilteredItems() {
        return BLOCK_TYPES.filter(b =>
            b.label.toLowerCase().includes(this.slashQuery.toLowerCase()) ||
            b.hotkey.includes(this.slashQuery.toLowerCase())
        );
    }

    _removeSlashQuery() {
        if (this.slashActiveIdx < 0) return;
        const el = this.workspaceEl.querySelector(`[data-index="${this.slashActiveIdx}"] .block-content`);
        if (!el) return;
        // Strip the /query text
        const text = el.textContent || '';
        const slashIdx = text.lastIndexOf('/');
        if (slashIdx >= 0) {
            el.textContent = text.substring(0, slashIdx);
            this._placeCaretAtEnd(el);
        }
    }

    /* -----------------------------------------------------------------------
       DOCUMENT LOAD & RENDER
    ----------------------------------------------------------------------- */

    loadDocument(doc) {
        this.activeDoc = doc;
        this.titleInputEl.value = doc.title;
        this.renderBlocks();
        this.updateWordCount();
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

        if (window.lucide) window.lucide.createIcons();
    }

    /* -----------------------------------------------------------------------
       BLOCK ELEMENT CREATION (Tasks 3.1–3.3, 4.1)
    ----------------------------------------------------------------------- */

    createBlockElement(block, index, animate = false) {
        const div = document.createElement('div');
        div.className = `editor-block block-${block.type}${animate ? ' block-enter' : ''}`;
        div.dataset.id    = block.id;
        div.dataset.index = index;

        // === Drag-and-Drop (Tasks 3.1–3.3) ===
        div.draggable = true;

        div.addEventListener('dragstart', (e) => {
            this.dragFromIndex = index;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(index));
            setTimeout(() => div.classList.add('dragging'), 0);
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
            this.workspaceEl.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
            this.workspaceEl.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        });

        div.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            // Show drop indicator
            this.workspaceEl.querySelectorAll('.drop-indicator').forEach(el => el.remove());
            const rect = div.getBoundingClientRect();
            const isAbove = e.clientY < rect.top + rect.height / 2;
            const indicator = document.createElement('div');
            indicator.className = 'drop-indicator';
            if (isAbove) {
                div.parentNode.insertBefore(indicator, div);
            } else {
                div.parentNode.insertBefore(indicator, div.nextSibling);
            }
        });

        div.addEventListener('dragleave', (e) => {
            if (!div.contains(e.relatedTarget)) {
                div.classList.remove('drop-target');
            }
        });

        div.addEventListener('drop', (e) => {
            e.preventDefault();
            this.workspaceEl.querySelectorAll('.drop-indicator').forEach(el => el.remove());
            div.classList.remove('drop-target');

            const fromIdx = this.dragFromIndex;
            if (fromIdx < 0 || fromIdx === index) return;

            // Determine above/below
            const rect = div.getBoundingClientRect();
            const isAbove = e.clientY < rect.top + rect.height / 2;
            let toIdx = index;
            if (!isAbove && fromIdx < index) toIdx = index;
            else if (!isAbove && fromIdx > index) toIdx = index + 1;
            else if (isAbove && fromIdx < index) toIdx = index - 1;
            else toIdx = index;

            state.moveBlock(this.activeDoc.id, fromIdx, toIdx);
            this.activeDoc.blocks = state.getActiveDocument().blocks;
            this.dragFromIndex = -1;
            this.renderBlocks();
        });

        // === Block Drag Handle ===
        const dragHandle = document.createElement('div');
        dragHandle.className = 'block-drag-handle';
        dragHandle.innerHTML = `<i data-lucide="grip-vertical"></i>`;
        div.appendChild(dragHandle);

        // === Block Type Switcher Button (Task 4.1) ===
        const typeBtn = document.createElement('button');
        typeBtn.className = 'block-type-btn';
        typeBtn.title = 'Change block type';
        const typeIcon = BLOCK_TYPES.find(t => t.type === block.type)?.icon || 'type';
        typeBtn.innerHTML = `<i data-lucide="${typeIcon}"></i>`;
        typeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._showTypeSwitcher(index, typeBtn);
        });
        div.appendChild(typeBtn);

        // === Core Block Content ===
        const contentContainer = document.createElement('div');
        contentContainer.className = 'block-content';

        if (block.type === 'checklist') {
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'checklist-chk';
            chk.checked = !!block.checked;
            if (block.checked) div.classList.add('checked');

            chk.addEventListener('change', () => {
                block.checked = chk.checked;
                div.classList.toggle('checked', chk.checked);
                this.saveCurrentBlockState();
            });
            div.appendChild(chk);
        }

        if (block.type === 'table') {
            let tableData = { headers: [], rows: [] };
            try { tableData = JSON.parse(block.content); } catch (e) {}

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
            table.appendChild(tbody);
            contentContainer.appendChild(table);
        } else if (block.type === 'hologram-timeline') {
            let nodesData = [];
            try { nodesData = JSON.parse(block.content); } catch (e) {
                nodesData = [
                    { id: 'node-1', label: 'DATABASE SCRAPING LINK', time: '04:12:00', icon: 'database', status: 'COMPLETE', statusClass: 'green' },
                    { id: 'node-2', label: 'ORBITAL TUNNEL BREACH', time: '06:45:12', icon: 'shield-alert', status: 'CRITICAL', statusClass: 'red' },
                    { id: 'node-3', label: 'QUANTUM KEY EXFILTRATION', time: '09:20:00', icon: 'key', status: 'IN_PROGRESS', statusClass: 'cyan' },
                    { id: 'node-4', label: 'CORE DECK RESYNCHRONIZATION', time: '12:05:44', icon: 'refresh-cw', status: 'STANDBY', statusClass: 'gray' }
                ];
            }

            const gridContainer = document.createElement('div');
            gridContainer.className = 'hologram-timeline-grid';

            const trackWrapper = document.createElement('div');
            trackWrapper.className = 'timeline-track-wrapper';
            trackWrapper.innerHTML = `<div class="timeline-rail"></div>`;

            const nodesContainer = document.createElement('div');
            nodesContainer.className = 'timeline-nodes-container';

            const consolePanel = document.createElement('div');
            consolePanel.className = 'diagnostic-console-panel';
            consolePanel.innerHTML = `
                <div class="console-header font-mono">
                    <div class="console-title-group">
                        <i data-lucide="terminal" style="width: 14px; height: 14px; color: var(--neon-secondary);"></i>
                        <span>DIAGNOSTIC_CONSOLE.EXE</span>
                    </div>
                    <span class="console-status font-mono">ONLINE</span>
                </div>
                <div class="console-log-feed font-mono" id="timeline-log-feed">
                    <div class="console-line">
                        <span class="console-time">[00:00:00]</span>
                        <span class="console-message font-mono">SYS_OK // CORE_TELEMETRY_LINKED</span>
                    </div>
                </div>`;

            nodesData.forEach((node, nodeIdx) => {
                const nodeCard = document.createElement('div');
                nodeCard.className = `timeline-node-card ${nodeIdx === 0 ? 'active-node' : ''}`;
                nodeCard.dataset.nodeId = node.id;
                
                nodeCard.innerHTML = `
                    <div class="timeline-node-connector-dot"></div>
                    <div class="timeline-node-header font-mono">
                        <div class="timeline-node-title-group">
                            <span class="timeline-node-icon"><i data-lucide="${node.icon || 'activity'}"></i></span>
                            <span class="timeline-node-time">${node.time}</span>
                        </div>
                    </div>
                    <div class="timeline-node-body font-mono">
                        <span class="timeline-node-label">${node.label}</span>
                        <span class="timeline-node-status ${node.statusClass}">${node.status}</span>
                    </div>
                `;

                nodeCard.addEventListener('click', () => {
                    nodesContainer.querySelectorAll('.timeline-node-card').forEach(c => c.classList.remove('active-node'));
                    nodeCard.classList.add('active-node');

                    if (window.app && window.app.focusMode && window.app.focusMode.audio && !state.isGlobalAudioMuted()) {
                        window.app.focusMode.audio.warm();
                        window.app.focusMode.audio.playSoftClick();
                    }

                    this._streamDiagnostics(node);
                });

                nodesContainer.appendChild(nodeCard);
            });

            trackWrapper.appendChild(nodesContainer);
            gridContainer.appendChild(trackWrapper);
            gridContainer.appendChild(consolePanel);
            contentContainer.appendChild(gridContainer);
            
            setTimeout(() => {
                if (nodesData[0]) this._streamDiagnostics(nodesData[0]);
            }, 150);

        } else if (block.type === 'embed') {
            const embedCard = document.createElement('div');
            embedCard.className = 'embed-info';
            embedCard.innerHTML = `
                <div class="embed-preview-box"><i data-lucide="globe"></i></div>
                <div class="embed-details">
                    <div class="embed-title font-mono">${block.title || 'EXTERNAL TELEMETRY LINK'}</div>
                    <div class="embed-url font-mono cyan">${block.url}</div>
                </div>`;
            contentContainer.appendChild(embedCard);
            contentContainer.style.display = 'flex';
            contentContainer.style.alignItems = 'center';
            contentContainer.style.gap = '16px';
        } else {
            // Editable text blocks
            contentContainer.contentEditable = true;
            contentContainer.innerHTML = block.content || '';
            contentContainer.setAttribute('placeholder', this._placeholderFor(block.type));

            // Slash command detection (Task 2.2)
            contentContainer.addEventListener('input', () => {
                const text = contentContainer.textContent || '';
                const slashIdx = text.lastIndexOf('/');

                if (slashIdx >= 0) {
                    const query = text.substring(slashIdx + 1);
                    if (this.slashMenuEl.classList.contains('hidden')) {
                        this._openSlashMenu(index, contentContainer);
                    }
                    this._filterSlashMenu(query);
                } else {
                    this._closeSlashMenu();
                }

                this.updateWordCount();
            });

            contentContainer.addEventListener('blur', () => {
                this.saveCurrentBlockState();
                this.updateWordCount();
            });

            contentContainer.addEventListener('keydown', (e) => {
                this._handleKeyboardNavigation(e, index);
            });
        }

        div.appendChild(contentContainer);
        return div;
    }

    /* -----------------------------------------------------------------------
       BLOCK TYPE SWITCHER DROPDOWN (Task 4.1)
    ----------------------------------------------------------------------- */

    _showTypeSwitcher(index, anchorEl) {
        // Reuse slash menu as type switcher
        this.slashActiveIdx = index;
        this.slashQuery     = '';
        this.slashSelected  = 0;
        this._renderSlashItems(BLOCK_TYPES);

        const rect = anchorEl.getBoundingClientRect();
        this.slashMenuEl.style.top  = `${rect.bottom + 4}px`;
        this.slashMenuEl.style.left = `${rect.left}px`;
        this.slashMenuEl.classList.remove('hidden');
        lucide.createIcons();
    }

    /* -----------------------------------------------------------------------
       WORD COUNT (Tasks 4.4–4.5)
    ----------------------------------------------------------------------- */

    updateWordCount() {
        if (!this.wordCountEl) return;
        const blocks = this.activeDoc?.blocks || [];
        const text = blocks
            .filter(b => !['table', 'embed'].includes(b.type))
            .map(b => {
                const el = this.workspaceEl.querySelector(`[data-id="${b.id}"] .block-content`);
                return el ? (el.textContent || '') : (b.content || '');
            })
            .join(' ');

        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w).length;
        const readMin = Math.max(1, Math.round(words / 200));
        const readLabel = words < 200 ? '< 1 min read' : `${readMin} min read`;
        this.wordCountEl.textContent = `${words} words · ${readLabel}`;
    }

    /* -----------------------------------------------------------------------
       DRAG & DROP STATE SAVE (Task 3.4)
    ----------------------------------------------------------------------- */

    saveCurrentBlockState() {
        if (!this.activeDoc) return;
        const blockEls = this.workspaceEl.querySelectorAll('.editor-block');
        const updatedBlocks = [];

        blockEls.forEach(el => {
            const id    = el.dataset.id;
            const index = parseInt(el.dataset.index);
            const orig  = this.activeDoc.blocks[index];
            if (!orig) return;

            let content = orig.content;
            let checked = orig.checked;

            if (orig.type === 'checklist') {
                const chk = el.querySelector('.checklist-chk');
                checked = chk ? chk.checked : false;
                const contentEl = el.querySelector('.block-content');
                content = contentEl ? contentEl.innerHTML : '';
            } else if (orig.type === 'table' || orig.type === 'embed') {
                content = orig.content;
            } else {
                const contentEl = el.querySelector('.block-content');
                content = contentEl ? contentEl.innerHTML : '';
            }

            updatedBlocks.push({ ...orig, content, checked });
        });

        state.updateDocumentBlocks(this.activeDoc.id, updatedBlocks);
        this.activeDoc.blocks = updatedBlocks;
    }

    /* -----------------------------------------------------------------------
       KEYBOARD NAVIGATION (Tasks 2.4)
    ----------------------------------------------------------------------- */

    _handleKeyboardNavigation(e, index) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this._closeSlashMenu();
            const newBlock = { id: 'block-' + Date.now(), type: 'text', content: '' };
            const updated = [...this.activeDoc.blocks];
            updated.splice(index + 1, 0, newBlock);
            state.updateDocumentBlocks(this.activeDoc.id, updated);
            this.activeDoc.blocks = updated;
            this.renderBlocks();

            if (window.app && window.app.log) {
                window.app.log(`BLOCK_INSERTED // TYPE: TEXT // INDEX: ${index + 1}`);
            }

            // Animate new block + focus
            setTimeout(() => {
                const nextEl = this.workspaceEl.querySelector(`[data-index="${index + 1}"]`);
                if (nextEl) nextEl.classList.add('block-enter');
                const nextContent = this.workspaceEl.querySelector(`[data-index="${index + 1}"] .block-content`);
                if (nextContent) nextContent.focus();
            }, 20);
        }

        if (e.key === 'Backspace') {
            const contentEl = e.target;
            if (contentEl.textContent.trim() === '' && this.activeDoc.blocks.length > 1) {
                e.preventDefault();
                this._closeSlashMenu();
                const updated = this.activeDoc.blocks.filter((_, idx) => idx !== index);
                state.updateDocumentBlocks(this.activeDoc.id, updated);
                this.activeDoc.blocks = updated;
                this.renderBlocks();
                setTimeout(() => {
                    const prevIdx = Math.max(0, index - 1);
                    const prevEl = this.workspaceEl.querySelector(`[data-index="${prevIdx}"] .block-content`);
                    if (prevEl) prevEl.focus();
                }, 20);
            }
        }
    }

    _placeholderFor(type) {
        switch (type) {
            case 'heading-1': return 'Heading 1...';
            case 'heading-2': return 'Heading 2...';
            case 'heading-3': return 'Heading 3...';
            case 'code':      return 'Write code here...';
            default:          return 'Type / for commands...';
        }
    }

    /* -----------------------------------------------------------------------
       HOLOGRAM TIMELINE DIAGNOSTICS STREAM (Task 3.3)
    ----------------------------------------------------------------------- */

    _streamDiagnostics(node) {
        const feed = document.getElementById('timeline-log-feed');
        if (!feed) return;

        feed.innerHTML = '';
        
        const logs = [
            `UPLINK_ESTABLISHED // NODE: ${node.id.toUpperCase()}`,
            `CHECKING_SIGNATURES: decryp_strength = 97.4%`,
            `SECTOR_ADDRESS: Sector_Node_${node.label.replace(/\s+/g, '_')}`,
            `TIME_STAMP_COORDS: [${node.time}]`
        ];

        if (node.status === 'COMPLETE') {
            logs.push(`STATUS: COMPLETE // SECURE_LINK_VERIFIED`, `COGNITION_LATENCY: 4.8ms`, `telemetry_exfiltrated = 100%`);
        } else if (node.status === 'CRITICAL') {
            logs.push(`WARNING: CORE_INTEGRITY_COMPROMISED`, `FIREWALL_BREACH_DETECTED // DISTRICT_4`, `DEPLOYING_COUNTER_DECOYS...`);
        } else if (node.status === 'IN_PROGRESS') {
            logs.push(`DECRYPTING_SECTOR_KEYS...`, `UPLINK_SPEED: 842.6 GB/s`, `estimated_completion = 4s`);
        } else {
            logs.push(`STATUS: STANDBY // NODE_ONLINE`, `ping_status = OK`, `waiting_for_intrusion_sequence`);
        }

        // Incrementally stream these log lines with a typing/scrolling delay
        logs.forEach((lineText, i) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'console-line';
                
                const timeSpan = document.createElement('span');
                timeSpan.className = 'console-time';
                const now = new Date();
                const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
                timeSpan.textContent = `[${ts}]`;
                
                const msgSpan = document.createElement('span');
                msgSpan.className = 'console-message font-mono';
                
                if (lineText.includes('WARNING') || lineText.includes('COMPROMISED') || lineText.includes('BREACH')) {
                    msgSpan.className = 'console-message highlight-red font-mono';
                } else if (lineText.includes('COMPLETE') || lineText.includes('VERIFIED')) {
                    msgSpan.className = 'console-message highlight-green font-mono';
                } else if (lineText.includes('DECRYPTING') || lineText.includes('IN_PROGRESS')) {
                    msgSpan.className = 'console-message highlight-cyan font-mono';
                }
                
                msgSpan.textContent = lineText;
                
                line.appendChild(timeSpan);
                line.appendChild(msgSpan);
                feed.appendChild(line);
                
                // Scroll to bottom
                feed.scrollTop = feed.scrollHeight;
            }, i * 150);
        });
    }

    _calculateWPM() {
        const now = Date.now();
        // Filter out keys older than 60s
        this.keypresses = this.keypresses.filter(t => now - t < 60000);
        
        // standard WPM formula: (characters / 5) over 1 min
        const wpmVal = Math.round(this.keypresses.length / 5);
        
        // Prevent updates if unchanged to avoid UI jitter
        if (this.wpm === wpmVal) return;
        this.wpm = wpmVal;

        // Map WPM to particle speed factor: 1.0 at 0 WPM, scaling to 3.5 at 75 WPM
        const factor = 1.0 + (wpmVal / 30);
        
        // Dynamically alter particle physics inside focus mode
        if (window.app && window.app.focusMode && window.app.focusMode.snow) {
            window.app.focusMode.snow.setSpeedFactor(factor);
        }

        // Telemetry logging
        if (wpmVal > 0 && wpmVal % 6 === 0) {
            if (window.app && window.app.log) {
                window.app.log(`COGNITIVE_VELOCITY: ${wpmVal} WPM // particle_warp_factor = ${factor.toFixed(2)}x`);
            }
        }
    }

    _trackCaret(e) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        
        const blockEl = e.target.closest('.editor-block');
        if (!blockEl) return;
        const blockIndex = blockEl.dataset.index;
        const offset = range.startOffset;

        if (window.app && window.app.log) {
            if (this._lastBlockIndex !== blockIndex || this._lastOffset !== offset) {
                this._lastBlockIndex = blockIndex;
                this._lastOffset = offset;
                window.app.log(`CARET_MUTATION // SECTOR_NOD_${parseInt(blockIndex) + 1} // OFFSET: ${offset}`);
            }
        }
    }
}
