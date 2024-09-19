const startScreen = document.getElementById('startScreen')
const playScreen = document.getElementById('playScreen')
const finishScreen = document.getElementById('finishScreen')

const genBtn1 = document.getElementById('genBtn1')
const genBtn2 = document.getElementById('genBtn2')
const genBtn3 = document.getElementById('genBtn3')
const genBtn4 = document.getElementById('genBtn4')
const genBtn5 = document.getElementById('genBtn5')
const genBtn6 = document.getElementById('genBtn6')
const genBtn7 = document.getElementById('genBtn7')
const genBtn8 = document.getElementById('genBtn8')
const genBtn9 = document.getElementById('genBtn9')

const startBtn = document.getElementById('startBtn')
const finishBtn = document.getElementById('finishBtn')
const restartBtn = document.getElementById('restartBtn')

const nextBtn = document.getElementById('nextBtn')
const checkBtn = document.getElementById('checkBtn')

const errorText = document.getElementById('errorText')
const mainImage = document.getElementById('mainImage')
const userTextInput = document.getElementById('userTextInput')
const resultDisplay = document.getElementById('resultDisplay')
const scoreText = document.getElementById('scoreText')
const scoreText2 = document.getElementById('scoreText2')

// Gen Button Event Listeners
genBtn1.addEventListener('click', () => ToggleGenButton('gen1ActiveBool', genBtn1))
genBtn2.addEventListener('click', () => ToggleGenButton('gen2ActiveBool', genBtn2))
genBtn3.addEventListener('click', () => ToggleGenButton('gen3ActiveBool', genBtn3))
genBtn4.addEventListener('click', () => ToggleGenButton('gen4ActiveBool', genBtn4))
genBtn5.addEventListener('click', () => ToggleGenButton('gen5ActiveBool', genBtn5))
genBtn6.addEventListener('click', () => ToggleGenButton('gen6ActiveBool', genBtn6))
genBtn7.addEventListener('click', () => ToggleGenButton('gen7ActiveBool', genBtn7))
genBtn8.addEventListener('click', () => ToggleGenButton('gen8ActiveBool', genBtn8))
genBtn9.addEventListener('click', () => ToggleGenButton('gen9ActiveBool', genBtn9))


// Show Start Screen
playScreen.classList.add('hidden')
finishScreen.classList.add('hidden')


// Variable Declarations 
let buttonStates = {
    gen1ActiveBool: false,
    gen2ActiveBool: false,
    gen3ActiveBool: false,
    gen4ActiveBool: false,
    gen5ActiveBool: false,
    gen6ActiveBool: false,
    gen7ActiveBool: false,
    gen8ActiveBool: false,
    gen9ActiveBool: false,
}

let screenState = 1             // 1 = start, 2 = play, 3 = finish
let currentPokemonIndex = null
let selectedPokemon = []
let usedPokemon = []
let score = 0

// Event Listeners
startBtn.addEventListener('click', StartGame)
finishBtn.addEventListener('click', FinishGame)
restartBtn.addEventListener('click', RestartGame)
checkBtn.addEventListener('click', () => CheckAnswer(selectedPokemon))
nextBtn.addEventListener('click', () => NextPokemon())

userTextInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        CheckAnswer(selectedPokemon)
    }
})


function checkScreenSize() {
    const overlay = document.getElementById('desktopScreen');
    if (window.innerWidth >= 768) {
        overlay.classList.remove('hidden');  // Show the message on large screens
    } else {
        overlay.classList.add('hidden');  // Hide the message on mobile screens
    }
}

// Run the function on page load
checkScreenSize();

// Add an event listener to check when the user resizes the screen
window.addEventListener('resize', checkScreenSize);


function ToggleGenButton(stateKey, buttonElement) {
    buttonStates[stateKey] = !buttonStates[stateKey];
    buttonElement.classList.toggle('btn-pressed', buttonStates[stateKey]);
}

function StartGame() {
    ClearText()
    HideError()
    EnableButtons()
    nextBtn.classList.remove('hidden')
    selectedPokemon = SelectPokemon(pokemonData, buttonStates)
    if (selectedPokemon.length === 0) {
        ShowError()
        return
    }
    ProcessPokemon(selectedPokemon, usedPokemon)
    screenState = 2
    HandleHiddenClass()
}

function FinishGame() {
    screenState = 3
    HandleHiddenClass()
    scoreText2.innerHTML = `Score: ${score}`
}

function RestartGame() {
    ClearText()
    usedPokemon = []
    selectedPokemon = []
    currentPokemonIndex = null
    score = 0
    screenState = 1
    HandleHiddenClass()
}

function SelectPokemon(pokemonData, buttonStates) {
    let activeGenerations = [];

    Object.keys(buttonStates).forEach((key, index) => {
        if (buttonStates[key]) {
            // The gen number == the index + 1 (since gen1ActiveBool starts with gen 1)
            activeGenerations.push(index + 1);
        }
    });

    let selectedPokemon = pokemonData.filter(pokemon => activeGenerations.includes(pokemon.gen));
    console.log(selectedPokemon);

    return selectedPokemon;
}

function ProcessPokemon(selectedPokemon, usedPokemon) {
    if (usedPokemon.length === selectedPokemon.length - 1) {
        nextBtn.classList.add('hidden')
    } else if (usedPokemon.length >= selectedPokemon.length) {
        FinishGame()
        return
    }
    let randomIndex
    do {
        randomIndex = Math.floor(Math.random() * selectedPokemon.length)
    } while (randomIndex === currentPokemonIndex || usedPokemon.includes(selectedPokemon[randomIndex]))
    currentPokemonIndex = randomIndex
    usedPokemon.push(selectedPokemon[currentPokemonIndex])
    LoadPokemon(selectedPokemon)
    nextBtn.innerHTML = ("skip")
}

function LoadPokemon(selectedPokemon) {
    mainImage.src = selectedPokemon[currentPokemonIndex].image
    mainImage.classList.add('silhouette')
}

function CheckAnswer(selectedPokemon) {
    let userAnswer = userTextInput.value.trim().toLowerCase()
    if (userAnswer === selectedPokemon[currentPokemonIndex].name) {
        resultDisplay.classList.remove("resultIncorrect")
        resultDisplay.classList.add("resultCorrect")
        resultDisplay.innerHTML = `Correct! It's ${selectedPokemon[currentPokemonIndex].name}!`
        HandleScore(1)
    }
    else {
        resultDisplay.classList.remove("resultCorrect")
        resultDisplay.classList.add("resultIncorrect")
        resultDisplay.innerHTML = `Incorrect, It's ${selectedPokemon[currentPokemonIndex].name}!`
        HandleScore(0)
    }
    mainImage.classList.remove("silhouette")
    nextBtn.innerHTML = ("next")
    DisableButtons()
}

function NextPokemon() {
    ProcessPokemon(selectedPokemon, usedPokemon)
    ClearText()
    EnableButtons()
}

function HandleScore(int) {
    score = score + int
    scoreText.innerHTML = `Score: ${score}`
}

function ClearText() {
    userTextInput.value = ""
    resultDisplay.innerHTML = ""
    userTextInput.focus();
}

function ShowError(message = "Please select at least one generation.") {
    errorText.textContent = message;
    errorText.classList.remove('hidden');
}

function HideError() {
    errorText.textContent = null;
    errorText.classList.add('hidden');
}

function HandleHiddenClass() {
    switch (screenState) {
        case 1:
            startScreen.classList.remove('hidden')
            playScreen.classList.add('hidden')
            finishScreen.classList.add('hidden')
            break

        case 2:
            startScreen.classList.add('hidden')
            playScreen.classList.remove('hidden')
            finishScreen.classList.add('hidden')
            break

        case 3:
            startScreen.classList.add('hidden')
            playScreen.classList.add('hidden')
            finishScreen.classList.remove('hidden')
            break
    }
}

function EnableButtons() {
    checkBtn.disabled = false
    userTextInput.disabled = false
    checkBtn.classList.remove("disabledButton")
}

function DisableButtons() {
    checkBtn.disabled = true
    userTextInput.disabled = true
    checkBtn.classList.add("disabledButton")
}