let displayValue = '0';
let operator = null;
let firstOperand = null;
let waitingForNewValue = false;
let expression = '';

const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');

function updateDisplay() {
    display.textContent = displayValue;
    expressionDisplay.textContent = expression;
}

function appendNumber(num) {
    if (waitingForNewValue) {
        displayValue = num;
        waitingForNewValue = false;
    } else {
        if (displayValue === '0' && num !== '.') {
            displayValue = num;
        } else {
            if (num === '.' && displayValue.includes('.')) return;
            displayValue += num;
        }
    }
    updateDisplay();
}

function appendOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
        expression = displayValue + ' ' + getOperatorSymbol(nextOperator) + ' ';
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const newValue = performCalculation();

        displayValue = String(newValue);
        firstOperand = newValue;
        expression = displayValue + ' ' + getOperatorSymbol(nextOperator) + ' ';
    } else {
        expression = displayValue + ' ' + getOperatorSymbol(nextOperator) + ' ';
        firstOperand = inputValue;
    }

    waitingForNewValue = true;
    operator = nextOperator;
    updateDisplay();
}

function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function performCalculation() {
    const prev = firstOperand;
    const current = parseFloat(displayValue);

    if (prev === null || operator === null) {
        return current;
    }

    switch (operator) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            return current !== 0 ? prev / current : 0;
        default:
            return current;
    }
}

function calculate() {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null || operator === null || waitingForNewValue) {
        return;
    }

    expression = expression + displayValue + ' = ';
    const newValue = performCalculation();
    displayValue = String(newValue);
    firstOperand = null;
    operator = null;
    waitingForNewValue = true;
    updateDisplay();
}

function clearAll() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForNewValue = false;
    expression = '';
    updateDisplay();
}

function clearEntry() {
    displayValue = '0';
    updateDisplay();
}

function deleteLast() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-') {
        appendOperator(key);
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});