// Current Date
const getDate = new Date();
const getYear = getDate.getFullYear();
const getMonth = getDate.getMonth() + 1;
const getDay = getDate.getDate();

function formatMonth() {
  if (getMonth < 10) {
    month = `0${getMonth}`;
  } else {
    month = getMonth;
  }
  return month;
}

function formatDay() {
  if (getDay < 10) {
    day = `0${getDay}`;
  } else {
    day = getDay;
  }
  return day;
}

const formattedDate = `${getYear}/${formatMonth()}/${formatDay()}`;
console.log(formattedDate);

function calculateRemainingTime(targetTime) {
  const now = new Date();
  const target = new Date(`${getYear}-${formatMonth(getMonth)}-${formatDay(getDay)}T${targetTime}:00`);
  const difference = target - now;

  if (difference > 0) {
    const hours = Math.floor(difference / 1000 / 60 / 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${hours} j ${minutes} m ${seconds} d`;
  } else {
    return "Time for prayer";
  }
}

// Function to update the countdown timers
function updateTimers(jadwal) {
  document.querySelector(".imsak-timer").textContent = calculateRemainingTime(jadwal.imsak);
  document.querySelector(".subuh-timer").textContent = calculateRemainingTime(jadwal.subuh);
  document.querySelector(".terbit-timer").textContent = calculateRemainingTime(jadwal.terbit);
  document.querySelector(".dhuha-timer").textContent = calculateRemainingTime(jadwal.dhuha);
  document.querySelector(".dzuhur-timer").textContent = calculateRemainingTime(jadwal.dzuhur);
  document.querySelector(".ashar-timer").textContent = calculateRemainingTime(jadwal.ashar);
  document.querySelector(".maghrib-timer").textContent = calculateRemainingTime(jadwal.maghrib);
  document.querySelector(".isya-timer").textContent = calculateRemainingTime(jadwal.isya);
}

function getJadwalShalat() {
  fetch(`https://api.myquran.com/v2/sholat/jadwal/0228/${formattedDate}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        const jadwal = data.data.jadwal;
        document.querySelector(".imsak").textContent = jadwal.imsak;
        document.querySelector(".subuh").textContent = jadwal.subuh;
        document.querySelector(".terbit").textContent = jadwal.terbit;
        document.querySelector(".dhuha").textContent = jadwal.dhuha;
        document.querySelector(".dzuhur").textContent = jadwal.dzuhur;
        document.querySelector(".ashar").textContent = jadwal.ashar;
        document.querySelector(".maghrib").textContent = jadwal.maghrib;
        document.querySelector(".isya").textContent = jadwal.isya;
        document.querySelector(".tanggal").textContent = jadwal.tanggal;

        console.log(jadwal);

        // Update timers immediately and then every second
        updateTimers(jadwal);
        setInterval(() => updateTimers(jadwal), 1000);
      } else {
        console.error("Error: Failed to retrieve prayer schedule.");
      }
    })
    .catch((error) => console.error("Error fetching the prayer schedule:", error));
}

getJadwalShalat();
