function getRandomDiscordAvatar() {

    return `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`;

}


async function loadReviews() {

    try {

        const res =
            await fetch("/reviews.json");


        if (!res.ok) {

            throw new Error(
                "Failed to load reviews"
            );

        }


        const reviews =
            await res.json();


        const track =
            document.getElementById(
                "reviewsRow"
            );


        if (!track) return;


        function createCard(r) {

            const card =
                document.createElement("div");


            card.className =
                "review-card";


            const stars =
                "⭐".repeat(
                    r.rating || 5
                );


            card.innerHTML = `

                <img
                    class="review-avatar"
                    src="${getRandomDiscordAvatar()}"
                    alt=""
                >

                <div class="review-body">

                    <div class="review-name">

                        ${r.name}

                        <span class="review-stars">
                            ${stars}
                        </span>

                    </div>

                    <div class="review-quote">

                        ${r.text}

                    </div>

                </div>

            `;


            return card;

        }


        /*
         * Original reviews
         */

        reviews.forEach(
            r => track.appendChild(
                createCard(r)
            )
        );


        /*
         * Duplicate them for
         * seamless looping.
         */

        reviews.forEach(
            r => track.appendChild(
                createCard(r)
            )
        );


        const row =
            document.getElementById(
                "reviewsRow"
            );


        let scroll = 0;


        let speed = 0.5;


        let targetSpeed = 0.5;


        function animate() {

            speed +=
                (targetSpeed - speed)
                * 0.12;


            scroll += speed;


            if (
                scroll >=
                row.scrollWidth / 2
            ) {

                scroll = 0;

            }


            row.scrollLeft =
                scroll;


            requestAnimationFrame(
                animate
            );

        }


        setTimeout(
            animate,
            500
        );


        /*
         * Hold click to speed up.
         */

        row.addEventListener(
            "mousedown",
            () => {

                targetSpeed = 3;

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                targetSpeed = 0.5;

            }
        );


        /*
         * If they drag outside
         * the window while holding.
         */

        window.addEventListener(
            "mouseleave",
            () => {

                targetSpeed = 0.5;

            }
        );


        /*
         * Mobile support.
         */

        row.addEventListener(
            "touchstart",
            () => {

                targetSpeed = 3;

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "touchend",
            () => {

                targetSpeed = 0.5;

            }
        );


        window.addEventListener(
            "touchcancel",
            () => {

                targetSpeed = 0.5;

            }
        );

    } catch (error) {

        console.error(
            "[REVIEWS] Failed to load reviews:",
            error
        );

    }

}


async function loadStats() {

    try {

        const response =
            await fetch(
                "https://api.pxsl.dev/crumb/stats.json"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load stats.json"
            );

        }


        const stats =
            await response.json();


        const userCount =
            document.getElementById(
                "user-count"
            );


        const serverCount =
            document.getElementById(
                "server-count"
            );


        if (userCount) {

            userCount.textContent =
                Number(
                    stats.users
                ).toLocaleString();

        }


        if (serverCount) {

            serverCount.textContent =
                Number(
                    stats.guilds
                ).toLocaleString();

        }

    } catch (error) {

        console.error(
            "[STATS] Failed to load statistics:",
            error
        );


        const userCount =
            document.getElementById(
                "user-count"
            );


        const serverCount =
            document.getElementById(
                "server-count"
            );


        if (userCount) {

            userCount.textContent = "-";

        }


        if (serverCount) {

            serverCount.textContent = "-";

        }

    }

}


async function loadCommandCount() {

    try {

        const response =
            await fetch(
                "https://api.pxsl.dev/crumb/commands.json"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load command data"
            );

        }


        const commands =
            await response.json();


        const commandCount =
            document.getElementById(
                "command-count"
            );


        if (commandCount) {

            commandCount.textContent =
                commands.length.toLocaleString();

        }

    } catch (error) {

        console.error(
            "[COMMANDS] Failed to load command data:",
            error
        );


        const commandCount =
            document.getElementById(
                "command-count"
            );


        if (commandCount) {

            commandCount.textContent = "-";

        }

    }

}


loadStats();

loadCommandCount();

loadReviews();