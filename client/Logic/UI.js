const getElement = (elementId) => {
    return document.getElementById(elementId);
};

const showError = (elementId, message) => {

    const element = getElement(elementId);

    if (!element) return;

    element.textContent = message;
    element.classList.remove("hidden");

};

const hideError = (elementId) => {

    const element = getElement(elementId);

    if (!element) return;

    element.textContent = "";
    element.classList.add("hidden");

};

const showElement = (elementId) => {

    const element = getElement(elementId);

    if (!element) return;

    element.classList.remove("hidden");

};

const hideElement = (elementId) => {

    const element = getElement(elementId);

    if (!element) return;

    element.classList.add("hidden");

};

const setText = (elementId, text) => {

    const element = getElement(elementId);

    if (!element) return;

    element.textContent = text;

};


const clearHTML = (elementId) => {

    const element = getElement(elementId);

    if (!element) return;

    element.innerHTML = "";

};


const scrollToBottom = (elementId) => {

    const element = getElement(elementId);

    if (!element) return;

    element.scrollTop = element.scrollHeight;

};