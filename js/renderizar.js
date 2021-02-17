const SINPROXCLASE = `No hay próxima clase`;
const WARNING_THRESHOLD = 1500;
const ALERT_THRESHOLD = 500;
const COLOR_CODES = {
  info: {
    color: "default",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

function refreshPuertaSalon(data) {
  if (validClassroom()) {
    let arr = data.Horarios;
    let horaComienzoCA = document.querySelector("#horaComienzoCA");
    let horaFinCA = document.querySelector("#horaFinCA");
    let claseNombreCA = document.querySelector("#claseNombreCA");
    let docentesCA = document.querySelector("#docentesCA");
    let horaComienzoCS = document.querySelector("#horaComienzoCS");
    let horaFinCS = document.querySelector("#horaFinCS");
    let claseNombreCS = document.querySelector("#claseNombreCS");
    let docentesCS = document.querySelector("#docentesCS");
    let docentes = [];

    claseActual = arr[0];
    claseSiguiente = arr[1];
    if (claseActual != undefined) {
      horaComienzoCA.textContent = claseActual.HoraInicio;
      horaFinCA.textContent = claseActual.HoraFin;
      claseNombreCA.textContent = formatClassName(claseActual.Clase);
      docentes = claseActual.Docentes;
      docentesCA.textContent = "";
      for (let j = 0; j < docentes.length; j++) {
        docentesCA.textContent = docentesCA.textContent + docentes[j];
        if (j < docentes.length - 1)
          docentesCA.textContent = docentesCA.textContent + ", ";
      }
      countDown();
    } else {
      resetActualClass();
    }
    if (claseSiguiente != undefined) {
      horaComienzoCS.textContent = claseSiguiente.HoraInicio;
      horaFinCS.textContent = claseSiguiente.HoraFin;
      claseNombreCS.textContent = formatClassName(claseSiguiente.Clase);
      docentes = claseSiguiente.Docentes;
      docentesCS.textContent = "";
      for (let j = 0; j < docentes.length; j++) {
        docentesCS.textContent = docentesCS.textContent + docentes[j];
        if (j < docentes.length - 1)
          docentesCS.textContent = docentesCS.textContent + ", ";
      }
    } else {
      resetNextClass();
    }
  } else {
    resetActualClass();
    resetNextClass();
  }
}

function refreshRelojSalon(data) {
  if (validClassroom()) {
    let arr = data.Horarios;
    let claseActual = arr[0];
    let claseSiguiente = arr[1];
    let now = Date.now();
    if (claseActual != undefined) {
      let horaComienzoCA = claseActual.HoraInicio;
      let horaFinCA = claseActual.HoraFin;
      horaFinCA = newTimeFormat(horaFinCA);
      horaComienzoCA = newTimeFormat(horaComienzoCA);
      let tiempoProxClase = horaComienzoCA - now;
      const TIME_LIMIT = horaFinCA - now;
      let timePassed = 0;
      let timeLeft = TIME_LIMIT;
      let timerInterval = null;
      if (now >= horaComienzoCA) {
        startTimer(
          timerInterval,
          timePassed,
          timeLeft,
          TIME_LIMIT,
          COLOR_CODES
        );
      } else {
        textNextClass(
          `En ${formatTime(
            tiempoProxClase
          )} comenzará <br><q class="nombreClase">${formatClassName(
            claseSiguiente.Clase
          )}</q>`
        );
      }
    } else {
      textNextClass(SINPROXCLASE);
    }
  } else {
    textNextClass(SINPROXCLASE);
  }
}

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return 0;
}

function setSalon() {
  let salon = getQueryVariable("salon");
  if (salon !== null) {
    let numeroSalon = document.querySelector("#numeroSalon");
    numeroSalon.textContent = salon;
  }
}

function validClassroom() {
  let url = window.location.href.search(/salon=(\w)*(\d)+/);
  return url !== -1 ? true : false;
}

function formatClassName(nombreClase) {
  let nombre = nombreClase.toLocaleLowerCase();
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

function resetActualClass() {
  let horariosCA = document.querySelector("#horariosCA");
  horariosCA.classList.add("ocultar");
  horaComienzoCA.textContent = "";
  horaFinCA.textContent = "";
  claseNombreCA.textContent = SINPROXCLASE;
  docentesCA.textContent = "";
}

function resetNextClass() {
  let horariosCS = document.querySelector("#horariosCS");
  horariosCS.classList.add("ocultar");
  horaComienzoCS.textContent = "";
  horaFinCS.textContent = "";
  claseNombreCS.textContent = SINPROXCLASE;
  docentesCS.textContent = "";
}

function newTimeFormat(horaIn) {
  let today = new Date();
  horaOut = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    horaIn.slice(0, 2),
    horaIn.slice(3, 5),
    0
  ).getTime();
  return horaOut;
}

function textNextClass(texto) {
  let timerLabel = document.querySelector("#base-timer-label");
  timerLabel.classList.add("enEspera");
  timerLabel.innerHTML = texto;
}

function onTimesUp(timerInterval) {
  clearInterval(timerInterval);
}

function startTimer(
  timerInterval,
  timePassed,
  timeLeft,
  TIME_LIMIT,
  COLOR_CODES
) {
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed * 1000; // *1000 porque esta en milisegundos y lo paso a segundos
    document.getElementById("base-timer-label").textContent = formatTime(
      timeLeft
    );
    setRemainingTimeColor(timeLeft, COLOR_CODES);
    if (timeLeft === 0) {
      onTimesUp(timerInterval);
    }
  }, 1000);
}

function formatTime(distance) {
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  let restante = 0;
  if (hours > 0) {
    restante = `${hours}:${minutes}:${seconds}`;
  } else {
    restante = `${minutes}'${seconds}"`;
  }
  return restante;
}

function setRemainingTimeColor(timeLeft, COLOR_CODES) {
  const { alert, warning, info } = COLOR_CODES;
  timeLeft = timeLeft / 1000;
  if (timeLeft <= alert.threshold) {
    document.getElementById("base-timer-label").classList.remove(warning.color);
    document.getElementById("base-timer-label").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById("base-timer-label").classList.remove(info.color);
    document.getElementById("base-timer-label").classList.add(warning.color);
  } else {
    document.getElementById("base-timer-label").classList.add(info.color);
  }
}

function showCurrentTime() {
  let date = new Date();
  let h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  let s = date.getSeconds(); // 0 - 59
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  let time = h + ":" + m;
  let reloj = document.querySelector("#reloj");
  reloj.innerText = time;
  reloj.textContent = time;
  setTimeout(showCurrentTime, 1000);
}

function countDown() {
  // Set the date we're counting down to
  let fin = document.querySelector("#horaFinCA").textContent.trim();
  let countDownDate = newTimeFormat(fin);
  // Update the count down every 1 second
  let x = setInterval(function () {
    // Get today's date and time
    let now = Date.now();
    // Find the distance between now and the count down date
    let distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let time = 0;
    if (hours > 0) {
      time = `-${hours}:${minutes}`;
    } else {
      time = `-${minutes}'${seconds}"`;
    }
    let reloj = document.querySelector("#cuentaAtras");
    reloj.innerText = time;
    reloj.textContent = time;
    let contenedorReloj = document.querySelector("#tiempoProxClase");
    if (minutes < 5 && hours === 0) {
      contenedorReloj.classList.add("blink");
    }
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      contenedorReloj.classList.remove("blink");
      document.getElementById("cuentaAtras").textContent = "finalizó";
    }
  }, 1000);
}
