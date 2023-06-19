let navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 0) {
    navbar.classList.add("shadow");
  } else {
    navbar.classList.remove("shadow");
  }
});
