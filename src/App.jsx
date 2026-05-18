import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, memo } from "react";

const G="#1EB53A", R="#CE1126", W="#fff", RB="#0039A6", RR="#D52B1E";
const COLORS=[G,R,"#3b82f6","#a855f7","#f59e0b","#06b6d4","#ec4899","#14b8a6"];

const THEMES={
  night:{bg:"#07090a",card:"rgba(255,255,255,0.04)",bdr:"rgba(255,255,255,0.09)",tx:"#f0f0f0",sub:"#777",inp:"rgba(255,255,255,0.07)",nav:"rgba(7,9,10,0.96)",nm:"🌙"},
  day:{bg:"#f0f4f0",card:"rgba(0,0,0,0.04)",bdr:"rgba(0,0,0,0.09)",tx:"#111",sub:"#555",inp:"rgba(0,0,0,0.06)",nav:"rgba(240,244,240,0.97)",nm:"☀️"},
  ubuntu:{bg:"#0d0805",card:"rgba(206,17,38,0.06)",bdr:"rgba(30,181,58,0.18)",tx:"#f5e0c8",sub:"#a07050",inp:"rgba(255,200,150,0.07)",nav:"rgba(13,8,5,0.97)",nm:"🌍"},
};

const UNIVS=[
  {name:"АГУ",full:"Астраханский государственный университет",icon:"🏛",color:"#3b82f6",lat:46.347,lng:48.035},
  {name:"АГТУ",full:"Астраханский государственный технический университет",icon:"⚙️",color:G,lat:46.352,lng:48.042},
  {name:"АГМУ",full:"Астраханская государственная медицинская академия",icon:"🏥",color:R,lat:46.344,lng:48.028},
  {name:"АГПУ",full:"Астраханский государственный педагогический университет",icon:"📖",color:"#f59e0b",lat:46.358,lng:48.055},
  {name:"Autre",full:"Autre université / Другой",icon:"🎓",color:"#a855f7",lat:46.35,lng:48.04},
];

const PROVERBS=[
  {fr:"L'union fait la force.",ru:"В единстве — сила."},
  {fr:"Un seul doigt ne peut ramasser le grain.",ru:"Один палец не соберёт зерно."},
  {fr:"Celui qui voyage loin apprend beaucoup.",ru:"Кто далеко путешествует — много узнаёт."},
  {fr:"La famille est la richesse des pauvres.",ru:"Семья — богатство бедняков."},
  {fr:"La patience est l'arme du sage.",ru:"Терпение — оружие мудрого."},
];

const EVENTS=[
  {date:"2026-06-01",title:"Réunion mensuelle de la communauté",place:"Café Central, Astrakhan",icon:"🤝"},
  {date:"2026-07-01",title:"Fête nationale du Burundi 🇧🇮",place:"Parc Братский Сад",icon:"🎊"},
  {date:"2026-08-15",title:"Soirée cuisine burundaise",place:"À confirmer",icon:"🍲"},
  {date:"2026-09-10",title:"Rentrée — accueil nouveaux membres",place:"АГТУ, salle 205",icon:"🎓"},
];

const KELLY={id:0,firstname:"Mugisha L.",lastname:"Kelly",birthdate:"",gender:"M",
  university:"АГТУ",field:"Sciences & Technologies",year:"—",arrival:"2023",
  address:"Astrakhan",email:"",whatsapp:"",skills:"Fondateur & Créateur de la communauté",
  bio:"J'ai créé ce site pour que chaque Burundais à Astrakhan se sente chez lui, même loin de chez lui. Ensemble, on est plus forts.",
  public:true,avatar:"MK",color:G,role:"🌟 Fondateur",isFounder:true,online:true};

const T={fr:{
  navHome:"Accueil",navDir:"Annuaire",navUni:"Universités",navMem:"Mémoires",
  navTest:"Témoignages",navForum:"Forum",navEv:"Agenda",navChat:"Chat",
  navMap:"Carte",navAbout:"À propos",navJoin:"Rejoindre",
  heroTitle:"BURUNDI ASTRAKHAN",heroSub:"La plateforme communautaire des étudiants et de la diaspora burundaise à Astrakhan.",
  heroMotto:"Informer. Connecter. Préserver. Unir.",
  heroCta:"Rejoindre la communauté",heroUni:"Explorer les universités",heroTest:"Témoignages",
  statsM:"Étudiants",statsY:"Années",statsU:"Universités",statsE:"Événements",statsC:"Cultures unies",
  exploreTitle:"Explorer la plateforme",
  uniTitle:"Nos universités",uniStudents:"étudiant(s)",
  memTitle:"Mémoires",memNew:"Publier",memPlaceholder:"Partage un souvenir, un moment…",noMemories:"Sois le premier à partager !",
  dirTitle:"Annuaire",dirSearch:"Rechercher par nom, filière, université…",
  chatTitle:"Chat",chatOnline:"En ligne",chatGroup:"Discussion générale",chatCalls:"Appels",
  chatSend:"Envoyer",chatCallReq:"Demander un appel",
  chatCallInfo:"Les appels doivent être approuvés par le Fondateur avant confirmation.",
  chatPlaceholder:"Écrire un message…",callPlaceholder:"Motif de l'appel…",noCalls:"Aucun appel planifié.",
  testTitle:"Témoignages",testEmpty:"Les témoignages apparaîtront après les inscriptions.",
  forumTitle:"Forum & Entraide",forumAsk:"Posez une question ou partagez…",forumPost:"Publier",
  evTitle:"Agenda",mapTitle:"Carte",
  aboutTitle:"À propos de Burundi Astrakhan",
  regTitle:"Rejoindre la communauté",regFirst:"Prénom",regLast:"Nom",regBirth:"Date de naissance",
  regGen:"Genre",regGenM:"Homme",regGenF:"Femme",regUni:"Université",regField:"Filière",
  regYear:"Niveau",regArr:"Année d'arrivée",regAddr:"Adresse",regEmail:"Email",
  regWA:"WhatsApp / Telegram",regSkills:"Compétences",regBio:"Bio / Témoignage",
  regNotif:"Notifs anniversaires",regPub:"Profil visible",regBtn:"S'inscrire",arrived:"Arrivé en",
  moto:"Moto",ijwi:"Ijwi",saba:"Saba",bika:"Bika",
},ru:{
  navHome:"Главная",navDir:"Каталог",navUni:"Универы",navMem:"Память",
  navTest:"Отзывы",navForum:"Форум",navEv:"События",navChat:"Чат",
  navMap:"Карта",navAbout:"О нас",navJoin:"Вступить",
  heroTitle:"BURUNDI ASTRAKHAN",heroSub:"Платформа бурундийских студентов и диаспоры в Астрахани.",
  heroMotto:"Информировать. Соединять. Сохранять. Объединять.",
  heroCta:"Присоединиться",heroUni:"Университеты",heroTest:"Отзывы",
  statsM:"Студентов",statsY:"Лет",statsU:"Университетов",statsE:"Событий",statsC:"Культуры",
  exploreTitle:"Изучить платформу",
  uniTitle:"Наши университеты",uniStudents:"студентов",
  memTitle:"Воспоминания",memNew:"Опубликовать",memPlaceholder:"Поделись воспоминанием…",noMemories:"Будь первым!",
  dirTitle:"Каталог",dirSearch:"Поиск по имени, специальности…",
  chatTitle:"Чат",chatOnline:"В сети",chatGroup:"Общий чат",chatCalls:"Звонки",
  chatSend:"Отправить",chatCallReq:"Запросить звонок",
  chatCallInfo:"Звонки одобряются Основателем.",chatPlaceholder:"Написать…",callPlaceholder:"Причина…",noCalls:"Нет звонков.",
  testTitle:"Отзывы",testEmpty:"Отзывы появятся после регистрации.",
  forumTitle:"Форум",forumAsk:"Задай вопрос…",forumPost:"Опубликовать",
  evTitle:"События",mapTitle:"Карта",
  aboutTitle:"О Burundi Astrakhan",
  regTitle:"Вступить",regFirst:"Имя",regLast:"Фамилия",regBirth:"Дата рождения",
  regGen:"Пол",regGenM:"Мужчина",regGenF:"Женщина",regUni:"Университет",regField:"Специальность",
  regYear:"Курс",regArr:"Год приезда",regAddr:"Адрес",regEmail:"Email",
  regWA:"WhatsApp / Telegram",regSkills:"Навыки",regBio:"Краткое био",
  regNotif:"Уведомления",regPub:"Показывать профиль",regBtn:"Зарегистрироваться",arrived:"Приехал в",
  moto:"Мото",ijwi:"Иджви",saba:"Саба",bika:"Бика",
}};

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ── WAVE FLAG CANVAS ─────────────────────────────────────────
function WaveFlagCanvas({width=1200,height=520,mouseX=0,mouseY=0}){
  const cvs=useRef(null);
  const animRef=useRef(null);
  const t=useRef(0);
  useEffect(()=>{
    const c=cvs.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width,H=c.height;
    function draw(){
      t.current+=0.018;
      ctx.clearRect(0,0,W,H);
      const rows=60,cols=120;
      const cw=W/cols,ch=H/rows;
      const mx=(mouseX/window.innerWidth-0.5)*0.3;
      const my=(mouseY/window.innerHeight-0.5)*0.15;
      for(let r=0;r<rows;r++){
        for(let col=0;col<cols;col++){
          const px=col*cw, py=r*ch;
          const cx2=col/cols, cy2=r/rows;
          // wave displacement
          const wave=Math.sin(cx2*6+t.current+cy2*2)*14+Math.sin(cy2*4+t.current*0.7)*6;
          const dx=Math.sin(cy2*5+t.current*0.5+mx*4)*4;
          const light=0.82+0.18*Math.sin(cx2*4+t.current+wave*0.05);
          // color: left=Burundi, right=Russia, blend in center
          let col_r,col_g,col_b;
          const blend=cx2; // 0=Burundi, 1=Russia
          // Burundi: green/red diagonal
          const biAngle=(cx2+cy2)*1.8+(wave*0.01);
          const biG=[30,181,58], biR=[206,17,38];
          const biFrac=(Math.sin(biAngle)*0.5+0.5);
          const bi=[biG[0]*(1-biFrac)+biR[0]*biFrac, biG[1]*(1-biFrac)+biR[1]*biFrac, biG[2]*(1-biFrac)+biR[2]*biFrac];
          // Russia: tricolor
          const rFrac=cy2;
          let ru;
          if(rFrac<0.333) ru=[255,255,255];
          else if(rFrac<0.666) ru=[0,57,166];
          else ru=[213,43,30];
          // blend
          const sw=Math.max(0,Math.min(1,(blend-0.3)/0.5));
          col_r=bi[0]*(1-sw)+ru[0]*sw;
          col_g=bi[1]*(1-sw)+ru[1]*sw;
          col_b=bi[2]*(1-sw)+ru[2]*sw;
          // apply wave lighting
          col_r=Math.min(255,col_r*light);
          col_g=Math.min(255,col_g*light);
          col_b=Math.min(255,col_b*light);
          ctx.fillStyle=`rgb(${col_r|0},${col_g|0},${col_b|0})`;
          // offset each cell by wave
          const ox=dx, oy=wave*cy2*0.5+(my*H*0.05);
          ctx.fillRect(px+ox,py+oy,cw+1,ch+1);
        }
      }
      // white saltire lines (left half)
      ctx.save();
      ctx.globalAlpha=0.18;
      ctx.strokeStyle="#fff";
      ctx.lineWidth=14;
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*0.55,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W*0.55,0);ctx.stroke();
      ctx.restore();
      // center circle + stars
      const cx3=W*0.28, cy3=H*0.5, cr=Math.min(W,H)*0.1;
      ctx.save();
      ctx.globalAlpha=0.92;
      ctx.beginPath();ctx.arc(cx3,cy3,cr,0,Math.PI*2);
      ctx.fillStyle="white";ctx.fill();
      // stars
      [[cx3,cy3-cr*0.45],[cx3-cr*0.38,cy3+cr*0.28],[cx3+cr*0.38,cy3+cr*0.28]].forEach(([sx,sy])=>{
        ctx.beginPath();
        for(let i=0;i<12;i++){
          const a=(i*30-90)*Math.PI/180;
          const sr=i%2===0?cr*0.26:cr*0.11;
          const mx2=sx+sr*Math.cos(a), my2=sy+sr*Math.sin(a);
          i===0?ctx.moveTo(mx2,my2):ctx.lineTo(mx2,my2);
        }
        ctx.closePath();
        ctx.fillStyle="#CE1126";ctx.fill();
      });
      ctx.restore();
      // fabric sheen overlay
      const grad=ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0,"rgba(255,255,255,0)");
      grad.addColorStop(0.4+Math.sin(t.current*0.5)*0.15,"rgba(255,255,255,0.08)");
      grad.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
      animRef.current=requestAnimationFrame(draw);
    }
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[mouseX,mouseY]);
  return <canvas ref={cvs} width={width} height={height} style={{width:"100%",height:"100%",display:"block"}}/>;
}

// ── PARTICLES ────────────────────────────────────────────────
function Particles(){
  const cvs=useRef(null);
  const anim=useRef(null);
  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");
    c.width=c.offsetWidth;c.height=c.offsetHeight;
    const pts=Array.from({length:40},()=>({
      x:Math.random()*c.width,y:Math.random()*c.height,
      vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,
      r:Math.random()*2+0.5,
      col:[G,R,W,"#3b82f6"][Math.floor(Math.random()*4)],
      a:Math.random()
    }));
    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>c.width)p.vx*=-1;
        if(p.y<0||p.y>c.height)p.vy*=-1;
        p.a=0.3+0.5*Math.abs(Math.sin(Date.now()*0.001+p.x));
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col+Math.round(p.a*255).toString(16).padStart(2,"0");
        ctx.fill();
      });
      anim.current=requestAnimationFrame(draw);
    }
    draw();
    return()=>cancelAnimationFrame(anim.current);
  },[]);
  return <canvas ref={cvs} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

// ── AVATAR ───────────────────────────────────────────────────
const Av=memo(({m,size=40})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:m.color,flexShrink:0,
    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
    fontSize:size*0.32,boxShadow:`0 0 12px ${m.color}55`,position:"relative",userSelect:"none"}}>
    {m.avatar}
    {m.online&&<div style={{position:"absolute",bottom:1,right:1,width:size*0.27,height:size*0.27,
      borderRadius:"50%",background:"#22c55e",border:"2px solid #000"}}/>}
  </div>
));

const MCard=memo(({m,full=false})=>{
  const {th}=useApp();
  return(
    <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:16,
      transition:"transform 0.2s,box-shadow 0.2s",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 28px ${m.color}30`}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:full?10:0}}>
        <Av m={m} size={44}/>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:th.tx}}>
            {m.firstname} {m.lastname} {m.isFounder&&"🌟"}
          </div>
          <div style={{color:th.sub,fontSize:11}}>{m.university}</div>
          {m.role&&<div style={{fontSize:10,color:G}}>{m.role}</div>}
        </div>
      </div>
      {full&&<>
        {m.field&&<div style={{fontSize:12,color:th.sub,marginBottom:2}}>📚 {m.field}</div>}
        {m.skills&&<div style={{fontSize:12,color:th.sub,marginBottom:2}}>💡 {m.skills}</div>}
        {m.whatsapp&&<div style={{fontSize:12,color:th.sub}}>📱 {m.whatsapp}</div>}
      </>}
    </div>
  );
});

// ── NAVBAR ───────────────────────────────────────────────────
const Navbar=memo(({sec,setSec,setShowReg,lang,setLang,thK,setThK,scrolled})=>{
  const {th,t}=useApp();
  const [open,setOpen]=useState(false);
  const nav=[
    {k:"home",l:t.navHome},{k:"directory",l:t.navDir},{k:"universities",l:t.navUni},
    {k:"memories",l:t.navMem},{k:"testimonials",l:t.navTest},{k:"forum",l:t.navForum},
    {k:"events",l:t.navEv},{k:"chat",l:t.navChat},{k:"map",l:t.navMap},{k:"about",l:t.navAbout},
  ];
  const go=useCallback(k=>{setSec(k);setOpen(false);},[setSec]);
  return(
    <nav style={{background:scrolled?th.nav:"rgba(0,0,0,0.35)",borderBottom:`1px solid ${scrolled?G+"33":"rgba(255,255,255,0.1)"}`,
      position:"sticky",top:0,zIndex:300,backdropFilter:"blur(16px)",transition:"background 0.4s,border 0.4s"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,cursor:"pointer"}} onClick={()=>go("home")}>
          <span style={{fontSize:22}}>🇧🇮</span>
          <span style={{fontWeight:900,fontSize:14,color:scrolled?th.tx:W,letterSpacing:0.5}}>
            Burundi <span style={{color:G}}>Astrakhan</span>
          </span>
        </div>
        <div style={{display:"flex",gap:1,alignItems:"center"}} className="desk-nav">
          {nav.map(i=>(
            <button key={i.k} onClick={()=>go(i.k)}
              style={{background:sec===i.k?`${G}25`:"transparent",
                color:sec===i.k?G:(scrolled?th.tx:W),
                border:sec===i.k?`1px solid ${G}44`:"1px solid transparent",
                padding:"5px 8px",borderRadius:5,cursor:"pointer",fontSize:11,
                fontWeight:sec===i.k?700:400,whiteSpace:"nowrap"}}>
              {i.l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0}}>
          <button onClick={()=>setShowReg(true)}
            style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",
              padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,
              boxShadow:`0 2px 10px ${G}44`}}>
            + {t.navJoin}
          </button>
          {Object.entries(THEMES).map(([k,v])=>(
            <button key={k} onClick={()=>setThK(k)}
              style={{background:thK===k?`${G}33`:"rgba(255,255,255,0.1)",
                border:`1px solid ${thK===k?G:"rgba(255,255,255,0.15)"}`,
                padding:"4px 7px",borderRadius:5,cursor:"pointer",fontSize:12,
                color:scrolled?th.tx:W}}>
              {v.nm}
            </button>
          ))}
          <button onClick={()=>setLang(l=>l==="fr"?"ru":"fr")}
            style={{background:"rgba(255,255,255,0.1)",color:scrolled?th.tx:W,
              border:"1px solid rgba(255,255,255,0.15)",padding:"4px 8px",borderRadius:5,cursor:"pointer",fontSize:11}}>
            {lang==="fr"?"🇷🇺":"🇫🇷"}
          </button>
          <button onClick={()=>setOpen(o=>!o)} className="hamburger"
            style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",
              color:W,padding:"6px 9px",borderRadius:6,cursor:"pointer",fontSize:15,lineHeight:1}}>
            {open?"✕":"☰"}
          </button>
        </div>
      </div>
      {open&&(
        <div style={{background:th.nav,borderTop:`1px solid ${th.bdr}`,padding:"10px 16px",
          display:"flex",flexDirection:"column",gap:4}} className="mob-menu">
          {nav.map(i=>(
            <button key={i.k} onClick={()=>go(i.k)}
              style={{background:sec===i.k?`${G}22`:"transparent",color:sec===i.k?G:th.tx,
                border:`1px solid ${sec===i.k?G:th.bdr}`,padding:"11px 14px",
                borderRadius:7,cursor:"pointer",fontSize:13,textAlign:"left",fontWeight:sec===i.k?700:400}}>
              {i.l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
});

// ── HERO SECTION ─────────────────────────────────────────────
const HeroSection=memo(({setSec,setShowReg})=>{
  const {t,lang}=useApp();
  const [mouse,setMouse]=useState({x:0,y:0});
  const heroRef=useRef(null);
  useEffect(()=>{
    const h=heroRef.current;if(!h)return;
    const onMove=e=>setMouse({x:e.clientX,y:e.clientY});
    h.addEventListener("mousemove",onMove);
    return()=>h.removeEventListener("mousemove",onMove);
  },[]);
  return(
    <div ref={heroRef} style={{position:"relative",height:"100vh",minHeight:520,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {/* Animated flag background */}
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <WaveFlagCanvas mouseX={mouse.x} mouseY={mouse.y}/>
      </div>
      {/* Particles */}
      <Particles/>
      {/* Dark overlay */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.72) 60%,rgba(0,0,0,0.88) 100%)",zIndex:1}}/>
      {/* Content */}
      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 20px",maxWidth:800,width:"100%"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",letterSpacing:5,textTransform:"uppercase",marginBottom:10,fontWeight:500}}>
          {lang==="fr"?"Plateforme Communautaire · Astrakhan, Russie":"Сообщество · Астрахань, Россия"}
        </div>
        <h1 style={{fontSize:"clamp(28px,7vw,62px)",fontWeight:900,margin:"0 0 12px",color:W,
          textShadow:"0 4px 32px rgba(0,0,0,0.8)",letterSpacing:1,lineHeight:1.1}}>
          {t.heroTitle}
        </h1>
        <p style={{fontSize:"clamp(14px,2.5vw,19px)",color:"rgba(255,255,255,0.85)",
          margin:"0 auto 12px",maxWidth:560,lineHeight:1.65,fontWeight:400}}>
          {t.heroSub}
        </p>
        <div style={{fontSize:"clamp(12px,2vw,15px)",color:G,fontWeight:600,
          letterSpacing:2,marginBottom:36,textTransform:"uppercase"}}>
          {t.heroMotto}
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {l:t.heroCta,ac:()=>setShowReg(true),prim:true},
            {l:t.heroUni,ac:()=>setSec("universities"),prim:false},
            {l:t.heroTest,ac:()=>setSec("testimonials"),prim:false},
          ].map((b,i)=>(
            <button key={i} onClick={b.ac}
              style={{background:b.prim?`linear-gradient(135deg,${G},#15a32b)`:"rgba(255,255,255,0.12)",
                color:W,border:b.prim?"none":"1px solid rgba(255,255,255,0.3)",
                padding:"13px 26px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700,
                backdropFilter:"blur(8px)",transition:"all 0.25s",
                boxShadow:b.prim?`0 4px 24px ${G}55`:"none"}}>
              {b.l}
            </button>
          ))}
        </div>
        {/* Scroll indicator */}
        <div style={{position:"absolute",bottom:-60,left:"50%",transform:"translateX(-50%)",
          color:"rgba(255,255,255,0.4)",fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <div style={{width:1,height:30,background:"linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0.3))"}}/>
          {lang==="fr"?"Défiler":"Прокрутить"}
        </div>
      </div>
    </div>
  );
});

// ── STATS BAR ────────────────────────────────────────────────
const StatsBar=memo(({members,counts})=>{
  const {th,t}=useApp();
  return(
    <div style={{background:`linear-gradient(135deg,${G}18,rgba(0,57,166,0.15))`,
      borderBottom:`1px solid ${G}22`,borderTop:`1px solid ${G}22`,padding:"26px 20px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",
        gridTemplateColumns:"repeat(5,1fr)",gap:10,textAlign:"center"}}>
        {[
          {v:counts.m,l:t.statsM,i:"👥"},{v:counts.y,l:t.statsY,i:"📅"},
          {v:counts.u,l:t.statsU,i:"🎓"},{v:counts.e,l:t.statsE,i:"🗓"},
          {v:2,l:t.statsC,i:"🌍"},
        ].map((s,i)=>(
          <div key={i}>
            <div style={{fontSize:20,marginBottom:4}}>{s.i}</div>
            <div style={{fontSize:30,fontWeight:900,color:G,lineHeight:1}}>{s.v}+</div>
            <div style={{color:th.sub,fontSize:11,marginTop:3}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── EXPLORE CARDS ────────────────────────────────────────────
const ExploreSection=memo(({setSec})=>{
  const {th,t,lang}=useApp();
  const cards=[
    {k:"universities",icon:"🎓",color:"#3b82f6",
      title:lang==="fr"?"Universités":"Университеты",
      desc:lang==="fr"?"Découvrir les établissements et informations académiques.":"Учебные заведения и академическая информация."},
    {k:"directory",icon:"👥",color:G,
      title:lang==="fr"?"Annuaire":"Каталог",
      desc:lang==="fr"?"Retrouver des étudiants et membres de la communauté.":"Студенты и члены сообщества."},
    {k:"forum",icon:"💬",color:"#a855f7",
      title:lang==="fr"?"Forum":"Форум",
      desc:lang==="fr"?"Poser des questions et discuter librement.":"Задавай вопросы и общайся."},
    {k:"events",icon:"🗓",color:"#f59e0b",
      title:lang==="fr"?"Agenda":"События",
      desc:lang==="fr"?"Événements, rencontres et activités.":"Мероприятия и встречи."},
    {k:"memories",icon:"📚",color:R,
      title:lang==="fr"?"Mémoires":"Воспоминания",
      desc:lang==="fr"?"Souvenirs et archives de la communauté.":"Воспоминания и архив."},
    {k:"map",icon:"🗺",color:"#06b6d4",
      title:lang==="fr"?"Carte":"Карта",
      desc:lang==="fr"?"Localiser les universités et lieux importants.":"Университеты и важные места."},
  ];
  return(
    <div style={{padding:"48px 0 36px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <h2 style={{fontSize:"clamp(18px,4vw,28px)",fontWeight:800,color:th.tx,margin:"0 0 8px"}}>
          {t.exploreTitle}
        </h2>
        <div style={{width:48,height:3,background:`linear-gradient(90deg,${G},${R})`,margin:"0 auto",borderRadius:2}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {cards.map(c=>(
          <div key={c.k} onClick={()=>setSec(c.k)}
            style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"22px 20px",
              cursor:"pointer",transition:"all 0.25s",position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 16px 40px ${c.color}25`;e.currentTarget.style.borderColor=c.color+"55"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor=th.bdr}}>
            <div style={{position:"absolute",top:0,right:0,width:80,height:80,
              background:`radial-gradient(circle,${c.color}18,transparent 70%)`,borderRadius:"0 16px 0 80px"}}/>
            <div style={{fontSize:32,marginBottom:12}}>{c.icon}</div>
            <div style={{fontWeight:700,fontSize:15,color:th.tx,marginBottom:6}}>{c.title}</div>
            <div style={{fontSize:13,color:th.sub,lineHeight:1.5}}>{c.desc}</div>
            <div style={{marginTop:14,fontSize:12,color:c.color,fontWeight:600}}>
              {lang==="fr"?"Accéder →":"Перейти →"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── TESTIMONIALS CAROUSEL ────────────────────────────────────
const TestimonialsCarousel=memo(({members})=>{
  const {th,t,lang}=useApp();
  const [idx,setIdx]=useState(0);
  const withBio=useMemo(()=>members.filter(m=>m.bio),[members]);
  if(withBio.length===0)return null;
  const cur=withBio[idx%withBio.length];
  return(
    <div style={{padding:"36px 0",borderTop:`1px solid ${th.bdr}`}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <h2 style={{fontSize:"clamp(16px,3.5vw,24px)",fontWeight:800,color:th.tx,margin:"0 0 8px"}}>{t.testTitle}</h2>
        <div style={{width:40,height:3,background:`linear-gradient(90deg,${G},${R})`,margin:"0 auto",borderRadius:2}}/>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:20,padding:"32px 28px",textAlign:"center",
          boxShadow:`0 8px 32px ${cur.color}18`}}>
          <div style={{fontSize:32,color:G,marginBottom:16,lineHeight:1}}>"</div>
          <p style={{color:th.tx,fontSize:16,lineHeight:1.7,fontStyle:"italic",margin:"0 0 24px"}}>{cur.bio}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <Av m={cur} size={48}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontWeight:700,color:th.tx}}>{cur.firstname} {cur.lastname}</div>
              <div style={{fontSize:12,color:th.sub}}>{cur.university} · {t.arrived} {cur.arrival}</div>
              {cur.role&&<div style={{fontSize:11,color:G}}>{cur.role}</div>}
            </div>
          </div>
        </div>
        {withBio.length>1&&(
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:16}}>
            <button onClick={()=>setIdx(i=>(i-1+withBio.length)%withBio.length)}
              style={{background:th.card,border:`1px solid ${th.bdr}`,color:th.tx,width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:16}}>‹</button>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {withBio.map((_,i)=>(
                <div key={i} onClick={()=>setIdx(i)} style={{width:i===idx%withBio.length?20:7,height:7,
                  borderRadius:4,background:i===idx%withBio.length?G:th.bdr,cursor:"pointer",transition:"all 0.3s"}}/>
              ))}
            </div>
            <button onClick={()=>setIdx(i=>(i+1)%withBio.length)}
              style={{background:th.card,border:`1px solid ${th.bdr}`,color:th.tx,width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:16}}>›</button>
          </div>
        )}
      </div>
    </div>
  );
});

// ── EVENTS PREVIEW ───────────────────────────────────────────
const EventsPreview=memo(({setSec,lang})=>{
  const {th,t}=useApp();
  const today=new Date();
  const upcoming=EVENTS.filter(e=>new Date(e.date)>=today).slice(0,3);
  if(!upcoming.length)return null;
  return(
    <div style={{padding:"36px 0",borderTop:`1px solid ${th.bdr}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h2 style={{fontSize:"clamp(16px,3.5vw,24px)",fontWeight:800,color:th.tx,margin:"0 0 6px"}}>{t.evTitle}</h2>
          <div style={{width:40,height:3,background:`linear-gradient(90deg,${G},${R})`,borderRadius:2}}/>
        </div>
        <button onClick={()=>setSec("events")}
          style={{background:"transparent",color:G,border:`1px solid ${G}44`,
            padding:"7px 14px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>
          {lang==="fr"?"Voir tout →":"Все →"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {upcoming.map((ev,i)=>{
          const d=new Date(ev.date);
          return(
            <div key={i} style={{background:th.card,border:`1px solid ${G}33`,borderRadius:14,padding:"18px 16px",
              display:"flex",gap:14,alignItems:"center"}}>
              <div style={{background:`${G}18`,border:`1px solid ${G}44`,borderRadius:10,
                padding:"10px 12px",textAlign:"center",minWidth:50,flexShrink:0}}>
                <div style={{color:G,fontWeight:900,fontSize:20,lineHeight:1}}>{d.getDate()}</div>
                <div style={{color:th.sub,fontSize:10}}>{d.toLocaleString(lang==="fr"?"fr-FR":"ru-RU",{month:"short"})}</div>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:th.tx,marginBottom:3}}>{ev.icon} {ev.title}</div>
                <div style={{fontSize:11,color:th.sub}}>📍 {ev.place}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ── HOME PAGE ────────────────────────────────────────────────
const HomePage=memo(({members,setSec,setShowReg,counts,pollVotes,setPollVotes,voted,setVoted})=>{
  const {th,t,lang}=useApp();
  const proverb=PROVERBS[new Date().getDate()%PROVERBS.length];
  return(
    <div>
      <HeroSection setSec={setSec} setShowReg={setShowReg}/>
      <StatsBar members={members} counts={counts}/>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px"}}>
        <ExploreSection setSec={setSec}/>
        {/* Proverb */}
        <div style={{background:`linear-gradient(135deg,${G}12,${R}08)`,border:`1px solid ${G}28`,
          borderRadius:16,padding:"22px 26px",textAlign:"center",marginBottom:36}}>
          <div style={{color:G,fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>📖 {t.navHome === "Accueil" ? "Proverbe du jour" : "Пословица дня"}</div>
          <div style={{fontSize:18,fontStyle:"italic",color:th.tx}}>{proverb[lang]}</div>
        </div>
        {/* Poll */}
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"22px 24px",marginBottom:36}}>
          <div style={{color:G,fontWeight:700,marginBottom:12,fontSize:15}}>📊 {lang==="fr"?"Sondage rapide":"Быстрый опрос"}</div>
          <div style={{marginBottom:12,color:th.tx,fontSize:14}}>
            {lang==="fr"?"Quelle année es-tu arrivé à Astrakhan ?":"В каком году ты приехал в Астрахань?"}
          </div>
          {["2018–2019","2020–2021","2022–2023","2024–2026"].map((opt,i)=>{
            const tot=pollVotes.reduce((a,b)=>a+b,0);
            const pct=tot?Math.round(pollVotes[i]/tot*100):0;
            return(
              <button key={i} onClick={()=>{if(!voted){const nv=[...pollVotes];nv[i]++;setPollVotes(nv);setVoted(true);}}}
                style={{display:"block",width:"100%",background:th.inp,border:`1px solid ${voted?G+"55":th.bdr}`,
                  borderRadius:8,padding:"10px 14px",cursor:voted?"default":"pointer",color:th.tx,
                  textAlign:"left",position:"relative",overflow:"hidden",marginBottom:7,transition:"all 0.2s"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:voted?`${pct}%`:"0%",
                  background:`${G}20`,transition:"width 0.7s ease"}}/>
                <span style={{position:"relative",fontSize:13}}>{opt}{voted?` — ${pct}%`:""}</span>
              </button>
            );
          })}
        </div>
        <TestimonialsCarousel members={members}/>
        <EventsPreview setSec={setSec} lang={lang}/>
      </div>
    </div>
  );
});

// ── DIRECTORY ────────────────────────────────────────────────
const DirectoryPage=memo(({members,search,setSearch})=>{
  const {th,t}=useApp();
  const filtered=useMemo(()=>members.filter(m=>m.public&&(
    `${m.firstname} ${m.lastname}`.toLowerCase().includes(search.toLowerCase())||
    m.university?.toLowerCase().includes(search.toLowerCase())||
    m.field?.toLowerCase().includes(search.toLowerCase())
  )),[members,search]);
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:14}}>{t.dirTitle} ({filtered.length})</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.dirSearch}
        style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1px solid ${th.bdr}`,
          background:th.inp,color:th.tx,fontSize:13,marginBottom:16,boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {filtered.map(m=><MCard key={m.id} m={m} full/>)}
      </div>
    </div>
  );
});

// ── UNIVERSITIES ─────────────────────────────────────────────
const UniversitiesPage=memo(({members})=>{
  const {th,t}=useApp();
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.uniTitle}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {UNIVS.map(u=>{
          const ms=members.filter(m=>m.university===u.name||m.university?.includes(u.name.split(" ")[0]));
          return(
            <div key={u.name} style={{background:th.card,border:`1px solid ${u.color}44`,borderRadius:16,padding:"22px 18px",
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:100,height:100,
                background:`radial-gradient(circle,${u.color}15,transparent 70%)`,borderRadius:"0 16px 0 100px"}}/>
              <div style={{fontSize:30,marginBottom:10}}>{u.icon}</div>
              <div style={{fontWeight:700,fontSize:13,color:th.tx,marginBottom:2}}>{u.name}</div>
              <div style={{color:th.sub,fontSize:11,marginBottom:12}}>{u.full}</div>
              <div style={{color:u.color,fontSize:32,fontWeight:900,lineHeight:1}}>{ms.length}</div>
              <div style={{color:th.sub,fontSize:11,marginBottom:12}}>{t.uniStudents}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {ms.map(m=>(
                  <div key={m.id} title={`${m.firstname} ${m.lastname}`}
                    style={{width:32,height:32,borderRadius:"50%",background:m.color,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,
                      boxShadow:`0 0 8px ${m.color}55`}}>
                    {m.avatar}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ── MEMORIES ─────────────────────────────────────────────────
const MemoriesPage=memo(({posts,setPosts,lang})=>{
  const {th,t}=useApp();
  const [txt,setTxt]=useState("");
  const react=useCallback((id,type)=>setPosts(prev=>prev.map(p=>{
    if(p.id!==id)return p;
    if(type==="moto")return{...p,moto:p.liked?p.moto-1:p.moto+1,liked:!p.liked};
    if(type==="bika")return{...p,bika:p.bikaed?p.bika-1:p.bika+1,bikaed:!p.bikaed};
    return{...p,[type]:p[type]+1};
  })),[setPosts]);
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.memTitle}</h2>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:20,marginBottom:20}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <Av m={KELLY} size={38}/>
          <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={3} placeholder={t.memPlaceholder}
            style={{flex:1,padding:"11px 13px",borderRadius:10,border:`1px solid ${th.bdr}`,
              background:th.inp,color:th.tx,fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
          <button onClick={()=>{
            if(!txt.trim())return;
            const emojis=["🌟","🎊","❄️","🌍","🎓","🔥","🌸","💫"];
            setPosts(prev=>[{id:Date.now(),author:"Mugisha L. Kelly",avatar:"MK",color:G,
              text:txt,time:lang==="fr"?"À l'instant":"Сейчас",emoji:emojis[prev.length%emojis.length],
              moto:0,ijwi:0,saba:0,bika:0,liked:false,bikaed:false},...prev]);
            setTxt("");
          }} style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",
            padding:"9px 20px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>
            {t.memNew}
          </button>
        </div>
      </div>
      {posts.length===0&&(
        <div style={{textAlign:"center",padding:"48px",color:th.sub}}>
          <div style={{fontSize:48,marginBottom:14}}>📸</div>
          <div style={{fontSize:15}}>{t.noMemories}</div>
        </div>
      )}
      {posts.map(p=>(
        <div key={p.id} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:20,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <Av m={p} size={38}/>
            <div>
              <div style={{fontWeight:700,color:th.tx}}>{p.author}</div>
              <div style={{fontSize:11,color:th.sub}}>{p.time}</div>
            </div>
            <div style={{marginLeft:"auto",fontSize:24}}>{p.emoji}</div>
          </div>
          <div style={{color:th.tx,lineHeight:1.7,marginBottom:14,fontSize:14}}>{p.text}</div>
          <div style={{display:"flex",gap:5,borderTop:`1px solid ${th.bdr}`,paddingTop:12,flexWrap:"wrap"}}>
            {[{k:"moto",ic:"🔥",l:t.moto,ac:p.liked},{k:"ijwi",ic:"🗣",l:t.ijwi,ac:false},
              {k:"saba",ic:"🌍",l:t.saba,ac:false},{k:"bika",ic:"💎",l:t.bika,ac:p.bikaed}].map(r=>(
              <button key={r.k} onClick={()=>react(p.id,r.k)}
                style={{display:"flex",alignItems:"center",gap:5,background:r.ac?`${G}22`:th.inp,
                  border:`1px solid ${r.ac?G:th.bdr}`,borderRadius:20,padding:"6px 13px",
                  cursor:"pointer",color:r.ac?G:th.sub,fontSize:12,transition:"all 0.2s"}}>
                {r.ic} {r.l} {p[r.k]>0&&<b>{p[r.k]}</b>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

// ── TESTIMONIALS PAGE ────────────────────────────────────────
const TestimonialsPage=memo(({members})=>{
  const {th,t}=useApp();
  const withBio=useMemo(()=>members.filter(m=>m.bio),[members]);
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.testTitle}</h2>
      {withBio.length===0&&(
        <div style={{textAlign:"center",padding:"48px",color:th.sub}}>
          <div style={{fontSize:40,marginBottom:10}}>💬</div><div>{t.testEmpty}</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {withBio.map(m=>(
          <div key={m.id} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"24px 20px",
            display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:28,color:G,lineHeight:1}}>"</div>
            <p style={{color:th.tx,fontStyle:"italic",lineHeight:1.7,margin:0,flex:1}}>{m.bio}</p>
            <div style={{display:"flex",alignItems:"center",gap:10,borderTop:`1px solid ${th.bdr}`,paddingTop:14}}>
              <Av m={m} size={42}/>
              <div>
                <div style={{fontWeight:700,color:th.tx}}>{m.firstname} {m.lastname}</div>
                <div style={{fontSize:11,color:th.sub}}>{m.university} · {t.arrived} {m.arrival}</div>
                {m.role&&<div style={{fontSize:10,color:G}}>{m.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── FORUM PAGE ───────────────────────────────────────────────
const ForumPage=memo(({forum,setForum,lang})=>{
  const {th,t}=useApp();
  const [txt,setTxt]=useState("");
  const post=useCallback(()=>{
    if(!txt.trim())return;
    const tags=["💬 Général","📋 Info","💡 Idée","🆘 Aide"];
    setForum(p=>[{id:Date.now(),author:"Vous",text:txt,replies:0,
      time:lang==="fr"?"À l'instant":"Сейчас",tag:tags[p.length%tags.length],avatar:"👤",color:"#3b82f6"},...p]);
    setTxt("");
  },[txt,lang,setForum]);
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.forumTitle}</h2>
      <div style={{display:"flex",gap:10,marginBottom:18}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder={t.forumAsk}
          onKeyDown={e=>e.key==="Enter"&&post()}
          style={{flex:1,padding:"11px 14px",borderRadius:9,border:`1px solid ${th.bdr}`,
            background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
        <button onClick={post} style={{background:G,color:W,border:"none",padding:"11px 18px",
          borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13}}>
          {t.forumPost}
        </button>
      </div>
      {forum.map(p=>(
        <div key={p.id} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"18px 20px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:10}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:p.color,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{p.avatar}</div>
              <span style={{fontWeight:700,color:G,fontSize:13}}>{p.author}</span>
              <span style={{background:`${G}15`,color:G,border:`1px solid ${G}28`,
                padding:"2px 8px",borderRadius:4,fontSize:10}}>{p.tag}</span>
            </div>
            <span style={{color:th.sub,fontSize:11}}>{p.time}</span>
          </div>
          <div style={{color:th.tx,lineHeight:1.55,fontSize:14}}>{p.text}</div>
          <div style={{color:th.sub,fontSize:12,marginTop:8}}>💬 {p.replies} {lang==="fr"?"réponse(s)":"ответ(а)"}</div>
        </div>
      ))}
    </div>
  );
});

// ── EVENTS PAGE ──────────────────────────────────────────────
const EventsPage=memo(({lang})=>{
  const {th,t}=useApp();
  const today=new Date();
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.evTitle}</h2>
      {EVENTS.map((ev,i)=>{
        const d=new Date(ev.date);const past=d<today;
        return(
          <div key={i} style={{background:th.card,border:`1px solid ${past?th.bdr:`${G}33`}`,
            borderRadius:14,padding:"18px 20px",marginBottom:12,opacity:past?0.45:1,
            display:"flex",gap:16,alignItems:"center"}}>
            <div style={{background:`${G}15`,border:`1px solid ${G}44`,borderRadius:10,
              padding:"10px 14px",textAlign:"center",minWidth:55,flexShrink:0}}>
              <div style={{color:G,fontWeight:900,fontSize:20,lineHeight:1}}>{d.getDate()}</div>
              <div style={{color:th.sub,fontSize:10}}>{d.toLocaleString(lang==="fr"?"fr-FR":"ru-RU",{month:"short"})}</div>
            </div>
            <div style={{fontSize:24}}>{ev.icon}</div>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:th.tx}}>{ev.title}</div>
              <div style={{color:th.sub,fontSize:12,marginTop:3}}>📍 {ev.place}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ── CHAT PAGE ────────────────────────────────────────────────
const ChatPage=memo(({members,msgs,setMsgs,lang})=>{
  const {th,t}=useApp();
  const [inp,setInp]=useState("");
  const [tab,setTab]=useState("group");
  const [typing,setTyping]=useState(false);
  const [calls,setCalls]=useState([]);
  const [callReq,setCallReq]=useState("");
  const [reactions,setReactions]=useState({});
  const msgEnd=useRef(null);
  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=useCallback(()=>{
    if(!inp.trim())return;
    setMsgs(p=>[...p,{id:Date.now(),author:"Vous",avatar:"👤",color:"#3b82f6",text:inp,time:"À l'instant",role:""}]);
    setInp("");
    setTyping(false);
  },[inp,setMsgs]);
  const addReaction=(id,emoji)=>{
    setReactions(r=>({...r,[id]:{...(r[id]||{}),
      [emoji]:((r[id]||{})[emoji]||0)+1}}));
  };
  const EMOJIS=["👍","❤️","😂","🔥","🙏","🇧🇮"];
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>{t.chatTitle}</h2>
      <div style={{display:"grid",gridTemplateColumns:"170px 1fr",gap:14,height:600}}>
        {/* Sidebar */}
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:14,
          display:"flex",flexDirection:"column",gap:0,overflowY:"auto"}}>
          <div style={{fontWeight:700,fontSize:12,color:G,marginBottom:12,letterSpacing:0.5}}>
            🟢 {t.chatOnline} ({members.filter(m=>m.online).length})
          </div>
          {members.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",
              borderBottom:`1px solid ${th.bdr}`}}>
              <Av m={m} size={28}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:th.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {m.firstname} {m.isFounder?"🌟":""}
                </div>
                <div style={{fontSize:10,color:m.online?"#22c55e":th.sub}}>
                  {m.online?(lang==="fr"?"En ligne":"В сети"):(lang==="fr"?"Hors ligne":"Не в сети")}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Main chat */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",gap:6}}>
            {[{k:"group",l:`💬 ${t.chatGroup}`},{k:"calls",l:`📞 ${t.chatCalls}`}].map(tb=>(
              <button key={tb.k} onClick={()=>setTab(tb.k)}
                style={{background:tab===tb.k?`${G}22`:th.card,color:tab===tb.k?G:th.sub,
                  border:`1px solid ${tab===tb.k?G:th.bdr}`,padding:"8px 14px",borderRadius:8,
                  cursor:"pointer",fontSize:12,fontWeight:tab===tb.k?700:400}}>
                {tb.l}
              </button>
            ))}
          </div>
          {tab==="group"&&<>
            <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,
              flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
              {msgs.map(m=>{
                const isMe=m.author==="Vous";
                return(
                  <div key={m.id} style={{display:"flex",gap:8,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
                    {!isMe&&<Av m={m} size={30}/>}
                    <div style={{maxWidth:"72%"}}>
                      {!isMe&&<div style={{fontSize:11,color:th.sub,marginBottom:3,display:"flex",gap:5}}>
                        <span style={{fontWeight:700,color:th.tx}}>{m.author}</span>
                        {m.role&&<span style={{color:G}}>{m.role}</span>}
                        <span>{m.time}</span>
                      </div>}
                      <div style={{background:isMe?`linear-gradient(135deg,${G},#15a32b)`:(th.inp),
                        borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",
                        padding:"10px 14px",fontSize:13,color:isMe?W:th.tx,lineHeight:1.5}}>
                        {m.text}
                      </div>
                      {/* Reactions */}
                      <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap",justifyContent:isMe?"flex-end":"flex-start"}}>
                        {EMOJIS.map(e=>(
                          <button key={e} onClick={()=>addReaction(m.id,e)}
                            style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:12,
                              padding:"2px 6px",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:3,color:th.sub}}>
                            {e}{reactions[m.id]?.[e]>0&&<span style={{color:G,fontWeight:700}}>{reactions[m.id][e]}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {typing&&(
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:G,animation:"pulse 1s infinite"}}/>
                  <div style={{width:8,height:8,borderRadius:"50%",background:G,animation:"pulse 1s infinite 0.2s"}}/>
                  <div style={{width:8,height:8,borderRadius:"50%",background:G,animation:"pulse 1s infinite 0.4s"}}/>
                  <span style={{fontSize:11,color:th.sub,marginLeft:4}}>{lang==="fr"?"En train d'écrire…":"Печатает…"}</span>
                </div>
              )}
              <div ref={msgEnd}/>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:20,cursor:"pointer"}}>😊</span>
              <span style={{fontSize:20,cursor:"pointer"}}>📎</span>
              <input value={inp} onChange={e=>{setInp(e.target.value);setTyping(e.target.value.length>0);}}
                onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.chatPlaceholder}
                style={{flex:1,padding:"11px 14px",borderRadius:10,border:`1px solid ${th.bdr}`,
                  background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
              <button onClick={send}
                style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",
                  padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,flexShrink:0}}>
                {t.chatSend}
              </button>
            </div>
          </>}
          {tab==="calls"&&(
            <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:20,flex:1}}>
              <div style={{fontSize:12,color:th.sub,lineHeight:1.7,
                background:`${R}10`,border:`1px solid ${R}28`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                ⚠️ {t.chatCallInfo}
              </div>
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                <input value={callReq} onChange={e=>setCallReq(e.target.value)} placeholder={t.callPlaceholder}
                  style={{flex:1,padding:"11px 14px",borderRadius:9,border:`1px solid ${th.bdr}`,
                    background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
                <button onClick={()=>{
                  if(!callReq.trim())return;
                  setCalls(p=>[...p,{id:Date.now(),req:callReq,
                    status:lang==="fr"?"⏳ En attente":"⏳ Ожидает",time:lang==="fr"?"À l'instant":"Сейчас"}]);
                  setCallReq("");
                }} style={{background:R,color:W,border:"none",padding:"11px 16px",
                  borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:12}}>
                  {t.chatCallReq}
                </button>
              </div>
              {calls.length===0&&<div style={{textAlign:"center",padding:"30px",color:th.sub,fontSize:13}}>{t.noCalls}</div>}
              {calls.map(c=>(
                <div key={c.id} style={{background:th.inp,border:`1px solid ${th.bdr}`,borderRadius:10,
                  padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600,color:th.tx,fontSize:13}}>{c.req}</div>
                    <div style={{fontSize:11,color:th.sub}}>{c.time}</div>
                  </div>
                  <span style={{background:`${R}18`,color:R,border:`1px solid ${R}33`,
                    padding:"4px 10px",borderRadius:6,fontSize:11}}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ── MAP PAGE ─────────────────────────────────────────────────
const MapPage=memo(()=>{
  const {th,t,lang}=useApp();
  const [hover,setHover]=useState(null);
  const places=[
    {name:"АГТУ",x:72,y:44,icon:"⚙️",color:G,info:lang==="fr"?"Université Technique":"Технический Университет"},
    {name:"АГУ",x:55,y:32,icon:"🏛",color:"#3b82f6",info:lang==="fr"?"Université d'État":"Государственный Университет"},
    {name:"АГМУ",x:38,y:28,icon:"🏥",color:R,info:lang==="fr"?"Académie de Médecine":"Медицинская Академия"},
    {name:"АГПУ",x:82,y:28,icon:"📖",color:"#f59e0b",info:lang==="fr"?"Université Pédagogique":"Педагогический Университет"},
    {name:lang==="fr"?"Kremlin":"Кремль",x:32,y:60,icon:"🏰",color:"#a855f7",info:"Kremlin d'Astrakhan"},
    {name:lang==="fr"?"Gare":"Вокзал",x:48,y:50,icon:"🚂",color:"#06b6d4",info:lang==="fr"?"Gare centrale":"Главный вокзал"},
    {name:lang==="fr"?"Marché":"Рынок",x:45,y:70,icon:"🛒",color:"#f59e0b",info:lang==="fr"?"Grand marché":"Большой рынок"},
    {name:"Волга",x:20,y:50,icon:"🌊",color:"#38bdf8",info:lang==="fr"?"Fleuve Volga":"Река Волга"},
    {name:lang==="fr"?"Mosquée":"Мечеть",x:60,y:68,icon:"🕌",color:"#10b981",info:""},
  ];
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:18}}>🗺 {t.mapTitle}</h2>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:20}}>
        <div style={{position:"relative",borderRadius:12,overflow:"hidden",
          background:"linear-gradient(135deg,#0a1a0a 0%,#0d1520 50%,#0a100a 100%)",
          border:`1px solid ${th.bdr}`,height:380}}>
          {/* Grid */}
          <svg width="100%" height="100%" style={{position:"absolute",inset:0,opacity:0.07}}>
            {Array.from({length:10},(_,i)=>(
              <g key={i}>
                <line x1={`${i*11}%`} y1="0" x2={`${i*11}%`} y2="100%" stroke={G} strokeWidth="0.5"/>
                <line x1="0" y1={`${i*11}%`} x2="100%" y2={`${i*11}%`} stroke={G} strokeWidth="0.5"/>
              </g>
            ))}
          </svg>
          {/* Volga river */}
          <div style={{position:"absolute",left:"5%",top:"48%",width:"16%",height:"8%",
            background:"rgba(56,189,248,0.18)",borderRadius:"50%",border:"1px solid rgba(56,189,248,0.25)",
            transform:"rotate(-8deg)"}}/>
          <div style={{position:"absolute",left:"8%",top:"50%",color:"rgba(56,189,248,0.5)",fontSize:9,fontWeight:600}}>Волга</div>
          {/* Places */}
          {places.map((p,i)=>(
            <div key={i}
              onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
                transform:"translate(-50%,-50%)",zIndex:10,cursor:"pointer",transition:"transform 0.2s",
                ...(hover===i?{transform:"translate(-50%,-50%) scale(1.2)"}:{})}}>
              <div style={{background:"rgba(0,0,0,0.9)",border:`1.5px solid ${p.color}`,borderRadius:8,
                padding:"4px 8px",display:"flex",flexDirection:"column",alignItems:"center",
                boxShadow:`0 2px 12px ${p.color}44`,whiteSpace:"nowrap",minWidth:50}}>
                <span style={{fontSize:14}}>{p.icon}</span>
                <span style={{fontSize:9,color:"#ddd",fontWeight:600}}>{p.name}</span>
              </div>
              {hover===i&&p.info&&(
                <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",
                  background:"rgba(0,0,0,0.95)",border:`1px solid ${p.color}55`,borderRadius:7,
                  padding:"6px 10px",whiteSpace:"nowrap",fontSize:10,color:W,boxShadow:`0 4px 16px black`}}>
                  {p.info}
                </div>
              )}
            </div>
          ))}
          {/* Label */}
          <div style={{position:"absolute",bottom:12,right:14,fontSize:10,color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>
            Astrakhan — Carte schématique
          </div>
        </div>
        {/* Legend */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:16}}>
          {UNIVS.map(u=>(
            <div key={u.name} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:u.color}}/>
              <span style={{fontSize:11,color:th.sub}}>{u.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── ABOUT PAGE ───────────────────────────────────────────────
const AboutPage=memo(({lang})=>{
  const {th,t}=useApp();
  return(
    <div style={{padding:"28px 0"}}>
      <h2 style={{color:G,marginBottom:22}}>{t.aboutTitle}</h2>
      {/* Founder */}
      <div style={{background:`linear-gradient(135deg,${G}12,${RB}10,${R}08)`,
        border:`1px solid ${G}44`,borderRadius:20,padding:"28px 24px",marginBottom:18}}>
        <div style={{fontSize:11,color:G,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:16}}>
          🌟 {lang==="fr"?"Fondateur":"Основатель"}
        </div>
        <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",marginBottom:18}}>
          <div style={{width:80,height:80,borderRadius:"50%",
            background:`linear-gradient(135deg,${G},${R})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:26,
            boxShadow:`0 0 30px ${G}55`}}>MK</div>
          <div>
            <div style={{fontWeight:900,fontSize:24,color:th.tx}}>Mugisha L. Kelly</div>
            <div style={{color:G,fontSize:14,marginBottom:3}}>🌟 Fondateur & Créateur — Burundi Astrakhan</div>
            <div style={{color:th.sub,fontSize:13}}>АГТУ · Astrakhan, Russie 🇷🇺 · {lang==="fr"?"Depuis":"С"} 2023</div>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${th.bdr}`,paddingTop:16,color:th.tx,fontStyle:"italic",
          lineHeight:1.75,fontSize:14}}>
          "{KELLY.bio}"
        </div>
      </div>
      {/* About */}
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"24px 22px",marginBottom:14}}>
        <div style={{fontWeight:700,color:G,marginBottom:14,fontSize:16}}>🌐 {lang==="fr"?"À propos":"О сайте"}</div>
        <p style={{color:th.tx,lineHeight:1.8,margin:"0 0 12px",fontSize:14}}>
          {lang==="fr"
            ?"Burundi Astrakhan est une plateforme communautaire dédiée aux étudiants, anciens étudiants et membres de la diaspora burundaise vivant à Astrakhan et en Russie."
            :"Burundi Astrakhan — платформа для студентов, выпускников и членов бурундийской диаспоры в Астрахани и России."}
        </p>
        <p style={{color:th.tx,lineHeight:1.8,margin:"0 0 12px",fontSize:14}}>
          {lang==="fr"
            ?"Notre mission est de renforcer les liens humains, académiques et culturels entre les communautés, tout en facilitant l'accès aux informations universitaires, aux opportunités et aux échanges d'expériences."
            :"Наша миссия — укреплять человеческие, академические и культурные связи, обеспечивая доступ к университетской информации и обмену опытом."}
        </p>
        <p style={{color:th.tx,lineHeight:1.8,margin:0,fontSize:14}}>
          {lang==="fr"
            ?"Burundi Astrakhan représente un pont entre deux cultures, deux réalités et une vision commune tournée vers l'avenir."
            :"Burundi Astrakhan — мост между двумя культурами, двумя реальностями и общим видением будущего."}
        </p>
      </div>
      {/* Mission */}
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"24px 22px",marginBottom:14}}>
        <div style={{fontWeight:700,color:G,marginBottom:12,fontSize:16}}>🎯 {lang==="fr"?"Mission":"Миссия"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
          {(lang==="fr"?["Informer","Connecter","Préserver","Unir"]:["Информировать","Соединять","Сохранять","Объединять"]).map((m,i)=>(
            <div key={i} style={{background:`${G}12`,border:`1px solid ${G}28`,borderRadius:10,
              padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:6}}>
                {["📢","🔗","📚","🤝"][i]}
              </div>
              <div style={{fontWeight:700,color:G,fontSize:14}}>{m}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Tech */}
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:16,padding:"24px 22px"}}>
        <div style={{fontWeight:700,color:G,marginBottom:12,fontSize:16}}>⚙️ {lang==="fr"?"Technologies":"Технологии"}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {["React","JavaScript","Canvas API","SVG Animation","Claude AI (Anthropic)","CSS3"].map(tech=>(
            <span key={tech} style={{background:`${G}12`,border:`1px solid ${G}28`,
              color:G,padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:500}}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── FOOTER ───────────────────────────────────────────────────
const Footer=memo(({setSec,lang})=>{
  const {th}=useApp();
  const links=[
    {l:lang==="fr"?"Accueil":"Главная",k:"home"},{l:lang==="fr"?"Universités":"Университеты",k:"universities"},
    {l:"Forum",k:"forum"},{l:lang==="fr"?"Agenda":"События",k:"events"},
    {l:lang==="fr"?"À propos":"О нас",k:"about"},
  ];
  return(
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",
      backdropFilter:"blur(12px)",marginTop:48,
      background:"rgba(0,0,0,0.4)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 20px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:32,marginBottom:32,flexWrap:"wrap"}}>
          {/* Brand */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:22}}>🇧🇮</span>
              <span style={{fontWeight:900,fontSize:16,color:W}}>Burundi <span style={{color:G}}>Astrakhan</span></span>
            </div>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1.7,margin:"0 0 16px",maxWidth:260}}>
              {lang==="fr"
                ?"Une plateforme communautaire dédiée aux étudiants et à la diaspora burundaise en Russie."
                :"Платформа для бурундийских студентов и диаспоры в России."}
            </p>
            <div style={{display:"flex",gap:10}}>
              {["📱 Telegram","📸 Instagram","👥 Facebook"].map(s=>(
                <div key={s} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:7,padding:"6px 10px",fontSize:10,color:"rgba(255,255,255,0.4)",cursor:"default"}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          {/* Navigation */}
          <div>
            <div style={{fontWeight:700,color:G,fontSize:12,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>
              {lang==="fr"?"Navigation":"Навигация"}
            </div>
            {links.map(l=>(
              <div key={l.k} onClick={()=>setSec(l.k)}
                style={{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:8,cursor:"pointer",
                  transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color=G}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>
                {l.l}
              </div>
            ))}
          </div>
          {/* Contact */}
          <div>
            <div style={{fontWeight:700,color:G,fontSize:12,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>
              Contact
            </div>
            {["📍 Astrakhan, Russie","🇧🇮 Communauté burundaise","🎓 АГТУ"].map(c=>(
              <div key={c} style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:8}}>{c}</div>
            ))}
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:20,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>
            © 2026 Burundi Astrakhan — {lang==="fr"?"Tous droits réservés.":"Все права защищены."}
          </div>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:12,fontStyle:"italic"}}>
            {lang==="fr"?"Initiative, conception et développement :":"Инициатива, дизайн и разработка :"}{" "}
            <span style={{color:G,fontWeight:700}}>M.K</span>
          </div>
        </div>
      </div>
    </footer>
  );
});

// ── REGISTRATION MODAL ───────────────────────────────────────
const RegModal=memo(({onClose,onRegister})=>{
  const {th,t}=useApp();
  const [form,setForm]=useState({
    firstname:"",lastname:"",birthdate:"",gender:"M",university:UNIVS[0].name,
    field:"",year:"Licence 1",arrival:"2024",address:"",email:"",
    whatsapp:"",skills:"",bio:"",notifBirthday:true,public:true,
  });
  const u=useCallback((k,v)=>setForm(f=>({...f,[k]:v})),[]);
  const inp={width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${th.bdr}`,
    background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"};
  const Lbl=({children})=><label style={{display:"block",color:th.sub,fontSize:12,marginBottom:4}}>{children}</label>;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:500,
      overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:20}}>
      <div style={{background:th.bg,border:`1px solid ${G}55`,borderRadius:18,
        padding:"24px 20px",width:"100%",maxWidth:480,position:"relative",margin:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,
          background:"rgba(255,255,255,0.08)",border:"none",color:th.tx,
          width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
        <h2 style={{color:G,marginTop:0,fontSize:17,marginBottom:20}}>🇧🇮 {t.regTitle}</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:t.regFirst,k:"firstname"},{l:t.regLast,k:"lastname"}].map(f=>(
            <div key={f.k}><Lbl>{f.l}</Lbl><input value={form[f.k]} onChange={e=>u(f.k,e.target.value)} style={inp}/></div>
          ))}
          <div><Lbl>{t.regBirth}</Lbl><input type="date" value={form.birthdate} onChange={e=>u("birthdate",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regGen}</Lbl>
            <select value={form.gender} onChange={e=>u("gender",e.target.value)} style={{...inp}}>
              <option value="M">{t.regGenM}</option><option value="F">{t.regGenF}</option>
            </select>
          </div>
          <div style={{gridColumn:"span 2"}}><Lbl>{t.regUni}</Lbl>
            <select value={form.university} onChange={e=>u("university",e.target.value)} style={{...inp}}>
              {UNIVS.map(v=><option key={v.name} value={v.name}>{v.name} — {v.full}</option>)}
            </select>
          </div>
          <div><Lbl>{t.regField}</Lbl><input value={form.field} onChange={e=>u("field",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regYear}</Lbl>
            <select value={form.year} onChange={e=>u("year",e.target.value)} style={{...inp}}>
              {["Préparatoire","Licence 1","Licence 2","Licence 3","Master 1","Master 2","Doctorat"].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
          <div><Lbl>{t.regArr}</Lbl>
            <select value={form.arrival} onChange={e=>u("arrival",e.target.value)} style={{...inp}}>
              {["2018","2019","2020","2021","2022","2023","2024","2025","2026"].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
          <div><Lbl>{t.regAddr}</Lbl><input value={form.address} onChange={e=>u("address",e.target.value)} placeholder="ул. Победы" style={inp}/></div>
          <div><Lbl>{t.regEmail}</Lbl><input type="email" value={form.email} onChange={e=>u("email",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regWA}</Lbl><input value={form.whatsapp} onChange={e=>u("whatsapp",e.target.value)} style={inp}/></div>
          <div style={{gridColumn:"span 2"}}><Lbl>{t.regSkills}</Lbl><input value={form.skills} onChange={e=>u("skills",e.target.value)} style={inp}/></div>
          <div style={{gridColumn:"span 2"}}><Lbl>{t.regBio}</Lbl>
            <textarea value={form.bio} onChange={e=>u("bio",e.target.value)} rows={2}
              style={{...inp,resize:"vertical"}}/>
          </div>
          <div style={{gridColumn:"span 2",display:"flex",flexDirection:"column",gap:8}}>
            {[{k:"notifBirthday",l:`🎂 ${t.regNotif}`},{k:"public",l:`👁 ${t.regPub}`}].map(cb=>(
              <label key={cb.k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={form[cb.k]} onChange={e=>u(cb.k,e.target.checked)} style={{accentColor:G}}/>
                <span style={{fontSize:12,color:th.sub}}>{cb.l}</span>
              </label>
            ))}
          </div>
        </div>
        <button onClick={()=>form.firstname&&form.lastname&&onRegister(form)}
          style={{marginTop:18,width:"100%",background:`linear-gradient(135deg,${G},#15a32b)`,
            color:W,border:"none",padding:"13px",borderRadius:10,cursor:"pointer",
            fontSize:14,fontWeight:700,boxShadow:`0 4px 20px ${G}44`}}>
          🇧🇮 {t.regBtn}
        </button>
      </div>
    </div>
  );
});

// ── ROOT APP ─────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("fr");
  const [thK,setThK]=useState("night");
  const [sec,setSec]=useState("home");
  const [members,setMembers]=useState([KELLY]);
  const [showReg,setShowReg]=useState(false);
  const [search,setSearch]=useState("");
  const [forum,setForum]=useState([
    {id:1,author:"Mugisha L. Kelly",text:"Bienvenue sur notre forum ! Posez vos questions ici. 🇧🇮",
      replies:0,time:"Aujourd'hui",tag:"📌 Annonce",avatar:"MK",color:G}
  ]);
  const [posts,setPosts]=useState([]);
  const [msgs,setMsgs]=useState([
    {id:1,author:"Mugisha L. Kelly",avatar:"MK",color:G,
      text:"Bienvenue ! 🇧🇮 Ce chat est notre espace commun. N'hésitez pas à vous présenter !",time:"Aujourd'hui",role:"🌟 Fondateur"},
  ]);
  const [pollVotes,setPollVotes]=useState([2,5,8,3]);
  const [voted,setVoted]=useState(false);
  const [counts,setCounts]=useState({m:0,y:0,u:0,e:0});
  const [scrolled,setScrolled]=useState(false);

  const th=THEMES[thK], t=T[lang];

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>80);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    if(sec==="home"){
      let f=0;
      const iv=setInterval(()=>{
        f++;const r=Math.min(f/40,1);
        setCounts({m:Math.round(members.length*r),y:Math.round(7*r),u:Math.round(UNIVS.length*r),e:Math.round(EVENTS.length*r)});
        if(f>=40)clearInterval(iv);
      },25);
      return()=>clearInterval(iv);
    }
  },[sec,members.length]);

  const handleRegister=useCallback(form=>{
    setMembers(p=>[...p,{...form,id:Date.now(),
      avatar:`${form.firstname[0]}${form.lastname[0]}`.toUpperCase(),
      color:COLORS[p.length%COLORS.length],role:"",online:false}]);
    setShowReg(false);setSec("directory");
  },[]);

  const ctx=useMemo(()=>({th,t,lang}),[th,t,lang]);

  return(
    <AppCtx.Provider value={ctx}>
      <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:th.bg,color:th.tx,minHeight:"100vh",transition:"background 0.3s"}}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{overflow-x:hidden}
          input::placeholder,textarea::placeholder{color:#666}
          select option{background:#111}
          ::-webkit-scrollbar{width:5px}
          ::-webkit-scrollbar-thumb{background:${G}55;border-radius:3px}
          .hamburger{display:none!important}
          .desk-nav{display:flex!important}
          @media(max-width:800px){
            .hamburger{display:flex!important;align-items:center;justify-content:center}
            .desk-nav{display:none!important}
          }
          @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
        `}</style>

        <Navbar sec={sec} setSec={setSec} setShowReg={setShowReg}
          lang={lang} setLang={setLang} thK={thK} setThK={setThK} scrolled={scrolled}/>

        {sec==="home"
          ? <HomePage members={members} setSec={setSec} setShowReg={setShowReg}
              counts={counts} pollVotes={pollVotes} setPollVotes={setPollVotes}
              voted={voted} setVoted={setVoted}/>
          : <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px"}}>
              {sec==="directory"&&<DirectoryPage members={members} search={search} setSearch={setSearch}/>}
              {sec==="universities"&&<UniversitiesPage members={members}/>}
              {sec==="memories"&&<MemoriesPage posts={posts} setPosts={setPosts} lang={lang}/>}
              {sec==="testimonials"&&<TestimonialsPage members={members}/>}
              {sec==="forum"&&<ForumPage forum={forum} setForum={setForum} lang={lang}/>}
              {sec==="events"&&<EventsPage lang={lang}/>}
              {sec==="chat"&&<ChatPage members={members} msgs={msgs} setMsgs={setMsgs} lang={lang}/>}
              {sec==="map"&&<MapPage/>}
              {sec==="about"&&<AboutPage lang={lang}/>}
            </div>
        }

        <Footer setSec={setSec} lang={lang}/>
        {showReg&&<RegModal onClose={()=>setShowReg(false)} onRegister={handleRegister}/>}
      </div>
    </AppCtx.Provider>
  );
}