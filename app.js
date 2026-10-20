/* menu mobilne */
(function(){
  const h=document.querySelector('.ham'),p=document.getElementById('panel'); if(!h||!p)return;
  const ustaw=o=>{h.setAttribute('aria-expanded',o);p.classList.toggle('otwarte',o);document.body.style.overflow=o?'hidden':''};
  h.addEventListener('click',()=>ustaw(h.getAttribute('aria-expanded')!=='true'));
  p.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>ustaw(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')ustaw(false)});
  matchMedia('(min-width:1081px)').addEventListener('change',e=>{if(e.matches)ustaw(false)});
})();

/* dobor posadzki - wstepna propozycja systemu (ostateczny dobor po ogledzinach) */
(function(){
  const wyn=document.getElementById('propozycja'); if(!wyn)return;
  const st={obiekt:'magazyn',ruch:'wozki',chemia:'brak',cel:'nowa'};
  const SYS={
    beton:{n:'Posadzka betonowa z utwardzoną powierzchnią',o:'Płyta betonowa zbrojona, zacierana mechanicznie z posypką utwardzającą. Najczęstszy wybór do hal i magazynów z ruchem wózków.',
      p:[['Wykończenie','zacierana mechanicznie, posypka utwardzająca'],['Zbrojenie','dobrane do obciążeń regałów i wózków'],['Dylatacje','cięte, wypełnione masą lub profilem']]},
    zywica:{n:'Posadzka żywiczna epoksydowa',o:'Szczelna, łatwa do mycia powłoka na podłożu betonowym. Dobra tam, gdzie liczy się czystość, kolor stref i odporność na oleje.',
      p:[['Warstwy','grunt, warstwa zasadnicza, zamknięcie'],['Powierzchnia','gładka albo antypoślizgowa'],['Oznakowanie','ciągi komunikacyjne i strefy w kolorze']]},
    pu:{n:'Posadzka poliuretanowo-cementowa',o:'System do miejsc mokrych, z chemią i dużymi zmianami temperatury: przetwórstwo spożywcze, chłodnie, myjnie.',
      p:[['Odporność','kwasy, zasady, gorąca woda'],['Powierzchnia','antypoślizgowa'],['Detale','wyoblenia przy ścianach, odwodnienia']]},
    pylenie:{n:'Wzmocnienie powierzchni przeciw pyleniu',o:'Szlifowanie i impregnacja, które wiążą luźną warstwę betonu. Posadzka przestaje się kurzyć bez skuwania i bez długiego wyłączania hali.',
      p:[['Zakres','szlifowanie, impregnacja wzmacniająca'],['Przestój','krótki, prace strefami'],['Efekt','koniec kurzu na regałach i towarze']]},
    dylatacje:{n:'Naprawa dylatacji',o:'Usunięcie zniszczonych krawędzi, odbudowa masą o wysokiej wytrzymałości i nowe wypełnienie. Przy intensywnym ruchu wózków profile stalowe.',
      p:[['Zakres','wycięcie, odbudowa krawędzi, wypełnienie'],['Ruch ciężki','profile dylatacyjne'],['Przestój','odcinkami, bez zamykania hali']]},
    klawisz:{n:'Stabilizacja klawiszujących płyt',o:'Wypełnienie pustek pod płytami iniekcją i połączenie płyt dyblami, żeby przestały się uginać pod wózkami.',
      p:[['Zakres','iniekcja pod płytą, dyblowanie'],['Kontrola','pomiar ugięć przed i po'],['Dylatacje','naprawa przy okazji']]},
    renowacja:{n:'Renowacja posadzki żywicznej',o:'Usunięcie zniszczonej powłoki, naprawa podłoża i nowa warstwa żywicy. Hala wraca do użytku strefami.',
      p:[['Zakres','frezowanie lub szlifowanie, naprawy, nowa powłoka'],['Kolory','odtworzenie oznakowania'],['Przestój','strefami']]}
  };
  function wybierz(){
    if(st.cel==='pylenie')return 'pylenie';
    if(st.cel==='dylatacje')return 'dylatacje';
    if(st.cel==='klawisz')return 'klawisz';
    if(st.cel==='renowacja')return 'renowacja';
    if(st.obiekt==='spozywczy'||st.chemia==='kwasy')return 'pu';
    if(st.chemia==='oleje'||st.obiekt==='produkcja'&&st.ruch!=='ciezki')return 'zywica';
    if(st.obiekt==='parking')return st.ruch==='piesi'?'zywica':'beton';
    return 'beton';
  }
  function rysuj(){
    const s=SYS[wybierz()];
    wyn.innerHTML='<span class="tag">Wstępna propozycja</span><h3>'+s.n+'</h3><p>'+s.o+'</p><ul>'+s.p.map(x=>'<li><b>'+x[0]+'</b><span>'+x[1]+'</span></li>').join('')+'</ul><small>Ostateczny system, grubości i materiały dobieramy po oględzinach i pomiarach na miejscu.</small><a class="btn btn-czer" href="#kontakt">Wyślij zapytanie z tym wyborem</a>';
  }
  document.querySelectorAll('#dobor .opcje').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));st[g.dataset.p]=b.dataset.v;rysuj()}));
  rysuj();
})();

/* mapa realizacji */
(function(){
  const box=document.getElementById('mapa'); if(!box||!window.L)return;
  const mapa=L.map(box,{scrollWheelZoom:false,zoomControl:true,tap:false}).setView([52.6,20.6],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapa);
  const pkt={};
  document.querySelectorAll('.real-lista li').forEach(li=>{
    const ll=li.dataset.ll.split(',').map(Number), baza=li.classList.contains('baza');
    const m=L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="pin'+(baza?' baza':'')+'"></div>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(mapa).bindTooltip(li.dataset.t,{direction:'top',offset:[0,-8]});
    pkt[li.dataset.t]=m;
    li.addEventListener('click',()=>{document.querySelectorAll('.real-lista li').forEach(x=>x.classList.toggle('akt',x===li));mapa.flyTo(ll,9,{duration:.8});m.openTooltip()});
  });
  const b=L.featureGroup(Object.values(pkt)); mapa.fitBounds(b.getBounds(),{padding:[30,30]});
})();
