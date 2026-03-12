import{r as s}from"./index.DPmudqx8.js";/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function p(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,e=Object.getOwnPropertySymbols(n);r<e.length;r++)a.indexOf(e[r])<0&&Object.prototype.propertyIsEnumerable.call(n,e[r])&&(o[e[r]]=n[e[r]]);return o}const h=n=>{const a=Object.keys(n).sort((o,e)=>n[e]-n[o]);return a.map((o,e)=>{let r="";const d=n[o],u=a[e-1],t=u?n[u]:null;return d>=0&&(r=`(min-width: ${d}px)`),t!==null&&(r&&(r+=" and "),r+=`(max-width: ${t-1}px)`),{breakpoint:o,maxWidth:t?t-1:null,minWidth:d,query:r}})},x=typeof window>"u"?s.useEffect:s.useLayoutEffect,b={breakpoint:void 0,minWidth:void 0,maxWidth:void 0},O=(n,a,o=!0)=>{const e=s.useMemo(()=>h(n),[n]),[r,d]=s.useState(()=>{for(let t of e){const{query:i}=t,c=p(t,["query"]);if(typeof window<"u"&&!(a&&o)){if(window.matchMedia(i).matches)return c}else if(c.breakpoint===a)return c}return b}),u=s.useCallback(({matches:t},i)=>{t&&d(i)},[]);return x(()=>{const t=e.map(i=>{var{query:c}=i,f=p(i,["query"]);const m=window.matchMedia(c);u(m,f);const l=y=>{u(y,f)};return m.addListener(l),()=>m.removeListener(l)});return()=>t.forEach(i=>i())},[e,u]),s.useDebugValue(r,t=>typeof t.breakpoint=="string"?`${t.breakpoint} (${t.minWidth} ≤ x${t.maxWidth?` < ${t.maxWidth+1}`:""})`:""),r},k={sm:640,md:768,lg:1024,xl:1280,"2xl":1536,"3xl":2500};export{k as t,O as u};
