const API_URL = "https://api.pxsl.dev/crumb/commands.json";


const commandsGrid =
    document.getElementById("commandsGrid");

const searchInput =
    document.getElementById("search");

const count =
    document.getElementById("count");

const commandTotal =
    document.getElementById("commandTotal");

const categoryTotal =
    document.getElementById("categoryTotal");

const heroCommandCount =
    document.getElementById("heroCommandCount");



let commands = [];



/*
 * Escape HTML so command data cannot
 * inject HTML into the page.
 */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/*
 * Convert different possible command
 * data formats into one consistent format.
 */

function normaliseCommand(command) {

    return {

        name:
            command.name ??
            command.command ??
            command.usage ??
            "unknown",

        description:
            command.description ??
            command.desc ??
            "No description available.",

        category:
            command.category ??
            command.cog ??
            command.group ??
            "Other"

    };

}



/*
 * Load commands from the API.
 */

async function loadCommands() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
         * Support either:
         *
         * [
         *     {...},
         *     {...}
         * ]
         *
         * or:
         *
         * {
         *     "commands": [...]
         * }
         */

        let commandData;


        if (Array.isArray(data)) {

            commandData = data;

        }

        else if (Array.isArray(data.commands)) {

            commandData = data.commands;

        }

        else {

            throw new Error(
                "Invalid commands data."
            );

        }


        commands =
            commandData.map(
                normaliseCommand
            );


        updateStats();

        renderCommands(commands);

    }


    catch (error) {

        console.error(
            "Failed to load commands:",
            error
        );


        commandsGrid.innerHTML = `

            <div class="commands-empty">

                <strong>
                    Couldn't load commands
                </strong>

                Something went wrong while
                loading Crumb's commands.
                Please try again later.

            </div>

        `;


        count.textContent =
            "Unable to load commands.";

    }

}



/*
 * Update the numbers displayed
 * in the hero section.
 */

function updateStats() {

    const categories =
        new Set(
            commands.map(
                command =>
                    command.category
            )
        );


    commandTotal.textContent =
        commands.length;


    categoryTotal.textContent =
        categories.size;


    heroCommandCount.textContent =
        `${commands.length} Commands`;

}



/*
 * Render command cards.
 */

function renderCommands(commandList) {

    commandsGrid.innerHTML = "";


    if (commandList.length === 0) {

        commandsGrid.innerHTML = `

            <div class="commands-empty">

                <strong>
                    No commands found
                </strong>

                Try searching for something else.

            </div>

        `;


        count.textContent =
            "No commands found.";

        return;

    }


    commandList.forEach(
        command => {

            const card =
                document.createElement("article");


            card.className =
                "command-card";


            card.innerHTML = `

                <h3>
                    <code>/${escapeHTML(command.name)}</code>
                </h3>

                <p>
                    ${escapeHTML(command.description)}
                </p>

                <span class="command-category">
                    ${escapeHTML(command.category)}
                </span>

            `;


            commandsGrid.appendChild(card);

        }
    );


    updateCount(commandList.length);

}



/*
 * Update the search result counter.
 */

function updateCount(number) {

    if (number === commands.length) {

        count.textContent =
            `${number} command${number === 1 ? "" : "s"}`;

        return;

    }


    count.textContent =
        `${number} of ${commands.length} commands`;

}



/*
 * Search commands.
 */

function searchCommands() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderCommands(commands);

        return;

    }


    const filtered =
        commands.filter(
            command => {

                const name =
                    command.name
                        .toLowerCase();

                const description =
                    command.description
                        .toLowerCase();

                const category =
                    command.category
                        .toLowerCase();


                return (
                    name.includes(query) ||
                    description.includes(query) ||
                    category.includes(query)
                );

            }
        );


    renderCommands(filtered);

}



/*
 * Search as the user types.
 */

searchInput.addEventListener(
    "input",
    searchCommands
);



/*
 * Load everything when the page starts.
 */

loadCommands();