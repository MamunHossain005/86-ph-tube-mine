let singleCategoryId;

const loadAllCategory = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const json = await res.json();
    const data = json.data;
    displayCategoryButtons(data);
};

const displayCategoryButtons = (data) => {
    const categories = document.getElementById('category-buttons');
    categories.innerHTML = '';

    categories.innerHTML = `
        <button class="btn-ph-tube me-1 outline-none" onfocus="loadSingleCategory('${data[0].category_id}')" autofocus>${data[0].category}</button>
        <button class="btn-ph-tube me-1" onfocus="loadSingleCategory('${data[1].category_id}')">${data[1].category}</button>
        <button class="btn-ph-tube me-1" onfocus="loadSingleCategory('${data[2].category_id}')">${data[2].category}</button>
        <button class="btn-ph-tube" onfocus="loadSingleCategory('${data[3].category_id}'">${data[3].category}</button>
    `;
    loadingSpinner(true);
};

const loadSingleCategory = async (id, isSort) => {
    loadingSpinner(true);
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
    const json = await res.json();
    const data = json.data;
    singleCategoryId = id;
    displaySingleCategory(data, isSort);
}

const displaySingleCategory = (data, isSort) => {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';
    const noContent = document.getElementById('no-content');
    noContent.innerHTML = '';

    if(data.length === 0) {
        noContent.innerHTML = `
            <img src="./images/icon.png" class="mx-auto">
            <p class="mt-5  text:xl md:text-3xl font-bold">Oops! Sorry, there is no <br>content here</p> 
        `;
        noContent.classList.remove('hidden');
    }
    else {
        if(isSort) {
            data = data.sort((a, b) => parseFloat(a.others.views)-parseFloat(b.others.views));
        }
        for(let SingleCard of data) {
            const card = document.createElement('div');
            card.innerHTML = `
                <div class="shadow p-4 rounded-lg">
                    <div class="h-48 relative">
                        <img src="${SingleCard.thumbnail}" alt="" class="rounded-lg h-full w-full">
                        <div class="${SingleCard.others.posted_date ? '' : 'hidden'} bg-black px-2 py-1 text-white w-fit rounded-lg text-xs absolute right-[2%] top-[85%]">
                            <p>${calculateTime(SingleCard.others.posted_date)}</p>
                        </div>
                    </div>
                    <div class="flex gap-2 my-3">
                        <img src="${SingleCard.authors[0].profile_picture}" alt="" class="h-10 w-10 rounded-full mt-1">
                        <div>
                            <h2 class="text-lg font-bold">${SingleCard.title}</h2>
                            <p class="font-medium text-gray-600">${SingleCard.authors[0].profile_name} <span class="text-blue-700 ${SingleCard.authors[0].verified ? '' : 'hidden'}"><i class="fa-solid fa-circle-check"></i></span></p>
                            <p class="text-gray-500">${SingleCard.others.views} views</p>
                        </div>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        }
    }
    loadingSpinner(false);
}

const calculateTime = (date) => {
    if(date > 31536000) return Math.floor(date / 31536000) + 'years ago';
    else if(date === 31536000) return '1year ago';
    else if(date > 86400) return Math.floor(date / 86400) + 'days ago';
    else if(date === 86400) return "1 day ago";
    else {
        let hrs, min;
        if(date > 3600) {
            hrs = Math.floor(date / 3600);
            min = Math.floor((date % 3600) / 60);
            return `${hrs}hrs ${min}min ago`;
        }
        else if(date === 3600) return `1 hr ago`;
        else {
            return Math.floor(date / 60) + 'min ago';
        }
    }
}

function loadingSpinner(isLoading) {
    const loader = document.getElementById('loader');
    if(isLoading) {
        loader.classList.remove('hidden');
    }
    else {
        loader.classList.add('hidden');
    }
}

function sortingData() {
    loadSingleCategory(singleCategoryId, true);
}


loadingSpinner(true);
loadAllCategory();


