let strugglingList = [];
let thrivingList = [];

let total = document.getElementById("total");
let ThrivingCount = document.getElementById("ThrivingCount");
let StrugglingCount = document.getElementById("StrugglingCount");

let allFilterBtn = document.getElementById("all-filter-btn");
let thrivingFilterBtn = document.getElementById("thriving-filter-btn");
let strugglingFilterBtn = document.getElementById("struggling-filter-btn");

let allCardSection = document.getElementById('allCards');
let filtersSection = document.getElementById('filters-section');
let mainContainer = document.querySelector('main');

function toggleStyle(id) {

    allFilterBtn.classList.remove('bg-black', 'text-white');
    thrivingFilterBtn.classList.remove('bg-black', 'text-white');
    strugglingFilterBtn.classList.remove('bg-black', 'text-white');

    allFilterBtn.classList.add('bg-gray-300', 'text-black');
    thrivingFilterBtn.classList.add('bg-gray-300', 'text-black');
    strugglingFilterBtn.classList.add('bg-gray-300', 'text-black');

    let activeBtn = document.getElementById(id);
    activeBtn.classList.remove('bg-gray-300', 'text-black');
    activeBtn.classList.add('bg-black', 'text-white');

    if (id === 'thriving-filter-btn') {
        allCardSection.classList.add("hidden");
        filtersSection.classList.remove("hidden");
        renderThriving();
    }
    else if (id === 'struggling-filter-btn') {
        allCardSection.classList.add("hidden");
        filtersSection.classList.remove("hidden");
        renderStruggling();
    }
    else {
        allCardSection.classList.remove("hidden");
        filtersSection.classList.add("hidden");
        filtersSection.innerHTML = '';
    }
}

function calculatedCount() {
    total.innerText = allCardSection.children.length;
    ThrivingCount.innerText = thrivingList.length;
    StrugglingCount.innerText = strugglingList.length;
}

calculatedCount();

mainContainer.addEventListener('click', function (event) {

    let parentNode = event.target.closest('.card');
    if (!parentNode) return;

    let plantName = parentNode.querySelector('.plant-name').innerText;
    let latinName = parentNode.querySelector('.latin-name').innerText;
    let light = parentNode.querySelector('.light').innerText;
    let water = parentNode.querySelector('.water').innerText;
    let notes = parentNode.querySelector('.notes').innerText;

    if (event.target.classList.contains('thriving-btn')) {

        parentNode.querySelector('.status').innerText = "Thrive";

        let cardInfo = { plantName, latinName, light, water, status: 'Thrive', notes };

        strugglingList = strugglingList.filter(item => item.plantName !== plantName);

        let plantExist = thrivingList.find(item => item.plantName === plantName);
        if (!plantExist) {
            thrivingList.push(cardInfo);
        } else {
            thrivingList = thrivingList.map(item =>
                item.plantName === plantName ? cardInfo : item
            );
        }

        syncOriginalCardStatus(plantName, 'Thrive');
        calculatedCount();
        renderThriving();
    }

    else if (event.target.classList.contains('struggling-btn')) {

        parentNode.querySelector('.status').innerText = "Struggling";

        let cardInfo = { plantName, latinName, light, water, status: 'Struggling', notes };

        thrivingList = thrivingList.filter(item => item.plantName !== plantName);

        let plantExist = strugglingList.find(item => item.plantName === plantName);
        if (!plantExist) {
            strugglingList.push(cardInfo);
        } else {
            strugglingList = strugglingList.map(item =>
                item.plantName === plantName ? cardInfo : item
            );
        }

        syncOriginalCardStatus(plantName, 'Struggling');
        calculatedCount();
        renderStruggling();
    }

    else if (event.target.closest('.btn-delete')) {

        parentNode.remove();

        allCardSection.querySelectorAll('.card').forEach(card => {
            if (card.querySelector('.plant-name').innerText === plantName) {
                card.remove();
            }
        });

        thrivingList = thrivingList.filter(item => item.plantName !== plantName);
        strugglingList = strugglingList.filter(item => item.plantName !== plantName);

        calculatedCount();
    }
});

function syncOriginalCardStatus(plantName, status) {
    allCardSection.querySelectorAll('.card').forEach(card => {
        if (card.querySelector('.plant-name').innerText === plantName) {
            card.querySelector('.status').innerText = status;
        }
    });
}

function createCardHTML(plant) {
    return `
        <div class="space-y-6">
            <p class="plant-name text-4xl">${plant.plantName}</p>
            <p class="latin-name">${plant.latinName}</p>

            <div class="flex gap-5">
                <p class="light bg-gray-200 px-5">${plant.light}</p>
                <p class="water bg-gray-200 px-5">${plant.water}</p>
            </div>

            <p class="status">${plant.status}</p>
            <p class="notes">${plant.notes}</p>

            <div class="flex gap-5">
                <button class="thriving-btn bg-green-400 px-7 py-2">Thriving</button>
                <button class="struggling-btn bg-red-400 px-6 py-2">Struggling</button>
            </div>
        </div>

        <div>
            <button class="btn-delete bg-red-200 text-red-600 px-6 py-2">Delete</button>
        </div>
    `;
}

function renderThriving() {
    filtersSection.innerHTML = '';

    if (thrivingList.length === 0) {
        filtersSection.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <h3 class="text-lg font-semibold text-gray-600">No thriving plants</h3>
                <p class="text-gray-400 text-sm">Mark a plant as thriving to see it here</p>
            </div>
        `;
        return;
    }

    for (let thrive of thrivingList) {
        let div = document.createElement('div');
        div.className = 'card flex justify-between border p-8';
        div.innerHTML = createCardHTML(thrive);
        filtersSection.appendChild(div);
    }
}

function renderStruggling() {
    filtersSection.innerHTML = '';

    if (strugglingList.length === 0) {
        filtersSection.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <h3 class="text-lg font-semibold text-gray-600">No struggling plants</h3>
                <p class="text-gray-400 text-sm">Mark a plant as struggling to see it here</p>
            </div>
        `;
        return;
    }

    for (let struggle of strugglingList) {
        let div = document.createElement('div');
        div.className = 'card flex justify-between border p-8';
        div.innerHTML = createCardHTML(struggle);
        filtersSection.appendChild(div);
    }
}
