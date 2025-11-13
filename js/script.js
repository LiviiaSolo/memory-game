class Game {
  constructor() {
    this.domElements = {
      chooser: document.querySelector(".chooser"),
      playground: document.querySelector(".playground"),
      scores: document.querySelector(".scores"),
      timer: document.querySelector(".timer"),
    };

    this.name = "Polygon";
    this.playGroundSize = parseInt(this.domElements.chooser.value, 10);
    this.debounce = false;
    this.cardToCompare = null;
    this.opened = 0;
    this.score = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.timerId = null;
    this.scoresForWin = 2;
    this.matched = 0;
    this.timerTime = 1000;
  }

  // Start
  start() {
    this.resetView();
    this.resetTotalCount();
    this.resetValues();
    this.generatePlayground();

    // Listener
    this.domElements.chooser.addEventListener(
      "change",
      this.onSizeChange.bind(this),
      false
    );
    this.domElements.playground.addEventListener(
      "click",
      this.onCardClick.bind(this),
      false
    );
  }

  generatePlayground() {
    this.matched = 0;
    this.cardsFront = this.randomizer(Math.pow(this.playGroundSize, 2) / 2);

    if (this.timerId) {
      this.stopTimer();
    }

    this.cardsFront.forEach((item) => {
      this.renderCard(item);
    });

    this.renderScores();
    this.renderTimer();
    this.renderPlayground();
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.seconds++;
      if (this.seconds > 59) {
        this.minutes++;
        this.seconds = 0;
      }
      this.renderTimer();
    }, this.timerTime);
  }

  onSizeChange(e) {
    this.playGroundSize = parseInt(e.target.value, 10);
    this.start();
  }

  // Logic
  rotate(card) {
    card.classList.toggle("turned");
  }

  onCardClick(e) {
    if (!e) return;

    let target = e.target;
    while (target !== this.domElements.playground) {
      if (
        target.classList.contains("card") &&
        !target.classList.contains("turned") &&
        !this.debounce &&
        target !== this.cardToCompare
      ) {
        if (!this.timerId) {
          this.startTimer();
        }
        this.rotate(target);
        this.opened++;

        if (this.cardToCompare && this.opened === 2) {
          this.debounce = true;
          setTimeout(() => {
            if (this.cardToCompare.id === target.id) {
              this.cardIsEqual(this.cardToCompare, target);
            } else {
              this.cardIsDifferent(this.cardToCompare, target);
            }
          }, this.timerTime);
        } else {
          this.cardToCompare = target;
        }
        return;
      }
      target = target.parentNode;
    }
  }

  cardIsEqual(...args) {
    this.score += this.scoresForWin;
    this.matched += args.length;
    this.resetValues();
    this.renderScores();
    if (this.detectEndOfGame()) {
      this.stopTimer();
      this.renderFinishPopUp();
    }
  }

  cardIsDifferent(...args) {
    args.forEach((item) => this.rotate(item));
    this.resetValues();
  }

  // Render
  renderCard(name) {
    const card = `<figure class='card' id="img-${name}">
      <img src="./pics/${name}.jpg" class='side front'>
    </figure>`;
    this.domElements.playground.insertAdjacentHTML("beforeend", card);
  }

  renderTimer() {
    const sec = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    this.domElements.timer.innerHTML = `${this.minutes}:${sec}`;
  }

  renderScores() {
    this.domElements.scores.innerHTML = this.score;
  }

  renderPlayground() {
    const cards = document.getElementsByClassName("card");
    this.domElements.playground.classList.remove("big-playground");

    [...cards].forEach((item) => {
      if (this.playGroundSize === 4) {
        item.classList.add("card-for-4x4");
      } else if (this.playGroundSize === 6) {
        item.classList.add("card-for-6x6");
      } else {
        item.classList.add("card-for-6x6", "card-for-8x8");
        this.domElements.playground.classList.add("big-playground");
      }
    });
  }

  renderFinishPopUp() {
    const popupTemplate = ` <section class="end-game-popup">
      <div class="game-popup">
        <p class='final-text-title'>Well Done!</p>
        <p class='final-text'>Score: <span class='result'>${this.score}</span></p>
        <p class='final-text'>Time: <span class='result'>${this.minutes}:${this.seconds}</span></p>
        <button class='new-game-btn'>Start New game</button>
      </div>
    </section>`;
    this.domElements.playground.insertAdjacentHTML("beforeend", popupTemplate);
    this.finishGame();
  }

  // Reset
  resetView() {
    this.domElements.playground.innerHTML = "";
  }

  resetTotalCount() {
    this.minutes = 0;
    this.seconds = 0;
    this.score = 0;
  }

  resetValues() {
    this.cardToCompare = null;
    this.opened = 0;
    this.debounce = false;
  }

  resetTimer() {
    this.timerId = null;
  }

  // Finish
  stopTimer() {
    clearInterval(this.timerId);
    this.resetTimer();
  }

  detectEndOfGame() {
    return this.matched === Math.pow(this.playGroundSize, 2);
  }

  finishGame() {
    document
      .querySelector(".new-game-btn")
      .addEventListener("click", this.start.bind(this), false);
  }

  // Utils
  randomizer(n) {
    const arr = new Array(n).fill(true).map((_, i) => i + 1);
    return [...arr, ...arr].sort(() => Math.random() - 0.5);
  }
}

new Game().start();


