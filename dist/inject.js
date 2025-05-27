const e=document.createElement("iframe");e.id="extension-root";e.src=chrome.runtime.getURL("index.html");e.style.cssText=`
  position: fixed;
  top: 0;
  right: 0;
   width: 500px;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.15);
  padding: 18px 14px;
  border: none;
  z-index: 999999;
`;document.body.appendChild(e);const t=document.createElement("script");t.type="module";t.src=chrome.runtime.getURL("/main.js");document.body.appendChild(t);window.addEventListener("message",d=>{var n;if(((n=d.data)==null?void 0:n.action)==="close-extension-panel"){const o=document.getElementById("extension-root");o&&o.remove()}});
