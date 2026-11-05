(function(root){
 function norm(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
 function parts(text,title=''){
  const ing=/^\s*Ingredientes\b\s*:?/im.exec(text);if(!ing)return null;
  const tail=text.slice(ing.index+ing[0].length),prep=/\b(?:Preparaci[oó]n|Proceso de [Ee]laboraci[oó]n|Elaboraci[oó]n|Procedimiento|Instrucciones|Paso a paso)\b\s*:?/i.exec(tail);if(!prep)return null;
  let ingredients=tail.slice(0,prep.index).trim(),steps=tail.slice(prep.index+prep[0].length).trim();
  if(title){const safe=title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');ingredients=ingredients.replace(new RegExp(safe+'\\s*[-–:]?\\s*$','i'),'').trim()}
  // A continuation page sometimes repeats the recipe title after its preparation heading.
  const first=steps.split('\n')[0].trim();if(title&&norm(first.replace(/^(?:de la |del |de |:)\s*/i,'')).includes(norm(title)))steps=steps.slice(first.length).trim();
  const end=/\n\s*(?:Consejo(?:\s+[úu]til)?|Conservaci[oó]n|Adaptaciones|Resultado esperado|Macros(?:\s+por\s+raci[oó]n)?|Calor[ií]as|Informaci[oó]n nutricional|Tiempo(?:\s+de\s+preparaci[oó]n)?)\s*[:\n]/i.exec(steps);
  let advice='';if(end){advice=steps.slice(end.index).trim();steps=steps.slice(0,end.index).trim()}
  return {ingredients,steps,advice};
 }
 function ingredientLines(text,title=''){
  const p=parts(text,title);if(!p)return [];
  const lines=p.ingredients.split('\n').map(s=>s.trim()).filter(Boolean),result=[];
  let stopped=false;
  for(let line of lines){
   if(/^(?:Tiempo|Calor[ií]as|Macros|Porciones|Raciones|Dificultad|Ideal para)\s*[:|]/i.test(line)){stopped=true;continue}
   if(stopped||/^\([^)]*(?:porciones|raciones|personas)[^)]*\)/i.test(line)||/^\d+[.]?$/.test(line))continue;
   line=line.replace(/^[•●▪\-]\s*/, '').replace(/\s+\d+[.]$/,'');
   if(!line)continue;
   const newItem=/^(?:\d|[¼½¾⅓⅔]|Para\b|Sal\b|Pimienta\b|Agua\b|Aceite\b|Opcional\b|Especias\b|Hielo\b|Hierbas\b|Canela\b|Jengibre\b|Caldo\b|Lim[oó]n\b|Eneldo\b|Vinagre\b|Leche\b|Miel\b|Vainilla\b|Ajo\b|Cebolla\b|Mix\b|Zanahoria\b|Salsa\b|Pizca\b|Un\b|Una\b)/i.test(line);
   // Preserve lines as written; join only a clear lowercase continuation.
   if(result.length&&!newItem&&/^[a-záéíóúüñ(]/.test(line))result[result.length-1]+=' '+line;else result.push(line);
  }
  return result;
 }
 const api={parts,ingredientLines};root.CTSCollection=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
