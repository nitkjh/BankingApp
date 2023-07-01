'use strict';
// BANKIST APP
// Data
const account1 = {
    owner: 'Malay Mishra',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//! Inserting data in html
function displayMovmnts(movmnt) {
    containerMovements.innerHTML = '';
    movmnt.forEach((vals, i) => {
        const type = vals > 0 ? 'deposit' : 'withdrawal';
        const html =
            `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${vals}€</div>
      </div>
    `
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
// displayMovmnts(account1.movements);

//! Total Balance
function totalBlnce(movmnts) {
    movmnts.balance = movmnts.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.innerHTML = movmnts.balance + '€';
}
// totalBlnce(account1);

//! Last Login Time
const date = new Date();
const min = `${date.getMinutes()}`.padStart(2, 0);
const hou = `${date.getHours()}`.padStart(2, 0);
const d = `${date.getDate()}`.padStart(2, 0);
const m = `${date.getMonth()}`.padStart(2, 0);
const y = `${date.getFullYear()}`;
labelDate.textContent = `${d}/${m}/${y} ⌚${hou}:${min}`;

//! Creating userName for all the accounts holder
function userNames(users) {
    users.forEach((user) => {
        user.userName = user.owner.toLowerCase().split(' ').map(usr => usr[0]).join('');
    });
}
userNames(accounts);
// console.log(accounts);

//! Total In nd Out Balance
function totalSumINndOut(accs) {
    const totalIn = accs.movements.filter(acc => acc > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${totalIn}€`;

    const totalOut = accs.movements.filter(acc => acc < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(totalOut)}€`;

    const totalIntrest = accs.movements.filter(acc => acc > 0).map(depo => (depo * accs.interestRate) / 100).filter(acc => acc >= 1).reduce((acc, mov) => acc + mov, 0);
    labelSumInterest.textContent = `${totalIntrest}€`
};
// totalSumINndOut(account2);

//! All'Updated UI' Function calling other functions
function updatedUi(accs) {
    containerApp.style.opacity = 100;

    totalBlnce(accs); //* TotalBlance fun
    displayMovmnts(accs.movements); //* LogIn User details fun
    totalSumINndOut(accs); //* LogIn user Total-In-Out-IntrestRate
};


//! LOGIN Functionality
let currentUser;
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    currentUser = accounts.find(user => user.userName === inputLoginUsername.value);

    if (currentUser?.pin === +(inputLoginPin.value)) {
        labelWelcome.innerHTML = `Welcome back, ${currentUser.owner.split(' ')[0]}!`;

        //! Calling other functions!
        updatedUi(currentUser);

        //! Makng the input fields Empty!
        inputLoginPin.value = inputLoginUsername.value = '';
        inputLoginPin.blur();
    }

});


//! Transfer Money
btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();

    const transfer = accounts.find(user => user.userName === inputTransferTo.value);
    console.log(transfer);
    const moneyVal = +(inputTransferAmount.value);

    if (transfer?.userName === inputTransferTo.value) {
        if (moneyVal > 0 && currentUser.balance >= moneyVal && transfer?.userName !== currentUser.userName) {
            currentUser.movements.push(-moneyVal);
            transfer.movements.push(moneyVal);

            //! Calling other functions!
            updatedUi(currentUser);
        }
    }
    //! Makng the input fields Empty!
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

});


//! Request Loan
btnLoan.addEventListener('click', (e) => {
    e.preventDefault();

    const loanRqe = +(inputLoanAmount.value);
    if (loanRqe > 0 && currentUser.movements.some(acc => acc >= loanRqe * 0.1)) {
        currentUser.movements.push(loanRqe);
        //! Calling other functions!
        updatedUi(currentUser);
    };
    //! Makng the input fields Empty!
    inputLoanAmount.value = '';
});


//! Close Account
btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    const dUser = accounts.find(acc => acc.userName === inputCloseUsername.value);
    // console.log(dUser);
    const dPin = +(inputClosePin.value);

    if (dUser?.pin === dPin) {
        const findUser = accounts.findIndex(indx => indx.userName === dUser.userName);
        // console.log(findUser);

        //* Deleting the User Account
        accounts.splice(findUser, 1);
        // console.log(accounts);
        //* Hide the UI
        containerApp.style.opacity = 0;
        labelWelcome.innerHTML = `Log in to get started`;
    }
    //* Makng the input fields Empty!
    inputCloseUsername.value = inputClosePin.value = '';
});


//! making sort button clickbale
let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();

    displayMovmnts(currentUser.movements, !sorted);
    sorted = !sorted;
});