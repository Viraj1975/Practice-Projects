// display
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

// copy password
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

// length
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

// checkboxes
const uppercase = document.querySelector("#UpperCase");
const lowercase = document.querySelector("#LowerCase");
const numbercb = document.querySelector("#numbers");
const symbolcb = document.querySelector("#symbols");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

// indicator
const indicator = document.querySelector("[dataIndicator]");

// generate button
const generateButton = document.querySelector(".generatebtn");

let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
handleSlider();
setIndicator("#ccc");

// set Password Length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min));
}

// set Indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


// generate random
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function getUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    return symbols.charAt(getRandomInteger(0,symbols.length));
}

// strength indicator
function strengthIndicator(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(numbercb.checked) hasNum = true;
    if(symbolcb.checked) hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym || passwordLength>=8)){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) && 
        passwordLength>=6
    ){
        setIndicator("#808080");
    }
    else if(passwordLength>10){
        setIndicator("#0f0");
    }
    else{
        setIndicator("#ff0");
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make wala span visible
    copyMsg.classList.add('active');
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
}

function shufflePassword(array){
    // Fisher Yates Method;
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=> (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkBox)=>{
        if(checkBox.checked) checkCount++;
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) copycontent();
});

generateButton.addEventListener('click',()=>{
    // no checkBox is selected;
    if(checkCount<=0) return ;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // remove old password;
    password = "";

    let functionArr = [];
    if(uppercase.checked){
        functionArr.push(getUpperCase);
    }
    if(lowercase.checked){
        functionArr.push(getLowerCase);
    }
    if(numbercb.checked){
        functionArr.push(getRandomNumber);
    }
    if(symbolcb.checked){
        functionArr.push(generateSymbol);
    }

    for(let i=0;i<functionArr.length;i++){
        password+=functionArr[i]();
    }

    // remaining addition
    for(let i=0;i<passwordLength-checkCount;i++){
        password+=functionArr[getRandomInteger(0,functionArr.length)]();
    }

    // now shuffle the password;
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    strengthIndicator();
});
