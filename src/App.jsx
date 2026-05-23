import { supabase } from './supabase.js'
import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, memo } from "react";

const G="#1EB53A", R="#CE1126", W="#fff", RB="#0039A6", RR="#D52B1E";
const COLORS=[G,R,"#3b82f6","#a855f7","#f59e0b","#06b6d4","#ec4899","#14b8a6"];
const ADMIN_PWD=import.meta.env.VITE_ADMIN_PWD;

const THEMES={
  night:{bg:"#07090a",card:"rgba(255,255,255,0.04)",bdr:"rgba(255,255,255,0.09)",tx:"#f0f0f0",sub:"#777",inp:"rgba(255,255,255,0.07)",nav:"rgba(7,9,10,0.96)",nm:"🌙"},
  day:{bg:"#f0f4f0",card:"rgba(0,0,0,0.04)",bdr:"rgba(0,0,0,0.09)",tx:"#111",sub:"#555",inp:"rgba(0,0,0,0.06)",nav:"rgba(240,244,240,0.97)",nm:"☀️"},
  ubuntu:{bg:"#0d0805",card:"rgba(206,17,38,0.06)",bdr:"rgba(30,181,58,0.18)",tx:"#f5e0c8",sub:"#a07050",inp:"rgba(255,200,150,0.07)",nav:"rgba(13,8,5,0.97)",nm:"🌍"},
};

const UNIVS=[
  {name:"АГУ",full:"Астраханский государственный университет",icon:"🏛",color:"#3b82f6"},
  {name:"АГТУ",full:"Астраханский государственный технический университет",icon:"⚙️",color:G},
  {name:"АГМУ",full:"Астраханская государственная медицинская академия",icon:"🏥",color:R},
  {name:"АГПУ",full:"Астраханский государственный педагогический университет",icon:"📖",color:"#f59e0b"},
  {name:"Autre",full:"Autre université / Другой",icon:"🎓",color:"#a855f7"},
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

const normalizeMe=(m)=>({...m,isFounder:m.is_founder||m.isFounder||false});

const KELLY={id:0,firstname:"Mugisha L.",lastname:"Kelly",birthdate:"",gender:"M",
  university:"АГТУ",field:"Sciences & Technologies",year:"—",arrival:"2023",
  address:"Astrakhan",email:"",whatsapp:"",skills:"Fondateur & Créateur de la communauté",
  bio:"J'ai créé ce site pour que chaque Burundais à Astrakhan se sente chez lui, même loin de chez lui. Ensemble, on est plus forts.",
  public:true,avatar:"MK",color:G,role:"🌟 Fondateur",isFounder:true,is_founder:true,online:true};

const DEFAULT_MSG={id:1,author:"Mugisha L. Kelly",avatar:"MK",color:G,
  text:"Bienvenue ! 🇧🇮 Ce chat est notre espace commun. N'hésitez pas à vous présenter !",
  time:"Aujourd'hui",role:"🌟 Fondateur"};

const DEFAULT_FORUM={id:1,author:"Mugisha L. Kelly",
  text:"Bienvenue sur notre forum ! Posez vos questions ici. 🇧🇮",
  replies:0,time:"Aujourd'hui",tag:"📌 Annonce",avatar:"MK",color:G,pinned:true};

const ROLES=["","Coordinateur","Co-fondateur","Modérateur","Membre actif"];

// Hook responsive
const useIsMobile=()=>{
  const [isMobile,setIsMobile]=useState(window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);
  return isMobile;
};

const T={fr:{
  navHome:"Accueil",navDir:"Annuaire",navUni:"Universités",navMem:"Mémoires",
  navTest:"Témoignages",navForum:"Forum",navEv:"Agenda",navChat:"Chat",
  navMap:"Carte",navAbout:"À propos",navJoin:"Rejoindre",navAdmin:"Admin",
  heroTitle:"BURUNDI ASTRAKHAN",heroSub:"La plateforme communautaire des étudiants et de la diaspora burundaise à Astrakhan.",
  heroMotto:"Informer. Connecter. Préserver. Unir.",
  heroCta:"Rejoindre la communauté",heroUni:"Universités",heroTest:"Témoignages",
  statsM:"Étudiants",statsY:"Années",statsU:"Universités",statsE:"Événements",statsC:"Cultures",
  exploreTitle:"Explorer la plateforme",
  uniTitle:"Nos universités",uniStudents:"étudiant(s)",
  memTitle:"Mémoires",memNew:"Publier",memPlaceholder:"Partage un souvenir…",noMemories:"Sois le premier à partager !",
  dirTitle:"Annuaire",dirSearch:"Rechercher par nom, filière, université…",
  chatTitle:"Chat",chatOnline:"En ligne",chatGroup:"Discussion générale",chatCalls:"Appels",
  chatSend:"Envoyer",chatCallReq:"Demander un appel",
  chatCallInfo:"Les appels doivent être approuvés par le Fondateur avant confirmation.",
  chatPlaceholder:"Écrire un message…",callPlaceholder:"Motif de l'appel…",noCalls:"Aucun appel planifié.",
  testTitle:"Témoignages",testEmpty:"Les témoignages apparaîtront après les inscriptions.",
  forumTitle:"Forum & Entraide",forumAsk:"Posez une question…",forumPost:"Publier",
  evTitle:"Agenda",mapTitle:"Carte",aboutTitle:"À propos de Burundi Astrakhan",
  regTitle:"Rejoindre la communauté",regFirst:"Prénom",regLast:"Nom",regBirth:"Date de naissance",
  regGen:"Genre",regGenM:"Homme",regGenF:"Femme",regUni:"Université",regField:"Filière",
  regYear:"Niveau",regArr:"Année d'arrivée",regAddr:"Adresse",regEmail:"Email",
  regWA:"WhatsApp / Telegram",regSkills:"Compétences",regBio:"Bio / Témoignage",
  regNotif:"Notifs anniversaires",regPub:"Profil visible",regBtn:"S'inscrire",arrived:"Arrivé en",
  moto:"Moto",ijwi:"Ijwi",saba:"Saba",bika:"Bika",
  adminTitle:"Tableau de bord Admin",adminMembers:"Gestion des membres",adminCalls:"Appels en attente",
  adminPosts:"Modération posts",adminAnnounce:"Épingler une annonce",adminPin:"Épingler",
  adminApprove:"✅ Approuver",adminReject:"❌ Refuser",adminDelete:"🗑 Supprimer",
  adminRole:"Attribuer un rôle",adminBadge:"🛡️ ADMIN",adminLoginTitle:"Accès Administrateur",
  adminPwdLabel:"Mot de passe",adminLoginBtn:"Se connecter",adminLogout:"Déconnexion",
  adminWelcome:"Connecté en tant que Fondateur",adminWrongPwd:"Mot de passe incorrect.",
},ru:{
  navHome:"Главная",navDir:"Каталог",navUni:"Универы",navMem:"Память",
  navTest:"Отзывы",navForum:"Форум",navEv:"События",navChat:"Чат",
  navMap:"Карта",navAbout:"О нас",navJoin:"Вступить",navAdmin:"Адмін",
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
  evTitle:"События",mapTitle:"Карта",aboutTitle:"О Burundi Astrakhan",
  regTitle:"Вступить",regFirst:"Имя",regLast:"Фамилия",regBirth:"Дата рождения",
  regGen:"Пол",regGenM:"Мужчина",regGenF:"Женщина",regUni:"Университет",regField:"Специальность",
  regYear:"Курс",regArr:"Год приезда",regAddr:"Адрес",regEmail:"Email",
  regWA:"WhatsApp / Telegram",regSkills:"Навыки",regBio:"Краткое био",
  regNotif:"Уведомления",regPub:"Показывать профиль",regBtn:"Зарегистрироваться",arrived:"Приехал в",
  moto:"Мото",ijwi:"Иджви",saba:"Саба",bika:"Бика",
  adminTitle:"Панель администратора",adminMembers:"Управление участниками",adminCalls:"Ожидающие звонки",
  adminPosts:"Модерация постов",adminAnnounce:"Закрепить объявление",adminPin:"Закрепить",
  adminApprove:"✅ Одобрить",adminReject:"❌ Отклонить",adminDelete:"🗑 Удалить",
  adminRole:"Назначить роль",adminBadge:"🛡️ ADMIN",adminLoginTitle:"Доступ администратора",
  adminPwdLabel:"Пароль",adminLoginBtn:"Войти",adminLogout:"Выйти",
  adminWelcome:"Подключён как Основатель",adminWrongPwd:"Неверный пароль.",
}};

const AppCtx=createContext(null);
const useApp=()=>useContext(AppCtx);

function WaveFlagCanvas({mouseX=0,mouseY=0}){
  const cvs=useRef(null);const animRef=useRef(null);const t=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");const W=c.width,H=c.height;
    function draw(){
      t.current+=0.018;ctx.clearRect(0,0,W,H);
      const rows=60,cols=120,cw=W/cols,ch=H/rows;
      const mx=(mouseX/window.innerWidth-0.5)*0.3,my=(mouseY/window.innerHeight-0.5)*0.15;
      for(let r=0;r<rows;r++){for(let col=0;col<cols;col++){
        const cx2=col/cols,cy2=r/rows;
        const wave=Math.sin(cx2*6+t.current+cy2*2)*14+Math.sin(cy2*4+t.current*0.7)*6;
        const dx=Math.sin(cy2*5+t.current*0.5+mx*4)*4;
        const light=0.82+0.18*Math.sin(cx2*4+t.current+wave*0.05);
        const biAngle=(cx2+cy2)*1.8+wave*0.01;
        const bF=Math.sin(biAngle)*0.5+0.5;
        const bi=[30+bF*176,181-bF*164,58-bF*58];
        const rFrac=cy2;
        const ru=rFrac<0.333?[255,255,255]:rFrac<0.666?[0,57,166]:[213,43,30];
        const sw=Math.max(0,Math.min(1,(cx2-0.3)/0.5));
        const cr=Math.min(255,(bi[0]*(1-sw)+ru[0]*sw)*light);
        const cg=Math.min(255,(bi[1]*(1-sw)+ru[1]*sw)*light);
        const cb2=Math.min(255,(bi[2]*(1-sw)+ru[2]*sw)*light);
        ctx.fillStyle=`rgb(${cr|0},${cg|0},${cb2|0})`;
        ctx.fillRect(col*cw+dx,r*ch+wave*cy2*0.5+my*H*0.05,cw+1,ch+1);
      }}
      ctx.save();ctx.globalAlpha=0.18;ctx.strokeStyle="#fff";ctx.lineWidth=14;
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*0.55,H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(W*0.55,0);ctx.stroke();
      ctx.restore();
      const cx3=W*0.28,cy3=H*0.5,cr2=Math.min(W,H)*0.1;
      ctx.save();ctx.globalAlpha=0.92;
      ctx.beginPath();ctx.arc(cx3,cy3,cr2,0,Math.PI*2);ctx.fillStyle="white";ctx.fill();
      [[cx3,cy3-cr2*0.45],[cx3-cr2*0.38,cy3+cr2*0.28],[cx3+cr2*0.38,cy3+cr2*0.28]].forEach(([sx,sy])=>{
        ctx.beginPath();
        for(let i=0;i<12;i++){const a=(i*30-90)*Math.PI/180;const sr=i%2===0?cr2*0.26:cr2*0.11;
          i===0?ctx.moveTo(sx+sr*Math.cos(a),sy+sr*Math.sin(a)):ctx.lineTo(sx+sr*Math.cos(a),sy+sr*Math.sin(a));}
        ctx.closePath();ctx.fillStyle="#CE1126";ctx.fill();
      });
      ctx.restore();
      const grad=ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0,"rgba(255,255,255,0)");grad.addColorStop(0.4+Math.sin(t.current*0.5)*0.15,"rgba(255,255,255,0.08)");grad.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
      animRef.current=requestAnimationFrame(draw);
    }
    draw();return()=>cancelAnimationFrame(animRef.current);
  },[mouseX,mouseY]);
  return <canvas ref={cvs} width={1200} height={520} style={{width:"100%",height:"100%",display:"block"}}/>;
}

function Particles(){
  const cvs=useRef(null);const anim=useRef(null);
  useEffect(()=>{
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");c.width=c.offsetWidth;c.height=c.offsetHeight;
    const pts=Array.from({length:40},()=>({x:Math.random()*c.width,y:Math.random()*c.height,
      vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:Math.random()*2+0.5,
      col:[G,R,W,"#3b82f6"][Math.floor(Math.random()*4)],a:Math.random()}));
    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;
        p.a=0.3+0.5*Math.abs(Math.sin(Date.now()*0.001+p.x));
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col+Math.round(p.a*255).toString(16).padStart(2,"0");ctx.fill();});
      anim.current=requestAnimationFrame(draw);}
    draw();return()=>cancelAnimationFrame(anim.current);
  },[]);
  return <canvas ref={cvs} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

const Av=memo(({m,size=40,onClick=null})=>(
  <div onClick={onClick?()=>{if(onClick)onClick();}:undefined}
    style={{width:size,height:size,borderRadius:"50%",background:m.color,flexShrink:0,
      display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,
      fontSize:size*0.32,boxShadow:`0 0 12px ${m.color}55`,position:"relative",userSelect:"none",
      cursor:onClick?"pointer":"default",overflow:"hidden"}}>
    {m.avatar_url
      ?<img src={m.avatar_url} alt={m.avatar} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
      :m.avatar}
    {m.online&&<div style={{position:"absolute",bottom:1,right:1,width:size*0.27,height:size*0.27,
      borderRadius:"50%",background:"#22c55e",border:"2px solid #000"}}/>}
  </div>
));

const MCard=memo(({m,full=false,onDelete,onRole})=>{
  const {th,isAdmin,t}=useApp();
  return(
    <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:16,
      transition:"transform 0.2s,box-shadow 0.2s",cursor:"default",position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 28px ${m.color}30`}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
      {isAdmin&&!m.isFounder&&(
        <div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}>
          <select onChange={e=>onRole&&onRole(m.id,e.target.value)} value={m.role||""}
            style={{fontSize:9,background:"rgba(0,0,0,0.6)",border:`1px solid ${G}44`,color:G,borderRadius:4,padding:"2px 4px",cursor:"pointer"}}>
            {ROLES.map(r=><option key={r} value={r}>{r||"Rôle…"}</option>)}
          </select>
          <button onClick={()=>onDelete&&onDelete(m.id)}
            style={{background:`${R}22`,border:`1px solid ${R}44`,color:R,borderRadius:4,padding:"2px 5px",cursor:"pointer",fontSize:10}}>
            🗑
          </button>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:full?10:0}}>
        <Av m={m} size={44}/>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:th.tx}}>{m.firstname} {m.lastname} {m.isFounder&&"🌟"}</div>
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

const AdminLoginModal=memo(({onClose,onLogin})=>{
  const {th,t}=useApp();
  const [pwd,setPwd]=useState("");const [err,setErr]=useState(false);
  const tryLogin=()=>{if(pwd===ADMIN_PWD){onLogin();onClose();}else{setErr(true);setPwd("");}};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:600,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:th.bg,border:`1px solid ${G}55`,borderRadius:16,padding:"28px 24px",width:"100%",maxWidth:340,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.08)",
          border:"none",color:th.tx,width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:14}}>×</button>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:8}}>🛡️</div>
          <h3 style={{color:G,margin:0,fontSize:16}}>{t.adminLoginTitle}</h3>
          <div style={{color:th.sub,fontSize:12,marginTop:4}}>Burundi Astrakhan</div>
        </div>
        <label style={{display:"block",color:th.sub,fontSize:12,marginBottom:6}}>{t.adminPwdLabel}</label>
        <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&tryLogin()}
          placeholder="••••••••••••"
          style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1px solid ${err?R:th.bdr}`,
            background:th.inp,color:th.tx,fontSize:14,boxSizing:"border-box",marginBottom:err?6:14}}/>
        {err&&<div style={{color:R,fontSize:12,marginBottom:10}}>⚠️ {t.adminWrongPwd}</div>}
        <button onClick={tryLogin}
          style={{width:"100%",background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",
            padding:"12px",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700,
            boxShadow:`0 4px 18px ${G}44`}}>
          🛡️ {t.adminLoginBtn}
        </button>
      </div>
    </div>
  );
});

const AdminPage=memo(({members,setMembers,forum,setForum,posts,setPosts,calls,setCalls})=>{
  const {th,t,lang}=useApp();
  const isMobile=useIsMobile();
  const [announce,setAnnounce]=useState("");
  const pendingCalls=calls.filter(c=>c.status.includes("attente")||c.status.includes("Ожидает"));

  const approveCall=async(id)=>{await supabase.from("calls").update({status:"✅ Approuvé"}).eq("id",id);setCalls(p=>p.map(c=>c.id===id?{...c,status:"✅ Approuvé"}:c));};
  const rejectCall=async(id)=>{await supabase.from("calls").update({status:"❌ Refusé"}).eq("id",id);setCalls(p=>p.map(c=>c.id===id?{...c,status:"❌ Refusé"}:c));};
  const deletePost=async(id)=>{await supabase.from("posts").delete().eq("id",id);setPosts(p=>p.filter(x=>x.id!==id));};
  const deleteForum=async(id)=>{await supabase.from("forum").delete().eq("id",id);setForum(p=>p.filter(x=>x.id!==id));};
  const removeMember=async(id)=>{await supabase.from("members").delete().eq("id",id);setMembers(p=>p.filter(m=>m.id!==id));};
  const setRole=async(id,role)=>{await supabase.from("members").update({role}).eq("id",id);setMembers(p=>p.map(m=>m.id===id?{...m,role}:m));};
  const pinAnnounce=async()=>{
    if(!announce.trim())return;
    const newPost={id:Date.now(),author:"Mugisha L. Kelly",text:announce,replies:0,time:lang==="fr"?"À l'instant":"Сейчас",tag:"📌 Annonce officielle",avatar:"MK",color:G,pinned:true};
    await supabase.from("forum").insert([newPost]);setForum(p=>[newPost,...p]);setAnnounce("");
  };

  const Box=({children,title,color=G})=>(
    <div style={{background:th.card,border:`1px solid ${color}33`,borderRadius:14,padding:isMobile?14:20,marginBottom:16}}>
      <div style={{fontWeight:700,color,fontSize:14,marginBottom:14}}>{title}</div>
      {children}
    </div>
  );

  return(
    <div style={{padding:"20px 0"}}>
      <div style={{background:`linear-gradient(135deg,${G}18,${RB}12)`,border:`1px solid ${G}44`,
        borderRadius:16,padding:isMobile?"16px 14px":"20px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{fontSize:isMobile?32:44}}>🛡️</div>
          <div>
            <h2 style={{color:G,margin:0,fontSize:isMobile?16:20}}>{t.adminTitle}</h2>
            <div style={{color:th.sub,fontSize:12,marginTop:3}}>{t.adminWelcome}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{l:`👥 ${members.length}`,d:lang==="fr"?"membres":"участников",c:G},
            {l:`⏳ ${pendingCalls.length}`,d:lang==="fr"?"appels":"звонков",c:"#f59e0b"},
            {l:`📝 ${posts.length}`,d:"posts",c:"#3b82f6"},
          ].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${s.c}33`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:900,color:s.c}}>{s.l}</div>
              <div style={{fontSize:10,color:th.sub}}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <Box title={`📢 ${t.adminAnnounce}`}>
        <div style={{display:"flex",gap:8,flexDirection:isMobile?"column":"row"}}>
          <input value={announce} onChange={e=>setAnnounce(e.target.value)}
            placeholder={lang==="fr"?"Texte de l'annonce…":"Текст объявления…"}
            style={{flex:1,padding:"10px 12px",borderRadius:7,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
          <button onClick={pinAnnounce}
            style={{background:G,color:W,border:"none",padding:"10px 16px",borderRadius:7,cursor:"pointer",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>
            📌 {t.adminPin}
          </button>
        </div>
      </Box>

      <Box title={`📞 ${t.adminCalls} (${pendingCalls.length})`} color="#f59e0b">
        {pendingCalls.length===0
          ?<div style={{color:th.sub,fontSize:13}}>{t.noCalls}</div>
          :pendingCalls.map(c=>(
            <div key={c.id} style={{background:th.inp,borderRadius:8,padding:"10px 14px",marginBottom:8}}>
              <div style={{fontWeight:600,color:th.tx,fontSize:13,marginBottom:6}}>{c.req}</div>
              <div style={{fontSize:11,color:th.sub,marginBottom:8}}>{c.time}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>approveCall(c.id)} style={{flex:1,background:`${G}22`,border:`1px solid ${G}`,color:G,padding:"7px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700}}>{t.adminApprove}</button>
                <button onClick={()=>rejectCall(c.id)} style={{flex:1,background:`${R}22`,border:`1px solid ${R}`,color:R,padding:"7px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700}}>{t.adminReject}</button>
              </div>
            </div>
          ))}
      </Box>

      <Box title={`👥 ${t.adminMembers}`}>
        {members.filter(m=>!m.isFounder).map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,background:th.inp,borderRadius:8,padding:"10px 12px",marginBottom:8,flexWrap:"wrap"}}>
            <Av m={m} size={32}/>
            <div style={{flex:1,minWidth:100}}>
              <div style={{fontWeight:600,fontSize:13,color:th.tx}}>{m.firstname} {m.lastname}</div>
              <div style={{fontSize:11,color:th.sub}}>{m.university}</div>
            </div>
            <select value={m.role||""} onChange={e=>setRole(m.id,e.target.value)}
              style={{padding:"5px 8px",borderRadius:6,border:`1px solid ${G}44`,background:"rgba(0,0,0,0.4)",color:G,fontSize:11,cursor:"pointer"}}>
              {ROLES.map(r=><option key={r} value={r}>{r||lang==="fr"?"Rôle…":"Роль…"}</option>)}
            </select>
            <button onClick={()=>removeMember(m.id)} style={{background:`${R}22`,border:`1px solid ${R}44`,color:R,padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑</button>
          </div>
        ))}
        {members.filter(m=>!m.isFounder).length===0&&<div style={{color:th.sub,fontSize:13}}>{lang==="fr"?"Aucun membre inscrit.":"Нет участников."}</div>}
      </Box>

      <Box title={`📝 ${t.adminPosts}`} color="#3b82f6">
        {posts.length===0?<div style={{color:th.sub,fontSize:13}}>{lang==="fr"?"Aucun post.":"Нет постов."}</div>
          :posts.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:th.inp,borderRadius:8,padding:"10px 14px",marginBottom:8,gap:10}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:12,color:th.tx}}>{p.author}</div>
                <div style={{fontSize:12,color:th.sub,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.text}</div>
              </div>
              <button onClick={()=>deletePost(p.id)} style={{background:`${R}22`,border:`1px solid ${R}44`,color:R,padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑</button>
            </div>
          ))}
      </Box>

      <Box title={`💬 ${lang==="fr"?"Modération forum":"Модерация форума"}`} color="#a855f7">
        {forum.map(p=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:th.inp,borderRadius:8,padding:"10px 14px",marginBottom:8,gap:10}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:12,color:th.tx}}>{p.author} <span style={{color:G,fontSize:10}}>{p.tag}</span></div>
              <div style={{fontSize:12,color:th.sub,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.text}</div>
            </div>
            {!p.tag?.includes("📌")&&<button onClick={()=>deleteForum(p.id)} style={{background:`${R}22`,border:`1px solid ${R}44`,color:R,padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑</button>}
          </div>
        ))}
      </Box>
    </div>
  );
});

const Navbar=memo(({sec,setSec,setShowReg,setShowAdminLogin,lang,setLang,thK,setThK,scrolled,isAdmin,onLogout})=>{
  const {th,t}=useApp();
  const [open,setOpen]=useState(false);
  const nav=[
    {k:"home",l:t.navHome},{k:"directory",l:t.navDir},{k:"universities",l:t.navUni},
    {k:"memories",l:t.navMem},{k:"testimonials",l:t.navTest},{k:"forum",l:t.navForum},
    {k:"events",l:t.navEv},{k:"chat",l:t.navChat},{k:"map",l:t.navMap},{k:"about",l:t.navAbout},
    {k:"profile",l:lang==="fr"?"Mon profil":"Профиль"},
  ];
  const go=useCallback(k=>{setSec(k);setOpen(false);},[setSec]);
  return(
    <nav style={{background:scrolled?th.nav:"rgba(0,0,0,0.35)",borderBottom:`1px solid ${scrolled?G+"33":"rgba(255,255,255,0.1)"}`,
      position:"sticky",top:0,zIndex:300,backdropFilter:"blur(16px)",transition:"background 0.4s"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 12px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,cursor:"pointer"}} onClick={()=>go("home")}>
          <span style={{fontSize:20}}>🇧🇮</span>
          <span style={{fontWeight:900,fontSize:13,color:scrolled?th.tx:W}}>Burundi <span style={{color:G}}>Astrakhan</span></span>
        </div>
        <div style={{display:"flex",gap:1,alignItems:"center"}} className="desk-nav">
          {nav.map(i=>(
            <button key={i.k} onClick={()=>go(i.k)}
              style={{background:sec===i.k?`${G}25`:"transparent",color:sec===i.k?G:(scrolled?th.tx:W),
                border:sec===i.k?`1px solid ${G}44`:"1px solid transparent",
                padding:"5px 7px",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:sec===i.k?700:400,whiteSpace:"nowrap"}}>
              {i.l}
            </button>
          ))}
          {isAdmin&&<button onClick={()=>go("admin")} style={{background:sec==="admin"?`${G}33`:`${G}18`,color:G,border:`1px solid ${G}55`,padding:"5px 9px",borderRadius:5,cursor:"pointer",fontSize:10,fontWeight:700}}>🛡️ {t.navAdmin}</button>}
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
          <button onClick={()=>setShowReg(true)}
            style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",
              padding:"6px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,boxShadow:`0 2px 10px ${G}44`}}>
            + {t.navJoin}
          </button>
          {isAdmin?(
            <div style={{display:"flex",gap:3,alignItems:"center"}}>
              <div style={{background:`${G}22`,border:`1px solid ${G}`,borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,color:G}}>🛡️</div>
              <button onClick={onLogout} style={{background:`${R}22`,border:`1px solid ${R}44`,color:R,padding:"4px 7px",borderRadius:5,cursor:"pointer",fontSize:10}}>{t.adminLogout}</button>
            </div>
          ):(
            <button onClick={()=>setShowAdminLogin(true)} title="Admin"
              style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.4)",padding:"4px 7px",borderRadius:5,cursor:"pointer",fontSize:12}}>🔐</button>
          )}
          <div className="desk-nav" style={{display:"flex",gap:3}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <button key={k} onClick={()=>setThK(k)}
                style={{background:thK===k?`${G}33`:"rgba(255,255,255,0.1)",border:`1px solid ${thK===k?G:"rgba(255,255,255,0.15)"}`,
                  padding:"4px 6px",borderRadius:5,cursor:"pointer",fontSize:11,color:scrolled?th.tx:W}}>{v.nm}</button>
            ))}
          </div>
          <button onClick={()=>setLang(l=>l==="fr"?"ru":"fr")}
            style={{background:"rgba(255,255,255,0.1)",color:scrolled?th.tx:W,border:"1px solid rgba(255,255,255,0.15)",padding:"4px 7px",borderRadius:5,cursor:"pointer",fontSize:11}}>
            {lang==="fr"?"🇷🇺":"🇫🇷"}
          </button>
          <button onClick={()=>setOpen(o=>!o)} className="hamburger"
            style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",color:W,padding:"6px 9px",borderRadius:6,cursor:"pointer",fontSize:15,lineHeight:1}}>
            {open?"✕":"☰"}
          </button>
        </div>
      </div>
      {open&&(
        <div style={{background:th.nav,borderTop:`1px solid ${th.bdr}`,padding:"10px 12px",display:"flex",flexDirection:"column",gap:3,maxHeight:"80vh",overflowY:"auto"}}>
          {[...nav,isAdmin?{k:"admin",l:`🛡️ ${t.navAdmin}`}:null].filter(Boolean).map(i=>(
            <button key={i.k} onClick={()=>go(i.k)}
              style={{background:sec===i.k?`${G}22`:"transparent",color:sec===i.k?G:th.tx,
                border:`1px solid ${sec===i.k?G:th.bdr}`,padding:"12px 14px",
                borderRadius:7,cursor:"pointer",fontSize:14,textAlign:"left",fontWeight:sec===i.k?700:400}}>
              {i.l}
            </button>
          ))}
          <div style={{display:"flex",gap:6,paddingTop:8,borderTop:`1px solid ${th.bdr}`,flexWrap:"wrap"}}>
            {Object.entries(THEMES).map(([k,v])=>(
              <button key={k} onClick={()=>{setThK(k);setOpen(false);}}
                style={{background:thK===k?`${G}22`:th.inp,border:`1px solid ${thK===k?G:th.bdr}`,
                  color:th.tx,padding:"8px 12px",borderRadius:6,cursor:"pointer",fontSize:13}}>
                {v.nm} {k==="night"?"Nuit":k==="day"?"Jour":"Ubuntu"}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
});

const HeroSection=memo(({setSec,setShowReg})=>{
  const {t,lang}=useApp();
  const isMobile=useIsMobile();
  const [mouse,setMouse]=useState({x:0,y:0});
  const heroRef=useRef(null);
  useEffect(()=>{
    const h=heroRef.current;if(!h)return;
    const onMove=e=>setMouse({x:e.clientX,y:e.clientY});
    h.addEventListener("mousemove",onMove);return()=>h.removeEventListener("mousemove",onMove);
  },[]);
  return(
    <div ref={heroRef} style={{position:"relative",height:isMobile?"85vh":"100vh",minHeight:480,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,zIndex:0}}><WaveFlagCanvas mouseX={mouse.x} mouseY={mouse.y}/></div>
      <Particles/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.72) 60%,rgba(0,0,0,0.88) 100%)",zIndex:1}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 16px",maxWidth:800,width:"100%"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>
          {lang==="fr"?"Plateforme Communautaire · Astrakhan":"Сообщество · Астрахань"}
        </div>
        <h1 style={{fontSize:"clamp(24px,8vw,62px)",fontWeight:900,margin:"0 0 10px",color:W,textShadow:"0 4px 32px rgba(0,0,0,0.8)",letterSpacing:1}}>{t.heroTitle}</h1>
        <p style={{fontSize:"clamp(13px,3vw,19px)",color:"rgba(255,255,255,0.85)",margin:"0 auto 10px",maxWidth:500,lineHeight:1.6}}>{t.heroSub}</p>
        <div style={{fontSize:"clamp(11px,2.5vw,15px)",color:G,fontWeight:600,letterSpacing:2,marginBottom:28,textTransform:"uppercase"}}>{t.heroMotto}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          {[{l:t.heroCta,ac:()=>setShowReg(true),prim:true},{l:t.heroUni,ac:()=>setSec("universities"),prim:false},{l:t.heroTest,ac:()=>setSec("testimonials"),prim:false}].map((b,i)=>(
            <button key={i} onClick={b.ac}
              style={{background:b.prim?`linear-gradient(135deg,${G},#15a32b)`:"rgba(255,255,255,0.12)",
                color:W,border:b.prim?"none":"1px solid rgba(255,255,255,0.3)",
                padding:isMobile?"11px 18px":"13px 26px",borderRadius:8,cursor:"pointer",
                fontSize:isMobile?13:14,fontWeight:700,backdropFilter:"blur(8px)",
                boxShadow:b.prim?`0 4px 24px ${G}55`:"none"}}>{b.l}</button>
          ))}
        </div>
      </div>
    </div>
  );
});

const StatsBar=memo(({members,counts})=>{
  const {th,t}=useApp();
  const isMobile=useIsMobile();
  return(
    <div style={{background:`linear-gradient(135deg,${G}18,rgba(0,57,166,0.15))`,borderBottom:`1px solid ${G}22`,borderTop:`1px solid ${G}22`,padding:"20px 16px"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",
        gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(5,1fr)",gap:8,textAlign:"center"}}>
        {[{v:counts.m,l:t.statsM,i:"👥"},{v:counts.y,l:t.statsY,i:"📅"},{v:counts.u,l:t.statsU,i:"🎓"},{v:counts.e,l:t.statsE,i:"🗓"},{v:2,l:t.statsC,i:"🌍"}]
          .slice(0,isMobile?3:5)
          .map((s,i)=>(
          <div key={i}><div style={{fontSize:16,marginBottom:3}}>{s.i}</div><div style={{fontSize:isMobile?22:28,fontWeight:900,color:G,lineHeight:1}}>{s.v}+</div><div style={{color:th.sub,fontSize:10,marginTop:2}}>{s.l}</div></div>
        ))}
      </div>
    </div>
  );
});

const ExploreSection=memo(({setSec})=>{
  const {th,t,lang}=useApp();
  const cards=[
    {k:"universities",icon:"🎓",color:"#3b82f6",title:lang==="fr"?"Universités":"Университеты",desc:lang==="fr"?"Infos académiques.":"Учебные заведения."},
    {k:"directory",icon:"👥",color:G,title:lang==="fr"?"Annuaire":"Каталог",desc:lang==="fr"?"Membres.":"Члены сообщества."},
    {k:"forum",icon:"💬",color:"#a855f7",title:lang==="fr"?"Forum":"Форум",desc:lang==="fr"?"Discussions.":"Обсуждения."},
    {k:"events",icon:"🗓",color:"#f59e0b",title:lang==="fr"?"Agenda":"События",desc:lang==="fr"?"Événements.":"Мероприятия."},
    {k:"memories",icon:"📚",color:R,title:lang==="fr"?"Mémoires":"Воспоминания",desc:lang==="fr"?"Souvenirs.":"Архив."},
    {k:"map",icon:"🗺",color:"#06b6d4",title:lang==="fr"?"Carte":"Карта",desc:lang==="fr"?"Lieux clés.":"Важные места."},
  ];
  return(
    <div style={{padding:"36px 0 28px"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <h2 style={{fontSize:"clamp(16px,4vw,28px)",fontWeight:800,color:th.tx,margin:"0 0 8px"}}>{t.exploreTitle}</h2>
        <div style={{width:48,height:3,background:`linear-gradient(90deg,${G},${R})`,margin:"0 auto",borderRadius:2}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
        {cards.map(c=>(
          <div key={c.k} onClick={()=>setSec(c.k)}
            style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"18px 14px",cursor:"pointer",transition:"all 0.25s",position:"relative",overflow:"hidden"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c.color}25`;e.currentTarget.style.borderColor=c.color+"55"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor=th.bdr}}>
            <div style={{position:"absolute",top:0,right:0,width:60,height:60,background:`radial-gradient(circle,${c.color}18,transparent 70%)`,borderRadius:"0 14px 0 60px"}}/>
            <div style={{fontSize:26,marginBottom:8}}>{c.icon}</div>
            <div style={{fontWeight:700,fontSize:13,color:th.tx,marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:11,color:th.sub,lineHeight:1.4}}>{c.desc}</div>
            <div style={{marginTop:10,fontSize:11,color:c.color,fontWeight:600}}>{lang==="fr"?"→":"→"}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const TestimonialsCarousel=memo(({members})=>{
  const {th,t,lang}=useApp();
  const [idx,setIdx]=useState(0);
  const withBio=useMemo(()=>members.filter(m=>m.bio),[members]);
  if(!withBio.length)return null;
  const cur=withBio[idx%withBio.length];
  return(
    <div style={{padding:"28px 0",borderTop:`1px solid ${th.bdr}`}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <h2 style={{fontSize:"clamp(15px,3.5vw,24px)",fontWeight:800,color:th.tx,margin:"0 0 8px"}}>{t.testTitle}</h2>
        <div style={{width:40,height:3,background:`linear-gradient(90deg,${G},${R})`,margin:"0 auto",borderRadius:2}}/>
      </div>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:18,padding:"24px 20px",textAlign:"center",boxShadow:`0 8px 32px ${cur.color}18`}}>
          <div style={{fontSize:28,color:G,marginBottom:12}}>"</div>
          <p style={{color:th.tx,fontSize:15,lineHeight:1.7,fontStyle:"italic",margin:"0 0 20px"}}>{cur.bio}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <Av m={cur} size={44}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontWeight:700,color:th.tx,fontSize:14}}>{cur.firstname} {cur.lastname}</div>
              <div style={{fontSize:11,color:th.sub}}>{cur.university}</div>
              {cur.role&&<div style={{fontSize:10,color:G}}>{cur.role}</div>}
            </div>
          </div>
        </div>
        {withBio.length>1&&(
          <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14}}>
            <button onClick={()=>setIdx(i=>(i-1+withBio.length)%withBio.length)} style={{background:th.card,border:`1px solid ${th.bdr}`,color:th.tx,width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:15}}>‹</button>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>{withBio.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:i===idx%withBio.length?18:6,height:6,borderRadius:3,background:i===idx%withBio.length?G:th.bdr,cursor:"pointer",transition:"all 0.3s"}}/>)}</div>
            <button onClick={()=>setIdx(i=>(i+1)%withBio.length)} style={{background:th.card,border:`1px solid ${th.bdr}`,color:th.tx,width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:15}}>›</button>
          </div>
        )}
      </div>
    </div>
  );
});

const EventsPreview=memo(({setSec,lang})=>{
  const {th,t}=useApp();
  const today=new Date();
  const upcoming=EVENTS.filter(e=>new Date(e.date)>=today).slice(0,3);
  if(!upcoming.length)return null;
  return(
    <div style={{padding:"28px 0",borderTop:`1px solid ${th.bdr}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{fontSize:"clamp(15px,3.5vw,24px)",fontWeight:800,color:th.tx,margin:"0 0 6px"}}>{t.evTitle}</h2><div style={{width:40,height:3,background:`linear-gradient(90deg,${G},${R})`,borderRadius:2}}/></div>
        <button onClick={()=>setSec("events")} style={{background:"transparent",color:G,border:`1px solid ${G}44`,padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600}}>{lang==="fr"?"Voir tout →":"Все →"}</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {upcoming.map((ev,i)=>{const d=new Date(ev.date);return(
          <div key={i} style={{background:th.card,border:`1px solid ${G}33`,borderRadius:12,padding:"14px 16px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{background:`${G}18`,border:`1px solid ${G}44`,borderRadius:10,padding:"8px 10px",textAlign:"center",minWidth:44,flexShrink:0}}>
              <div style={{color:G,fontWeight:900,fontSize:18,lineHeight:1}}>{d.getDate()}</div>
              <div style={{color:th.sub,fontSize:9}}>{d.toLocaleString(lang==="fr"?"fr-FR":"ru-RU",{month:"short"})}</div>
            </div>
            <div><div style={{fontWeight:700,fontSize:13,color:th.tx,marginBottom:2}}>{ev.icon} {ev.title}</div><div style={{fontSize:11,color:th.sub}}>📍 {ev.place}</div></div>
          </div>
        );})}
      </div>
    </div>
  );
});

const HomePage=memo(({members,setSec,setShowReg,counts,pollVotes,setPollVotes,voted,setVoted})=>{
  const {th,t,lang}=useApp();
  const proverb=PROVERBS[new Date().getDate()%PROVERBS.length];
  return(
    <div>
      <HeroSection setSec={setSec} setShowReg={setShowReg}/>
      <StatsBar members={members} counts={counts}/>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 14px"}}>
        <ExploreSection setSec={setSec}/>
        <div style={{background:`linear-gradient(135deg,${G}12,${R}08)`,border:`1px solid ${G}28`,borderRadius:14,padding:"18px 20px",textAlign:"center",marginBottom:28}}>
          <div style={{color:G,fontWeight:700,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>📖 {lang==="fr"?"Proverbe du jour":"Пословица дня"}</div>
          <div style={{fontSize:16,fontStyle:"italic",color:th.tx}}>{proverb[lang]}</div>
        </div>
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"18px 16px",marginBottom:28}}>
          <div style={{color:G,fontWeight:700,marginBottom:10,fontSize:14}}>📊 {lang==="fr"?"Sondage rapide":"Быстрый опрос"}</div>
          <div style={{marginBottom:10,color:th.tx,fontSize:13}}>{lang==="fr"?"Quelle année es-tu arrivé ?":"В каком году ты приехал?"}</div>
          {["2018–2019","2020–2021","2022–2023","2024–2026"].map((opt,i)=>{
            const tot=pollVotes.reduce((a,b)=>a+b,0);const pct=tot?Math.round(pollVotes[i]/tot*100):0;
            return(<button key={i} onClick={()=>{if(!voted){const nv=[...pollVotes];nv[i]++;setPollVotes(nv);setVoted(true);}}}
              style={{display:"block",width:"100%",background:th.inp,border:`1px solid ${voted?G+"55":th.bdr}`,borderRadius:8,padding:"9px 12px",cursor:voted?"default":"pointer",color:th.tx,textAlign:"left",position:"relative",overflow:"hidden",marginBottom:6,transition:"all 0.2s"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:voted?`${pct}%`:"0%",background:`${G}20`,transition:"width 0.7s ease"}}/>
              <span style={{position:"relative",fontSize:13}}>{opt}{voted?` — ${pct}%`:""}</span>
            </button>);
          })}
        </div>
        <TestimonialsCarousel members={members}/>
        <EventsPreview setSec={setSec} lang={lang}/>
      </div>
    </div>
  );
});

const DirectoryPage=memo(({members,setMembers,search,setSearch})=>{
  const {th,t}=useApp();
  const filtered=useMemo(()=>members.filter(m=>m.public&&(`${m.firstname} ${m.lastname}`.toLowerCase().includes(search.toLowerCase())||m.university?.toLowerCase().includes(search.toLowerCase())||m.field?.toLowerCase().includes(search.toLowerCase()))),[members,search]);
  const removeMember=async(id)=>{await supabase.from("members").delete().eq("id",id);setMembers(p=>p.filter(m=>m.id!==id));};
  const setRole=async(id,role)=>{await supabase.from("members").update({role}).eq("id",id);setMembers(p=>p.map(m=>m.id===id?{...m,role}:m));};
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:12,fontSize:"clamp(16px,4vw,24px)"}}>{t.dirTitle} ({filtered.length})</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.dirSearch}
        style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,marginBottom:14,boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
        {filtered.map(m=><MCard key={m.id} m={m} full onDelete={removeMember} onRole={setRole}/>)}
      </div>
    </div>
  );
});

const UniversitiesPage=memo(({members})=>{
  const {th,t}=useApp();
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>{t.uniTitle}</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
        {UNIVS.map(u=>{const ms=members.filter(m=>m.university===u.name||m.university?.includes(u.name.split(" ")[0]));return(
          <div key={u.name} style={{background:th.card,border:`1px solid ${u.color}44`,borderRadius:14,padding:"18px 14px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:`radial-gradient(circle,${u.color}15,transparent 70%)`,borderRadius:"0 14px 0 80px"}}/>
            <div style={{fontSize:26,marginBottom:8}}>{u.icon}</div>
            <div style={{fontWeight:700,fontSize:12,color:th.tx,marginBottom:2}}>{u.name}</div>
            <div style={{color:th.sub,fontSize:10,marginBottom:10,lineHeight:1.3}}>{u.full}</div>
            <div style={{color:u.color,fontSize:28,fontWeight:900,lineHeight:1}}>{ms.length}</div>
            <div style={{color:th.sub,fontSize:10,marginBottom:10}}>{t.uniStudents}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ms.slice(0,8).map(m=><div key={m.id} title={`${m.firstname} ${m.lastname}`} style={{width:28,height:28,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{m.avatar}</div>)}</div>
          </div>
        );})}
      </div>
    </div>
  );
});

const MemoriesPage=memo(({posts,setPosts,lang})=>{
  const {th,t,isAdmin}=useApp();
  const [txt,setTxt]=useState("");
  const react=useCallback(async(id,type)=>{
    const p=posts.find(x=>x.id===id);if(!p)return;
    let update={};
    if(type==="moto")update={moto:p.liked?p.moto-1:p.moto+1,liked:!p.liked};
    else if(type==="bika")update={bika:p.bikaed?p.bika-1:p.bika+1,bikaed:!p.bikaed};
    else update={[type]:p[type]+1};
    await supabase.from("posts").update(update).eq("id",id);
    setPosts(prev=>prev.map(x=>x.id===id?{...x,...update}:x));
  },[posts,setPosts]);

  const addPost=async()=>{
    if(!txt.trim())return;
    const emojis=["🌟","🎊","❄️","🌍","🎓","🔥","🌸","💫"];
    const newPost={id:Date.now(),author:"Mugisha L. Kelly",avatar:"MK",color:G,text:txt,
      time:lang==="fr"?"À l'instant":"Сейчас",emoji:emojis[posts.length%emojis.length],
      moto:0,ijwi:0,saba:0,bika:0,liked:false,bikaed:false};
    await supabase.from("posts").insert([newPost]);setPosts(prev=>[newPost,...prev]);setTxt("");
  };
  const deletePost=async(id)=>{await supabase.from("posts").delete().eq("id",id);setPosts(prev=>prev.filter(x=>x.id!==id));};

  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>{t.memTitle}</h2>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:16,marginBottom:18}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <Av m={KELLY} size={36}/>
          <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={3} placeholder={t.memPlaceholder}
            style={{flex:1,padding:"10px 12px",borderRadius:10,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
          <button onClick={addPost} style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>{t.memNew}</button>
        </div>
      </div>
      {posts.length===0&&<div style={{textAlign:"center",padding:"40px",color:th.sub}}><div style={{fontSize:40,marginBottom:12}}>📸</div><div style={{fontSize:14}}>{t.noMemories}</div></div>}
      {posts.map(p=>(
        <div key={p.id} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:16,marginBottom:12,position:"relative"}}>
          {isAdmin&&<button onClick={()=>deletePost(p.id)} style={{position:"absolute",top:10,right:10,background:`${R}22`,border:`1px solid ${R}44`,color:R,borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:11}}>🗑</button>}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><Av m={p} size={36}/><div><div style={{fontWeight:700,color:th.tx,fontSize:13}}>{p.author}</div><div style={{fontSize:10,color:th.sub}}>{p.time}</div></div><div style={{marginLeft:"auto",fontSize:22,marginRight:isAdmin?28:0}}>{p.emoji}</div></div>
          <div style={{color:th.tx,lineHeight:1.7,marginBottom:12,fontSize:13}}>{p.text}</div>
          <div style={{display:"flex",gap:5,borderTop:`1px solid ${th.bdr}`,paddingTop:10,flexWrap:"wrap"}}>
            {[{k:"moto",ic:"🔥",l:t.moto,ac:p.liked},{k:"ijwi",ic:"🗣",l:t.ijwi,ac:false},{k:"saba",ic:"🌍",l:t.saba,ac:false},{k:"bika",ic:"💎",l:t.bika,ac:p.bikaed}].map(r=>(
              <button key={r.k} onClick={()=>react(p.id,r.k)}
                style={{display:"flex",alignItems:"center",gap:4,background:r.ac?`${G}22`:th.inp,border:`1px solid ${r.ac?G:th.bdr}`,borderRadius:18,padding:"5px 11px",cursor:"pointer",color:r.ac?G:th.sub,fontSize:11,transition:"all 0.2s"}}>
                {r.ic} {r.l} {p[r.k]>0&&<b>{p[r.k]}</b>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

const TestimonialsPage=memo(({members})=>{
  const {th,t}=useApp();
  const withBio=useMemo(()=>members.filter(m=>m.bio),[members]);
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>{t.testTitle}</h2>
      {!withBio.length&&<div style={{textAlign:"center",padding:"40px",color:th.sub}}><div style={{fontSize:36,marginBottom:10}}>💬</div><div>{t.testEmpty}</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {withBio.map(m=>(
          <div key={m.id} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"20px 16px",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:24,color:G,lineHeight:1}}>"</div>
            <p style={{color:th.tx,fontStyle:"italic",lineHeight:1.7,margin:0,flex:1,fontSize:13}}>{m.bio}</p>
            <div style={{display:"flex",alignItems:"center",gap:10,borderTop:`1px solid ${th.bdr}`,paddingTop:12}}><Av m={m} size={38}/><div><div style={{fontWeight:700,color:th.tx,fontSize:13}}>{m.firstname} {m.lastname}</div><div style={{fontSize:11,color:th.sub}}>{m.university}</div>{m.role&&<div style={{fontSize:10,color:G}}>{m.role}</div>}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ForumPage=memo(({forum,setForum,lang})=>{
  const {th,t,isAdmin}=useApp();
  const [txt,setTxt]=useState("");
  const post=useCallback(async()=>{
    if(!txt.trim())return;
    const tags=["💬 Général","📋 Info","💡 Idée","🆘 Aide"];
    const newPost={id:Date.now(),author:"Vous",text:txt,replies:0,time:lang==="fr"?"À l'instant":"Сейчас",tag:tags[forum.length%tags.length],avatar:"👤",color:"#3b82f6"};
    await supabase.from("forum").insert([newPost]);setForum(p=>[newPost,...p]);setTxt("");
  },[txt,lang,forum,setForum]);
  const deletePost=async(id)=>{await supabase.from("forum").delete().eq("id",id);setForum(f=>f.filter(x=>x.id!==id));};

  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>{t.forumTitle}</h2>
      <div style={{display:"flex",gap:8,marginBottom:16,flexDirection:"column"}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder={t.forumAsk} onKeyDown={e=>e.key==="Enter"&&post()}
          style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
        <button onClick={post} style={{background:G,color:W,border:"none",padding:"11px 18px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13}}>{t.forumPost}</button>
      </div>
      {forum.map(p=>(
        <div key={p.id} style={{background:th.card,border:`1px solid ${p.pinned?G+"55":th.bdr}`,borderRadius:12,padding:"16px 14px",marginBottom:10,position:"relative"}}>
          {isAdmin&&!p.tag?.includes("📌")&&<button onClick={()=>deletePost(p.id)} style={{position:"absolute",top:10,right:10,background:`${R}22`,border:`1px solid ${R}44`,color:R,borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:11}}>🗑</button>}
          {p.pinned&&<div style={{fontSize:10,color:G,marginBottom:5,fontWeight:700}}>📌 {lang==="fr"?"ÉPINGLÉ":"ЗАКРЕПЛЕНО"}</div>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{p.avatar}</div>
            <span style={{fontWeight:700,color:G,fontSize:13}}>{p.author}</span>
            <span style={{background:`${G}15`,color:G,border:`1px solid ${G}28`,padding:"2px 7px",borderRadius:4,fontSize:10}}>{p.tag}</span>
            <span style={{color:th.sub,fontSize:10,marginLeft:"auto"}}>{p.time}</span>
          </div>
          <div style={{color:th.tx,lineHeight:1.55,fontSize:13}}>{p.text}</div>
          <div style={{color:th.sub,fontSize:11,marginTop:6}}>💬 {p.replies} {lang==="fr"?"réponse(s)":"ответ(а)"}</div>
        </div>
      ))}
    </div>
  );
});

const EventsPage=memo(({lang})=>{
  const {th,t}=useApp();const today=new Date();
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>{t.evTitle}</h2>
      {EVENTS.map((ev,i)=>{const d=new Date(ev.date);const past=d<today;return(
        <div key={i} style={{background:th.card,border:`1px solid ${past?th.bdr:`${G}33`}`,borderRadius:12,padding:"16px 14px",marginBottom:10,opacity:past?0.45:1,display:"flex",gap:12,alignItems:"center"}}>
          <div style={{background:`${G}15`,border:`1px solid ${G}44`,borderRadius:10,padding:"8px 10px",textAlign:"center",minWidth:46,flexShrink:0}}>
            <div style={{color:G,fontWeight:900,fontSize:18,lineHeight:1}}>{d.getDate()}</div>
            <div style={{color:th.sub,fontSize:9}}>{d.toLocaleString(lang==="fr"?"fr-FR":"ru-RU",{month:"short"})}</div>
          </div>
          <div style={{fontSize:20,flexShrink:0}}>{ev.icon}</div>
          <div><div style={{fontWeight:700,fontSize:13,color:th.tx,marginBottom:2}}>{ev.title}</div><div style={{color:th.sub,fontSize:11}}>📍 {ev.place}</div></div>
        </div>
      );})}
    </div>
  );
});

const ChatPage=memo(({members,msgs,setMsgs,calls,setCalls,lang})=>{
  const {th,t,isAdmin}=useApp();
  const isMobile=useIsMobile();
  const [inp,setInp]=useState("");const [tab,setTab]=useState("group");
  const [callReq,setCallReq]=useState("");const [reactions,setReactions]=useState({});
  const [showMembers,setShowMembers]=useState(false);
  const msgEnd=useRef(null);
  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=useCallback(async()=>{
    if(!inp.trim())return;
    const newMsg={id:Date.now(),author:"Vous",avatar:"👤",color:"#3b82f6",text:inp,time:"À l'instant",role:""};
    await supabase.from("messages").insert([newMsg]);setMsgs(p=>[...p,newMsg]);setInp("");
  },[inp,setMsgs]);

  const addReaction=(id,emoji)=>setReactions(r=>({...r,[id]:{...(r[id]||{}),[emoji]:((r[id]||{})[emoji]||0)+1}}));
  const EMOJIS=["👍","❤️","😂","🔥","🙏","🇧🇮"];

  const approveCall=async(id)=>{await supabase.from("calls").update({status:"✅ Approuvé"}).eq("id",id);setCalls(p=>p.map(c=>c.id===id?{...c,status:"✅ Approuvé"}:c));};
  const rejectCall=async(id)=>{await supabase.from("calls").update({status:"❌ Refusé"}).eq("id",id);setCalls(p=>p.map(c=>c.id===id?{...c,status:"❌ Refusé"}:c));};
  const submitCall=async()=>{
    if(!callReq.trim())return;
    const newCall={id:Date.now(),req:callReq,status:lang==="fr"?"⏳ En attente":"⏳ Ожидает",time:lang==="fr"?"À l'instant":"Сейчас"};
    await supabase.from("calls").insert([newCall]);setCalls(p=>[...p,newCall]);setCallReq("");
  };

  const chatHeight=isMobile?450:580;

  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:14,fontSize:"clamp(16px,4vw,24px)"}}>{t.chatTitle}</h2>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {[{k:"group",l:`💬 ${t.chatGroup}`},{k:"calls",l:`📞 ${t.chatCalls}${calls.filter(c=>c.status.includes("attente")||c.status.includes("Ожидает")).length>0?" 🔴":""}`}].map(tb=>(
          <button key={tb.k} onClick={()=>setTab(tb.k)}
            style={{background:tab===tb.k?`${G}22`:th.card,color:tab===tb.k?G:th.sub,border:`1px solid ${tab===tb.k?G:th.bdr}`,padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:tab===tb.k?700:400}}>{tb.l}</button>
        ))}
        {isMobile&&tab==="group"&&(
          <button onClick={()=>setShowMembers(m=>!m)}
            style={{background:showMembers?`${G}22`:th.card,color:showMembers?G:th.sub,border:`1px solid ${showMembers?G:th.bdr}`,padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>
            👥 {members.filter(m=>m.online).length}
          </button>
        )}
      </div>

      {/* Members panel mobile */}
      {isMobile&&showMembers&&tab==="group"&&(
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:12,padding:12,marginBottom:10,display:"flex",gap:12,overflowX:"auto"}}>
          {members.map(m=>(
            <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
              <Av m={m} size={36}/>
              <div style={{fontSize:9,color:th.sub,textAlign:"center",maxWidth:50,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.firstname}</div>
            </div>
          ))}
        </div>
      )}

      {tab==="group"&&(
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"150px 1fr",gap:10}}>
          {/* Members desktop */}
          {!isMobile&&(
            <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:12,padding:12,display:"flex",flexDirection:"column",overflowY:"auto",height:chatHeight}}>
              <div style={{fontWeight:700,fontSize:11,color:G,marginBottom:10}}>🟢 {t.chatOnline} ({members.filter(m=>m.online).length})</div>
              {members.map(m=>(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 0",borderBottom:`1px solid ${th.bdr}`}}>
                  <Av m={m} size={26}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,fontWeight:600,color:th.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.firstname} {m.isFounder?"🌟":""}</div>
                    <div style={{fontSize:9,color:m.online?"#22c55e":th.sub}}>{m.online?(lang==="fr"?"En ligne":"В сети"):(lang==="fr"?"Hors ligne":"Не в сети")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Chat area */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:12,flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:10,height:chatHeight}}>
              {msgs.map(m=>{const isMe=m.author==="Vous";return(
                <div key={m.id} style={{display:"flex",gap:7,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
                  {!isMe&&<Av m={m} size={28}/>}
                  <div style={{maxWidth:"78%"}}>
                    {!isMe&&<div style={{fontSize:10,color:th.sub,marginBottom:2,display:"flex",gap:4}}><span style={{fontWeight:700,color:th.tx}}>{m.author}</span><span>{m.time}</span></div>}
                    <div style={{background:isMe?`linear-gradient(135deg,${G},#15a32b)`:th.inp,borderRadius:isMe?"14px 14px 3px 14px":"14px 14px 14px 3px",padding:"9px 12px",fontSize:13,color:isMe?W:th.tx,lineHeight:1.5}}>{m.text}</div>
                    <div style={{display:"flex",gap:2,marginTop:3,flexWrap:"wrap",justifyContent:isMe?"flex-end":"flex-start"}}>
                      {EMOJIS.map(e=><button key={e} onClick={()=>addReaction(m.id,e)} style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:10,padding:"1px 5px",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",gap:2,color:th.sub}}>{e}{reactions[m.id]?.[e]>0&&<span style={{color:G,fontWeight:700,fontSize:9}}>{reactions[m.id][e]}</span>}</button>)}
                    </div>
                  </div>
                </div>
              );})}
              <div ref={msgEnd}/>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.chatPlaceholder}
                style={{flex:1,padding:"11px 13px",borderRadius:10,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
              <button onClick={send} style={{background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",padding:"11px 16px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:13,flexShrink:0}}>{t.chatSend}</button>
            </div>
          </div>
        </div>
      )}

      {tab==="calls"&&(
        <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:12,padding:16}}>
          <div style={{fontSize:12,color:th.sub,lineHeight:1.7,background:`${R}10`,border:`1px solid ${R}28`,borderRadius:8,padding:"10px 13px",marginBottom:14}}>⚠️ {t.chatCallInfo}</div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexDirection:"column"}}>
            <input value={callReq} onChange={e=>setCallReq(e.target.value)} placeholder={t.callPlaceholder}
              style={{width:"100%",padding:"11px 13px",borderRadius:9,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"}}/>
            <button onClick={submitCall} style={{background:R,color:W,border:"none",padding:"11px 16px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13}}>{t.chatCallReq}</button>
          </div>
          {calls.length===0&&<div style={{textAlign:"center",padding:"24px",color:th.sub,fontSize:13}}>{t.noCalls}</div>}
          {calls.map(c=>(
            <div key={c.id} style={{background:th.inp,border:`1px solid ${th.bdr}`,borderRadius:10,padding:"12px 14px",marginBottom:8}}>
              <div style={{fontWeight:600,color:th.tx,fontSize:13,marginBottom:4}}>{c.req}</div>
              <div style={{fontSize:11,color:th.sub,marginBottom:8}}>{c.time}</div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{background:c.status.includes("✅")?`${G}22`:c.status.includes("❌")?`${R}22`:`rgba(255,200,0,0.15)`,color:c.status.includes("✅")?G:c.status.includes("❌")?R:"#f59e0b",border:`1px solid ${c.status.includes("✅")?G:c.status.includes("❌")?R:"#f59e0b"}33`,padding:"4px 10px",borderRadius:6,fontSize:11}}>{c.status}</span>
                {isAdmin&&(c.status.includes("attente")||c.status.includes("Ожидает"))&&(
                  <><button onClick={()=>approveCall(c.id)} style={{background:`${G}22`,border:`1px solid ${G}`,color:G,padding:"5px 12px",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:700}}>✅</button>
                  <button onClick={()=>rejectCall(c.id)} style={{background:`${R}22`,border:`1px solid ${R}`,color:R,padding:"5px 12px",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:700}}>❌</button></>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const ProfilePage=memo(({members,setMembers,currentUser,setCurrentUser})=>{
  const {th,lang}=useApp();
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);

  const handleUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file||!currentUser)return;
    setUploading(true);
    const ext=file.name.split(".").pop();
    const path=`${currentUser.id}.${ext}`;
    const {error}=await supabase.storage.from("avatars").upload(path,file,{upsert:true});
    if(!error){
      const {data}=supabase.storage.from("avatars").getPublicUrl(path);
      const url=data.publicUrl;
      await supabase.from("members").update({avatar_url:url}).eq("id",currentUser.id);
      const updated={...currentUser,avatar_url:url};
      setCurrentUser(updated);setMembers(p=>p.map(m=>m.id===currentUser.id?updated:m));
    }
    setUploading(false);
  };

  if(!currentUser)return(
    <div style={{padding:"60px 20px",textAlign:"center",color:th.sub}}>
      <div style={{fontSize:44,marginBottom:14}}>👤</div>
      <div style={{fontSize:15}}>{lang==="fr"?"Tu n'es pas encore inscrit.":"Вы ещё не зарегистрированы."}</div>
    </div>
  );

  return(
    <div style={{padding:"20px 0",maxWidth:480,margin:"0 auto"}}>
      <h2 style={{color:G,marginBottom:20,fontSize:"clamp(16px,4vw,24px)"}}>{lang==="fr"?"Mon Profil":"Мой профиль"}</h2>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:18,padding:"28px 20px",textAlign:"center",marginBottom:16}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
          <Av m={currentUser} size={96} onClick={()=>{if(fileRef.current)fileRef.current.click();}}/>
          <div onClick={()=>{if(fileRef.current)fileRef.current.click();}}
            style={{position:"absolute",bottom:0,right:0,background:G,borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 2px 8px ${G}88`,fontSize:14}}>
            📷
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}}/>
        {uploading&&<div style={{color:G,fontSize:13,marginBottom:10}}>⏳ {lang==="fr"?"Envoi en cours…":"Загрузка…"}</div>}
        <div style={{fontWeight:800,fontSize:20,color:th.tx,marginBottom:4}}>{currentUser.firstname} {currentUser.lastname}</div>
        <div style={{color:G,fontSize:13,marginBottom:4}}>{currentUser.role||lang==="fr"?"Membre":"Участник"}</div>
        <div style={{color:th.sub,fontSize:12}}>{currentUser.university}</div>
      </div>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"16px 18px"}}>
        {[
          {l:lang==="fr"?"Filière":"Специальность",v:currentUser.field},
          {l:lang==="fr"?"Niveau":"Курс",v:currentUser.year},
          {l:lang==="fr"?"Arrivée":"Приезд",v:currentUser.arrival},
          {l:"Email",v:currentUser.email},
          {l:"WhatsApp",v:currentUser.whatsapp},
          {l:lang==="fr"?"Compétences":"Навыки",v:currentUser.skills},
        ].filter(x=>x.v).map((x,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${th.bdr}`}}>
            <div style={{color:th.sub,fontSize:12,minWidth:90}}>{x.l}</div>
            <div style={{color:th.tx,fontSize:12,fontWeight:600}}>{x.v}</div>
          </div>
        ))}
        {currentUser.bio&&(
          <div style={{marginTop:12,padding:12,background:`${G}10`,borderRadius:10,border:`1px solid ${G}22`}}>
            <div style={{color:th.sub,fontSize:11,marginBottom:5}}>Bio</div>
            <div style={{color:th.tx,fontSize:12,fontStyle:"italic",lineHeight:1.6}}>{currentUser.bio}</div>
          </div>
        )}
      </div>
    </div>
  );
});

const MapPage=memo(()=>{
  const {th,t,lang}=useApp();const [hover,setHover]=useState(null);
  const places=[
    {name:"АГТУ",x:72,y:44,icon:"⚙️",color:G,info:"Université Technique"},{name:"АГУ",x:55,y:32,icon:"🏛",color:"#3b82f6",info:"Université d'État"},
    {name:"АГМУ",x:38,y:28,icon:"🏥",color:R,info:"Médecine"},{name:"АГПУ",x:82,y:28,icon:"📖",color:"#f59e0b",info:"Pédagogique"},
    {name:"Kremlin",x:32,y:60,icon:"🏰",color:"#a855f7",info:"Kremlin d'Astrakhan"},{name:"Gare",x:48,y:50,icon:"🚂",color:"#06b6d4",info:"Gare centrale"},
    {name:"Marché",x:45,y:70,icon:"🛒",color:"#f59e0b",info:"Grand marché"},{name:"Волга",x:20,y:50,icon:"🌊",color:"#38bdf8",info:"Fleuve Volga"},
    {name:"Mosquée",x:60,y:68,icon:"🕌",color:"#10b981",info:""},
  ];
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:16,fontSize:"clamp(16px,4vw,24px)"}}>🗺 {t.mapTitle}</h2>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:14}}>
        <div style={{position:"relative",borderRadius:10,overflow:"hidden",background:"linear-gradient(135deg,#0a1a0a 0%,#0d1520 50%,#0a100a 100%)",border:`1px solid ${th.bdr}`,height:320}}>
          <svg width="100%" height="100%" style={{position:"absolute",inset:0,opacity:0.07}}>{Array.from({length:10},(_,i)=><g key={i}><line x1={`${i*11}%`} y1="0" x2={`${i*11}%`} y2="100%" stroke={G} strokeWidth="0.5"/><line x1="0" y1={`${i*11}%`} x2="100%" y2={`${i*11}%`} stroke={G} strokeWidth="0.5"/></g>)}</svg>
          <div style={{position:"absolute",left:"5%",top:"48%",width:"16%",height:"8%",background:"rgba(56,189,248,0.18)",borderRadius:"50%",border:"1px solid rgba(56,189,248,0.25)",transform:"rotate(-8deg)"}}/>
          {places.map((p,i)=>(
            <div key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}
              onClick={()=>setHover(hover===i?null:i)}
              style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:hover===i?"translate(-50%,-50%) scale(1.15)":"translate(-50%,-50%)",zIndex:10,cursor:"pointer",transition:"transform 0.2s"}}>
              <div style={{background:"rgba(0,0,0,0.9)",border:`1.5px solid ${p.color}`,borderRadius:7,padding:"3px 7px",display:"flex",flexDirection:"column",alignItems:"center",boxShadow:`0 2px 10px ${p.color}44`,whiteSpace:"nowrap",minWidth:40}}>
                <span style={{fontSize:12}}>{p.icon}</span><span style={{fontSize:8,color:"#ddd",fontWeight:600}}>{p.name}</span>
              </div>
              {hover===i&&p.info&&<div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.95)",border:`1px solid ${p.color}55`,borderRadius:6,padding:"5px 9px",whiteSpace:"nowrap",fontSize:10,color:W,boxShadow:"0 4px 14px black",zIndex:20}}>{p.info}</div>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>{UNIVS.map(u=><div key={u.name} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:u.color}}/><span style={{fontSize:10,color:th.sub}}>{u.name}</span></div>)}</div>
      </div>
    </div>
  );
});

const AboutPage=memo(({lang})=>{
  const {th,t}=useApp();
  return(
    <div style={{padding:"20px 0"}}>
      <h2 style={{color:G,marginBottom:18,fontSize:"clamp(16px,4vw,24px)"}}>{t.aboutTitle}</h2>
      <div style={{background:`linear-gradient(135deg,${G}12,${RB}10,${R}08)`,border:`1px solid ${G}44`,borderRadius:18,padding:"24px 18px",marginBottom:16}}>
        <div style={{fontSize:10,color:G,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:14}}>🌟 {lang==="fr"?"Fondateur":"Основатель"}</div>
        <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${G},${R})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:22,boxShadow:`0 0 24px ${G}55`,flexShrink:0}}>MK</div>
          <div><div style={{fontWeight:900,fontSize:20,color:th.tx}}>Mugisha L. Kelly</div><div style={{color:G,fontSize:13,marginBottom:2}}>🌟 Fondateur & Créateur</div><div style={{color:th.sub,fontSize:12}}>АГТУ · Astrakhan 🇷🇺 · {lang==="fr"?"Depuis":"С"} 2023</div></div>
        </div>
        <div style={{borderTop:`1px solid ${th.bdr}`,paddingTop:14,color:th.tx,fontStyle:"italic",lineHeight:1.75,fontSize:13}}>"{KELLY.bio}"</div>
      </div>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"20px 18px",marginBottom:12}}>
        <div style={{fontWeight:700,color:G,marginBottom:12,fontSize:15}}>🎯 {lang==="fr"?"Mission":"Миссия"}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
          {(lang==="fr"?["Informer","Connecter","Préserver","Unir"]:["Информировать","Соединять","Сохранять","Объединять"]).map((m,i)=>(
            <div key={i} style={{background:`${G}12`,border:`1px solid ${G}28`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:5}}>{["📢","🔗","📚","🤝"][i]}</div>
              <div style={{fontWeight:700,color:G,fontSize:13}}>{m}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"20px 18px"}}>
        <div style={{fontWeight:700,color:G,marginBottom:10,fontSize:15}}>⚙️ {lang==="fr"?"Technologies":"Технологии"}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:10}}>{["React","JavaScript","Canvas API","SVG","Claude AI","CSS3","Supabase"].map(tech=><span key={tech} style={{background:`${G}12`,border:`1px solid ${G}28`,color:G,padding:"4px 11px",borderRadius:16,fontSize:11}}>{tech}</span>)}</div>
        <div style={{fontSize:11,color:th.sub,borderTop:`1px solid ${th.bdr}`,paddingTop:10}}>
          {lang==="fr"?"Développement : ":"Разработка: "}<span style={{color:G,fontWeight:700}}>Mugisha L. Kelly</span>{" · Claude (Anthropic) · 2026"}
        </div>
      </div>
    </div>
  );
});

const Footer=memo(({setSec,lang})=>{
  const {th}=useApp();
  const isMobile=useIsMobile();
  const links=[{l:lang==="fr"?"Accueil":"Главная",k:"home"},{l:lang==="fr"?"Universités":"Университеты",k:"universities"},{l:"Forum",k:"forum"},{l:lang==="fr"?"Agenda":"События",k:"events"},{l:lang==="fr"?"À propos":"О нас",k:"about"}];
  return(
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(12px)",marginTop:40,background:"rgba(0,0,0,0.4)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr 1fr",gap:isMobile?20:28,marginBottom:24}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><span style={{fontSize:20}}>🇧🇮</span><span style={{fontWeight:900,fontSize:15,color:W}}>Burundi <span style={{color:G}}>Astrakhan</span></span></div>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,lineHeight:1.7,margin:"0 0 14px",maxWidth:260}}>{lang==="fr"?"Une plateforme communautaire pour les Burundais en Russie.":"Платформа для бурундийцев в России."}</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["📱 Telegram","📸 Instagram","👥 Facebook"].map(s=><div key={s} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"5px 9px",fontSize:10,color:"rgba(255,255,255,0.4)"}}>{s}</div>)}</div>
          </div>
          {!isMobile&&<>
            <div>
              <div style={{fontWeight:700,color:G,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>{lang==="fr"?"Navigation":"Навигация"}</div>
              {links.map(l=><div key={l.k} onClick={()=>setSec(l.k)} style={{color:"rgba(255,255,255,0.5)",fontSize:12,marginBottom:7,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color=G} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>{l.l}</div>)}
            </div>
            <div>
              <div style={{fontWeight:700,color:G,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Contact</div>
              {["📍 Astrakhan, Russie","🇧🇮 Communauté burundaise","🎓 АГТУ"].map(c=><div key={c} style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginBottom:7}}>{c}</div>)}
            </div>
          </>}
          {isMobile&&(
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {links.map(l=><div key={l.k} onClick={()=>setSec(l.k)} style={{color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",padding:"4px 0"}} onMouseEnter={e=>e.currentTarget.style.color=G} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>{l.l}</div>)}
            </div>
          )}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>© 2026 Burundi Astrakhan</div>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,fontStyle:"italic"}}>{lang==="fr"?"Dev :":"Разр :"} <span style={{color:G,fontWeight:700}}>M.K</span></div>
        </div>
      </div>
    </footer>
  );
});

const RegModal=memo(({onClose,onRegister})=>{
  const {th,t}=useApp();
  const isMobile=useIsMobile();
  const [form,setForm]=useState({firstname:"",lastname:"",birthdate:"",gender:"M",university:UNIVS[0].name,field:"",year:"Licence 1",arrival:"2024",address:"",email:"",whatsapp:"",skills:"",bio:"",notifBirthday:true,public:true});
  const u=useCallback((k,v)=>setForm(f=>({...f,[k]:v})),[]);
  const inp={width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${th.bdr}`,background:th.inp,color:th.tx,fontSize:13,boxSizing:"border-box"};
  const Lbl=({children})=><label style={{display:"block",color:th.sub,fontSize:12,marginBottom:4}}>{children}</label>;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:500,overflowY:"auto",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"16px 12px"}}>
      <div style={{background:th.bg,border:`1px solid ${G}55`,borderRadius:16,padding:"20px 16px",width:"100%",maxWidth:480,position:"relative",margin:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.08)",border:"none",color:th.tx,width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:15}}>×</button>
        <h2 style={{color:G,marginTop:0,fontSize:16,marginBottom:18}}>🇧🇮 {t.regTitle}</h2>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
          {[{l:t.regFirst,k:"firstname"},{l:t.regLast,k:"lastname"}].map(f=><div key={f.k}><Lbl>{f.l}</Lbl><input value={form[f.k]} onChange={e=>u(f.k,e.target.value)} style={inp}/></div>)}
          <div><Lbl>{t.regBirth}</Lbl><input type="date" value={form.birthdate} onChange={e=>u("birthdate",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regGen}</Lbl><select value={form.gender} onChange={e=>u("gender",e.target.value)} style={inp}><option value="M">{t.regGenM}</option><option value="F">{t.regGenF}</option></select></div>
          <div style={{gridColumn:"span 1 / span 1",...(isMobile?{}:{gridColumn:"span 2"})}}><Lbl>{t.regUni}</Lbl><select value={form.university} onChange={e=>u("university",e.target.value)} style={inp}>{UNIVS.map(v=><option key={v.name} value={v.name}>{v.name} — {v.full}</option>)}</select></div>
          <div><Lbl>{t.regField}</Lbl><input value={form.field} onChange={e=>u("field",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regYear}</Lbl><select value={form.year} onChange={e=>u("year",e.target.value)} style={inp}>{["Préparatoire","Licence 1","Licence 2","Licence 3","Master 1","Master 2","Doctorat"].map(y=><option key={y}>{y}</option>)}</select></div>
          <div><Lbl>{t.regArr}</Lbl><select value={form.arrival} onChange={e=>u("arrival",e.target.value)} style={inp}>{["2018","2019","2020","2021","2022","2023","2024","2025","2026"].map(y=><option key={y}>{y}</option>)}</select></div>
          <div><Lbl>{t.regAddr}</Lbl><input value={form.address} onChange={e=>u("address",e.target.value)} placeholder="ул. Победы" style={inp}/></div>
          <div><Lbl>{t.regEmail}</Lbl><input type="email" value={form.email} onChange={e=>u("email",e.target.value)} style={inp}/></div>
          <div><Lbl>{t.regWA}</Lbl><input value={form.whatsapp} onChange={e=>u("whatsapp",e.target.value)} style={inp}/></div>
          <div style={{gridColumn:"span 1 / span 1",...(isMobile?{}:{gridColumn:"span 2"})}}><Lbl>{t.regSkills}</Lbl><input value={form.skills} onChange={e=>u("skills",e.target.value)} style={inp}/></div>
          <div style={{gridColumn:"span 1 / span 1",...(isMobile?{}:{gridColumn:"span 2"})}}><Lbl>{t.regBio}</Lbl><textarea value={form.bio} onChange={e=>u("bio",e.target.value)} rows={2} style={{...inp,resize:"vertical"}}/></div>
          <div style={{gridColumn:"span 1 / span 1",...(isMobile?{}:{gridColumn:"span 2"}),display:"flex",flexDirection:"column",gap:8}}>
            {[{k:"notifBirthday",l:`🎂 ${t.regNotif}`},{k:"public",l:`👁 ${t.regPub}`}].map(cb=>(
              <label key={cb.k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><input type="checkbox" checked={form[cb.k]} onChange={e=>u(cb.k,e.target.checked)} style={{accentColor:G}}/><span style={{fontSize:12,color:th.sub}}>{cb.l}</span></label>
            ))}
          </div>
        </div>
        <button onClick={()=>form.firstname&&form.lastname&&onRegister(form)}
          style={{marginTop:16,width:"100%",background:`linear-gradient(135deg,${G},#15a32b)`,color:W,border:"none",padding:"13px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,boxShadow:`0 4px 20px ${G}44`}}>
          🇧🇮 {t.regBtn}
        </button>
      </div>
    </div>
  );
});

export default function App(){
  const [lang,setLang]=useState("fr");
  const [thK,setThK]=useState("night");
  const [sec,setSec]=useState("home");
  const [members,setMembers]=useState([KELLY]);
  const [showReg,setShowReg]=useState(false);
  const [showAdminLogin,setShowAdminLogin]=useState(false);
  const [isAdmin,setIsAdmin]=useState(false);
  const [search,setSearch]=useState("");
  const [forum,setForum]=useState([]);
  const [posts,setPosts]=useState([]);
  const [msgs,setMsgs]=useState([]);
  const [calls,setCalls]=useState([]);
  const [pollVotes,setPollVotes]=useState([2,5,8,3]);
  const [voted,setVoted]=useState(false);
  const [currentUser,setCurrentUser]=useState(null);
  const [counts,setCounts]=useState({m:0,y:0,u:0,e:0});
  const [scrolled,setScrolled]=useState(false);

  const th=THEMES[thK],t=T[lang];

  useEffect(()=>{
    supabase.from("members").select("*").then(({data})=>{
      if(data&&data.length>0){const normalized=data.filter(m=>m.id!==0).map(normalizeMe);setMembers([KELLY,...normalized]);}
    });
    supabase.from("forum").select("*").order("created_at",{ascending:false}).then(async({data})=>{
      if(!data||data.length===0){await supabase.from("forum").insert([DEFAULT_FORUM]);setForum([DEFAULT_FORUM]);}else{setForum(data);}
    });
    supabase.from("posts").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setPosts(data);});
    supabase.from("messages").select("*").order("created_at",{ascending:true}).then(async({data})=>{
      if(!data||data.length===0){await supabase.from("messages").insert([DEFAULT_MSG]);setMsgs([DEFAULT_MSG]);}else{setMsgs(data);}
    });
    supabase.from("calls").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setCalls(data);});
  },[]);

  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>80);window.addEventListener("scroll",onScroll);return()=>window.removeEventListener("scroll",onScroll);},[]);

  useEffect(()=>{
    if(sec==="home"){let f=0;const iv=setInterval(()=>{f++;const r=Math.min(f/40,1);setCounts({m:Math.round(members.length*r),y:Math.round(7*r),u:Math.round(UNIVS.length*r),e:Math.round(EVENTS.length*r)});if(f>=40)clearInterval(iv);},25);return()=>clearInterval(iv);}
  },[sec,members.length]);

  const handleRegister=useCallback(async(form)=>{
    const newMember={...form,id:Date.now(),avatar:`${form.firstname[0]}${form.lastname[0]}`.toUpperCase(),color:COLORS[members.length%COLORS.length],role:"",online:false,is_founder:false};
    await supabase.from("members").insert([newMember]);
    setMembers(p=>[...p,newMember]);setCurrentUser(newMember);setShowReg(false);setSec("profile");
  },[members.length]);

  const ctx=useMemo(()=>({th,t,lang,isAdmin}),[th,t,lang,isAdmin]);

  return(
    <AppCtx.Provider value={ctx}>
      <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:th.bg,color:th.tx,minHeight:"100vh",transition:"background 0.3s",overflowX:"hidden"}}>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          html,body{overflow-x:hidden;max-width:100vw}
          input::placeholder,textarea::placeholder{color:#666}
          select option{background:#111}
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-thumb{background:${G}55;border-radius:3px}
          .hamburger{display:none!important}
          .desk-nav{display:flex!important}
          @media(max-width:768px){
            .hamburger{display:flex!important;align-items:center;justify-content:center}
            .desk-nav{display:none!important}
          }
          @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
          input,select,textarea{font-size:16px!important}
        `}</style>

        <Navbar sec={sec} setSec={setSec} setShowReg={setShowReg} setShowAdminLogin={setShowAdminLogin}
          lang={lang} setLang={setLang} thK={thK} setThK={setThK} scrolled={scrolled}
          isAdmin={isAdmin} onLogout={()=>{setIsAdmin(false);setSec("home");}}/>

        {sec==="home"
          ?<HomePage members={members} setSec={setSec} setShowReg={setShowReg} counts={counts} pollVotes={pollVotes} setPollVotes={setPollVotes} voted={voted} setVoted={setVoted}/>
          :<div style={{maxWidth:1100,margin:"0 auto",padding:"0 14px"}}>
            {sec==="directory"&&<DirectoryPage members={members} setMembers={setMembers} search={search} setSearch={setSearch}/>}
            {sec==="universities"&&<UniversitiesPage members={members}/>}
            {sec==="memories"&&<MemoriesPage posts={posts} setPosts={setPosts} lang={lang}/>}
            {sec==="testimonials"&&<TestimonialsPage members={members}/>}
            {sec==="forum"&&<ForumPage forum={forum} setForum={setForum} lang={lang}/>}
            {sec==="events"&&<EventsPage lang={lang}/>}
            {sec==="chat"&&<ChatPage members={members} msgs={msgs} setMsgs={setMsgs} calls={calls} setCalls={setCalls} lang={lang}/>}
            {sec==="map"&&<MapPage/>}
            {sec==="about"&&<AboutPage lang={lang}/>}
            {sec==="profile"&&<ProfilePage members={members} setMembers={setMembers} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
            {sec==="admin"&&isAdmin&&<AdminPage members={members} setMembers={setMembers} forum={forum} setForum={setForum} posts={posts} setPosts={setPosts} calls={calls} setCalls={setCalls}/>}
            {sec==="admin"&&!isAdmin&&<div style={{padding:"60px 16px",textAlign:"center",color:th.sub}}><div style={{fontSize:44,marginBottom:14}}>🔐</div><div style={{fontSize:15}}>{lang==="fr"?"Accès réservé aux administrateurs.":"Доступ только для администраторов."}</div></div>}
          </div>
        }

        <Footer setSec={setSec} lang={lang}/>
        {showReg&&<RegModal onClose={()=>setShowReg(false)} onRegister={handleRegister}/>}
        {showAdminLogin&&<AdminLoginModal onClose={()=>setShowAdminLogin(false)} onLogin={()=>setIsAdmin(true)}/>}
      </div>
    </AppCtx.Provider>
  );
}
