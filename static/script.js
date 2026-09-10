const API_BASE = "https://api.pxsl.dev";


// FORMAT NUMBERS

function formatNumber(number) {
    if (number === null || number === undefined) {
        return "—";
    }

    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M+`;
    }

    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K+`;
    }

    return number.toLocaleString();
}


// LOAD BOT STATS

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats.json`);

        if (!response.ok) {
            throw new Error("Failed to load stats");
        }

        const data = await response.json();

        const serverCount = document.getElementById("server-count");
        const userCount = document.getElementById("user-count");

        if (serverCount) {
            serverCount.textContent = formatNumber(
                data.servers ?? data.server_count
            );
        }

        if (userCount) {
            userCount.textContent = formatNumber(
                data.users ?? data.user_count
            );
        }

    } catch (error) {
        console.error("Could not load Crumb stats:", error);
    }
}


// LOAD COMMAND COUNT

async function loadCommandCount() {
    try {
        const response = await fetch(`${API_BASE}/commands.json`);

        if (!response.ok) {
            throw new Error("Failed to load commands");
        }

        const data = await response.json();

        const commandCount = document.getElementById("command-count");

        if (!commandCount) {
            return;
        }

        let count = 0;

        if (Array.isArray(data)) {
            count = data.length;
        } else if (Array.isArray(data.commands)) {
            count = data.commands.length;
        } else if (typeof data.count === "number") {
            count = data.count;
        }

        commandCount.textContent = count
            ? `${count}+`
            : "—";

    } catch (error) {
        console.error("Could not load Crumb commands:", error);
    }
}


// REVIEWS

const reviews = [
    {
        text: "Crumb makes managing a server so much easier.",
        name: "Crumb Community",
        server: "Discord Server"
    },
    {
        text: "Simple tools, useful features and no unnecessary nonsense.",
        name: "Server Owner",
        server: "Discord Community"
    },
    {
        text: "The security features are exactly what a growing server needs.",
        name: "Community Manager",
        server: "Discord Server"
    }
];

let currentReview = 0;


function updateReview() {
    const review = reviews[currentReview];

    const text = document.getElementById("review-text");
    const name = document.getElementById("review-name");
    const server = document.getElementById("review-server");
    const avatar = document.getElementById("review-avatar");

    if (text) {
        text.textContent = review.text;
    }

    if (name) {
        name.textContent = review.name;
    }

    if (server) {
        server.textContent = review.server;
    }

    if (avatar) {
        avatar.textContent = review.name.charAt(0).toUpperCase();
    }
}


function nextReview() {
    currentReview++;

    if (currentReview >= reviews.length) {
        currentReview = 0;
    }

    updateReview();
}


function previousReview() {
    currentReview--;

    if (currentReview < 0) {
        currentReview = reviews.length - 1;
    }

    updateReview();
}


const nextButton = document.querySelector(".review-next");
const previousButton = document.querySelector(".review-prev");

if (nextButton) {
    nextButton.addEventListener("click", nextReview);
}

if (previousButton) {
    previousButton.addEventListener("click", previousReview);
}


// SMOOTH SCROLL

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// INITIALISE

loadStats();
loadCommandCount();
updateReview();