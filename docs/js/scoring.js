let cataclysms=[];

document.addEventListener('DOMContentLoaded',()=>{
  const catSelect=document.getElementById('calc-cataclysm');
  const inputs={
    mars:document.getElementById('count-mars'),
    saturn:document.getElementById('count-saturn'),
    poly:document.getElementById('count-poly'),
    venus:document.getElementById('count-venus'),
    jupiter:document.getElementById('count-jupiter'),
    predator:document.getElementById('count-predator'),
    alien:document.getElementById('count-alien')
  };
  const checks={
    revealedPredator:document.getElementById('event-revealedPredator'),
    revealedAlien:document.getElementById('event-revealedAlien'),
    infection:document.getElementById('event-infection'),
    killByPredator:document.getElementById('event-killByPredator')
  };

  fetch('data/cataclysms.json').then(r=>r.json()).then(data=>{
    cataclysms=data;
    data.forEach(c=>{
      const o=document.createElement('option');
      o.value=c.id;o.textContent=c.name;catSelect.appendChild(o);
    });
    loadState();
    update();
  });

  const allInputs=[catSelect,...Object.values(inputs),...Object.values(checks)];
  allInputs.forEach(el=>{
    const evt=el.type==='checkbox'?'change':'input';
    el.addEventListener(evt,()=>{update();saveState();});
  });

  document.getElementById('copy-result').addEventListener('click',()=>{
    const text=document.getElementById('score-text').textContent+'; '+document.getElementById('mission-result').textContent;
    navigator.clipboard.writeText(text);
  });

  function saveState(){
    const state={cataclysm:catSelect.value,counts:{},events:{}};
    for(const k in inputs) state.counts[k]=Number(inputs[k].value)||0;
    for(const k in checks) state.events[k]=checks[k].checked;
    localStorage.setItem('rasCalc',JSON.stringify(state));
  }
  function loadState(){
    const saved=localStorage.getItem('rasCalc');
    if(!saved) return;
    try{
      const state=JSON.parse(saved);
      if(state.cataclysm) catSelect.value=state.cataclysm;
      for(const k in inputs) if(state.counts&&state.counts[k]!=null) inputs[k].value=state.counts[k];
      for(const k in checks) if(state.events&&state.events[k]) checks[k].checked=true;
    }catch(e){}
  }

  function update(){
    const counts={};for(const k in inputs) counts[k]=Number(inputs[k].value)||0;
    const events={};for(const k in checks) events[k]=checks[k].checked;
    const selected=cataclysms.find(c=>c.id===catSelect.value);
    const favored=selected?selected.favoredRaceId:null;

    const teamSize=Object.values(counts).reduce((a,b)=>a+b,0);
    document.getElementById('team-size').textContent=teamSize;

    let teamPoints=0;let missionSuccess=false;let hint='';
    if(counts.predator>0||counts.alien>0){
      teamPoints=-10;missionSuccess=false;hint='Уберите предателей: сейчас автопровал −10';
    }else{
      const favoredCount=favored?counts[favored]||0:0;
      const neutralsTotal=counts.mars+counts.saturn+counts.poly+counts.venus;
      const neutrals=neutralsTotal-favoredCount;
      const bonusJupiter=counts.jupiter>0?1:0;
      teamPoints=favoredCount*2+neutrals+bonusJupiter;
      missionSuccess=teamPoints>=15;
      if(teamPoints<15) hint='Добавьте фаворита катаклизма';
      else if(teamPoints>25) hint='Слишком много очков';
      else hint='Состав оптимален';
    }

    const bar=document.getElementById('score-bar');
    const width=Math.max(0,Math.min(teamPoints,25))/25*100;
    bar.style.width=width+'%';
    bar.className='h-3 rounded '+(teamPoints<15?'bg-red-500':teamPoints<20?'bg-yellow-400':'bg-green-500');

    document.getElementById('score-text').textContent='Очки состава: '+teamPoints;
    document.getElementById('score-hint').textContent=hint;
    document.getElementById('mission-result').textContent=missionSuccess?'Бонус миссии: +5':'Бонус миссии: -2';

    let extra=0;
    if(events.revealedPredator) extra+=3;
    if(events.revealedAlien) extra+=3;
    if(events.infection) extra-=3;
    if(events.killByPredator) extra-=5;
    document.getElementById('event-points').textContent=extra;
  }
});
