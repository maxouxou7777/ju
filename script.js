function toMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatMinutes(min) {
    const h = Math.floor(min / 60);
    const m = Math.floor(min % 60);
    const s = Math.floor((min % 1) * 60);
    return `${h > 0 ? h + 'h ' : ''}${m}min ${s}s`;
  }

  document.getElementById("calculate").addEventListener("click", () => {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!start || !end) return alert("Remplis les deux horaires.");

    let workMinutes = toMinutes(end) - toMinutes(start);
    if (workMinutes <= 0) return alert("L'heure de fin doit être après le début.");

    workMinutes -= 60; // pause repas

    const pauseMinutes = workMinutes * 0.07;

    localStorage.setItem("pauseTotal", pauseMinutes);
    localStorage.setItem("pauseRemaining", pauseMinutes);
    localStorage.setItem("start", start);
    localStorage.setItem("end", end);

    document.getElementById("workTime").textContent = formatMinutes(workMinutes);
    document.getElementById("pauseTime").textContent = formatMinutes(pauseMinutes);
    document.getElementById("remainingTime").textContent = formatMinutes(pauseMinutes);
    document.getElementById("resultArea").hidden = false;
  });

  document.getElementById("subtract").addEventListener("click", () => {
    const used = parseFloat(document.getElementById("usedPause").value);
    if (isNaN(used) || used < 0) return;

    let remaining = parseFloat(localStorage.getItem("pauseRemaining") || "0");
    remaining = Math.max(0, remaining - used);
    localStorage.setItem("pauseRemaining", remaining);

    document.getElementById("remainingTime").textContent = formatMinutes(remaining);
    document.getElementById("usedPause").value = "";
  });

  document.getElementById("reset").addEventListener("click", () => {
    if (confirm("Es-tu sûr de vouloir réinitialiser la journée ?")) {
      localStorage.removeItem("pauseTotal");
      localStorage.removeItem("pauseRemaining");
      localStorage.removeItem("start");
      localStorage.removeItem("end");
      location.reload();
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    const total = parseFloat(localStorage.getItem("pauseTotal"));
    const remaining = parseFloat(localStorage.getItem("pauseRemaining"));
    const startSaved = localStorage.getItem("start");
    const endSaved = localStorage.getItem("end");

    if (!isNaN(total) && !isNaN(remaining)) {
      document.getElementById("resultArea").hidden = false;
      document.getElementById("pauseTime").textContent = formatMinutes(total);
      document.getElementById("remainingTime").textContent = formatMinutes(remaining);
    }

    if (startSaved) document.getElementById("start").value = startSaved;
    if (endSaved) document.getElementById("end").value = endSaved;
  });
