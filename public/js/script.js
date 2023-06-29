const questionButtons1 = document.getElementById("questionButton1");
const questionContainer1 = document.getElementById("questionContainer1");
const questionButtons2 = document.getElementById("questionButton2");
const questionContainer2 = document.getElementById("questionContainer2");
const questionButtons3 = document.getElementById("questionButton3");
const questionContainer3 = document.getElementById("questionContainer3");
const questionButtons4 = document.getElementById("questionButton4");
const questionContainer4 = document.getElementById("questionContainer4");
const questionButtons5 = document.getElementById("questionButton5");
const questionContainer5 = document.getElementById("questionContainer5");
const questionButtons6 = document.getElementById("questionButton6");
const questionContainer6 = document.getElementById("questionContainer6");
const treeStructure = document.querySelector(".tree-structure");
const closeBtn1 = document.getElementById("closeBtn1");
const closeBtn2 = document.getElementById("closeBtn2");
const closeBtn3 = document.getElementById("closeBtn3");
const closeBtn4 = document.getElementById("closeBtn4");
const closeBtn5 = document.getElementById("closeBtn5");
const closeBtn6 = document.getElementById("closeBtn6");
const zoomInButton = document.getElementById("zoomInButton");
const zoomOutButton = document.getElementById("zoomOutButton");
// VARIABLES
let scale = 1;
let isDragging = false;
let dragStartX, dragStartY;
let offsetX = 0,
  offsetY = 0;
let navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 0) {
    navbar.classList.add("shadow");
  } else {
    navbar.classList.remove("shadow");
  }
});

// TOGGLE BUTTON
questionButtons1.addEventListener("click", () => {
  questionContainer1.classList.add("active");
});

questionButtons2.addEventListener("click", () => {
  questionContainer2.classList.add("active");
});

questionButtons3.addEventListener("click", () => {
  questionContainer3.classList.add("active");
});

questionButtons4.addEventListener("click", () => {
  questionContainer4.classList.add("active");
});

questionButtons5.addEventListener("click", () => {
  questionContainer5.classList.add("active");
});

questionButtons6.addEventListener("click", () => {
  questionContainer6.classList.add("active");
});

// CLOSE EVENT LISTENER
closeBtn1.addEventListener("click", () => {
  questionContainer1.classList.remove("active");
});

closeBtn1.addEventListener("click", () => {
  questionContainer1.classList.remove("active");
});

closeBtn2.addEventListener("click", () => {
  questionContainer2.classList.remove("active");
});

closeBtn3.addEventListener("click", () => {
  questionContainer3.classList.remove("active");
});

closeBtn4.addEventListener("click", () => {
  questionContainer4.classList.remove("active");
});

closeBtn5.addEventListener("click", () => {
  questionContainer5.classList.remove("active");
});

closeBtn6.addEventListener("click", () => {
  questionContainer6.classList.remove("active");
});

// GENDER TOGGLE 
function toggleGenderButtons(span) {
  const spans = span.parentNode.querySelectorAll('span');

  spans.forEach((s) => {
    s.classList.remove('activate');
  });

  span.classList.add('activate');
}

const genderButtons = document.querySelectorAll('.button-div1 span');
genderButtons.forEach((span) => {
  span.addEventListener('click', function () {
    toggleGenderButtons(this);
  });
});



// DRAGGING
treeStructure.addEventListener("mousedown", (event) => {
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

treeStructure.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const dragX = event.clientX - dragStartX;
  const dragY = event.clientY - dragStartY;

  offsetX += dragX;
  offsetY += dragY;

  treeStructure.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

treeStructure.addEventListener("mouseup", () => {
  isDragging = false;
});

treeStructure.addEventListener("mouseleave", () => {
  isDragging = false;
});

// ZOOM-IN AND ZOOM-OUT BUTTON FUNCTIONS

zoomInButton.addEventListener("click", () => {
  scale += 0.1;
  treeStructure.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
});

zoomOutButton.addEventListener("click", () => {
  scale -= 0.1;
  treeStructure.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
});
