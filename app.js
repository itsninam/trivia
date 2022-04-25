const app = {};

app.apiKey = "https://opentdb.com/api.php";

//set variables
app.$question = $(".question");
app.$optionA = $(".optionA");
app.$optionB = $(".optionB");
app.$optionC = $(".optionC");
app.$displayAnswer = $(".display-answer");
app.$optionsContainer = $(".options-container");

//create a random number
app.getRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

//obtain API data
app.getTrivia = () => {
  $.ajax({
    url: app.apiKey,
    method: "GET",
    dataType: "json",
    data: {
      amount: 10,
      difficulty: "easy",
      category: 18,
      type: "multiple",
    },
  }).then((data) => {
    app.displayQuestion(data);
  });
};

//display question
app.displayQuestion = (questions) => {
  const randomQuestion = app.getRandomElement(questions.results);

  app.$optionA.append(`${randomQuestion.incorrect_answers[0]}`);
  app.$optionB.append(`${randomQuestion.incorrect_answers[1]}`);
  app.$optionC.append(`${randomQuestion.correct_answer}`);
  app.$question.append(`💡 ${randomQuestion.question}`);

  //getting user input
  app.$optionsContainer.on("change", (event) => {
    const correctAnswer = $("input[id=optionC]").val();
    const chosenAnswer = $("input[id=optionC]:checked").val();

    if (chosenAnswer !== correctAnswer) {
      app.$displayAnswer
        .text("💥 Incorrect, try again!")
        .css("color", "#fc7a57");
    } else {
      app.$displayAnswer.text("🎉 Correct!").css("color", "#69a197");
    }
  });
};

// shuffle answer
app.randomizeAnswer = () => {
  let buttons = $("label");
  let inputs = $("input");
  while (buttons.length) {
    app.$optionsContainer.append(
      buttons.splice(Math.floor(Math.random() * buttons.length), 1)[0]
    );
  }

  while (inputs.length) {
    app.$optionsContainer.append(
      inputs.splice(Math.floor(Math.random() * inputs.length), 1)[0]
    );
  }
};

//refresh question
app.refreshQuestion = () => {
  app.$optionA.empty();
  app.$optionB.empty();
  app.$optionC.empty();
  app.$displayAnswer.empty();
  app.$question.empty();
  app.getTrivia();
  $('input[type="radio"]').prop("checked", false);
  app.randomizeAnswer();
};

app.init = () => {
  app.getTrivia();
  $(".refresh-question").on("click", () => {
    app.refreshQuestion();
  });
};

$(document).ready(() => {
  app.init();
});
