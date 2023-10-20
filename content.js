let serverOffset = null;

function calculateServerOffset() {
  const serverTimeElement = document.getElementById("serverTime");
  if (!serverTimeElement) return;

  const serverTimeString = serverTimeElement.innerText;
  const serverDate = luxon.DateTime.fromFormat(serverTimeString, "H:mm:ss", {
    zone: "UTC",
  });

  const nowUTC = luxon.DateTime.utc();
  serverOffset = nowUTC.diff(serverDate, "hours").hours;
}

function convertServerTimeToLocal(timeStr) {
  if (serverOffset === null) calculateServerOffset();

  const serverTime = luxon.DateTime.fromFormat(timeStr, "H:mm:ss", {
    zone: "UTC",
  });
  const localTime = serverTime.plus({ hours: serverOffset }).toLocal();

  return localTime.toFormat("H:mm:ss");
}

document.body.addEventListener("mouseover", function (event) {
  let target = event.target;

  // Caso: Hora del servidor
  if (target.id === "serverTime") {
    try {
      let timeStr = target.innerText;
      let localTime = convertServerTimeToLocal(timeStr);
      showTooltip(target, localTime);
    } catch (error) {
      console.error("Error creating date:", error);
    }
  }

  // // Caso: Otros elementos de hora
  // if (
  //     target.tagName.toLowerCase() === "td" &&
  //     target.innerText.includes("hoy a las")
  // ) {
  //     let timeStr = target.innerText.split("hoy a las ")[1].split(":<span")[0];
  //     let localTime = convertServerTimeToLocal(timeStr);
  //     showTooltip(target, localTime);
  // }
});

function showTooltip(element, text) {
  let tooltip = document.createElement("div");
  tooltip.innerText = text;
  tooltip.classList.add("tooltip-style");

  document.body.appendChild(tooltip);
  let rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + window.scrollX + "px";
  tooltip.style.top = rect.bottom + window.scrollY - 40 + "px";

  element.addEventListener("mouseleave", function () {
    tooltip.remove();
  });
}
