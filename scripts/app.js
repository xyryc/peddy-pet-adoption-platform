const showModalButton = document.getElementById("showModalData");
const modal = document.getElementById("my_modal_4");
const closeModalButton = document.getElementById("closeModal");
const adoptModal = document.getElementById("countdownModal");
const closeAdoptModalButton = document.getElementById("closeCountDownModal");

let currentPetsData = [];
let currentCategoryPets = [];

// load all pet
const loadPets = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/pets"
  );
  const data = await response.json();

  allPetsData = data.pets; // Save all pets data for sorting
  currentCategoryPets = allPetsData; // Set current category pets to all pets initially

  loadingSpinner();

  setTimeout(() => {
    displayPets(currentCategoryPets);
  }, 2000);
};

// Function to sort pets by price
const sortPetsByPrice = () => {
  const sortedPets = [
    ...(currentCategoryPets.length ? currentCategoryPets : allPetsData),
  ].sort((a, b) => b.price - a.price); // Sort by price descending
  displayPets(sortedPets);
};
// Event listener for the sort button
document
  .getElementById("sortByPriceBtn")
  .addEventListener("click", sortPetsByPrice);

// display all pet
const displayPets = (pets) => {
  const petsContainer = document.getElementById("pets-container");

  petsContainer.innerHTML = "";

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="p-5 rounded-xl border">
        <img
            class="rounded-lg h-40 object-cover w-full"
            src="${pet.image || "./assets/sample_card_image.png"}" 

        />
        <div class="space-y-2 mt-6 mb-4">
            <h3 class="text-xl font-bold font-inter">${
              pet.pet_name || "Unknown Pet"
            }</h3>
            <p class="flex items-center gap-2 text-base font-normal text-lightGray">
                <img src="./assets/breed_icon.png" alt="" /> Breed: ${
                  pet.breed || "Not specified"
                }
            </p>
            <p class="flex items-center gap-2 text-base font-normal text-lightGray">
                <img src="./assets/calender_icon.png" alt="" /> Birth: ${
                  pet.date_of_birth || "Unknown"
                }
            </p>
            <p class="flex items-center gap-2 text-base font-normal text-lightGray">
                <img src="./assets/gender_icon.png" alt="" /> Gender: ${
                  pet.gender || "Not specified"
                }
            </p>
            <p class="flex items-center gap-2 text-base font-normal text-lightGray">
                <img src="./assets/dollar_icon.png" alt="" /> Price: ${
                  pet.price !== (undefined || null)
                    ? `${pet.price}$`
                    : "Not listed"
                }
            </p>
        </div>
        <div class="divider"></div>
        <div class="flex justify-between items-center">
            <button 
                onclick="likedPets(this, '${pet.image}')"
              class="btn btn-sm border border-lightCyan hover:bg-teal-700 hover:text-white text-colorPrimary">
                <img src="./assets/like_icon.png" alt="" />
            </button>
            <button 
                 onclick="adoptPet(this, '${pet.petId}')"
               class="btn btn-sm border border-lightCyan hover:bg-teal-700 hover:text-white text-colorPrimary">
                Adopt
            </button>
            <button
                onclick="loadPetDetails('${pet.petId}')"
                class="btn btn-sm border border-lightCyan hover:bg-teal-700 hover:text-white text-colorPrimary"
            >
                Details
            </button>
        </div>
    </div>
`;

    petsContainer.append(card);
  });
};

// adopt modal
const adoptPet = (button, petId) => {
  // show countdown modal
  document.getElementById("showCountDownModalData").click();

  let count = 2;
  const countdown = setInterval(() => {
    document.getElementById("adoptCounter").innerText = count;
    count--;

    if (count < 0) {
      clearInterval(countdown);
      adoptModal.close();
      document.getElementById("adoptCounter").innerText = "3";
      button.disabled = true;
      button.innerText = "Adopted";
    }
  }, 1000);
};

// modal
const loadPetDetails = async (petId) => {
  const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
  const response = await fetch(uri);
  const data = await response.json();
  displayPetDetails(data.petData);
};

// modal details
const displayPetDetails = (petData) => {
  const detailsContainer = document.getElementById("modal-content");

  detailsContainer.innerHTML = `
  <img
      class="w-full rounded-lg"
      src="${petData.image}"
   
  />
  <h2 class="text-2xl font-bold font-inter mt-5 mb-3">${
    petData.pet_name || "Unknown Pet"
  }</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div class="space-y-2">
          <p
              class="flex items-center gap-2 text-base font-normal text-lightGray"
          >
              <img src="./assets/breed_icon.png" alt="" /> Breed: ${
                petData.breed || "Not specified"
              }
          </p>

          <p
              class="flex items-center gap-2 text-base font-normal text-lightGray"
          >
              <img src="./assets/gender_icon.png" alt="" /> Gender: ${
                petData.gender || "Not specified"
              }
          </p>

          <p
              class="flex items-center gap-2 text-base font-normal text-lightGray"
          >
              <img src="./assets/gender_icon.png" alt="" /> Vaccinated Status: ${
                petData.vaccinated_status || "Not specified"
              }
          </p>
      </div>

      <div class="space-y-2">
          <p
              class="flex items-center gap-2 text-base font-normal text-lightGray"
          >
              <img src="./assets/calender_icon.png" alt="" /> Birth: ${
                petData.date_of_birth || "Unknown"
              }
          </p>

          <p
              class="flex items-center gap-2 text-base font-normal text-lightGray"
          >
              <img src="./assets/dollar_icon.png" alt="" /> Price: ${
                petData.price !== (undefined || null)
                  ? `${petData.price}$`
                  : "Not Listed"
              }
          </p>
      </div>
  </div>

  <div class="divider"></div>

  <div class="font-inter space-y-3">
      <h4 class="text-base font-semibold">Details Information</h4>
      <p class="text-base font-normal">
          ${petData.pet_details || "No additional information available."}
      </p>
  </div>
`;

  // open details modal
  document.getElementById("showModalData").click();
};

// details modal handler
// close details modal
closeModalButton.onclick = function () {
  modal.close();
};

// click outside to hide modal
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

// load category
const loadPetsCategory = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );
  const data = await response.json();
  displayPetsCategory(data.categories);
};

// display category
const displayPetsCategory = (categories) => {
  try {
    const categoryContainer = document.getElementById("category-container");

    categories.forEach((category) => {
      const buttonContainer = document.createElement("div");
      //   console.log(category.category.toLowerCase());

      buttonContainer.innerHTML = `
            <button
                id='btn-${category.category.toLowerCase()}'
              onclick='loadCategoryPets("${category.category.toLowerCase()}")'
              class="category-btn md:px-16 hover:bg-teal-600 hover:text-white hover:scale-105 hover:duration-200 flex items-center justify-center gap-4 p-6"
            >
              <img class="w-14 h-14" src="${category.category_icon}" alt="" />
              <p class="text-2xl font-bold">${category.category}</p>
            </button>
      `;

      categoryContainer.append(buttonContainer);
    });
  } catch (error) {
    console.log(error);
  }
};

// load category pets
const loadCategoryPets = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/category/${id}`
  );
  const data = await response.json();

  currentCategoryPets = data.data; // Set to current category pets

  // remove active class
  removeActiveClass();
  // add active class
  const activeBtn = document.getElementById(`btn-${id}`);
  activeBtn.classList.add("active");

  const petsContainer = document.getElementById("pets-container");

  loadingSpinner();

  // no content here dialog
  if (currentCategoryPets.length === 0) {
    petsContainer.classList.remove("grid");
    petsContainer.innerHTML = `
      <div class='min-h-[300px] flex flex-col gap-5 justify-center items-center text-center py-24'>
          <img src="./assets/error.webp"/>
          <h2 class='text-[32px] font-bold font-inter mt-6 mb-4'>No pets here in this category</h2>
          <p class=" w-[75%] mx-auto text-lightGray">
          While there are currently no pets available in this category, 
          we invite you to explore our other sections for a diverse range of loving companions waiting for a forever home!
          </p>
      </div>
    `;
  } else {
    petsContainer.classList.add("grid");

    setTimeout(() => {
      displayPets(currentCategoryPets);
    }, 2000);
  }
};

// remove active class
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");

  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};

// liked pets handler
const likedPets = (button, petImage) => {
  button.disabled = true;

  const likedPetsContainer = document.getElementById("liked-pets-container");

  const div = document.createElement("div");
  div.innerHTML = `
              <img
                class="w-[124px] h-[124px] object-cover rounded-lg"
                src="${petImage}"
                alt=""
              />
  `;

  likedPetsContainer.appendChild(div);
};

// show loading spinner
const loadingSpinner = () => {
  // loading spinner
  const petsContainer = document.getElementById("pets-container");
  petsContainer.classList.remove("grid");
  petsContainer.innerHTML = `
      <div class='min-h-[300px] flex justify-center items-center'>
            <img src="./assets/loading_spinner.gif">
      </div>
  `;
  petsContainer.classList.add("grid");
};

// smooth scrolling
document.getElementById("view-more-btn").addEventListener("click", function () {
  document
    .getElementById("main-section")
    .scrollIntoView({ behavior: "smooth" });
});

// // adopt button countdown
// document.getElementById("adoptButton").addEventListener("click", () => {
//   console.log("adopt button clicked");
// });

loadPets();
loadPetsCategory();
