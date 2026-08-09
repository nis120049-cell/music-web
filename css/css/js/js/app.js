/* ========================================
   MUSIC WEB - MAIN APP
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ====================================
       ELEMENTS
    ==================================== */

    const miniPlayer =
        document.querySelector(".mini-player");

    const bottomNav =
        document.querySelector(".bottom-nav");

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    /* ====================================
       BOTTOM NAVIGATION
    ==================================== */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();

                navItems.forEach(nav => {

                    nav.classList.remove(
                        "active"
                    );

                });

                item.classList.add(
                    "active"
                );

                const page =
                    item
                        .querySelector("small")
                        ?.textContent
                        ?.toLowerCase();

                handleNavigation(page);

            }
        );

    });


    /* ====================================
       NAVIGATION HANDLER
    ==================================== */

    function handleNavigation(page) {

        if (page === "home") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }


        if (page === "search") {

            if (searchInput) {

                searchInput.focus();

                searchInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

            return;
        }


        if (page === "library") {

            const library =
                document.querySelector(
                    ".section:last-of-type"
                );

            if (library) {

                library.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }

    }


    /* ====================================
       SONG CLICK
    ==================================== */

    const songItems =
        document.querySelectorAll(
            ".song"
        );


    songItems.forEach(
        (song, index) => {

            song.addEventListener(
                "click",
                event => {

                    /*
                        Jangan jalankan dua kali
                        jika tombol Play ditekan.
                    */

                    if (
                        event.target.closest(
                            ".play-btn"
                        )
                    ) {

                        playSelectedSong(
                            index
                        );

                        return;
                    }


                    playSelectedSong(
                        index
                    );

                }
            );

        }
    );


    function playSelectedSong(index) {

        if (
            typeof loadSong !==
            "function"
        ) {

            console.warn(
                "Audio player belum tersedia."
            );

            return;
        }


        if (typeof loadSong === "function") {

            loadSong(index);

        }


        if (
            typeof playSong ===
            "function"
        ) {

            playSong();

        }

    }


    /* ====================================
       SEARCH
    ==================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const keyword =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                songItems.forEach(song => {

                    const text =
                        song.textContent
                            .toLowerCase();


                    if (
                        text.includes(keyword)
                    ) {

                        song.style.display =
                            "";

                    } else {

                        song.style.display =
                            "none";

                    }

                });

            }
        );

    }


    /* ====================================
       QUICK CARD
    ==================================== */

    const quickCards =
        document.querySelectorAll(
            ".quick-card"
        );


    quickCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const text =
                    card.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text.includes(
                        "liked"
                    )
                ) {

                    showMessage(
                        "Liked Songs belum tersedia."
                    );

                }

                else if (
                    text.includes(
                        "recently"
                    )
                ) {

                    document
                        .querySelector(
                            ".song-list"
                        )
                        ?.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }

                else if (
                    text.includes(
                        "playlist"
                    )
                ) {

                    showMessage(
                        "Playlist akan tersedia di tahap berikutnya."
                    );

                }

                else if (
                    text.includes(
                        "download"
                    )
                ) {

                    showMessage(
                        "Download akan tersedia di versi berikutnya."
                    );

                }

            }
        );

    });


    /* ====================================
       ALBUM CLICK
    ==================================== */

    const albumCards =
        document.querySelectorAll(
            ".album-card"
        );


    albumCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const title =
                    card.querySelector(
                        "h3"
                    )?.textContent ||
                    "Album";


                showMessage(
                    `${title} dipilih`
                );

            }
        );

    });


    /* ====================================
       MINI PLAYER
    ==================================== */

    if (miniPlayer) {

        miniPlayer.addEventListener(
            "click",
            event => {

                /*
                    Jika tombol play ditekan,
                    jangan membuka full player.
                */

                if (
                    event.target.closest(
                        "#miniPlay"
                    )
                ) {

                    return;

                }


                openFullPlayer();

            }
        );

    }


    /* ====================================
       FULL PLAYER
    ==================================== */

    function openFullPlayer() {

        let player =
            document.querySelector(
                ".full-player"
            );


        if (!player) {

            createFullPlayer();

            player =
                document.querySelector(
                    ".full-player"
                );

        }


        player.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeFullPlayer() {

        const player =
            document.querySelector(
                ".full-player"
            );


        if (player) {

            player.classList.remove(
                "active"
            );

        }


        document.body.style.overflow =
            "";

    }


    /* ====================================
       CREATE FULL PLAYER
    ==================================== */

    function createFullPlayer() {

        const player =
            document.createElement(
                "div"
            );


        player.className =
            "full-player";


        player.innerHTML = `

            <div class="player-header">

                <button
                    type="button"
                    data-close-player
                    aria-label="Close player"
                >
                    ↓
                </button>

                <strong>
                    NOW PLAYING
                </strong>

                <button
                    type="button"
                    aria-label="More options"
                >
                    ⋮
                </button>

            </div>


            <div class="player-cover">

                <img
                    src="assets/images/cover1.jpg"
                    alt="Album cover"
                >

            </div>


            <div class="player-info">

                <div class="player-title">
                    My First Song
                </div>

                <div class="player-artist">
                    Unknown Artist
                </div>

            </div>


            <div class="progress-container">

                <div
                    class="progress-bar"
                    role="slider"
                    aria-label="Song progress"
                >

                    <div
                        class="progress-fill"
                    ></div>

                    <div
                        class="progress-thumb"
                    ></div>

                </div>


                <div class="time-container">

                    <span
                        data-current-time
                    >
                        0:00
                    </span>

                    <span
                        data-duration
                    >
                        0:00
                    </span>

                </div>

            </div>


            <div class="player-controls">

                <button
                    type="button"
                    data-shuffle
                    aria-label="Shuffle"
                >
                    🔀
                </button>

                <button
                    type="button"
                    data-previous
                    aria-label="Previous"
                >
                    ⏮
                </button>

                <button
                    type="button"
                    class="main-play"
                    data-play
                    data-play-button
                    aria-label="Play"
                >
                    ▶
                </button>

                <button
                    type="button"
                    data-next
                    aria-label="Next"
                >
                    ⏭
                </button>

                <button
                    type="button"
                    data-repeat
                    aria-label="Repeat"
                >
                    🔁
                </button>

            </div>


            <div class="player-secondary">

                <button
                    type="button"
                    aria-label="Like"
                >
                    ♡
                </button>


                <div class="volume-container">

                    <span>
                        🔊
                    </span>

                    <input
                        class="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value="1"
                        aria-label="Volume"
                    >

                </div>


                <button
                    type="button"
                    aria-label="Queue"
                >
                    ☷
                </button>

            </div>

        `;


        document.body.appendChild(
            player
        );


        const closeButton =
            player.querySelector(
                "[data-close-player]"
            );


        closeButton.addEventListener(
            "click",
            closeFullPlayer
        );

    }


    /* ====================================
       MESSAGE
    ==================================== */

    function showMessage(text) {

        let toast =
            document.querySelector(
                ".music-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "music-toast";


            toast.style.position =
                "fixed";

            toast.style.left =
                "50%";

            toast.style.bottom =
                "130px";

            toast.style.transform =
                "translateX(-50%)";

            toast.style.padding =
                "10px 16px";

            toast.style.background =
                "#222";

            toast.style.color =
                "#fff";

            toast.style.borderRadius =
                "20px";

            toast.style.fontSize =
                "13px";

            toast.style.zIndex =
                "2000";

            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.4)";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            text;

        toast.style.opacity =
            "1";


        clearTimeout(
            toast._timer
        );


        toast._timer =
            setTimeout(
                () => {

                    toast.style.opacity =
                        "0";

                },
                2500
            );

    }


    /* ====================================
       KEYBOARD SHORTCUTS
    ==================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
                Space = Play/Pause
            */

            if (
                event.code ===
                "Space" &&
                !(
                    event.target.tagName ===
                    "INPUT"
                )
            ) {

                event.preventDefault();

                if (
                    typeof togglePlay ===
                    "function"
                ) {

                    togglePlay();

                }

            }


            /*
                Arrow Right = Next
            */

            if (
                event.code ===
                "ArrowRight"
            ) {

                if (
                    typeof nextSong ===
                    "function"
                ) {

                    nextSong();

                }

            }


            /*
                Arrow Left = Previous
            */

            if (
                event.code ===
                "ArrowLeft"
            ) {

                if (
                    typeof previousSong ===
                    "function"
                ) {

                    previousSong();

                }

            }

        }
    );


    /* ====================================
       START APP
    ==================================== */

    console.log(
        "Music Web App berhasil dijalankan."
    );

});
