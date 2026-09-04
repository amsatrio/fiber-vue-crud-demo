const API = '/v1/nomen';
let currentPage = 0;
let currentSize = 12;
let currentSearch = '';
let totalElements = 0;
let totalPages = 0;
let editingId = null;
let filters = {};    // { field: {value, matchMode, dataType} }
let sortField = 'createdAt';
let sortDesc = true;

const TOKEN_KEY = 'auth_main_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// ===== Auth helpers =====
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function isSignedIn() {
    return !!getToken();
}

function authHeaders(additional = {}) {
    const headers = { ...additional };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

function updateAuthUi() {
    const signedIn = isSignedIn();
    const addBtn = document.getElementById('addNomenBtn');
    if (addBtn) addBtn.style.display = signedIn ? '' : 'none';

    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        if (signedIn) {
            authBtn.textContent = 'Logout';
            authBtn.classList.remove('btn-blue');
            authBtn.classList.add('btn-red');
        } else {
            authBtn.textContent = 'Login';
            authBtn.classList.remove('btn-red');
            authBtn.classList.add('btn-blue');
        }
    }
}

function toggleAuth() {
    if (isSignedIn()) {
        logout();
    } else {
        window.location.href = '/german-vocabulary/login.html';
    }
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    updateAuthUi();
    loadNouns(0);
    showToast('Signed out.');
}

const giftMap = {
    masculine: 'der',
    feminine: 'die',
    neuter: 'das',
    plural_only: 'die'
};

const genderLabels = {
    masculine: 'Masculine',
    feminine: 'Feminine',
    neuter: 'Neuter',
    plural_only: 'Plural Only'
};

const FILTER_LABELS = {
    gender: 'Gender',
    level: 'Level',
    isNDeklination: 'N-Deklination'
};

// ===== Fetch =====
async function loadNouns(page = 0) {
    currentPage = page;
    const spinner = document.getElementById('spinner');
    spinner.classList.add('show');

    let url = `${API}?page=${page}&size=${currentSize}`;
    if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;

    const sortArr = [{ id: sortField, desc: sortDesc }];
    url += `&sort=${encodeURIComponent(JSON.stringify(sortArr))}`;

    const filterArr = [];
    for (const field in filters) {
        filterArr.push({
            id: field,
            value: filters[field].value,
            matchMode: filters[field].matchMode,
            dataType: filters[field].dataType,
            mode: 'AND'
        });
    }
    if (filterArr.length > 0) {
        url += `&filter=${encodeURIComponent(JSON.stringify(filterArr))}`;
    }

    try {
        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to load');

        const pageData = json.data;
        totalElements = pageData.totalElements;
        totalPages = pageData.totalPages;
        renderCards(pageData.content);
        renderStats(pageData.content);
        renderPagination(pageData);
    } catch (e) {
        showToast('Error: ' + e.message);
    } finally {
        spinner.classList.remove('show');
    }
}

// ===== Render Cards =====
function renderCards(nouns) {
    const grid = document.getElementById('grid');

    if (!nouns || nouns.length === 0) {
        grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <h3>Keine Nomen gefunden</h3>
                        <p>No nouns found. Add your first German noun card!</p>
                        ${isSignedIn() ? '<button class="btn btn-green" onclick="openCreateModal()">+ Add Nomen</button>' : ''}
                    </div>`;
        return;
    }

    const signedIn = isSignedIn();

    grid.innerHTML = nouns.map(n => `
                <div class="card">
                    <div class="card-top">
                        <span class="gender-tag ${n.gender}">${giftMap[n.gender]} ${genderLabels[n.gender]}</span>
                        <span class="level-tag">${n.level}</span>
                    </div>
                    <div class="card-body">
                        <h3>${escapeHtml(n.singular)}</h3>
                        <div class="translation">${escapeHtml(n.translationEn || '')}</div>
                        <div class="info-grid">
                            <div><span class="label">Plural:</span> ${n.plural ? escapeHtml(n.plural) : '—'}</div>
                            <div><span class="label">Genitive:</span> ${n.genitiveSingular ? escapeHtml(n.genitiveSingular) : '—'}</div>
                        </div>
                        ${n.isNDeklination ? '<div class="n-dek">N-DEKLINATION</div>' : ''}
                        ${renderExamples(n)}
                    </div>
                    ${signedIn ? `
                    <div class="card-actions">
                        <button class="btn btn-blue" onclick="openEditModal(${n.id})">Edit</button>
                        <button class="btn btn-red" onclick="deleteNoun(${n.id})">Delete</button>
                    </div>` : ''}
                </div>
            `).join('');
}

function renderExamples(n) {
    if (!n.exampleSentenceDe && !n.exampleSentenceEn) return '';
    return `
                <div class="example">
                    ${n.exampleSentenceDe ? `<div class="example-de">${escapeHtml(n.exampleSentenceDe)}</div>` : ''}
                    ${n.exampleSentenceEn ? `<div class="example-en">${escapeHtml(n.exampleSentenceEn)}</div>` : ''}
                </div>`;
}

// ===== Stats =====
function renderStats(nouns) {
    const counts = {
        masculine: 0, feminine: 0, neuter: 0, plural_only: 0
    };
    nouns.forEach(n => { counts[n.gender] = (counts[n.gender] || 0) + 1; });

    document.getElementById('statsBar').innerHTML = `
                <div class="stat total">Total Nouns <span class="count">${totalElements}</span></div>
                <div class="stat masculine">der <span class="count">${counts.masculine}</span></div>
                <div class="stat feminine">die <span class="count">${counts.feminine}</span></div>
                <div class="stat neuter">das <span class="count">${counts.neuter}</span></div>
            `;
}

// ===== Pagination =====
function renderPagination(pageData) {
    const pag = document.getElementById('pagination');
    const total = Math.max(pageData.totalPages, 1);
    const current = pageData.number;

    let pages = '';
    const maxVisible = 5;
    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible);
    if (end - start < maxVisible) {
        start = Math.max(0, end - maxVisible);
    }

    if (start > 0) {
        pages += `<button class="btn page-btn" onclick="loadNouns(0)">1</button>`;
        if (start > 1) pages += `<span class="page-ellipsis">...</span>`;
    }

    for (let i = start; i < end; i++) {
        const active = i === current ? ' active' : '';
        pages += `<button class="btn page-btn${active}" onclick="loadNouns(${i})">${i + 1}</button>`;
    }

    if (end < total) {
        if (end < total - 1) pages += `<span class="page-ellipsis">...</span>`;
        pages += `<button class="btn page-btn" onclick="loadNouns(${total - 1})">${total}</button>`;
    }

    pag.innerHTML = `
        <button class="btn" onclick="loadNouns(${current - 1})" ${pageData.first ? 'disabled' : ''}>← Prev</button>
        <span class="page-numbers">${pages}</span>
        <button class="btn" onclick="loadNouns(${current + 1})" ${pageData.last ? 'disabled' : ''}>Next →</button>
        <span class="page-info">Page ${current + 1} / ${total}</span>
    `;
}

// ===== Search =====
function doSearch() {
    currentSearch = document.getElementById('searchInput').value.trim();
    loadNouns(0);
}

document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
});

// ===== Filters =====
function applyFilters() {
    filters = {};

    const gender = document.getElementById('filterGender').value;
    if (gender) filters.gender = { value: gender, matchMode: 'EQUALS', dataType: 'TEXT' };

    const level = document.getElementById('filterLevel').value;
    if (level) filters.level = { value: level, matchMode: 'EQUALS', dataType: 'TEXT' };

    const ndek = document.getElementById('filterNDek').value;
    if (ndek !== '') filters.isNDeklination = { value: ndek, matchMode: 'EQUALS', dataType: 'BOOLEAN' };

    renderActiveFilterTags();
    loadNouns(0);
}

function applySort() {
    const val = document.getElementById('filterSort').value;
    const [field, dir] = val.split('|');
    sortField = field;
    sortDesc = dir === 'desc';
    loadNouns(0);
}

function resetFilters() {
    document.getElementById('filterGender').value = '';
    document.getElementById('filterLevel').value = '';
    document.getElementById('filterNDek').value = '';
    document.getElementById('filterSort').value = 'createdAt|desc';
    filters = {};
    sortField = 'createdAt';
    sortDesc = true;
    renderActiveFilterTags();
    loadNouns(0);
}

function removeFilter(field) {
    delete filters[field];
    if (field === 'gender') document.getElementById('filterGender').value = '';
    if (field === 'level') document.getElementById('filterLevel').value = '';
    if (field === 'isNDeklination') document.getElementById('filterNDek').value = '';
    renderActiveFilterTags();
    loadNouns(0);
}

function renderActiveFilterTags() {
    const container = document.getElementById('activeFilters');
    const tags = [];

    for (const field in filters) {
        const label = FILTER_LABELS[field] || field;
        let valueLabel = filters[field].value;
        if (field === 'gender' && genderLabels[valueLabel]) valueLabel = giftMap[valueLabel] + ' ' + genderLabels[valueLabel];
        if (field === 'isNDeklination') valueLabel = valueLabel === 'true' ? 'Yes' : 'No';
        tags.push(`<span class="active-filter-tag">${label}: ${valueLabel} <button onclick="removeFilter('${field}')">✕</button></span>`);
    }

    if (tags.length === 0) {
        container.innerHTML = '';
    } else {
        container.innerHTML = tags.join('');
    }
}

// ===== Modal =====
function openModal(title, noun = null) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('nounForm').reset();
    document.getElementById('modalOverlay').classList.add('open');

    if (noun) {
        editingId = noun.id;
        document.getElementById('nounId').value = noun.id;
        document.getElementById('fSingular').value = noun.singular || '';
        document.getElementById('fGender').value = noun.gender || 'masculine';
        document.getElementById('fLevel').value = noun.level || 'A1';
        document.getElementById('fPlural').value = noun.plural || '';
        document.getElementById('fGenitive').value = noun.genitiveSingular || '';
        document.getElementById('fTranslation').value = noun.translationEn || '';
        document.getElementById('fExampleDe').value = noun.exampleSentenceDe || '';
        document.getElementById('fExampleEn').value = noun.exampleSentenceEn || '';
        document.getElementById('fNDek').checked = !!noun.isNDeklination;
    } else {
        editingId = null;
    }
}

function openCreateModal() {
    openModal('Add Nomen', null);
}

function openEditModal(id) {
    loadNounById(id).then(noun => {
        if (noun) openModal('Edit Nomen', noun);
    });
}

async function loadNounById(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        return json.data;
    } catch (e) {
        showToast('Error: ' + e.message);
        return null;
    }
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    editingId = null;
}

document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ===== Submit =====
async function submitForm() {
    const data = {
        singular: document.getElementById('fSingular').value.trim(),
        gender: document.getElementById('fGender').value,
        level: document.getElementById('fLevel').value,
        plural: document.getElementById('fPlural').value.trim() || null,
        genitiveSingular: document.getElementById('fGenitive').value.trim() || null,
        translationEn: document.getElementById('fTranslation').value.trim(),
        exampleSentenceDe: document.getElementById('fExampleDe').value.trim() || null,
        exampleSentenceEn: document.getElementById('fExampleEn').value.trim() || null,
        isNDeklination: document.getElementById('fNDek').checked
    };

    if (!data.singular || !data.translationEn) {
        showToast('Singular and Translation are required');
        return;
    }

    try {
        let res;
        if (editingId) {
            res = await fetch(`${API}/${editingId}`, {
                method: 'PUT',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(data)
            });
        } else {
            res = await fetch(API, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(data)
            });
        }

        const json = await res.json();
        if (res.status === 401) {
            showToast('You must be signed in to do that.');
            updateAuthUi();
            return;
        }
        if (!res.ok) {
            const err = json.error || json.message;
            const msg = typeof err === 'object' ? Object.entries(err).map(([k, v]) => `${k}: ${v}`).join('; ') : err;
            throw new Error(msg || 'Save failed');
        }

        showToast(editingId ? 'Nomen updated!' : 'Nomen added!');
        closeModal();
        loadNouns(currentPage);
    } catch (e) {
        showToast('Error: ' + e.message);
    }
}

// ===== Delete =====
async function deleteNoun(id) {
    if (!confirm('Delete this noun card?')) return;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const json = await res.json();
        if (res.status === 401) {
            showToast('You must be signed in to do that.');
            updateAuthUi();
            return;
        }
        if (!res.ok) throw new Error(json.message || 'Delete failed');

        showToast('Nomen deleted!');
        loadNouns(currentPage);
    } catch (e) {
        showToast('Error: ' + e.message);
    }
}

// ===== Toast =====
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Utils =====
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Init =====
updateAuthUi();
window.addEventListener('storage', e => {
    if (e.key === TOKEN_KEY) updateAuthUi();
});
loadNouns(0);