const prayerNames = ['FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA'];
let prayerTimes;
let prayerTimesAsMS;

const isSameDate = (readableDate) => {
    // const dhakaOffset = 6; // Bangladesh Standard Time (BST) is UTC+6
    // let today = new Date(new Date().getTime() + dhakaOffset * 60 * 60 * 1000); // Getting current time in Dhaka
    let today = new Date();
    let date = new Date(readableDate);
    let result = date.toDateString() === today.toDateString();

    return result;
}

const convertToDate = (timings, today) => {
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    let fajar = timings.Fajr.split(' ')[0];
    fajar = fajar.split(':').map(Number);

    let dhuhr = timings.Dhuhr.split(' ')[0];
    dhuhr = dhuhr.split(':').map(Number);

    let asr = timings.Asr.split(' ')[0];
    asr = asr.split(':').map(Number);

    let maghrib = timings.Maghrib.split(' ')[0];
    maghrib = maghrib.split(':').map(Number);

    let isha = timings.Isha.split(' ')[0];
    isha = isha.split(':').map(Number);

    fajar = new Date(year, month, date, fajar[0], fajar[1]);
    dhuhr = new Date(year, month, date, dhuhr[0], dhuhr[1]);
    asr = new Date(year, month, date, asr[0], asr[1]);
    maghrib = new Date(year, month, date, maghrib[0], maghrib[1]);
    isha = new Date(year, month, date, isha[0], isha[1]);

    prayerTimes = [fajar, dhuhr, asr, maghrib, isha];
    prayerTimesAsMS = [fajar.getTime(), dhuhr.getTime(), asr.getTime(), maghrib.getTime(), isha.getTime()];

    // console.log(prayerTimes);
    // console.log(prayerTimesAsMS);
}

const fetchPrayerAPI = async () => {
    await fetch(`https://api.aladhan.com/v1/calendarByCity?country=BD&city=Dhaka`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then((prayer) => {
            for (let prayerData of prayer.data) {
                let readableDate = prayerData.date.readable;

                if (isSameDate(readableDate)) {
                    let timings = prayerData.timings;
                    let today = new Date(readableDate);
                    convertToDate(timings, today);
                }
            }
        });
}

// Function to update date
function updateRamadan() {
    const ramadan1 = new Date(2024, 2, 12, 4, 47, 0, 0);
    const now = Date.now();
    let diff = now - ramadan1.valueOf();
    const oneDay = 60 * 60 * 24 * 1000;
    let day = ((diff / oneDay) >> 0) + 1;
    document.getElementById("day").textContent = `${day} Ramadan`;
}

// Function to update the countdown timer
function updateTimer() {
    updateRamadan();

    const now = new Date();
    let iftarTime = prayerTimes[3];

    const timeDifference = iftarTime - now;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const hour = document.getElementById("hours");
    const minute = document.getElementById("minutes");
    const second = document.getElementById("seconds");

    const oneDay = 60 * 60 * 24 * 1000;

    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    let isMidnight = now.getTime() >= midnight.getTime() && now.getTime() <= prayerTimesAsMS[0];
    let afterIftar = now.getTime() >= prayerTimesAsMS[3];

    if (isMidnight || afterIftar) {
        hour.textContent = "00";
        minute.textContent = "00";
        second.textContent = "00";
    } else {
        hour.textContent = hours;
        minute.textContent = minutes;
        second.textContent = seconds;
    }
}

// Function to create 'prayerTimes' Div
function createPrayerDiv() {
    const dhakaOffset = 6; // Bangladesh Standard Time (BST) is UTC+6
    // const nowDhaka = new Date(
    // new Date().getTime() + dhakaOffset * 60 * 60 * 1000
    // ); // Getting current time in Dhaka
    let nowDhaka = new Date();

    const prayerTimesDiv = document.getElementById("prayerTimes");
    prayerTimesDiv.innerHTML = "";

    prayerTimes.forEach((prayer, index) => {
        const div = document.createElement("div");
        div.classList.add("details");

        const boxDiv = document.createElement("div");
        boxDiv.classList.add('namaz_box');

        const h5 = document.createElement("h5");
        h5.textContent = prayerNames[index];

        const p = document.createElement("p");
        p.classList.add("timing");
        let hour = prayer.getHours();
        let minute = prayer.getMinutes().toString().padStart(2, '0');
        let meridiem = `${hour < 12 ? 'AM' : 'PM'}`;

        let time = `${hour <= 12 ? hour : hour - 12}:${minute} ${meridiem}`;
        p.textContent = time;

        div.appendChild(boxDiv);
        div.appendChild(h5);
        div.appendChild(p);

        prayerTimesDiv.appendChild(div);
    });

}

function markPrayer(num) {
    const prayerTimesDiv = document.getElementById("prayerTimes");

    for (let i = 0; i < 5; i++) {
        prayerTimesDiv.children[i].children[0].classList.remove("active");
    }

    let targetElement = prayerTimesDiv.children[num].children[0];
    targetElement.classList.add("active");
}

// Function to check if time for prayer
function updatePrayers() {
    const dhakaOffset = 6; // Bangladesh Standard Time (BST) is UTC+6
    const nowDhaka = new Date(
        new Date().getTime() + dhakaOffset * 60 * 60 * 1000
    ); // Getting current time in Dhaka


    let curTime = new Date().getTime();

    if (curTime >= prayerTimesAsMS[prayerTimesAsMS.length - 1]) {
        markPrayer(prayerTimesAsMS.length - 1); // mark ISHA
    } else {
        let i = 0;
        while (i <= prayerTimesAsMS.length - 2) {
            if (curTime >= prayerTimesAsMS[i] && curTime < prayerTimesAsMS[i + 1]) {
                markPrayer(i);
            }
            i++;
        }
    }
}

// Fetch API data
const handleAPI = async () => {
    await fetchPrayerAPI();
    console.log("Fetched Data", prayerTimes);

    createPrayerDiv();

    // Update timer and prayer times every second
    setInterval(() => {
        updateTimer();
        updatePrayers();
    }, 1000);
}
handleAPI();

// Update timer and prayer times every second
// createPrayerDiv();
// setInterval(() => {
//     updateTimer();
//     updatePrayers();
// }, 1000);
