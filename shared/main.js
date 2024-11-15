const nav = document.querySelector("nav");
const nav_open = document.querySelector("#nav-mobile-open");
const nav_close = document.querySelector("#nav-mobile-close");
const footer_top = document.querySelector("#footer-top");

const SCROLL_THRESHOLD = 100;

let scrolled = false;
scrolled = (window.scrollY > SCROLL_THRESHOLD);
if (scrolled) {
    footer_top.classList.add("visible");
}

nav_open.addEventListener("click", (e) => {
    nav.classList.add("open");
});

nav_close.addEventListener("click", (e) => {
    nav.classList.remove("open");
});

document.addEventListener("scroll", e => {
    if (window.scrollY > SCROLL_THRESHOLD && !scrolled) {
        scrolled = true;
        footer_top.classList.add("visible");
    } else if (window.scrollY <= SCROLL_THRESHOLD && scrolled) {
        scrolled = false;
        footer_top.classList.remove("visible");
    }
});

footer_top.addEventListener("click", (e) => {
    window.scroll({top: 0, behavior: "smooth"});
});
