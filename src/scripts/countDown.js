function countDown(fechaObjetivo) {
    const fechaActual = new Date();
    const diferencia = fechaObjetivo - fechaActual;

    segundos = Math.floor(diferencia / 1000) % 60;
    minutos = Math.floor(diferencia / (1000 * 60)) % 60;
    horas = Math.floor(diferencia / (1000 * 60 * 60)) % 24;
    dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    document.getElementById('contador').innerHTML = `
      <h1>Faltan:</h1>
      <br/>
      <p>${dias} días, ${horas} h, ${minutos} m y ${segundos} s</p>
      <br/>
      <p>para Viernes de Dolores</p>
    `;

    setTimeout(() => countDown(fechaObjetivo), 1000);
  }