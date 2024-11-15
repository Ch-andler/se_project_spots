import "./index.css";
import {
  enableValidation,
  config,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/api.js";
import avatar from "../images/avatar-min.jpg";
import { setButtonText } from "../utils/helpers.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
    "Content-Type": "application/json",
  },
});

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__post-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const submitBtn = document.querySelector("#Button");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalText = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
//Avatar Form Modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

//Delete Form elements

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = document.querySelector("#delete-close");
const deleteModalCancelBtn = document.querySelector("#cancel-button");
const deleteForm = deleteModal.querySelector(".modal__delete-form");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

api
  .getAppInfo()

  .then(([cards, userInfo]) => {
    console.log(cards); // Check if `cards` contains data
    console.log(userInfo);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      console.log("Card element:", cardElement); // Verify it returns an element
      cardsList.append(cardElement);
    });
    const userNameElement = document.querySelector(".profile__name");
    const userDescriptionElement = document.querySelector(
      ".profile__description"
    );
    // Set the src attributes
    profileAvatar.src = avatar;
    //set textContent
    userNameElement.textContent = userInfo.name;
    userDescriptionElement.textContent = userInfo.about;
  })
  .catch(console.error);

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.alt = data.name;
  cardImageEl.src = data.link;

  function handleLike(evt, id) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-button_active");
    api
      .changeLikeStatus(id, isLiked)
      .then(() => {
        likeButton.classList.toggle("card__like-button_active");
      })
      .catch(console.error); // Log any errors
  }

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardImageEl.title = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  deleteModalCloseBtn.addEventListener("click", () => {
    closeModal(deleteModal);
  });

  deleteModalCancelBtn.addEventListener("click", () => {
    closeModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalText.textContent = data.name;
  });

  return cardElement;
}

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

function handleModalOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleModalEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleModalOverlay);
  document.addEventListener("keydown", handleModalEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleModalOverlay);
  document.removeEventListener("keydown", handleModalEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtnTwo = evt.submitter;
  setButtonText(submitBtnTwo, true, "Saving...", "Save");
  //submitBtnTwo.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      profileAvatar.src = data.avatar;
      evt.target.reset();
      disableButton(submitBtn, config.inactiveButtonClass);
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtnTwo, false, "Saving...", "Save");
    });
}
////////////////////////////////////
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  setButtonText(submitButton, true, "Save", "Saving...");
  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving..."); // Reset button text after request
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarSubmitButton = evt.submitter;

  setButtonText(avatarSubmitButton, true, "Save", "Saving...");
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;

      evt.target.reset();
      closeModal(avatarModal);
      console.log("Avatar submit button:", avatarSubmitButton);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitButton, false, "Save", "Saving...");
      disableButton(avatarSubmitButton, "modal__submit-btn_disabled");
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, config);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
  console.log("test");
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
  console.log("test");
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

const newPostBtn = document.querySelector("#post-btn");
newPostBtn.addEventListener("click", () => {
  const buttonElement = cardForm.querySelector(".modal__submit-btn");
  disableButton(buttonElement, config.inactiveButtonClass);
});

enableValidation(config);
