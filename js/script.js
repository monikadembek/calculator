const display = document.querySelector('.calculator__display');
const buttons = document.querySelector('.calculator__buttons');
const button = buttons.querySelectorAll('button'); 

let state = {}; //state of the app

function init() {
  state = {
    firstNum: 0,
    secNum: null,
    operation: '',
    isNewNum: true,
    operatorClickCounter: 0
  };
}

//function which calculates 2 given numbers depending on the operator
let calculate = (num1, num2, operation) => {
  let result = 0;
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract': 
      result = num1 - num2;
      break
    case 'multiply':
      //decimal.js library - solves issues with multiplying float numbers
      num1 = new Decimal(num1);
      num2 = new Decimal(num2);
      result = num1.times(num2);
      break;
    case 'divide':
      result = num1 / num2;
      break;  
  }
  return result;
};

//function which checks if you divide by 0
const isDividedByZero = (num, operation) => (num === 0 && operation === 'divide');

//function which checks if there are both numbers to make calculation
const areBothNumbersSet = (num1, num2) => (num1 !== 0 && num2 !== null); 



//handling user's clicks - event listener on buttons wrapping div
buttons.addEventListener('click', function(e) {
  const btn = e.target; //clicked button

  if (!btn.dataset.operator) { state.operatorClickCounter = 0 };

  //in case background of calculator was clicked do nothing
  if (btn.className === 'calculator__buttons') {
    return null;
  }

  //----------- HANDLE CLICKING ON OPERATOR BUTTONS --------------------
  //if operator button was clicked:
      //save number and type of operation to state 
      //if both numbers are set make calculation
  if (btn.dataset.operator) {

    Array.from(button, btn => btn.classList.remove('pressed'));
    btn.classList.add('pressed');
    state.operatorClickCounter++;    
    state.isNewNum = true; //after clicking operator btn we add new number to state

    if(state.operatorClickCounter < 2) { //prevents calculating after second straigth click on operator btn
      //if it is first number of calculation
      if (state.firstNum === 0) {
        state.firstNum = parseFloat(display.value);  
      } else { //if it is not the first number of calculation
        let result;
        state.secNum = parseFloat(display.value);
        if (!isDividedByZero(state.secNum, state.operation)) {
          result = calculate(state.firstNum, state.secNum, state.operation);  
          console.log(result);
          display.value = result;
          //after making calculation: firstNum is the current score and secNum is null
          state.firstNum = result;
          state.secNum = null;
        } else {
          display.value = "You cannot divide by 0";
        }   
      }  
    }
    
    state.operation = btn.dataset.operator; //assign type of operation to state
  }

  //----------------------------------------


  //if button with digit was clicked display the number
  if (!isNaN(parseInt(btn.textContent))) {
    if (state.isNewNum === true) { //display new number
      if (display.value === '0.') {
        display.value = display.value + btn.textContent;
      } else {
        display.value = btn.textContent;  
        state.isNewNum = false;
      }
    } else { //append a digit because it's not a new number
      display.value = display.value + btn.textContent;
    }
  }


  //when "=" btn was clicked - calculate operation on prev and current numbers
  if (btn.dataset.score) {
    Array.from(button, btn => btn.classList.remove('pressed'));
    state.secNum = parseFloat(display.value);
    if (areBothNumbersSet(state.firstNum, state.secNum)) {
      if (!isDividedByZero(state.secNum, state.operation)) {
        display.value = calculate(state.firstNum, state.secNum, state.operation);
        init();  
      } else {
        display.value = "You cannot divide by 0";
      }
    }
  } 


  //when clear "C" btn was clicked - display 0
  if (btn.dataset.clear) {
    display.value = 0;
    init();
  }


  //when "." btn was clicked append dot
  if (btn.dataset.dot) {
    if (!display.value.includes('.')) {
      display.value = display.value + '.';  
    } 
    if (display.value === '0') {
      display.value = '0.';
    }
  }
  
  console.log(state);

});


//initialize state
init();
