//page elements
const result = document.querySelector(".result");
const sBar = document.getElementById("user-word");
const searchButton = document.getElementById("search-btn");
const toggleButton = document.getElementById("toggle-btn");
const r = document.querySelector(":root");
const title = document.getElementById("verName");
const infoButton = document.getElementById("info");
const infoCont = document.getElementById("info-container");
const closeButton = document.getElementById("close-btn");
const randSlider = document.getElementById("random-slider");
const sliderValue = document.getElementById("slider-value");

//PLEASE LOOK UP THAT PROTECTING API KEY THING AGAIN KAYLA JFC
//endpoint constants
const dmEndpoint = "https://api.datamuse.com/words?";
const wnEndpoint = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=mqcjczk3r7ftv2nowoubri4i0t7dspvy89w5ohkhg3tupi54c";

//datamuse endpoint suffixes
const ant = "rel_ant=";
const hom = "rel_hom=";
const rhyme = "rel_rhy=";
const slantRhyme = "rel_nry=";
const consonant = "rel_cns=";
const triggers = "rel_trg=";
const freqFol = "rel_bga=";
const freqPred = "rel_bgb=";
const partOf = "rel_par=";

//datamuse metadata flags
const normSearch = "sp=";
const dmMDFlags = "&md=dpr";

//control variables
let dataType = 0;
let bffr = "word";
let doRetry = true;
let toggleOn = false;
let randVal = 0;

//CSS variables
var rstyle = getComputedStyle(r);
//palette 1
const pal1Dark = rstyle.getPropertyValue('--p1dark');
const pal1Mid1 = rstyle.getPropertyValue('--p1mid1');
const pal1Mid2 = rstyle.getPropertyValue('--p1mid2');
const pal1Light1 = rstyle.getPropertyValue('--p1light1');
const pal1Light2 = rstyle.getPropertyValue('--p1light2');
//palette 2
const pal2Dark = rstyle.getPropertyValue('--p2dark');
const pal2Mid1 = rstyle.getPropertyValue('--p2mid1');
const pal2Mid2 = rstyle.getPropertyValue('--p2mid2');
const pal2Light1 = rstyle.getPropertyValue('--p2light1');
const pal2Light2 = rstyle.getPropertyValue('--p2light2');


//initially set color palette
title.style.color = pal1Dark;
closeButton.style.color = pal1Mid1;
document.getElementById("main-container").style.backgroundColor = pal1Light2;
document.getElementById("what-is").style.color = pal1Mid2;
sBar.style.backgroundColor = pal1Light2;
sBar.style.color = pal1Mid1;
sBar.style.boxShadow = "0 10px 20px #b8dbd9";
document.getElementById("search-btn").style.backgroundColor = pal1Mid2;
document.getElementById("info").style.color = pal1Mid1;

randSlider.addEventListener("input", slider);

toggleButton.addEventListener("click", () => {
    if (!toggleOn) {
        toggleOn = true;
    } else {
        toggleOn = false;
    }
    toggleMode();
});

infoButton.addEventListener("click", () => {
    infoCont.classList.toggle("hide");
});

closeButton.addEventListener("click", () => {
    infoCont.classList.toggle("hide");
})

//on search button click
//put in if statement to keep track of what mode we're in and toggle which function gets called
searchButton.addEventListener("click", () => {
    if (toggleOn) {
        getCorrectDefs();
    } else {
        if (randVal <= 3) {
            getDatamuseData(dataType);
            //set data type to 0 if it's been mutated by previous attempts
            dataType = 0;
        } else if (randVal > 3 && randVal < 7) {
            dataType = Math.floor(Math.random() * 11);
            getDatamuseData(dataType);
        } else {
            pullRandomWord();
        }  
    }
});

//detect enter key press in search bar
sBar.addEventListener("keypress", e => {

    if (e.key == "Enter") {
        console.log("Enter key press");
        searchButton.click();
    }
})

function slider() {
    randVal = randSlider.value;
    sliderValue.textContent = randSlider.value;
}

//to get wrong definitions, get information from datamuse first; before changing innerHTML, the structure of this thing is about to be absolutely heinous
function getDatamuseData(wordRel) {
    //resets retry boolean if it's been mutated by me testing stupid stuff as usual
    doRetry = true;
    let searchWord = document.getElementById("user-word").value;
    let apiUrl = dmEndpoint;
    switch (wordRel) {
        case 0:
            apiUrl += ant;
            break;
        case 1:
            apiUrl += hom;
            break;
        case 2:
            apiUrl += rhyme;
            break;
        case 4:
            apiUrl += slantRhyme;
            break;
        case 5:
            apiUrl += consonant;
            break;
        case 6:
            apiUrl += triggers;
            break;
        case 7:
            apiUrl += freqFol;
            break;
        case 8:
            apiUrl += freqPred;
            break;
        case 9:
            apiUrl += partOf;
            break;
        case 10:
            bffr = searchWord;
            alert("You searched " + bffr + ". I just want to know WHY.")
            console.clear();
            dataType = 0;
            doRetry = false;
            //console.log("In switch block")
            break;
    }
    //add on the rest of the API url
    apiUrl += searchWord + dmMDFlags;
    fetch(`${apiUrl}`).then((response) => response.json()).
    then((data) => {
        console.log(data);
        //sets an iterator
        let i = 0;
        //checks if defs[0] contains the word being searched for
        while (data[i].defs[0].includes(searchWord) || data[i].defs[0].includes("surname")){
            //increments i
            i++;
        }

        //console.log("not in switch block");

        result.innerHTML = `<div class="word">
    <h3>${searchWord}</h3>
</div>
<div class="details">
</div>
<p class="def">${data[i].defs[0]}</p>`;
    }).catch(() => {
        if (doRetry) {
            retry();
        } else {
            result.innerHTML = `<h3 class="h3-error">No results found.</h3>`
        }
    })

}

function retry() {
    //clear console first
    console.clear();
    //increment data type to try to search for a different word
    dataType++;
    getDatamuseData(dataType);
}

function toggleMode() {
    const mainBg = document.getElementsByTagName("body")[0];
    const bodyElem = document.querySelectorAll("mode-change");

    
    //if necessary change background css variable manually? would hate to have to do that
    if (toggleOn) {
        //change element colors
        mainBg.style.backgroundColor = pal2Mid2;
        title.style.color = pal2Dark;
        title.style.textShadow = "-0.015em 0 5px #d58936, 0.015em 0 5px #d58936, 0 -0.015em 5px #d58936, 0 0.015em 5px #d58936";
        document.getElementById("main-container").style.backgroundColor = pal2Light2;
        document.getElementById("what-is").style.color = pal2Mid1;
        document.getElementById("user-word").style.backgroundColor = pal2Light2;
        document.getElementById("user-word").style.color = pal2Mid1;
        document.getElementById("user-word").style.boxShadow = "0 10px 20px #d58936";
        document.getElementById("search-btn").style.backgroundColor = pal2Mid2;
        document.getElementById("info").style.color = pal2Mid1;
        closeButton.style.color = pal2Mid1;

        //change toggle icon to WAS mode
        toggleButton.innerHTML = `<i id="toggle-btn" class="material-icons">cancel</i>`;
        toggleButton.style.color = pal2Dark;


        //change text to other thing
        title.innerHTML = `<h1 id="verName" class="mode-change">Wrong Answers</br>SOMETIMES</h1>`;
        
    } else {
        mainBg.style.backgroundColor = pal1Mid2;
        //change text back
        title.innerHTML = `<h1 id="verName" class="mode-change">Wrong Answers</br>ONLY</h1>`;
        title.style.color = pal1Dark;
        title.style.textShadow = "-0.015em 0 5px #f2f3ae, 0.015em 0 5px #f2f3ae, 0 -0.015em 5px #f2f3ae, 0 0.015em 5px #f2f3ae";        closeButton.style.color = pal1Mid1;
        document.getElementById("main-container").style.backgroundColor = pal1Light2;
        document.getElementById("what-is").style.color = pal1Mid2;
        document.getElementById("user-word").style.backgroundColor = pal1Light2;
        document.getElementById("user-word").style.color = pal1Mid1;
        document.getElementById("user-word").style.boxShadow = "0 10px 20px #b8dbd9";
        document.getElementById("search-btn").style.backgroundColor = pal1Mid2;
        document.getElementById("info").style.color = pal1Mid1;

         //change icon back to WAO mode
         toggleButton.innerHTML = `<i id="toggle-btn" class="material-icons">check_circle</i>`;

        //change text back
        title.innerHTML = `<h1 id="verName" class="mode-change">Wrong Answers</br>ONLY</h1>`;
    }
}

function getCorrectDefs() {
    let searchWord = document.getElementById("user-word").value;
    fetch(`${dmEndpoint}${normSearch}${searchWord}${dmMDFlags}`).then((response) => response.json()).
    then((data) => {
        console.log(data);
        //console.log("not in switch block");

        result.innerHTML = `<div class="word">
    <h3>${searchWord}</h3>
</div>
<div class="details">
</div>
<p class="def">${data[0].defs[0]}</p>`;
    }).catch(() => {
        if (doRetry) {
            retry();
        } else {
            result.innerHTML = `<h3 class="h3-error">No results found.</h3>`;
        }
    })
}

//Use Wordnik API to get a completely random word, then pull rest of necessary info from Datamuse?
function pullRandomWord() {
    //wordnik API format: 
    fetch(`${wnEndpoint}`).then((response) => response.json()).
    then((data) => {
        console.log(data);
        //console.log("not in switch block");

        result.innerHTML = `<div class="word">
    <h3>${searchWord}</h3>
</div>
<div class="details">
</div>
<p class="def">${data[0].defs[0]}</p>`;
    }).catch(() => {
        if (doRetry) {
            retry();
        } else {
            result.innerHTML = `<h3 class="h3-error">No results found.</h3>`;
        }
    })
}