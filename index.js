const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let budget = 0;
const expenses = {};

function showMenu() {
  console.log('\nBudgeting Tool');
  console.log('1. Set Budget');
  console.log('2. Add Expense');
  console.log('3. View Budget');
  console.log('4. Exit');
}


function promptUser() {
  rl.question('Select an option: ', answer => {
    switch (answer) {
      case '1':
        setBudget();
        break;
      case '2':
        addExpense();
        break;
      case '3':
        viewBudget();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid option');
        showMenu();
        promptUser();
    }
  });
}

function setBudget() {
  rl.question('Enter your budget amount: ', answer => {
    budget = parseFloat(answer);
    saveBudgetToFile();

    console.log(`Budget set to $${budget.toFixed(2)}`);

    showMenu();
    promptUser();
  });
}

function saveBudgetToFile() {
  let content = `Budget: ${budget.toFixed(2)}\n`;

  for (let expenseName in expenses) {
    content += `${expenseName}: ${expenses[expenseName].toFixed(2)}\n`;
  }

  content += `Total Budget: ${(budget - calculateTotalExpenses()).toFixed(2)}`;
  
  fs.writeFile('budget.txt', content, err => {
    if (err) throw err;
    console.log('Budget saved to file');
  });
}

function calculateTotalExpenses() {
  let totalExpenses = 0;

  for (let expenseName in expenses) {
    totalExpenses += expenses[expenseName];
  }

  return totalExpenses;
}

function addExpense() {
  rl.question('Enter expense name: ', name => {
    rl.question('Enter expense amount: ', amount => {
      const expenseAmount = parseFloat(amount);

      if (isNaN(expenseAmount)) {
        console.log('Invalid amount');
      } 
      else {
        expenses[name] = expenseAmount;
        saveBudgetToFile();
        console.log(`Expense "${name}" of $${expenseAmount.toFixed(2)} added`);
      }
      showMenu();
      promptUser();
    });
  });
}

function readBudgetFromFile() {

  if (fs.existsSync('budget.txt')) {
    const fileContent = fs.readFileSync('budget.txt', 'utf8');
    const lines = fileContent.split('\n');

    for (const line of lines) {
      const [key, value] = line.split(': ');

      if (key === 'Budget') {
        budget = parseFloat(value);
      } 
      else {
        expenses[key] = parseFloat(value);
      }
    }

    console.log(`Budget loaded from file: $${budget.toFixed(2)}`);
  } 
  else {
    console.log('No budget file found. Starting with a budget of $0.00');
  }
}

function viewBudget() {
  console.log(`Current budget: $${budget.toFixed(2)}`);
  console.log('Expenses:');

  for (let expenseName in expenses) {
    console.log(`${expenseName}: $${expenses[expenseName].toFixed(2)}`);
  }

  console.log(`Total Budget: $${(budget - calculateTotalExpenses()).toFixed(2)}`);
  showMenu();
  promptUser();
}

readBudgetFromFile();
showMenu();
promptUser();

