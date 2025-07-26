const audio = new Audio();
const playlist = [
    { title: "Sample Track 1", artist: "Artist 1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://via.placeholder.com/300x300?text=Track+1" },
    { title: "Sample Track 2", artist: "Artist 2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://via.placeholder.com/300x300?text=Track+2" },
    { title: "Sample Track 3", artist: "Artist 3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://via.placeholder.com/300x300?text=Track+3" }
];
let currentTrack = 0;

const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumArt = document.getElementById('album-art');
const volumeValue = document.getElementById('volume-value');
const playlistUl = document.getElementById('playlist');

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    songTitle.textContent = track.title;
    songArtist.textContent = track.artist;
    albumArt.src = track.cover;
    updatePlaylistUI();
}

function updatePlaylistUI() {
    playlistUl.innerHTML = '';
    playlist.forEach((track, i) => {
        const li = document.createElement('li');
        li.className = `p-2 cursor-pointer hover:bg-gray-700 rounded ${i === currentTrack ? 'bg-gray-700' : ''}`;
        li.textContent = `${track.title} - ${track.artist}`;
        li.onclick = () => {
            currentTrack = i;
            loadTrack(currentTrack);
            playTrack();
        };
        playlistUl.appendChild(li);
    });
}

function playTrack() {
    audio.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
}

function pauseTrack() {
    audio.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});

prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    playTrack();
});

nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    playTrack();
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.setProperty('--progress', `${progress}%`);
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    durationDisplay.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
});

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.volume = pos;
    volumeValue.textContent = `${Math.round(pos * 100)}%`;
    volumeBar.style.setProperty('--volume', `${pos * 100}%`);
});

audio.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    playTrack();
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Initialize
loadTrack(currentTrack);
audio.volume = 1;
volumeBar.style.setProperty('--volume', '100%');