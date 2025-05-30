
// Function to format date to dd/mm/yyyy
function formatDate(date) {
    return date;
}

// Function to group events by month
function groupEventsByMonth(events) {
    return events.reduce((result, event) => {
        const month = getMonth(event.date);
        if (!result[month]) {
            result[month] = [];
        }
        result[month].push(event);
        return result;
    }, {});
}

// Function to display grouped events
function displayGroupedEvents(groupedEvents) {
    const container = document.querySelector("#data-container");

    // Clear previous content
    container.innerHTML = "";

    for (const [month, events] of Object.entries(groupedEvents)) {

        const monthHeader = document.createElement("div");
        monthHeader.classList.add("month-header");
        monthHeader.textContent = month;
        container.appendChild(monthHeader);

        // Add the event cards for this month
        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            const eventDate = document.createElement("div");
            eventDate.classList.add("event-date");
            eventDate.textContent = formatDate(event.date); // Apply the date format

            const eventDateDiv = `<div class="event-date-wrapper"><i class="far fa-calendar-alt"></i><span class="event-date">${formatDate(event.date)}</span><div>`;

            const eventInfo = document.createElement("div");
            eventInfo.classList.add("event-info");

            const eventTitle = document.createElement("h2");
            eventTitle.classList.add("event-title");
            eventTitle.textContent = event.name;
            eventInfo.appendChild(eventTitle);

            const eventButton = document.createElement("a");
            eventButton.textContent = "Više detalja";
            eventButton.href = event.url;
            eventButton.target = "_blank";
            eventInfo.appendChild(eventButton);

            eventCard.appendChild(eventInfo);
            eventCard.insertAdjacentHTML("beforeend", eventDateDiv);
            container.appendChild(eventCard);
        });
    }
}

// Function to clear search input and reset the month filter
function clearFilters() {
    // Reset the search input
    document.getElementById('search').value = '';

    // Reset the month filter dropdown
    document.getElementById('month-filter').value = '';

    // Show all events (without any filter)
    filterEvents();
}

// Event listener for the "Show All" button
document.getElementById('show-all-btn').addEventListener('click', clearFilters);

// Function to filter events based on search and month filter
function filterEvents() {
    const searchQuery = document.getElementById('search').value || '';
    const selectedMonth = document.getElementById('month-filter').value;

    const filteredEvents = data.filter(event => {
        const eventMonth = getMonth(event.date)
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMonth = selectedMonth ? eventMonth === selectedMonth : true;

        return matchesSearch && matchesMonth;
    });

    const groupedEvents = groupEventsByMonth(filteredEvents);
    displayGroupedEvents(groupedEvents);
}


function getMonth(date) {
    let month = date.slice(-8, -6);
    const monthMapping = {
        '01': 'Januar',
        '02': 'Februar',
        '03': 'Mart',
        '04': 'April',
        '05': 'Maj',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Avgust',
        '09': 'Septembar',
        '10': 'Oktobar',
        '11': 'Novembar',
        '12': 'Decembar'
    }
    return monthMapping[month];
}

// Function to populate the month filter dropdown
function populateMonthFilter() {
    const months = [...new Set(data.map(event => getMonth(event.date)))];
    const monthFilter = document.getElementById("month-filter");

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
}

// Initialize and display grouped events
populateMonthFilter();

displayGroupedEvents(groupEventsByMonth(data));

// Event listeners for search and month filter
document.getElementById('search').addEventListener('input', filterEvents);
document.getElementById('month-filter').addEventListener('change', filterEvents);
