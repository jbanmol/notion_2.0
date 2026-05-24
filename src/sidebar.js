/* ==========================================================================
   NEONOTION SIDEBAR TREE NAVIGATION COMPONENT
   ========================================================================== */

import { state, relativeTime } from './state.js';
import { CyberModalService } from './modals.js';

const EMOJI_LIST = [
    '📄','📝','🗒️','📋','🗃️','🗂️','📁','📂',
    '🌐','🛡️','💾','👾','🚀','⚡','🔥','💡',
    '🧠','🔬','🔭','🎯','🏆','💎','🌟','✨',
    '🔒','🔑','🌙','☀️','🌊','🏔️','🌿','🦾',
    '📊','📈','🗺️','⚙️','🛠️','🔩','💻','🤖',
    '🎵','🎮','🏋️','🧘','☕','🍵','🌸','🦋',
];

export class SidebarComponent {
    constructor() {
        this.docListEl     = document.getElementById('sidebar-document-list');
        this.addBtnEl      = document.getElementById('add-page-btn');
        this.breadcrumbEl  = document.getElementById('active-document-breadcrumb');
        this.searchInputEl = document.getElementById('sidebar-search');
        this.emojiPickerEl = document.getElementById('emoji-picker');

        this._filterQuery   = '';
        this._pickerDocId   = null;

        this._initEmojiPicker();
        this._initEventListeners();
    }

    _initEventListeners() {
        this.addBtnEl.addEventListener('click', () => {
            state.createNewDocument();
            this.render();
        });

        // Sidebar search filter (Task 6.2)
        if (this.searchInputEl) {
            this.searchInputEl.addEventListener('input', () => {
                this._filterQuery = this.searchInputEl.value.trim();
                this.render();
            });
        }

        // Close emoji picker on outside click
        document.addEventListener('click', (e) => {
            if (this.emojiPickerEl && !this.emojiPickerEl.contains(e.target)) {
                this._closeEmojiPicker();
            }
        });
    }

    /* -----------------------------------------------------------------------
       EMOJI PICKER (Tasks 5.2–5.3)
    ----------------------------------------------------------------------- */

    _initEmojiPicker() {
        if (!this.emojiPickerEl) return;
        const grid = this.emojiPickerEl.querySelector('.emoji-grid');
        if (!grid) return;
        grid.innerHTML = EMOJI_LIST.map(e =>
            `<button class="emoji-option" data-emoji="${e}" title="${e}">${e}</button>`
        ).join('');

        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.emoji-option');
            if (!btn || !this._pickerDocId) return;
            state.updateDocumentIcon(this._pickerDocId, btn.dataset.emoji);
            this._closeEmojiPicker();
            this.render();
        });
    }

    _openEmojiPicker(docId, anchorEl) {
        this._pickerDocId = docId;
        const rect = anchorEl.getBoundingClientRect();
        this.emojiPickerEl.style.top  = `${rect.bottom + 4}px`;
        this.emojiPickerEl.style.left = `${rect.left}px`;
        this.emojiPickerEl.classList.remove('hidden');
    }

    _closeEmojiPicker() {
        this._pickerDocId = null;
        if (this.emojiPickerEl) this.emojiPickerEl.classList.add('hidden');
    }

    /* -----------------------------------------------------------------------
       RENDER (Tasks 5.1, 5.5, 5.6, 6.2, 6.3)
    ----------------------------------------------------------------------- */

    render() {
        const allDocs   = state.getDocuments();
        const activeDoc = state.getActiveDocument();

        // Update breadcrumb
        if (this.breadcrumbEl && activeDoc) {
            this.breadcrumbEl.textContent = activeDoc.title.toUpperCase();
        }

        // Filter by search query (Task 6.2)
        const query = this._filterQuery.toLowerCase();
        const filtered = query
            ? allDocs.filter(d => d.title.toLowerCase().includes(query))
            : allDocs;

        // Pinned docs float to top (Task 5.5)
        const sorted = [
            ...filtered.filter(d => d.pinned),
            ...filtered.filter(d => !d.pinned),
        ];

        this.docListEl.innerHTML = '';

        // Task 6.3 — no results state
        if (sorted.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'sidebar-empty font-mono';
            empty.textContent = 'NO_NODES_FOUND';
            this.docListEl.appendChild(empty);
            return;
        }

        sorted.forEach(doc => {
            const isActive = doc.id === activeDoc.id;
            const icon = doc.icon || '📄';

            const li = document.createElement('li');
            li.className = `document-item ${isActive ? 'active' : ''} ${doc.pinned ? 'pinned' : ''}`;
            li.dataset.id = doc.id;

            li.innerHTML = `
                <div class="doc-info">
                    <button class="doc-emoji-btn" data-id="${doc.id}" title="Change icon">${icon}</button>
                    <div class="doc-text">
                        <span class="doc-title">${doc.title}</span>
                        <span class="doc-meta font-mono">${relativeTime(doc.updatedAt || Date.now())}</span>
                    </div>
                </div>
                <div class="doc-actions">
                    <button class="pin-doc-btn ${doc.pinned ? 'pinned-active' : ''}" title="${doc.pinned ? 'Unpin' : 'Pin'}" data-id="${doc.id}">
                        ${doc.pinned ? '📌' : '📍'}
                    </button>
                    <button class="delete-doc-btn" title="Purge Node" data-id="${doc.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;

            // Click to select document
            li.addEventListener('click', (e) => {
                if (e.target.closest('.delete-doc-btn') || e.target.closest('.pin-doc-btn') || e.target.closest('.doc-emoji-btn')) return;
                state.setActiveDocument(doc.id);
                this.render();
            });

            // Emoji picker (Task 5.3)
            li.querySelector('.doc-emoji-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this._openEmojiPicker(doc.id, e.currentTarget);
            });

            // Pin / Unpin (Task 5.5)
            li.querySelector('.pin-doc-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                state.toggleDocumentPin(doc.id);
                this.render();
            });

            // Delete with CyberModal (Task 1.5)
            li.querySelector('.delete-doc-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const docs = state.getDocuments();
                if (docs.length <= 1) {
                    await CyberModalService.alert('SYSTEM ERROR: Cannot purge core node. At least one active workspace element required.');
                    return;
                }
                const ok = await CyberModalService.confirm(`Initiate deletion protocol for:\n${doc.title}?`, 'DELETE');
                if (ok) {
                    state.deleteDocument(doc.id);
                    this.render();
                }
            });

            this.docListEl.appendChild(li);
        });

        if (window.lucide) window.lucide.createIcons();
    }
}
