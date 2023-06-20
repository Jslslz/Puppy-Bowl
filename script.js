const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL)
        const players = await response.json()
        console.log(players)
        return players.data.players


    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`)
        const player = await response.json()
        return player


    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL , {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(playerObj)

        })
        const data = await response.json()
        fetchAllPlayers()
        window.location.reload()
        return data

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        })
        const deletePlayer = await response.json()
        fetchAllPlayers()
        window.location.reload()
        return deletePlayer

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerList.forEach((player) => {
            const playerElement = document.createElement('div')
            playerElement.classList.add('player-card')
            playerElement.innerHTML = `
            <h3> ${player.name}</h3>
            <h4> ${player.breed}</h4>
            <img src=" ${player.imageUrl}" alt= '${player.name}'><br>
            <button class="detail-button" data-id="${player.id}">See Details</button>
            <button class="delete-button" data-id="${player.id}">Remove Player</button>
            `

            playerContainer.appendChild(playerElement);

            let deleteButton = playerElement.querySelector('.delete-button')
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault()
                removePlayer(player.id)
            })
            let detailButton = playerElement.querySelector('.detail-button')
            detailButton.addEventListener('click', (event) => {
                event.preventDefault()
                renderSinglePlayer(player)
            })

        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderSinglePlayer = (player) => {
    let playerHTML = `
    <div class="single-player">
    <h3> ${player.name}</h3>
    <img src= " ${player.imageUrl}" alt= "${player.name}">
    <p> Breed: ${player.breed}</p>
    <p> Status: ${player.status}</p>
    <button class="back-button">Back</button>
    </div>
    
    `
    playerContainer.innerHTML= playerHTML
    
    let backButton = playerContainer.querySelector('.back-button')
    backButton.addEventListener('click', async() => {
        const players = await fetchAllPlayers()
        window.location.reload()
        renderAllPlayers(players)
        
    })
    
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const formElement = document.createElement('form')
        formElement.innerHTML = `
        <label for= 'name'>Name</label>
        <input type= 'text' id= 'name' name= 'name' placeholder= 'Name'>
        <label for= 'breed'>Breed</label>
        <input type= 'text' id= 'breed' name= 'breed' placeholder= 'Breed'>
        <button class= "create-button" type= 'submit'>Create Player</button> 
        `
        formElement.addEventListener("submit", async(event) => {
            event.preventDefault()
            const name = document.getElementById('name')
            const breed = document.getElementById('breed')

            const newPlayer = {
                name: name.value,
                breed: breed.value,
            }
            await addNewPlayer(newPlayer)
            renderAllPlayers([newPlayer])
        })
    
        newPlayerFormContainer.appendChild(formElement)
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm(players);
}

init();
