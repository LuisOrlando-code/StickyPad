let selectedColor = '#fff9b1';
let noteId = 0;

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = btn.dataset.color;
    });
});

document.querySelector('.amarillo').classList.add('selected');

document.getElementById('add-btn').addEventListener('click', createNote);

function createNote() {
    const grid = document.getElementById('notes-grid');
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = selectedColor;
    note.dataset.id = noteId++;

    note.innerHTML = `
        <div class="note-header">
            <span class="note-title">Nota</span>
            <button class="delete-btn">×</button>
        </div>
        <textarea class="note-content" placeholder="Escribí acá..."></textarea>
    `;

    note.querySelector('.delete-btn').addEventListener('click', () => {
        note.remove();
        saveNotes();
    });

    note.querySelector('.note-content').addEventListener('input', saveNotes);

    makeDraggable(note);
    grid.appendChild(note);
    saveNotes();
}

function makeDraggable(note) {
    let isDragging = false;
    let offsetX, offsetY;

    note.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - note.offsetLeft;
        offsetY = e.clientY - note.offsetTop;
        note.style.position = 'absolute';
        note.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        note.style.left = (e.clientX - offsetX) + 'px';
        note.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            note.style.zIndex = '';
            saveNotes();
        }
    });
}

function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        notes.push({
            id: note.dataset.id,
            color: note.style.backgroundColor,
            content: note.querySelector('.note-content').value,
            left: note.style.left,
            top: note.style.top,
            position: note.style.position
        });
    });
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function loadNotes() {
    const saved = localStorage.getItem('stickyNotes');
    if (!saved) return;

    JSON.parse(saved).forEach(data => {
        const grid = document.getElementById('notes-grid');
        const note = document.createElement('div');
        note.className = 'note';
        note.style.backgroundColor = data.color;
        note.dataset.id = data.id;

        if (data.position === 'absolute') {
            note.style.position = 'absolute';
            note.style.left = data.left;
            note.style.top = data.top;
        }

        note.innerHTML = `
            <div class="note-header">
                <span class="note-title">Nota</span>
                <button class="delete-btn">×</button>
            </div>
            <textarea class="note-content" placeholder="Escribí acá...">${data.content}</textarea>
        `;

        note.querySelector('.delete-btn').addEventListener('click', () => {
            note.remove();
            saveNotes();
        });

        note.querySelector('.note-content').addEventListener('input', saveNotes);

        makeDraggable(note);
        grid.appendChild(note);
    });

    noteId = document.querySelectorAll('.note').length;
}

loadNotes();