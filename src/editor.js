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
