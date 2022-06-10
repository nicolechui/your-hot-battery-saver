var chargingStateEl = document.getElementById("chargingState");
var chargingTimeEl = document.getElementById("chargingTime");
var dichargeTimeEl = document.getElementById("dischargeTime");
var levelEl = document.getElementById("level");
//update the UI
function updateBatteryUI(battery) {
  levelEl.textContent = battery.level * 100 + "%";
  chargingTimeEl.textContent = battery.chargingTime / 3600 + "hour";
  if (battery.chargingTime / 3600 <= 1) {
    chargingTimeEl.textContent = battery.chargingTime / 3600 + "hour";
  } else {
    chargingTimeEl.textContent = battery.chargingTime / 3600 + "hours";
  }
  dichargeTimeEl.textContent = battery.dischargingTime / 3600 + "hour";

  if (battery.charging === true) {
    chargingStateEl.textContent = "Charging";
  } else if (battery.charging === false) {
    chargingStateEl.textContent = "Discharging";
  }
}

function monitorBattery(battery) {
  // Update the initial UI.
  updateBatteryUI(battery);

  // Monitor for futher updates.
  battery.addEventListener("levelchange", updateBatteryUI.bind(null, battery));
  battery.addEventListener(
    "chargingchange",
    updateBatteryUI.bind(null, battery)
  );
  battery.addEventListener(
    "dischargingtimechange",
    updateBatteryUI.bind(null, battery)
  );
  battery.addEventListener(
    "chargingtimechange",
    updateBatteryUI.bind(null, battery)
  );
}

if ("getBattery" in navigator) {
  navigator.getBattery().then(monitorBattery);
} else {
  ChromeSamples.setStatus(
    "The Battery Status API is not supported on " + "this platform."
  );
}

chrome.runtime.onInstalled.addListener(getBattery);

chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.tabs.executueScript(details.tabId, {
    code: " if (battery.level < 0.9) {" + ' alert("plug that shit in");' + "}",
    // 'if (battery.level > 0.8) {'+' alert("unplug or your battery may die");' +
    // '}'
  });
});
