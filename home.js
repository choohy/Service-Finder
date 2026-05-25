import { useState } from "react";

const SERVICES = ["Personal Care","Meal Delivery","Transport","Nursing","Physio","Cleaning","Companionship","Occupational Therapy"];

const initProviders = [
  { id:1, name:"CareConnect", services:["Personal Care","Cleaning","Companionship"], ndis:true, rate:null, rating:4.7, reviews:23 },
  { id:2, name:"MobileNurse+", services:["Nursing","Physio"], ndis:true, rate:null, rating:4.5, reviews:18 },
  { id:3, name:"SunriseMeals", services:["Meal Delivery"], ndis:false, rate:18, rating:4.2, reviews:41 },
  { id:4, name:"EasyRide Seniors", services:["Transport"], ndis:true, rate:null, rating:4.8, reviews:57 },
  { id:5, name:"OT Solutions", services:["Occupational Therapy","Physio"], ndis:true, rate:null, rating:4.6, reviews:12 },
  { id:6, name:"HomeHelpers", services:["Cleaning","Personal Care","Meal Delivery"], ndis:false, rate:32, rating:3.9, reviews:29 },
];

const initClients = [
  { id:1, name:"Margaret Chen", age:"75-84", services:["Personal Care","Meal Delivery"], schedule:"Weekdays", ndis:"Approved" },
  { id:2, name:"Robert Patel", age:"85+", services:["Nursing","Transport","Companionship"], schedule:"Daily", ndis:"Pending" },
  { id:3, name:"Dorothy Walsh", age:"65-74", services:["Physio","Cleaning"], schedule:"Twice weekly", ndis:"Not eligible" },
];

const AGE_BRACKETS = ["65-74","75-84","85+"];
const SCHEDULES = ["Daily","Weekdays","Twice weekly","Weekly","As needed"];
const NDIS_STATUSES = ["Approved","Pending","Not eligible","Unknown"];

const Stars = ({ val }) => {
  return (
    <span style={{color:"#c5a000",fontSize:13,letterSpacing:1}}>
      {"★".repeat(Math.round(val))}{"☆".repeat(5-Math.round(val))}
      <span style={{color:"var(--color-text-secondary)",marginLeft:4,fontSize:12}}>{val.toFixed(1)}</span>
    </span>
  );
};

const Badge = ({ label, color }) => {
  const colors = {
    green:{bg:"#eaf3de",text:"#3b6d11"},
    blue:{bg:"#e6f1fb",text:"#185fa5"},
    amber:{bg:"#faeeda",text:"#854f0b"},
    gray:{bg:"#f1efe8",text:"#5f5e5a"},
    pink:{bg:"#fbeaf0",text:"#993556"},
  };
  const c = colors[color]||colors.gray;
  return <span style={{background:c.bg,color:c.text,fontSize:11,padding:"2px 8px",borderRadius:99,fontWeight:500,whiteSpace:"nowrap"}}>{label}</span>;
};

const ndisColor = s => s==="Approved"?"green":s==="Pending"?"amber":s==="Not eligible"?"gray":"pink";

export default function App() {
  const [tab, setTab] = useState("explore");
  const [providers, setProviders] = useState(initProviders);
  const [clients, setClients] = useState(initClients);

  const [pFilter, setPFilter] = useState({service:"",ndis:"",minRating:0});
  const [cFilter, setCFilter] = useState({service:"",ndis:""});
  const [matchClient, setMatchClient] = useState(null);

  const [showAddP, setShowAddP] = useState(false);
  const [showAddC, setShowAddC] = useState(false);
  const [newP, setNewP] = useState({name:"",services:[],ndis:false,rate:"",rating:"",reviews:""});
  const [newC, setNewC] = useState({name:"",age:"65-74",services:[],schedule:"Weekdays",ndis:"Unknown"});

  const tabs = [{id:"explore",label:"Services",icon:"ti-list"},{id:"clients",label:"Clients",icon:"ti-users"},{id:"providers",label:"Providers",icon:"ti-building"},{id:"match",label:"Match",icon:"ti-arrows-join"}];

  const filteredProviders = providers.filter(p => {
    if(pFilter.service && !p.services.includes(pFilter.service)) return false;
    if(pFilter.ndis==="yes" && !p.ndis) return false;
    if(pFilter.ndis==="no" && p.ndis) return false;
    if(p.rating < pFilter.minRating) return false;
    return true;
  });

  const filteredClients = clients.filter(c => {
    if(cFilter.service && !c.services.includes(cFilter.service)) return false;
    if(cFilter.ndis && c.ndis!==cFilter.ndis) return false;
    return true;
  });

  const matchedProviders = matchClient
    ? providers.filter(p => p.services.some(s => matchClient.services.includes(s)) && (matchClient.ndis==="Approved" ? p.ndis : true))
    : [];

  const addProvider = () => {
    if(!newP.name||!newP.services.length) return;
    setProviders([...providers,{...newP,id:Date.now(),rate:newP.rate?parseFloat(newP.rate):null,rating:newP.rating?parseFloat(newP.rating):4.0,reviews:newP.reviews?parseInt(newP.reviews):0}]);
    setNewP({name:"",services:[],ndis:false,rate:"",rating:"",reviews:""});
    setShowAddP(false);
  };

  const addClient = () => {
    if(!newC.name||!newC.services.length) return;
    setClients([...clients,{...newC,id:Date.now()}]);
    setNewC({name:"",age:"65-74",services:[],schedule:"Weekdays",ndis:"Unknown"});
    setShowAddC(false);
  };

  const toggleSvc = (svc, arr, setArr) => {
    setArr(arr.includes(svc)?arr.filter(s=>s!==svc):[...arr,svc]);
  };

  const inp = {
    style:{width:"100%",padding:"7px 10px",fontSize:13,border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",boxSizing:"border-box",marginTop:4}
  };

  const sel = {
    style:{width:"100%",padding:"7px 10px",fontSize:13,border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",boxSizing:"border-box",marginTop:4}
  };

  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:700,margin:"0 auto",paddingBottom:40}}>
      <h2 style={{sr:"only",position:"absolute",left:-9999}}>Elderly Care Service Matcher</h2>

      <div style={{padding:"1.5rem 0 1rem"}}>
        <h1 style={{fontSize:20,fontWeight:500,margin:0,color:"var(--color-text-primary)"}}>Elderly care service matcher</h1>
        <p style={{fontSize:13,color:"var(--color-text-secondary)",margin:"4px 0 0"}}>Connect clients with the right care providers — including NDIS-supported services</p>
      </div>

      <div style={{display:"flex",gap:4,borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:"1.5rem"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 16px",fontSize:13,fontWeight:tab===t.id?500:400,border:"none",background:"none",borderBottom:tab===t.id?"2px solid var(--color-text-primary)":"2px solid transparent",color:tab===t.id?"var(--color-text-primary)":"var(--color-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <i className={`ti ${t.icon}`} style={{fontSize:15}} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      {tab==="explore" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:"1.5rem"}}>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Service type</label>
              <select {...sel} value={pFilter.service} onChange={e=>setPFilter({...pFilter,service:e.target.value})}>
                <option value="">All services</option>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>NDIS support</label>
              <select {...sel} value={pFilter.ndis} onChange={e=>setPFilter({...pFilter,ndis:e.target.value})}>
                <option value="">Any</option>
                <option value="yes">NDIS available</option>
                <option value="no">Non-NDIS only</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Min rating</label>
              <select {...sel} value={pFilter.minRating} onChange={e=>setPFilter({...pFilter,minRating:parseFloat(e.target.value)})}>
                <option value={0}>Any rating</option>
                <option value={4}>4.0+</option>
                <option value={4.5}>4.5+</option>
              </select>
            </div>
          </div>

          {filteredProviders.length===0 && <p style={{color:"var(--color-text-secondary)",fontSize:13}}>No providers match your filters.</p>}

          <div style={{display:"grid",gap:10}}>
            {filteredProviders.map(p=>(
              <div key={p.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div>
                    <p style={{fontWeight:500,fontSize:15,margin:0}}>{p.name}</p>
                    <Stars val={p.rating} />
                    <span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:4}}>({p.reviews} reviews)</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {p.ndis ? <Badge label="NDIS registered" color="green"/> : <Badge label={`$${p.rate}/hr`} color="amber"/>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                  {p.services.map(s=><Badge key={s} label={s} color="blue"/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="clients" && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <select {...sel} style={{...sel.style,width:"auto",marginTop:0}} value={cFilter.service} onChange={e=>setCFilter({...cFilter,service:e.target.value})}>
                <option value="">All services</option>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
              <select {...sel} style={{...sel.style,width:"auto",marginTop:0}} value={cFilter.ndis} onChange={e=>setCFilter({...cFilter,ndis:e.target.value})}>
                <option value="">Any NDIS status</option>
                {NDIS_STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={()=>setShowAddC(!showAddC)} style={{padding:"7px 14px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:6}}>
              <i className="ti ti-plus" style={{fontSize:15}} aria-hidden="true"/>Add client
            </button>
          </div>

          {showAddC && (
            <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",padding:"1rem 1.25rem",marginBottom:"1rem"}}>
              <p style={{fontWeight:500,fontSize:14,margin:"0 0 12px"}}>New client</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Full name</label><input {...inp} placeholder="e.g. Joan Smith" value={newC.name} onChange={e=>setNewC({...newC,name:e.target.value})}/></div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Age bracket</label>
                  <select {...sel} value={newC.age} onChange={e=>setNewC({...newC,age:e.target.value})}>
                    {AGE_BRACKETS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Schedule</label>
                  <select {...sel} value={newC.schedule} onChange={e=>setNewC({...newC,schedule:e.target.value})}>
                    {SCHEDULES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>NDIS status</label>
                  <select {...sel} value={newC.ndis} onChange={e=>setNewC({...newC,ndis:e.target.value})}>
                    {NDIS_STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Services needed</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
                  {SERVICES.map(s=>(
                    <button key={s} onClick={()=>toggleSvc(s,newC.services,v=>setNewC({...newC,services:v}))} style={{padding:"4px 10px",fontSize:12,cursor:"pointer",borderRadius:99,border:`0.5px solid ${newC.services.includes(s)?"#185fa5":"var(--color-border-secondary)"}`,background:newC.services.includes(s)?"#e6f1fb":"var(--color-background-primary)",color:newC.services.includes(s)?"#185fa5":"var(--color-text-secondary)"}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addClient} style={{padding:"7px 16px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"none",background:"#185fa5",color:"#fff"}}>Save client</button>
                <button onClick={()=>setShowAddC(false)} style={{padding:"7px 16px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)"}}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{display:"grid",gap:10}}>
            {filteredClients.map(c=>(
              <div key={c.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"#e1f5ee",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:"#0f6e56"}}>
                      {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <p style={{fontWeight:500,fontSize:14,margin:0}}>{c.name}</p>
                      <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:0}}>Age {c.age} · {c.schedule}</p>
                    </div>
                  </div>
                  <Badge label={c.ndis} color={ndisColor(c.ndis)}/>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                  {c.services.map(s=><Badge key={s} label={s} color="blue"/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="providers" && (
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"1rem"}}>
            <button onClick={()=>setShowAddP(!showAddP)} style={{padding:"7px 14px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-secondary)",color:"var(--color-text-primary)",display:"flex",alignItems:"center",gap:6}}>
              <i className="ti ti-plus" style={{fontSize:15}} aria-hidden="true"/>Add provider
            </button>
          </div>

          {showAddP && (
            <div style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-secondary)",padding:"1rem 1.25rem",marginBottom:"1rem"}}>
              <p style={{fontWeight:500,fontSize:14,margin:"0 0 12px"}}>New provider</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Business name</label><input {...inp} placeholder="e.g. Sunrise Care" value={newP.name} onChange={e=>setNewP({...newP,name:e.target.value})}/></div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Hourly rate (if non-NDIS)</label><input {...inp} type="number" placeholder="e.g. 45" value={newP.rate} onChange={e=>setNewP({...newP,rate:e.target.value})}/></div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Initial rating</label><input {...inp} type="number" step="0.1" min="1" max="5" placeholder="e.g. 4.5" value={newP.rating} onChange={e=>setNewP({...newP,rating:e.target.value})}/></div>
                <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Review count</label><input {...inp} type="number" placeholder="e.g. 12" value={newP.reviews} onChange={e=>setNewP({...newP,reviews:e.target.value})}/></div>
              </div>
              <div style={{marginBottom:10}}>
                <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Services offered</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
                  {SERVICES.map(s=>(
                    <button key={s} onClick={()=>toggleSvc(s,newP.services,v=>setNewP({...newP,services:v}))} style={{padding:"4px 10px",fontSize:12,cursor:"pointer",borderRadius:99,border:`0.5px solid ${newP.services.includes(s)?"#185fa5":"var(--color-border-secondary)"}`,background:newP.services.includes(s)?"#e6f1fb":"var(--color-background-primary)",color:newP.services.includes(s)?"#185fa5":"var(--color-text-secondary)"}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" id="ndisChk" checked={newP.ndis} onChange={e=>setNewP({...newP,ndis:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
                <label htmlFor="ndisChk" style={{fontSize:13,cursor:"pointer"}}>NDIS registered provider</label>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addProvider} style={{padding:"7px 16px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"none",background:"#185fa5",color:"#fff"}}>Save provider</button>
                <button onClick={()=>setShowAddP(false)} style={{padding:"7px 16px",fontSize:13,cursor:"pointer",borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)"}}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{display:"grid",gap:10}}>
            {providers.map(p=>(
              <div key={p.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div>
                    <p style={{fontWeight:500,fontSize:15,margin:0}}>{p.name}</p>
                    <Stars val={p.rating}/>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:4}}>({p.reviews} reviews)</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {p.ndis ? <Badge label="NDIS registered" color="green"/> : <Badge label={`$${p.rate}/hr`} color="amber"/>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                  {p.services.map(s=><Badge key={s} label={s} color="blue"/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="match" && (
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginTop:0}}>Select a client to find best-fit providers based on their services and NDIS status.</p>
          <div style={{display:"grid",gap:8,marginBottom:"1.5rem"}}>
            {clients.map(c=>(
              <button key={c.id} onClick={()=>setMatchClient(matchClient?.id===c.id?null:c)} style={{textAlign:"left",padding:"12px 16px",borderRadius:"var(--border-radius-lg)",border:matchClient?.id===c.id?"1.5px solid #185fa5":"0.5px solid var(--color-border-tertiary)",background:matchClient?.id===c.id?"#e6f1fb":"var(--color-background-primary)",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:500,fontSize:14,margin:0,color:matchClient?.id===c.id?"#185fa5":"var(--color-text-primary)"}}>{c.name}</p>
                  <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"2px 0 0"}}>{c.services.join(" · ")}</p>
                </div>
                <Badge label={c.ndis} color={ndisColor(c.ndis)}/>
              </button>
            ))}
          </div>

          {matchClient && (
            <div>
              <p style={{fontWeight:500,fontSize:14,marginBottom:10}}>
                {matchedProviders.length} provider{matchedProviders.length!==1?"s":""} matched for {matchClient.name}
              </p>
              {matchedProviders.length===0 && <p style={{fontSize:13,color:"var(--color-text-secondary)"}}>No providers currently match this client's needs.</p>}
              <div style={{display:"grid",gap:10}}>
                {matchedProviders.map(p=>{
                  const matched = p.services.filter(s=>matchClient.services.includes(s));
                  return (
                    <div key={p.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                        <div>
                          <p style={{fontWeight:500,fontSize:15,margin:0}}>{p.name}</p>
                          <Stars val={p.rating}/>
                        </div>
                        {p.ndis ? <Badge label="NDIS registered" color="green"/> : <Badge label={`$${p.rate}/hr`} color="amber"/>}
                      </div>
                      <div style={{marginTop:10}}>
                        <p style={{fontSize:11,color:"var(--color-text-secondary)",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Covers</p>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {matched.map(s=><Badge key={s} label={s} color="teal"/>)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
