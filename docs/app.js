document.addEventListener('DOMContentLoaded',()=>{
  AOS.init();

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href').substring(1);
      const el=document.getElementById(id);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}
    });
  });

  // load data sections
  fetch('data/races.json').then(r=>r.json()).then(renderRaces);
  fetch('data/cataclysms.json').then(r=>r.json()).then(renderCataclysms);
  fetch('data/missions.json').then(r=>r.json()).then(renderMissions);

  // form handler
  const form=document.getElementById('signup-form');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const data=Object.fromEntries(new FormData(form).entries());
      console.log('signup',data);
      form.reset();
      document.getElementById('form-msg').classList.remove('hidden');
    });
  }

  // faq accordion
  document.querySelectorAll('[data-accordion]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const tgt=document.getElementById(btn.getAttribute('aria-controls'));
      const exp=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',!exp);
      tgt.classList.toggle('hidden');
    });
  });
});

function renderRaces(races){
  const grid=document.getElementById('races-grid');
  races.forEach(r=>{
    const card=document.createElement('div');
    card.className='glass p-4 rounded transition-all hover:-translate-y-1 btn-glow';
    card.innerHTML=`<h3 class="font-bold text-lg mb-2" style="color:${r.color}">${r.name}</h3>
    <p class="mb-2 text-sm">${r.description}</p>
    <ul class="text-sm list-disc list-inside">${r.abilities.map(a=>`<li>${a}</li>`).join('')}</ul>`;
    card.setAttribute('data-aos','fade-up');
    grid.appendChild(card);
  });
}
function renderCataclysms(cats){
  const grid=document.getElementById('cataclysms-grid');
  cats.forEach(c=>{
    const card=document.createElement('div');
    card.className='glass p-4 rounded transition-all hover:-translate-y-1 btn-glow';
    card.innerHTML=`<h3 class="font-bold text-lg mb-2">${c.name}</h3>
    <p class="text-sm mb-1">${c.description}</p>
    <p class="text-xs text-cyan-300">Фаворит: ${c.favoredRaceId}</p>`;
    card.setAttribute('data-aos','fade-up');
    grid.appendChild(card);
  });
}
function renderMissions(missions){
  const grid=document.getElementById('missions-grid');
  missions.forEach(m=>{
    const card=document.createElement('div');
    card.className='glass p-4 rounded transition-all hover:-translate-y-1 btn-glow flex flex-col';
    card.innerHTML=`<h3 class="font-bold text-lg mb-2">${m.title}</h3>
    <p class="text-sm mb-2 flex-1">${m.description}</p>
    <span class="text-xs text-cyan-300">рекомендовано ${m.optimalRange[0]}–${m.optimalRange[1]} очков</span>`;
    card.setAttribute('data-aos','fade-up');
    grid.appendChild(card);
  });
}
