
(function(){
  const bg=document.getElementById('bg'),starsC=document.getElementById('stars'),cometsC=document.getElementById('comets');
  const bgCtx=bg.getContext('2d'),starsCtx=starsC.getContext('2d'),cometsCtx=cometsC.getContext('2d');
  let W=0,H=0,stars=[],comets=[],ambient=true,raf=0;
  function resize(){W=bg.width=starsC.width=cometsC.width=window.innerWidth;H=bg.height=starsC.height=cometsC.height=window.innerHeight;initStars();drawBg();}
  function initStars(){stars=Array.from({length:ambient?220:160},()=>{return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+0.25,a:Math.random(),da:(Math.random()*0.004+0.001)*(Math.random()<0.5?1:-1),vx:(Math.random()-0.5)*0.06,vy:(Math.random()-0.5)*0.04}});}
  function drawBg(){const g=bgCtx.createRadialGradient(W*.42,H*.28,0,W*.5,H*.56,Math.max(W,H)*.92);g.addColorStop(0,'#0a2614');g.addColorStop(.35,'#061a0c');g.addColorStop(.7,'#031007');g.addColorStop(1,'#010d04');bgCtx.clearRect(0,0,W,H);bgCtx.fillStyle=g;bgCtx.fillRect(0,0,W,H);}
  function drawStars(){starsCtx.clearRect(0,0,W,H);stars.forEach(s=>{s.a+=s.da;if(s.a>1||s.a<.08)s.da*=-1;s.x+=s.vx*(ambient?1.8:1);s.y+=s.vy*(ambient?1.8:1);if(s.x<-10)s.x=W+10;if(s.x>W+10)s.x=-10;if(s.y<-10)s.y=H+10;if(s.y>H+10)s.y=-10;starsCtx.beginPath();starsCtx.arc(s.x,s.y,s.r,0,Math.PI*2);starsCtx.fillStyle=`rgba(220,240,225,${s.a})`;starsCtx.fill();});}
  function spawnComet(){const fromTop=Math.random()>0.35;const comet={x:fromTop?Math.random()*W*1.4-W*0.2:-60,y:fromTop?-60:Math.random()*H*0.6,vx:fromTop?Math.random()*3+2:Math.random()*4+3,vy:fromTop?Math.random()*3+2:Math.random()*1.5+0.8,len:Math.random()*110+70,life:1.0,decay:Math.random()*0.006+0.006,width:Math.random()*1.4+0.6,glow:Math.random()*0.35+0.55};comets.push(comet);}
  let cometTimer=0;
  function drawComets(ts){cometsCtx.clearRect(0,0,W,H);if(ts-cometTimer>2200+Math.random()*1500){spawnComet();if(Math.random()>0.72)setTimeout(spawnComet,280);cometTimer=ts;}comets=comets.filter(c=>c.life>0);comets.forEach(c=>{c.x+=c.vx;c.y+=c.vy;c.life-=c.decay;const a=c.life*c.glow;const tx=c.x-c.vx/Math.hypot(c.vx,c.vy)*c.len;const ty=c.y-c.vy/Math.hypot(c.vx,c.vy)*c.len;const g=cometsCtx.createLinearGradient(tx,ty,c.x,c.y);g.addColorStop(0,'rgba(201,168,76,0)');g.addColorStop(0.6,'rgba(240,208,128,'+Math.min(a*0.45,0.35)+')');g.addColorStop(1,'rgba(255,230,140,'+Math.min(a,0.9)+')');cometsCtx.save();cometsCtx.strokeStyle=g;cometsCtx.lineWidth=c.width;cometsCtx.shadowColor='rgba(201,168,76,0.6)';cometsCtx.shadowBlur=6;cometsCtx.beginPath();cometsCtx.moveTo(tx,ty);cometsCtx.lineTo(c.x,c.y);cometsCtx.stroke();cometsCtx.beginPath();cometsCtx.arc(c.x,c.y,c.width*1.4,0,Math.PI*2);cometsCtx.fillStyle='rgba(255,240,160,'+Math.min(a*1.1,0.95)+')';cometsCtx.fill();cometsCtx.restore();});}
  function loop(ts){drawStars();drawComets(ts);raf=requestAnimationFrame(loop);}
  resize();drawBg();requestAnimationFrame(loop);window.addEventListener('resize',()=>{resize();});

  const scroller=document.getElementById('scroll'),progress=document.getElementById('progress');
  scroller.addEventListener('scroll',()=>{const max=scroller.scrollHeight-scroller.clientHeight;const p=max>0?scroller.scrollTop/max:0;progress.style.transform=`scaleX(${p})`;document.documentElement.style.setProperty('--scrollY',scroller.scrollTop);},{passive:true});
  const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.12,root:scroller});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur').forEach(el=>io.observe(el));

  const bgMusic=document.getElementById('bgMusic'),musicBtn=document.getElementById('musicBtn');
  let musicPlaying=false;
  function startMusic(){bgMusic.volume=0;const p=bgMusic.play();if(p!==undefined){p.then(()=>{musicPlaying=true;musicBtn.classList.add('playing');musicBtn.innerHTML='<span style="display:inline-block;animation:spin 3s linear infinite">🎵</span>';let vol=0;const fi=setInterval(()=>{vol=Math.min(vol+0.035,0.55);bgMusic.volume=vol;if(vol>=0.55)clearInterval(fi);},120);}).catch(()=>{musicBtn.style.display='grid';});}}
  musicBtn.addEventListener('click',()=>{if(musicPlaying){let vol=bgMusic.volume;const fo=setInterval(()=>{vol=Math.max(vol-0.05,0);bgMusic.volume=vol;if(vol<=0){clearInterval(fo);bgMusic.pause();}},80);musicPlaying=false;musicBtn.classList.remove('playing');musicBtn.innerHTML='🎵';}else{startMusic();}});

  const entry=document.getElementById('entry'),entryDoors=document.getElementById('entryDoors');
  let opened=false;
  function triggerHeroStagger(){const els=['hs1','hs4','hs5','hs6'];els.forEach((id,i)=>{setTimeout(()=>{const el=document.getElementById(id);if(el)el.classList.add('in');},i*200);});setTimeout(()=>{const names=document.getElementById('heroNames');if(names)names.classList.add('in');},2000);
    // Reveal the scroll hint once the hero has settled in, then hide it on first scroll
    setTimeout(()=>{
      const hint = document.getElementById('scrollHint');
      if(!hint) return;
      hint.classList.add('show');
      let hidden = false;
      function hideHint(){
        if(hidden) return;
        hidden = true;
        hint.classList.add('hide');
        scroller.removeEventListener('scroll', hideHint);
      }
      scroller.addEventListener('scroll', hideHint, {passive:true});
    }, 3000);
  }
  function openEntry(){if(opened)return;opened=true;entryDoors.classList.add('doors-open');startMusic();setTimeout(()=>{entry.classList.add('zoom-in');},900);setTimeout(()=>{entry.style.display='none';document.getElementById('ambientBtn').style.display='grid';musicBtn.style.display='grid';triggerHeroStagger();setTimeout(()=>{try{entry.remove();}catch(e){}} ,100);},2500);}
  entry.addEventListener('click',openEntry);
  entry.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' ')openEntry();});

  const ambientBtn=document.getElementById('ambientBtn');
  ambientBtn.addEventListener('click',()=>{ambient=!ambient;ambientBtn.textContent=ambient?'✦':'✧';document.body.style.filter=ambient?'':'saturate(.95) brightness(.95)';});
  ambientBtn.style.display='none';

  function tick(){const target=new Date('2026-09-06T00:00:00');const now=new Date();let diff=target-now;if(diff<0)diff=0;const days=Math.floor(diff/86400000);const hours=Math.floor((diff%86400000)/3600000);const mins=Math.floor((diff%3600000)/60000);const secs=Math.floor((diff%60000)/1000);const set=(id,val)=>document.getElementById(id).textContent=String(val).padStart(2,'0');set('d',days);set('h',hours);set('m',mins);set('s',secs);}
  tick();setInterval(tick,1000);

  /* SCRATCH */
  const canvas=document.getElementById('scratchCanvas'),scratchBox=document.getElementById('scratchBox'),hint=document.getElementById('scratchHint');
  let drawing=false,revealed=false;
  function resizeScratch(){const r=scratchBox.getBoundingClientRect();canvas.width=r.width;canvas.height=r.height;const ctx=canvas.getContext('2d');ctx.globalCompositeOperation='source-over';const g=ctx.createLinearGradient(0,0,canvas.width,canvas.height);g.addColorStop(0,'#071f0e');g.addColorStop(.26,'#0f4a20');g.addColorStop(.58,'#c9a84c');g.addColorStop(1,'#071f0e');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;ctx.font=`${Math.max(18,canvas.width*0.06)}px 'Cinzel',serif`;ctx.textAlign='center';ctx.fillStyle='#f7eddc';
  ctx.shadowColor='#f0d080';
  ctx.shadowBlur=18;
  ctx.fillText('✦ SCRATCH HERE ✦',canvas.width/2,canvas.height/2+8);
  ctx.shadowBlur=0;}
  function pos(e){const rect=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-rect.left,y:t.clientY-rect.top};}
  function clearAt(x,y){const ctx=canvas.getContext('2d');ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,30,0,Math.PI*2);ctx.fill();}
  function checkReveal(){if(revealed)return;const ctx=canvas.getContext('2d');const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let cleared=0;for(let i=3;i<data.length;i+=4){if(data[i]<128)cleared++;}if(cleared/(canvas.width*canvas.height)>0.5){revealed=true;scratchBox.classList.add('surprise-revealed');hint.textContent='✦ NIKAH DATE REVEALED ✦';canvas.style.transition='opacity .7s ease';canvas.style.opacity='0';setTimeout(()=>canvas.remove(),700);}}
  function move(e){if(!drawing)return;e.preventDefault();const p=pos(e);clearAt(p.x,p.y);checkReveal();}
  canvas.addEventListener('mousedown',e=>{drawing=true;const p=pos(e);clearAt(p.x,p.y)});canvas.addEventListener('mousemove',move);canvas.addEventListener('mouseup',()=>drawing=false);canvas.addEventListener('mouseleave',()=>drawing=false);canvas.addEventListener('touchstart',e=>{drawing=true;const p=pos(e);clearAt(p.x,p.y)},{passive:false});canvas.addEventListener('touchmove',move,{passive:false});canvas.addEventListener('touchend',()=>drawing=false);
  window.addEventListener('resize',resizeScratch);setTimeout(resizeScratch,350);

  /* ===== HAND SLIDE — DRAG TO UNITE ===== */
  (function(){
    const stage    = document.getElementById('handStage');
    const handLeft = document.getElementById('handLeft');
    const handRight= document.getElementById('handRight');
    const handCombo= document.getElementById('handCombo');
    const ringHint = document.getElementById('ringHint');
    const handsSub = document.getElementById('handsSubtext');
    const united   = document.getElementById('ringUnited');
    const asifName = document.getElementById('asifName');
    const nazName  = document.getElementById('naziyaName');
    const petalCvs = document.getElementById('petalCanvas');
    if(!stage||!handLeft||!handRight) return;

    const HAND_W = 34; // matches .hand-img width:34% in CSS
    let gLeftPct = 0;            // groom hand left edge %
    let bLeftPct = 100 - HAND_W; // bride hand left edge %
    let dragging = null;
    let isUnited = false;
    let petals   = [];
    let petalRaf = null;

    function applyPositions(){
      handLeft.style.left  = gLeftPct + '%';
      handRight.style.left = bLeftPct + '%';

      const groomCentre = gLeftPct + HAND_W/2;
      const brideCentre = bLeftPct + HAND_W/2;
      asifName.style.left = groomCentre + '%';
      nazName.style.left  = brideCentre + '%';
    }
    applyPositions();

    function getClientX(e){ return e.touches ? e.touches[0].clientX : e.clientX; }

    function startDrag(e, isGroom){
      if(isUnited) return;
      if(ringHint) ringHint.style.animation = 'none';
      if(handsSub) handsSub.style.transition = 'opacity .2s ease';
      dragging = { isGroom, startX: getClientX(e) };
      e.preventDefault();
    }

    function onMove(e){
      if(!dragging || isUnited) return;
      e.preventDefault();
      const dx = getClientX(e) - dragging.startX;
      const stageW = stage.getBoundingClientRect().width || 300;
      const deltaPct = (dx / stageW) * 100;

      if(dragging.isGroom){
        gLeftPct = Math.max(-8, Math.min(gLeftPct + deltaPct, bLeftPct + 6));
      } else {
        bLeftPct = Math.max(gLeftPct - 6, Math.min(bLeftPct + deltaPct, 100 - HAND_W + 8));
      }
      dragging.startX = getClientX(e);
      applyPositions();

      // Gap between groom's right edge and bride's left edge
      const gapPct = bLeftPct - (gLeftPct + HAND_W);

      // Proximity glow
      const proximity = Math.max(0, 1 - Math.max(0, gapPct) / 30);
      const glow = `drop-shadow(0 0 ${6+proximity*24}px rgba(201,168,76,${0.3+proximity*0.7}))`;
      handLeft.style.filter  = glow + ' drop-shadow(0 8px 22px rgba(0,0,0,.4))';
      handRight.style.filter = glow + ' drop-shadow(0 8px 22px rgba(0,0,0,.4))';
      if(ringHint) ringHint.style.opacity = String(Math.max(0, 1 - proximity * 1.4));
      if(handsSub) handsSub.style.opacity = String(Math.max(0, 1 - proximity * 1.4));

      if(gapPct <= 4) unite();
    }

    function onEnd(){ dragging = null; }

    handLeft.addEventListener('mousedown',  e => startDrag(e, true));
    handRight.addEventListener('mousedown', e => startDrag(e, false));
    handLeft.addEventListener('touchstart', e => startDrag(e, true),  {passive:false});
    handRight.addEventListener('touchstart',e => startDrag(e, false), {passive:false});
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup',  onEnd);
    window.addEventListener('touchend', onEnd);

    function unite(){
      if(isUnited) return;
      isUnited = true;

      // Snap hands to a centred, slightly overlapping meeting point
      gLeftPct = 50 - HAND_W + 6;
      bLeftPct = 50 - 6;
      applyPositions();

      // Bright gold glow on hands as they meet
      handLeft.style.filter  = 'drop-shadow(0 0 38px rgba(201,168,76,1)) drop-shadow(0 8px 22px rgba(0,0,0,.4))';
      handRight.style.filter = 'drop-shadow(0 0 38px rgba(201,168,76,1)) drop-shadow(0 8px 22px rgba(0,0,0,.4))';
      if(ringHint) ringHint.style.opacity = '0';
      if(handsSub) handsSub.style.opacity = '0';

      // Fade name labels
      if(asifName){ asifName.style.transition='opacity .5s ease'; asifName.style.opacity='0'; }
      if(nazName){  nazName.style.transition ='opacity .5s ease'; nazName.style.opacity ='0'; }

      // Crossfade into the combined "holding hands" artwork — it stays visible
      setTimeout(()=>{
        handLeft.style.transition  = 'opacity .8s ease';
        handRight.style.transition = 'opacity .8s ease';
        handLeft.style.opacity  = '0';
        handRight.style.opacity = '0';
        if(handCombo) handCombo.classList.add('show');
      }, 420);

      // Reveal the Valima details once the combo image has settled in
      setTimeout(()=>{
        if(united) united.classList.add('show');
      }, 1500);

      initPetalCanvas();
      launchCelebration();
    }

    function initPetalCanvas(){
      const section = document.getElementById('valimaSection');
      if(!section||!petalCvs) return;
      const r = section.getBoundingClientRect();
      petalCvs.width = r.width; petalCvs.height = r.height;
    }

    function launchCelebration(){
      const cx = petalCvs.width/2, cy = petalCvs.height/2;
      for(let i=0;i<80;i++){
        const angle=Math.random()*Math.PI*2,speed=Math.random()*6+2,isGold=Math.random()>.4;
        petals.push({x:cx,y:cy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-3,size:Math.random()*10+4,alpha:1,decay:Math.random()*.012+.008,color:isGold?`rgba(${200+Math.random()*55|0},${150+Math.random()*60|0},${40+Math.random()*40|0},`:`rgba(${180+Math.random()*75|0},${220+Math.random()*35|0},${150+Math.random()*50|0},`,rotate:Math.random()*Math.PI*2,rotateSpeed:(Math.random()-.5)*.15,type:Math.random()>.5?'petal':'spark',gravity:Math.random()*.18+.06});
      }
      setTimeout(()=>{
        for(let i=0;i<50;i++){
          const angle=Math.random()*Math.PI*2,speed=Math.random()*5+1.5;
          petals.push({x:cx+(Math.random()-.5)*80,y:cy+(Math.random()-.5)*40,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-2,size:Math.random()*8+3,alpha:1,decay:Math.random()*.01+.006,color:`rgba(${240+Math.random()*15|0},${200+Math.random()*30|0},${80+Math.random()*60|0},`,rotate:Math.random()*Math.PI*2,rotateSpeed:(Math.random()-.5)*.12,type:'petal',gravity:Math.random()*.15+.05});
        }
      }, 300);
      if(!petalRaf) animatePetals();
    }

    function animatePetals(){
      if(!petalCvs) return;
      const ctx=petalCvs.getContext('2d');
      ctx.clearRect(0,0,petalCvs.width,petalCvs.height);
      petals=petals.filter(p=>p.alpha>0.01);
      petals.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.99;p.alpha-=p.decay;p.rotate+=p.rotateSpeed;
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotate);ctx.globalAlpha=Math.max(0,p.alpha);
        if(p.type==='spark'){ctx.strokeStyle=p.color+p.alpha+')';ctx.lineWidth=p.size*.25;ctx.beginPath();ctx.moveTo(-p.size,0);ctx.lineTo(p.size,0);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(0,p.size);ctx.stroke();}
        else{ctx.fillStyle=p.color+p.alpha+')';ctx.beginPath();ctx.ellipse(0,0,p.size*.4,p.size,0,0,Math.PI*2);ctx.fill();}
        ctx.restore();
      });
      if(petals.length>0){ petalRaf=requestAnimationFrame(animatePetals); }
      else{ petalRaf=null; ctx.clearRect(0,0,petalCvs.width,petalCvs.height); }
    }
    window.addEventListener('resize',()=>{ if(isUnited) initPetalCanvas(); });
  })();

  /* DUA */
  const duaBtn=document.getElementById('duaBtn'),duaModal=document.getElementById('duaModal'),duaClose=document.getElementById('duaClose'),duaArabic=document.getElementById('duaArabic'),duaText=document.getElementById('duaText'),duaName=document.getElementById('duaName'),duaSendBtn=document.getElementById('duaSendBtn'),duaStatus=document.getElementById('duaStatus'),duaCycleBtn=document.getElementById('duaCycleBtn');
  
  const duas = [
  {ar:'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',en:'May Allah bless you both, bestow His blessings upon you, and unite you in goodness.'},
  {ar:'اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِهِمَا كَمَا أَلَّفْتَ بَيْنَ آدَمَ وَحَوَّاءَ',en:'O Allah, join their hearts as You joined Adam and Hawwa.'},
  {ar:'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',en:'Our Lord, grant us from among our spouses and offspring comfort to our eyes.'},
  {ar:'اللَّهُمَّ اجْعَلْ هَذَا الزَّوَاجَ مُبَارَكًا وَمَيْمُونًا',en:'O Allah, make this marriage blessed and auspicious.'},
  {ar:'اللَّهُمَّ بَارِكْ لَهُمَا فِي حَيَاتِهِمَا وَذُرِّيَّتِهِمَا',en:'O Allah, bless them in their life together and in their offspring.'},
  {ar:'اللَّهُمَّ اجْمَعْ بَيْنَهُمَا عَلَى الخَيْرِ وَالسَّعَادَةِ',en:'O Allah, bring them together upon goodness and happiness.'},
  {ar:'اللَّهُمَّ اجْعَلْ بَيْنَهُمَا مَوَدَّةً وَرَحْمَةً',en:'O Allah, place between them affection and mercy.'},
  {ar:'اللَّهُمَّ بَارِكْ لَهُمَا وَاغْفِرْ لَهُمَا وَارْحَمْهُمَا',en:'O Allah, bless them, forgive them, and have mercy on them.'},

  // Additional 20 duas
  {ar:'اللَّهُمَّ اجْعَلْ بَيْتَهُمَا بَيْتَ السَّكِينَةِ وَالطُّمَأْنِينَةِ',en:'O Allah, make their home a place of tranquility and peace.'},
  {ar:'اللَّهُمَّ اجْعَلْ زَوَاجَهُمَا سَبَبًا لِدُخُولِ الْجَنَّةِ',en:'O Allah, make their marriage a means to enter Paradise.'},
  {ar:'اللَّهُمَّ أَطِلْ أَعْمَارَهُمَا فِي طَاعَتِكَ',en:'O Allah, prolong their lives in obedience to You.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا عَوْنًا لِبَعْضِهِمَا عَلَى الْخَيْرِ',en:'O Allah, make them helpers for each other in goodness.'},
  {ar:'اللَّهُمَّ أَحْسِنْ عَاقِبَتَهُمَا وَاخْتِمْ لَهُمَا بِالصَّالِحَاتِ',en:'O Allah, grant them a good ending and conclude their lives with righteous deeds.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِفْتَاحًا لِلْخَيْرِ وَمِغْلَاقًا لِلشَّرِّ',en:'O Allah, make them keys to goodness and locks against evil.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَحَابِّينَ فِيكَ',en:'O Allah, make them among those who love each other for Your sake.'},
  {ar:'اللَّهُمَّ اجْعَلْ ذُرِّيَّتَهُمَا صَالِحَةً مُصْلِحَةً',en:'O Allah, make their offspring righteous and reformers.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا قُرَّةَ عَيْنٍ لِبَعْضِهِمَا',en:'O Allah, make them a source of comfort for each other.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مَعًا فِي الدُّنْيَا وَالْآخِرَةِ',en:'O Allah, unite them in this world and the Hereafter.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الشَّاكِرِينَ لِنِعْمَتِكَ',en:'O Allah, make them among the grateful for Your blessings.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَوَكِّلِينَ عَلَيْكَ',en:'O Allah, make them among those who rely upon You.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُقَرَّبِينَ إِلَيْكَ',en:'O Allah, make them among those close to You.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِثَالًا لِلْمَحَبَّةِ وَالطَّهَارَةِ',en:'O Allah, make them an example of love and purity.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُسْتَغْفِرِينَ الدَّائِمِينَ',en:'O Allah, make them among those who constantly seek forgiveness.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَّبِعِينَ لِسُنَّةِ نَبِيِّكَ',en:'O Allah, make them followers of the Sunnah of Your Prophet.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَزَوِّدِينَ لِلْآخِرَةِ',en:'O Allah, make them among those who prepare for the Hereafter.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَفَائِلِينَ بِرَحْمَتِكَ',en:'O Allah, make them among those hopeful of Your mercy.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَذَكِّرِينَ لِآلَائِكَ',en:'O Allah, make them among those who remember Your favors.'},
  {ar:'اللَّهُمَّ اجْعَلْهُمَا مِنَ الْمُتَحَابِّينَ فِي الْجَنَّةِ',en:'O Allah, make them among those who will love each other in Paradise.'}
  ];








  
  let duaIndex=0;
  function setDua(idx){duaIndex=((idx%duas.length)+duas.length)%duas.length;duaArabic.textContent=duas[duaIndex].ar;duaText.value=duas[duaIndex].ar+'\n\n'+duas[duaIndex].en;}
  setDua(0);
  duaCycleBtn.addEventListener('click',()=>{setDua(duaIndex+1);});
  function showDuaBtn(){duaBtn.style.display='grid';}
  const _origShowDua=document.getElementById('entry');
  if(_origShowDua){_origShowDua.addEventListener('click',()=>{setTimeout(showDuaBtn,2500);},{once:true});}
  const celebSection=document.querySelector('.cards')?document.querySelector('.cards').closest('.section'):null;
  let pillMode=false;
  scroller.addEventListener('scroll',()=>{if(!celebSection)return;const rect=celebSection.getBoundingClientRect();const past=rect.bottom<0;if(past&&!pillMode){pillMode=true;duaBtn.classList.add('pill-mode');duaBtn.innerHTML='✦ SEND A DUA ✦';duaBtn.classList.add('attention');setTimeout(()=>duaBtn.classList.remove('attention'),3200);}else if(!past&&pillMode){pillMode=false;duaBtn.classList.remove('pill-mode','attention');duaBtn.innerHTML='🤲';}},{passive:true});
  duaBtn.addEventListener('click',openDuaModal);
  function openDuaModal(){duaStatus.textContent='';duaStatus.className='dua-status';duaModal.style.display='flex';duaModal.classList.add('open');requestAnimationFrame(()=>requestAnimationFrame(()=>duaModal.classList.add('visible')));}
  function closeDuaModal(){duaModal.classList.remove('visible');setTimeout(()=>{duaModal.classList.remove('open');duaModal.style.display='none';},400);}
  duaClose.addEventListener('click',closeDuaModal);
  duaModal.addEventListener('click',e=>{if(e.target===duaModal)closeDuaModal();});
  duaSendBtn.addEventListener('click',async()=>{
    const message=duaText.value.trim(),name=duaName.value.trim()||'A Beloved Guest';
    if(!message){duaStatus.textContent='Please write a blessing first.';duaStatus.className='dua-status error';return;}
    duaSendBtn.disabled=true;duaSendBtn.textContent='✦ SENDING... ✦';duaStatus.textContent='';
    const params={from_name:name,message:message,name:name,email:''};
    try{
      if(typeof emailjs==='undefined')throw new Error('EmailJS not loaded');
      await emailjs.send('service_ankfxao','template_1yagxpn',params);
      duaStatus.textContent='✦ YOUR BLESSING HAS BEEN SENT ✦';duaStatus.className='dua-status success';duaSendBtn.textContent='✦ SENT WITH LOVE ✦';spawnHearts();setTimeout(closeDuaModal,2800);
    }catch(err){duaStatus.textContent='Something went wrong. Please try again.';duaStatus.className='dua-status error';duaSendBtn.disabled=false;duaSendBtn.textContent='✦ SEND YOUR BLESSING ✦';}
  });
  function spawnHearts(){const rect=duaSendBtn.getBoundingClientRect();const cx=rect.left+rect.width/2,cy=rect.top;const emojis=['💛','✨','🤍','💫','🌙','💚'];for(let i=0;i<8;i++){setTimeout(()=>{const h=document.createElement('div');h.className='heart-burst';h.textContent=emojis[Math.floor(Math.random()*emojis.length)];h.style.left=(cx+(Math.random()-.5)*80)+'px';h.style.top=cy+'px';h.style.animationDelay=(Math.random()*.3)+'s';document.body.appendChild(h);setTimeout(()=>h.remove(),2200);},i*80);}}

})();
