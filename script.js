// get right word 
const URL_GET_WORLD = "https://words.dev-apis.com/word-of-the-day"
const URL_CHECK_WORLD = "https://words.dev-apis.com/validate-word"
let findCorrectWord = false;
let word = Array(0)
let currentRow = 0;
async function getWord() {
    let response = await fetch(URL_GET_WORLD);
    return response.json();
}

async function checkWord(input){
    let response = await fetch(
        URL_CHECK_WORLD,{
            method: "POST",
            body: JSON.stringify({
                word: input
            }),
        }        
    )
    return response.json();
}
let keyword;
getWord().then(function handleGetWord(rst){
    keyword = rst['word'];
})



// handle keyboard press 
// a -> z: 65 -> 90 
// backspace: 8
// enter: 13
let alreadyCheck = false;
if(!findCorrectWord){
    document.onkeydown = function(e){
        if(findCorrectWord) return;
        switch(e.keyCode){
            case 8: {
                if(word.length % 5 != 0){
                    clearUI();
                    word.pop();
                }else{
                    if(Math.floor(word.length / 5) - 1 == currentRow){
                        clearUI();
                        word.pop();
                    }
                }
                break;
            }
            case 13: {
                if(word.length % 5 != 0){
                    break
                }else{
                    handleCheckWord().then(function(result){
                        if(result){
                            updateBackgroundForItem();
                            currentRow++;
                        }
                    })
                }
                break;
            }
            default: {
                if(e.keyCode >= 65 && e.keyCode <= 90){
                    if(word.length % 5 == 0 && word.length != 0){
                        let check = Math.floor(word.length / 5) - 1
                        if(check == currentRow){
                            word[word.length-1] = e.key;
                        }else{
                            word.push(e.key);
                        }
                        updateUI();
                    }else{
                        word.push(e.key);
                        updateUI();
                    }
                }
                break;
            }
        }
    }
}

function updateUI(){
    let className;
    let t = word.length % 5 - 1;
    if(word.length % 5 == 0) t = 4;
    className = ".item-" + currentRow + "-" + t;
    let position = document.querySelector(className);
    position.innerText = word[word.length - 1]
}

function clearUI(){
    let currentSize = word.length;
    if(currentSize == 0) return;
    let t 
    if(word.length % 5 == 0) t = 4;
    else t = word.length % 5 - 1;
    let className = ".item-" + currentRow + "-" + t;
    let position = document.querySelector(className);
    position.innerText = " ";
}

async function handleCheckWord(){
    let progress = document.querySelector(".loader")
    progress.style.visibility = "visible";
    let myWord = "";
    for(let i = word.length - 5; i < word.length; ++i){
        myWord += word[i]
    }
    let checkResult = await checkWord(myWord);
    progress.style.visibility = "hidden"
    if(!checkResult['validWord']){
        for(let i = 0; i < 5; ++i){
            let item = document.querySelector(".item-"+currentRow+"-"+i);
            item.style.animation = "highlightError 1s linear"
        }
    }
    return checkResult['validWord']
}
function updateBackgroundForItem(){
    let isTrueAll = true;
    for(let i = word.length - 5, j = 0; i < word.length; ++i, ++j){
        let item = document.querySelector(".item-"+currentRow+"-"+j);
        if(word[i] == keyword[j]){
            item.style.backgroundColor = "#006400"
        }else if(keyword.includes(word[i])){
            item.style.backgroundColor = "goldenrod"
            isTrueAll = false;
        }else{
            item.style.backgroundColor = "#888"
            isTrueAll = false;
        }
    }
    if(isTrueAll) {
        findCorrectWord = true;
        let successItem = document.querySelector(".img-congratulation")
        successItem.style.visibility = "visible"
    }
}

