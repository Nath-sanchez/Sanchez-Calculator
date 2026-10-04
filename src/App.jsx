
import { useState, useEffect } from "react";

function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState("");
  const [operator, setOperator] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState([]);

  const buttons = [
    "AC", "DEL", "%", "÷",
    "7", "8", "9", "×",
    "4", "5", "6", "−",
    "1", "2", "3", "+",
    "0", ".", "="
  ];

  function inputNumber(value) {
    if (display === "Error" || waiting) {
      setDisplay(value);
      setWaiting(false);
      return;
    }

    setDisplay(display === "0" ? value : display + value);
  }

  function inputDecimal() {
    if (display === "Error" || waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function clearAll() {
    setDisplay("0");
    setPrevious("");
    setOperator("");
    setWaiting(false);
  }

  function deleteLast() {
    if (display === "Error" || waiting) {
      setDisplay("0");
      setWaiting(false);
      return;
    }

    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  }

  function chooseOperator(op) {
    if (display === "Error") return;

    if (operator && !waiting) {
      calculate();
    } else {
      setPrevious(display);
    }

    setOperator(op);
    setWaiting(true);
  }

  function calculate() {
    if (!operator || previous === "" || display === "Error") return;

    const first = Number(previous);
    const second = Number(display);
    let result;

    switch (operator) {
      case "+":
        result = first + second;
        break;
      case "−":
        result = first - second;
        break;
      case "×":
        result = first * second;
        break;
      case "÷":
        if (second === 0) {
          setDisplay("Error");
          setPrevious("");
          setOperator("");
          setWaiting(true);
          return;
        }
        result = first / second;
        break;
      case "%":
        result = first % second;
        break;
      default:
        return;
    }

    if (!Number.isFinite(result)) {
      setDisplay("Error");
    } else {
      const answer = String(
        Number.parseFloat(result.toPrecision(12))
      );

      setHistory((old) => [
        `${first} ${operator} ${second} = ${answer}`,
        ...old
      ].slice(0, 5));

      setDisplay(answer);
    }

    setPrevious("");
    setOperator("");
    setWaiting(true);
  }

  function handleButton(value) {
    if (value >= "0" && value <= "9") {
      inputNumber(value);
    } else if (value === ".") {
      inputDecimal();
    } else if (value === "AC") {
      clearAll();
    } else if (value === "DEL") {
      deleteLast();
    } else if (value === "=") {
      calculate();
    } else {
      chooseOperator(value);
    }
  }

  // Keyboard support
  useEffect(() => {
    function handleKey(e) {
      if (e.key >= "0" && e.key <= "9") {
        inputNumber(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+") {
        chooseOperator("+");
      } else if (e.key === "-") {
        chooseOperator("−");
      } else if (e.key === "*") {
        chooseOperator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        chooseOperator("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        calculate();
      } else if (e.key === "Backspace") {
        deleteLast();
      } else if (e.key === "Escape") {
        clearAll();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">

        {/* Calculator */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-6">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-pink-600">
              My Calculator
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Simple and Easy Calculator
            </p>
          </div>

          {/* Display */}
          <div className="bg-pink-50 rounded-2xl p-5 mb-5 text-right border border-pink-100">
            <p className="text-gray-400 text-xs mb-2">
              {previous} {operator}
            </p>
            <div
              className="text-4xl font-bold text-gray-800 overflow-x-auto"
              aria-live="polite"
            >
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button) => (
              <button
                key={button}
                onClick={() => handleButton(button)}
                aria-label={
                  button === "AC" ? "Clear all" :
                  button === "DEL" ? "Delete last digit" :
                  button
                }
                className={`
                  h-14 rounded-xl text-xl font-semibold
                  transition-all duration-150
                  active:scale-95 hover:brightness-95
                  focus-visible:outline-2 focus-visible:outline-pink-600
                  ${
                    ["AC", "DEL"].includes(button)
                      ? "bg-red-100 text-red-600"
                      : ["+", "−", "×", "÷", "%", "="].includes(button)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-pink-100"
                  }
                  ${button === "0" ? "col-span-2" : ""}
                `}
              >
                {button}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            React Calculator | DCIT 26 Laboratory 1
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            User Guide
          </h2>

          <div className="space-y-4 text-gray-700">

            <div>
              <h3 className="font-bold">How to Use</h3>
              <p className="text-sm">
                Click the number buttons to enter values.
                Choose an operator and enter another number.
                Press the equals button to see your result.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Supported Operations</h3>
              <ul className="text-sm list-disc pl-5">
                <li>Addition (+)</li>
                <li>Subtraction (−)</li>
                <li>Multiplication (×)</li>
                <li>Division (÷)</li>
                <li>Modulus (%)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">Button Functions</h3>
              <ul className="text-sm list-disc pl-5">
                <li>AC – Clear everything.</li>
                <li>DEL – Delete the last digit.</li>
                <li>= – Calculate the answer.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">Keyboard Shortcuts</h3>
              <ul className="text-sm list-disc pl-5">
                <li>Numbers 0–9 – Enter numbers.</li>
                <li>+ − * / – Choose operations.</li>
                <li>Enter – Calculate.</li>
                <li>Backspace – Delete.</li>
                <li>Escape – Clear.</li>
              </ul>
            </div>

            <div className="bg-pink-50 p-4 rounded-xl">
              <h3 className="font-bold text-pink-600 mb-2">
                Recent Calculations
              </h3>

              {history.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No calculations yet.
                </p>
              ) : (
                history.map((item, index) => (
                  <p key={index} className="text-sm py-1">
                    {item}
                  </p>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;