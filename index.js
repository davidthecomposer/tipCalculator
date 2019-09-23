/* jshint esversion: 6 */
const mp = document.getElementById('mp');
const tipCalc = document.querySelector('form');
const pt = document.getElementById('pt');
const ta = document.getElementById('ta');
const total = document.getElementById('total');
const submit = document.getElementById('submit');
const inputs = document.querySelectorAll('.text');
const tipButtons = document.querySelectorAll('.tip-buttons');
const reset = document.getElementById('reset');
const errorMessage = document.querySelector('.error-message');

// remove placeholder when an input is selected
const focusHandle = (event) => {
    event.target.placeholder = '';
    event.target.value = '';

};

// handles the logic of inputting valid data and what happens when switching inputs
const blurHandle = (event) => {
    let inputName = event.target.name;
    let value = event.target.value;
    let inputAlter = value + '%';
    let inputAlter1 = '$' + value;


    if (inputName === 'pt' && value === '') {
        event.target.placeholder = '0%';
    } else if (inputName === 'pt' && value.substr(value.length - 1) === '.') {
        event.target.value =  value + '0%';
    } else if (inputName === 'pt' && value !== '') {
        if (value.includes('%') === false) {
            event.target.value = inputAlter;
        }
    } else if (inputName !== 'pt' && value === '') {
        event.target.placeholder = '$0.00';
    }   else if (inputName !== 'pt' && value.substr(value.length - 1) === '.') {
        event.target.value = '$' + value + '00';
     } else if (inputName !== 'pt' && value !== '') {
        if (value.includes('$') === false) {
            event.target.value = inputAlter1;
        }
    }
    let answers = [...inputs].filter((input) => input.value);
    if (answers.length > 1) {
        submit.classList.add('pulse');
        for (let input of inputs) {
            if (input.value === '') {
                input.disabled = true;
            }
        } for (let button of tipButtons) {
            button.removeEventListener('click', tipOptions);
        }      
    } else {
        for (let input of inputs) {
            input.disabled = false;
        }
    }
};

//controls what characters can be input by the user
const inputConstrain = (event) => {
    let lastChar = event.target.value.charAt(event.target.value.length - 1);
    let badLetters = /[^0-9$.%]/gi;
    let check = lastChar.match(badLetters);
    let string = event.target.value;
    let decimalFilter = event.target.value.split('').filter(char => char === '.');
    let dollarFilter = event.target.value.split('').filter(char => char === '$');


//Constraints for Meal Price, Tip Amount and Total Cases: 
    if (event.target.name === 'mp' || event.target.name === 'ta' || event.target.name === 'total') {
        if (decimalFilter.length === 1 && string.charAt(string.length - 3) === '.') {
            event.target.maxLength = string.length;
        }  else if (decimalFilter.length === 2) {
            event.target.maxLength = 8;
            badLetters = /[^0-9]/gi;
            check = lastChar.match(badLetters);
            if (check) {
                if (check.length === 1) {
                    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                }
            }
        }  else if (dollarFilter.length === 2 || event.target.value[1]) {
            event.target.maxLength = 8;
            badLetters = /[^0-9.]/gi;
            check = lastChar.match(badLetters);
            if (check) {
                if (check.length === 1) {
                    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                }
            }
        }  else {
            badletters = /[^0-9.$]/gi;
            check = lastChar.match(badLetters);
            if (check) {
                if (check.length === 1) {
                    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                }
            }
        }
 // Constraints for Percentage Tip cases. 
    } else if (event.target.name === 'pt') {
        if (lastChar === '%') {
            event.target.maxLength = string.lastIndexOf('%');
        } else if (decimalFilter.length === 1 && string.charAt(string.length - 3) === '.') {
            event.target.maxLength = string.length;
        } else if (decimalFilter.length === 2) {
            badLetters = /[^0-9%]/gi;
            check = lastChar.match(badLetters);
            if (check) {
                if (check.length === 1) {
                    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                }
            }
        } else {
            event.target.maxLength = 6;
            badLetters = /[^0-9.%]/gi;
            check = lastChar.match(badLetters);
            if (check) {
                if (check.length === 1) {
                    event.target.value = event.target.value.substring(0, event.target.value.length - 1);
                }
            }
        }
    }
};

//controls the tip button logic:
const tipOptions = (event) => {
    if ([...event.target.classList].includes('tip-click')) {
        event.target.classList.remove('tip-click');
        pt.value = '0%';
    } else {
        for (let buttons of tipButtons) {
            if ([...buttons.classList].includes('tip-click')) {
                buttons.classList.remove('tip-click');
            }
            event.target.classList.add('tip-click');
            pt.focus();
            pt.value = event.target.innerHTML;
            pt.blur();
        }
    }
};

//for the purple hover effect on the tip buttons
const tipHover = (event) => {
    event.target.classList.add('tip-hover');
};

//to remove the hover effect
const tipExit = (event) => {
    event.target.classList.remove('tip-hover');
};

//adds the shimmer effect on inputs.
const shimmer = (event) => {
    event.target.classList.add('shimmer');
};

// This is the main calculation that takes place after clicking submit:
submit.onclick = () => {
    for (let input of inputs) {
        if (input.disabled === true) {
            input.disabled = false;
        }
    }
    
    let answers = [...inputs].map((input) => input.value);
    let answers1 = [...inputs].filter((input) => input.value);
    let mealPrice = parseFloat(mp.value.substring(1));
    let percentageTip = parseFloat(pt.value.substring(0, pt.value.length - 1)) / 100;
    let tipAmount = parseFloat(ta.value.substring(1));
    let totalPrice = parseFloat(total.value.substring(1));
    let percentageTipCalc = tipAmount / mealPrice;
    let tipAmountCalc = mealPrice * percentageTip;
    let totalPriceCalc = mealPrice + tipAmount;

    
    if (answers1.length > 1) {
    
    if (answers[0] && answers[1]) {
        ta.value = '$' + tipAmountCalc.toFixed(2);
        tipAmount = parseFloat(ta.value.substring(1));
        total.value = '$' + (mealPrice + tipAmount).toFixed(2);
    } else if (answers[0] && answers[2]) {
        pt.value = (percentageTipCalc * 100).toFixed(1) + '%';
        total.value = '$' + totalPriceCalc.toFixed(2);
    } else if (answers[0] && answers[3]) {
        ta.value = '$' + (totalPrice - mealPrice).toFixed(2);
        tipAmount = parseFloat(ta.value.substring(1));
        pt.value = (tipAmount * 100 / mealPrice).toFixed(1) + '%';
    } else if (answers[1] && answers[2]) {
        mp.value = '$' + (tipAmount / percentageTip).toFixed(2);
        mealPrice = parseFloat(mp.value.substring(1));
        total.value = '$' + (mealPrice + tipAmount).toFixed(2);
    } else if (answers[1] && answers[3]) {
        mp.value = '$' + (totalPrice / (percentageTip + 1)).toFixed(2);
        mealPrice = parseFloat(mp.value.substring(1));
        ta.value = '$' + (totalPrice - mealPrice).toFixed(2);
    } else if (answers[2] && answers[3]) {
        mp.value = '$' + (totalPrice - tipAmount).toFixed(2);
        pt.value = (tipAmount * 100 / mp.value.substring(1)).toFixed(1) + '%';
    }
    submit.hidden = true;
    reset.hidden = false;
} else {
    errorMessage.style.visibility = 'visible';
    setTimeout(()=> {
     errorMessage.style.visibility = 'hidden';
    }, 1500);

}
};

// This resets everything to zero when the user pushes reset.
reset.onclick = () => {
    for (let button of tipButtons) {
        button.addEventListener('click', tipOptions);
    }

    reset.hidden = true;
    submit.hidden = false;
    mp.value = '';
    pt.value = '';
    ta.value = '';
    total.value = '';
    mp.placeholder = '$0.00';
    pt.placeholder = '0%';
    ta.placeholder = '$0.00';
    total.placeholder = '$0.00';
    submit.classList.remove('pulse');

    for (let buttons of tipButtons) {
        if ([...buttons.classList].includes('tip-click')) {
            buttons.classList.remove('tip-click');
        }
    }
};

const pressEnter = (event) => {
  if (event.key === 'Enter') {
      console.log(event.target.nextElementSibling);
      event.target.blur();
  }
};

inputs.forEach((input) => {
    input.addEventListener('focus', focusHandle);
    input.addEventListener('blur', blurHandle);
    input.addEventListener('keyup', inputConstrain);
    input.addEventListener('mouseover', shimmer);
    input.addEventListener('keyup', pressEnter, false);
});

tipButtons.forEach((button) => {
    button.addEventListener('click', tipOptions);
    button.addEventListener('mouseenter', tipHover);
    button.addEventListener('mouseout', tipExit);
});





