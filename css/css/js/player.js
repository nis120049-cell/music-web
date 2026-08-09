/* ========================================
   MUSIC WEB - AUDIO PLAYER ENGINE
======================================== */

const audio = new Audio();

audio.preload = "metadata";

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = "off";

/*
    Contoh playlist.

    Nanti URL ini akan kita ganti
    dengan file MP3 milikmu.
*/

const songs = [
    {
        title: "My First Song",
        artist: "Unknown Artist",
        cover: "assets/images/cover1.jpg",
        audio: "music/lagu1.mp3"
    },

    {
        title: "Dream",
        artist: "Unknown Artist",
        cover: "assets/images/cover2.jpg",
        audio: "music/lagu2.mp3"
    },

    {
        title: "Galaxy",
        artist: "Unknown Artist",
        cover: "assets/images/cover3.jpg",
        audio: "music/lagu3.mp3"
    }
];


/* ========================================
   ELEMENT
======================================== */

const miniPlay =
    document.getElementById("miniPlay");


/* ========================================
   LOAD SONG
======================================== */

function loadSong(index) {

    if (!songs.length) {
        return;
    }

    currentSongIndex = index;

    const song =
        songs[currentSongIndex];

    audio.src = song.audio;

    updatePlayerUI(song);

    audio.load();
}


/* ========================================
   PLAY
======================================== */

function playSong() {

    if (!audio.src) {
        loadSong(currentSongIndex);
    }

    audio.play()
        .then(() => {

            isPlaying = true;

            updatePlayButtons();

        })
        .catch(error => {

            console.log(
                "Audio belum bisa diputar:",
                error
            );

        });
}


/* ========================================
   PAUSE
======================================== */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    updatePlayButtons();
}


/* ========================================
   TOGGLE PLAY
======================================== */

function togglePlay() {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }
}


/* ========================================
   NEXT
======================================== */

function nextSong() {

    if (!songs.length) {
        return;
    }

    if (isShuffle) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        } while (
            songs.length > 1 &&
            randomIndex === currentSongIndex
        );

        currentSongIndex =
            randomIndex;

    } else {

        currentSongIndex++;

        if (
            currentSongIndex >=
            songs.length
        ) {

            currentSongIndex = 0;

        }

    }

    loadSong(currentSongIndex);

    playSong();
}


/* ========================================
   PREVIOUS
======================================== */

function previousSong() {

    if (!songs.length) {
        return;
    }

    /*
        Jika lagu sudah berjalan lebih dari
        3 detik, tombol previous akan kembali
        ke awal lagu.
    */

    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;
    }

    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex =
            songs.length - 1;

    }

    loadSong(currentSongIndex);

    playSong();
}


/* ========================================
   SHUFFLE
======================================== */

function toggleShuffle() {

    isShuffle = !isShuffle;

    document
        .querySelectorAll(
            "[data-shuffle]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                isShuffle
            );

        });

}


/* ========================================
   REPEAT
======================================== */

function toggleRepeat() {

    if (repeatMode === "off") {

        repeatMode = "all";

    } else if (repeatMode === "all") {

        repeatMode = "one";

    } else {

        repeatMode = "off";

    }

    document
        .querySelectorAll(
            "[data-repeat]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                repeatMode !== "off"
            );

        });

}


/* ========================================
   SONG ENDED
======================================== */

audio.addEventListener(
    "ended",
    () => {

        if (repeatMode === "one") {

            audio.currentTime = 0;

            playSong();

            return;
        }

        nextSong();

    }
);


/* ========================================
   UPDATE PLAYER
======================================== */

function updatePlayerUI(song) {

    const titleElements =
        document.querySelectorAll(
            ".mini-info strong, .player-title"
        );

    titleElements.forEach(
        element => {

            element.textContent =
                song.title;

        }
    );


    const artistElements =
        document.querySelectorAll(
            ".mini-info span, .player-artist"
        );

    artistElements.forEach(
        element => {

            element.textContent =
                song.artist;

        }
    );


    const coverElements =
        document.querySelectorAll(
            ".mini-cover img, .player-cover img"
        );

    coverElements.forEach(
        image => {

            image.src =
                song.cover;

            image.alt =
                song.title;

        }
    );

}


/* ========================================
   UPDATE PLAY BUTTON
======================================== */

function updatePlayButtons() {

    if (miniPlay) {

        miniPlay.textContent =
            isPlaying
                ? "❚❚"
                : "▶";

    }

    document
        .querySelectorAll(
            "[data-play-button]"
        )
        .forEach(button => {

            button.textContent =
                isPlaying
                    ? "❚❚"
                    : "▶";

        });

}


/* ========================================
   PROGRESS
======================================== */

audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) {
            return;
        }

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        document
            .querySelectorAll(
                ".progress-fill"
            )
            .forEach(bar => {

                bar.style.width =
                    `${percentage}%`;

            });


        document
            .querySelectorAll(
                ".progress-thumb"
            )
            .forEach(thumb => {

                thumb.style.left =
                    `${percentage}%`;

            });


        const miniPlayer =
            document.querySelector(
                ".mini-player"
            );

        if (miniPlayer) {

            miniPlayer.style
                .setProperty(
                    "--progress",
                    `${percentage}%`
                );

        }


        updateTime();

    }
);


/* ========================================
   UPDATE TIME
======================================== */

function updateTime() {

    const current =
        formatTime(
            audio.currentTime
        );

    const duration =
        formatTime(
            audio.duration
        );


    document
        .querySelectorAll(
            "[data-current-time]"
        )
        .forEach(element => {

            element.textContent =
                current;

        });


    document
        .querySelectorAll(
            "[data-duration]"
        )
        .forEach(element => {

            element.textContent =
                duration;

        });

}


/* ========================================
   FORMAT TIME
======================================== */

function formatTime(seconds) {

    if (
        !seconds ||
        Number.isNaN(seconds)
    ) {

        return "0:00";

    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );

    return (
        `${minutes}:` +
        `${remainingSeconds
            .toString()
            .padStart(2, "0")}`
    );

}


/* ========================================
   SEEK
======================================== */

function seekSong(event) {

    if (!audio.duration) {
        return;
    }

    const progressBar =
        event.currentTarget;

    const rect =
        progressBar.getBoundingClientRect();

    const position =
        event.clientX -
        rect.left;

    const percentage =
        position /
        rect.width;

    audio.currentTime =
        percentage *
        audio.duration;

}


/* ========================================
   VOLUME
======================================== */

function setVolume(value) {

    let volume =
        Number(value);

    volume =
        Math.max(
            0,
            Math.min(
                1,
                volume
            )
        );

    audio.volume =
        volume;

}


/* ========================================
   BUTTON EVENTS
======================================== */

if (miniPlay) {

    miniPlay.addEventListener(
        "click",
        togglePlay
    );

}


document.addEventListener(
    "click",
    event => {

        const play =
            event.target.closest(
                "[data-play]"
            );

        const next =
            event.target.closest(
                "[data-next]"
            );

        const previous =
            event.target.closest(
                "[data-previous]"
            );

        const shuffle =
            event.target.closest(
                "[data-shuffle]"
            );

        const repeat =
            event.target.closest(
                "[data-repeat]"
            );


        if (play) {

            togglePlay();

        }


        if (next) {

            nextSong();

        }


        if (previous) {

            previousSong();

        }


        if (shuffle) {

            toggleShuffle();

        }


        if (repeat) {

            toggleRepeat();

        }

    }
);


/* ========================================
   PROGRESS CLICK
======================================== */

document.addEventListener(
    "click",
    event => {

        const progress =
            event.target.closest(
                ".progress-bar"
            );

        if (progress) {

            seekSong({
                currentTarget: progress,
                clientX: event.clientX
            });

        }

    }
);


/* ========================================
   VOLUME INPUT
======================================== */

document.addEventListener(
    "input",
    event => {

        if (
            event.target.matches(
                ".volume-slider"
            )
        ) {

            setVolume(
                event.target.value
            );

        }

    }
);


/* ========================================
   INITIALIZATION
======================================== */

loadSong(0);

audio.volume = 1;

console.log(
    "Music Player berhasil dimuat."
);
