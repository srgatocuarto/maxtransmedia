
const storyNodes = {
    intro: {
        type: 'video',
        videoUrl: 'intro.mp4',
        description: 'Toma una desición',
        duration: 40,
        choices: [
            { id: 'atack', text: 'Ataca' },
            { id: 'resign', text: 'Resignate' },
            { id: 'huir', text: '¡Huye!'}
        ],
        defaultNextNode: 'timeOut',
        choiceTimeout: 15
    },
    atack: {
        type: 'video',
        videoUrl: '1.mp4',
        description: 'Toma una desición',
        duration: 33,
        choices: [
            { id: 'conti-atack', text: 'Seguir atacando' },
            { id: 'surrender-max', text: 'No seguir atacando'}
        ],
        defaultNextNode: 'timeOut',
        choiceTimeout: 15
    },
    resign: {
        type: 'video',
        videoUrl: '2.mp4',
        description: 'Toma una desición',
        duration: 43,
        choices: [
            { id: 'seguir-luch', text: 'levantarse y luchar' },
            { id: 'rendirse-max', text: 'Rendirse'}
        ],
        defaultNextNode: 'timeOut',
        choiceTimeout: 15
    },
    huir: {
        type: 'video',
        videoUrl: '3.mp4',
        description: 'Toma una descision',
        duration: 42,
        choices: [
            { id: 'pelea-sobrev', text: 'pelea por sobrevivir' },
            { id: 'divagar-max', text: 'no peleas, solo divagas'}
        ],
        defaultNextNode: 'timeOut',
        choiceTimeout: 15
    },


    // Nodos finales - estos no tienen elecciones
    'conti-atack': {
        type: 'video',
        videoUrl: '4.mp4',
        description: 'final 2',
        duration: 30,
        isEnding: true,
        endingType: 'positive',
        endingMessage: 'Gracias por ver'
    },
    'surrender-max': {
        type: 'video',
        videoUrl: '5.mp4',
        description: 'Final 3',
        duration: 31,
        isEnding: true,
        endingType: 'positive',
        endingMessage: 'Gracias por ver'
    },
    'seguir-luch': {
        type: 'video',
        videoUrl: '6.mp4',
        description: 'final 5',
        duration: 45,
        isEnding: true,
        endingType: 'positive',
        endingMessage: 'Gracias por ver'
    },
    'rendirse-max': {
        type: 'video',
        videoUrl: '7.mp4',
        description: 'Final 6',
        duration: 33,
        isEnding: true,
        endingType: 'positive',
        
    },
    'pelea-sobrev': {
        type: 'video',
        videoUrl: '8.mp4',
        description: 'final 8',
        duration: 29,
        isEnding: true,
        endingType: 'positive',
        endingMessage: 'Gracias por ver'
    },
    'divagar-max': {
        type: 'video',
        videoUrl: '9.mp4',
        description: 'Final 9',
        duration: 34,
        isEnding: true,
        endingType: 'positive',
        endingMessage: 'Gracias por ver'
    },

    timeOut: {
        type: 'video',
        videoUrl: '10.mp4',
        description: 'Final por no tomar decisión a tiempo',
        duration: 3,
        isEnding: true,
        endingType: 'negative',
        endingMessage: ''
    }
};

// Estado de la aplicación
let currentNode = null;
let timerInterval = null;
let remainingTime = 0;
let videoTimer = null;
let choicesVisible = false;

// Referencias a elementos DOM
const appElement = document.getElementById('app');
const videoContainer = document.getElementById('video-container');
const videoPlaceholder = document.getElementById('video-placeholder');
const choicesContainer = document.getElementById('choices-container');
const timerElement = document.getElementById('timer');
const timerProgress = document.querySelector('.timer-progress');
const statusText = document.getElementById('status-text');
const introScreen = document.getElementById('intro-screen');
const startButton = document.getElementById('start-button');
const endButton = document.getElementById('end-button');
const storyNav = document.getElementById('story-nav'); // ID cambiado aquí

// Constantes
const TIMER_CIRCUMFERENCE = 283; // 2 * PI * 45 (radio del círculo)

// Event listener para el botón de créditos (¡CRUCIAL: FUERA DE CUALQUIER FUNCIÓN!)
const creditsButton = document.getElementById('credits-button');
creditsButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

        const triggerAreaHeight = 50; // Altura en píxeles de la zona superior donde se activará la barra

        document.addEventListener('mousemove', (e) => {
            if (e.clientY < triggerAreaHeight) {
                storyNav.classList.add('show');
            } else {
                storyNav.classList.remove('show');
            }
        });

// Inicio de la experiencia
startButton.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
        introScreen.style.display = 'none';
        startExperience();
    }, 1000);
});

function startExperience() {
    statusText.textContent = 'Preparando...';

    // Simulamos carga de recursos
    setTimeout(() => {
        statusText.classList.add('fade-out');
        setTimeout(() => {
            statusText.style.display = 'none';
            navigateToNode('intro');
        }, 1000);
    }, 2000);
}

//Fin experiencia

endButton.addEventListener('click', () => {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
        introScreen.style.display = 'none';
        endExperience();
    },1000)
})
function endExperience (){
    statusText.textContent = 'Gracias por ver :)';
    statusText.style.display = 'block';
    statusText.classList.add('fade-out');

    setTimeout(() => {
        statusText.classList.add('fade-out');
        setTimeout(() => {
            statusText.style.display = 'none';
            resetExperience();
        }, 1000)
    }, 2000)
}

function resetExperience() {
    introScreen.style.display = 'flex';
    introScreen.classList.remove('fade-out');
}

function navigateToNode(nodeId) {

    // Limpiamos timers anteriores
    clearAllTimers();

    currentNode = storyNodes[nodeId];

    if (!currentNode) {
        showError(`Error: No se encontró el nodo "${nodeId}"`);
        return;
    }

    // Reproducir video (simulado)
    playVideo(currentNode);

    // Si es un final, no mostramos opciones
    if (currentNode.isEnding) {
        setTimeout(() => {
            showEnding(currentNode);
        }, (currentNode.duration * 1000));
        return;
    }

    // Programar mostrar opciones después del tiempo de video
    setTimeout(() => {
        showChoices(currentNode);
        startChoiceTimer(currentNode);
    }, ((currentNode.duration - currentNode.choiceTimeout) * 1000));
}

function playVideo(node) {
    const videoElement = document.getElementById('video-placeholder');
    const videoSource = `assets/${node.videoUrl}`;
    // En una implementación real, aquí reproduciríamos el video
    // Para este prototipo, solo cambiamos la imagen placeholder

    // Simulamos cambio de escena
    videoPlaceholder.classList.add('fade-out');
    setTimeout(() => {
        // En un caso real, cambiaríamos la fuente del video
        videoElement.src = videoSource;
        videoElement.load(); // Carga el nuevo video
        videoElement.play(); // Inicia la reproducción
        videoPlaceholder.classList.remove('fade-out');
        videoPlaceholder.classList.add('fade-in');
        setTimeout(() => {
            videoPlaceholder.classList.remove('fade-in');
        }, 1000);
    }, 1000);

    // Simulamos duración del video
    videoTimer = setTimeout(() => {
        // Este timer solo es relevante si no hay elecciones o si no se elige a tiempo
        if (!choicesVisible && !node.isEnding) {
            navigateToNode(node.defaultNextNode);
        }
    }, (node.duration * 2000));
}

function showChoices(node) {
    choicesContainer.innerHTML = ''; // Clears any previous content

    // 1. Create and append the text element first
    const choicePromptText = document.createElement('div');
    choicePromptText.classList.add('choice-prompt-text');
    choicePromptText.textContent = node.description; // Or your desired text
    choicesContainer.appendChild(choicePromptText); // This is appended first, so it appears at the top

    // 2. Loop through choices and append buttons second
    node.choices.forEach(choice => {
        const choiceButton = document.createElement('div');
        choiceButton.classList.add('choice');
        choiceButton.textContent = choice.text;
        choiceButton.addEventListener('click', () => makeChoice(choice.id));
        choicesContainer.appendChild(choiceButton); // These are appended after the text, so they appear below it
    });

    choicesContainer.style.opacity = '1';
    choicesVisible = true;
}

function startChoiceTimer(node) {
    if (!node.choiceTimeout) return;

    remainingTime = node.choiceTimeout;
    timerElement.style.opacity = '1';

    // Actualizar el círculo de progreso
    updateTimerVisual(remainingTime, node.choiceTimeout);

    timerInterval = setInterval(() => {
        remainingTime -= 0.1;

        updateTimerVisual(remainingTime, node.choiceTimeout);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            makeChoice(node.defaultNextNode);
        }
    }, 100);
}

function updateTimerVisual(remaining, total) {
    const progress = (remaining / total);
    const dashOffset = TIMER_CIRCUMFERENCE * (1 - progress);
    timerProgress.style.strokeDashoffset = dashOffset;
}

function makeChoice(choiceId) {
    if (!choicesVisible) return;

    // Ocultar opciones y timer
    hideUIElements();

    // Navegar al siguiente nodo
    setTimeout(() => {
        navigateToNode(choiceId);
    }, 500);
}

function hideUIElements() {
    choicesContainer.style.opacity = '0';
    timerElement.style.opacity = '0';
    choicesVisible = false;
    clearInterval(timerInterval);
}

function showEnding(node) {
    hideUIElements();

    statusText.textContent = node.endingMessage;
    statusText.style.display = 'block';
    statusText.classList.remove('fade-out');
    statusText.classList.add('fade-in');

    // Mostrar botón para reiniciar
    setTimeout(() => {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'VOLVER A EMPEZAR';
        restartButton.id = 'end-button';
        restartButton.addEventListener('click', () => {
            statusText.classList.add('fade-out');
            setTimeout(() => {
                statusText.innerHTML = '';
                statusText.classList.remove('fade-in', 'fade-out');
                endExperience();
            }, 500);
        });
        statusText.appendChild(document.createElement('br'));
        statusText.appendChild(document.createElement('br'));
        statusText.appendChild(restartButton);
    }, 500);
}

function showError(message) {
    statusText.textContent = message;
    statusText.style.display = 'block';
    statusText.classList.remove('fade-out');
    statusText.classList.add('fade-in');
}

function clearAllTimers() {
    clearInterval(timerInterval);
    clearTimeout(videoTimer);
}
