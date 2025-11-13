// Sample questions array (populate / expand from the PDF)
const QUESTIONS = [
  {
    id: 1,
    category: "theory",
    title: "Is JavaScript dynamically typed or statically typed?",
    answer: "JavaScript is a dynamically typed language (type checks happen at runtime).",
    source: "PDF"
  },
  {
    id: 2,
    category: "theory",
    title: "What are JavaScript primitive datatypes?",
    answer: "String, number, boolean, null, undefined, bigint, symbol.",
    source: "PDF"
  },
  {
    id: 3,
    category: "output",
    title: "Explain hoisting.",
    answer: "Hoisting moves declarations to the top of the scope; let/const are hoisted but uninitialized (TDZ).",
    source: "PDF"
  },
  {
    id: 4,
    category: "problems",
    title: "Difference between slice() and splice()",
    answer: "slice returns a new array and does not modify original; splice modifies the array.",
    source: "PDF"
  },
  {
    id: 5,
    category: "react",
    title: "What is React.memo?",
    answer: "React.memo memoizes functional components to avoid unnecessary re-renders.",
    source: "PDF"
  },
  {
    id: 6,
    category: "angular",
    title: "How to display dynamic HTML in Angular safely?",
    answer: "Use [innerHTML] binding and DomSanitizer when trusting content. See PDF details.",
    source: "PDF"
  }
];

// DOM elements
const accordion = document.getElementById('questionsAccordion');
const searchInput = document.getElementById('searchInput');
const totalCount = document.getElementById('totalCount');
const progressBar = document.getElementById('progressBar');
const noResults = document.getElementById('noResults');
const sidebarFilters = document.querySelectorAll('.list-group-item');

// state
let visibleQuestions = [...QUESTIONS];
let answered = new Set();

// render function
function renderQuestions(list){
  accordion.innerHTML = '';
  if(!list.length){ noResults.classList.remove('d-none'); totalCount.textContent = 0; return; }
  noResults.classList.add('d-none');
  totalCount.textContent = list.length;

  list.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = 'accordion-item mb-2';
    item.innerHTML = `
      <h2 class="accordion-header" id="heading${q.id}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${q.id}">
          <div class="me-3 badge bg-primary bg-opacity-10 text-primary">${q.category}</div>
          <div>
            <div class="fw-semibold">${q.title}</div>
            <small class="text-muted">${q.source}</small>
          </div>
        </button>
      </h2>
      <div id="collapse${q.id}" class="accordion-collapse collapse" data-bs-parent="#questionsAccordion">
        <div class="accordion-body">
          <div>${q.answer}</div>
          <div class="mt-3 d-flex gap-2">
            <button class="btn btn-sm btn-outline-success mark-know" data-id="${q.id}">Mark Known</button>
            <button class="btn btn-sm btn-outline-secondary mark-unknown" data-id="${q.id}">Mark Review</button>
          </div>
        </div>
      </div>
    `;
    accordion.appendChild(item);
  });

  // attach mark handlers
  document.querySelectorAll('.mark-know').forEach(btn => {
    btn.addEventListener('click', e => {
      answered.add(Number(e.target.dataset.id));
      updateProgress();
      e.target.classList.remove('btn-outline-success');
      e.target.classList.add('btn-success');
      e.target.textContent = 'Known';
    });
  });
  document.querySelectorAll('.mark-unknown').forEach(btn => {
    btn.addEventListener('click', e => {
      answered.delete(Number(e.target.dataset.id));
      updateProgress();
      // visual feedback
      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('btn-warning');
      btn.textContent = 'Review';
    });
  });
}

// search
searchInput.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  visibleQuestions = QUESTIONS.filter(item => {
    return item.title.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });
  renderQuestions(visibleQuestions);
});

// sidebar filter
sidebarFilters.forEach(link => {
  link.addEventListener('click', (ev) => {
    ev.preventDefault();
    sidebarFilters.forEach(l => l.classList.remove('active'));
    ev.currentTarget.classList.add('active');
    const filter = ev.currentTarget.dataset.filter;
    if(filter === 'all') {
      visibleQuestions = [...QUESTIONS];
    } else {
      visibleQuestions = QUESTIONS.filter(q => q.category === filter);
    }
    renderQuestions(visibleQuestions);
  });
});

// progress update
function updateProgress(){
  const total = QUESTIONS.length;
  const known = answered.size;
  const pct = Math.round((known / total) * 100);
  progressBar.style.width = pct + '%';
  progressBar.textContent = pct + '%';
}

// quick quiz (simple)
document.getElementById('quizBtn').addEventListener('click', () => {
  // open a simple prompt quiz mode: show one random question title and prompt user to type answer
  const rand = QUESTIONS[Math.floor(Math.random()*QUESTIONS.length)];
  const user = prompt("Quick quiz — write short answer:\n\n" + rand.title);
  if(user !== null) {
    const correct = confirm("Show correct answer?");
    if(correct) alert("Answer:\n\n" + rand.answer);
  }
});

// initial render
renderQuestions(visibleQuestions);
updateProgress();
