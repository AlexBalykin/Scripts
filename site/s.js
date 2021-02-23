const getNum = (...num) => {
  const result = num.map((n) => `31064700${n.trim()}`);
  console.log(result.join('\n'));
};
getNum('00989689 ', '0098968922');

const formInput = document.querySelector('.input');
const formOutput = document.querySelector('.output');
const textareaInput = formInput.querySelector('.t');
const textareaOutput = document.querySelector('.t2');
const userData = {
  data: [],
};

const formatUserData = (data, t2) => {
  data.forEach((i) => {
    const result = i
      .split('\n')
      .map((item) => `SELECT db_admin.close_debt_transaction('${item.trim()}');`)
      .join('\n');
    t2.innerHTML += result;
  });
};

formInput.addEventListener('submit', (e) => {
  e.preventDefault();
  const userText = textareaInput.value;
  userData.data.push(userText);
  formatUserData(userData.data, textareaOutput);
  e.target.reset();
});

formOutput.addEventListener('submit', (e) => {
  e.target.reset();
});
