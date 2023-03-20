

//___________________________________________________________________
// Init

const app= {
    timerOutput: null,
    timer: null,
    timerAudio: null,
    timerInterval: 60,
    timerValue: 0,
    letterAudio: null,
    letterOutput: null,
    categoriesAudio: null,
    categoriesOutput: null,
    categoryEntryCounts: {
        general: 25,
        adult: 9
    }

};

const languages = ["english", "deutsch"];
window.i18n = new vanilla_i18n (
    languages,
    opts = {
        path: "lang",
        debug: false,
        i18n_attr_name: "key",
        toggler_id: "i18n-toggler",
        default_language: languages[0],
    }
);
window.i18n.run();
window.addEventListener("load", (ev) => {
    document.getElementsByName("sectionHeader")
        .forEach(header => header.addEventListener("click", toggleSection))

    document.getElementsByName("timer.button")
        .forEach(btn => btn.addEventListener("click", timerButtonHandler));
    
    document.getElementById("timer.start").addEventListener("click", timerStartHandler)
    app.timerOutput = document.getElementById("timer.output");
    app.timerAudio = document.getElementById("timer.audio");


    document.getElementById("letter.start").addEventListener("click", letterButtonHandler)
    app.letterAudio = document.getElementById("letter.audio");
    app.letterOutput = document.getElementById("letter.output");

    
    document.getElementById("categories.start").addEventListener("click", categoriesButtonHandler)
    app.categoriesAudio = document.getElementById("categories.audio");
    app.categoriesOutput = document.getElementById("categories.output");
});


function toggleSection(event)
{
    const header = (event.target.tagName == "I18N" ? event.target.parentElement : event.target).parentElement;
    
    const content = header.parentElement.querySelector("div");
    if(content.classList.contains("w3-hide"))
        content.classList.remove("w3-hide")
    else
        content.classList.add("w3-hide")
}

// Init end
//___________________________________________________________________
//___________________________________________________________________
// Categories

function categoriesButtonHandler(ev)
{
    
    const category = Array.from(document.getElementsByName("theme")).filter(e => e.checked)[0].value;
    const maxIndex = app.categoryEntryCounts[category];
    let key = "categories."+category+"."+Math.floor(Math.random() * maxIndex);
    
    app.categoriesOutput.attributes["key"].value = key;
    window.i18n.run();
}


// Categories end
//___________________________________________________________________
//___________________________________________________________________
// Letters

function letterButtonHandler(ev)
{
    app.letterOutput.classList.remove("w3-blue");
    app.letterOutput.classList.add("w3-light-grey");

    let lastTimeout = 3;
    let currentCharOffset = Math.floor(Math.random() * 25);
    let nextTimeout = function() {
        lastTimeout = lastTimeout + Math.floor(Math.random() * lastTimeout);
        return lastTimeout;
    }
    
    let nextCharHandler = function (ev) {
        currentCharOffset++;
        if(currentCharOffset == 26) currentCharOffset = 0;

        app.letterOutput.innerText = String.fromCharCode(65+currentCharOffset);
        if(lastTimeout < 600)
        {
            window.setTimeout(nextCharHandler, nextTimeout());
        }
        else
        {
            app.letterOutput.classList.remove("w3-light-grey");
            app.letterOutput.classList.add("w3-blue");
            app.letterAudio.play();
        }
    }
    
    window.setTimeout(nextCharHandler, nextTimeout());
}


// Letters end
//___________________________________________________________________
//___________________________________________________________________
// Timer

function timerButtonHandler(ev)
{
    const clickedButton = (ev.target.tagName == "I18N" ? ev.target.parentElement : ev.target)

    document.getElementsByName("timer.button")
        .forEach(btn => btn.classList.remove("w3-blue"));
    
    app.timerInterval = Number.parseInt(clickedButton.dataset.seconds);    
    clickedButton.classList.add("w3-blue")
}

function timerStartHandler(ev)
{
    const clickedButton = (ev.target.tagName == "I18N" ? ev.target.parentElement : ev.target);
    
    // on every click, the current timer will be cleared
    // on stop and on start (to start another timer)
    if(app.timer != null)
        window.clearInterval(app.timer);

    if(clickedButton.dataset.action == "start")
    {
        app.timerValue = app.timerInterval;
        app.timerOutput.innerText = app.timerInterval;

        app.timer = window.setInterval(
            (ev) => {
                app.timerValue--;
                app.timerOutput.innerText = app.timerValue;

                if(app.timerValue == 0)
                {
                    toggleStartButton(clickedButton);
                }
            }, 
            1000
        );
    }

    toggleStartButton(clickedButton);
}

function toggleStartButton(button)
{
    const i18n = button.querySelector("i18n");

    if(button.dataset.action == "stop")
    {
        button.dataset.action = "start";
        i18n.attributes["key"].value = "timer.start";
        app.timerOutput.innerText = 0;
        app.timerAudio.play();
        window.clearInterval(app.timer);
        app.timer = null;
    }
    else
    {
        button.dataset.action = "stop";
        i18n.attributes["key"].value = "timer.stop";
    }
    
    window.i18n.run();
}

// Timer end
//___________________________________________________________________
