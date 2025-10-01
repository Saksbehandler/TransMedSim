// --- Tidsfunksjoner ---
function ts(){
  return new Date().toLocaleTimeString("no-NO",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
function updateLastUpdated(){
  document.getElementById('lastUpdated').textContent=ts()
}

// --- Global loggtekst ---
const logText=document.getElementById('logText');

// --- A/H/V knapp ---
const circle=document.getElementById('statusCircle');
const states=[{class:'akutt',text:'A'},{class:'haster',text:'H'},{class:'vanlig',text:'V'}];
let current=0;
circle.addEventListener('click',()=>{
  circle.classList.remove(states[current].class);
  current=(current+1)%states.length;
  circle.classList.add(states[current].class);
  circle.textContent=states[current].text;
  setMottattIfEmpty();updateLastUpdated()
});

// --- Leverings-dropdown ---
let deliverySetOnce=false;
const deliveryBox=document.getElementById('deliveryBox');
const deliveryOptions=document.getElementById('deliveryOptions');
const deliveryText=document.getElementById('deliveryText');
deliveryBox.addEventListener('click',e=>{
  e.stopPropagation();
  deliveryOptions.style.display=deliveryOptions.style.display==='block'?'none':'block'
});
deliveryOptions.querySelectorAll('div').forEach(opt=>{
  opt.addEventListener('click',()=>{
    const name=opt.getAttribute('data-name');
    const street=opt.getAttribute('data-street');
    const city=opt.getAttribute('data-city');

    // Før rykker ut → hvit, etter → gul
    if(currentStatus==="Varslet"){
      deliveryText.innerHTML=`<span class="white-text">${name}<br>${street}<br>${city}</span>`;
    } else {
      deliveryText.innerHTML=`<span class="yellow-text">${name}<br>${street}<br>${city}</span>`;
    }

    deliveryOptions.style.display='none';
    deliverySetOnce=true;
    setMottattIfEmpty();updateLastUpdated()
  })
});
document.addEventListener('click',e=>{
  if(!deliveryBox.contains(e.target)) deliveryOptions.style.display='none'
});

// --- Hentested ---
const pickupBox=document.getElementById('pickupBox');
const pickupForm=document.getElementById('pickupForm');
const pickupText=document.getElementById('pickupText');
pickupBox.addEventListener('click',()=>{pickupForm.style.display='flex'});
function savePickup(){
  const name=document.getElementById('pickupName').value;
  const street=document.getElementById('pickupStreet').value;
  const zip=document.getElementById('pickupZip').value;
  const city=document.getElementById('pickupCity').value;

  if(name.trim()!==""){
    pickupText.innerHTML=`${name}<br>${street}<br>${zip} ${city}`;
  } else {
    pickupText.innerHTML=`${street}<br>${zip} ${city}`;
  }
  pickupForm.style.display='none';
  setMottattIfEmpty();updateLastUpdated()
}

// --- Pasient ---
const patientBox=document.getElementById('patientBox');
const patientForm=document.getElementById('patientForm');
const patientText=document.getElementById('patientText');
patientBox.addEventListener('click',()=>{patientForm.style.display='flex'});
function savePatient(){
  const navn=document.getElementById('navn').value;
  const alder=document.getElementById('alder').value;
  const kriterie=document.getElementById('kriterie').value;
  const bevissthet=document.getElementById('bevissthet').value;
  const resp=document.getElementById('respirasjon').value;
  const fritekst=document.getElementById('fritekst').value;
  patientText.innerHTML=`${navn} (${alder})<br><u>Kriterie:</u> ${kriterie} &nbsp;&nbsp;<u>Bevissthet:</u> ${bevissthet} &nbsp;&nbsp;<u>Respirasjon:</u> ${resp}<br>${fritekst}`;
  patientForm.style.display='none';
  setMottattIfEmpty();updateLastUpdated()
}

// --- Hovedinfo ---
const mainInfoBox=document.getElementById('mainInfoBox');
const mainInfoForm=document.getElementById('mainInfoForm');
const mainInfoText=document.getElementById('mainInfoText');
mainInfoBox.addEventListener('click',()=>{mainInfoForm.style.display='flex'});
function saveMainInfo(){
  const orig=document.getElementById('mainOriginal').value;
  const upd=document.getElementById('mainUpdate').value;
  mainInfoText.innerHTML=`<span class='white-text'>${orig.replace(/\n/g,'<br>')}</span>${upd?'<br>':''}<span class='yellow-text'>${upd.replace(/\n/g,'<br>')}</span>`;
  mainInfoForm.style.display='none';
  setMottattIfEmpty();updateLastUpdated()
}

// --- Kontakt ---
const contactBox=document.getElementById('contactBox');
const contactForm=document.getElementById('contactForm');
const contactText=document.getElementById('contactText');
contactBox.addEventListener('click',()=>{contactForm.style.display='flex'});
function formatPhone(num){
  let clean=(num||'').replace(/\D/g,'');
  let prefix='';
  if(clean.startsWith('47')){
    prefix='+47 ';
    clean=clean.slice(2)
  }
  return prefix+(clean.match(/.{1,2}/g)||[]).join(' ')
}
function saveContact(){
  const rel=document.getElementById('contactRelation').value;
  const phone=document.getElementById('contactPhone').value;
  contactText.textContent=`${rel}, tlf. ${formatPhone(phone)}`;
  contactForm.style.display='none';
  setMottattIfEmpty();updateLastUpdated()
}

// --- Logg ---
const logBox=document.getElementById('logBox');
const logForm=document.getElementById('logForm');
logBox.addEventListener('click',()=>{logForm.style.display='flex'});
function saveLog(){
  const entry=document.getElementById('logEntry').value;
  if(entry.trim()===''){logForm.style.display='none';return}
  const time=ts();
  if(logText.innerHTML==='(ingen loggmeldinger)') logText.innerHTML='';
  logText.innerHTML=`${time} ${entry}<br>`+logText.innerHTML;
  document.getElementById('logEntry').value='';
  logForm.style.display='none';
  setMottattIfEmpty();updateLastUpdated()
}

// --- Dialog helpers ---
function openDialog(id){document.getElementById(id).style.display='flex'}
function closeDialog(id){document.getElementById(id).style.display='none'}

// --- Reset ---
document.getElementById('resetBtn').addEventListener('click',()=>openDialog('resetDialog'))
function confirmReset(){location.reload()}

// --- STATUS-SYKLUS ---
let currentStatus="Ledig";

function setMottattIfEmpty(){
  const s=document.querySelector('#mottattField small');
  const title=document.querySelector('#mottattField .title');
  if(title.textContent==='Ledig'){   // bare hvis vi faktisk er ledig
    const time=ts();
    s.textContent=time;
    title.textContent="Varslet";
    currentStatus="Varslet";

    // logg "varslet"
    const unit=document.getElementById('unitNumber').textContent.trim()||'XXX';
    if(logText.innerHTML==='(ingen loggmeldinger)') logText.innerHTML='';
    logText.innerHTML=`${time} Ambulanse ${unit} - varslet<br>`+logText.innerHTML;
  }
}

document.getElementById('mottattField').addEventListener('click',()=>{
  const dialog=document.getElementById('statusDialog');
  const buttons=dialog.querySelector('.dialog-buttons');
  buttons.innerHTML="";

  if(currentStatus==="Varslet"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendRykkerUt()">Rykker ut</div>`;
  } else if(currentStatus==="Rykker ut"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendFremme()">Fremme</div>`;
  } else if(currentStatus==="Fremme"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendAvreist()">Avreist</div>`;
  } else if(currentStatus==="Avreist"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendLeverer()">Leverer</div>`;
  } else if(currentStatus==="Leverer"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendLedig()">Ledig</div>`;
  } else if(currentStatus==="Ledig"){
    buttons.innerHTML=`<div class="bigbtn" onclick="sendLedigStasjon()">Ledig stasjon</div>`;
  } else {
    buttons.innerHTML=`<div class="bigbtn">Ingen flere statuser</div>`;
  }
  dialog.style.display='flex';
});

function sendRykkerUt(){ logStatus("Rykker ut","rykker ut"); }
function sendFremme(){ logStatus("Fremme","fremme"); }
function sendAvreist(){ logStatus("Avreist","avreist"); }
function sendLeverer(){ logStatus("Leverer","leverer"); }
function sendLedig(){ logStatus("Ledig","ledig"); }
function sendLedigStasjon(){ logStatus("Ledig stasjon","ledig stasjon"); }

// Felles funksjon for logging + oppdatering
function logStatus(label,logTextPart){
  const unit=document.getElementById('unitNumber').textContent.trim()||'XXX';
  const time=ts();
  if(logText.innerHTML==='(ingen loggmeldinger)') logText.innerHTML='';
  logText.innerHTML=`${time} Ambulanse ${unit} - ${logTextPart}<br>`+logText.innerHTML;

  const mottattField=document.getElementById('mottattField');
  mottattField.querySelector('.title').textContent=label;
  mottattField.querySelector('small').textContent=time;

  currentStatus=label;
  updateLastUpdated();
  closeDialog('statusDialog');
}
