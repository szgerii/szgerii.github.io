const swift_options = document.querySelectorAll(".swift-option");

const form = document.querySelector("#prices-form");
const form_success = document.querySelector("#form-success");
const form_fail = document.querySelector("#form-fail");

const field_firstName = document.querySelector("#field-firstName");
const field_lastName = document.querySelector("#field-lastName");
const field_email = document.querySelector("#field-email");
const field_phoneNumber = document.querySelector("#field-phoneNumber");
const field_company = document.querySelector("#field-company");
const field_website = document.querySelector("#field-website");
const field_message = document.querySelector("#field-message");

const design_choice_1 = document.querySelector("#design-choice-1");
const design_choice_2 = document.querySelector("#design-choice-2");
const dev_choice_1 = document.querySelector("#dev-choice-1");
const dev_choice_2 = document.querySelector("#dev-choice-2");
const dev_choice_3 = document.querySelector("#dev-choice-3");

const design_row = document.querySelector("#form-design-row");
const dev_row = document.querySelector("#form-dev-row");

const dev_price_estimate = document.querySelector("#dev-price-estimate");
const design_price_estimate = document.querySelector("#design-price-estimate");
const total_price_estimate = document.querySelector("#total-price-estimate");

const contactLink = document.querySelector("#nav-contact");

let current_dev_btn = null;
let current_design_btn = null;

price_updated();

setup_radio_dev(dev_choice_1);
setup_radio_dev(dev_choice_2);
setup_radio_dev(dev_choice_3);
setup_radio_design(design_choice_1);
setup_radio_design(design_choice_2);

for (const option of swift_options) {
    const category = option.id.split("-")[0];
    const num = option.id[option.id.length - 1];
    const radioBtn = document.querySelector(`#${category}-choice-${num}`);

    option.addEventListener("click", _ => {
        radioBtn.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        radioBtn.click();
    });
}

contactLink.addEventListener("click", (e) => {
    if (nav.classList.contains("open")) {
        nav.classList.remove("open");
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let radio_dev = form.querySelector('input[name="dev-choice"]:checked');
    let radio_design = form.querySelector('input[name="design-choice"]:checked');
    if (radio_dev == null) {
        dev_row.scrollIntoView({block: "center", behavior: "smooth"});
    }
    if (radio_design == null) {
        design_row.scrollIntoView({block: "center", behavior: "smooth"});
    }
    let body = {
        'firstName': field_firstName.value,
        'lastName': field_lastName.value,
        'email': field_email.value,
        'phoneNumber': field_phoneNumber.value,
        'company': field_company.value,
        'website': field_website.value,
        'message': field_message.value,
        'devChoice': radio_dev.value,
        'designChoice': radio_design.value,
    };
    fetch("/api/order", {
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(json => {
        form_sent();
    })
    .catch(err => {
        form_error();
    });
});

function setup_radio_dev(rad) {
    rad.addEventListener("change", (e) => {
        if (current_dev_btn && current_dev_btn != rad.parentElement) {
            current_dev_btn.classList.remove("option-selected");
        }
        rad.parentElement.classList.add("option-selected");
        current_dev_btn = rad.parentElement;
        price_updated();
    });
}

function setup_radio_design(rad) {
    rad.addEventListener("change", (e) => {
        if (current_design_btn && current_design_btn != rad.parentElement) {
            current_design_btn.classList.remove("option-selected");
        }
        rad.parentElement.classList.add("option-selected");
        current_design_btn = rad.parentElement;
        price_updated();
    });
}

function price_updated() {
    let radio_dev = form.querySelector('input[name="dev-choice"]:checked');
    let radio_design = form.querySelector('input[name="design-choice"]:checked');
    if (radio_dev != null) {
        let dev_min = Number(radio_dev.dataset.min);
        let dev_max = Number(radio_dev.dataset.max);
        if (dev_max == -1) {
            dev_price_estimate.innerText = `${dev_min.toLocaleString('en')} Ft-tól`;
        } else {
            dev_price_estimate.innerText = `${dev_min.toLocaleString('en')} - ${dev_max.toLocaleString('en')} Ft`;
        }
        dev_price_estimate.classList.remove("none");
    } else {
        dev_price_estimate.innerText = "Válassz egy opciót";
        dev_price_estimate.classList.add("none");
    }
    if (radio_design != null) {
        let design_min = Number(radio_design.dataset.min);
        let design_max = Number(radio_design.dataset.max);
        if (design_max == -1) {
            design_price_estimate.innerText = `${design_min.toLocaleString('en')} Ft-tól`;
        } else {
            design_price_estimate.innerText = `${design_min.toLocaleString('en')} - ${design_max.toLocaleString('en')} Ft`;
        }
        design_price_estimate.classList.remove("none");
    } else {
        design_price_estimate.innerText = "Válassz egy opciót";
        design_price_estimate.classList.add("none");
    }
    if (radio_dev != null && radio_design != null) {
        let dev_min = Number(radio_dev.dataset.min);
        let dev_max = Number(radio_dev.dataset.max);
        let design_min = Number(radio_design.dataset.min);
        let design_max = Number(radio_design.dataset.max);
        let total_min = dev_min + design_min;
        let total_max = dev_max + design_max;
        if (dev_max == -1 || design_max == -1) {
            total_price_estimate.innerText = `${total_min.toLocaleString('en')} Ft-tól`;
        } else {
            total_price_estimate.innerText = `${total_min.toLocaleString('en')} - ${total_max.toLocaleString('en')} Ft`;
        }
        total_price_estimate.classList.remove("none");
    } else {
        total_price_estimate.innerText = "Válassz a csomagok közül";
        total_price_estimate.classList.add("none");
    }
}

function form_sent() {
    form.classList.add("disabled");
    form_success.classList.remove("disabled");
}

function form_error() {
    form.classList.add("disabled");
    form_fail.classList.remove("disabled");
}
