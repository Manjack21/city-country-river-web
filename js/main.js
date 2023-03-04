

//___________________________________________________________________
// Init

const app= {
    timerOutput: null,
    timer: null,
    timerAudio: null,
    timerInterval: 60,
    timerValue: 0,
    letterAudio: null,
    letterOutput: null
};

const languages = ["deutsch", "english"];
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
    document.getElementsByName("timer.button")
        .forEach(btn => btn.addEventListener("click", timerButtonHandler));
    
    document.getElementById("timer.start").addEventListener("click", timerStartHandler)
    app.timerOutput = document.getElementById("timer.output");
    app.timerAudio = document.getElementById("timer.audio");


    document.getElementById("letter.start").addEventListener("click", letterButtonHandler)
    app.letterAudio = document.getElementById("letter.audio");
    app.letterOutput = document.getElementById("letter.output");
});

// Init end
//___________________________________________________________________
//___________________________________________________________________
// Categories

function categoriesButtonHandler(ev)
{
     

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

function timerStartHandler()
{
    if(app.timer != null)
        window.clearInterval(app.timer);
    
    app.timerValue = app.timerInterval + 1;
    app.timer = window.setInterval(
        (ev) => {
            app.timerValue--;
            app.timerOutput.innerText = app.timerValue;

            if(app.timerValue == 0)
            {
                app.timerAudio.play();
                window.clearInterval(app.timer);
                app.timer = null;
            }
        }, 
        1000
    );
}

// Timer end
//___________________________________________________________________