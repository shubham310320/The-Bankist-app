'use strict';

// BANKIST APP

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('balance_date');
const labelBalance = document.querySelector('.balance_value');
const labelSumIn = document.querySelector('.summary_value--in');
const labelSumOut = document.querySelector('.summary_value--out');
const labelSumInterest = document.querySelector('.summary_value--interest');

const btnLogin = document.querySelector('.form_btn--login');
const btnLoan = document.querySelector('.form_btn--loan');
const btnTransfer = document.querySelector('.form_btn--transfer');
const btnClose = document.querySelector('.form_btn--close');

const inputLoginUser = document.querySelector('.login_input--user');
const inputLoginPin = document.querySelector('.login_input--pin');
const inputTransferTo = document.querySelector('.form_input--to');
const inputTransferAmount = document.querySelector('.form_input--amount');
const inputLoan = document.querySelector('.form_input--loan');
const inputCloseUser = document.querySelector('.form_input--user');
const inputClosePin = document.querySelector('.form_input--pin');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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
const movements = [540, -324, 5435, -65, 44, 6435, 23, -325];
/////////////////////////////////////////////////
// Functions
const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movement_row">
      <div>
        <div class="movement_label movement_label--${type}"> ${
      i + 1
    } ${type}</div>
    </div>
    <div class="movements_value">${mov}$</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  console.log('movements done');
};

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const displaySummary = function (acc) {
  const sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const sumOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((ac, mov) => ac + mov, 0);

  labelSumIn.textContent = `${sumIn}€`;
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

const login = function (accs) {
  const userName = inputLoginUser.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accs.find(acc => acc.username === userName);

  if (pin === currentAccount?.pin) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    updateUI(currentAccount);
  }
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  login(accounts);
  inputLoginUser.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferUser = inputTransferTo.value;
  const reciever = accounts.find(acc => acc.username === transferUser);
  const transferAmount = Number(inputTransferAmount.value);
  if (
    transferAmount > 0 &&
    reciever?.username &&
    transferUser != currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    reciever.movements.push(transferAmount);
    updateUI(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputLoan.value) > 0 &&
    currentAccount.movements.some(mov => mov >= Number(inputLoan.value) * 0.1)
  ) {
    currentAccount.movements.push(Number(inputLoan.value));
    updateUI(currentAccount);
  }
  inputLoan.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUser.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
