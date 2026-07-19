document.addEventListener("DOMContentLoaded",()=>{
  const setPageLanguage=(page,language)=>{
    page.querySelectorAll(".language-panel").forEach((panel)=>{panel.hidden=!panel.classList.contains("language-"+language)});
    page.querySelectorAll(".lang-switch button").forEach((button)=>{
      const active=button.dataset.lang===language;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  };
  document.querySelectorAll(".source-page").forEach((page)=>{
    setPageLanguage(page,"zh");
    page.querySelector(".lang-switch")?.addEventListener("click",(event)=>{
      const button=event.target.closest("button[data-lang]");
      if(button)setPageLanguage(page,button.dataset.lang);
    });
  });
  document.querySelector(".global-language-switch")?.addEventListener("click",(event)=>{
    const button=event.target.closest("button[data-global-lang]");
    if(!button)return;
    const language=button.dataset.globalLang;
    document.querySelectorAll(".source-page").forEach((page)=>setPageLanguage(page,language));
    document.querySelectorAll("[data-global-lang]").forEach((item)=>{
      const active=item.dataset.globalLang===language;
      item.classList.toggle("active",active);
      item.setAttribute("aria-pressed",String(active));
    });
  });
  const dialog=document.querySelector(".image-viewer");
  if(dialog){
    const target=dialog.querySelector("img");
    document.querySelectorAll(".source-copy img").forEach((img)=>img.addEventListener("click",()=>{
      target.src=img.src;
      target.alt=img.alt||"原书图片放大预览";
      dialog.showModal();
    }));
    dialog.querySelector("button").addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",(event)=>{if(event.target===dialog)dialog.close()});
  }
  const input=document.querySelector(".search input");
  if(input){
    input.addEventListener("input",()=>{
      const query=input.value.trim().toLowerCase();
      document.querySelectorAll(".topic-card").forEach((card)=>{card.hidden=query&&!card.textContent.toLowerCase().includes(query)});
      document.querySelectorAll(".index-group").forEach((group)=>{group.hidden=![...group.querySelectorAll(".topic-card")].some((card)=>!card.hidden)});
    });
  }
});