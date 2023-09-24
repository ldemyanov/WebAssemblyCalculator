document.addEventListener('DOMContentLoaded', () => {
  const calcEl = document.querySelector('#calc'); 
  if (!calcEl) console.error("ERROR, not find #calc element");

  fetchWasmInstance("index.wasm")
    .then((instance) => { 
      const wasmCalc = new WasmCalc(instance);
      const calc = new Calc(calcEl, wasmCalc);
    })
    .catch((e) => console.error(e));
});

async function fetchWasmInstance(path) {
  const response = await fetch(path);
  const bytes = await response.arrayBuffer();
  const module = new WebAssembly.Module(bytes);
  return new WebAssembly.Instance(module);
}

class WasmCalc {
  constructor(wasmInstance) {
    this.wasmInstance = wasmInstance;
  }
  add (num1, num2) {
    return this.wasmInstance.exports.add(num1, num2);
  }
  devide (num1, num2) {
    return this.wasmInstance.exports.devide(num1, num2);
  }
  multiply (num1, num2) {
    return this.wasmInstance.exports.multiply(num1, num2);
  }
  substract (num1, num2) {
    return this.wasmInstance.exports.substract(num1, num2);
  }
}

class Calc {
  #num1 = 0;
  #num2 = 0;
  #action = "";

  constructor(el, wasmCalc) {
    this.calcEl = el;
    this.wasmCalc = wasmCalc;
    this.historyInput = el.querySelector('input[data-history]');
    this.resultInput = el.querySelector('input[data-result]');
    this.numberBtns = [...el.querySelectorAll('button[data-number]')];
    this.actionBtns = [...el.querySelectorAll('button[data-action]')];
    this.#initListeners();
  }

  get textValue() {
    return this.resultInput.value;
  }

  set textValue(value) {
    this.resultInput.value = value;
  }

  get historyValue() {
    return this.historyInput.value;
  }

  set historyValue(value) {
    this.historyInput.value = value;
  }

  #initListeners() {
    this.#initNumberListeners();
    this.#initActionListeners();
  }

  #initNumberListeners() {
    this.numberBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.#inputNumberOrDot(btn.dataset.number));
    });
  }

  #initActionListeners() {
    this.actionBtns.forEach((btn) => {
      const action = btn.dataset.action;

      switch (action) {
        case 'ac':
          btn.addEventListener("click", () => {
            this.textValue = "";
            this.historyValue = "";
            this.#num1 = 0;
            this.#num2 = 0;
            this.#action = "";
          })
          break;

        case 'sign':
          btn.addEventListener("click", () => {
            if (!this.#action) this.#num1 *= -1;
            if (this.#action) this.#num2 *= -1;
            this.textValue = String(Number(this.textValue) * (-1));
          })
          break;

        case 'percent':
          btn.addEventListener("click", () => {
            this.textValue = String(Number(this.textValue) * (0.01));
          })
          break;

        case 'devide':
          btn.addEventListener("click", () => this.#inputAction(action, "-"));
          break;

        case 'multiply':
          btn.addEventListener("click", () => this.#inputAction(action, "×"));
          break;

        case 'substruct':
          btn.addEventListener("click", () => this.#inputAction(action, "-"));
          break;

        case 'add':
          btn.addEventListener("click", () => this.#inputAction(action, "+"));
          break;

        case 'equal':
          btn.addEventListener("click", () => this.#calculate());
          break;
      }
    });
  }

  #inputNumberOrDot(symbol) {
    if (symbol === "." && !this.#action && String(this.#num1).includes(".") ||
      symbol === "." && this.#action && String(this.#num2).includes(".")) return;

    if (!this.#action) {
      this.textValue = this.textValue == "0" ? symbol : this.textValue += symbol;
      this.#num1 = Number(this.textValue);
    }

    if (this.#action) {
      if (this.#num2 === 0 && (symbol === "0")) return;
      if (this.#num2 === 0) {
        this.historyValue = this.textValue;
        this.textValue = symbol;
        this.#num2 = Number(symbol);
        return;
      }

      this.textValue += symbol;
      this.#num2 = Number(this.textValue);
    }
  }

  #inputAction(action, symbol) {
    if (this.#num1 && this.#action && this.#num2) this.#calculate();

    this.textValue = this.#action
      ? (this.textValue.slice(0, -3) + ` ${symbol} `)
      : this.textValue += ` ${symbol} `;

    this.#action = action;
  }

  #calculate() {
    let result = 0;
    switch (this.#action) {
      case 'devide': result = this.wasmCalc.devide(this.#num1, this.#num2);
        break;
      case 'multiply': result = this.wasmCalc.multiply(this.#num1, this.#num2);
        break;
      case 'substruct': result = this.wasmCalc.substract(this.#num1, this.#num2);
        break;
      case 'add': result = this.wasmCalc.add(this.#num1, this.#num2);
        break;
      default:
        return;
    }

    this.historyValue = "";
    this.textValue = String(result);
    this.#num1 = result;
    this.#num2 = 0;
    this.#action = "";
  }
}