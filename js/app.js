let chronometreInterval;

function getArticleCount() {
  const contentSection = document.querySelector("#content");
  const articleCount = contentSection.getElementsByTagName("article").length;

  document.querySelector("#article-count").textContent = articleCount;
}

function chronometre() {
  let startTime = localStorage.getItem("startTime");
  if (startTime) {
    startTime = parseInt(startTime);
  } else {
    startTime = Date.now();
    localStorage.setItem("startTime", startTime);
  }

  chronometreInterval = setInterval(function () {
    let currentTime = Date.now();
    let millisecond = currentTime - startTime;

    let seconds = Math.floor(millisecond / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    let timerText =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    document.querySelector("#timer").textContent = timerText;

    if (minutes >= 10) {
      document.querySelector("#timer").style.color = "red";
    }
  }, 1000);
}

function expandChapters() {
  const chapters = document.querySelectorAll("article");

  chapters.forEach((chapter) => {
    const title = chapter.querySelector("h2");
    const content = chapter.querySelector("p");

    content.style.display = "none";

    title.addEventListener("click", () => {
      if (chapter.classList.contains("expanded")) {
        chapter.classList.remove("expanded");
        content.style.display = "none";
        title.classList.remove("expanded");
      } else {
        chapters.forEach((chapter) => {
          chapter.classList.remove("expanded");
          chapter.querySelector("p").style.display = "none";
          chapter.querySelector("h2").classList.remove("expanded");
        });

        chapter.classList.add("expanded");
        content.style.display = "block";
        title.classList.add("expanded");
      }
    });
  });
}

function controlVideo() {
  const video = document.querySelector("#video video");
  const playButton = document.querySelector("#video-play");
  const resetButton = document.querySelector("#video-reset");
  const progress = document.querySelector("#video-progress");
  const fullscreenButton = document.querySelector("#video-fullscreen");

  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      video.pause();
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  });

  resetButton.addEventListener("click", () => {
    video.currentTime = 0;
    video.play();
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  });

  video.addEventListener("timeupdate", () => {
    const progressValue = (video.currentTime / video.duration) * 100;
    progress.value = progressValue;
  });

  fullscreenButton.addEventListener("click", () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });
}

function resetTraining() {
  clearInterval(chronometreInterval);
  localStorage.removeItem("startTime");
  document.querySelector("#timer").textContent = "00:00:00";

  // Replier les chapitres
  const chapters = document.querySelectorAll("article");
  chapters.forEach((chapter) => {
    chapter.classList.remove("expanded");
    chapter.querySelector("p").style.display = "none";
    chapter.querySelector("h2").classList.remove("expanded");
  });

  // Remise à zéro de la vidéo
  const video = document.querySelector("#video video");
  const playButton = document.querySelector("#video-play");
  const progress = document.querySelector("#video-progress");

  video.currentTime = 0;
  video.pause();
  playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  progress.value = 0;

  chronometre();
}

let konamiCode = [];
const secretCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

window.addEventListener("keydown", (event) => {
  konamiCode.push(event.key);
  konamiCode = konamiCode.slice(-secretCode.length);

  if (konamiCode.join("") === secretCode.join("")) {
    resetTraining();
  }
});

expandChapters();
getArticleCount();
chronometre();
controlVideo();
