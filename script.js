const outputSub = document.querySelector('.calc__output--sub');
const outputMain = document.querySelector('.calc__output--main');
const inputsCon = document.querySelector('.calc__inputs');
const outputCon = document.querySelector('.calc__output');
const numbersCon = document.querySelector('.calc__theme-numbers');
document.documentElement.classList.add('theme-1');
class Calculator {
  #opeWasClicked = false;
  #typing = false;
  #prevNbr = 0;
  #prevOpe;
  #fontSize = 5;
  #start = true;
  constructor() {
    inputsCon.addEventListener('click', this._callFct.bind(this));
    numbersCon.addEventListener('click', this._renderTheme);
  }
  _renderTheme(e) {
    const theme = e.target.id;
    if (!theme) return;
    document.documentElement.classList = '';
    document.documentElement.classList.add(theme);
  }
  _callFct(e) {
    const clicked = e.target;
    if (
      outputMain.textContent === 'Math Error' ||
      outputMain.textContent === 'NaN'
    )
      this._handleReset(clicked);
    if (clicked.classList.contains('nbr')) this._handleNbr(clicked);
    if (clicked.classList.contains('ope')) this._handleOpe(clicked);
    if (clicked.classList.contains('reset')) this._handleReset(clicked);
    if (clicked.classList.contains('equal')) this._handleEqual(clicked);
    if (clicked.classList.contains('del')) this._handleDelete(clicked);
  }
  _handleNbr(clicked) {
    if (this.#start) {
      outputMain.textContent = clicked.dataset.val;
      this.#start = false;
      return;
    }
    // this.#start = true;
    this.#opeWasClicked = false;
    this._check2();
    // 1- check if it's empty
    if (
      outputMain.textContent.includes('.') &&
      clicked.dataset.val === '.' &&
      !this.#typing
    )
      return;

    if (!this.#typing) {
      outputMain.textContent += clicked.dataset.val;
      this.#start = false;
    }
    if (this.#typing) {
      outputMain.textContent = clicked.dataset.val;
      this.#typing = false;
    }
  }
  _handleOpe(clicked) {
    if (outputMain.textContent === '.') return;
    if (!this.#prevOpe && outputMain.textContent === '0') return;
    // 1- Check if there is already an operation
    if (this.#opeWasClicked) {
      this.#prevOpe = clicked.dataset.ope;
      outputSub.textContent = `${outputSub.textContent.slice(0, -1)}${
        this.#prevOpe
      }`;
      console.log('1');
      return;
    }
    // 2- other cases
    this.#opeWasClicked = true;
    this.#typing = true;
    if (!this.#prevOpe) {
      console.log('2');
      this.#prevOpe = clicked.dataset.ope;
      this.#prevNbr = +outputMain.textContent;
      outputSub.textContent += `${outputMain.textContent} ${clicked.dataset.ope}`;
      return;
    }
    console.log('3');
    outputSub.textContent += `${outputMain.textContent} ${clicked.dataset.ope}`;
    outputMain.textContent = this._result(
      this.#prevNbr,
      +outputMain.textContent,
      this.#prevOpe
    );
    this.#prevNbr = +outputMain.textContent;
    this.#prevOpe = clicked.dataset.ope;
  }

  _handleReset(clicked) {
    this.#start = true;
    outputMain.textContent = 0;
    outputSub.innerHTML = '&nbsp;';
    this.#opeWasClicked = false;
    this.#typing = false;
    this.#prevNbr = 0;
    this.#prevOpe = null;
    outputMain.style.removeProperty('font-size');
  }
  _handleDelete(clicked) {
    // this._check2();
    outputMain.textContent = outputMain.textContent.slice(0, -1);
    if (!outputMain.textContent) {
      this.#start = true;
      outputMain.textContent = '0';
    }
  }
  _handleEqual(clicked) {
    // this._check2();
    // if (outputMain.textContent === '0') return;
    if (outputSub.innerHTML === '&nbsp;') return;
    if (this.#opeWasClicked) return;
    outputMain.textContent = this._result(
      this.#prevNbr,
      +outputMain.textContent,
      this.#prevOpe
    );
    outputSub.innerHTML = '&nbsp;';
    this.#opeWasClicked = false;
    this.#typing = true;
    // console.log(this.#currentRes);
    this.#prevNbr = +outputMain.textContent;
    this.#prevOpe = null;
    this._checkOutputWidth();
    // this._check2();
  }
  _result(x, y, ope) {
    console.log(x, y, ope);
    if (ope === '+') return +(x + y).toFixed(4);

    if (ope === '-') return +(x - y).toFixed(4);

    if (ope === '/') {
      if (y === 0) return 'Math Error';
      else return +(x / y).toFixed(4);
    }
    if (ope === '*') return +(x * y).toFixed(4);
  }
  _checkOutputWidth() {
    while (
      outputMain.getBoundingClientRect().width >
      outputCon.getBoundingClientRect().width - 60
    ) {
      this.#fontSize -= 0.5;
      outputMain.style.fontSize = `${this.#fontSize}rem`;
    }
    while (
      outputMain.getBoundingClientRect().width <
        outputCon.getBoundingClientRect().width - 70 &&
      this.#fontSize < 5
    ) {
      this.#fontSize += 0.5;
      outputMain.style.fontSize = `${this.#fontSize}rem`;
    }
  }
  _check2() {
    const outputMainWith = outputMain.getBoundingClientRect().width;
    const outputConWidth = outputCon.getBoundingClientRect().width;
    if (outputMainWith > outputConWidth - 60) {
      this.#fontSize -= 0.5;
      outputMain.style.fontSize = `${this.#fontSize}rem`;
    }
  }
}
const calc = new Calculator();
