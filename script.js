var freshData;

const COUNTRIES = {
    "ser": "Srbija",
    "cro": "Hrvatska",
    "bih": "BiH"
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

function parseCustomDate(dateStr) {
    // Remove the trailing dot and split by dot
    const [day, month, year] = dateStr.replace(/\.$/, '').split('.').map(Number);
    // Note: JavaScript months are 0-based (0 = January, 11 = December)
    return new Date(year, month - 1, day);
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

            const eventDate = `<div>
                <div class="event-date">${event.date}</div>
                <a href=${event.url} class="event-info-details" target="blank">Više detalja</a>
            </div>`;
            const eventInfo = `<div class="event-info">${event.name}</div>`;
            const eventButton = `<div><a href=${event.url} class="event-info-details" target="blank">Više detalja</a></div>`;

            eventCard.insertAdjacentHTML("beforeend", eventDate);
            eventCard.insertAdjacentHTML("beforeend", eventInfo);

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

    // Reset the country filter dropdown
    document.getElementById('country-filter').value = '';

    // Show all events (without any filter)
    filterEvents();
}

// Function to filter events based on search and month filter
function filterEvents() {
    const searchQuery = document.getElementById('search').value || '';
    const selectedMonth = document.getElementById('month-filter').value;
    const selectedCountry = document.getElementById('country-filter').value;

    const filteredEvents = freshData.filter(event => {
        const eventMonth = getMonth(event.date)
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMonth = selectedMonth ? eventMonth === selectedMonth : true;
        const matchesCountry = selectedCountry ? selectedCountry === event.country : true;

        return matchesSearch && matchesMonth && matchesCountry;
    });

    const groupedEvents = groupEventsByMonth(filteredEvents);
    displayGroupedEvents(groupedEvents);
}

// Function to populate the month filter dropdown
function populateMonthFilter() {
    const months = [...new Set(freshData.map(event => getMonth(event.date)))];
    const monthFilter = document.getElementById("month-filter");

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
}

function populateCountryFilter() {
    const uniqueCountries = [...new Set(freshData.map(item => item.country))];

    const countryFilter = document.getElementById("country-filter");

    uniqueCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = COUNTRIES[country];
        countryFilter.appendChild(option);
    });

}

function init(data) {
    freshData = data;
    // Initialize and display grouped events
    populateMonthFilter();
    populateCountryFilter();
    displayGroupedEvents(groupEventsByMonth(freshData));
}

// Event listeners for search and month filter
document.getElementById('search').addEventListener('input', filterEvents);
document.getElementById('month-filter').addEventListener('change', filterEvents);
document.getElementById('country-filter').addEventListener('change', filterEvents);

// Event listener for the "Show All" button
document.getElementById('show-all-btn').addEventListener('click', clearFilters);
