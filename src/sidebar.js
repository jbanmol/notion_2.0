/* ==========================================================================
   NEONOTION SIDEBAR TREE NAVIGATION COMPONENT
   ========================================================================== */

import { state } from './state.js';

export class SidebarComponent {
    constructor() {
        this.docListEl = document.getElementById('sidebar-document-list');
        this.addBtnEl = document.getElementById('add-page-btn');
        this.breadcrumbEl = document.getElementById('active-document-breadcrumb');

        this.initEventListeners();
    }

    initEventListeners() {
        // Create new node event
        this.addBtnEl.addEventListener('click', () => {
            const newId = state.createNewDocument();
            this.render();
        });
    }

    render() {
        const docs = state.getDocuments();
        const activeDoc = state.getActiveDocument();

        // Update main breadcrumb display
        if (this.breadcrumbEl && activeDoc) {
            this.breadcrumbEl.textContent = activeDoc.title.toUpperCase();
        }

        this.docListEl.innerHTML = '';

        docs.forEach(doc => {
            const isActive = doc.id === activeDoc.id;
            
            const li = document.createElement('li');
            li.className = `document-item ${isActive ? 'active' : ''}`;
            li.dataset.id = doc.id;

            // Map standard icons to Lucide glyphs
            let iconName = doc.icon || 'file-text';
            if (doc.id === 'doc-security-audit') iconName = 'shield-alert';
            if (doc.id === 'doc-crew-logs') iconName = 'users';
            if (doc.id === 'doc-quantum-deck') iconName = 'cpu';

            li.innerHTML = `
                <div class="doc-info">
                    <i data-lucide="${iconName}" class="${isActive ? 'cyan' : 'pink'}"></i>
                    <span>${doc.title}</span>
                </div>
                <button class="delete-doc-btn" title="Purge Node Integrity" data-id="${doc.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            `;

            // Click node to select
            li.addEventListener('click', (e) => {
                // If clicked delete button, skip switching active document
                if (e.target.closest('.delete-doc-btn')) return;
                state.setActiveDocument(doc.id);
                this.render();
            });

            // Click delete button
            const deleteBtn = li.querySelector('.delete-doc-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`INITIATE DECRYPTION DELETION PROTOCOL FOR: ${doc.title}?`)) {
                    state.deleteDocument(doc.id);
                    this.render();
                }
            });

            this.docListEl.appendChild(li);
        });

        // Initialize Lucide Icons for dynamic HTML
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
