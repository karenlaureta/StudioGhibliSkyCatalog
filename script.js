const enterBtn = document.getElementById('enter');
const backBtn = document.getElementById('back-home');
const home = document.getElementById('home');
const catalog = document.getElementById('catalog');
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('search');
const filter1Select = document.getElementById('filter1');
const filter2Select = document.getElementById('filter2');
const filter1Label = document.getElementById('filter1-label');
const filter2Label = document.getElementById('filter2-label');
const refreshButton = document.getElementById('refresh');
const darkToggle = document.getElementById('dark-toggle');
const container = document.getElementById('film-container');
const modal = document.getElementById('film-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDetails = document.getElementById('modal-details');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.querySelector('.close');
const loader = document.getElementById('catalog-loader');
const bgm = document.getElementById('bgm');
const leftPupil = document.querySelector('#left-eye .pupil');
const rightPupil = document.querySelector('#right-eye .pupil');
const fly = document.getElementById('overlay-right');

/* =========================
       IMAGE MAPS
========================= */
const imageMaps = {
  people: {"Haku":"images/haku.jpg","Pazu":"images/Pazu.jpg","Lusheeta Toel Ul Laputa":"images/lusheeta.jpg","Captain Dola":"images/dola.jpg","Romska Palo Ul Laputa":"images/romska.jpg","Uncle Pom":"images/pom.jpg","General Mouro":"images/mauro.jpg","Duffi":"images/duffi.jpg","Louis":"images/louis.jpg","Charles":"images/charles.jpg","Henri":"images/henri.jpeg","Motro":"images/motro.jpg","Okami":"images/okami.jpg","Ashitaka":"images/ashitaka.jpg","San":"images/san.jpg","Eboshi":"images/eboshi.jpg","Jigo":"images/jigo.jpg","Kohroku":"images/kohroku.jpg","Gonza":"images/gonza.jpg","Hii-sama":"images/sama.jpg","Yakul":"images/yakul.jpg","Shishigami":"images/shishigami.jpg","Moro":"images/moro.jpg","Jiji":"images/jiji.jpg","Satsuki Kusakabe":"images/satsuki.jpg","Mei Kusakabe":"images/mei.jpg","Tatsuo Kusakabe":"images/tatsuo.jpg","Yasuko Kusakabe":"images/yasuko.jpg","Granny":"images/granny.jpg","Kanta Ōgaki":"images/kanta.jpg","Totoro":"images/totoro.jpg","Chu Totoro":"images/chu.jpg","Chibi Totoro":"images/chibi.gif","Catbus":"images/catbus.jpg","Niya":"images/niya.jpg","Renaldo Moon aka Moon aka Muta":"images/renaldo.jpg","Cat King":"images/catking.jpg","Yuki":"images/yuki.jpg","Haru":"images/haru.jpg","Baron Humbert von Gikkingen":"images/baron.jpg","Natori":"images/natori.jpg","Colonel Muska":"images/muska.jpg","Porco Rosso":"images/porco.png","Sosuke":"images/sosuke.jpg","Kiki":"images/kiki.jpg","Laputian Robot":"images/robot.jpg","Chihiro Ogino":"images/chihiro.jpg","Osono":"images/osono.jpg","Ursula":"images/ursula.jpg","Tombo":"images/tombo.jpg","Madame":"images/madame.jpg","Earwig":"images/earwig.jpg","Bella Yaga":"images/bella.jpg","Mandrake":"images/mandrake.jpg","Scarlet Rose":"images/scarlet.jpg","Thomas":"images/thomas.jpg","Custard":"images/custard.jpg",},
  locations: {"Irontown":"images/irontown.jpg","Gutiokipanja":"images/gut.jpg","The Cat Kingdom":"images/catdom.jpg","The Marsh House":"images/marsh.jpg","Hospital":"images/hospi.jpg","Gondoa":"images/gondoa.jpg","Ursula's Log Cabin":"images/log.jpg","Zeniba's Cottage":"images/cottage.jpg","Bamboo Forest":"images/bamboo.jpg","Pazu's Mines":"images/mines.jpeg","Shizuku's Apartment":"images/apartment.jpg","Laputa":"images/laputa.jpg","Tedis":"images/tedus.jpg","Koriko":"images/koriko.jpg","Forest":"images/forest.jpg","Bathhouse":"images/bath.png","Matsugo":"images/matsugo.jpg","Taeko's House":"images/taeko.jpg","Piccolo S.P.A.":"images/spa.jpg","Karikiya":"images/karikiya.jpg","Satsuki's School House":"images/school.jpg","Fujimoto's Underwater Harbor":"images/fuji.jpg","Himawari Nursery School":"images/himawari.jpg","Ingary":"images/ingary.jpg","St. Morwald's Home for Children":"images/morwald.jpg",},
  species: {"Human":"images/human.jpg","Deer":"images/deer.jpg","Spirit":"images/spirit.jpg","God":"images/god.jpg","Cat":"images/cats.jpg","Totoro":"images/totoros.jpg","Dragon":"images/dragon.jpg",},
  vehicles: {"Air Destroyer Goliath":"images/gol.jpg","Red Wing":"images/wing.jpg","Sosuke's Boat":"images/boat.jpg",}};

let allData = {films:[], people:[], locations:[], species:[], vehicles:[]};
let activeCategory = 'films';
let favorites = JSON.parse(localStorage.getItem('ghibliFavorites') || '[]');
let favoriteOrder = JSON.parse(localStorage.getItem('ghibliFavoriteOrder') || '[]');

/* Pagination */
let currentPage = 1;
const itemsPerPage = 10;

/* ---------------- Event Listeners ---------------- */
enterBtn.addEventListener('click', () => {
  bgm.play().catch(err => console.log("Audio play blocked:", err));
  home.style.opacity = 0;
  setTimeout(() => {
    home.style.display = 'none';
    catalog.style.display = 'block';
    setTimeout(() => catalog.style.opacity = 1, 50);
    fetchAllCategories();
  }, 1000);
});

backBtn.addEventListener('click', () => {
  // Fade out catalog
  catalog.style.opacity = 0;

  setTimeout(() => {
    catalog.style.display = 'none';
    catalog.classList.add('hidden');

    // Show and fade in home
    home.style.display = 'flex'; // match your #home flex layout
    setTimeout(() => {
      home.style.opacity = 1;
    }, 50);
  }, 500); // fade-out duration

  // Stop background music
  bgm.pause();
  bgm.currentTime = 0;
});

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

tabs.forEach(tab => tab.addEventListener('click', () => displayCategory(tab.dataset.category)));
searchInput.addEventListener('input', () => { currentPage = 1; showSpinner(); filterCategory(); });
filter1Select.addEventListener('change', () => { currentPage = 1; showSpinner(); filterCategory(); });
filter2Select.addEventListener('change', () => { currentPage = 1; showSpinner(); filterCategory(); });
refreshButton.addEventListener('click', () => fetchAllCategories());

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    showSpinner();
    activeCategory === 'favorites' ? displayFavorites() : filterCategory();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  currentPage++;
  showSpinner();
  activeCategory === 'favorites' ? displayFavorites() : filterCategory();
});

/* Close modal */
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
});
window.addEventListener('click', e => {
  if(e.target === modal){
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
});

function showSpinner() {
  loader.classList.remove('hidden');
}

function hideSpinner() {
  loader.classList.add('hidden');
}

/* ---------------- Fetch Data ---------------- */
async function fetchAllCategories() {
  showSpinner();
  const endpoints = ['films','people','locations','species','vehicles'];
  for(const ep of endpoints){
    try{
      const resp = await fetch(`https://ghibliapi.vercel.app/${ep}`);
      allData[ep] = resp.ok ? await resp.json() : [];
    } catch(e){ allData[ep] = []; console.warn(e); }
  }
  displayCategory('films');
}

/* ---------------- Display Category ---------------- */
function displayCategory(cat){
  activeCategory = cat;
  currentPage = 1;

  tabs.forEach(t=>{
    t.classList.remove('active','favorites-active');
    if(t.dataset.category===cat){
      t.classList.add(cat==='favorites'?'favorites-active':'active');
    }
  });

  document.getElementById('fav-sort').classList.toggle('hidden',cat!=='favorites');
  document.getElementById('export-favs').classList.toggle('hidden',cat!=='favorites');

  if(cat==='favorites'){
    filter1Label.textContent='';
    filter2Label.textContent='';
    filter1Select.innerHTML='';
    filter2Select.innerHTML='';
    searchInput.value='';
    displayFavorites();
    return;
  }

  populateFilters(cat);
  filterCategory();
}


/* ---------------- Filters ---------------- */
function populateFilters(cat){
  const items = allData[cat] || [];
  let f1=[], f2=[];
  if(cat==='films'){ f1=[...new Set(items.map(i=>i.director))].sort(); f2=[...new Set(items.map(i=>i.release_date))].sort(); filter1Label.textContent="Director:"; filter2Label.textContent="Year:";}
  else if(cat==='people'){ f1=[...new Set(items.map(i=>i.gender))].filter(Boolean).sort(); f2=[...new Set(items.map(i=>i.age))].filter(Boolean).sort(); filter1Label.textContent="Gender:"; filter2Label.textContent="Age:";}
  else if(cat==='locations'){ f1=[...new Set(items.map(i=>i.climate))].filter(Boolean).sort(); f2=[...new Set(items.map(i=>i.terrain))].filter(Boolean).sort(); filter1Label.textContent="Climate:"; filter2Label.textContent="Terrain:";}
  else if(cat==='species'){ f1=[...new Set(items.map(i=>i.classification))].filter(Boolean).sort(); f2=[...new Set(items.map(i=>i.eye_colors))].filter(Boolean).sort(); filter1Label.textContent="Classification:"; filter2Label.textContent="Eye Colors:";}
  else{ f1=[]; f2=[]; filter1Label.textContent=""; filter2Label.textContent="";}
  filter1Select.innerHTML='<option value="">All</option>'; f1.forEach(v=>filter1Select.innerHTML+=`<option value="${v}">${v}</option>`);
  filter2Select.innerHTML='<option value="">All</option>'; f2.forEach(v=>filter2Select.innerHTML+=`<option value="${v}">${v}</option>`);
}

/* ---------------- Filter + Pagination ---------------- */
function filterCategory(){
  const query = searchInput.value.toLowerCase();
  const f1 = filter1Select.value;
  const f2 = filter2Select.value;
  let items = (allData[activeCategory]||[]).filter(item=>{
    let name = (item.title||item.name||'').toLowerCase();
    let cond1 = true, cond2 = true;
    if(activeCategory==='films'){cond1=f1===''||item.director===f1; cond2=f2===''||item.release_date===f2;}
    else if(activeCategory==='people'){cond1=f1===''||item.gender===f1; cond2=f2===''||item.age===f2;}
    else if(activeCategory==='locations'){cond1=f1===''||item.climate===f1; cond2=f2===''||item.terrain===f2;}
    else if(activeCategory==='species'){cond1=f1===''||item.classification===f1; cond2=f2===''||item.eye_colors===f2;}
    return name.includes(query)&&cond1&&cond2;
  });

  const totalPages = Math.ceil(items.length/itemsPerPage);
  if(currentPage>totalPages) currentPage = totalPages || 1;
  const start=(currentPage-1)*itemsPerPage; const end=start+itemsPerPage;
  displayCategoryWithData(activeCategory, items.slice(start,end));
  document.getElementById('page-info').textContent = `Page ${currentPage}/${totalPages || 1}`;
}

/* ---------------- Display Cards ---------------- */
function displayCategoryWithData(cat, items){
  hideSpinner();
  container.innerHTML=''; // remove spinner
  if(!items.length){ container.innerHTML='<p>No items found.</p>'; return; }

  items.forEach(item=>{
    const card = document.createElement('div'); card.classList.add('film-card');
let img = 'fallback.jpg'; // default fallback
if(cat === 'films') img = item.image || item.movie_banner || img;
else if(cat === 'people') img = imageMaps.people[item.name] || 'people.jpg';
else if(cat === 'locations') img = imageMaps.locations[item.name] || 'location.jpg';
else if(cat === 'species') img = imageMaps.species[item.name] || 'species.jpg';
else if(cat === 'vehicles') img = imageMaps.vehicles[item.name] || 'vehicle.jpg';
    let favClass = favorites.includes(item.id) ? '❤️' : '🤍';
    card.innerHTML = `<div class="favorite-btn">${favClass}</div>
      <img src="${img}" alt="${item.title||item.name}">
      <div class="content"><h2>${item.title||item.name}</h2>
      </div>`;
    
    card.querySelector('.favorite-btn').addEventListener('click', (e)=>{
      e.stopPropagation();
      toggleFavorite(item.id, e.target);
    });

    card.addEventListener('click', ()=>openModal(item, img, cat));
    container.appendChild(card);
  });
}

function toggleFavorite(id, btn) {
  const isFav = favorites.includes(id);

  if (isFav) {
    favorites = favorites.filter(i => i !== id);
    favoriteOrder = favoriteOrder.filter(i => i !== id);
  } else {
    favorites.push(id);
    favoriteOrder.push(id);
  }

  // Update button visual immediately
  btn.textContent = favorites.includes(id) ? '❤️' : '🤍';

  // Animate
  btn.classList.add('animate');
  setTimeout(() => btn.classList.remove('animate'), 300);

  // Persist
  localStorage.setItem('ghibliFavorites', JSON.stringify(favorites));
  localStorage.setItem('ghibliFavoriteOrder', JSON.stringify(favoriteOrder));
}



/* ---------------- Modal ---------------- */
async function openModal(item, img, cat){
  modal.classList.toggle('favorites-modal', activeCategory === 'favorites');
  modal.classList.add('show');
  modal.style.display='flex';
  modal.setAttribute('aria-hidden','false');
  modalImg.src = img || 'images/fallback.jpg';
  modalTitle.textContent = item.title || item.name || 'Unknown';
  modalDetails.innerHTML=''; modalDescription.textContent = item.description || '';

  function addRow(label, value){
    if(!value) return;
    const row = document.createElement('div'); row.className='detail-row';
    row.innerHTML = `<div class="detail-label">${label}</div><div class="detail-value">${value}</div>`;
    modalDetails.appendChild(row);
  }

  if(cat==='films'){ addRow('Original Title:', item.original_title); addRow('Original Title Romanised:', item.original_title_romanised); addRow('Director:', item.director); addRow('Producer:', item.producer); addRow('Release Date:', item.release_date); addRow('Rating:', item.rt_score);}
  else if(cat==='people'){ addRow('Gender:', item.gender); addRow('Age', item.age); addRow('Hair Color:', item.hair_color); addRow('Eye Color:', item.eye_color);}
  else if(cat==='locations'){ addRow('Climate:', item.climate); addRow('Terrain:', item.terrain); addRow('Surface Water:', item.surface_water);}
  else if(cat==='species'){ addRow('Classification:', item.classification); addRow('Eye Colors:', item.eye_colors); addRow('Hair Colors:', item.hair_colors);}
  else if(cat==='vehicles'){ addRow('Vehicle Class:', item.vehicle_class); addRow('Length:', item.length);}
}

/* ---------------- Sparkles (cursor & modal) ---------------- */
const sparkleColors = ['#ff8cf0','#ffec6a','#6af3ff','#f07aff','#7eff6a'];
let mouseSparkles = [];
document.addEventListener('mousemove', e => {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.width = sparkle.style.height = (Math.random() * 6 + 4) + 'px';
  sparkle.style.background = sparkleColors[Math.floor(Math.random()*sparkleColors.length)];
  sparkle.dataset.angle = Math.random()*360;
  sparkle.dataset.radius = Math.random()*30+20;
  sparkle.dataset.centerX = e.clientX;
  sparkle.dataset.centerY = e.clientY;
  document.body.appendChild(sparkle);
  mouseSparkles.push(sparkle);
  if(mouseSparkles.length>30) mouseSparkles.shift().remove();
});
function animateMouseSparkles(){
  mouseSparkles.forEach(s=>{
    let angle = parseFloat(s.dataset.angle);
    let radius = parseFloat(s.dataset.radius);
    let cx = parseFloat(s.dataset.centerX);
    let cy = parseFloat(s.dataset.centerY);
    angle += 0.5; s.dataset.angle=angle;
    const rad = angle * Math.PI/180;
    s.style.left = cx + Math.cos(rad)*radius + 'px';
    s.style.top = cy + Math.sin(rad)*radius + 'px';
    s.style.opacity = 0.6 + 0.4*Math.sin(rad*2);
  });
  requestAnimationFrame(animateMouseSparkles);
}
animateMouseSparkles();

let modalSparkles = [];
const modalContent = document.querySelector('.modal-content');
modalContent.addEventListener('mousemove', e => {
  const sparkle = document.createElement('div');
  sparkle.className='modal-sparkle';
  sparkle.style.width = sparkle.style.height = (Math.random()*6+4)+'px';
  sparkle.style.background = sparkleColors[Math.floor(Math.random()*sparkleColors.length)];
  sparkle.dataset.angle = Math.random()*360;
  sparkle.dataset.radius = Math.random()*20+10;
  sparkle.dataset.centerX = e.offsetX;
  sparkle.dataset.centerY = e.offsetY;
  modalContent.appendChild(sparkle);
  modalSparkles.push(sparkle);
  if(modalSparkles.length>30) modalSparkles.shift().remove();
});
function animateModalSparkles(){
  modalSparkles.forEach(s=>{
    let angle = parseFloat(s.dataset.angle);
    let radius = parseFloat(s.dataset.radius);
    let cx = parseFloat(s.dataset.centerX);
    let cy = parseFloat(s.dataset.centerY);
    angle += 1; s.dataset.angle = angle;
    const rad = angle * Math.PI/180;
    s.style.left = cx + Math.cos(rad)*radius + 'px';
    s.style.top = cy + Math.sin(rad)*radius + 'px';
    s.style.opacity = 0.5 + 0.5*Math.sin(rad*2);
  });
  requestAnimationFrame(animateModalSparkles);
}
animateModalSparkles();

/* ================= MOON GLOW INTERACTION ================= */
const moonGlow = document.getElementById('moon-glow');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 3;
let currentX = targetX;
let currentY = targetY;

document.addEventListener('mousemove', (e) => {
  if (!document.body.classList.contains('dark')) return;
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateMoonGlow() {
  if (document.body.classList.contains('dark')) {
  const mistPulse = 1 + Math.sin(Date.now() * 0.001) * 0.05;
  moonGlow.style.transform += ` scale(${mistPulse})`;
}
  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;

  moonGlow.style.transform =
    `translate(${currentX - 170}px, ${currentY - 170}px)`;

  requestAnimationFrame(animateMoonGlow);
}
animateMoonGlow();

/* ================= STAR GENERATOR ================= */
const starfield = document.getElementById('starfield');
const STAR_COUNT = 120;

function createStars() {
  starfield.innerHTML = '';
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    starfield.appendChild(star);
  }
}

createStars();

/* ================= STAR ↔ FOG INTERACTION ================= */
let fogPulse = 0;

function animateStarFog() {
  if (!document.body.classList.contains('dark')) {
    starfield.style.opacity = 0;
    requestAnimationFrame(animateStarFog);
    return;
  }

  fogPulse += 0.01;
  const fogFactor = 0.75 + Math.sin(fogPulse) * 0.15;

  starfield.style.opacity = fogFactor;

  requestAnimationFrame(animateStarFog);
}

animateStarFog();


/* ================= FIRELY SPIRITS ================= */
function createFirefly(cloud) {
  const firefly = document.createElement('div');
  firefly.className = 'firefly';

  firefly.style.left = Math.random() * 100 + '%';
  firefly.style.top = Math.random() * 60 + '%';

  firefly.dataset.speed = 0.2 + Math.random() * 0.4;
  firefly.dataset.phase = Math.random() * 360;

  cloud.appendChild(firefly);

  return firefly;
}

const clouds = document.querySelectorAll('.cloud');
let fireflies = [];

clouds.forEach(cloud => {
  for (let i = 0; i < 5; i++) {
    fireflies.push(createFirefly(cloud));
  }
});

function animateFireflies() {
  fireflies.forEach(f => {
    let phase = parseFloat(f.dataset.phase);
    phase += parseFloat(f.dataset.speed);
    f.dataset.phase = phase;

    const rad = phase * Math.PI / 180;
    f.style.transform =
      `translate(${Math.cos(rad) * 8}px, ${Math.sin(rad * 4) * 4}px)`;

    f.style.opacity = 0.4 + Math.sin(rad) * 0.4;
  });

  requestAnimationFrame(animateFireflies);
}

animateFireflies();

function displayFavorites() {
  hideSpinner();
  container.innerHTML = '';

  const sortMode = document.getElementById('fav-sort').value;

  // Collect favorites
  const favItems = [];
  for (const cat in allData) {
    allData[cat].forEach(item => {
      if (favorites.includes(item.id)) {
        favItems.push({ ...item, __category: cat });
      }
    });
  }

  if (!favItems.length) {
    container.innerHTML = '<p>No favorites yet 💔</p>';
    pageInfo(1, 1);
    return;
  }

  // Preserve custom order
  favItems.sort(
    (a, b) =>
      favoriteOrder.indexOf(a.id) - favoriteOrder.indexOf(b.id)
  );

  if (sortMode === 'category') {
    renderFavoritesByCategory(favItems);
  } else {
    paginateAndRender(favItems, true);
  }
}

function paginateAndRender(items,isFavorites=false){
  const totalPages=Math.ceil(items.length/itemsPerPage);
  if(currentPage>totalPages) currentPage=totalPages;

  const start=(currentPage-1)*itemsPerPage;
  const pageItems=items.slice(start,start+itemsPerPage);

  pageItems.forEach(item=>{
    renderCard(item,item.__category,true);
  });

  pageInfo(currentPage,totalPages);
}

function pageInfo(c,t){
  document.getElementById('page-info').textContent=`Page ${c}/${t}`;
}

function renderCard(item, cat, isFav = false, returnOnly = false) {
  const card=document.createElement('div');
  card.className='film-card';
  card.draggable=isFav;

  let img='fallback.jpg';
  if(cat==='films') img=item.image||item.movie_banner||img;
  else if(cat==='people') img=imageMaps.people[item.name]||img;
  else if(cat==='locations') img=imageMaps.locations[item.name]||img;
  else if(cat==='species') img=imageMaps.species[item.name]||img;
  else if(cat==='vehicles') img=imageMaps.vehicles[item.name]||img;

  card.innerHTML=`
    <div class="favorite-btn">❤️</div>
    <img src="${img}">
    <div class="content">
      <h2>${item.title||item.name}</h2>
      ${isFav?`<p style="opacity:.6">${cat.toUpperCase()}</p>`:''}
    </div>
  `;

  const favBtn=card.querySelector('.favorite-btn');
  favBtn.onclick=e=>{
    e.stopPropagation();
    toggleFavorite(item.id,favBtn);
    if(isFav) displayFavorites();
  };

  card.onclick=()=>openModal(item,img,cat);
  enableDrag(card,item.id);

  if (returnOnly) return card;
container.appendChild(card);
}

function enableDrag(card,id){
  card.addEventListener('dragstart',()=>{
    card.classList.add('dragging');
    card.dataset.dragId=id;
  });

  card.addEventListener('dragend',()=>{
    card.classList.remove('dragging');
    saveOrder();
  });

  container.addEventListener('dragover',e=>{
    e.preventDefault();
    const dragging=document.querySelector('.dragging');
    const after=getDragAfter(e.clientY);
    after?container.insertBefore(dragging,after):container.appendChild(dragging);
  });
}

function getDragAfter(y){
  const els=[...container.querySelectorAll('.film-card:not(.dragging)')];
  return els.reduce((c,el)=>{
    const box=el.getBoundingClientRect();
    const offset=y-box.top-box.height/2;
    return offset<0 && offset>c.offset?{offset,el}:c;
  },{offset:-Infinity}).el;
}

function saveOrder(){
  favoriteOrder=[...container.children].map(c=>c.querySelector('.favorite-btn').onclick?.id).filter(Boolean);
  localStorage.setItem('ghibliFavoriteOrder',JSON.stringify(favoriteOrder));
}

document.getElementById('export-favs').onclick=()=>{
  const data=favorites.map(id=>{
    for(const cat in allData){
      const item=allData[cat].find(i=>i.id===id);
      if(item) return {...item,category:cat};
    }
  });

  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='ghibli-favorites.json';
  a.click();
};

/* ================= FLOATING LANTERNS ================= */

const lanternContainer = document.getElementById('lanterns-container');
let lanternInterval;

/* Detect if lanterns should run */
function lanternsAllowed() {
  return (
    home.style.display !== 'none' ||
    catalog.style.display !== 'none'
  );
}

/* Create one lantern */
function createLantern() {
  if (!lanternContainer || !lanternsAllowed()) return;

  const lantern = document.createElement('div');
  lantern.className = 'lantern';

  const startX = Math.random() * window.innerWidth;
  let y = window.innerHeight + 60;

  lantern.style.left = startX + 'px';
  lantern.style.top = y + 'px';

  const drift = (Math.random() - 0.5) * 0.3;
  const speed = 0.25 + Math.random() * 0.4;
  let phase = Math.random() * 360;

  lanternContainer.appendChild(lantern);

  function floatLantern() {
    phase += 0.35;
    y -= speed;

    lantern.style.transform =
      `translateX(${Math.sin(phase * Math.PI / 180) * 8}px)`;

    lantern.style.top = y + 'px';

    if (y > -80 && lanternsAllowed()) {
      requestAnimationFrame(floatLantern);
    } else {
      lantern.remove();
    }
  }

  floatLantern();
}

/* Start lanterns */
function startLanterns() {
  stopLanterns();
  lanternInterval = setInterval(createLantern, 800);
}

/* Stop lanterns */
function stopLanterns() {
  clearInterval(lanternInterval);
  lanternContainer.innerHTML = '';
}

/* Initial load */
startLanterns();

/* Page navigation handling */
enterBtn.addEventListener('click', () => {
  setTimeout(startLanterns, 600);
});

backBtn.addEventListener('click', () => {
  setTimeout(startLanterns, 600);
});


function renderFavoritesByCategory(items) {
  container.innerHTML = '';

  const grouped = {};

  items.forEach(item => {
    if (!grouped[item.__category]) grouped[item.__category] = [];
    grouped[item.__category].push(item);
  });

  Object.entries(grouped).forEach(([cat, list]) => {
    const section = document.createElement('div');
    section.className = 'fav-category';

    const title = document.createElement('h3');
    title.textContent = cat.toUpperCase();
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'fav-grid';

    list.forEach(item => {
      const card = renderCard(item, cat, true, true);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });

  document.getElementById('page-info').textContent = 'Grouped by Category';
}
const favSortSelect = document.getElementById('fav-sort');

favSortSelect.addEventListener('change', () => {
  if (activeCategory === 'favorites') {
    currentPage = 1;
    displayFavorites();
  }
});
