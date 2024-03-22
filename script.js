// Function to update the countdown timer
function updateTimer() {
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

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

// Function to update prayer times
function updatePrayerTimes() {
    const dhakaOffset = 6; // Bangladesh Standard Time (BST) is UTC+6
    const nowDhaka = new Date(
        new Date().getTime() + dhakaOffset * 60 * 60 * 1000
    ); // Getting current time in Dhaka

    const prayerTimes = [
        { name: "FAJR", time: "4:47AM" },
        { name: "DHUHR", time: "12:09PM" },
        { name: "ASR", time: "5: 21PM" },
        { name: "MAGHRIB", time: "6:14PM" },
        { name: "ESHA", time: "7:26PM" },
    ];

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

        // Check if it's time for this prayer
        if (
            nowDhaka.getHours() === prayerHour &&
            nowDhaka.getMinutes() >= prayerMinute &&
            nowDhaka.getMinutes() <= prayerMinute + 5
        ) {
            div.classList.add("active");
        }

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



// Update timer and prayer times every second
setInterval(() => {
    updateTimer();
    updatePrayerTimes();
}, 1000);
// Set the day dynamically
const today = new Date();
const ramadanStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // Assuming Ramadan starts on the 1st day of the current month
ramadanStartDate.setDate(ramadanStartDate.getDate() + 10); // Adding 10 days to get to the 11th day of Ramadan

const day = ramadanStartDate.getDate();
document.getElementById("day").textContent = `${day} Ramadan`;