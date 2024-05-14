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
      return { hours, minutes, seconds };
    } else {
      return null;
  }
}

function getNextPrayerTime(prayerTimes) {
  for (let i = 0; i < prayerTimes.length; i++) {
      const remainingTime = calculateRemainingTime(prayerTimes[i].time);
      if (remainingTime) {
          return { index: i, remainingTime: remainingTime };
      }
  }
  return null; 
}

// Function to start the countdown timer
function startCountdown(prayerTimes) {
  let { index, remainingTime } = getNextPrayerTime(prayerTimes);
  let iqamahCountdownActive = false;

  function updateTimer() {
    if (index < prayerTimes.length) {
      if (iqamahCountdownActive) {
        // Handle the 5-minute iqamah countdown
        remainingTime.totalSeconds--;
        if (remainingTime.totalSeconds >= 0) {
          const minutes = Math.floor(remainingTime.totalSeconds / 60);
          const seconds = remainingTime.totalSeconds % 60;
          document.getElementById("hours").textContent = "00";
          document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
          document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
          document.querySelector(".timer-text").textContent = `Menuju iqamah ${prayerTimes[index].name}`;
        } else {
          iqamahCountdownActive = false;
          index++;
          if (index < prayerTimes.length) {
            updateTimer(); // Update timer for the next prayer
          } else {
            document.querySelector(".timer-text").textContent = "Semua waktu shalat telah berlalu";
          }
        }
      } else {
        remainingTime = calculateRemainingTime(prayerTimes[index].time);
        if (remainingTime) {
          document.getElementById("hours").textContent = remainingTime.hours.toString().padStart(2, '0');
          document.getElementById("minutes").textContent = remainingTime.minutes.toString().padStart(2, '0');
          document.getElementById("seconds").textContent = remainingTime.seconds.toString().padStart(2, '0');
          document.querySelector(".timer-text").textContent = `Menuju ${prayerTimes[index].name}`;
        } else {
          // Activate iqamah countdown if the current prayer is one of the specified ones
          const currentPrayer = prayerTimes[index].name;
          if (["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].includes(currentPrayer)) {
            iqamahCountdownActive = true;
            remainingTime = { totalSeconds: 5 * 60 }; // 5 minutes countdown
            updateTimer(); // Start the iqamah countdown
          } else {
            index++;
            if (index < prayerTimes.length) {
              updateTimer(); // Update timer for the next prayer
            } else {
              document.querySelector(".timer-text").textContent = "Semua waktu shalat telah berlalu";
            }
          }
        }
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
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

        // Create an array of prayer times
        const prayerTimes = [
          { name: "Imsak", time: jadwal.imsak },
          { name: "Subuh", time: jadwal.subuh },
          { name: "Terbit", time: jadwal.terbit },
          { name: "Dhuha", time: jadwal.dhuha },
          { name: "Dzuhur", time: jadwal.dzuhur },
          { name: "Ashar", time: jadwal.ashar },
          { name: "Maghrib", time: jadwal.maghrib },
          { name: "Isya", time: jadwal.isya },
        ];

        startCountdown(prayerTimes);
      } else {
        console.error('Error: Failed to retrieve prayer schedule.');
      }
    })
    .catch((error) => console.error("Error fetching the prayer schedule:", error));
}

getJadwalShalat();
