(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerPolicy&&(i.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?i.credentials="include":l.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(l){if(l.ep)return;l.ep=!0;const i=n(l);fetch(l.href,i)}})();function fc(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Js={exports:{}},ll={},qs={exports:{}},I={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var er=Symbol.for("react.element"),pc=Symbol.for("react.portal"),mc=Symbol.for("react.fragment"),hc=Symbol.for("react.strict_mode"),gc=Symbol.for("react.profiler"),vc=Symbol.for("react.provider"),yc=Symbol.for("react.context"),xc=Symbol.for("react.forward_ref"),wc=Symbol.for("react.suspense"),kc=Symbol.for("react.memo"),Sc=Symbol.for("react.lazy"),Ao=Symbol.iterator;function jc(e){return e===null||typeof e!="object"?null:(e=Ao&&e[Ao]||e["@@iterator"],typeof e=="function"?e:null)}var bs={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ea=Object.assign,ta={};function dn(e,t,n){this.props=e,this.context=t,this.refs=ta,this.updater=n||bs}dn.prototype.isReactComponent={};dn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};dn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function na(){}na.prototype=dn.prototype;function Vi(e,t,n){this.props=e,this.context=t,this.refs=ta,this.updater=n||bs}var Bi=Vi.prototype=new na;Bi.constructor=Vi;ea(Bi,dn.prototype);Bi.isPureReactComponent=!0;var Uo=Array.isArray,ra=Object.prototype.hasOwnProperty,Hi={current:null},la={key:!0,ref:!0,__self:!0,__source:!0};function ia(e,t,n){var r,l={},i=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(i=""+t.key),t)ra.call(t,r)&&!la.hasOwnProperty(r)&&(l[r]=t[r]);var a=arguments.length-2;if(a===1)l.children=n;else if(1<a){for(var u=Array(a),d=0;d<a;d++)u[d]=arguments[d+2];l.children=u}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)l[r]===void 0&&(l[r]=a[r]);return{$$typeof:er,type:e,key:i,ref:o,props:l,_owner:Hi.current}}function Nc(e,t){return{$$typeof:er,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Wi(e){return typeof e=="object"&&e!==null&&e.$$typeof===er}function Cc(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Vo=/\/+/g;function kl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Cc(""+e.key):t.toString(36)}function Sr(e,t,n,r,l){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(i){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case er:case pc:o=!0}}if(o)return o=e,l=l(o),e=r===""?"."+kl(o,0):r,Uo(l)?(n="",e!=null&&(n=e.replace(Vo,"$&/")+"/"),Sr(l,t,n,"",function(d){return d})):l!=null&&(Wi(l)&&(l=Nc(l,n+(!l.key||o&&o.key===l.key?"":(""+l.key).replace(Vo,"$&/")+"/")+e)),t.push(l)),1;if(o=0,r=r===""?".":r+":",Uo(e))for(var a=0;a<e.length;a++){i=e[a];var u=r+kl(i,a);o+=Sr(i,t,n,u,l)}else if(u=jc(e),typeof u=="function")for(e=u.call(e),a=0;!(i=e.next()).done;)i=i.value,u=r+kl(i,a++),o+=Sr(i,t,n,u,l);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function ir(e,t,n){if(e==null)return e;var r=[],l=0;return Sr(e,r,"","",function(i){return t.call(n,i,l++)}),r}function Ec(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var pe={current:null},jr={transition:null},_c={ReactCurrentDispatcher:pe,ReactCurrentBatchConfig:jr,ReactCurrentOwner:Hi};function oa(){throw Error("act(...) is not supported in production builds of React.")}I.Children={map:ir,forEach:function(e,t,n){ir(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ir(e,function(){t++}),t},toArray:function(e){return ir(e,function(t){return t})||[]},only:function(e){if(!Wi(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};I.Component=dn;I.Fragment=mc;I.Profiler=gc;I.PureComponent=Vi;I.StrictMode=hc;I.Suspense=wc;I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=_c;I.act=oa;I.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=ea({},e.props),l=e.key,i=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,o=Hi.current),t.key!==void 0&&(l=""+t.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(u in t)ra.call(t,u)&&!la.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&a!==void 0?a[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){a=Array(u);for(var d=0;d<u;d++)a[d]=arguments[d+2];r.children=a}return{$$typeof:er,type:e.type,key:l,ref:i,props:r,_owner:o}};I.createContext=function(e){return e={$$typeof:yc,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:vc,_context:e},e.Consumer=e};I.createElement=ia;I.createFactory=function(e){var t=ia.bind(null,e);return t.type=e,t};I.createRef=function(){return{current:null}};I.forwardRef=function(e){return{$$typeof:xc,render:e}};I.isValidElement=Wi;I.lazy=function(e){return{$$typeof:Sc,_payload:{_status:-1,_result:e},_init:Ec}};I.memo=function(e,t){return{$$typeof:kc,type:e,compare:t===void 0?null:t}};I.startTransition=function(e){var t=jr.transition;jr.transition={};try{e()}finally{jr.transition=t}};I.unstable_act=oa;I.useCallback=function(e,t){return pe.current.useCallback(e,t)};I.useContext=function(e){return pe.current.useContext(e)};I.useDebugValue=function(){};I.useDeferredValue=function(e){return pe.current.useDeferredValue(e)};I.useEffect=function(e,t){return pe.current.useEffect(e,t)};I.useId=function(){return pe.current.useId()};I.useImperativeHandle=function(e,t,n){return pe.current.useImperativeHandle(e,t,n)};I.useInsertionEffect=function(e,t){return pe.current.useInsertionEffect(e,t)};I.useLayoutEffect=function(e,t){return pe.current.useLayoutEffect(e,t)};I.useMemo=function(e,t){return pe.current.useMemo(e,t)};I.useReducer=function(e,t,n){return pe.current.useReducer(e,t,n)};I.useRef=function(e){return pe.current.useRef(e)};I.useState=function(e){return pe.current.useState(e)};I.useSyncExternalStore=function(e,t,n){return pe.current.useSyncExternalStore(e,t,n)};I.useTransition=function(){return pe.current.useTransition()};I.version="18.3.1";qs.exports=I;var M=qs.exports;const zc=fc(M);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tc=M,Pc=Symbol.for("react.element"),Lc=Symbol.for("react.fragment"),Ic=Object.prototype.hasOwnProperty,Rc=Tc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Mc={key:!0,ref:!0,__self:!0,__source:!0};function sa(e,t,n){var r,l={},i=null,o=null;n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)Ic.call(t,r)&&!Mc.hasOwnProperty(r)&&(l[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)l[r]===void 0&&(l[r]=t[r]);return{$$typeof:Pc,type:e,key:i,ref:o,props:l,_owner:Rc.current}}ll.Fragment=Lc;ll.jsx=sa;ll.jsxs=sa;Js.exports=ll;var s=Js.exports,Gl={},aa={exports:{}},Ce={},ua={exports:{}},ca={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(N,T){var P=N.length;N.push(T);e:for(;0<P;){var H=P-1>>>1,x=N[H];if(0<l(x,T))N[H]=T,N[P]=x,P=H;else break e}}function n(N){return N.length===0?null:N[0]}function r(N){if(N.length===0)return null;var T=N[0],P=N.pop();if(P!==T){N[0]=P;e:for(var H=0,x=N.length,Y=x>>>1;H<Y;){var $=2*(H+1)-1,we=N[$],J=$+1,re=N[J];if(0>l(we,P))J<x&&0>l(re,we)?(N[H]=re,N[J]=P,H=J):(N[H]=we,N[$]=P,H=$);else if(J<x&&0>l(re,P))N[H]=re,N[J]=P,H=J;else break e}}return T}function l(N,T){var P=N.sortIndex-T.sortIndex;return P!==0?P:N.id-T.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;e.unstable_now=function(){return i.now()}}else{var o=Date,a=o.now();e.unstable_now=function(){return o.now()-a}}var u=[],d=[],h=1,g=null,m=3,w=!1,k=!1,S=!1,D=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(N){for(var T=n(d);T!==null;){if(T.callback===null)r(d);else if(T.startTime<=N)r(d),T.sortIndex=T.expirationTime,t(u,T);else break;T=n(d)}}function v(N){if(S=!1,f(N),!k)if(n(u)!==null)k=!0,hn(j);else{var T=n(d);T!==null&&$t(v,T.startTime-N)}}function j(N,T){k=!1,S&&(S=!1,p(z),z=-1),w=!0;var P=m;try{for(f(T),g=n(u);g!==null&&(!(g.expirationTime>T)||N&&!ne());){var H=g.callback;if(typeof H=="function"){g.callback=null,m=g.priorityLevel;var x=H(g.expirationTime<=T);T=e.unstable_now(),typeof x=="function"?g.callback=x:g===n(u)&&r(u),f(T)}else r(u);g=n(u)}if(g!==null)var Y=!0;else{var $=n(d);$!==null&&$t(v,$.startTime-T),Y=!1}return Y}finally{g=null,m=P,w=!1}}var E=!1,_=null,z=-1,B=5,L=-1;function ne(){return!(e.unstable_now()-L<B)}function Qe(){if(_!==null){var N=e.unstable_now();L=N;var T=!0;try{T=_(!0,N)}finally{T?nt():(E=!1,_=null)}}else E=!1}var nt;if(typeof c=="function")nt=function(){c(Qe)};else if(typeof MessageChannel<"u"){var mn=new MessageChannel,wl=mn.port2;mn.port1.onmessage=Qe,nt=function(){wl.postMessage(null)}}else nt=function(){D(Qe,0)};function hn(N){_=N,E||(E=!0,nt())}function $t(N,T){z=D(function(){N(e.unstable_now())},T)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(N){N.callback=null},e.unstable_continueExecution=function(){k||w||(k=!0,hn(j))},e.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):B=0<N?Math.floor(1e3/N):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(N){switch(m){case 1:case 2:case 3:var T=3;break;default:T=m}var P=m;m=T;try{return N()}finally{m=P}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(N,T){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var P=m;m=N;try{return T()}finally{m=P}},e.unstable_scheduleCallback=function(N,T,P){var H=e.unstable_now();switch(typeof P=="object"&&P!==null?(P=P.delay,P=typeof P=="number"&&0<P?H+P:H):P=H,N){case 1:var x=-1;break;case 2:x=250;break;case 5:x=1073741823;break;case 4:x=1e4;break;default:x=5e3}return x=P+x,N={id:h++,callback:T,priorityLevel:N,startTime:P,expirationTime:x,sortIndex:-1},P>H?(N.sortIndex=P,t(d,N),n(u)===null&&N===n(d)&&(S?(p(z),z=-1):S=!0,$t(v,P-H))):(N.sortIndex=x,t(u,N),k||w||(k=!0,hn(j))),N},e.unstable_shouldYield=ne,e.unstable_wrapCallback=function(N){var T=m;return function(){var P=m;m=T;try{return N.apply(this,arguments)}finally{m=P}}}})(ca);ua.exports=ca;var Oc=ua.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dc=M,Ne=Oc;function y(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,$n={};function Ot(e,t){rn(e,t),rn(e+"Capture",t)}function rn(e,t){for($n[e]=t,e=0;e<t.length;e++)da.add(t[e])}var Je=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Xl=Object.prototype.hasOwnProperty,$c=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bo={},Ho={};function Fc(e){return Xl.call(Ho,e)?!0:Xl.call(Bo,e)?!1:$c.test(e)?Ho[e]=!0:(Bo[e]=!0,!1)}function Ac(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Uc(e,t,n,r){if(t===null||typeof t>"u"||Ac(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function me(e,t,n,r,l,i,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=o}var oe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){oe[e]=new me(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];oe[t]=new me(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){oe[e]=new me(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){oe[e]=new me(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){oe[e]=new me(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){oe[e]=new me(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){oe[e]=new me(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){oe[e]=new me(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){oe[e]=new me(e,5,!1,e.toLowerCase(),null,!1,!1)});var Qi=/[\-:]([a-z])/g;function Ki(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Qi,Ki);oe[t]=new me(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Qi,Ki);oe[t]=new me(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Qi,Ki);oe[t]=new me(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){oe[e]=new me(e,1,!1,e.toLowerCase(),null,!1,!1)});oe.xlinkHref=new me("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){oe[e]=new me(e,1,!1,e.toLowerCase(),null,!0,!0)});function Yi(e,t,n,r){var l=oe.hasOwnProperty(t)?oe[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Uc(t,n,l,r)&&(n=null),r||l===null?Fc(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var tt=Dc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,or=Symbol.for("react.element"),At=Symbol.for("react.portal"),Ut=Symbol.for("react.fragment"),Gi=Symbol.for("react.strict_mode"),Zl=Symbol.for("react.profiler"),fa=Symbol.for("react.provider"),pa=Symbol.for("react.context"),Xi=Symbol.for("react.forward_ref"),Jl=Symbol.for("react.suspense"),ql=Symbol.for("react.suspense_list"),Zi=Symbol.for("react.memo"),lt=Symbol.for("react.lazy"),ma=Symbol.for("react.offscreen"),Wo=Symbol.iterator;function gn(e){return e===null||typeof e!="object"?null:(e=Wo&&e[Wo]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,Sl;function Nn(e){if(Sl===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Sl=t&&t[1]||""}return`
`+Sl+e}var jl=!1;function Nl(e,t){if(!e||jl)return"";jl=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var l=d.stack.split(`
`),i=r.stack.split(`
`),o=l.length-1,a=i.length-1;1<=o&&0<=a&&l[o]!==i[a];)a--;for(;1<=o&&0<=a;o--,a--)if(l[o]!==i[a]){if(o!==1||a!==1)do if(o--,a--,0>a||l[o]!==i[a]){var u=`
`+l[o].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=o&&0<=a);break}}}finally{jl=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Nn(e):""}function Vc(e){switch(e.tag){case 5:return Nn(e.type);case 16:return Nn("Lazy");case 13:return Nn("Suspense");case 19:return Nn("SuspenseList");case 0:case 2:case 15:return e=Nl(e.type,!1),e;case 11:return e=Nl(e.type.render,!1),e;case 1:return e=Nl(e.type,!0),e;default:return""}}function bl(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Ut:return"Fragment";case At:return"Portal";case Zl:return"Profiler";case Gi:return"StrictMode";case Jl:return"Suspense";case ql:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case pa:return(e.displayName||"Context")+".Consumer";case fa:return(e._context.displayName||"Context")+".Provider";case Xi:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Zi:return t=e.displayName||null,t!==null?t:bl(e.type)||"Memo";case lt:t=e._payload,e=e._init;try{return bl(e(t))}catch{}}return null}function Bc(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return bl(t);case 8:return t===Gi?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function yt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ha(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Hc(e){var t=ha(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,i.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function sr(e){e._valueTracker||(e._valueTracker=Hc(e))}function ga(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ha(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Mr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ei(e,t){var n=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Qo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=yt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function va(e,t){t=t.checked,t!=null&&Yi(e,"checked",t,!1)}function ti(e,t){va(e,t);var n=yt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ni(e,t.type,n):t.hasOwnProperty("defaultValue")&&ni(e,t.type,yt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ko(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ni(e,t,n){(t!=="number"||Mr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Cn=Array.isArray;function Jt(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+yt(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function ri(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(y(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Yo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(y(92));if(Cn(n)){if(1<n.length)throw Error(y(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:yt(n)}}function ya(e,t){var n=yt(t.value),r=yt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Go(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function xa(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function li(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?xa(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var ar,wa=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(ar=ar||document.createElement("div"),ar.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=ar.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Fn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var zn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Wc=["Webkit","ms","Moz","O"];Object.keys(zn).forEach(function(e){Wc.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),zn[t]=zn[e]})});function ka(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||zn.hasOwnProperty(e)&&zn[e]?(""+t).trim():t+"px"}function Sa(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=ka(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Qc=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ii(e,t){if(t){if(Qc[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(y(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(y(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(y(61))}if(t.style!=null&&typeof t.style!="object")throw Error(y(62))}}function oi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var si=null;function Ji(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ai=null,qt=null,bt=null;function Xo(e){if(e=rr(e)){if(typeof ai!="function")throw Error(y(280));var t=e.stateNode;t&&(t=ul(t),ai(e.stateNode,e.type,t))}}function ja(e){qt?bt?bt.push(e):bt=[e]:qt=e}function Na(){if(qt){var e=qt,t=bt;if(bt=qt=null,Xo(e),t)for(e=0;e<t.length;e++)Xo(t[e])}}function Ca(e,t){return e(t)}function Ea(){}var Cl=!1;function _a(e,t,n){if(Cl)return e(t,n);Cl=!0;try{return Ca(e,t,n)}finally{Cl=!1,(qt!==null||bt!==null)&&(Ea(),Na())}}function An(e,t){var n=e.stateNode;if(n===null)return null;var r=ul(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(y(231,t,typeof n));return n}var ui=!1;if(Je)try{var vn={};Object.defineProperty(vn,"passive",{get:function(){ui=!0}}),window.addEventListener("test",vn,vn),window.removeEventListener("test",vn,vn)}catch{ui=!1}function Kc(e,t,n,r,l,i,o,a,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(h){this.onError(h)}}var Tn=!1,Or=null,Dr=!1,ci=null,Yc={onError:function(e){Tn=!0,Or=e}};function Gc(e,t,n,r,l,i,o,a,u){Tn=!1,Or=null,Kc.apply(Yc,arguments)}function Xc(e,t,n,r,l,i,o,a,u){if(Gc.apply(this,arguments),Tn){if(Tn){var d=Or;Tn=!1,Or=null}else throw Error(y(198));Dr||(Dr=!0,ci=d)}}function Dt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function za(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Zo(e){if(Dt(e)!==e)throw Error(y(188))}function Zc(e){var t=e.alternate;if(!t){if(t=Dt(e),t===null)throw Error(y(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return Zo(l),e;if(i===r)return Zo(l),t;i=i.sibling}throw Error(y(188))}if(n.return!==r.return)n=l,r=i;else{for(var o=!1,a=l.child;a;){if(a===n){o=!0,n=l,r=i;break}if(a===r){o=!0,r=l,n=i;break}a=a.sibling}if(!o){for(a=i.child;a;){if(a===n){o=!0,n=i,r=l;break}if(a===r){o=!0,r=i,n=l;break}a=a.sibling}if(!o)throw Error(y(189))}}if(n.alternate!==r)throw Error(y(190))}if(n.tag!==3)throw Error(y(188));return n.stateNode.current===n?e:t}function Ta(e){return e=Zc(e),e!==null?Pa(e):null}function Pa(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Pa(e);if(t!==null)return t;e=e.sibling}return null}var La=Ne.unstable_scheduleCallback,Jo=Ne.unstable_cancelCallback,Jc=Ne.unstable_shouldYield,qc=Ne.unstable_requestPaint,X=Ne.unstable_now,bc=Ne.unstable_getCurrentPriorityLevel,qi=Ne.unstable_ImmediatePriority,Ia=Ne.unstable_UserBlockingPriority,$r=Ne.unstable_NormalPriority,ed=Ne.unstable_LowPriority,Ra=Ne.unstable_IdlePriority,il=null,He=null;function td(e){if(He&&typeof He.onCommitFiberRoot=="function")try{He.onCommitFiberRoot(il,e,void 0,(e.current.flags&128)===128)}catch{}}var $e=Math.clz32?Math.clz32:ld,nd=Math.log,rd=Math.LN2;function ld(e){return e>>>=0,e===0?32:31-(nd(e)/rd|0)|0}var ur=64,cr=4194304;function En(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Fr(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,o=n&268435455;if(o!==0){var a=o&~l;a!==0?r=En(a):(i&=o,i!==0&&(r=En(i)))}else o=n&~l,o!==0?r=En(o):i!==0&&(r=En(i));if(r===0)return 0;if(t!==0&&t!==r&&!(t&l)&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-$e(t),l=1<<n,r|=e[n],t&=~l;return r}function id(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function od(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var o=31-$e(i),a=1<<o,u=l[o];u===-1?(!(a&n)||a&r)&&(l[o]=id(a,t)):u<=t&&(e.expiredLanes|=a),i&=~a}}function di(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ma(){var e=ur;return ur<<=1,!(ur&4194240)&&(ur=64),e}function El(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function tr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-$e(t),e[t]=n}function sd(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-$e(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function bi(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-$e(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var O=0;function Oa(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Da,eo,$a,Fa,Aa,fi=!1,dr=[],ct=null,dt=null,ft=null,Un=new Map,Vn=new Map,ot=[],ad="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qo(e,t){switch(e){case"focusin":case"focusout":ct=null;break;case"dragenter":case"dragleave":dt=null;break;case"mouseover":case"mouseout":ft=null;break;case"pointerover":case"pointerout":Un.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vn.delete(t.pointerId)}}function yn(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=rr(t),t!==null&&eo(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function ud(e,t,n,r,l){switch(t){case"focusin":return ct=yn(ct,e,t,n,r,l),!0;case"dragenter":return dt=yn(dt,e,t,n,r,l),!0;case"mouseover":return ft=yn(ft,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return Un.set(i,yn(Un.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,Vn.set(i,yn(Vn.get(i)||null,e,t,n,r,l)),!0}return!1}function Ua(e){var t=Ct(e.target);if(t!==null){var n=Dt(t);if(n!==null){if(t=n.tag,t===13){if(t=za(n),t!==null){e.blockedOn=t,Aa(e.priority,function(){$a(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Nr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=pi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);si=r,n.target.dispatchEvent(r),si=null}else return t=rr(n),t!==null&&eo(t),e.blockedOn=n,!1;t.shift()}return!0}function bo(e,t,n){Nr(e)&&n.delete(t)}function cd(){fi=!1,ct!==null&&Nr(ct)&&(ct=null),dt!==null&&Nr(dt)&&(dt=null),ft!==null&&Nr(ft)&&(ft=null),Un.forEach(bo),Vn.forEach(bo)}function xn(e,t){e.blockedOn===t&&(e.blockedOn=null,fi||(fi=!0,Ne.unstable_scheduleCallback(Ne.unstable_NormalPriority,cd)))}function Bn(e){function t(l){return xn(l,e)}if(0<dr.length){xn(dr[0],e);for(var n=1;n<dr.length;n++){var r=dr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(ct!==null&&xn(ct,e),dt!==null&&xn(dt,e),ft!==null&&xn(ft,e),Un.forEach(t),Vn.forEach(t),n=0;n<ot.length;n++)r=ot[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<ot.length&&(n=ot[0],n.blockedOn===null);)Ua(n),n.blockedOn===null&&ot.shift()}var en=tt.ReactCurrentBatchConfig,Ar=!0;function dd(e,t,n,r){var l=O,i=en.transition;en.transition=null;try{O=1,to(e,t,n,r)}finally{O=l,en.transition=i}}function fd(e,t,n,r){var l=O,i=en.transition;en.transition=null;try{O=4,to(e,t,n,r)}finally{O=l,en.transition=i}}function to(e,t,n,r){if(Ar){var l=pi(e,t,n,r);if(l===null)Dl(e,t,r,Ur,n),qo(e,r);else if(ud(l,e,t,n,r))r.stopPropagation();else if(qo(e,r),t&4&&-1<ad.indexOf(e)){for(;l!==null;){var i=rr(l);if(i!==null&&Da(i),i=pi(e,t,n,r),i===null&&Dl(e,t,r,Ur,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else Dl(e,t,r,null,n)}}var Ur=null;function pi(e,t,n,r){if(Ur=null,e=Ji(r),e=Ct(e),e!==null)if(t=Dt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=za(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ur=e,null}function Va(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(bc()){case qi:return 1;case Ia:return 4;case $r:case ed:return 16;case Ra:return 536870912;default:return 16}default:return 16}}var at=null,no=null,Cr=null;function Ba(){if(Cr)return Cr;var e,t=no,n=t.length,r,l="value"in at?at.value:at.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[i-r];r++);return Cr=l.slice(e,1<r?1-r:void 0)}function Er(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function fr(){return!0}function es(){return!1}function Ee(e){function t(n,r,l,i,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=o,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(n=e[a],this[a]=n?n(i):i[a]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?fr:es,this.isPropagationStopped=es,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=fr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=fr)},persist:function(){},isPersistent:fr}),t}var fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ro=Ee(fn),nr=K({},fn,{view:0,detail:0}),pd=Ee(nr),_l,zl,wn,ol=K({},nr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==wn&&(wn&&e.type==="mousemove"?(_l=e.screenX-wn.screenX,zl=e.screenY-wn.screenY):zl=_l=0,wn=e),_l)},movementY:function(e){return"movementY"in e?e.movementY:zl}}),ts=Ee(ol),md=K({},ol,{dataTransfer:0}),hd=Ee(md),gd=K({},nr,{relatedTarget:0}),Tl=Ee(gd),vd=K({},fn,{animationName:0,elapsedTime:0,pseudoElement:0}),yd=Ee(vd),xd=K({},fn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),wd=Ee(xd),kd=K({},fn,{data:0}),ns=Ee(kd),Sd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Nd={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cd(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Nd[e])?!!t[e]:!1}function lo(){return Cd}var Ed=K({},nr,{key:function(e){if(e.key){var t=Sd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Er(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?jd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lo,charCode:function(e){return e.type==="keypress"?Er(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Er(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),_d=Ee(Ed),zd=K({},ol,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),rs=Ee(zd),Td=K({},nr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lo}),Pd=Ee(Td),Ld=K({},fn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Id=Ee(Ld),Rd=K({},ol,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Md=Ee(Rd),Od=[9,13,27,32],io=Je&&"CompositionEvent"in window,Pn=null;Je&&"documentMode"in document&&(Pn=document.documentMode);var Dd=Je&&"TextEvent"in window&&!Pn,Ha=Je&&(!io||Pn&&8<Pn&&11>=Pn),ls=" ",is=!1;function Wa(e,t){switch(e){case"keyup":return Od.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Qa(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Vt=!1;function $d(e,t){switch(e){case"compositionend":return Qa(t);case"keypress":return t.which!==32?null:(is=!0,ls);case"textInput":return e=t.data,e===ls&&is?null:e;default:return null}}function Fd(e,t){if(Vt)return e==="compositionend"||!io&&Wa(e,t)?(e=Ba(),Cr=no=at=null,Vt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ha&&t.locale!=="ko"?null:t.data;default:return null}}var Ad={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function os(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ad[e.type]:t==="textarea"}function Ka(e,t,n,r){ja(r),t=Vr(t,"onChange"),0<t.length&&(n=new ro("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Ln=null,Hn=null;function Ud(e){ru(e,0)}function sl(e){var t=Wt(e);if(ga(t))return e}function Vd(e,t){if(e==="change")return t}var Ya=!1;if(Je){var Pl;if(Je){var Ll="oninput"in document;if(!Ll){var ss=document.createElement("div");ss.setAttribute("oninput","return;"),Ll=typeof ss.oninput=="function"}Pl=Ll}else Pl=!1;Ya=Pl&&(!document.documentMode||9<document.documentMode)}function as(){Ln&&(Ln.detachEvent("onpropertychange",Ga),Hn=Ln=null)}function Ga(e){if(e.propertyName==="value"&&sl(Hn)){var t=[];Ka(t,Hn,e,Ji(e)),_a(Ud,t)}}function Bd(e,t,n){e==="focusin"?(as(),Ln=t,Hn=n,Ln.attachEvent("onpropertychange",Ga)):e==="focusout"&&as()}function Hd(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return sl(Hn)}function Wd(e,t){if(e==="click")return sl(t)}function Qd(e,t){if(e==="input"||e==="change")return sl(t)}function Kd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ae=typeof Object.is=="function"?Object.is:Kd;function Wn(e,t){if(Ae(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Xl.call(t,l)||!Ae(e[l],t[l]))return!1}return!0}function us(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function cs(e,t){var n=us(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=us(n)}}function Xa(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Xa(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Za(){for(var e=window,t=Mr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Mr(e.document)}return t}function oo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Yd(e){var t=Za(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Xa(n.ownerDocument.documentElement,n)){if(r!==null&&oo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=cs(n,i);var o=cs(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Gd=Je&&"documentMode"in document&&11>=document.documentMode,Bt=null,mi=null,In=null,hi=!1;function ds(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;hi||Bt==null||Bt!==Mr(r)||(r=Bt,"selectionStart"in r&&oo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),In&&Wn(In,r)||(In=r,r=Vr(mi,"onSelect"),0<r.length&&(t=new ro("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Bt)))}function pr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ht={animationend:pr("Animation","AnimationEnd"),animationiteration:pr("Animation","AnimationIteration"),animationstart:pr("Animation","AnimationStart"),transitionend:pr("Transition","TransitionEnd")},Il={},Ja={};Je&&(Ja=document.createElement("div").style,"AnimationEvent"in window||(delete Ht.animationend.animation,delete Ht.animationiteration.animation,delete Ht.animationstart.animation),"TransitionEvent"in window||delete Ht.transitionend.transition);function al(e){if(Il[e])return Il[e];if(!Ht[e])return e;var t=Ht[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ja)return Il[e]=t[n];return e}var qa=al("animationend"),ba=al("animationiteration"),eu=al("animationstart"),tu=al("transitionend"),nu=new Map,fs="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function wt(e,t){nu.set(e,t),Ot(t,[e])}for(var Rl=0;Rl<fs.length;Rl++){var Ml=fs[Rl],Xd=Ml.toLowerCase(),Zd=Ml[0].toUpperCase()+Ml.slice(1);wt(Xd,"on"+Zd)}wt(qa,"onAnimationEnd");wt(ba,"onAnimationIteration");wt(eu,"onAnimationStart");wt("dblclick","onDoubleClick");wt("focusin","onFocus");wt("focusout","onBlur");wt(tu,"onTransitionEnd");rn("onMouseEnter",["mouseout","mouseover"]);rn("onMouseLeave",["mouseout","mouseover"]);rn("onPointerEnter",["pointerout","pointerover"]);rn("onPointerLeave",["pointerout","pointerover"]);Ot("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ot("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ot("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ot("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ot("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ot("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _n="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Jd=new Set("cancel close invalid load scroll toggle".split(" ").concat(_n));function ps(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Xc(r,t,void 0,e),e.currentTarget=null}function ru(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var o=r.length-1;0<=o;o--){var a=r[o],u=a.instance,d=a.currentTarget;if(a=a.listener,u!==i&&l.isPropagationStopped())break e;ps(l,a,d),i=u}else for(o=0;o<r.length;o++){if(a=r[o],u=a.instance,d=a.currentTarget,a=a.listener,u!==i&&l.isPropagationStopped())break e;ps(l,a,d),i=u}}}if(Dr)throw e=ci,Dr=!1,ci=null,e}function A(e,t){var n=t[wi];n===void 0&&(n=t[wi]=new Set);var r=e+"__bubble";n.has(r)||(lu(t,e,2,!1),n.add(r))}function Ol(e,t,n){var r=0;t&&(r|=4),lu(n,e,r,t)}var mr="_reactListening"+Math.random().toString(36).slice(2);function Qn(e){if(!e[mr]){e[mr]=!0,da.forEach(function(n){n!=="selectionchange"&&(Jd.has(n)||Ol(n,!1,e),Ol(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[mr]||(t[mr]=!0,Ol("selectionchange",!1,t))}}function lu(e,t,n,r){switch(Va(t)){case 1:var l=dd;break;case 4:l=fd;break;default:l=to}n=l.bind(null,t,n,e),l=void 0,!ui||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Dl(e,t,n,r,l){var i=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var a=r.stateNode.containerInfo;if(a===l||a.nodeType===8&&a.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===l||u.nodeType===8&&u.parentNode===l))return;o=o.return}for(;a!==null;){if(o=Ct(a),o===null)return;if(u=o.tag,u===5||u===6){r=i=o;continue e}a=a.parentNode}}r=r.return}_a(function(){var d=i,h=Ji(n),g=[];e:{var m=nu.get(e);if(m!==void 0){var w=ro,k=e;switch(e){case"keypress":if(Er(n)===0)break e;case"keydown":case"keyup":w=_d;break;case"focusin":k="focus",w=Tl;break;case"focusout":k="blur",w=Tl;break;case"beforeblur":case"afterblur":w=Tl;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=ts;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=hd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=Pd;break;case qa:case ba:case eu:w=yd;break;case tu:w=Id;break;case"scroll":w=pd;break;case"wheel":w=Md;break;case"copy":case"cut":case"paste":w=wd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=rs}var S=(t&4)!==0,D=!S&&e==="scroll",p=S?m!==null?m+"Capture":null:m;S=[];for(var c=d,f;c!==null;){f=c;var v=f.stateNode;if(f.tag===5&&v!==null&&(f=v,p!==null&&(v=An(c,p),v!=null&&S.push(Kn(c,v,f)))),D)break;c=c.return}0<S.length&&(m=new w(m,k,null,n,h),g.push({event:m,listeners:S}))}}if(!(t&7)){e:{if(m=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",m&&n!==si&&(k=n.relatedTarget||n.fromElement)&&(Ct(k)||k[qe]))break e;if((w||m)&&(m=h.window===h?h:(m=h.ownerDocument)?m.defaultView||m.parentWindow:window,w?(k=n.relatedTarget||n.toElement,w=d,k=k?Ct(k):null,k!==null&&(D=Dt(k),k!==D||k.tag!==5&&k.tag!==6)&&(k=null)):(w=null,k=d),w!==k)){if(S=ts,v="onMouseLeave",p="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(S=rs,v="onPointerLeave",p="onPointerEnter",c="pointer"),D=w==null?m:Wt(w),f=k==null?m:Wt(k),m=new S(v,c+"leave",w,n,h),m.target=D,m.relatedTarget=f,v=null,Ct(h)===d&&(S=new S(p,c+"enter",k,n,h),S.target=f,S.relatedTarget=D,v=S),D=v,w&&k)t:{for(S=w,p=k,c=0,f=S;f;f=Ft(f))c++;for(f=0,v=p;v;v=Ft(v))f++;for(;0<c-f;)S=Ft(S),c--;for(;0<f-c;)p=Ft(p),f--;for(;c--;){if(S===p||p!==null&&S===p.alternate)break t;S=Ft(S),p=Ft(p)}S=null}else S=null;w!==null&&ms(g,m,w,S,!1),k!==null&&D!==null&&ms(g,D,k,S,!0)}}e:{if(m=d?Wt(d):window,w=m.nodeName&&m.nodeName.toLowerCase(),w==="select"||w==="input"&&m.type==="file")var j=Vd;else if(os(m))if(Ya)j=Qd;else{j=Hd;var E=Bd}else(w=m.nodeName)&&w.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(j=Wd);if(j&&(j=j(e,d))){Ka(g,j,n,h);break e}E&&E(e,m,d),e==="focusout"&&(E=m._wrapperState)&&E.controlled&&m.type==="number"&&ni(m,"number",m.value)}switch(E=d?Wt(d):window,e){case"focusin":(os(E)||E.contentEditable==="true")&&(Bt=E,mi=d,In=null);break;case"focusout":In=mi=Bt=null;break;case"mousedown":hi=!0;break;case"contextmenu":case"mouseup":case"dragend":hi=!1,ds(g,n,h);break;case"selectionchange":if(Gd)break;case"keydown":case"keyup":ds(g,n,h)}var _;if(io)e:{switch(e){case"compositionstart":var z="onCompositionStart";break e;case"compositionend":z="onCompositionEnd";break e;case"compositionupdate":z="onCompositionUpdate";break e}z=void 0}else Vt?Wa(e,n)&&(z="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(z="onCompositionStart");z&&(Ha&&n.locale!=="ko"&&(Vt||z!=="onCompositionStart"?z==="onCompositionEnd"&&Vt&&(_=Ba()):(at=h,no="value"in at?at.value:at.textContent,Vt=!0)),E=Vr(d,z),0<E.length&&(z=new ns(z,e,null,n,h),g.push({event:z,listeners:E}),_?z.data=_:(_=Qa(n),_!==null&&(z.data=_)))),(_=Dd?$d(e,n):Fd(e,n))&&(d=Vr(d,"onBeforeInput"),0<d.length&&(h=new ns("onBeforeInput","beforeinput",null,n,h),g.push({event:h,listeners:d}),h.data=_))}ru(g,t)})}function Kn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Vr(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=An(e,n),i!=null&&r.unshift(Kn(e,i,l)),i=An(e,t),i!=null&&r.push(Kn(e,i,l))),e=e.return}return r}function Ft(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ms(e,t,n,r,l){for(var i=t._reactName,o=[];n!==null&&n!==r;){var a=n,u=a.alternate,d=a.stateNode;if(u!==null&&u===r)break;a.tag===5&&d!==null&&(a=d,l?(u=An(n,i),u!=null&&o.unshift(Kn(n,u,a))):l||(u=An(n,i),u!=null&&o.push(Kn(n,u,a)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var qd=/\r\n?/g,bd=/\u0000|\uFFFD/g;function hs(e){return(typeof e=="string"?e:""+e).replace(qd,`
`).replace(bd,"")}function hr(e,t,n){if(t=hs(t),hs(e)!==t&&n)throw Error(y(425))}function Br(){}var gi=null,vi=null;function yi(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var xi=typeof setTimeout=="function"?setTimeout:void 0,ef=typeof clearTimeout=="function"?clearTimeout:void 0,gs=typeof Promise=="function"?Promise:void 0,tf=typeof queueMicrotask=="function"?queueMicrotask:typeof gs<"u"?function(e){return gs.resolve(null).then(e).catch(nf)}:xi;function nf(e){setTimeout(function(){throw e})}function $l(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Bn(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Bn(t)}function pt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function vs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var pn=Math.random().toString(36).slice(2),Be="__reactFiber$"+pn,Yn="__reactProps$"+pn,qe="__reactContainer$"+pn,wi="__reactEvents$"+pn,rf="__reactListeners$"+pn,lf="__reactHandles$"+pn;function Ct(e){var t=e[Be];if(t)return t;for(var n=e.parentNode;n;){if(t=n[qe]||n[Be]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=vs(e);e!==null;){if(n=e[Be])return n;e=vs(e)}return t}e=n,n=e.parentNode}return null}function rr(e){return e=e[Be]||e[qe],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Wt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(y(33))}function ul(e){return e[Yn]||null}var ki=[],Qt=-1;function kt(e){return{current:e}}function U(e){0>Qt||(e.current=ki[Qt],ki[Qt]=null,Qt--)}function F(e,t){Qt++,ki[Qt]=e.current,e.current=t}var xt={},ce=kt(xt),ve=kt(!1),Pt=xt;function ln(e,t){var n=e.type.contextTypes;if(!n)return xt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ye(e){return e=e.childContextTypes,e!=null}function Hr(){U(ve),U(ce)}function ys(e,t,n){if(ce.current!==xt)throw Error(y(168));F(ce,t),F(ve,n)}function iu(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(y(108,Bc(e)||"Unknown",l));return K({},n,r)}function Wr(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||xt,Pt=ce.current,F(ce,e),F(ve,ve.current),!0}function xs(e,t,n){var r=e.stateNode;if(!r)throw Error(y(169));n?(e=iu(e,t,Pt),r.__reactInternalMemoizedMergedChildContext=e,U(ve),U(ce),F(ce,e)):U(ve),F(ve,n)}var Ye=null,cl=!1,Fl=!1;function ou(e){Ye===null?Ye=[e]:Ye.push(e)}function of(e){cl=!0,ou(e)}function St(){if(!Fl&&Ye!==null){Fl=!0;var e=0,t=O;try{var n=Ye;for(O=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Ye=null,cl=!1}catch(l){throw Ye!==null&&(Ye=Ye.slice(e+1)),La(qi,St),l}finally{O=t,Fl=!1}}return null}var Kt=[],Yt=0,Qr=null,Kr=0,_e=[],ze=0,Lt=null,Ge=1,Xe="";function jt(e,t){Kt[Yt++]=Kr,Kt[Yt++]=Qr,Qr=e,Kr=t}function su(e,t,n){_e[ze++]=Ge,_e[ze++]=Xe,_e[ze++]=Lt,Lt=e;var r=Ge;e=Xe;var l=32-$e(r)-1;r&=~(1<<l),n+=1;var i=32-$e(t)+l;if(30<i){var o=l-l%5;i=(r&(1<<o)-1).toString(32),r>>=o,l-=o,Ge=1<<32-$e(t)+l|n<<l|r,Xe=i+e}else Ge=1<<i|n<<l|r,Xe=e}function so(e){e.return!==null&&(jt(e,1),su(e,1,0))}function ao(e){for(;e===Qr;)Qr=Kt[--Yt],Kt[Yt]=null,Kr=Kt[--Yt],Kt[Yt]=null;for(;e===Lt;)Lt=_e[--ze],_e[ze]=null,Xe=_e[--ze],_e[ze]=null,Ge=_e[--ze],_e[ze]=null}var je=null,Se=null,V=!1,De=null;function au(e,t){var n=Te(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ws(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,je=e,Se=pt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,je=e,Se=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Lt!==null?{id:Ge,overflow:Xe}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Te(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,je=e,Se=null,!0):!1;default:return!1}}function Si(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ji(e){if(V){var t=Se;if(t){var n=t;if(!ws(e,t)){if(Si(e))throw Error(y(418));t=pt(n.nextSibling);var r=je;t&&ws(e,t)?au(r,n):(e.flags=e.flags&-4097|2,V=!1,je=e)}}else{if(Si(e))throw Error(y(418));e.flags=e.flags&-4097|2,V=!1,je=e}}}function ks(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;je=e}function gr(e){if(e!==je)return!1;if(!V)return ks(e),V=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!yi(e.type,e.memoizedProps)),t&&(t=Se)){if(Si(e))throw uu(),Error(y(418));for(;t;)au(e,t),t=pt(t.nextSibling)}if(ks(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(y(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Se=pt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Se=null}}else Se=je?pt(e.stateNode.nextSibling):null;return!0}function uu(){for(var e=Se;e;)e=pt(e.nextSibling)}function on(){Se=je=null,V=!1}function uo(e){De===null?De=[e]:De.push(e)}var sf=tt.ReactCurrentBatchConfig;function kn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(y(309));var r=n.stateNode}if(!r)throw Error(y(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(o){var a=l.refs;o===null?delete a[i]:a[i]=o},t._stringRef=i,t)}if(typeof e!="string")throw Error(y(284));if(!n._owner)throw Error(y(290,e))}return e}function vr(e,t){throw e=Object.prototype.toString.call(t),Error(y(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ss(e){var t=e._init;return t(e._payload)}function cu(e){function t(p,c){if(e){var f=p.deletions;f===null?(p.deletions=[c],p.flags|=16):f.push(c)}}function n(p,c){if(!e)return null;for(;c!==null;)t(p,c),c=c.sibling;return null}function r(p,c){for(p=new Map;c!==null;)c.key!==null?p.set(c.key,c):p.set(c.index,c),c=c.sibling;return p}function l(p,c){return p=vt(p,c),p.index=0,p.sibling=null,p}function i(p,c,f){return p.index=f,e?(f=p.alternate,f!==null?(f=f.index,f<c?(p.flags|=2,c):f):(p.flags|=2,c)):(p.flags|=1048576,c)}function o(p){return e&&p.alternate===null&&(p.flags|=2),p}function a(p,c,f,v){return c===null||c.tag!==6?(c=Ql(f,p.mode,v),c.return=p,c):(c=l(c,f),c.return=p,c)}function u(p,c,f,v){var j=f.type;return j===Ut?h(p,c,f.props.children,v,f.key):c!==null&&(c.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===lt&&Ss(j)===c.type)?(v=l(c,f.props),v.ref=kn(p,c,f),v.return=p,v):(v=Rr(f.type,f.key,f.props,null,p.mode,v),v.ref=kn(p,c,f),v.return=p,v)}function d(p,c,f,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==f.containerInfo||c.stateNode.implementation!==f.implementation?(c=Kl(f,p.mode,v),c.return=p,c):(c=l(c,f.children||[]),c.return=p,c)}function h(p,c,f,v,j){return c===null||c.tag!==7?(c=Tt(f,p.mode,v,j),c.return=p,c):(c=l(c,f),c.return=p,c)}function g(p,c,f){if(typeof c=="string"&&c!==""||typeof c=="number")return c=Ql(""+c,p.mode,f),c.return=p,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case or:return f=Rr(c.type,c.key,c.props,null,p.mode,f),f.ref=kn(p,null,c),f.return=p,f;case At:return c=Kl(c,p.mode,f),c.return=p,c;case lt:var v=c._init;return g(p,v(c._payload),f)}if(Cn(c)||gn(c))return c=Tt(c,p.mode,f,null),c.return=p,c;vr(p,c)}return null}function m(p,c,f,v){var j=c!==null?c.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return j!==null?null:a(p,c,""+f,v);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case or:return f.key===j?u(p,c,f,v):null;case At:return f.key===j?d(p,c,f,v):null;case lt:return j=f._init,m(p,c,j(f._payload),v)}if(Cn(f)||gn(f))return j!==null?null:h(p,c,f,v,null);vr(p,f)}return null}function w(p,c,f,v,j){if(typeof v=="string"&&v!==""||typeof v=="number")return p=p.get(f)||null,a(c,p,""+v,j);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case or:return p=p.get(v.key===null?f:v.key)||null,u(c,p,v,j);case At:return p=p.get(v.key===null?f:v.key)||null,d(c,p,v,j);case lt:var E=v._init;return w(p,c,f,E(v._payload),j)}if(Cn(v)||gn(v))return p=p.get(f)||null,h(c,p,v,j,null);vr(c,v)}return null}function k(p,c,f,v){for(var j=null,E=null,_=c,z=c=0,B=null;_!==null&&z<f.length;z++){_.index>z?(B=_,_=null):B=_.sibling;var L=m(p,_,f[z],v);if(L===null){_===null&&(_=B);break}e&&_&&L.alternate===null&&t(p,_),c=i(L,c,z),E===null?j=L:E.sibling=L,E=L,_=B}if(z===f.length)return n(p,_),V&&jt(p,z),j;if(_===null){for(;z<f.length;z++)_=g(p,f[z],v),_!==null&&(c=i(_,c,z),E===null?j=_:E.sibling=_,E=_);return V&&jt(p,z),j}for(_=r(p,_);z<f.length;z++)B=w(_,p,z,f[z],v),B!==null&&(e&&B.alternate!==null&&_.delete(B.key===null?z:B.key),c=i(B,c,z),E===null?j=B:E.sibling=B,E=B);return e&&_.forEach(function(ne){return t(p,ne)}),V&&jt(p,z),j}function S(p,c,f,v){var j=gn(f);if(typeof j!="function")throw Error(y(150));if(f=j.call(f),f==null)throw Error(y(151));for(var E=j=null,_=c,z=c=0,B=null,L=f.next();_!==null&&!L.done;z++,L=f.next()){_.index>z?(B=_,_=null):B=_.sibling;var ne=m(p,_,L.value,v);if(ne===null){_===null&&(_=B);break}e&&_&&ne.alternate===null&&t(p,_),c=i(ne,c,z),E===null?j=ne:E.sibling=ne,E=ne,_=B}if(L.done)return n(p,_),V&&jt(p,z),j;if(_===null){for(;!L.done;z++,L=f.next())L=g(p,L.value,v),L!==null&&(c=i(L,c,z),E===null?j=L:E.sibling=L,E=L);return V&&jt(p,z),j}for(_=r(p,_);!L.done;z++,L=f.next())L=w(_,p,z,L.value,v),L!==null&&(e&&L.alternate!==null&&_.delete(L.key===null?z:L.key),c=i(L,c,z),E===null?j=L:E.sibling=L,E=L);return e&&_.forEach(function(Qe){return t(p,Qe)}),V&&jt(p,z),j}function D(p,c,f,v){if(typeof f=="object"&&f!==null&&f.type===Ut&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case or:e:{for(var j=f.key,E=c;E!==null;){if(E.key===j){if(j=f.type,j===Ut){if(E.tag===7){n(p,E.sibling),c=l(E,f.props.children),c.return=p,p=c;break e}}else if(E.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===lt&&Ss(j)===E.type){n(p,E.sibling),c=l(E,f.props),c.ref=kn(p,E,f),c.return=p,p=c;break e}n(p,E);break}else t(p,E);E=E.sibling}f.type===Ut?(c=Tt(f.props.children,p.mode,v,f.key),c.return=p,p=c):(v=Rr(f.type,f.key,f.props,null,p.mode,v),v.ref=kn(p,c,f),v.return=p,p=v)}return o(p);case At:e:{for(E=f.key;c!==null;){if(c.key===E)if(c.tag===4&&c.stateNode.containerInfo===f.containerInfo&&c.stateNode.implementation===f.implementation){n(p,c.sibling),c=l(c,f.children||[]),c.return=p,p=c;break e}else{n(p,c);break}else t(p,c);c=c.sibling}c=Kl(f,p.mode,v),c.return=p,p=c}return o(p);case lt:return E=f._init,D(p,c,E(f._payload),v)}if(Cn(f))return k(p,c,f,v);if(gn(f))return S(p,c,f,v);vr(p,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,c!==null&&c.tag===6?(n(p,c.sibling),c=l(c,f),c.return=p,p=c):(n(p,c),c=Ql(f,p.mode,v),c.return=p,p=c),o(p)):n(p,c)}return D}var sn=cu(!0),du=cu(!1),Yr=kt(null),Gr=null,Gt=null,co=null;function fo(){co=Gt=Gr=null}function po(e){var t=Yr.current;U(Yr),e._currentValue=t}function Ni(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function tn(e,t){Gr=e,co=Gt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(ge=!0),e.firstContext=null)}function Le(e){var t=e._currentValue;if(co!==e)if(e={context:e,memoizedValue:t,next:null},Gt===null){if(Gr===null)throw Error(y(308));Gt=e,Gr.dependencies={lanes:0,firstContext:e}}else Gt=Gt.next=e;return t}var Et=null;function mo(e){Et===null?Et=[e]:Et.push(e)}function fu(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,mo(t)):(n.next=l.next,l.next=n),t.interleaved=n,be(e,r)}function be(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var it=!1;function ho(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function pu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Ze(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function mt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,R&2){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,be(e,n)}return l=r.interleaved,l===null?(t.next=t,mo(r)):(t.next=l.next,l.next=t),r.interleaved=t,be(e,n)}function _r(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,bi(e,n)}}function js(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=o:i=i.next=o,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Xr(e,t,n,r){var l=e.updateQueue;it=!1;var i=l.firstBaseUpdate,o=l.lastBaseUpdate,a=l.shared.pending;if(a!==null){l.shared.pending=null;var u=a,d=u.next;u.next=null,o===null?i=d:o.next=d,o=u;var h=e.alternate;h!==null&&(h=h.updateQueue,a=h.lastBaseUpdate,a!==o&&(a===null?h.firstBaseUpdate=d:a.next=d,h.lastBaseUpdate=u))}if(i!==null){var g=l.baseState;o=0,h=d=u=null,a=i;do{var m=a.lane,w=a.eventTime;if((r&m)===m){h!==null&&(h=h.next={eventTime:w,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var k=e,S=a;switch(m=t,w=n,S.tag){case 1:if(k=S.payload,typeof k=="function"){g=k.call(w,g,m);break e}g=k;break e;case 3:k.flags=k.flags&-65537|128;case 0:if(k=S.payload,m=typeof k=="function"?k.call(w,g,m):k,m==null)break e;g=K({},g,m);break e;case 2:it=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,m=l.effects,m===null?l.effects=[a]:m.push(a))}else w={eventTime:w,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},h===null?(d=h=w,u=g):h=h.next=w,o|=m;if(a=a.next,a===null){if(a=l.shared.pending,a===null)break;m=a,a=m.next,m.next=null,l.lastBaseUpdate=m,l.shared.pending=null}}while(!0);if(h===null&&(u=g),l.baseState=u,l.firstBaseUpdate=d,l.lastBaseUpdate=h,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);Rt|=o,e.lanes=o,e.memoizedState=g}}function Ns(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(y(191,l));l.call(r)}}}var lr={},We=kt(lr),Gn=kt(lr),Xn=kt(lr);function _t(e){if(e===lr)throw Error(y(174));return e}function go(e,t){switch(F(Xn,t),F(Gn,e),F(We,lr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:li(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=li(t,e)}U(We),F(We,t)}function an(){U(We),U(Gn),U(Xn)}function mu(e){_t(Xn.current);var t=_t(We.current),n=li(t,e.type);t!==n&&(F(Gn,e),F(We,n))}function vo(e){Gn.current===e&&(U(We),U(Gn))}var W=kt(0);function Zr(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Al=[];function yo(){for(var e=0;e<Al.length;e++)Al[e]._workInProgressVersionPrimary=null;Al.length=0}var zr=tt.ReactCurrentDispatcher,Ul=tt.ReactCurrentBatchConfig,It=0,Q=null,q=null,ee=null,Jr=!1,Rn=!1,Zn=0,af=0;function se(){throw Error(y(321))}function xo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ae(e[n],t[n]))return!1;return!0}function wo(e,t,n,r,l,i){if(It=i,Q=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,zr.current=e===null||e.memoizedState===null?ff:pf,e=n(r,l),Rn){i=0;do{if(Rn=!1,Zn=0,25<=i)throw Error(y(301));i+=1,ee=q=null,t.updateQueue=null,zr.current=mf,e=n(r,l)}while(Rn)}if(zr.current=qr,t=q!==null&&q.next!==null,It=0,ee=q=Q=null,Jr=!1,t)throw Error(y(300));return e}function ko(){var e=Zn!==0;return Zn=0,e}function Ve(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ee===null?Q.memoizedState=ee=e:ee=ee.next=e,ee}function Ie(){if(q===null){var e=Q.alternate;e=e!==null?e.memoizedState:null}else e=q.next;var t=ee===null?Q.memoizedState:ee.next;if(t!==null)ee=t,q=e;else{if(e===null)throw Error(y(310));q=e,e={memoizedState:q.memoizedState,baseState:q.baseState,baseQueue:q.baseQueue,queue:q.queue,next:null},ee===null?Q.memoizedState=ee=e:ee=ee.next=e}return ee}function Jn(e,t){return typeof t=="function"?t(e):t}function Vl(e){var t=Ie(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var r=q,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var o=l.next;l.next=i.next,i.next=o}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var a=o=null,u=null,d=i;do{var h=d.lane;if((It&h)===h)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var g={lane:h,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(a=u=g,o=r):u=u.next=g,Q.lanes|=h,Rt|=h}d=d.next}while(d!==null&&d!==i);u===null?o=r:u.next=a,Ae(r,t.memoizedState)||(ge=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,Q.lanes|=i,Rt|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Bl(e){var t=Ie(),n=t.queue;if(n===null)throw Error(y(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do i=e(i,o.action),o=o.next;while(o!==l);Ae(i,t.memoizedState)||(ge=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function hu(){}function gu(e,t){var n=Q,r=Ie(),l=t(),i=!Ae(r.memoizedState,l);if(i&&(r.memoizedState=l,ge=!0),r=r.queue,So(xu.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||ee!==null&&ee.memoizedState.tag&1){if(n.flags|=2048,qn(9,yu.bind(null,n,r,l,t),void 0,null),te===null)throw Error(y(349));It&30||vu(n,t,l)}return l}function vu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Q.updateQueue,t===null?(t={lastEffect:null,stores:null},Q.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function yu(e,t,n,r){t.value=n,t.getSnapshot=r,wu(t)&&ku(e)}function xu(e,t,n){return n(function(){wu(t)&&ku(e)})}function wu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ae(e,n)}catch{return!0}}function ku(e){var t=be(e,1);t!==null&&Fe(t,e,1,-1)}function Cs(e){var t=Ve();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Jn,lastRenderedState:e},t.queue=e,e=e.dispatch=df.bind(null,Q,e),[t.memoizedState,e]}function qn(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Q.updateQueue,t===null?(t={lastEffect:null,stores:null},Q.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Su(){return Ie().memoizedState}function Tr(e,t,n,r){var l=Ve();Q.flags|=e,l.memoizedState=qn(1|t,n,void 0,r===void 0?null:r)}function dl(e,t,n,r){var l=Ie();r=r===void 0?null:r;var i=void 0;if(q!==null){var o=q.memoizedState;if(i=o.destroy,r!==null&&xo(r,o.deps)){l.memoizedState=qn(t,n,i,r);return}}Q.flags|=e,l.memoizedState=qn(1|t,n,i,r)}function Es(e,t){return Tr(8390656,8,e,t)}function So(e,t){return dl(2048,8,e,t)}function ju(e,t){return dl(4,2,e,t)}function Nu(e,t){return dl(4,4,e,t)}function Cu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Eu(e,t,n){return n=n!=null?n.concat([e]):null,dl(4,4,Cu.bind(null,t,e),n)}function jo(){}function _u(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&xo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function zu(e,t){var n=Ie();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&xo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Tu(e,t,n){return It&21?(Ae(n,t)||(n=Ma(),Q.lanes|=n,Rt|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,ge=!0),e.memoizedState=n)}function uf(e,t){var n=O;O=n!==0&&4>n?n:4,e(!0);var r=Ul.transition;Ul.transition={};try{e(!1),t()}finally{O=n,Ul.transition=r}}function Pu(){return Ie().memoizedState}function cf(e,t,n){var r=gt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Lu(e))Iu(t,n);else if(n=fu(e,t,n,r),n!==null){var l=fe();Fe(n,e,r,l),Ru(n,t,r)}}function df(e,t,n){var r=gt(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Lu(e))Iu(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var o=t.lastRenderedState,a=i(o,n);if(l.hasEagerState=!0,l.eagerState=a,Ae(a,o)){var u=t.interleaved;u===null?(l.next=l,mo(t)):(l.next=u.next,u.next=l),t.interleaved=l;return}}catch{}finally{}n=fu(e,t,l,r),n!==null&&(l=fe(),Fe(n,e,r,l),Ru(n,t,r))}}function Lu(e){var t=e.alternate;return e===Q||t!==null&&t===Q}function Iu(e,t){Rn=Jr=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Ru(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,bi(e,n)}}var qr={readContext:Le,useCallback:se,useContext:se,useEffect:se,useImperativeHandle:se,useInsertionEffect:se,useLayoutEffect:se,useMemo:se,useReducer:se,useRef:se,useState:se,useDebugValue:se,useDeferredValue:se,useTransition:se,useMutableSource:se,useSyncExternalStore:se,useId:se,unstable_isNewReconciler:!1},ff={readContext:Le,useCallback:function(e,t){return Ve().memoizedState=[e,t===void 0?null:t],e},useContext:Le,useEffect:Es,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Tr(4194308,4,Cu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Tr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Tr(4,2,e,t)},useMemo:function(e,t){var n=Ve();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ve();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=cf.bind(null,Q,e),[r.memoizedState,e]},useRef:function(e){var t=Ve();return e={current:e},t.memoizedState=e},useState:Cs,useDebugValue:jo,useDeferredValue:function(e){return Ve().memoizedState=e},useTransition:function(){var e=Cs(!1),t=e[0];return e=uf.bind(null,e[1]),Ve().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Q,l=Ve();if(V){if(n===void 0)throw Error(y(407));n=n()}else{if(n=t(),te===null)throw Error(y(349));It&30||vu(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,Es(xu.bind(null,r,i,e),[e]),r.flags|=2048,qn(9,yu.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Ve(),t=te.identifierPrefix;if(V){var n=Xe,r=Ge;n=(r&~(1<<32-$e(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Zn++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=af++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},pf={readContext:Le,useCallback:_u,useContext:Le,useEffect:So,useImperativeHandle:Eu,useInsertionEffect:ju,useLayoutEffect:Nu,useMemo:zu,useReducer:Vl,useRef:Su,useState:function(){return Vl(Jn)},useDebugValue:jo,useDeferredValue:function(e){var t=Ie();return Tu(t,q.memoizedState,e)},useTransition:function(){var e=Vl(Jn)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:hu,useSyncExternalStore:gu,useId:Pu,unstable_isNewReconciler:!1},mf={readContext:Le,useCallback:_u,useContext:Le,useEffect:So,useImperativeHandle:Eu,useInsertionEffect:ju,useLayoutEffect:Nu,useMemo:zu,useReducer:Bl,useRef:Su,useState:function(){return Bl(Jn)},useDebugValue:jo,useDeferredValue:function(e){var t=Ie();return q===null?t.memoizedState=e:Tu(t,q.memoizedState,e)},useTransition:function(){var e=Bl(Jn)[0],t=Ie().memoizedState;return[e,t]},useMutableSource:hu,useSyncExternalStore:gu,useId:Pu,unstable_isNewReconciler:!1};function Me(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ci(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var fl={isMounted:function(e){return(e=e._reactInternals)?Dt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=fe(),l=gt(e),i=Ze(r,l);i.payload=t,n!=null&&(i.callback=n),t=mt(e,i,l),t!==null&&(Fe(t,e,l,r),_r(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=fe(),l=gt(e),i=Ze(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=mt(e,i,l),t!==null&&(Fe(t,e,l,r),_r(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=fe(),r=gt(e),l=Ze(n,r);l.tag=2,t!=null&&(l.callback=t),t=mt(e,l,r),t!==null&&(Fe(t,e,r,n),_r(t,e,r))}};function _s(e,t,n,r,l,i,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,o):t.prototype&&t.prototype.isPureReactComponent?!Wn(n,r)||!Wn(l,i):!0}function Mu(e,t,n){var r=!1,l=xt,i=t.contextType;return typeof i=="object"&&i!==null?i=Le(i):(l=ye(t)?Pt:ce.current,r=t.contextTypes,i=(r=r!=null)?ln(e,l):xt),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=fl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function zs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&fl.enqueueReplaceState(t,t.state,null)}function Ei(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},ho(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=Le(i):(i=ye(t)?Pt:ce.current,l.context=ln(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(Ci(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&fl.enqueueReplaceState(l,l.state,null),Xr(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function un(e,t){try{var n="",r=t;do n+=Vc(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function Hl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function _i(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var hf=typeof WeakMap=="function"?WeakMap:Map;function Ou(e,t,n){n=Ze(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){el||(el=!0,$i=r),_i(e,t)},n}function Du(e,t,n){n=Ze(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){_i(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){_i(e,t),typeof r!="function"&&(ht===null?ht=new Set([this]):ht.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Ts(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new hf;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Tf.bind(null,e,t,n),t.then(e,e))}function Ps(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ls(e,t,n,r,l){return e.mode&1?(e.flags|=65536,e.lanes=l,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Ze(-1,1),t.tag=2,mt(n,t,1))),n.lanes|=1),e)}var gf=tt.ReactCurrentOwner,ge=!1;function de(e,t,n,r){t.child=e===null?du(t,null,n,r):sn(t,e.child,n,r)}function Is(e,t,n,r,l){n=n.render;var i=t.ref;return tn(t,l),r=wo(e,t,n,r,i,l),n=ko(),e!==null&&!ge?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,et(e,t,l)):(V&&n&&so(t),t.flags|=1,de(e,t,r,l),t.child)}function Rs(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!Lo(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,$u(e,t,i,r,l)):(e=Rr(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!(e.lanes&l)){var o=i.memoizedProps;if(n=n.compare,n=n!==null?n:Wn,n(o,r)&&e.ref===t.ref)return et(e,t,l)}return t.flags|=1,e=vt(i,r),e.ref=t.ref,e.return=t,t.child=e}function $u(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(Wn(i,r)&&e.ref===t.ref)if(ge=!1,t.pendingProps=r=i,(e.lanes&l)!==0)e.flags&131072&&(ge=!0);else return t.lanes=e.lanes,et(e,t,l)}return zi(e,t,n,r,l)}function Fu(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},F(Zt,ke),ke|=n;else{if(!(n&1073741824))return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,F(Zt,ke),ke|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,F(Zt,ke),ke|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,F(Zt,ke),ke|=r;return de(e,t,l,n),t.child}function Au(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function zi(e,t,n,r,l){var i=ye(n)?Pt:ce.current;return i=ln(t,i),tn(t,l),n=wo(e,t,n,r,i,l),r=ko(),e!==null&&!ge?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,et(e,t,l)):(V&&r&&so(t),t.flags|=1,de(e,t,n,l),t.child)}function Ms(e,t,n,r,l){if(ye(n)){var i=!0;Wr(t)}else i=!1;if(tn(t,l),t.stateNode===null)Pr(e,t),Mu(t,n,r),Ei(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,a=t.memoizedProps;o.props=a;var u=o.context,d=n.contextType;typeof d=="object"&&d!==null?d=Le(d):(d=ye(n)?Pt:ce.current,d=ln(t,d));var h=n.getDerivedStateFromProps,g=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function";g||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==r||u!==d)&&zs(t,o,r,d),it=!1;var m=t.memoizedState;o.state=m,Xr(t,r,o,l),u=t.memoizedState,a!==r||m!==u||ve.current||it?(typeof h=="function"&&(Ci(t,n,h,r),u=t.memoizedState),(a=it||_s(t,n,a,r,m,u,d))?(g||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),o.props=r,o.state=u,o.context=d,r=a):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,pu(e,t),a=t.memoizedProps,d=t.type===t.elementType?a:Me(t.type,a),o.props=d,g=t.pendingProps,m=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Le(u):(u=ye(n)?Pt:ce.current,u=ln(t,u));var w=n.getDerivedStateFromProps;(h=typeof w=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==g||m!==u)&&zs(t,o,r,u),it=!1,m=t.memoizedState,o.state=m,Xr(t,r,o,l);var k=t.memoizedState;a!==g||m!==k||ve.current||it?(typeof w=="function"&&(Ci(t,n,w,r),k=t.memoizedState),(d=it||_s(t,n,d,r,m,k,u)||!1)?(h||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,k,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,k,u)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=k),o.props=r,o.state=k,o.context=u,r=d):(typeof o.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),r=!1)}return Ti(e,t,n,r,i,l)}function Ti(e,t,n,r,l,i){Au(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&xs(t,n,!1),et(e,t,i);r=t.stateNode,gf.current=t;var a=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=sn(t,e.child,null,i),t.child=sn(t,null,a,i)):de(e,t,a,i),t.memoizedState=r.state,l&&xs(t,n,!0),t.child}function Uu(e){var t=e.stateNode;t.pendingContext?ys(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ys(e,t.context,!1),go(e,t.containerInfo)}function Os(e,t,n,r,l){return on(),uo(l),t.flags|=256,de(e,t,n,r),t.child}var Pi={dehydrated:null,treeContext:null,retryLane:0};function Li(e){return{baseLanes:e,cachePool:null,transitions:null}}function Vu(e,t,n){var r=t.pendingProps,l=W.current,i=!1,o=(t.flags&128)!==0,a;if((a=o)||(a=e!==null&&e.memoizedState===null?!1:(l&2)!==0),a?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),F(W,l&1),e===null)return ji(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,i?(r=t.mode,i=t.child,o={mode:"hidden",children:o},!(r&1)&&i!==null?(i.childLanes=0,i.pendingProps=o):i=hl(o,r,0,null),e=Tt(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=Li(n),t.memoizedState=Pi,e):No(t,o));if(l=e.memoizedState,l!==null&&(a=l.dehydrated,a!==null))return vf(e,t,o,r,a,l,n);if(i){i=r.fallback,o=t.mode,l=e.child,a=l.sibling;var u={mode:"hidden",children:r.children};return!(o&1)&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=vt(l,u),r.subtreeFlags=l.subtreeFlags&14680064),a!==null?i=vt(a,i):(i=Tt(i,o,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,o=e.child.memoizedState,o=o===null?Li(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},i.memoizedState=o,i.childLanes=e.childLanes&~n,t.memoizedState=Pi,r}return i=e.child,e=i.sibling,r=vt(i,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function No(e,t){return t=hl({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function yr(e,t,n,r){return r!==null&&uo(r),sn(t,e.child,null,n),e=No(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function vf(e,t,n,r,l,i,o){if(n)return t.flags&256?(t.flags&=-257,r=Hl(Error(y(422))),yr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=hl({mode:"visible",children:r.children},l,0,null),i=Tt(i,l,o,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,t.mode&1&&sn(t,e.child,null,o),t.child.memoizedState=Li(o),t.memoizedState=Pi,i);if(!(t.mode&1))return yr(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var a=r.dgst;return r=a,i=Error(y(419)),r=Hl(i,r,void 0),yr(e,t,o,r)}if(a=(o&e.childLanes)!==0,ge||a){if(r=te,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=l&(r.suspendedLanes|o)?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,be(e,l),Fe(r,e,l,-1))}return Po(),r=Hl(Error(y(421))),yr(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Pf.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,Se=pt(l.nextSibling),je=t,V=!0,De=null,e!==null&&(_e[ze++]=Ge,_e[ze++]=Xe,_e[ze++]=Lt,Ge=e.id,Xe=e.overflow,Lt=t),t=No(t,r.children),t.flags|=4096,t)}function Ds(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ni(e.return,t,n)}function Wl(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Bu(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(de(e,t,r.children,n),r=W.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ds(e,n,t);else if(e.tag===19)Ds(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(F(W,r),!(t.mode&1))t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Zr(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Wl(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Zr(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Wl(t,!0,n,null,i);break;case"together":Wl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Pr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function et(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Rt|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(y(153));if(t.child!==null){for(e=t.child,n=vt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function yf(e,t,n){switch(t.tag){case 3:Uu(t),on();break;case 5:mu(t);break;case 1:ye(t.type)&&Wr(t);break;case 4:go(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;F(Yr,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(F(W,W.current&1),t.flags|=128,null):n&t.child.childLanes?Vu(e,t,n):(F(W,W.current&1),e=et(e,t,n),e!==null?e.sibling:null);F(W,W.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Bu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),F(W,W.current),r)break;return null;case 22:case 23:return t.lanes=0,Fu(e,t,n)}return et(e,t,n)}var Hu,Ii,Wu,Qu;Hu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Ii=function(){};Wu=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,_t(We.current);var i=null;switch(n){case"input":l=ei(e,l),r=ei(e,r),i=[];break;case"select":l=K({},l,{value:void 0}),r=K({},r,{value:void 0}),i=[];break;case"textarea":l=ri(e,l),r=ri(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Br)}ii(n,r);var o;n=null;for(d in l)if(!r.hasOwnProperty(d)&&l.hasOwnProperty(d)&&l[d]!=null)if(d==="style"){var a=l[d];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&($n.hasOwnProperty(d)?i||(i=[]):(i=i||[]).push(d,null));for(d in r){var u=r[d];if(a=l!=null?l[d]:void 0,r.hasOwnProperty(d)&&u!==a&&(u!=null||a!=null))if(d==="style")if(a){for(o in a)!a.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&a[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(i||(i=[]),i.push(d,n)),n=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,a=a?a.__html:void 0,u!=null&&a!==u&&(i=i||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(i=i||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&($n.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&A("scroll",e),i||a===u||(i=[])):(i=i||[]).push(d,u))}n&&(i=i||[]).push("style",n);var d=i;(t.updateQueue=d)&&(t.flags|=4)}};Qu=function(e,t,n,r){n!==r&&(t.flags|=4)};function Sn(e,t){if(!V)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function ae(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function xf(e,t,n){var r=t.pendingProps;switch(ao(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ae(t),null;case 1:return ye(t.type)&&Hr(),ae(t),null;case 3:return r=t.stateNode,an(),U(ve),U(ce),yo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(gr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,De!==null&&(Ui(De),De=null))),Ii(e,t),ae(t),null;case 5:vo(t);var l=_t(Xn.current);if(n=t.type,e!==null&&t.stateNode!=null)Wu(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(y(166));return ae(t),null}if(e=_t(We.current),gr(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[Be]=t,r[Yn]=i,e=(t.mode&1)!==0,n){case"dialog":A("cancel",r),A("close",r);break;case"iframe":case"object":case"embed":A("load",r);break;case"video":case"audio":for(l=0;l<_n.length;l++)A(_n[l],r);break;case"source":A("error",r);break;case"img":case"image":case"link":A("error",r),A("load",r);break;case"details":A("toggle",r);break;case"input":Qo(r,i),A("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},A("invalid",r);break;case"textarea":Yo(r,i),A("invalid",r)}ii(n,i),l=null;for(var o in i)if(i.hasOwnProperty(o)){var a=i[o];o==="children"?typeof a=="string"?r.textContent!==a&&(i.suppressHydrationWarning!==!0&&hr(r.textContent,a,e),l=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(i.suppressHydrationWarning!==!0&&hr(r.textContent,a,e),l=["children",""+a]):$n.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&A("scroll",r)}switch(n){case"input":sr(r),Ko(r,i,!0);break;case"textarea":sr(r),Go(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=Br)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=xa(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[Be]=t,e[Yn]=r,Hu(e,t,!1,!1),t.stateNode=e;e:{switch(o=oi(n,r),n){case"dialog":A("cancel",e),A("close",e),l=r;break;case"iframe":case"object":case"embed":A("load",e),l=r;break;case"video":case"audio":for(l=0;l<_n.length;l++)A(_n[l],e);l=r;break;case"source":A("error",e),l=r;break;case"img":case"image":case"link":A("error",e),A("load",e),l=r;break;case"details":A("toggle",e),l=r;break;case"input":Qo(e,r),l=ei(e,r),A("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=K({},r,{value:void 0}),A("invalid",e);break;case"textarea":Yo(e,r),l=ri(e,r),A("invalid",e);break;default:l=r}ii(n,l),a=l;for(i in a)if(a.hasOwnProperty(i)){var u=a[i];i==="style"?Sa(e,u):i==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&wa(e,u)):i==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&Fn(e,u):typeof u=="number"&&Fn(e,""+u):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&($n.hasOwnProperty(i)?u!=null&&i==="onScroll"&&A("scroll",e):u!=null&&Yi(e,i,u,o))}switch(n){case"input":sr(e),Ko(e,r,!1);break;case"textarea":sr(e),Go(e);break;case"option":r.value!=null&&e.setAttribute("value",""+yt(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?Jt(e,!!r.multiple,i,!1):r.defaultValue!=null&&Jt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Br)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ae(t),null;case 6:if(e&&t.stateNode!=null)Qu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(y(166));if(n=_t(Xn.current),_t(We.current),gr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Be]=t,(i=r.nodeValue!==n)&&(e=je,e!==null))switch(e.tag){case 3:hr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&hr(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Be]=t,t.stateNode=r}return ae(t),null;case 13:if(U(W),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(V&&Se!==null&&t.mode&1&&!(t.flags&128))uu(),on(),t.flags|=98560,i=!1;else if(i=gr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(y(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(y(317));i[Be]=t}else on(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ae(t),i=!1}else De!==null&&(Ui(De),De=null),i=!0;if(!i)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||W.current&1?b===0&&(b=3):Po())),t.updateQueue!==null&&(t.flags|=4),ae(t),null);case 4:return an(),Ii(e,t),e===null&&Qn(t.stateNode.containerInfo),ae(t),null;case 10:return po(t.type._context),ae(t),null;case 17:return ye(t.type)&&Hr(),ae(t),null;case 19:if(U(W),i=t.memoizedState,i===null)return ae(t),null;if(r=(t.flags&128)!==0,o=i.rendering,o===null)if(r)Sn(i,!1);else{if(b!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Zr(e),o!==null){for(t.flags|=128,Sn(i,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,o=i.alternate,o===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=o.childLanes,i.lanes=o.lanes,i.child=o.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=o.memoizedProps,i.memoizedState=o.memoizedState,i.updateQueue=o.updateQueue,i.type=o.type,e=o.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return F(W,W.current&1|2),t.child}e=e.sibling}i.tail!==null&&X()>cn&&(t.flags|=128,r=!0,Sn(i,!1),t.lanes=4194304)}else{if(!r)if(e=Zr(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Sn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!o.alternate&&!V)return ae(t),null}else 2*X()-i.renderingStartTime>cn&&n!==1073741824&&(t.flags|=128,r=!0,Sn(i,!1),t.lanes=4194304);i.isBackwards?(o.sibling=t.child,t.child=o):(n=i.last,n!==null?n.sibling=o:t.child=o,i.last=o)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=X(),t.sibling=null,n=W.current,F(W,r?n&1|2:n&1),t):(ae(t),null);case 22:case 23:return To(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ke&1073741824&&(ae(t),t.subtreeFlags&6&&(t.flags|=8192)):ae(t),null;case 24:return null;case 25:return null}throw Error(y(156,t.tag))}function wf(e,t){switch(ao(t),t.tag){case 1:return ye(t.type)&&Hr(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return an(),U(ve),U(ce),yo(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return vo(t),null;case 13:if(U(W),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(y(340));on()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return U(W),null;case 4:return an(),null;case 10:return po(t.type._context),null;case 22:case 23:return To(),null;case 24:return null;default:return null}}var xr=!1,ue=!1,kf=typeof WeakSet=="function"?WeakSet:Set,C=null;function Xt(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){G(e,t,r)}else n.current=null}function Ri(e,t,n){try{n()}catch(r){G(e,t,r)}}var $s=!1;function Sf(e,t){if(gi=Ar,e=Za(),oo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var o=0,a=-1,u=-1,d=0,h=0,g=e,m=null;t:for(;;){for(var w;g!==n||l!==0&&g.nodeType!==3||(a=o+l),g!==i||r!==0&&g.nodeType!==3||(u=o+r),g.nodeType===3&&(o+=g.nodeValue.length),(w=g.firstChild)!==null;)m=g,g=w;for(;;){if(g===e)break t;if(m===n&&++d===l&&(a=o),m===i&&++h===r&&(u=o),(w=g.nextSibling)!==null)break;g=m,m=g.parentNode}g=w}n=a===-1||u===-1?null:{start:a,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(vi={focusedElem:e,selectionRange:n},Ar=!1,C=t;C!==null;)if(t=C,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,C=e;else for(;C!==null;){t=C;try{var k=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(k!==null){var S=k.memoizedProps,D=k.memoizedState,p=t.stateNode,c=p.getSnapshotBeforeUpdate(t.elementType===t.type?S:Me(t.type,S),D);p.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var f=t.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(y(163))}}catch(v){G(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,C=e;break}C=t.return}return k=$s,$s=!1,k}function Mn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&Ri(t,n,i)}l=l.next}while(l!==r)}}function pl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Mi(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ku(e){var t=e.alternate;t!==null&&(e.alternate=null,Ku(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Be],delete t[Yn],delete t[wi],delete t[rf],delete t[lf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Yu(e){return e.tag===5||e.tag===3||e.tag===4}function Fs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Yu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Oi(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Br));else if(r!==4&&(e=e.child,e!==null))for(Oi(e,t,n),e=e.sibling;e!==null;)Oi(e,t,n),e=e.sibling}function Di(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Di(e,t,n),e=e.sibling;e!==null;)Di(e,t,n),e=e.sibling}var le=null,Oe=!1;function rt(e,t,n){for(n=n.child;n!==null;)Gu(e,t,n),n=n.sibling}function Gu(e,t,n){if(He&&typeof He.onCommitFiberUnmount=="function")try{He.onCommitFiberUnmount(il,n)}catch{}switch(n.tag){case 5:ue||Xt(n,t);case 6:var r=le,l=Oe;le=null,rt(e,t,n),le=r,Oe=l,le!==null&&(Oe?(e=le,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):le.removeChild(n.stateNode));break;case 18:le!==null&&(Oe?(e=le,n=n.stateNode,e.nodeType===8?$l(e.parentNode,n):e.nodeType===1&&$l(e,n),Bn(e)):$l(le,n.stateNode));break;case 4:r=le,l=Oe,le=n.stateNode.containerInfo,Oe=!0,rt(e,t,n),le=r,Oe=l;break;case 0:case 11:case 14:case 15:if(!ue&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,o=i.destroy;i=i.tag,o!==void 0&&(i&2||i&4)&&Ri(n,t,o),l=l.next}while(l!==r)}rt(e,t,n);break;case 1:if(!ue&&(Xt(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){G(n,t,a)}rt(e,t,n);break;case 21:rt(e,t,n);break;case 22:n.mode&1?(ue=(r=ue)||n.memoizedState!==null,rt(e,t,n),ue=r):rt(e,t,n);break;default:rt(e,t,n)}}function As(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new kf),t.forEach(function(r){var l=Lf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Re(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,o=t,a=o;e:for(;a!==null;){switch(a.tag){case 5:le=a.stateNode,Oe=!1;break e;case 3:le=a.stateNode.containerInfo,Oe=!0;break e;case 4:le=a.stateNode.containerInfo,Oe=!0;break e}a=a.return}if(le===null)throw Error(y(160));Gu(i,o,l),le=null,Oe=!1;var u=l.alternate;u!==null&&(u.return=null),l.return=null}catch(d){G(l,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Xu(t,e),t=t.sibling}function Xu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Re(t,e),Ue(e),r&4){try{Mn(3,e,e.return),pl(3,e)}catch(S){G(e,e.return,S)}try{Mn(5,e,e.return)}catch(S){G(e,e.return,S)}}break;case 1:Re(t,e),Ue(e),r&512&&n!==null&&Xt(n,n.return);break;case 5:if(Re(t,e),Ue(e),r&512&&n!==null&&Xt(n,n.return),e.flags&32){var l=e.stateNode;try{Fn(l,"")}catch(S){G(e,e.return,S)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,o=n!==null?n.memoizedProps:i,a=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{a==="input"&&i.type==="radio"&&i.name!=null&&va(l,i),oi(a,o);var d=oi(a,i);for(o=0;o<u.length;o+=2){var h=u[o],g=u[o+1];h==="style"?Sa(l,g):h==="dangerouslySetInnerHTML"?wa(l,g):h==="children"?Fn(l,g):Yi(l,h,g,d)}switch(a){case"input":ti(l,i);break;case"textarea":ya(l,i);break;case"select":var m=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var w=i.value;w!=null?Jt(l,!!i.multiple,w,!1):m!==!!i.multiple&&(i.defaultValue!=null?Jt(l,!!i.multiple,i.defaultValue,!0):Jt(l,!!i.multiple,i.multiple?[]:"",!1))}l[Yn]=i}catch(S){G(e,e.return,S)}}break;case 6:if(Re(t,e),Ue(e),r&4){if(e.stateNode===null)throw Error(y(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(S){G(e,e.return,S)}}break;case 3:if(Re(t,e),Ue(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Bn(t.containerInfo)}catch(S){G(e,e.return,S)}break;case 4:Re(t,e),Ue(e);break;case 13:Re(t,e),Ue(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(_o=X())),r&4&&As(e);break;case 22:if(h=n!==null&&n.memoizedState!==null,e.mode&1?(ue=(d=ue)||h,Re(t,e),ue=d):Re(t,e),Ue(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!h&&e.mode&1)for(C=e,h=e.child;h!==null;){for(g=C=h;C!==null;){switch(m=C,w=m.child,m.tag){case 0:case 11:case 14:case 15:Mn(4,m,m.return);break;case 1:Xt(m,m.return);var k=m.stateNode;if(typeof k.componentWillUnmount=="function"){r=m,n=m.return;try{t=r,k.props=t.memoizedProps,k.state=t.memoizedState,k.componentWillUnmount()}catch(S){G(r,n,S)}}break;case 5:Xt(m,m.return);break;case 22:if(m.memoizedState!==null){Vs(g);continue}}w!==null?(w.return=m,C=w):Vs(g)}h=h.sibling}e:for(h=null,g=e;;){if(g.tag===5){if(h===null){h=g;try{l=g.stateNode,d?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(a=g.stateNode,u=g.memoizedProps.style,o=u!=null&&u.hasOwnProperty("display")?u.display:null,a.style.display=ka("display",o))}catch(S){G(e,e.return,S)}}}else if(g.tag===6){if(h===null)try{g.stateNode.nodeValue=d?"":g.memoizedProps}catch(S){G(e,e.return,S)}}else if((g.tag!==22&&g.tag!==23||g.memoizedState===null||g===e)&&g.child!==null){g.child.return=g,g=g.child;continue}if(g===e)break e;for(;g.sibling===null;){if(g.return===null||g.return===e)break e;h===g&&(h=null),g=g.return}h===g&&(h=null),g.sibling.return=g.return,g=g.sibling}}break;case 19:Re(t,e),Ue(e),r&4&&As(e);break;case 21:break;default:Re(t,e),Ue(e)}}function Ue(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Yu(n)){var r=n;break e}n=n.return}throw Error(y(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Fn(l,""),r.flags&=-33);var i=Fs(e);Di(e,i,l);break;case 3:case 4:var o=r.stateNode.containerInfo,a=Fs(e);Oi(e,a,o);break;default:throw Error(y(161))}}catch(u){G(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function jf(e,t,n){C=e,Zu(e)}function Zu(e,t,n){for(var r=(e.mode&1)!==0;C!==null;){var l=C,i=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||xr;if(!o){var a=l.alternate,u=a!==null&&a.memoizedState!==null||ue;a=xr;var d=ue;if(xr=o,(ue=u)&&!d)for(C=l;C!==null;)o=C,u=o.child,o.tag===22&&o.memoizedState!==null?Bs(l):u!==null?(u.return=o,C=u):Bs(l);for(;i!==null;)C=i,Zu(i),i=i.sibling;C=l,xr=a,ue=d}Us(e)}else l.subtreeFlags&8772&&i!==null?(i.return=l,C=i):Us(e)}}function Us(e){for(;C!==null;){var t=C;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:ue||pl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!ue)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Me(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Ns(t,i,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ns(t,o,n)}break;case 5:var a=t.stateNode;if(n===null&&t.flags&4){n=a;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var h=d.memoizedState;if(h!==null){var g=h.dehydrated;g!==null&&Bn(g)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(y(163))}ue||t.flags&512&&Mi(t)}catch(m){G(t,t.return,m)}}if(t===e){C=null;break}if(n=t.sibling,n!==null){n.return=t.return,C=n;break}C=t.return}}function Vs(e){for(;C!==null;){var t=C;if(t===e){C=null;break}var n=t.sibling;if(n!==null){n.return=t.return,C=n;break}C=t.return}}function Bs(e){for(;C!==null;){var t=C;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{pl(4,t)}catch(u){G(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(u){G(t,l,u)}}var i=t.return;try{Mi(t)}catch(u){G(t,i,u)}break;case 5:var o=t.return;try{Mi(t)}catch(u){G(t,o,u)}}}catch(u){G(t,t.return,u)}if(t===e){C=null;break}var a=t.sibling;if(a!==null){a.return=t.return,C=a;break}C=t.return}}var Nf=Math.ceil,br=tt.ReactCurrentDispatcher,Co=tt.ReactCurrentOwner,Pe=tt.ReactCurrentBatchConfig,R=0,te=null,Z=null,ie=0,ke=0,Zt=kt(0),b=0,bn=null,Rt=0,ml=0,Eo=0,On=null,he=null,_o=0,cn=1/0,Ke=null,el=!1,$i=null,ht=null,wr=!1,ut=null,tl=0,Dn=0,Fi=null,Lr=-1,Ir=0;function fe(){return R&6?X():Lr!==-1?Lr:Lr=X()}function gt(e){return e.mode&1?R&2&&ie!==0?ie&-ie:sf.transition!==null?(Ir===0&&(Ir=Ma()),Ir):(e=O,e!==0||(e=window.event,e=e===void 0?16:Va(e.type)),e):1}function Fe(e,t,n,r){if(50<Dn)throw Dn=0,Fi=null,Error(y(185));tr(e,n,r),(!(R&2)||e!==te)&&(e===te&&(!(R&2)&&(ml|=n),b===4&&st(e,ie)),xe(e,r),n===1&&R===0&&!(t.mode&1)&&(cn=X()+500,cl&&St()))}function xe(e,t){var n=e.callbackNode;od(e,t);var r=Fr(e,e===te?ie:0);if(r===0)n!==null&&Jo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Jo(n),t===1)e.tag===0?of(Hs.bind(null,e)):ou(Hs.bind(null,e)),tf(function(){!(R&6)&&St()}),n=null;else{switch(Oa(r)){case 1:n=qi;break;case 4:n=Ia;break;case 16:n=$r;break;case 536870912:n=Ra;break;default:n=$r}n=lc(n,Ju.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Ju(e,t){if(Lr=-1,Ir=0,R&6)throw Error(y(327));var n=e.callbackNode;if(nn()&&e.callbackNode!==n)return null;var r=Fr(e,e===te?ie:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=nl(e,r);else{t=r;var l=R;R|=2;var i=bu();(te!==e||ie!==t)&&(Ke=null,cn=X()+500,zt(e,t));do try{_f();break}catch(a){qu(e,a)}while(!0);fo(),br.current=i,R=l,Z!==null?t=0:(te=null,ie=0,t=b)}if(t!==0){if(t===2&&(l=di(e),l!==0&&(r=l,t=Ai(e,l))),t===1)throw n=bn,zt(e,0),st(e,r),xe(e,X()),n;if(t===6)st(e,r);else{if(l=e.current.alternate,!(r&30)&&!Cf(l)&&(t=nl(e,r),t===2&&(i=di(e),i!==0&&(r=i,t=Ai(e,i))),t===1))throw n=bn,zt(e,0),st(e,r),xe(e,X()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(y(345));case 2:Nt(e,he,Ke);break;case 3:if(st(e,r),(r&130023424)===r&&(t=_o+500-X(),10<t)){if(Fr(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){fe(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=xi(Nt.bind(null,e,he,Ke),t);break}Nt(e,he,Ke);break;case 4:if(st(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-$e(r);i=1<<o,o=t[o],o>l&&(l=o),r&=~i}if(r=l,r=X()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Nf(r/1960))-r,10<r){e.timeoutHandle=xi(Nt.bind(null,e,he,Ke),r);break}Nt(e,he,Ke);break;case 5:Nt(e,he,Ke);break;default:throw Error(y(329))}}}return xe(e,X()),e.callbackNode===n?Ju.bind(null,e):null}function Ai(e,t){var n=On;return e.current.memoizedState.isDehydrated&&(zt(e,t).flags|=256),e=nl(e,t),e!==2&&(t=he,he=n,t!==null&&Ui(t)),e}function Ui(e){he===null?he=e:he.push.apply(he,e)}function Cf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!Ae(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function st(e,t){for(t&=~Eo,t&=~ml,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-$e(t),r=1<<n;e[n]=-1,t&=~r}}function Hs(e){if(R&6)throw Error(y(327));nn();var t=Fr(e,0);if(!(t&1))return xe(e,X()),null;var n=nl(e,t);if(e.tag!==0&&n===2){var r=di(e);r!==0&&(t=r,n=Ai(e,r))}if(n===1)throw n=bn,zt(e,0),st(e,t),xe(e,X()),n;if(n===6)throw Error(y(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Nt(e,he,Ke),xe(e,X()),null}function zo(e,t){var n=R;R|=1;try{return e(t)}finally{R=n,R===0&&(cn=X()+500,cl&&St())}}function Mt(e){ut!==null&&ut.tag===0&&!(R&6)&&nn();var t=R;R|=1;var n=Pe.transition,r=O;try{if(Pe.transition=null,O=1,e)return e()}finally{O=r,Pe.transition=n,R=t,!(R&6)&&St()}}function To(){ke=Zt.current,U(Zt)}function zt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,ef(n)),Z!==null)for(n=Z.return;n!==null;){var r=n;switch(ao(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Hr();break;case 3:an(),U(ve),U(ce),yo();break;case 5:vo(r);break;case 4:an();break;case 13:U(W);break;case 19:U(W);break;case 10:po(r.type._context);break;case 22:case 23:To()}n=n.return}if(te=e,Z=e=vt(e.current,null),ie=ke=t,b=0,bn=null,Eo=ml=Rt=0,he=On=null,Et!==null){for(t=0;t<Et.length;t++)if(n=Et[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var o=i.next;i.next=l,r.next=o}n.pending=r}Et=null}return e}function qu(e,t){do{var n=Z;try{if(fo(),zr.current=qr,Jr){for(var r=Q.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Jr=!1}if(It=0,ee=q=Q=null,Rn=!1,Zn=0,Co.current=null,n===null||n.return===null){b=1,bn=t,Z=null;break}e:{var i=e,o=n.return,a=n,u=t;if(t=ie,a.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,h=a,g=h.tag;if(!(h.mode&1)&&(g===0||g===11||g===15)){var m=h.alternate;m?(h.updateQueue=m.updateQueue,h.memoizedState=m.memoizedState,h.lanes=m.lanes):(h.updateQueue=null,h.memoizedState=null)}var w=Ps(o);if(w!==null){w.flags&=-257,Ls(w,o,a,i,t),w.mode&1&&Ts(i,d,t),t=w,u=d;var k=t.updateQueue;if(k===null){var S=new Set;S.add(u),t.updateQueue=S}else k.add(u);break e}else{if(!(t&1)){Ts(i,d,t),Po();break e}u=Error(y(426))}}else if(V&&a.mode&1){var D=Ps(o);if(D!==null){!(D.flags&65536)&&(D.flags|=256),Ls(D,o,a,i,t),uo(un(u,a));break e}}i=u=un(u,a),b!==4&&(b=2),On===null?On=[i]:On.push(i),i=o;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var p=Ou(i,u,t);js(i,p);break e;case 1:a=u;var c=i.type,f=i.stateNode;if(!(i.flags&128)&&(typeof c.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ht===null||!ht.has(f)))){i.flags|=65536,t&=-t,i.lanes|=t;var v=Du(i,a,t);js(i,v);break e}}i=i.return}while(i!==null)}tc(n)}catch(j){t=j,Z===n&&n!==null&&(Z=n=n.return);continue}break}while(!0)}function bu(){var e=br.current;return br.current=qr,e===null?qr:e}function Po(){(b===0||b===3||b===2)&&(b=4),te===null||!(Rt&268435455)&&!(ml&268435455)||st(te,ie)}function nl(e,t){var n=R;R|=2;var r=bu();(te!==e||ie!==t)&&(Ke=null,zt(e,t));do try{Ef();break}catch(l){qu(e,l)}while(!0);if(fo(),R=n,br.current=r,Z!==null)throw Error(y(261));return te=null,ie=0,b}function Ef(){for(;Z!==null;)ec(Z)}function _f(){for(;Z!==null&&!Jc();)ec(Z)}function ec(e){var t=rc(e.alternate,e,ke);e.memoizedProps=e.pendingProps,t===null?tc(e):Z=t,Co.current=null}function tc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=wf(n,t),n!==null){n.flags&=32767,Z=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{b=6,Z=null;return}}else if(n=xf(n,t,ke),n!==null){Z=n;return}if(t=t.sibling,t!==null){Z=t;return}Z=t=e}while(t!==null);b===0&&(b=5)}function Nt(e,t,n){var r=O,l=Pe.transition;try{Pe.transition=null,O=1,zf(e,t,n,r)}finally{Pe.transition=l,O=r}return null}function zf(e,t,n,r){do nn();while(ut!==null);if(R&6)throw Error(y(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(y(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(sd(e,i),e===te&&(Z=te=null,ie=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||wr||(wr=!0,lc($r,function(){return nn(),null})),i=(n.flags&15990)!==0,n.subtreeFlags&15990||i){i=Pe.transition,Pe.transition=null;var o=O;O=1;var a=R;R|=4,Co.current=null,Sf(e,n),Xu(n,e),Yd(vi),Ar=!!gi,vi=gi=null,e.current=n,jf(n),qc(),R=a,O=o,Pe.transition=i}else e.current=n;if(wr&&(wr=!1,ut=e,tl=l),i=e.pendingLanes,i===0&&(ht=null),td(n.stateNode),xe(e,X()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(el)throw el=!1,e=$i,$i=null,e;return tl&1&&e.tag!==0&&nn(),i=e.pendingLanes,i&1?e===Fi?Dn++:(Dn=0,Fi=e):Dn=0,St(),null}function nn(){if(ut!==null){var e=Oa(tl),t=Pe.transition,n=O;try{if(Pe.transition=null,O=16>e?16:e,ut===null)var r=!1;else{if(e=ut,ut=null,tl=0,R&6)throw Error(y(331));var l=R;for(R|=4,C=e.current;C!==null;){var i=C,o=i.child;if(C.flags&16){var a=i.deletions;if(a!==null){for(var u=0;u<a.length;u++){var d=a[u];for(C=d;C!==null;){var h=C;switch(h.tag){case 0:case 11:case 15:Mn(8,h,i)}var g=h.child;if(g!==null)g.return=h,C=g;else for(;C!==null;){h=C;var m=h.sibling,w=h.return;if(Ku(h),h===d){C=null;break}if(m!==null){m.return=w,C=m;break}C=w}}}var k=i.alternate;if(k!==null){var S=k.child;if(S!==null){k.child=null;do{var D=S.sibling;S.sibling=null,S=D}while(S!==null)}}C=i}}if(i.subtreeFlags&2064&&o!==null)o.return=i,C=o;else e:for(;C!==null;){if(i=C,i.flags&2048)switch(i.tag){case 0:case 11:case 15:Mn(9,i,i.return)}var p=i.sibling;if(p!==null){p.return=i.return,C=p;break e}C=i.return}}var c=e.current;for(C=c;C!==null;){o=C;var f=o.child;if(o.subtreeFlags&2064&&f!==null)f.return=o,C=f;else e:for(o=c;C!==null;){if(a=C,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:pl(9,a)}}catch(j){G(a,a.return,j)}if(a===o){C=null;break e}var v=a.sibling;if(v!==null){v.return=a.return,C=v;break e}C=a.return}}if(R=l,St(),He&&typeof He.onPostCommitFiberRoot=="function")try{He.onPostCommitFiberRoot(il,e)}catch{}r=!0}return r}finally{O=n,Pe.transition=t}}return!1}function Ws(e,t,n){t=un(n,t),t=Ou(e,t,1),e=mt(e,t,1),t=fe(),e!==null&&(tr(e,1,t),xe(e,t))}function G(e,t,n){if(e.tag===3)Ws(e,e,n);else for(;t!==null;){if(t.tag===3){Ws(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ht===null||!ht.has(r))){e=un(n,e),e=Du(t,e,1),t=mt(t,e,1),e=fe(),t!==null&&(tr(t,1,e),xe(t,e));break}}t=t.return}}function Tf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=fe(),e.pingedLanes|=e.suspendedLanes&n,te===e&&(ie&n)===n&&(b===4||b===3&&(ie&130023424)===ie&&500>X()-_o?zt(e,0):Eo|=n),xe(e,t)}function nc(e,t){t===0&&(e.mode&1?(t=cr,cr<<=1,!(cr&130023424)&&(cr=4194304)):t=1);var n=fe();e=be(e,t),e!==null&&(tr(e,t,n),xe(e,n))}function Pf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),nc(e,n)}function Lf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(y(314))}r!==null&&r.delete(t),nc(e,n)}var rc;rc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ve.current)ge=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return ge=!1,yf(e,t,n);ge=!!(e.flags&131072)}else ge=!1,V&&t.flags&1048576&&su(t,Kr,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Pr(e,t),e=t.pendingProps;var l=ln(t,ce.current);tn(t,n),l=wo(null,t,r,e,l,n);var i=ko();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ye(r)?(i=!0,Wr(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,ho(t),l.updater=fl,t.stateNode=l,l._reactInternals=t,Ei(t,r,e,n),t=Ti(null,t,r,!0,i,n)):(t.tag=0,V&&i&&so(t),de(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Pr(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Rf(r),e=Me(r,e),l){case 0:t=zi(null,t,r,e,n);break e;case 1:t=Ms(null,t,r,e,n);break e;case 11:t=Is(null,t,r,e,n);break e;case 14:t=Rs(null,t,r,Me(r.type,e),n);break e}throw Error(y(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Me(r,l),zi(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Me(r,l),Ms(e,t,r,l,n);case 3:e:{if(Uu(t),e===null)throw Error(y(387));r=t.pendingProps,i=t.memoizedState,l=i.element,pu(e,t),Xr(t,r,null,n);var o=t.memoizedState;if(r=o.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=un(Error(y(423)),t),t=Os(e,t,r,n,l);break e}else if(r!==l){l=un(Error(y(424)),t),t=Os(e,t,r,n,l);break e}else for(Se=pt(t.stateNode.containerInfo.firstChild),je=t,V=!0,De=null,n=du(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(on(),r===l){t=et(e,t,n);break e}de(e,t,r,n)}t=t.child}return t;case 5:return mu(t),e===null&&ji(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,o=l.children,yi(r,l)?o=null:i!==null&&yi(r,i)&&(t.flags|=32),Au(e,t),de(e,t,o,n),t.child;case 6:return e===null&&ji(t),null;case 13:return Vu(e,t,n);case 4:return go(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=sn(t,null,r,n):de(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Me(r,l),Is(e,t,r,l,n);case 7:return de(e,t,t.pendingProps,n),t.child;case 8:return de(e,t,t.pendingProps.children,n),t.child;case 12:return de(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,o=l.value,F(Yr,r._currentValue),r._currentValue=o,i!==null)if(Ae(i.value,o)){if(i.children===l.children&&!ve.current){t=et(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var a=i.dependencies;if(a!==null){o=i.child;for(var u=a.firstContext;u!==null;){if(u.context===r){if(i.tag===1){u=Ze(-1,n&-n),u.tag=2;var d=i.updateQueue;if(d!==null){d=d.shared;var h=d.pending;h===null?u.next=u:(u.next=h.next,h.next=u),d.pending=u}}i.lanes|=n,u=i.alternate,u!==null&&(u.lanes|=n),Ni(i.return,n,t),a.lanes|=n;break}u=u.next}}else if(i.tag===10)o=i.type===t.type?null:i.child;else if(i.tag===18){if(o=i.return,o===null)throw Error(y(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Ni(o,n,t),o=i.sibling}else o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===t){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}de(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,tn(t,n),l=Le(l),r=r(l),t.flags|=1,de(e,t,r,n),t.child;case 14:return r=t.type,l=Me(r,t.pendingProps),l=Me(r.type,l),Rs(e,t,r,l,n);case 15:return $u(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Me(r,l),Pr(e,t),t.tag=1,ye(r)?(e=!0,Wr(t)):e=!1,tn(t,n),Mu(t,r,l),Ei(t,r,l,n),Ti(null,t,r,!0,e,n);case 19:return Bu(e,t,n);case 22:return Fu(e,t,n)}throw Error(y(156,t.tag))};function lc(e,t){return La(e,t)}function If(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Te(e,t,n,r){return new If(e,t,n,r)}function Lo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Rf(e){if(typeof e=="function")return Lo(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Xi)return 11;if(e===Zi)return 14}return 2}function vt(e,t){var n=e.alternate;return n===null?(n=Te(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Rr(e,t,n,r,l,i){var o=2;if(r=e,typeof e=="function")Lo(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case Ut:return Tt(n.children,l,i,t);case Gi:o=8,l|=8;break;case Zl:return e=Te(12,n,t,l|2),e.elementType=Zl,e.lanes=i,e;case Jl:return e=Te(13,n,t,l),e.elementType=Jl,e.lanes=i,e;case ql:return e=Te(19,n,t,l),e.elementType=ql,e.lanes=i,e;case ma:return hl(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case fa:o=10;break e;case pa:o=9;break e;case Xi:o=11;break e;case Zi:o=14;break e;case lt:o=16,r=null;break e}throw Error(y(130,e==null?e:typeof e,""))}return t=Te(o,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function Tt(e,t,n,r){return e=Te(7,e,r,t),e.lanes=n,e}function hl(e,t,n,r){return e=Te(22,e,r,t),e.elementType=ma,e.lanes=n,e.stateNode={isHidden:!1},e}function Ql(e,t,n){return e=Te(6,e,null,t),e.lanes=n,e}function Kl(e,t,n){return t=Te(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Mf(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=El(0),this.expirationTimes=El(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=El(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Io(e,t,n,r,l,i,o,a,u){return e=new Mf(e,t,n,a,u),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Te(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ho(i),e}function Of(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:At,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function ic(e){if(!e)return xt;e=e._reactInternals;e:{if(Dt(e)!==e||e.tag!==1)throw Error(y(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ye(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(y(171))}if(e.tag===1){var n=e.type;if(ye(n))return iu(e,n,t)}return t}function oc(e,t,n,r,l,i,o,a,u){return e=Io(n,r,!0,e,l,i,o,a,u),e.context=ic(null),n=e.current,r=fe(),l=gt(n),i=Ze(r,l),i.callback=t??null,mt(n,i,l),e.current.lanes=l,tr(e,l,r),xe(e,r),e}function gl(e,t,n,r){var l=t.current,i=fe(),o=gt(l);return n=ic(n),t.context===null?t.context=n:t.pendingContext=n,t=Ze(i,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=mt(l,t,o),e!==null&&(Fe(e,l,o,i),_r(e,l,o)),o}function rl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Qs(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Ro(e,t){Qs(e,t),(e=e.alternate)&&Qs(e,t)}function Df(){return null}var sc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Mo(e){this._internalRoot=e}vl.prototype.render=Mo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(y(409));gl(e,t,null,null)};vl.prototype.unmount=Mo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Mt(function(){gl(null,e,null,null)}),t[qe]=null}};function vl(e){this._internalRoot=e}vl.prototype.unstable_scheduleHydration=function(e){if(e){var t=Fa();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ot.length&&t!==0&&t<ot[n].priority;n++);ot.splice(n,0,e),n===0&&Ua(e)}};function Oo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function yl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ks(){}function $f(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var d=rl(o);i.call(d)}}var o=oc(t,r,e,0,null,!1,!1,"",Ks);return e._reactRootContainer=o,e[qe]=o.current,Qn(e.nodeType===8?e.parentNode:e),Mt(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var a=r;r=function(){var d=rl(u);a.call(d)}}var u=Io(e,0,!1,null,null,!1,!1,"",Ks);return e._reactRootContainer=u,e[qe]=u.current,Qn(e.nodeType===8?e.parentNode:e),Mt(function(){gl(t,u,n,r)}),u}function xl(e,t,n,r,l){var i=n._reactRootContainer;if(i){var o=i;if(typeof l=="function"){var a=l;l=function(){var u=rl(o);a.call(u)}}gl(t,o,e,l)}else o=$f(n,t,e,l,r);return rl(o)}Da=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=En(t.pendingLanes);n!==0&&(bi(t,n|1),xe(t,X()),!(R&6)&&(cn=X()+500,St()))}break;case 13:Mt(function(){var r=be(e,1);if(r!==null){var l=fe();Fe(r,e,1,l)}}),Ro(e,1)}};eo=function(e){if(e.tag===13){var t=be(e,134217728);if(t!==null){var n=fe();Fe(t,e,134217728,n)}Ro(e,134217728)}};$a=function(e){if(e.tag===13){var t=gt(e),n=be(e,t);if(n!==null){var r=fe();Fe(n,e,t,r)}Ro(e,t)}};Fa=function(){return O};Aa=function(e,t){var n=O;try{return O=e,t()}finally{O=n}};ai=function(e,t,n){switch(t){case"input":if(ti(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=ul(r);if(!l)throw Error(y(90));ga(r),ti(r,l)}}}break;case"textarea":ya(e,n);break;case"select":t=n.value,t!=null&&Jt(e,!!n.multiple,t,!1)}};Ca=zo;Ea=Mt;var Ff={usingClientEntryPoint:!1,Events:[rr,Wt,ul,ja,Na,zo]},jn={findFiberByHostInstance:Ct,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Af={bundleType:jn.bundleType,version:jn.version,rendererPackageName:jn.rendererPackageName,rendererConfig:jn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:tt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ta(e),e===null?null:e.stateNode},findFiberByHostInstance:jn.findFiberByHostInstance||Df,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var kr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!kr.isDisabled&&kr.supportsFiber)try{il=kr.inject(Af),He=kr}catch{}}Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ff;Ce.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Oo(t))throw Error(y(200));return Of(e,t,null,n)};Ce.createRoot=function(e,t){if(!Oo(e))throw Error(y(299));var n=!1,r="",l=sc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Io(e,1,!1,null,null,n,!1,r,l),e[qe]=t.current,Qn(e.nodeType===8?e.parentNode:e),new Mo(t)};Ce.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(y(188)):(e=Object.keys(e).join(","),Error(y(268,e)));return e=Ta(t),e=e===null?null:e.stateNode,e};Ce.flushSync=function(e){return Mt(e)};Ce.hydrate=function(e,t,n){if(!yl(t))throw Error(y(200));return xl(null,e,t,!0,n)};Ce.hydrateRoot=function(e,t,n){if(!Oo(e))throw Error(y(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",o=sc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=oc(t,null,e,1,n??null,l,!1,i,o),e[qe]=t.current,Qn(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new vl(t)};Ce.render=function(e,t,n){if(!yl(t))throw Error(y(200));return xl(null,e,t,!1,n)};Ce.unmountComponentAtNode=function(e){if(!yl(e))throw Error(y(40));return e._reactRootContainer?(Mt(function(){xl(null,null,e,!1,function(){e._reactRootContainer=null,e[qe]=null})}),!0):!1};Ce.unstable_batchedUpdates=zo;Ce.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!yl(n))throw Error(y(200));if(e==null||e._reactInternals===void 0)throw Error(y(38));return xl(e,t,n,!1,r)};Ce.version="18.3.1-next-f1338f8080-20240426";function ac(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ac)}catch(e){console.error(e)}}ac(),aa.exports=Ce;var Uf=aa.exports,Ys=Uf;Gl.createRoot=Ys.createRoot,Gl.hydrateRoot=Ys.hydrateRoot;const Vf=({score:e,level:t,confidence:n})=>{const r=Math.round(Math.min(Math.max(e*100,0),100)),l=2*Math.PI*54,i=l-r/100*l,o=()=>{switch(t){case"critical":return"#ef4444";case"high":return"#f59e0b";case"medium":return"#3b82f6";case"low":return"#10b981";default:return"#1d4ed8"}},a=()=>{switch(t){case"critical":return"CRITICAL RISK";case"high":return"HIGH RISK";case"medium":return"MEDIUM RISK";case"low":return"LOW RISK";default:return"UNKNOWN RISK"}},u=o();return s.jsxs("div",{className:"risk-gauge",children:[s.jsxs("div",{className:"risk-gauge-ring-wrap",children:[s.jsxs("svg",{width:"150",height:"150",viewBox:"0 0 120 120",children:[s.jsx("circle",{cx:"60",cy:"60",r:"54",fill:"none",stroke:"var(--bg-tertiary)",strokeWidth:"9"}),s.jsx("circle",{cx:"60",cy:"60",r:"54",fill:"none",stroke:u,strokeWidth:"9",strokeLinecap:"round",strokeDasharray:l,strokeDashoffset:i,transform:"rotate(-90 60 60)",style:{transition:"stroke-dashoffset 1s ease",filter:`drop-shadow(0 0 6px ${u}66)`}})]}),s.jsxs("div",{className:"risk-gauge-center",children:[s.jsx("span",{className:"risk-gauge-score",style:{color:u},children:r}),s.jsx("span",{className:"risk-gauge-max",children:"/100"})]})]}),s.jsxs("div",{className:"risk-gauge-info",children:[s.jsx("span",{className:"risk-level-pill",style:{color:u,background:`${u}22`,borderColor:`${u}55`},children:a()}),s.jsxs("span",{className:"risk-confidence",children:["Confidence ",(n*100).toFixed(0),"%"]})]}),s.jsx("style",{children:`
        .risk-gauge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .risk-gauge-ring-wrap {
          position: relative;
          width: 150px;
          height: 150px;
        }
        .risk-gauge-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .risk-gauge-score {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
          font-family: 'Inter', sans-serif;
        }
        .risk-gauge-max {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 2px;
        }
        .risk-gauge-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .risk-level-pill {
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .risk-confidence {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `})]})},Bf=({text:e="Analyzing"})=>s.jsxs("div",{className:"typing-indicator",children:[s.jsxs("div",{className:"typing-dots",children:[s.jsx("span",{className:"dot"}),s.jsx("span",{className:"dot"}),s.jsx("span",{className:"dot"})]}),s.jsxs("span",{className:"typing-text",children:[e,"..."]}),s.jsx("style",{children:`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          border: 1px solid var(--border);
          max-width: fit-content;
        }
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          /* typing dots timing: 1.2s ease-in-out infinite, delay index * 0.2s
             (uses the shared global "bounce" keyframe defined in index.css) */
          animation: bounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .typing-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `})]}),Hf=({suggestions:e,onSelect:t})=>!e||e.length===0?null:s.jsxs("div",{className:"suggestion-chips",children:[e.map((n,r)=>s.jsx("button",{className:"chip",onClick:()=>t(n),children:n},r)),s.jsx("style",{children:`
        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          background: rgba(29, 78, 216, 0.1);
          border: 1px solid rgba(29, 78, 216, 0.3);
          border-radius: 20px;
          color: var(--primary-light);
          font-size: 0.8rem;
          cursor: pointer;
          /* suggestion chip hover transition: all 0.15s */
          transition: all 0.15s;
          font-family: inherit;
        }
        .chip:hover {
          /* suggestion chips invert color on hover: background #0B2D9F, text -> white */
          background: #0B2D9F;
          border-color: #0B2D9F;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .chip:active {
          transform: translateY(0);
        }
      `})]});function uc(e){if(!e)return"";let t=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return t=t.replace(/^## (.*)$/gm,'<h4 style="margin: 10px 0 6px; color: var(--text-primary);">$1</h4>'),t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/`([^`]+)`/g,'<code style="background: var(--bg-tertiary); padding: 1px 6px; border-radius: 4px; font-size: 0.85em;">$1</code>'),t=t.replace(/\*([^*\n]+)\*/g,"<em>$1</em>"),t=t.replace(/^- (.*)$/gm,'<div style="padding-left: 14px;">&bull; $1</div>'),t=t.replace(/\n/g,"<br/>"),t}function Gs(e,t){if(!e)return"";if(e.length<=t)return e;const n=e.slice(0,t),r=n.lastIndexOf(" ");return(r>t*.6?n.slice(0,r):n).replace(/[\s.,;:!?]+$/,"")+"…"}const Wf=[{key:"overview",label:"Overview"},{key:"understanding",label:"AI Understanding"},{key:"evidence",label:"RAG Evidence",count:e=>e.retrievedEvidence.length},{key:"incidents",label:"Similar Incidents",count:e=>e.similarIncidents.length},{key:"mitigation",label:"Mitigation Plan"},{key:"trace",label:"Agent Trace"}],Qf=({report:e,activeTab:t,onTabChange:n,requestTitle:r})=>s.jsxs("div",{className:"report-tabs",children:[s.jsx("div",{className:"tabs-nav",children:Wf.map(l=>s.jsxs("button",{className:`tab-btn ${t===l.key?"active":""}`,onClick:()=>n(l.key),children:[l.label,l.count&&s.jsx("span",{className:"tab-count",children:l.count(e)})]},l.key))}),s.jsxs("div",{className:"tab-content animate-fadeIn",children:[t==="overview"&&s.jsx(Kf,{report:e,requestTitle:r}),t==="understanding"&&s.jsx(Gf,{report:e}),t==="evidence"&&s.jsx(Xf,{report:e}),t==="incidents"&&s.jsx(Zf,{incidents:e.similarIncidents}),t==="mitigation"&&s.jsx(Jf,{report:e}),t==="trace"&&s.jsx(tp,{traces:e.agentTraces})]},t),s.jsx("style",{children:`
        .report-tabs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tabs-nav {
          display: flex;
          gap: 4px;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--border);
          overflow-x: auto;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }
        .tab-btn:active {
          transform: translateY(0);
        }
        .tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 10px rgba(29, 78, 216, 0.4);
        }
        .tab-count {
          background: rgba(255,255,255,0.18);
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .tab-btn:not(.active) .tab-count {
          background: var(--bg-tertiary);
        }
        .tab-content {
          min-height: 200px;
        }
      `})]}),Kf=({report:e,requestTitle:t})=>s.jsxs("div",{className:"tab-panel",children:[s.jsxs("div",{className:"card why-panel",children:[s.jsx("div",{className:"card-header",children:s.jsx("h3",{className:"card-title",children:"🔍 Why the AI chose this application"})}),s.jsxs("div",{className:"why-grid",children:[s.jsxs("div",{className:"why-main",children:[s.jsx("span",{className:"why-label",children:"Normalized Request"}),s.jsx("p",{className:"why-request",children:t||e.interpretedIntent.substring(0,140)}),e.reasoning.length>0&&s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"why-label",style:{marginTop:14},children:"Reasoning"}),s.jsx("ul",{className:"reasoning-list",children:e.reasoning.map((n,r)=>s.jsx("li",{children:n},r))})]})]}),s.jsxs("div",{className:"why-side",children:[s.jsxs("div",{className:"why-fact",children:[s.jsx("span",{className:"why-fact-label",children:"Primary Component"}),s.jsx("span",{className:"why-fact-value",children:e.primaryComponent||"Not resolved"})]}),s.jsxs("div",{className:"why-fact",children:[s.jsx("span",{className:"why-fact-label",children:"Inferred Change Type"}),s.jsx("span",{className:"why-fact-value",children:(e.inferredChangeType||"unknown").replace(/_/g," ").toUpperCase()})]}),s.jsxs("div",{className:"why-fact",children:[s.jsx("span",{className:"why-fact-label",children:"Data Sources Used"}),s.jsx("div",{className:"service-chips",style:{marginTop:6},children:e.dataSourcesUsed.map((n,r)=>s.jsx("span",{className:"service-chip src-chip",children:n},r))})]})]})]})]}),s.jsxs("div",{className:"overview-grid",style:{marginTop:16},children:[s.jsxs("div",{className:"card",children:[s.jsx("div",{className:"card-header",children:s.jsx("h3",{className:"card-title",children:"Impact Summary"})}),s.jsxs("div",{className:"stat-list",children:[s.jsxs("div",{className:"stat",children:[s.jsx("span",{className:"stat-label",children:"Risk Score"}),s.jsxs("span",{className:`stat-value badge-${e.riskLevel}`,children:[Math.round(e.riskScore*100),"/100"]})]}),s.jsxs("div",{className:"stat",children:[s.jsx("span",{className:"stat-label",children:"Confidence"}),s.jsxs("span",{className:"stat-value",children:[(e.confidence*100).toFixed(0),"%"]})]}),s.jsxs("div",{className:"stat",children:[s.jsx("span",{className:"stat-label",children:"Services Impacted"}),s.jsx("span",{className:"stat-value",children:e.impactedServices.length})]}),s.jsxs("div",{className:"stat",children:[s.jsx("span",{className:"stat-label",children:"Processing Time"}),s.jsxs("span",{className:"stat-value",children:[(e.processingTimeMs/1e3).toFixed(2),"s"]})]})]})]}),s.jsxs("div",{className:"card",children:[s.jsx("div",{className:"card-header",children:s.jsxs("h3",{className:"card-title",children:["Teams to Notify (",e.teamsToNotify.length,")"]})}),s.jsx("div",{className:"team-list",children:e.teamsToNotify.map((n,r)=>s.jsx("span",{className:"team-badge",children:n},r))}),s.jsxs("div",{style:{marginTop:16},children:[s.jsx("h3",{className:"card-title",style:{marginBottom:8},children:"Mode"}),s.jsx("span",{className:`badge ${e.mockMode?"badge-medium":"badge-success"}`,children:e.mockMode?"Mock Mode":"Live Analysis"})]})]})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("div",{className:"card-header",children:s.jsx("h3",{className:"card-title",children:"Executive Summary"})}),s.jsx("div",{className:"exec-summary",dangerouslySetInnerHTML:{__html:uc(e.executiveSummary)}})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("div",{className:"card-header",children:s.jsxs("h3",{className:"card-title",children:["Impacted Services (",e.impactedServicesDetailed.length||e.impactedServices.length,")"]})}),s.jsx(Yf,{services:e.impactedServicesDetailed,fallbackNames:e.impactedServices})]}),s.jsx("style",{children:`
      .why-panel { border-color: rgba(59, 130, 246, 0.35); }
      .why-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
      @media (max-width: 768px) { .why-grid { grid-template-columns: 1fr; } }
      .why-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--text-muted);
        font-weight: 700;
        display: block;
        margin-bottom: 6px;
      }
      .why-request {
        font-size: 0.95rem;
        color: var(--text-primary);
        font-weight: 600;
        line-height: 1.5;
      }
      .reasoning-list {
        margin: 0;
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .reasoning-list li {
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }
      .why-side { display: flex; flex-direction: column; gap: 16px; }
      .why-fact { display: flex; flex-direction: column; gap: 4px; }
      .why-fact-label {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        font-weight: 700;
      }
      .why-fact-value {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--primary-light);
        font-family: 'Courier New', monospace;
      }

      .overview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      @media (max-width: 640px) {
        .overview-grid { grid-template-columns: 1fr; }
      }
      .stat-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--border);
      }
      .stat:last-child { border-bottom: none; }
      .stat-label { color: var(--text-secondary); font-size: 0.875rem; }
      .stat-value { font-weight: 700; font-size: 0.9rem; }
      .team-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-badge {
        padding: 4px 10px;
        background: rgba(59, 130, 246, 0.12);
        border: 1px solid rgba(59, 130, 246, 0.35);
        border-radius: 6px;
        color: #93c5fd;
        font-size: 0.8rem;
        font-weight: 500;
      }
      .exec-summary {
        font-size: 0.9rem;
        line-height: 1.8;
        color: var(--text-secondary);
      }
      .exec-summary strong {
        color: var(--text-primary);
      }
    `})]}),Yf=({services:e,fallbackNames:t})=>{const n=e.length>0?e:t.map(r=>({name:r,criticality:"unknown",owner:"unknown",type:"unknown",role:"target"}));return n.length===0?s.jsx("p",{style:{color:"var(--text-muted)",padding:12},children:"No impacted services resolved for this change."}):s.jsxs("div",{className:"services-list",children:[n.map((r,l)=>s.jsxs("div",{className:"service-row",children:[s.jsx("div",{className:"service-row-accent"}),s.jsxs("div",{className:"service-row-main",children:[s.jsx("span",{className:"service-row-name",children:r.name}),s.jsxs("span",{className:"service-row-meta",children:["Team: ",r.owner.replace("team-","").replace(/-/g," ")," · Type: ",r.type]})]}),s.jsxs("div",{className:"service-row-tags",children:[s.jsx("span",{className:`badge badge-${r.criticality}`,children:r.criticality}),s.jsx("span",{className:`role-tag role-tag-${r.role}`,children:r.role})]})]},l)),s.jsx("style",{children:`
        .services-list { display: flex; flex-direction: column; gap: 8px; }
        .service-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }
        .service-row-accent {
          width: 3px;
          align-self: stretch;
          border-radius: 3px;
          background: var(--primary);
          flex-shrink: 0;
        }
        .service-row-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .service-row-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .service-row-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }
        .service-row-tags {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
      `})]})},Gf=({report:e})=>s.jsxs("div",{className:"tab-panel",children:[s.jsxs("div",{className:"card",children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Raw Agent Interpretation"}),s.jsx("p",{style:{color:"var(--text-secondary)",lineHeight:1.7,whiteSpace:"pre-wrap",fontSize:"0.85rem"},children:e.interpretedIntent})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Impacted Service Names"}),s.jsx("div",{className:"service-chips",children:e.impactedServices.map((t,n)=>s.jsx("span",{className:"service-chip",children:t},n))})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Data Sources Used"}),s.jsx("div",{className:"service-chips",children:e.dataSourcesUsed.map((t,n)=>s.jsx("span",{className:"service-chip src-chip",children:t},n))})]}),s.jsx("style",{children:`
      .service-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .service-chip {
        padding: 6px 14px;
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 6px;
        color: #22d3ee;
        font-size: 0.85rem;
      }
      .src-chip {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
        color: #34d399;
      }
    `})]}),Xf=({report:e})=>s.jsxs("div",{className:"tab-panel",children:[e.retrievedEvidence.length===0?s.jsx("div",{className:"card",children:s.jsx("p",{style:{color:"var(--text-muted)",textAlign:"center",padding:20},children:"No evidence retrieved for this change."})}):s.jsx("div",{className:"evidence-list",children:e.retrievedEvidence.slice(0,10).map((t,n)=>s.jsxs("div",{className:"evidence-item card",children:[s.jsxs("div",{className:"evidence-meta",children:[s.jsx("span",{className:`badge badge-${t.type||"info"}`,children:t.type}),s.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"0.8rem"},children:["Source: ",t.source]})]}),s.jsx("p",{className:"evidence-content",children:typeof t.content=="string"?t.content.substring(0,300):JSON.stringify(t.content)}),t.relevance!==void 0&&s.jsxs("div",{className:"evidence-relevance",children:["Relevance: ",(t.relevance*100).toFixed(0),"%"]})]},n))}),s.jsx("style",{children:`
      .evidence-list { display: flex; flex-direction: column; gap: 12px; }
      .evidence-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .evidence-content {
        color: var(--text-secondary);
        font-size: 0.85rem;
        line-height: 1.6;
      }
      .evidence-relevance {
        margin-top: 8px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    `})]}),Zf=({incidents:e})=>s.jsxs("div",{className:"tab-panel",children:[e.length===0?s.jsx("div",{className:"card",children:s.jsx("p",{style:{color:"var(--text-muted)",textAlign:"center",padding:20},children:"No similar incidents found."})}):s.jsx("div",{className:"incidents-list",children:e.map((t,n)=>s.jsxs("div",{className:"incident-item card",children:[s.jsxs("div",{className:"incident-header",children:[s.jsx("span",{className:`badge badge-${t.severity}`,children:t.severity}),s.jsx("span",{style:{color:"var(--text-muted)",fontSize:"0.8rem"},children:t.id})]}),s.jsx("h4",{style:{margin:"8px 0",fontSize:"0.95rem"},children:t.title||"Untitled incident"}),s.jsxs("p",{style:{color:"var(--text-secondary)",fontSize:"0.85rem"},children:["Service: ",t.service]}),t.resolution&&s.jsxs("p",{style:{color:"var(--text-secondary)",fontSize:"0.85rem",marginTop:4},children:["Resolution: ",t.resolution.substring(0,150)]}),t.similarity_score!==void 0&&s.jsxs("div",{style:{marginTop:8,fontSize:"0.8rem",color:"var(--text-muted)"},children:["Match: ",(t.similarity_score*100).toFixed(0),"%"]})]},n))}),s.jsx("style",{children:`
      .incidents-list { display: flex; flex-direction: column; gap: 12px; }
      .incident-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `})]}),Jf=({report:e})=>s.jsxs("div",{className:"tab-panel",children:[s.jsxs("div",{className:"card",children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Potential Risks"}),s.jsx("div",{className:"list-items",children:e.potentialRisks.map((t,n)=>s.jsxs("div",{className:"list-item",children:[s.jsx("span",{className:"list-icon",children:"⚠️"}),s.jsx("span",{children:t})]},n))})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Mitigation Plan"}),s.jsx("div",{className:"list-items",children:e.mitigationPlan.map((t,n)=>s.jsxs("div",{className:"list-item",children:[s.jsxs("span",{className:"list-icon",children:[n+1,"."]}),s.jsx("span",{children:t})]},n))})]}),s.jsxs("div",{className:"card",style:{marginTop:16},children:[s.jsx("h3",{className:"card-title",style:{marginBottom:12},children:"Recommended Tests"}),s.jsx("div",{className:"list-items",children:e.recommendedTests.map((t,n)=>s.jsxs("div",{className:"list-item",children:[s.jsx("span",{className:"list-icon",children:"🧪"}),s.jsx("span",{children:t})]},n))})]}),s.jsx("style",{children:`
      .list-items { display: flex; flex-direction: column; gap: 8px; }
      .list-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        background: var(--bg-tertiary);
        border-radius: 8px;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
      .list-icon {
        flex-shrink: 0;
        font-weight: 600;
        min-width: 24px;
      }
    `})]}),qf={intake:{icon:"🧭",color:"#60a5fa",label:"PromptUnderstandingAgent"},dependency:{icon:"🔗",color:"#22d3ee",label:"DependencyAgent"},knowledge:{icon:"📚",color:"#a78bfa",label:"KnowledgeRetrievalAgent"},incident:{icon:"🚨",color:"#f472b6",label:"IncidentAgent"},risk:{icon:"⚠️",color:"#f59e0b",label:"RiskAgent"},notification:{icon:"🔔",color:"#fbbf24",label:"NotificationAgent"},summary:{icon:"✅",color:"#34d399",label:"SummaryAgent"}};function bf(e){return String(e).replace("AgentType.","").toLowerCase()}function ep(e,t){let n=null;try{n=t?JSON.parse(t):null}catch{n=null}if(!n)return{line:t?t.substring(0,180):"No output recorded for this step."};switch(e){case"intake":{const r=n.primary_services||[];return{line:`Resolved ${r.length} component target(s); primary component is ${r[0]||"unknown"}.`,sub:`Scope: ${n.scope||"n/a"} · Change type: ${n.change_type||"n/a"}`}}case"dependency":{const r=(n.primary_services||[]).length,l=(n.all_impacted_services||[]).length,i=n.impacted_details||[],o=i.filter(u=>u.role==="direct").length,a=i.filter(u=>u.role==="downstream").length;return{line:`Found ${l} impacted service(s) across ${r} resolved target component(s).`,sub:`TARGET=${r}, DIRECT=${o}, DOWNSTREAM=${a}`}}case"knowledge":{const r=n.evidence||[],l={};r.forEach(o=>{l[o.type]=(l[o.type]||0)+1});const i=Object.entries(l).map(([o,a])=>`${o}:${a}`).join(", ");return{line:`RAG retrieved ${r.length} evidence item(s) from ${Object.keys(l).length} source type(s).`,sub:i||void 0}}case"incident":{const r=n.similar_incidents||[],l=r[0];return{line:`Found ${r.length} similar historical incident(s) (${n.high_severity_count||0} high/critical severity).`,sub:l?`Top match: ${l.title||l.id} (score ${Math.round((l.similarity_score||0)*100)}%)`:void 0}}case"risk":return{line:`Risk Score: ${Math.round((n.risk_score||0)*100)}/100 (${String(n.risk_level||"").toUpperCase()}) · Confidence: ${((n.confidence||0)*100).toFixed(0)}%`,sub:`${(n.potential_risks||[]).length} risk(s) identified, ${(n.mitigation_plan||[]).length} mitigation step(s) generated`};case"notification":{const r=n.teams_to_notify||[];return{line:`Identified ${r.length} team(s) to notify, priority: ${n.notification_priority||"standard"}.`,sub:r.length?`Teams: ${r.join(", ")}`:void 0}}case"summary":return{line:`Generated executive summary (${(n.executive_summary||"").length} chars) · Analysis ID: ${n.analysis_id||"n/a"}`,sub:n.mock_mode?"Mode: mock":"Mode: live AI provider"};default:return{line:JSON.stringify(n).substring(0,180)}}}const tp=({traces:e})=>{const t=e.reduce((n,r)=>n+(r.processingTimeMs||0),0);return s.jsxs("div",{className:"tab-panel",children:[s.jsxs("div",{className:"trace-total",children:["Agent Execution Trace ",s.jsxs("span",{children:["Total: ",t,"ms"]})]}),s.jsx("div",{className:"agent-trace-list",children:e.map((n,r)=>{const l=bf(n.agent),i=qf[l]||{icon:"🤖",color:"#94a3b8",label:n.agent},{line:o,sub:a}=ep(l,n.output),u=n.status==="completed";return s.jsxs("div",{className:"agent-card",style:{borderLeftColor:i.color},children:[s.jsx("div",{className:"agent-card-icon",style:{background:`${i.color}22`,color:i.color},children:i.icon}),s.jsxs("div",{className:"agent-card-body",children:[s.jsxs("div",{className:"agent-card-header",children:[s.jsx("span",{className:"agent-card-name",children:i.label}),s.jsxs("div",{className:"agent-card-meta",children:[s.jsx("span",{className:`status-pill ${u?"status-success":n.status==="failed"?"status-failed":"status-running"}`,children:u?"SUCCESS":n.status.toUpperCase()}),s.jsxs("span",{className:"agent-card-time",children:[n.processingTimeMs,"ms"]})]})]}),s.jsx("p",{className:"agent-card-line",children:o}),a&&s.jsx("p",{className:"agent-card-sub",children:a}),n.error&&s.jsxs("p",{className:"agent-card-error",children:["Error: ",n.error]})]})]},r)})}),s.jsx("style",{children:`
        .trace-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .trace-total span {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .agent-trace-list { display: flex; flex-direction: column; gap: 10px; }
        .agent-card {
          display: flex;
          gap: 14px;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 4px solid;
          border-radius: 10px;
          transition: var(--transition);
        }
        .agent-card:hover {
          box-shadow: var(--shadow);
        }
        .agent-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .agent-card-body { flex: 1; min-width: 0; }
        .agent-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 6px;
        }
        .agent-card-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
        }
        .agent-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .status-pill {
          padding: 2px 9px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.4px;
        }
        .status-success { background: rgba(16, 185, 129, 0.18); color: #6ee7b7; }
        .status-failed { background: rgba(239, 68, 68, 0.18); color: #fca5a5; }
        .status-running { background: rgba(245, 158, 11, 0.18); color: #fcd34d; }
        .agent-card-time { font-size: 0.75rem; color: var(--text-muted); }
        .agent-card-line {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .agent-card-sub {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-family: 'Courier New', monospace;
        }
        .agent-card-error {
          font-size: 0.8rem;
          color: #fca5a5;
          margin-top: 4px;
        }
      `})]})},cc="http://localhost:8081";function np(e){return`${cc}${e}`}async function Do(e,t){const n=np(e),r=await fetch(n,{headers:{"Content-Type":"application/json"},...t});if(!r.ok){const l=await r.text();throw new Error(`API Error (${r.status}): ${l}`)}return r.json()}async function rp(){const e=`${cc}/actuator/health`;return(await fetch(e)).json()}async function lp(e,t){return Do("/api/v1/assistant/respond",{method:"POST",body:JSON.stringify({message:e,conversation_history:t||[]})})}async function Xs(e){return Do("/api/v1/change-impact/analyze",{method:"POST",body:JSON.stringify({...e,change_type:e.change_type||"enhancement",priority:e.priority||"medium"})})}async function ip(){return Do("/api/v1/change-types")}const Yl=()=>s.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("rect",{x:"3",y:"11",width:"18",height:"10",rx:"2"}),s.jsx("circle",{cx:"12",cy:"5",r:"2"}),s.jsx("path",{d:"M12 7v4"}),s.jsx("line",{x1:"8",y1:"16",x2:"8",y2:"16"}),s.jsx("line",{x1:"16",y1:"16",x2:"16",y2:"16"})]}),op=()=>s.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),s.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),sp=()=>s.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),ap=()=>s.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("circle",{cx:"12",cy:"12",r:"4"}),s.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"})]}),up=()=>s.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})}),cp=()=>s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"}),s.jsx("path",{d:"M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"}),s.jsx("path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"}),s.jsx("path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"})]}),dp=()=>s.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:s.jsx("path",{d:"M5 22h14M5 2h14M5 2v5.5a5.5 5.5 0 0 0 5.5 5.5v0A5.5 5.5 0 0 1 16 18.5V22M19 22v-3.5a5.5 5.5 0 0 0-5.5-5.5v0A5.5 5.5 0 0 1 8 7.5V2"})}),fp={changeTitle:"",targetComponent:"",changeType:"enhancement",fromVersion:"",toVersion:"",environment:"production",requestedBy:"",changeWindow:"",changeDescription:"",priority:"medium"},pp=[{label:"Database Upgrade",data:{changeTitle:"Payment Gateway Database Pool Upgrade",targetComponent:"payment-gateway",changeType:"infrastructure",fromVersion:"50 connections",toVersion:"200 connections",requestedBy:"team-payments",changeWindow:"2026-07-26 02:00 UTC",changeDescription:"Increase the production database connection pool from 50 to 200 to handle peak checkout load."}},{label:"Kafka / Queue Scaling",data:{changeTitle:"Order Service Kafka Consumer Scaling",targetComponent:"order-service",changeType:"infrastructure",fromVersion:"4 partitions",toVersion:"16 partitions",requestedBy:"team-orders",changeWindow:"2026-07-27 22:00 UTC",changeDescription:"Scale the order-service Kafka consumer group to reduce lag during peak order volume."}},{label:"API Contract Change",data:{changeTitle:"Checkout Service API Versioning Update",targetComponent:"checkout-service",changeType:"enhancement",fromVersion:"v1",toVersion:"v2",requestedBy:"team-checkout",changeWindow:"2026-07-28 20:00 UTC",changeDescription:"Roll out checkout-service REST API v2 with backward-compatible fields for downstream consumers."}},{label:"Firewall / Network Change",data:{changeTitle:"Auth Service Network Segmentation Update",targetComponent:"auth-service",changeType:"security",fromVersion:"10.0.0.0/16",toVersion:"10.1.0.0/16",requestedBy:"network.security.team",changeWindow:"2026-07-25 22:00 UTC",changeDescription:"Migrate the auth-service subnet to a new CIDR range with updated firewall ACLs."}}],Zs=[{label:"AI",speed:.18,rotate:-12,top:"4%",left:"6%"},{label:"RAG",speed:-.1,rotate:9,top:"14%",left:"82%"},{label:"RISK",speed:.22,rotate:-6,top:"38%",left:"18%"},{label:"10Y",speed:-.16,rotate:14,top:"48%",left:"70%"},{label:"AGENT",speed:.13,rotate:-18,top:"66%",left:"10%"},{label:"DB",speed:-.12,rotate:7,top:"74%",left:"88%"},{label:"SLA",speed:.19,rotate:-9,top:"90%",left:"45%"}],mp=["Analyze the impact of upgrading the payment gateway database","What happens if we change the checkout service API?","Show me past incidents with the payment service","Tell me about the system architecture"];function hp(e){const t=[e.changeDescription.trim()],n=[];return(e.fromVersion||e.toVersion)&&n.push(`Change: ${e.fromVersion||"current"} -> ${e.toVersion||"target"}`),e.changeWindow&&n.push(`Change window: ${e.changeWindow}`),n.length&&t.push(`(${n.join("; ")})`),t.filter(Boolean).join(" ")}const gp=()=>{const[e,t]=M.useState("dark"),[n,r]=M.useState("chat"),[l,i]=M.useState([{role:"assistant",content:`Hello! I'm the **AI Change Impact Analyzer**. I can help you analyze the impact of proposed system changes, look up past incidents, or answer questions about the architecture.

Try asking me something or use the **Form** mode for detailed analysis.`}]),[o,a]=M.useState(""),[u,d]=M.useState(!1),[h,g]=M.useState(null),[m,w]=M.useState(""),[k,S]=M.useState("overview"),[D,p]=M.useState([]),[c,f]=M.useState(fp),[v,j]=M.useState(mp),[E,_]=M.useState(""),z=M.useRef(null),B=M.useRef(null),L=M.useRef(null),ne=M.useRef(null),Qe=M.useRef(null),nt=M.useRef([]);M.useEffect(()=>{document.documentElement.setAttribute("data-theme",e)},[e]),M.useEffect(()=>{let x=!1;const Y=()=>{const we=window.scrollY,J=window.innerHeight,re=Math.min(Math.max(we/Math.max(J*.9,560),0),1);ne.current&&(ne.current.style.transform=`translate3d(0, ${re*-40}px, 0) scale(${1-re*.22}) rotate(${re*-3}deg)`,ne.current.style.opacity=`${1-re*.95}`,ne.current.style.filter=`blur(${re*10}px)`),Qe.current&&(Qe.current.style.transform=`rotate(${re*40}deg) scale(${1-re*.1})`),nt.current.forEach(($o,dc)=>{if(!$o)return;const Fo=Zs[dc];$o.style.transform=`translate3d(0, ${we*Fo.speed}px, 0) rotate(${Fo.rotate}deg)`}),x=!1},$=()=>{x||(x=!0,requestAnimationFrame(Y))};return Y(),window.addEventListener("scroll",$,{passive:!0}),window.addEventListener("resize",$,{passive:!0}),()=>{window.removeEventListener("scroll",$),window.removeEventListener("resize",$)}},[]);const mn=M.useRef(!0);M.useEffect(()=>{var x;if(mn.current){mn.current=!1;return}(x=z.current)==null||x.scrollIntoView({behavior:"smooth",block:"end"})},[l]),M.useEffect(()=>{hn(),wl()},[]);const wl=async()=>{try{await rp(),_("connected")}catch{_("disconnected")}},hn=async()=>{try{const x=await ip();p(x)}catch{}},$t=M.useCallback(async()=>{const x=o.trim();if(!x||u)return;a(""),j([]);const Y={role:"user",content:x};i($=>[...$,Y]),d(!0);try{const $=l.map(J=>({role:J.role,content:J.content})),we=await lp(x,$);if(we.classification==="change-analysis"){const J=await Xs({change_title:x.substring(0,100),change_description:x,change_type:"enhancement",affected_services:[],priority:"medium"});g(J),w(x.substring(0,120)),S("overview"),r("chat"),i(re=>[...re,{role:"assistant",content:`✅ **Analysis Complete!**

Risk Score: **${Math.round(J.riskScore*100)}/100** (${J.riskLevel.toUpperCase()})

${Gs(J.executiveSummary,300)}

*Use the report tabs below to explore the full analysis.*`}]),setTimeout(()=>{var re;return(re=L.current)==null?void 0:re.scrollIntoView({behavior:"smooth",block:"start"})},100)}else i(J=>[...J,{role:"assistant",content:we.reply}]),we.suggested_actions&&j(we.suggested_actions)}catch($){i(we=>[...we,{role:"assistant",content:`❌ **Error:** ${$.message||"Failed to get response. Please try again."}`}])}finally{d(!1)}},[o,u,l]),N=M.useCallback(async()=>{if(!(!c.changeTitle.trim()||u)){d(!0);try{const x=c.targetComponent.split(",").map($=>$.trim()).filter(Boolean),Y=await Xs({change_title:c.changeTitle,change_description:hp(c),change_type:c.changeType,affected_services:x,priority:c.priority});g(Y),w(c.changeTitle),S("overview"),i($=>[...$,{role:"user",content:`**Form Analysis:** ${c.changeTitle}`},{role:"assistant",content:`✅ **Analysis Complete!**

Risk Score: **${Math.round(Y.riskScore*100)}/100** (${Y.riskLevel.toUpperCase()})

${Gs(Y.executiveSummary,300)}`}]),setTimeout(()=>{var $;return($=L.current)==null?void 0:$.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(x){i(Y=>[...Y,{role:"assistant",content:`❌ **Error:** ${x.message||"Analysis failed."}`}])}finally{d(!1)}}},[c,u]),T=M.useCallback(x=>{a(x)},[]),P=M.useCallback(x=>{f(Y=>({...Y,...x.data}))},[]),H=x=>{x.key==="Enter"&&!x.shiftKey&&(x.preventDefault(),$t())};return s.jsxs("div",{className:"app",children:[s.jsx("div",{className:"watermark-layer","aria-hidden":"true",children:Zs.map((x,Y)=>s.jsx("div",{className:"watermark-item",ref:$=>{nt.current[Y]=$},style:{top:x.top,left:x.left},children:x.label},x.label))}),s.jsx("div",{className:"topnav",children:s.jsxs("div",{className:"container topnav-inner",children:[s.jsxs("div",{className:"brand",children:[s.jsx("div",{className:"brand-mark",children:"DB"}),s.jsxs("div",{className:"brand-text",children:[s.jsx("span",{className:"brand-title",children:"AI Change Impact Analyzer"}),s.jsx("span",{className:"brand-subtitle",children:"Deutsche Bank · 10th Anniversary Hackathon"})]})]}),s.jsxs("div",{className:"topnav-actions",children:[s.jsx("span",{className:"topnav-tag",children:"Agentic AI"}),s.jsx("span",{className:"topnav-tag",children:"RAG"}),s.jsx("span",{className:"topnav-tag topnav-tag-hide-sm",children:"LangGraph"}),s.jsxs("button",{className:"theme-toggle",onClick:()=>t(x=>x==="dark"?"light":"dark"),title:"Toggle light / dark mode",children:[e==="dark"?s.jsx(ap,{}):s.jsx(up,{}),e==="dark"?"Light mode":"Dark mode"]}),s.jsxs("span",{className:"live-badge",children:[s.jsx("span",{className:"live-badge-dot"}),"LIVE"]})]})]})}),s.jsx("header",{className:"hero",children:s.jsxs("div",{className:"container",children:[s.jsxs("div",{className:"hero-promo",ref:ne,children:[s.jsxs("div",{className:"hero-promo-main",children:[s.jsx("span",{className:"hero-promo-kicker",children:"10 YEARS OF TECHNOLOGY, DATA & INNOVATION · DEUTSCHE BANK-WIDE HACKATHON"}),s.jsxs("h1",{className:"hero-promo-title",children:["10 Years. Thousands of Ideas.",s.jsx("br",{}),"One Future."]}),s.jsx("p",{className:"hero-promo-desc",children:"To mark a decade of bank-wide innovation, we built an AI teammate that reads your change request in plain English, runs a full multi-agent risk analysis, and tells you what's about to break — before it does."}),s.jsxs("div",{className:"hero-promo-pills",children:[s.jsx("span",{className:"pill-chip hero-feature-pill",children:"🤖 Real conversational AI"}),s.jsx("span",{className:"pill-chip hero-feature-pill",children:"🕸️ Multi-agent reasoning"}),s.jsx("span",{className:"pill-chip hero-feature-pill",children:"📚 RAG-grounded evidence"})]})]}),s.jsx("div",{className:"hero-orb-wrap",ref:Qe,children:s.jsxs("div",{className:"hero-orb-inner",children:[s.jsx("span",{className:"hero-orb-ring"}),s.jsx("span",{className:"hero-orb-value",children:"7"}),s.jsx("small",{className:"hero-orb-label",children:"AGENTS"})]})})]}),s.jsxs("div",{className:"scroll-hint",children:[s.jsx("span",{children:"Scroll to explore the live report"}),s.jsx("span",{className:"scroll-hint-arrow",children:"↓"})]}),s.jsxs("div",{className:"hero-stats",children:[s.jsxs("div",{className:"hero-stat",children:[s.jsx("span",{className:"hero-stat-value",children:"7"}),s.jsx("span",{className:"hero-stat-label",children:"AI Agents"})]}),s.jsxs("div",{className:"hero-stat",children:[s.jsx("span",{className:"hero-stat-value",children:"19"}),s.jsx("span",{className:"hero-stat-label",children:"Services"})]}),s.jsxs("div",{className:"hero-stat",children:[s.jsx("span",{className:"hero-stat-value",children:"6"}),s.jsx("span",{className:"hero-stat-label",children:"Data Sources"})]}),s.jsxs("div",{className:"hero-stat",children:[s.jsx("span",{className:`hero-stat-dot ${E==="connected"?"connected":"disconnected"}`}),s.jsx("span",{className:"hero-stat-label",children:E==="connected"?"Connected":"Offline"})]})]}),s.jsxs("div",{className:"mode-toggle",children:[s.jsxs("button",{className:`mode-btn ${n==="chat"?"active":""}`,onClick:()=>r("chat"),children:[s.jsx(Yl,{}),"Chat Mode"]}),s.jsxs("button",{className:`mode-btn ${n==="form"?"active":""}`,onClick:()=>r("form"),children:[s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),s.jsx("line",{x1:"3",y1:"9",x2:"21",y2:"9"}),s.jsx("line",{x1:"9",y1:"21",x2:"9",y2:"9"})]}),"Form Mode"]})]})]})}),s.jsxs("main",{className:"main container",children:[n==="chat"&&s.jsxs("div",{className:"chat-section",children:[s.jsxs("div",{className:"chat-messages",children:[l.map((x,Y)=>s.jsxs("div",{className:`message ${x.role}`,children:[s.jsx("div",{className:"message-avatar",children:x.role==="assistant"?s.jsx(Yl,{}):s.jsx(op,{})}),s.jsx("div",{className:"message-bubble",children:s.jsx("div",{className:"message-content",dangerouslySetInnerHTML:{__html:uc(x.content)}})})]},Y)),u&&s.jsxs("div",{className:"message assistant",children:[s.jsx("div",{className:"message-avatar",children:s.jsx(Yl,{})}),s.jsx(Bf,{text:"Analyzing"})]}),s.jsx("div",{ref:z})]}),v.length>0&&!u&&s.jsx("div",{className:"suggestions-area",children:s.jsx(Hf,{suggestions:v,onSelect:T})}),s.jsxs("div",{className:"chat-input-area",children:[s.jsx("textarea",{ref:B,className:"chat-input",placeholder:"Describe a change or ask a question...",value:o,onChange:x=>a(x.target.value),onKeyDown:H,rows:1,disabled:u}),s.jsx("button",{className:"btn btn-primary send-btn",onClick:$t,disabled:u||!o.trim(),title:u?"Analyzing...":"Send",children:u?s.jsx(dp,{}):s.jsx(cp,{})})]})]}),n==="form"&&s.jsx("div",{className:"form-section",children:s.jsxs("div",{className:"card",children:[s.jsx("h2",{className:"form-title",children:"Analyze Change Impact"}),s.jsx("p",{className:"form-desc",children:"Describe your proposed change and let AI agents predict the impact across services."}),s.jsxs("div",{className:"quick-examples",children:[s.jsx("span",{className:"quick-examples-label",children:"QUICK EXAMPLES"}),s.jsx("div",{className:"quick-examples-row",children:pp.map(x=>s.jsx("button",{className:"pill-chip quick-chip",onClick:()=>P(x),children:x.label},x.label))})]}),s.jsxs("div",{className:"form-grid",children:[s.jsxs("div",{className:"form-group full-width",children:[s.jsx("label",{children:"Change Title *"}),s.jsx("input",{type:"text",placeholder:"e.g., Payment Gateway Database Pool Upgrade",value:c.changeTitle,onChange:x=>f({...c,changeTitle:x.target.value})})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Target Component *"}),s.jsx("input",{type:"text",placeholder:"e.g., payment-gateway",value:c.targetComponent,onChange:x=>f({...c,targetComponent:x.target.value})})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Change Type"}),s.jsx("select",{value:c.changeType,onChange:x=>f({...c,changeType:x.target.value}),children:(D.length>0?D.map(x=>({value:x.id,label:x.name})):[{value:"enhancement",label:"Enhancement"},{value:"infrastructure",label:"Infrastructure"},{value:"bugfix",label:"Bug Fix"},{value:"security",label:"Security"},{value:"rollback",label:"Rollback"},{value:"data",label:"Data Update"},{value:"policy",label:"Policy Change"},{value:"research",label:"Research"}]).map(x=>s.jsx("option",{value:x.value,children:x.label},x.value))})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"From Version / Value"}),s.jsx("input",{type:"text",placeholder:"e.g., 19c or 50 connections",value:c.fromVersion,onChange:x=>f({...c,fromVersion:x.target.value})})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"To Version / Value"}),s.jsx("input",{type:"text",placeholder:"e.g., 21c or 200 connections",value:c.toVersion,onChange:x=>f({...c,toVersion:x.target.value})})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Environment"}),s.jsxs("select",{value:c.environment,onChange:x=>f({...c,environment:x.target.value}),children:[s.jsx("option",{value:"production",children:"Production"}),s.jsx("option",{value:"staging",children:"Staging"}),s.jsx("option",{value:"qa",children:"QA"}),s.jsx("option",{value:"development",children:"Development"})]})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Priority"}),s.jsxs("select",{value:c.priority,onChange:x=>f({...c,priority:x.target.value}),children:[s.jsx("option",{value:"low",children:"Low"}),s.jsx("option",{value:"medium",children:"Medium"}),s.jsx("option",{value:"high",children:"High"}),s.jsx("option",{value:"critical",children:"Critical"})]})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Requested By"}),s.jsx("input",{type:"text",placeholder:"e.g., network.security.team",value:c.requestedBy,onChange:x=>f({...c,requestedBy:x.target.value})})]}),s.jsxs("div",{className:"form-group",children:[s.jsx("label",{children:"Change Window"}),s.jsx("input",{type:"text",placeholder:"e.g., 2026-07-25 22:00 UTC",value:c.changeWindow,onChange:x=>f({...c,changeWindow:x.target.value})})]}),s.jsxs("div",{className:"form-group full-width",children:[s.jsx("label",{children:"Description"}),s.jsx("textarea",{placeholder:"Describe the proposed change in detail...",value:c.changeDescription,onChange:x=>f({...c,changeDescription:x.target.value}),rows:4})]})]}),s.jsx("button",{className:"btn btn-primary form-submit",onClick:N,disabled:u||!c.changeTitle.trim(),children:u?s.jsx(s.Fragment,{children:s.jsx("span",{className:"animate-pulse",children:"Analyzing..."})}):s.jsxs(s.Fragment,{children:[s.jsx(sp,{}),"Analyze Impact"]})})]})}),h&&s.jsxs("div",{className:"report-section animate-fadeIn",ref:L,children:[s.jsxs("div",{className:"analysis-hero card",children:[s.jsxs("div",{className:"analysis-hero-main",children:[s.jsxs("span",{className:"analysis-hero-id",children:["Analysis ID: ",h.analysisId]}),s.jsx("h2",{className:"analysis-hero-title",children:m||h.interpretedIntent.substring(0,80)}),s.jsxs("div",{className:"analysis-hero-meta",children:[h.primaryComponent&&s.jsxs("span",{children:["Component: ",s.jsx("strong",{children:h.primaryComponent})]}),h.inferredChangeType&&s.jsxs("span",{children:["Type: ",s.jsx("strong",{children:h.inferredChangeType.toUpperCase()})]}),s.jsxs("span",{children:["Confidence: ",s.jsxs("strong",{children:[(h.confidence*100).toFixed(0),"%"]})]}),s.jsxs("span",{children:["Processed in ",s.jsxs("strong",{children:[h.processingTimeMs,"ms"]})]}),s.jsx("span",{className:`badge ${h.mockMode?"badge-medium":"badge-success"}`,children:h.mockMode?"Mock Mode":"Live AI"})]})]}),s.jsx("div",{className:"analysis-hero-gauge",children:s.jsx(Vf,{score:h.riskScore,level:h.riskLevel,confidence:h.confidence})})]}),s.jsx("div",{className:"report-main",children:s.jsx(Qf,{report:h,activeTab:k,onTabChange:S,requestTitle:m})})]})]}),s.jsx("footer",{className:"footer",children:s.jsxs("div",{className:"container footer-content",children:[s.jsx("p",{children:"AI Change Impact Analyzer v1.0.0"}),s.jsxs("p",{className:"footer-mode",children:[h?s.jsxs(s.Fragment,{children:["Running in ",s.jsx("strong",{children:h.mockMode?"Mock":"Live"})," mode"]}):s.jsxs(s.Fragment,{children:["Backend: ",s.jsx("strong",{children:E==="connected"?"Connected":"Checking..."})]})," · ",s.jsx("a",{href:"https://github.com/org/change-impact-analyzer",target:"_blank",rel:"noopener noreferrer",children:"GitHub"})]})]})}),s.jsx("style",{children:`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ===== Top Nav ===== */
        .topnav {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          background: var(--brand-navy);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .topnav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--brand-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
          flex-shrink: 0;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-weight: 700;
          font-size: 1rem;
          color: #f4f6fb;
        }
        .brand-subtitle {
          font-size: 0.72rem;
          color: #8b96c2;
        }
        .topnav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .topnav-tag {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.12);
          border: 1px solid rgba(96, 165, 250, 0.3);
          color: #93c5fd;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .topnav-tag-hide-sm { display: inline-flex; }
        @media (max-width: 700px) {
          .topnav-tag-hide-sm { display: none; }
        }
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          /* theme toggle transition: background 0.2s ease, transform 0.15s ease */
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .theme-toggle:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }
        .theme-toggle:active {
          transform: translateY(0);
        }

        /* ===== Hero ===== */
        .hero {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          padding: 28px 0 32px;
        }
        .hero-promo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          background: var(--brand-gradient);
          border-radius: var(--radius-lg);
          padding: 36px 40px;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: hidden;
          /* Scroll-driven transform/opacity/filter are updated every animation
             frame via JS — promoting this to its own GPU compositor layer up
             front keeps the motion at a steady high frame rate instead of
             forcing a layout/paint recalculation on every scroll tick. */
          will-change: transform, opacity, filter;
        }
        .hero-promo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12), transparent 55%);
          pointer-events: none;
        }
        .hero-promo-main { position: relative; z-index: 1; max-width: 640px; }
        .hero-promo-kicker {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #bfdbfe;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .hero-promo-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: white;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .hero-promo-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 18px;
        }
        .hero-promo-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-feature-pill {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          color: white;
          cursor: default;
        }
        .hero-feature-pill:hover { transform: none; }
        /* ===== Hero "orb" visual =====
           Outer wrapper (.hero-orb-wrap): scroll-reactive transform only (set via JS ref),
           carries NO css animation so it never fights the JS-driven transform property.
           Inner wrapper (.hero-orb-inner): idle "float" drift + "glowPulse" halo (hero logo pulse).
           Ring (.hero-orb-ring): 24s linear spin (hero inner ring). */
        .hero-orb-wrap {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .hero-orb-inner {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          background: rgba(255,255,255,0.06);
          animation: float 6s ease-in-out infinite, glowPulse 3s ease-in-out infinite;
        }
        .hero-orb-ring {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px dashed rgba(255,255,255,0.45);
          animation: spin 24s linear infinite;
        }
        .hero-orb-value {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1;
          position: relative;
          z-index: 1;
        }
        .hero-orb-label {
          font-size: 0.62rem;
          letter-spacing: 1px;
          color: #dbeafe;
          margin-top: 2px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-promo { flex-direction: column; text-align: center; padding: 28px 24px; }
          .hero-promo-main { max-width: 100%; }
          .hero-promo-pills { justify-content: center; }
        }

        /* ===== Scroll hint ===== */
        .scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin: 14px 0 4px;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .scroll-hint-arrow {
          font-size: 1rem;
          color: var(--primary-light);
          animation: bounceArrow 1.8s ease-in-out infinite;
        }

        /* ===== Background watermark layer =====
           7 faint, scroll-reactive watermark words rendered behind everything. */
        .watermark-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .watermark-item {
          position: absolute;
          font-size: clamp(2.5rem, 8vw, 6rem);
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--text-primary);
          opacity: 0.08;
          white-space: nowrap;
          will-change: transform;
          user-select: none;
          transform: translateZ(0); /* force its own compositor layer for smooth 60fps scroll */
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 24px 0;
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .hero-stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .hero-stat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .hero-stat-dot.connected { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.5); }
        .hero-stat-dot.disconnected { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }

        /* ===== Mode Toggle ===== */
        .mode-toggle {
          display: flex;
          justify-content: center;
          gap: 4px;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid var(--border);
          max-width: 340px;
          margin: 0 auto;
        }
        .mode-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 18px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 9px;
          /* mode button transition: all 0.25s */
          transition: all 0.25s;
          font-family: inherit;
        }
        .mode-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 10px rgba(29, 78, 216, 0.4);
        }
        .mode-btn:hover:not(.active) {
          color: var(--text-primary);
          background: rgba(59, 130, 246, 0.1);
        }

        /* ===== Main ===== */
        .main {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ===== Chat ===== */
        .chat-section {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .message {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }
        .message.user {
          flex-direction: row-reverse;
        }
        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .message.user .message-avatar {
          background: rgba(29, 78, 216, 0.18);
          color: var(--primary-light);
        }
        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          border: 1px solid var(--border);
        }
        .message.user .message-bubble {
          background: rgba(29, 78, 216, 0.12);
          border-color: rgba(29, 78, 216, 0.3);
        }
        .message-content {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }
        .message-content strong {
          color: var(--text-primary);
        }

        .suggestions-area {
          padding: 0 20px 12px;
        }

        .chat-input-area {
          display: flex;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid var(--border);
          background: var(--bg-primary);
        }
        .chat-input {
          flex: 1;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--text-primary);
          font-size: 0.9rem;
          resize: none;
          min-height: 40px;
          max-height: 120px;
          font-family: inherit;
        }
        .chat-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.2);
        }
        .chat-input::placeholder {
          color: var(--text-muted);
        }
        .send-btn {
          padding: 10px 16px;
          border-radius: 10px;
        }

        /* ===== Form ===== */
        .form-section {
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }
        .form-title {
          font-size: 1.3rem;
          margin-bottom: 6px;
        }
        .form-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 18px;
        }
        .quick-examples {
          margin-bottom: 20px;
        }
        .quick-examples-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .quick-examples-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .quick-chip {
          border-color: rgba(29, 78, 216, 0.35);
          color: var(--primary-light);
          background: rgba(29, 78, 216, 0.08);
        }
        .quick-chip:hover {
          background: rgba(29, 78, 216, 0.18);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .form-submit {
          margin-top: 20px;
          width: 100%;
          padding: 13px;
          font-size: 1rem;
        }

        /* ===== Report ===== */
        .report-section {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .analysis-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 20px;
          background: var(--brand-gradient);
          border: none;
        }
        .analysis-hero-main {
          flex: 1;
          min-width: 0;
        }
        .analysis-hero-id {
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
          color: #bfdbfe;
        }
        .analysis-hero-title {
          font-size: 1.4rem;
          color: white;
          margin: 6px 0 12px;
          font-weight: 700;
        }
        .analysis-hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          font-size: 0.82rem;
          color: #dbeafe;
        }
        .analysis-hero-meta strong {
          color: white;
        }
        .analysis-hero-gauge {
          flex-shrink: 0;
          background: rgba(5, 11, 48, 0.35);
          border-radius: var(--radius-md);
          padding: 12px 20px;
        }
        @media (max-width: 768px) {
          .analysis-hero { flex-direction: column; text-align: center; }
          .analysis-hero-meta { justify-content: center; }
        }
        .report-main {
          min-width: 0;
        }

        /* ===== Footer ===== */
        .footer {
          position: relative;
          z-index: 1; /* stack above the fixed .watermark-layer (z-index: 0) */
          padding: 20px 0;
          border-top: 1px solid var(--border);
          margin-top: 40px;
          background: var(--bg-primary);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .footer-mode a {
          color: var(--primary-light);
          text-decoration: none;
        }
        .footer-mode a:hover {
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .footer-content { flex-direction: column; gap: 8px; text-align: center; }
        }

        /* ===== Responsive behavior constraints: max-width 900px ===== */
        @media (max-width: 900px) {
          /* hero panel switches to single-column layout */
          .hero-promo {
            flex-direction: column;
            text-align: center;
            padding: 28px 24px;
          }
          .hero-promo-main { max-width: 100%; }
          /* hero visual appears above text (order -1) */
          .hero-orb-wrap { order: -1; margin-bottom: 8px; }
          /* hero chips and scroll hint centered */
          .hero-promo-pills { justify-content: center; }
          .scroll-hint { align-items: center; text-align: center; margin-left: auto; margin-right: auto; }
          /* top-bar subtitle/meta hidden */
          .brand-subtitle { display: none; }
          .topnav-tag { display: none; }
        }
      `})]})};Gl.createRoot(document.getElementById("root")).render(s.jsx(zc.StrictMode,{children:s.jsx(gp,{})}));
