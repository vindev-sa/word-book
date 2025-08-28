const themeButton = document.querySelector("#themeButton");
const form = document.querySelector('#form');
const wordEl = document.querySelector('#word');
const toastEl = document.querySelector('#toast');
const sectionsEl = document.querySelector("#sections");
const definitionsEl = document.querySelector("#definitions");


function getDictionary(query) {
    if (query) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
        .then(info => info.json())
        .then(data => listItems(data))
        .catch(error => {
            console.log(`Houve um erro ao buscar a API. Erro: ${error}`);
            invokeToast(`Não foi possível encontrar <i>${query}</i> na base de dados.`, toastEl, 'flash-toast');
        }).finally(() => {
            console.log('Operação realizada com sucesso!');
        })
    } else {
        invokeToast("Digite algo no campo de pesquisa.", toastEl, 'flash-toast');
    }
}

function extractAcronymFromUrl(url) {
    return /([a-z]{2})\.mp3$/i.exec(url)[1];
}

function listItems(data) {
    definitionsEl.innerHTML = "";
    const {word, phonetics} = data[0];
    console.log(data)
    const wordInfo = `
        <div class='word-info'>
            <div class='word'>
                <h3>${word}</h3>
            </div>
        
        <div class='phonetic-buttons'>
            ${phonetics.map(source => {
                return source.audio && source.text ? `<button class='phonetic-button' onclick='document.querySelector("#audio-${extractAcronymFromUrl(source.audio)}").play()'>
                    ${extractAcronymFromUrl(source.audio)}
                    <span>${source.text}</span>
                    <i class='fa-solid fa-volume-high'></i>
                </button>
                <audio id='audio-${extractAcronymFromUrl(source.audio)}'>
                    <source src='${source.audio}' type='audio/mp3'></source>
                </audio>
                ` : ''
            }).join('')}
          </div>
        </div>
    `;

    

    let definitionSection = "";

    data.forEach((item, index) => {
        let definitionItem = "";
        item.meanings[0].definitions.forEach(def => {
            let synonyms = "";
            let antonyms = "";

            def.synonyms.forEach(syn => synonyms += `<li>${syn}</li>`);
            def.antonyms.forEach(ant => antonyms += `<li>${ant}</li>`);

            definitionItem += `<li class='definition-item'>
                    <div class='definition'>
                        ${def.definition}
                    </div>
                    ${def.example ? `<div class='example'><strong>Example: </strong>${def.example}</div>` : ''}
                    ${def.synonyms.length > 0 ? `<div class='synonyms'><strong>Synonyms: </strong><ol>${synonyms}</ol></div>` : ''}
                    ${def.antonyms.length > 0 ? `<div class='antonyms'><strong>Antonyms: </strong><ol>${antonyms}</ol></div>` : ''}
                </li>`
        });
        let details = `<details ${index === 0 ? 'open' : ''}>
            <summary>${item.meanings[0].partOfSpeech}</summary>
            <ol>${definitionItem}</ol>
        </details>`;
        definitionSection += `<div class='definition-section card-style'>${details}</div>`;
    });
    definitionsEl.innerHTML += wordInfo;
    definitionsEl.innerHTML += `<div class='sections'>${definitionSection}</div>`;
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    getDictionary(e.target[0].value);
    e.target[0].value = "";
});


themeButton.addEventListener('click', toggleTheme, false);

function invokeToast(message, toastElement, animationClass) {
    toastElement.classList.add(animationClass);
    toastElement.innerHTML = message;
    window.setTimeout(() => {
        toastElement.classList.remove(animationClass);
    }, 5000);
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}