const prayerTimes = [
    { name: "FAJR", time: "4:47AM" },
    { name: "DHUHR", time: "12:09PM" },
    { name: "ASR", time: "5:21PM" },
    { name: "MAGHRIB", time: "6:14PM" },
    { name: "ESHA", time: "7:26PM" },
];

let prayerTimes1;

// Function to update date
function updateRamadan() {
    const ramadan1 = new Date(2024, 2, 12, 4, 47, 0, 0);
    const now = Date.now();
    let diff = now - ramadan1.valueOf();
    const oneDay = 60 * 60 * 24 * 1000;
    let day = (diff / oneDay >> 0) + 1
    document.getElementById("day").textContent = `${day} Ramadan`;
}

// Function to get prayer times
function getPrayerTimes() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    const fajar = new Date(year, month, date, 4, 47, 0, 0);
    const dhuhr = new Date(year, month, date, 12, 9, 0, 0);
    const asr = new Date(year, month, date, 12 + 5, 21, 0, 0);
    const magrib = new Date(year, month, date, 12 + 6, 14, 0, 0);
    const esha = new Date(year, month, date, 12 + 7, 26, 0, 0);

    prayerTimes1 = [fajar.getTime(), dhuhr.getTime(), asr.getTime(), magrib.getTime(), esha.getTime()];
}

// Function to update the countdown timer
function updateTimer() {
    getPrayerTimes();
    updateRamadan();

    const now = new Date();
    const iftarTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        18,
        14,
        0
    ); // Assuming Iftar is at 6:14 PM

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
    let isMidnight = now.getTime() >= midnight.getTime() && now.getTime() <= prayerTimes1[0];
    let afterIftar = now.getTime() >= prayerTimes1[3];

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
    const nowDhaka = new Date(
        new Date().getTime() + dhakaOffset * 60 * 60 * 1000
    ); // Getting current time in Dhaka

    const prayerTimesDiv = document.getElementById("prayerTimes");
    prayerTimesDiv.innerHTML = "";

    prayerTimes.forEach((prayer) => {
        const div = document.createElement("div");
        div.classList.add("details");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "prayerTime";

        // Convert prayer time to Dhaka time
        const prayerTimeParts = prayer.time.split(":");
        const prayerHour = parseInt(prayerTimeParts[0], 10);
        const prayerMinute = parseInt(prayerTimeParts[1], 10);
        const prayerTimeDhaka = new Date(
            nowDhaka.getFullYear(),
            nowDhaka.getMonth(),
            nowDhaka.getDate(),
            prayerHour,
            prayerMinute
        );

        // if (
        //     nowDhaka.getHours() === prayerHour &&
        //     nowDhaka.getMinutes() >= prayerMinute &&
        //     nowDhaka.getMinutes() <= prayerMinute + 5
        // ) {
        //     div.classList.add("active");
        // }

        const h5 = document.createElement("h5");
        h5.textContent = prayer.name;

        const p = document.createElement("p");
        p.classList.add("timing");
        p.textContent = prayer.time;

        div.appendChild(input);
        div.appendChild(h5);
        div.appendChild(p);

        prayerTimesDiv.appendChild(div);
    });

}

function markPrayer(num) {
    const prayerTimesDiv = document.getElementById("prayerTimes");

    for (let i = 0; i < 5; i++) {
        prayerTimesDiv.children[i].children[1].classList.remove("active");
    }

    let targetElement = prayerTimesDiv.children[num].children[1];
    targetElement.classList.add("active");
}

// Function to check if time for prayer
function updatePrayers() {
    const dhakaOffset = 6; // Bangladesh Standard Time (BST) is UTC+6
    const nowDhaka = new Date(
        new Date().getTime() + dhakaOffset * 60 * 60 * 1000
    ); // Getting current time in Dhaka


    let curTime = new Date().getTime();

    if (curTime >= prayerTimes1[prayerTimes1.length - 1]) {
        markPrayer(4);
        // console.log("ESHA!!!");
    } else {
        let i = 0;
        while (i < prayerTimes1.length - 2) {
            if (curTime >= prayerTimes1[i] && curTime < prayerTimes1[i + 1]) {
                markPrayer(i);
            }
            i++;
        }
    }
}


// Update timer and prayer times every second
createPrayerDiv();
setInterval(() => {
    updateTimer();
    updatePrayers();
}, 1000);
