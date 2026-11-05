'use strict';
const BC={
defaults:()=>({week:0,people:2,mode:'two',trays:2,burners:2,start:new Date().toISOString().slice(0,10),overrides:{},done:[],yields:{},pantry:[]}),
menu:(data,s)=>data.weeks[s.week].menu.map((row,d)=>row.map((id,m)=>s.overrides[d+':'+m]??id)),
uses(data,s,days){return CTP.batchUses(data,s,days,window.CTS_PROFILE)},
sessions(s){return s.mode==='one'?[{name:'Sesión única',day:-1,days:[0,1,2,3,4,5,6]}]:[{name:'Sesión 1 · inicio de semana',day:0,days:[0,1,2]},{name:'Sesión 2 · mitad de semana',day:3,days:[3,4,5,6]}]},
storage(base,session,use){const delta=use.day-session.day;return delta>=(base.rice?1:2)?'Congelar el día de preparación':'Nevera · consumir antes de 48 h'+(base.rice?' (arroz: antes de 24 h)':'')},
shopping(data,s){return CTP.batchShopping(data,s,window.CTS_PROFILE)},
tasks(data,s,session){const uses=this.uses(data,s,session.days),clock={oven:[20],hob:Array(s.burners||2).fill(20)};let tasks=[];for(const [id,list] of Object.entries(uses)){const b=data.bases.find(b=>b.id===id),rations=list.reduce((v,u)=>v+u.quantityFactor,0),resource=b.resource.startsWith('Horno')?'oven':'hob',weight=b.ingredients.filter(i=>i.unit==='g').reduce((a,i)=>a+i.q,0)*rations,tandas=resource==='oven'?Math.max(1,Math.ceil(weight/(1000*(s.trays||2)))):Math.ceil(rations/6),lane=clock[resource].indexOf(Math.min(...clock[resource])),start=clock[resource][lane],end=start+b.minutes*tandas;clock[resource][lane]=end;tasks.push({...b,rations,tandas,start,end,lane,uses:list})}return {tasks,estimated:Math.max(...Object.values(clock).flat())+15}},
valid(s){return s&&Number.isInteger(s.week)&&s.week>=0&&s.week<8&&Number.isInteger(s.people)&&s.people>=1&&s.people<=8&&['one','two'].includes(s.mode)&&/^\d{4}-\d{2}-\d{2}$/.test(s.start)&&Array.isArray(s.done)&&s.done.every(x=>typeof x==='string')&&Array.isArray(s.pantry)&&s.pantry.every(x=>typeof x==='string')&&s.yields&&Object.values(s.yields).every(v=>Number.isFinite(v)&&v>0)&&s.overrides&&Object.entries(s.overrides).every(([k,v])=>/^[0-6]:[01]$/.test(k)&&Number.isInteger(v)&&v>=0&&v<128)}
};
if(typeof module!=='undefined')module.exports=BC;
