import { fetchDate } from "./fetchDate.js";

const form = document.querySelector(".form");
const formBtnNext = document.querySelector(".form__btn--next");
const formBtnSubmit = document.querySelector(".form__btn--submit");
const formBtnPrev = document.querySelector(".form__btn--prev");
const formTime = document.querySelector(".form__time");
const formFieldsetClient = document.querySelector(".form__fieldset--client");
const formFieldsetType = document.querySelector(".form__fieldset--type");
const formFieldsetDate = document.querySelector(".form__fieldset--date");
const formFieldsets = [formFieldsetType, formFieldsetDate, formFieldsetClient];
const typeRadioWrapper = document.querySelector(".form__radio-wrapper--type");
const dayRadioWrapper = document.querySelector(".form__radio-wrapper--day");
const timeRadioWrapper = document.querySelector(".form__radio-wrapper--time");
const formMonthsWrapper = document.querySelector(".form__months");
const formInfoType = document.querySelector(".form__info--type");
const formInfoData = document.querySelector(".form__info-data");
const currentMonth = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(
  new Date()
);
let month = currentMonth;
let currentStep = 0;

const data = await fetchDate();
const dataToWrite = {
  dataType: {},
  day: "",
  time: "",
};

const createRadioBtns = (wrapper, name, data) => {
  wrapper.textContent = "";

  data.forEach((item) => {
    const radioDiv = document.createElement("div");
    radioDiv.className = "radio";

    const radioInput = document.createElement("input");
    radioInput.className = "radio__input";
    radioInput.type = "radio";
    radioInput.name = name;
    radioInput.id = item.value;
    radioInput.value = item.value;

    const radioLabel = document.createElement("label");
    radioLabel.className = "radio__lable";
    radioLabel.htmlFor = item.value;
    radioLabel.textContent = item.title;

    radioDiv.append(radioInput, radioLabel);
    wrapper.append(radioDiv);
  });
};

const allMonth = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

const showResultData = () => {
  const currentYear = new Date().getFullYear();
  const monthIndex = allMonth.findIndex((item) => item === month);
  const dataString = `${currentYear}-${(monthIndex + 1)
    .toString()
    .padStart(2, "0")}-${dataToWrite.day.toString().padStart(2, "0")}T${
    dataToWrite.time
  }`;

  const dateObj = new Date(dataString);
  const formattedDate = dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });

  formInfoType.textContent = dataToWrite.dataType.title;
  formInfoData.innerHTML = `
    <span class="form__info-data-day">${formattedDate}</span>
    <span class="form__info-data-time">${dataToWrite.time}</span>`;

  formInfoData.datetime = dataString;
};

const updateFieldsetVisibility = () => {
  for (let i = 0; i < formFieldsets.length; i++) {
    if (i === currentStep) {
      formFieldsets[i].classList.add("form__fieldset--active");
    } else {
      formFieldsets[i].classList.remove("form__fieldset--active");
    }
  }

  if (currentStep === 0) {
    formBtnNext.style.display = "";
    formBtnSubmit.style.display = "none";
    formBtnPrev.style.display = "none";
  } else if (currentStep === formFieldsets.length - 1) {
    formBtnNext.style.display = "none";
    formBtnSubmit.style.display = "";
    formBtnPrev.style.display = "";

    showResultData();
  } else {
    formBtnNext.style.display = "";
    formBtnSubmit.style.display = "none";
    formBtnPrev.style.display = "";
  }
};

const createFormDay = (date) => {
  const objectMonth = date.find((item) => item.month === month);
  const days = Object.keys(objectMonth.day);
  const typeData = days.map((item) => ({
    value: item,
    title: item,
  }));
  createRadioBtns(dayRadioWrapper, "day", typeData);
};

const createFormMonth = (months) => {
  formMonthsWrapper.textContent = "";
  const buttonsMonth = months.map((item) => {
    const btn = document.createElement("button");
    btn.className = "form__btn-month";
    btn.type = "button";
    btn.textContent = `${item[0].toUpperCase()}${item
      .substring(1)
      .toLowerCase()}`;

    if (item === month) {
      btn.classList.add("form__btn-month--active");
    }

    return btn;
  });

  formMonthsWrapper.append(...buttonsMonth);

  buttonsMonth.forEach((btn) => {
    btn.addEventListener("click", ({ target }) => {
      if (target.classList.contains("form__btn-month--active")) {
        return;
      }
      buttonsMonth.forEach((btn) => {
        btn.classList.remove("form__btn-month--active");
      });

      target.classList.add("form__btn-month--active");

      month = target.textContent.toLowerCase();

      const date = data.find(
        (item) => item.type === dataToWrite.dataType.type
      ).date;
      createFormDay(date);
    });
  });
};

const createFormTime = (date, day) => {
  const objectMonth = date.find((item) => item.month === month);
  const days = objectMonth.day;
  const daysData = days[day].map((item) => ({
    value: `${item}:00`,
    title: `${item}:00`,
  }));
  createRadioBtns(timeRadioWrapper, "time", daysData);
  formTime.style.display = "block";
};

const handleInputForm = ({ currentTarget, target }) => {
  if (currentTarget.type.value && currentStep === 0) {
    formBtnNext.disabled = false;

    const typeObj = data.find((item) => item.type === currentTarget.type.value);

    dataToWrite.dataType.type = typeObj.type;
    dataToWrite.dataType.title = typeObj.title;

    const date = typeObj.date;
    const months = date.map((item) => item.month);

    createFormMonth(months);
    createFormDay(date);
  }

  if (currentStep === 1) {
    if (currentTarget.day.value && target.name === "day") {
      dataToWrite.day = currentTarget.day.value;
      const date = data.find(
        (item) => item.type === dataToWrite.dataType.type
      ).date;
      createFormTime(date, dataToWrite.day);
    }
    if (
      currentTarget.day.value &&
      currentTarget.time.value &&
      target.name === "time"
    ) {
      dataToWrite.time = currentTarget.time.value;
      formBtnNext.disabled = false;
    } else {
      formBtnNext.disabled = true;
    }
  }

  if (currentStep === 2) {
    const inputs = formFieldsetClient.querySelectorAll(".form__input");
    let allFielld = true;
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFielld = false;
      }
    });

    formBtnSubmit.disabled = !allFielld;
  }
};

const renderTypeFieldset = () => {
  const typeData = data.map((item) => ({
    value: item.type,
    title: item.title,
  }));

  createRadioBtns(typeRadioWrapper, "type", typeData);
};

const init = () => {
  formBtnNext.disabled = true;
  formBtnNext.addEventListener("click", () => {
    if (currentStep < formFieldsets.length - 1) {
      currentStep += 1;
      updateFieldsetVisibility();
      formBtnNext.disabled = true;
      formBtnSubmit.disabled = true;
    }
  });

  formBtnPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      updateFieldsetVisibility();
      formBtnNext.disabled = false;
    }
  });

  form.addEventListener("input", handleInputForm);

  updateFieldsetVisibility();
  renderTypeFieldset();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const formDataObject = Object.fromEntries(formData);
    formDataObject.month = month;

    try {
      const response = await fetch(
        "https://playful-plausible-rook.glitch.me/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObject),
        }
      );

      if (response.ok) {
        console.log("Данные успешно отправлены");
        alert("Данные успешно отправлены");
        form.innerHTML = `<h2>Ждите звонка</h2>`;
      } else {
        throw new Error(`Ошибка при отправке данных: ${response.status}`);
      }

    } catch (error) {
      console.log(`Ошибка при отправке запрос: ${response.status}`);
    }
  });
};

init();
