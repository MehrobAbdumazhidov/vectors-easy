let currentQuestion = 1;
const totalQuestions = 10;
let userAnswers = {}; // Хранит ответы
let testCompleted = false;

const answers = {
  q1: "2",
  q2: "1",
  q3: "4",
  q4: "2",
  q5: "2",
  q6: "13",
  q7: "11",
  q8: "1",
  q9: "3",
  q10: "10"
};

function showQuestion(n) {
  document.querySelectorAll(".question-block").forEach(q => q.classList.add("hidden"));
  document.querySelector(`#question${n}`).classList.remove("hidden");

  if (n > 1) {
    document.querySelector(`#question${n} .prev-btn`).style.display = "inline-block";
  }
}

function nextQuestion() {
  saveAnswer(currentQuestion);

  if (currentQuestion < totalQuestions) {
    currentQuestion++;
    showQuestion(currentQuestion);
  } else {
    if (allAnswered()) {
      showSummary();
    } else {
      alert("Пожалуйста, ответьте на все вопросы перед завершением теста.");
    }
  }
}

function prevQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
}

function saveAnswer(n) {
  const question = document.querySelector(`#question${n}`);
  const radios = question.querySelectorAll("input[type='radio']");
  const text = question.querySelector("input[type='text']");

  if (radios.length > 0) {
    const selected = [...radios].find(r => r.checked);
    userAnswers[`q${n}`] = selected ? selected.value : null;
  } else if (text) {
    userAnswers[`q${n}`] = text.value.trim();
  }
}

function allAnswered() {
  for (let i = 1; i <= totalQuestions; i++) {
    if (!userAnswers[`q${i}`] || userAnswers[`q${i}`] === "") return false;
  }
  return true;
}

function showSummary() {
  testCompleted = true;
  let correct = 0;
  for (let i = 1; i <= totalQuestions; i++) {
    if (userAnswers[`q${i}`] === answers[`q${i}`]) {
      correct++;
    }
  }

  document.querySelectorAll(".question-block").forEach(q => q.classList.add("hidden"));
  const results = document.querySelector("#results");
  results.classList.remove("hidden");
  results.innerHTML = `
    <h2>Вы завершили тест!</h2>
    <p><strong>Ваш результат:</strong> ${correct} из ${totalQuestions}</p>
    <button onclick="showDetailedResults()">Показать правильные ответы</button>
    <button onclick="restartTest()">Пройти заново</button>
  `;
  saveBestScore(correct);
}

function showDetailedResults() {
  let output = "<h2>Разбор ответов:</h2><ul>";

  for (let i = 1; i <= totalQuestions; i++) {
    const userAnswer = userAnswers[`q${i}`];
    const correctAnswer = answers[`q${i}`];
    const isCorrect = userAnswer === correctAnswer;
    const question = document.querySelector(`#question${i}`);
    const radios = question.querySelectorAll("input[type='radio']");
    let correctText = correctAnswer;

    if (radios.length > 0) {
      const correctRadio = [...radios].find(r => r.value === correctAnswer);
      if (correctRadio) correctText = correctRadio.parentElement.textContent.trim();
    }

    if (isCorrect) {
      output += `<li>Вопрос ${i}: ✅ Верно</li>`;
    } else {
      output += `<li>Вопрос ${i}: ❌ Неверно<br><strong>Ваш ответ:</strong> ${userAnswer || "—"}<br><strong>Правильный ответ:</strong> ${correctText}</li>`;
    }
  }

  output += "</ul><button onclick='restartTest()'>Пройти заново</button>";
  document.querySelector("#results").innerHTML = output;
}

function restartTest() {
  currentQuestion = 1;
  userAnswers = {};
  testCompleted = false;

  document.querySelectorAll(".question-block").forEach(q => q.classList.add("hidden"));
  document.querySelector("#results").classList.add("hidden");

  document.querySelectorAll("input[type='radio']").forEach(r => (r.checked = false));
  document.querySelectorAll("input[type='text']").forEach(t => (t.value = ""));
  showQuestion(1);
}

function goHome() {
  window.location.href = "../index.html";
}

function saveBestScore(score) {
  const best = localStorage.getItem("bestScore") || 0;
  if (score > best) {
    localStorage.setItem("bestScore", score);
  }
}
