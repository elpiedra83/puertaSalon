function getData() {
  var salon = getQueryVariable("salon");
  if (salon == "0") {
    salon = "";
  }

  var FormData = {
    Salon: salon.toString(),
  };

  fetch("http://172.16.9.85:8080/serviciosgx/rest/PSClasesSalon", {
    method: "POST",
    body: JSON.stringify(FormData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // .then((response) => response.json())
    .then((data) => {
      let urlReloj = window.location.href.search("reloj");
      if (urlReloj === -1) {
        refreshPuertaSalon(data);
      } else {
        refreshRelojSalon(data);
      }
    })
    .catch((err) => console.log(err);
  setTimeout(getData, 30000);
}
