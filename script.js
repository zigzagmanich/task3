let map;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function initMap() {
  map = map = L.map('map').setView([56.4977, 84.9744], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.on('moveend', displayNotes);
  displayNotes();
}

function displayNotes() {
  const bounds = map.getBounds();

  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  const notesContainer = document.getElementById("notes-list");
  notesContainer.innerHTML = "";

  notes.forEach((note, index) => {
    if (!bounds.contains(note.latlng)) return;
    L.marker(note.latlng).addTo(map).bindPopup(note.text);

    const card = document.createElement("div");
    card.className = "note-card";

    const text = document.createElement("p");
    text.textContent = note.text;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    editBtn.onclick = () => {
      const newText = prompt("Изменить заметку:", note.text);
      if (newText) {
        notes[index].text = newText;
        saveNotes();
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.onclick = () => {
      if (confirm("Удалить эту заметку?")) {
        notes.splice(index, 1);
        saveNotes();
      }
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(text);
    card.appendChild(actions);
    notesContainer.appendChild(card);
  });
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

document.getElementById("note-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const text = document.getElementById("note-text").value.trim();
  if (!text) return;

  const center = map.getCenter();
  const newNote = { text, latlng: center };
  notes.push(newNote);

  document.getElementById("note-text").value = "";
  saveNotes();
});

window.onload = () => {
  initMap();
};
