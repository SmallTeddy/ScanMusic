(function(){"use strict";const Xp=["C","D","E","F","G","A","B"];let cn=0;function ut(e){return cn+=1,`${e}-${Date.now().toString(36)}-${cn}`}function Zp(e,t=0){const r=Math.floor(e/7);return{step:Xp[(e%7+7)%7],octave:r,alter:t}}function Qp(e){return e==="treble"?4*7+2:2*7+4}/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var dr=Object.defineProperty,Yp=Object.getOwnPropertyDescriptor,Jp=Object.getOwnPropertyNames,ec=Object.prototype.hasOwnProperty,tc=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),C=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},gt=(e,t)=>{for(var r in t)dr(e,r,{get:t[r],enumerable:!0})},rc=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Jp(t))!ec.call(e,n)&&n!==r&&dr(e,n,{get:()=>t[n],enumerable:!(i=Yp(t,n))||i.enumerable});return e},Rt=e=>rc(dr({},"__esModule",{value:!0}),e),lt,Be,pr,dt,cr,hn,fn,hr=C(()=>{"use strict";lt=new Map,Be=[],pr=new WeakMap,dt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=lt.get(e);if(i===void 0)lt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=Be.indexOf(e);n!==-1&&Be.splice(n,1);for(let a=0;a<Be.length;a++)if(lt.get(Be[a]).priority<=r){Be.splice(a,0,e);return}Be.push(e)}return}throw new TypeError("not a valid backend")},cr=async e=>{let t=lt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{if(!r){let i=t.backend,n=pr.get(i);t.initPromise=n?n.then(async()=>i.init(e),async()=>i.init(e)):i.init(e),pr.set(i,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},hn=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?Be:r,n,a=[],s=new Set;for(let u of i){let l=await cr(u);typeof l=="string"?a.push({name:u,err:l}):(n||(n=l),n===l&&s.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of a)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let o=t.filter(u=>s.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,l)=>l==="executionProviders"?o:Reflect.get(u,l)})]},fn=async()=>{let e=[];for(let r of Be){if(typeof lt.get(r).backend.createLoraAdapterHandler!="function")continue;let i=await cr(r);if(typeof i!="string")return i;e.push({name:r,err:i})}let t=e.length===0?"":` ERR: ${e.map(r=>`[${r.name}] ${r.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),ic=C(()=>{"use strict";hr()}),mn,nc=C(()=>{"use strict";mn="1.31.1"}),fr,de,gn=C(()=>{"use strict";nc(),fr="warning",de={wasm:{},webgl:{},webgpu:{},versions:{common:mn},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);fr=e}},get logLevel(){return fr}},Object.defineProperty(de,"logLevel",{enumerable:!0})}),te,ac=C(()=>{"use strict";gn(),te=de}),Dt,mr,ve,ye,He,je,gr=C(()=>{"use strict";gn(),Dt=(e,t)=>{(typeof de.trace>"u"?!de.wasm.trace:!de.trace)||console.timeStamp(`${e}::ORT::${t}`)},mr=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(s+=`::${t}`),Dt("CPU",s);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},ve=e=>{(typeof de.trace>"u"?!de.wasm.trace:!de.trace)||mr("BEGIN",e)},ye=e=>{(typeof de.trace>"u"?!de.wasm.trace:!de.trace)||mr("END",e)},He=e=>{(typeof de.trace>"u"?!de.wasm.trace:!de.trace)||console.time(`ORT::${e}`)},je=e=>{(typeof de.trace>"u"?!de.wasm.trace:!de.trace)||console.timeEnd(`ORT::${e}`)}}),yr,yn=C(()=>{"use strict";hr(),gr(),yr=class Hp{constructor(t,r){this.backend=t,this.handler=r}static async create(t){if(ve(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let r=await fn(),i=await r.createLoraAdapterHandler(t);return ye(),new Hp(r,i)}async release(){return this.handler.dispose()}}}),_n,$n,sc=C(()=>{"use strict";_n=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,u,l;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?l=[0,0,0,0]:typeof o.bias=="number"?l=[o.bias,o.bias,o.bias,o.bias]:(l=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(l[3]=o.bias[3]));let d=a*n,p=0,c=d,h=d*2,f=-1;s==="RGBA"?(p=0,c=d,h=d*2,f=d*3):s==="RGB"?(p=0,c=d,h=d*2):s==="RBG"&&(p=0,h=d,c=d*2);for(let y=0;y<a;y++)for(let _=0;_<n;_++){let m=(e.data[p++]-l[0])*u[0],g=(e.data[c++]-l[1])*u[1],$=(e.data[h++]-l[2])*u[2],b=f===-1?255:(e.data[f++]-l[3])*u[3];i.fillStyle="rgba("+m+","+g+","+$+","+b+")",i.fillRect(_,y,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},$n=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let p=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let c=4,h=0,f=1,y=2,_=3,m=0,g=p,$=p*2,b=-1;o==="RGBA"?(m=0,g=p,$=p*2,b=p*3):o==="RGB"?(m=0,g=p,$=p*2):o==="RBG"&&(m=0,$=p,g=p*2),i=r.createImageData(n,a);for(let w=0;w<a*n;h+=c,f+=c,y+=c,_+=c,w++)i.data[h]=(e.data[m++]-d[0])*l[0],i.data[f]=(e.data[g++]-d[1])*l[1],i.data[y]=(e.data[$++]-d[2])*l[2],i.data[_]=b===-1?255:(e.data[b++]-d[3])*l[3]}else throw new Error("Can not access image data");return i}}),Ut,wn,bn,vn,xn,kn,oc=C(()=>{"use strict";$r(),Ut=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",l=r*i,d=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),p=4,c=0,h=1,f=2,y=3,_=0,m=l,g=l*2,$=-1;o==="RGB"&&(p=3,c=0,h=1,f=2,y=-1),u==="RGBA"?$=l*3:u==="RBG"?(_=0,g=l,m=l*2):u==="BGR"&&(g=0,m=l,_=l*2);for(let b=0;b<l;b++,c+=p,f+=p,h+=p,y+=p)d[_++]=(e[c]+s[0])/a[0],d[m++]=(e[h]+s[1])/a[1],d[g++]=(e[f]+s[2])/a[2],$!==-1&&y!==-1&&(d[$++]=(e[y]+s[3])/a[3]);return u==="RGBA"?new _e("float32",d,[1,4,r,i]):new _e("float32",d,[1,3,r,i])},wn=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=d=>typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||d instanceof OffscreenCanvas?d.getContext("2d"):null;if(r){let d=u();d.width=e.width,d.height=e.height;let p=l(d);if(p!=null){let c=e.height,h=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(c=t.resizedHeight,h=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=c,o.width=h}else o.tensorFormat="RGBA",o.height=c,o.width=h;p.drawImage(e,0,0),s=p.getImageData(0,0,h,c).data}else throw new Error("Can not access image data")}else if(i){let d,p;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(d=t.resizedHeight,p=t.resizedWidth):(d=e.height,p=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=d,o.width=p,t!==void 0){let c=u();c.width=p,c.height=d;let h=l(c);if(h!=null)h.putImageData(e,0,0),s=h.getImageData(0,0,p,d).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let d=u();d.width=e.width,d.height=e.height;let p=l(d);if(p!=null){let c=e.height,h=e.width;return p.drawImage(e,0,0,h,c),s=p.getImageData(0,0,h,c).data,o.height=c,o.width=h,Ut(s,o)}else throw new Error("Can not access image data")}else{if(a)return new Promise((d,p)=>{let c=u(),h=l(c);if(!e||!h)return p();let f=new Image;f.crossOrigin="Anonymous",f.src=e,f.onload=()=>{c.width=f.width,c.height=f.height,h.drawImage(f,0,0,c.width,c.height);let y=h.getImageData(0,0,c.width,c.height);o.height=c.height,o.width=c.width,d(Ut(y.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Ut(s,o);throw new Error("Input data provided is not supported - aborted tensor creation")},bn=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new _e({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},vn=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new _e({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},xn=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new _e({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},kn=(e,t,r)=>new _e({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Ke,yt,_r,Sn,uc=C(()=>{"use strict";Ke=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),yt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),_r=!1,Sn=()=>{if(!_r){_r=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Ke.set("int64",BigInt64Array),yt.set(BigInt64Array,"int64")),t&&(Ke.set("uint64",BigUint64Array),yt.set(BigUint64Array,"uint64")),i?(Ke.set("float16",r),yt.set(r,"float16")):Ke.set("float16",Uint16Array)}}}),In,Tn,lc=C(()=>{"use strict";$r(),In=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Tn=(e,t)=>{switch(e.location){case"cpu":return new _e(e.type,e.data,t);case"cpu-pinned":return new _e({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new _e({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new _e({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new _e({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),_e,$r=C(()=>{"use strict";sc(),oc(),uc(),lc(),_e=class{constructor(e,t,r){Sn();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Ke.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let u=Ke.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?s=u.from(t,BigInt):s=u.from(t)}else if(t instanceof u)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",s=e;else if(u==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let u=yt.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,s=e}if(o===void 0)o=[s.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=s,this.dataLocation="cpu"}let a=In(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return wn(e,t)}static fromTexture(e,t){return bn(e,t)}static fromGpuBuffer(e,t){return vn(e,t)}static fromMLTensor(e,t){return xn(e,t)}static fromPinnedBuffer(e,t,r){return kn(e,t,r)}toDataURL(e){return _n(this,e)}toImageData(e){return $n(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Tn(this,e)}}}),xe,zn=C(()=>{"use strict";$r(),xe=_e}),En,dc=C(()=>{"use strict";hr(),yn(),zn(),gr(),En=class jp{constructor(t,r){this.handler=t,this.backend=r}async run(t,r,i){ve(),He("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof xe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof xe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,p=Object.getOwnPropertyNames(r);for(let c of this.outputNames)if(p.indexOf(c)!==-1){let h=r[c];(h===null||h instanceof xe)&&(d=!0,s=!1,n[c]=h)}if(d){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let o;if(a.activeLoraAdapters!==void 0){if(!Array.isArray(a.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");o=a.activeLoraAdapters.map(d=>{if(!(d instanceof yr))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(d.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return d.handler})}let u=await this.handler.run(t,n,a,o),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let p=u[d];p instanceof xe?l[d]=p:l[d]=new xe(p.type,p.data,p.dims)}return je("InferenceSession.run"),ye(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){ve(),He("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let d=t,p=0,c=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(p=r,!Number.isSafeInteger(p))throw new RangeError("'byteOffset' must be an integer.");if(p<0||p>=d.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}).`);if(c=t.byteLength-p,typeof i=="number"){if(c=i,!Number.isSafeInteger(c))throw new RangeError("'byteLength' must be an integer.");if(c<=0||p+c>d.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength-p}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(d,p,c)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await hn(s),l=await o.createInferenceSessionHandler(a,u);return je("InferenceSession.create"),ye(),new jp(l,o)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),wr,pc=C(()=>{"use strict";dc(),wr=En}),Cn,cc=C(()=>{"use strict";yn(),Cn=yr}),hc=C(()=>{"use strict"}),fc=C(()=>{"use strict"}),mc=C(()=>{"use strict"}),gc=C(()=>{"use strict"}),yc={};gt(yc,{InferenceSession:()=>wr,LoraAdapter:()=>Cn,TRACE:()=>Dt,TRACE_EVENT_BEGIN:()=>He,TRACE_EVENT_END:()=>je,TRACE_FUNC_BEGIN:()=>ve,TRACE_FUNC_END:()=>ye,Tensor:()=>xe,env:()=>te,registerBackend:()=>dt});var $e=C(()=>{"use strict";ic(),ac(),pc(),cc(),zn(),hc(),fc(),gr(),mc(),gc()}),br=C(()=>{"use strict"}),Mn={};gt(Mn,{default:()=>An});var vr,xr,An,_c=C(()=>{"use strict";var e;$p(),Xe(),Er(),vr="ort-wasm-proxy-worker",xr=((e=globalThis.self)==null?void 0:e.name)===vr,xr&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Ar(i.wasm).then(()=>{ji(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:a}=i;Ki(a,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=i,a=nr(n);postMessage({type:r,out:a});break}case"create":{let{model:n,options:a}=i;Zi(n,a).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":Qi(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:a,inputs:s,outputIndices:o,options:u}=i;Ji(n,a,s,o,new Array(o.length).fill(null),u).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:l},tn([...s,...l]))},l=>{postMessage({type:r,err:l})});break}case"end-profiling":en(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),An=xr?null:t=>new Worker(t??we,{type:"module",name:vr})}),kr,Bn,On,we,Sr,Nt,Rn,Dn,Ir,Un,Tr,Nn,zr,Pn,Er=C(()=>{"use strict";br(),kr=typeof location>"u"?void 0:location.origin,Bn=self.location.href>"file:"&&self.location.href<"file;",On=()=>{if(Bn){let e=URL;return new URL(new e("ort.min.mjs",self.location.href).href,kr).href}return self.location.href},we=On(),Sr=()=>{if(we&&!we.startsWith("blob:"))return we.substring(0,we.lastIndexOf("/")+1)},Nt=(e,t)=>{try{let r=t??we;return(r?new URL(e,r):new URL(e)).origin===kr}catch{return!1}},Rn=(e,t)=>{let r=t??we;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Dn=(e,t)=>`${t??"./"}${e}`,Ir=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Un=async e=>(await import(e)).default,Tr=(_c(),Rt(Mn)).default,Nn=async()=>{if(!we)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Nt(we))return[void 0,Tr()];let e=await Ir(we);return[e,Tr(e)]},zr=void 0,Pn=async(e,t,r,i)=>{let n=zr&&!(e||t);if(n)if(we)n=Nt(we)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,zr];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??Rn(a,t),o=r&&s&&!Nt(s,t),u=o?await Ir(s):s??Dn(a,t);return[o?u:void 0,await Un(u)]}}}),Cr,Pt,_t,Mr,qn,Ln,Vn,Ar,ee,Xe=C(()=>{"use strict";Er(),Pt=!1,_t=!1,Mr=!1,qn=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Ln=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Vn=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Ar=async e=>{if(Pt)return Promise.resolve();if(_t)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Mr)throw new Error("previous call to 'initializeWebAssembly()' failed.");_t=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Vn())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Ln())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=qn();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,o=(s==null?void 0:s.href)??s,u=n==null?void 0:n.wasm,l=(u==null?void 0:u.href)??u,d=e.wasmBinary,[p,c]=await Pn(o,a,r>1,!!d||!!l),h=!1,f=[];if(t>0&&f.push(new Promise(y=>{setTimeout(()=>{h=!0,y()},t)})),f.push(new Promise((y,_)=>{let m={numThreads:r};if(d)m.wasmBinary=d,m.locateFile=g=>g;else if(l||a)m.locateFile=g=>l??a+g;else if(o&&o.indexOf("blob:")!==0)m.locateFile=g=>new URL(g,o).href;else if(p){let g=Sr();g&&(m.locateFile=$=>g+$)}c(m).then(g=>{_t=!1,Pt=!0,Cr=g,y(),p&&URL.revokeObjectURL(p)},g=>{_t=!1,Mr=!0,_(g)})})),await Promise.race(f),h)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ee=()=>{if(Pt&&Cr)return Cr;throw new Error("WebAssembly is not initialized yet.")}}),ke,qt,Q,Br=C(()=>{"use strict";Xe(),ke=(e,t)=>{let r=ee(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},qt=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")qt(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Q=e=>{let t=ee(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),o=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),Gn,$c=C(()=>{"use strict";Xe(),Br(),Gn=(e,t)=>{let r=ee(),i=0,n=[],a=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(a.terminate=!1);let s=0;(e==null?void 0:e.tag)!==void 0&&(s=ke(e.tag,n)),i=r._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,s),i===0&&Q("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&qt(e.extra,"",new WeakSet,(o,u)=>{let l=ke(o,n),d=ke(u,n);r._OrtAddRunConfigEntry(i,l,d)!==0&&Q(`Can't set a run config entry: ${o} - ${u}.`)});for(let o of t)r._OrtRunOptionsAddActiveLoraAdapter(i,o)!==0&&Q("Can't add an active LoRA adapter.");return[i,n]}catch(s){throw i!==0&&r._OrtReleaseRunOptions(i),n.forEach(o=>r._free(o)),s}}}),Wn,Fn,Hn,Ze,jn,Kn,wc=C(()=>{"use strict";Xe(),Br(),Wn=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Fn=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Hn=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Ze=(e,t,r,i)=>{let n=ke(t,i),a=ke(r,i);ee()._OrtAddSessionConfigEntry(e,n,a)!==0&&Q(`Can't set a session config entry: ${t} - ${r}.`)},jn=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[],o;switch(a){case"webnn":if(a="WEBNN",Ze(e,"session.disable_quant_qdq","1",r),Ze(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let c=n==null?void 0:n.deviceType;c&&Ze(e,"deviceType",c,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let c=n;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);Ze(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let u=s.length,l=0,d=0;if(u>0){l=ee()._malloc(u*ee().PTR_SIZE),r.push(l),d=ee()._malloc(u*ee().PTR_SIZE),r.push(d);for(let c=0;c<u;c++)ee().setValue(l+c*ee().PTR_SIZE,s[c][0],"*"),ee().setValue(d+c*ee().PTR_SIZE,s[c][1],"*")}let p;if(o===void 0){let c=ke(a,r);p=await ee()._OrtAppendExecutionProvider(e,c,l,d,u)}p!==0&&Q(`Can't append execution provider: ${a}.`)}},Kn=async e=>{let t=ee(),r=0,i=[],n=e||{};Hn(n);try{let a=Wn(n.graphOptimizationLevel??"all"),s=Fn(n.executionMode??"sequential"),o=typeof n.logId=="string"?ke(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let l=n.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let d=typeof n.optimizedModelFilePath=="string"?ke(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,o,u,l,d),r===0&&Q("Can't create session options."),n.executionProviders&&await jn(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);Ze(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[p,c]of Object.entries(n.freeDimensionOverrides)){if(typeof p!="string")throw new Error(`free dimension override name must be a string: ${p}`);if(typeof c!="number"||!Number.isInteger(c)||c<0)throw new Error(`free dimension override value must be a non-negative integer: ${c}`);let h=ke(p,i);t._OrtAddFreeDimensionOverride(r,h,c)!==0&&Q(`Can't set a free dimension override: ${p} - ${c}.`)}return n.extra!==void 0&&qt(n.extra,"",new WeakSet,(p,c)=>{Ze(r,p,c,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Q("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Qe,Oe,Ye,Lt,Vt,Or,Rr,Dr,G=C(()=>{"use strict";Qe=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Oe=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ye=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},Lt=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Vt=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Or=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Rr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Dr=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Gt,Ur=C(()=>{"use strict";br(),Gt=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let s=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let l=u.byteLength;new Uint8Array(a,s,l).set(u),s+=l}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Xn,Zn,Qn,Yn,Nr,Jn,Z,Re=C(()=>{"use strict";G(),Xn=["V","I","W","E","F"],Zn=(e,t)=>{console.log(`[${Xn[e]},${new Date().toISOString()}]${t}`)},Nr=(e,t)=>{Qn=e,Yn=t},Jn=(e,t)=>{let r=Vt(e),i=Vt(Qn);r>=i&&Zn(r,typeof t=="function"?t():t)},Z=(...e)=>{Yn&&Jn(...e)}}),ea,pt,T,Wt,ta,ra,ia,j=C(()=>{"use strict";ea=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},pt=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let o=ea.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[s[a-2],s[a-1]]=o}for(let o=r?3:1;o<=a;o++){let u=i-o<0?1:e[i-o],l=n-o<0?1:t[n-o];if(u!==l&&u>1&&l>1)return;let d=Math.max(u,l);if(u&&l)s[a-o]=Math.max(u,l);else{if(d>1)return;s[a-o]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},T=class lr{static size(t){return lr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return lr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return lr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},Wt=class Fe{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<a.length){if(a[o]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let o=0;o<i.length*2;o++)if(o<s.length){if(s[o]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[o]>=i[o]||s[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,o){if(o){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)Fe.adjustPadAndReturnShape(t[u+(s?1:2)],r[u],i[u],n[u],a,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,a,s,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return Fe.computeShapeHelper(t,r,l,i,n,a,s,o,u),l}static computeConvOutputShape(t,r,i,n,a,s,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return Fe.computeShapeHelper(!1,t,u,i,n,a,s,o),u}static computeShapeHelper(t,r,i,n,a,s,o,u,l=0){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(Fe.adjustPadAndReturnShape(r[d+2],n[d],a[d],s[d],o,d,d+r.length-2,u,l))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,o,u,l=0){let d=i*(n-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return a[s]=0,a[o]=0,Fe.computeOutputSize(t-d,r,t,0,l);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(u==="SAME_LOWER"?(p+1)/2:p/2),a[o]=p-a[s],Fe.computeOutputSize(t+a[s]+a[o]-d,r,t,a[s],l)}default:throw new Error("Unsupported AutoPad type")}else return Fe.computeOutputSize(t+a[s]+a[o]-d,r,t,a[s],l)}},ta=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,o;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==s)throw new Error("dimension mismatch");if(a<=0||o<=0||s<=0)throw new Error("invalid shape specified");if(n&&!pt.isValidBroadcast(n,[a,o]))throw new Error("gemm: invalid bias shape for broadcast");return[a,o,s]}},ra=-34028234663852886e22,ia=34028234663852886e22}),Pr,na=C(()=>{"use strict";G(),Pr=(e,t)=>new(Lt(t))(e)}),qr,aa,Lr,sa,Vr,oa,Gr,Wr,Fr,ua,la,bc=C(()=>{"use strict";G(),Re(),qr=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),aa=(e,t)=>{if(t==="int32")return e;let r=qr.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(Lt(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let o=0;o<n;o++){let u=a[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[o]=Number(u)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Lr=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},sa=1,Vr=()=>sa++,oa=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Gr=(e,t)=>{let r=qr.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},Wr=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Gr(this.dataType,this.tensorShape)}destroy(){Z("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Lr(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},Fr=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!(a!=null&&a.input.dataTypes.includes(t))){if(s=oa.get(t),!s||!(a!=null&&a.input.dataTypes.includes(s)))throw new Error(`WebNN backend does not support data type: ${t}`);Z("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==Gr(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=aa(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else Z("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?Lr(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},ua=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Vr();return this.tensorTrackersById.set(e,new Fr(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){Z("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){Z("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=Vr(),s=new Wr({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new Fr(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let o=this.getMLContext(e);for(let[l,d]of this.freeTensors.entries())if(d.canReuseTensor(o,t,r)){Z("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let p=this.freeTensors.splice(l,1)[0];return p.sessionId=e,p}Z("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new Wr({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},la=(...e)=>new ua(...e)}),$t,da,pa,vc=C(()=>{"use strict";G(),Xe(),na(),bc(),Re(),$t=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),da=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},pa=class{constructor(e){this.tensorManager=la(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Nr(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){Z("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){Z("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)Z("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>da(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){Z("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=$t.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){Z("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=$t.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!ee().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");Z("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Pr(r,t)}}registerMLTensor(e,t,r,i){let n=$t.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return Z("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=$t.get(Qe(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),Hr=C(()=>{"use strict"}),jr,Ft,Ht,ca,ha,Kr,Xr,fa,ma,xc=C(()=>{"use strict";Re(),Hr(),jr=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Ft=[],Ht=e=>Math.ceil(Number(e)/16)*16,ca=e=>{for(let t=0;t<Ft.length;t++){let r=Ft[t];if(e<=r)return r}return Math.ceil(e/16)*16},ha=1,Kr=()=>ha++,Xr=async(e,t,r,i)=>{let n=Ht(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let o=a.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{a.destroy()}},fa=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of jr)Ft.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=Ht(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(a);o.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,o,0,a)}Z("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Ht(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return Z("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Kr();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),Z("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),Z("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=ca(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Kr(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),Z("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return Z("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Xr(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=jr.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(Z("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},ma=(...e)=>new fa(...e)}),ga,J,ae=C(()=>{"use strict";ga=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},J=e=>new ga(e)}),ct,jt,ue,le,q,se,Zr,ht,Pe,P,wt,z,D,ya,Qr,_a,$a,K=C(()=>{"use strict";G(),j(),ct=64,jt=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ue=(e,t=1)=>{let r=jt(e,t);return typeof r=="string"?r:r[0]},le=(e,t=1)=>{let r=jt(e,t);return typeof r=="string"?r:r[1]},q=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:T.computeStrides(r)})}),t},se=e=>e%4===0?4:e%2===0?2:1,Zr=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,ht=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Pe=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,P=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,wt=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,o=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=jt(t,n),d=typeof l=="string"?l:l[1],p=typeof l=="string"?l:l[0],c={indices:u,value:d,storage:p,tensor:t},h=I=>typeof I=="string"?I:`${I}u`,f={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},y=a?"uniforms.":"",_=`${y}${e}_shape`,m=`${y}${e}_strides`,g="";for(let I=0;I<s-1;I++)g+=`
    let dim${I} = current / ${P(m,I,s)};
    let rest${I} = current % ${P(m,I,s)};
    indices[${I}] = dim${I};
    current = rest${I};
    `;g+=`indices[${s-1}] = current;`;let $=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${c.indices} {
    var indices: ${c.indices};
    var current = offset;
    ${g}
    return indices;
  }`,b=I=>(f.offsetToIndices=!0,s<2?I:`o2i_${e}(${I})`),w=[];if(s>=2)for(let I=s-1;I>=0;I--)w.push(`${P(m,I,s)} * (indices[${I}])`);let x=s<2?"":`
  fn i2o_${e}(indices: ${c.indices}) -> u32 {
    return ${w.join("+")};
  }`,v=I=>(f.indicesToOffset=!0,s<2?I:`i2o_${e}(${I})`),k=(...I)=>s===0?"0u":`${c.indices}(${I.map(h).join(",")})`,S=(I,N)=>s<2?`${I}`:`${P(I,N,s)}`,E=(I,N,L)=>s<2?`${I}=${L};`:`${P(I,N,s)}=${L};`,R={},O=(I,N)=>{f.broadcastedIndicesToOffset=!0;let L=`${N.name}broadcastedIndicesTo${e}Offset`;if(L in R)return`${L}(${I})`;let A=[];for(let re=s-1;re>=0;re--){let ne=N.indicesGet("outputIndices",re+N.rank-s);A.push(`${S(m,re)} * (${ne} % ${S(_,re)})`)}return R[L]=`fn ${L}(outputIndices: ${N.type.indices}) -> u32 {
             return ${A.length>0?A.join("+"):"0u"};
           }`,`${L}(${I})`},B=(I,N)=>(()=>{if(c.storage===c.value)return`${e}[${I}]=${N};`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`${e}[${I}]=vec2<u32>(u32(${N}), select(0u, 0xFFFFFFFFu, ${N} < 0));`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`${e}[${I}]=vec2<u32>(u32(${N}), 0u);`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`${e}[${I}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${N}));`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),F=I=>(()=>{if(c.storage===c.value)return`${e}[${I}]`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`i32(${e}[${I}].x)`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`u32(${e}[${I}].x)`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${I}] & 0xFFu), bool(${e}[${I}] & 0xFF00u), bool(${e}[${I}] & 0xFF0000u), bool(${e}[${I}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),X=s<2?"":`
  fn get_${e}ByIndices(indices: ${c.indices}) -> ${d} {
    return ${F(`i2o_${e}(indices)`)};
  }`,V=s<2?"":(()=>{let I=o.map(L=>`d${L}: u32`).join(", "),N=o.map(L=>`d${L}`).join(", ");return`
  fn get_${e}(${I}) -> ${d} {
    return get_${e}ByIndices(${k(N)});
  }`})(),M=(...I)=>{if(I.length!==s)throw new Error(`indices length must be ${s}`);let N=I.map(h).join(",");return s===0?F("0u"):s===1?F(N[0]):(f.get=!0,f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}(${N})`)},W=I=>s<2?F(I):(f.getByIndices=!0,f.indicesToOffset=!0,`get_${e}ByIndices(${I})`),U=s<2?"":`
  fn set_${e}ByIndices(indices: ${c.indices}, value: ${d}) {
    ${B(`i2o_${e}(indices)`,"value")}
  }`,H=s<2?"":(()=>{let I=o.map(L=>`d${L}: u32`).join(", "),N=o.map(L=>`d${L}`).join(", ");return`
  fn set_${e}(${I}, value: ${d}) {
    set_${e}ByIndices(${k(N)}, value);
  }`})();return{impl:()=>{let I=[],N=!1;return f.offsetToIndices&&(I.push($),N=!0),f.indicesToOffset&&(I.push(x),N=!0),f.broadcastedIndicesToOffset&&(Object.values(R).forEach(L=>I.push(L)),N=!0),f.set&&(I.push(H),N=!0),f.setByIndices&&(I.push(U),N=!0),f.get&&(I.push(V),N=!0),f.getByIndices&&(I.push(X),N=!0),!a&&N&&I.unshift(`const ${_} = ${c.indices}(${r.join(",")});`,`const ${m} = ${c.indices}(${T.computeStrides(r).join(",")});`),I.join(`
`)},type:c,offsetToIndices:b,indicesToOffset:v,broadcastedIndicesToOffset:O,indices:k,indicesGet:S,indicesSet:E,set:(...I)=>{if(I.length!==s+1)throw new Error(`indices length must be ${s}`);let N=I[s];if(typeof N!="string")throw new Error("value must be string");let L=I.slice(0,s).map(h).join(",");return s===0?B("0u",N):s===1?B(L[0],N):(f.set=!0,f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}(${L}, ${N})`)},setByOffset:B,setByIndices:(I,N)=>s<2?B(I,N):(f.setByIndices=!0,f.indicesToOffset=!0,`set_${e}ByIndices(${I}, ${N});`),get:M,getByOffset:F,getByIndices:W,usage:i,name:e,strides:m,shape:_,rank:s}},z=(e,t,r,i=1)=>wt(e,t,r,"input",i),D=(e,t,r,i=1)=>wt(e,t,r,"output",i),ya=(e,t,r)=>wt(e,t,r,"atomicOutput",1),Qr=(e,t,r,i=1)=>wt(e,t,r,"internal",i),_a=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=ct){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},$a=(e,t)=>new _a(e,t)}),wa,Yr,ba,va,xa,ka,be,Sa,Ia,qe=C(()=>{"use strict";G(),j(),ae(),K(),wa=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Yr=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),ba=(e,t)=>T.sortBasedOnPerm(e,Yr(e.length,t)),va=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},xa=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},ka=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},be=(e,t)=>{let r=e.dataType,i=e.dims.length,n=Yr(i,t),a=ba(e.dims,n),s=e.dims,o=a,u=i<2||ka(n,e.dims),l;if(u)return l=f=>{let y=z("input",r,s,4),_=D("output",r,o,4);return`
  ${f.registerUniform("output_size","u32").declareVariables(y,_)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let f=T.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(f/4)}]}},getShaderSource:l};let{newShape:d,newPerm:p}=xa(e.dims,n),c=T.areEqual(p,[2,3,1]),h=T.areEqual(p,[3,1,2]);if(d.length===2||c||h){s=c?[d[0],d[1]*d[2]]:h?[d[0]*d[1],d[2]]:d,o=[s[1],s[0]];let f=16;return l=y=>{let _=z("a",r,s.length),m=D("output",r,o.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(_,m)}
  var<workgroup> tile : array<array<${m.type.value}, ${f+1}>, ${f}>;
  ${y.mainStart([f,f,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${f} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${f}u + local_id.x;
    let input_row = workgroup_id_x * ${f}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${_.getByIndices(`${_.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${f}u + local_id.x;
    let output_row = workgroup_id_y * ${f}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${m.setByIndices(`${m.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=T.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/f),y:Math.ceil(o[0]/f)},programUniforms:[{type:12,data:y},...q(s,o)]}},getShaderSource:l}}return l=f=>{let y=z("a",r,s.length),_=D("output",r,o.length);return`
  ${f.registerUniform("output_size","u32").declareVariables(y,_)}

  ${va(n,i,y,_)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let f=T.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...q(s,o)]}},getShaderSource:l}},Sa=(e,t)=>{wa(e.inputs,t.perm),e.compute(be(e.inputs[0],t.perm))},Ia=e=>J({perm:e.perm})}),Ta,za,Ea,Ca,Ma,Aa,Ba,Oa,Ra,Da,Se,Ua,Na,Pa,qa,La,Va,Ga,Wa,Fa,Ha,kc=C(()=>{"use strict";G(),j(),K(),ei(),qe(),Ta={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},za={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Ea={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Ca={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Ma=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Aa=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},Ba=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},Oa=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Ra=(e,t)=>{let r=[];if(!Oa(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Da=(e,t,r,i,n,a,s)=>{let o=r[0].dims,u=T.size(a),l=T.size(s),d=z("_A",r[0].dataType,o),p=D("output",n,a),c=64;u===1&&(c=256);let h=`
          var<workgroup> aBestValues : array<f32, ${c}>;
       `,f=y=>`
        ${y.registerUniform("reduceSize","u32").declareVariables(d,p)}
        ${h}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${y.mainStart(c)}

          let outputIndex = global_idx / ${c};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Ea[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${c}) {
           let candidate = f32(${d.getByOffset("offset + k")});
           bestValue = ${Ta[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${c}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${za[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${p.setByOffset("outputIndex",`${i==="mean"?`${p.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${p.type.storage}(${Ca[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${c}`,inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},Se=(e,t,r,i)=>{let n=e.inputs.length===1?r:Jr(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((h,f)=>f));let s=T.normalizeAxes(a,e.inputs[0].dims.length),o=s,u=e.inputs[0],l=Ra(o,e.inputs[0].dims.length);l.length>0&&(u=e.compute(be(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],o=Ma(o.length,u.dims.length));let[d,p]=Aa(u.dims,o),c=d;n.keepDims&&(c=Ba(d,s)),e.compute(Da(t,n.cacheKey,[u],i,e.inputs[0].dataType,c,p),{inputs:[u]})},Ua=(e,t)=>{Se(e,"ReduceMeanShared",t,"mean")},Na=(e,t)=>{Se(e,"ReduceL1Shared",t,"l1")},Pa=(e,t)=>{Se(e,"ReduceL2Shared",t,"l2")},qa=(e,t)=>{Se(e,"ReduceLogSumExpShared",t,"logSumExp")},La=(e,t)=>{Se(e,"ReduceMaxShared",t,"max")},Va=(e,t)=>{Se(e,"ReduceMinShared",t,"min")},Ga=(e,t)=>{Se(e,"ReduceProdShared",t,"prod")},Wa=(e,t)=>{Se(e,"ReduceSumShared",t,"sum")},Fa=(e,t)=>{Se(e,"ReduceSumSquareShared",t,"sumSquare")},Ha=(e,t)=>{Se(e,"ReduceLogSumShared",t,"logSum")}}),Ie,ja,Kt,Jr,Te,Ka,Xa,Za,Qa,Ya,Ja,es,ts,rs,is,ze,ns,as,ss,os,us,ls,ds,ps,cs,hs,ei=C(()=>{"use strict";G(),j(),ae(),K(),kc(),Ie=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},ja=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Kt=(e,t,r,i,n,a,s=!1,o=!1)=>{let u=[],l=r[0].dims,d=l.length,p=T.normalizeAxes(n,d),c=!o&&p.length===0;l.forEach((y,_)=>{c||p.indexOf(_)>=0?s&&u.push(1):u.push(y)});let h=u.length,f=T.size(u);return{name:e,shaderCache:t,getShaderSource:y=>{let _=[],m=z("_A",r[0].dataType,d),g=D("output",a,h),$=i(m,g,p),b=$[2];for(let w=0,x=0;w<d;w++)c||p.indexOf(w)>=0?(s&&x++,b=`for(var j${w}: u32 = 0; j${w} < ${l[w]}; j${w}++) {
                  ${$[2].includes("last_index")?`let last_index = j${w};`:""}
                  ${m.indicesSet("input_indices",w,`j${w}`)}
                  ${b}
                }`):(_.push(`${m.indicesSet("input_indices",w,g.indicesGet("output_indices",x))};`),x++);return`

        ${y.registerUniform("output_size","u32").declareVariables(m,g)}

        ${y.mainStart()}
          ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${m.type.indices};
          let output_indices = ${g.offsetToIndices("global_idx")};

          ${_.join(`
`)}
          ${$[0]}       // init ops for reduce max/min
          ${$[1]}
          ${b}
          ${$[3]}
          ${$.length===4?g.setByOffset("global_idx","value"):$.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:a}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...q(l,u)]})}},Jr=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),J({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Te=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:Jr(n,r);e.compute(Kt(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?ja:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Ka=(e,t)=>{Ie(e.inputs),Te(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Xa=(e,t)=>{Ie(e.inputs),Te(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Za=(e,t)=>{Ie(e.inputs),Te(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Qa=(e,t)=>{Ie(e.inputs),Te(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Ya=(e,t)=>{Ie(e.inputs),Te(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Ja=(e,t)=>{Ie(e.inputs),Te(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},es=(e,t)=>{Ie(e.inputs),Te(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},ts=(e,t)=>{Ie(e.inputs),Te(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},rs=(e,t)=>{Ie(e.inputs),Te(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},is=(e,t)=>{Ie(e.inputs),Te(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},ze=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},ns=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ja(e,t):Ua(e,t)},as=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xa(e,t):Na(e,t)},ss=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Za(e,t):Pa(e,t)},os=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qa(e,t):qa(e,t)},us=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ya(e,t):La(e,t)},ls=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?es(e,t):Va(e,t)},ds=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ts(e,t):Ga(e,t)},ps=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?rs(e,t):Wa(e,t)},cs=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?is(e,t):Fa(e,t)},hs=(e,t)=>{ze(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ka(e,t):Ha(e,t)}}),ti,fs,ms,ri,Sc=C(()=>{"use strict";G(),ae(),ei(),ti=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},fs=(e,t)=>{ti(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Kt("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ms=(e,t)=>{ti(e.inputs);let r=(i,n,a)=>{let s=[];for(let o=0;o<i.rank;o++)(a.indexOf(o)>=0||a.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Kt("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ri=e=>J(e)}),gs,Xt,ys,_s,$s,bt,ws,bs,ii=C(()=>{"use strict";G(),j(),Hr(),K(),gs=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],o=e[5];if(s&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],l=r.dims[1],d=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==d)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let p=n.dims[0]/3,c=p,h=c;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let $ of t.qkvHiddenSizes)if($%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");p=t.qkvHiddenSizes[0],c=t.qkvHiddenSizes[1],h=t.qkvHiddenSizes[2]}let f=l;if(p!==c)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==p+c+h)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let y=0;if(s){if(c!==h)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==c/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(y=s.dims[3])}let _=f+y,m=-1,g=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==l||o.dims[3]!==_)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:l,pastSequenceLength:y,kvSequenceLength:f,totalSequenceLength:_,maxSequenceLength:m,inputHiddenSize:d,hiddenSize:p,vHiddenSize:h,headSize:Math.floor(p/t.numHeads),vHeadSize:Math.floor(h/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:g,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Xt=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,ys=(e,t,r,i,n,a,s,o)=>{let u=se(s?1:a),l=64,d=a/u;d<l&&(l=32);let p=Math.ceil(a/u/l),c=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:d},{type:12,data:p}],h=ue(e.dataType,u),f=le(1,u),y=["type"];s&&y.push("type"),o&&y.push("type");let _=m=>{let g=D("x",e.dataType,e.dims,u),$=[g],b=s?z("seq_lens",s.dataType,s.dims):void 0;b&&$.push(b);let w=o?z("total_sequence_length_input",o.dataType,o.dims):void 0;w&&$.push(w);let x=le(e.dataType),v=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${m.registerUniforms(v).declareVariables(...$)}
  ${m.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Xt(b,w,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${f}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${g.type.value}(${x}(1.0) / ${x}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${g.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${g.type.value}(${x}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${h};${u}`,inputDependencies:y},getShaderSource:_,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:c})}},_s=(e,t,r,i,n,a,s,o,u)=>{let l=s+a.kvSequenceLength,d=[a.batchSize,a.numHeads,a.sequenceLength,l],p=e>1&&i,c=a.kvNumHeads?a.kvNumHeads:a.numHeads,h=p?[a.batchSize,c,l,a.headSize]:void 0,f=a.nReps?a.nReps:1,y=a.scale===0?1/Math.sqrt(a.headSize):a.scale,_=se(a.headSize),m=a.headSize/_,g=12,$={x:Math.ceil(l/g),y:Math.ceil(a.sequenceLength/g),z:a.batchSize*a.numHeads},b=[{type:12,data:a.sequenceLength},{type:12,data:m},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:y},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:f}],w=p&&i&&T.size(i.dims)>0,x=["type","type"];w&&x.push("type"),n&&x.push("type"),o&&x.push("type"),u&&x.push("type");let v=[{dims:d,dataType:t.dataType,gpuDataType:0}];p&&v.push({dims:h,dataType:t.dataType,gpuDataType:0});let k=S=>{let E=z("q",t.dataType,t.dims,_),R=z("key",r.dataType,r.dims,_),O=[E,R];if(w){let U=z("past_key",i.dataType,i.dims,_);O.push(U)}n&&O.push(z("attention_bias",n.dataType,n.dims));let B=o?z("seq_lens",o.dataType,o.dims):void 0;B&&O.push(B);let F=u?z("total_sequence_length_input",u.dataType,u.dims):void 0;F&&O.push(F);let X=D("output",t.dataType,d),V=[X];p&&V.push(D("present_key",t.dataType,h,_));let M=le(1,_),W=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${g}u;

  var<workgroup> tileQ: array<${E.type.storage}, ${g*g}>;
  var<workgroup> tileK: array<${E.type.storage}, ${g*g}>;
  ${S.registerUniforms(W).declareVariables(...O,...V)}
  ${S.mainStart([g,g,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${f===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${f===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Xt(B,F,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${w&&p?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${p?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${M}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${w&&p?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${p?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${M}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(_){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${_}`)}})()};
        output[outputIdx] = ${X.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${_};${n!==void 0};${i!==void 0};${e}`,inputDependencies:x},getRunData:()=>({outputs:v,dispatchGroup:$,programUniforms:b}),getShaderSource:k}},$s=(e,t,r,i,n,a,s=void 0,o=void 0)=>{let u=a+n.kvSequenceLength,l=n.nReps?n.nReps:1,d=n.vHiddenSize*l,p=e>1&&i,c=n.kvNumHeads?n.kvNumHeads:n.numHeads,h=p?[n.batchSize,c,u,n.headSize]:void 0,f=[n.batchSize,n.sequenceLength,d],y=12,_={x:Math.ceil(n.vHeadSize/y),y:Math.ceil(n.sequenceLength/y),z:n.batchSize*n.numHeads},m=[{type:12,data:n.sequenceLength},{type:12,data:u},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:d},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:l}],g=p&&i&&T.size(i.dims)>0,$=["type","type"];g&&$.push("type"),s&&$.push("type"),o&&$.push("type");let b=[{dims:f,dataType:t.dataType,gpuDataType:0}];p&&b.push({dims:h,dataType:t.dataType,gpuDataType:0});let w=x=>{let v=z("probs",t.dataType,t.dims),k=z("v",r.dataType,r.dims),S=[v,k];g&&S.push(z("past_value",i.dataType,i.dims));let E=s?z("seq_lens",s.dataType,s.dims):void 0;s&&S.push(E);let R=o?z("total_sequence_length_input",o.dataType,o.dims):void 0;o&&S.push(R);let O=[D("output",t.dataType,f)];p&&O.push(D("present_value",t.dataType,h));let B=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${y}u;
  var<workgroup> tileQ: array<${v.type.value}, ${y*y}>;
  var<workgroup> tileV: array<${v.type.value}, ${y*y}>;
  ${x.registerUniforms(B).declareVariables(...S,...O)}
  ${x.mainStart([y,y,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Xt(E,R,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${g&&p?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${p?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${v.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${g&&p?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${p?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:$},getRunData:()=>({outputs:b,dispatchGroup:_,programUniforms:m}),getShaderSource:w}},bt=(e,t,r,i,n,a,s,o,u,l,d=void 0,p=void 0)=>{let c=Math.min(e.outputCount,1+(s?1:0)+(o?1:0)),h=c>1?s:void 0,f=c>1?o:void 0,y=c>1?l.pastSequenceLength:0,_=y+l.kvSequenceLength,m=u&&T.size(u.dims)>0?u:void 0,g=[t,r];h&&T.size(h.dims)>0&&g.push(h),m&&g.push(m),d&&g.push(d),p&&g.push(p);let $=e.compute(_s(c,t,r,h,m,l,y,d,p),{inputs:g,outputs:c>1?[-1,1]:[-1]})[0];e.compute(ys($,l.batchSize,l.numHeads,y,l.sequenceLength,_,d,p),{inputs:d&&p?[$,d,p]:[$],outputs:[]});let b=[$,i];f&&T.size(f.dims)>0&&b.push(f),d&&b.push(d),p&&b.push(p),e.compute($s(c,$,i,f,l,y,d,p),{inputs:b,outputs:c>1?[0,2]:[0]})},ws=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,o={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],l=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],d=p=>{let c=D("output_q",u[0].dataType,r),h=D("output_k",u[0].dataType,r),f=D("output_v",u[0].dataType,r),y=z("input",u[0].dataType,u[0].dims),_=z("weight",u[1].dataType,u[1].dims),m=z("bias",u[2].dataType,u[2].dims),g=y.type.storage,$=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${g}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${g}, ${s*s}>;
  var<workgroup> tileWeightK: array<${g}, ${s*s}>;
  var<workgroup> tileWeightV: array<${g}, ${s*s}>;
  ${p.registerUniforms($).declareVariables(y,_,m,c,h,f)}
  ${p.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${g}(0);
    var valueK = ${g}(0);
    var valueV = ${g}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:l}),getShaderSource:d},{inputs:u,outputs:[-1,-1,-1]})},bs=(e,t)=>{let r=gs(e.inputs,t),[i,n,a]=ws(e,r);return bt(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),vs,xs,ks,Ss,Ic=C(()=>{"use strict";$e(),G(),j(),ae(),K(),vs=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((o,u)=>{if(o!==i[u])throw new Error(`${a}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},xs=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?se(a[a.length-1]):1,o=n==="NHWC"&&a.length>1?s:1,u=T.size(a)/s,l=i,d=l?a.length:a,p=z("x",e[0].dataType,e[0].dims,s),c=z("scale",e[1].dataType,e[1].dims,o),h=z("bias",e[2].dataType,e[2].dims,o),f=z("inputMean",e[3].dataType,e[3].dims,o),y=z("inputVar",e[4].dataType,e[4].dims,o),_=D("y",e[0].dataType,d,s),m=()=>{let $="";if(i)$=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")$=`
            ${_.indicesSet("outputIndices","0","0")}
            let cOffset = ${_.indicesToOffset("outputIndices")};`;else{$=`var cIndices = ${c.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let b=1;b<c.rank;b++)$+=`cIndices[${b}] = outputIndices[${b}];`;$+=`let cOffset = ${c.indicesToOffset("cIndices")};`}return $},g=$=>`
  const epsilon = ${r};
  ${$.registerUniform("outputSize","u32").declareVariables(p,c,h,f,y,_)}
  ${$.mainStart()}
  ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${_.offsetToIndices(`global_idx * ${s}`)};
    ${m()}
    let scale = ${c.getByOffset("cOffset")};
    let bias = ${h.getByOffset("cOffset")};
    let inputMean = ${f.getByOffset("cOffset")};
    let inputVar = ${y.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${_.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:g,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...q(a)]:[{type:12,data:u}]})}},ks=e=>J(e),Ss=(e,t)=>{let{inputs:r,outputCount:i}=e,n=ks({...t,outputCount:i});if(te.webgpu.validateInputContent&&vs(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(xs(r,n))}}),Is,Ts,zs,Tc=C(()=>{"use strict";j(),K(),Is=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Ts=e=>{let t=e[0].dims,r=e[0].dims[2],i=T.size(t)/4,n=e[0].dataType,a=z("input",n,t,4),s=z("bias",n,[r],4),o=z("residual",n,t,4),u=D("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:l=>`
  const channels = ${r}u / 4;
  ${l.declareVariables(a,s,o,u)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},zs=e=>{Is(e.inputs),e.compute(Ts(e.inputs))}}),Es,Y,Cs,Ms,As,Bs,Os,Rs,Ds,Us,Ns,Ps,qs,Ls,Vs,Gs,vt,Ws,Zt,Fs,Hs,js,Ks,Xs,Zs,Qs,Ys,Js,eo,to,ro,io,no,ao,so,oo,ni,uo,ai,si,lo,po,co,ho,fo,mo,oi=C(()=>{"use strict";G(),j(),ae(),K(),Es=(e,t,r,i,n,a,s)=>{let o=Math.ceil(t/4),u="";typeof n=="string"?u=`${n}(a)`:u=n("a");let l=z("inputData",r,[o],4),d=D("outputData",i,[o],4),p=[{name:"vec_size",type:"u32"}];return s&&p.push(...s),`
      ${e.registerUniforms(p).declareVariables(l,d)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx",u)}
  }`},Y=(e,t,r,i,n,a=e.dataType,s,o)=>{let u=[{type:12,data:Math.ceil(T.size(e.dims)/4)}];return s&&u.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:l=>Es(l,T.size(e.dims),e.dataType,a,r,i,o),getRunData:l=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(T.size(l[0].dims)/64/4)},programUniforms:u})}},Cs=e=>{e.compute(Y(e.inputs[0],"Abs","abs"))},Ms=e=>{e.compute(Y(e.inputs[0],"Acos","acos"))},As=e=>{e.compute(Y(e.inputs[0],"Acosh","acosh"))},Bs=e=>{e.compute(Y(e.inputs[0],"Asin","asin"))},Os=e=>{e.compute(Y(e.inputs[0],"Asinh","asinh"))},Rs=e=>{e.compute(Y(e.inputs[0],"Atan","atan"))},Ds=e=>{e.compute(Y(e.inputs[0],"Atanh","atanh"))},Us=e=>J(e),Ns=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Y(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Ps=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return J({min:t,max:r})},qs=(e,t)=>{let r=t||Ps(e.inputs),i=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Ls=e=>{e.compute(Y(e.inputs[0],"Ceil","ceil"))},Vs=e=>{e.compute(Y(e.inputs[0],"Cos","cos"))},Gs=e=>{e.compute(Y(e.inputs[0],"Cosh","cosh"))},vt=e=>J(e),Ws=(e,t)=>{let r=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Zt=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Fs=e=>{let t=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Zt(t)))},Hs=e=>{e.compute(Y(e.inputs[0],"Exp","exp"))},js=e=>{e.compute(Y(e.inputs[0],"Floor","floor"))},Ks=e=>{let t=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Zt(t)))},Xs=(e,t)=>{let r=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Zs=e=>{e.compute(Y(e.inputs[0],"Not",t=>`!${t}`))},Qs=e=>{e.compute(Y(e.inputs[0],"Neg",t=>`-${t}`))},Ys=e=>{e.compute(Y(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Js=e=>{let t=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},eo=e=>{e.compute(Y(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},to=e=>J(e),ro=(e,t)=>{let r=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},io=e=>{let t=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},no=e=>{e.compute(Y(e.inputs[0],"Sin","sin"))},ao=e=>{e.compute(Y(e.inputs[0],"Sinh","sinh"))},so=e=>{e.compute(Y(e.inputs[0],"Sqrt","sqrt"))},oo=e=>{e.compute(Y(e.inputs[0],"Tan","tan"))},ni=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,uo=e=>{e.compute(Y(e.inputs[0],"Tanh",ni))},ai=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${ni("v")};
}
`,si=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,lo=e=>{let t=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"FastGelu",si,ai(t),void 0,e.inputs[0].dataType))},po=(e,t)=>{let r=le(e.inputs[0].dataType);return e.compute(Y(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},co=e=>{e.compute(Y(e.inputs[0],"Log","log"))},ho=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,fo=e=>`quick_gelu_impl(${e})`,mo=(e,t)=>{let r=le(e.inputs[0].dataType);e.compute(Y(e.inputs[0],"QuickGelu",fo,ho(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),go,yo,_o,zc=C(()=>{"use strict";j(),K(),oi(),go=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},yo=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=z("input",e[0].dataType,e[0].dims,4),i=z("bias",e[0].dataType,[e[0].dims[2]],4),n=D("output",e[0].dataType,t,4),a=T.size(t)/4,s=ue(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${Zt(s)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},_o=e=>{go(e.inputs),e.compute(yo(e.inputs))}}),$o,wo,Ee,bo,vo,xo,ko,So,Io,To,zo,Eo,Co,Ec=C(()=>{"use strict";G(),j(),K(),$o=(e,t,r,i,n,a,s,o,u,l,d,p)=>{let c,h;typeof o=="string"?c=h=(g,$)=>`${o}((${g}),(${$}))`:typeof o=="function"?c=h=o:(c=o.scalar,h=o.vector);let f=D("outputData",d,i.length,4),y=z("aData",u,t.length,4),_=z("bData",l,r.length,4),m;if(n)if(a){let g=T.size(t)===1,$=T.size(r)===1,b=t.length>0&&t[t.length-1]%4===0,w=r.length>0&&r[r.length-1]%4===0;g||$?m=f.setByOffset("global_idx",h(g?`${y.type.value}(${y.getByOffset("0")}.x)`:y.getByOffset("global_idx"),$?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"))):m=`
            let outputIndices = ${f.offsetToIndices("global_idx * 4u")};
            let offsetA = ${y.broadcastedIndicesToOffset("outputIndices",f)};
            let offsetB = ${_.broadcastedIndicesToOffset("outputIndices",f)};
            ${f.setByOffset("global_idx",h(s||b?y.getByOffset("offsetA / 4u"):`${y.type.value}(${y.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||w?_.getByOffset("offsetB / 4u"):`${_.type.value}(${_.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else m=f.setByOffset("global_idx",h(y.getByOffset("global_idx"),_.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let g=($,b,w="")=>{let x=`aData[indexA${b}][componentA${b}]`,v=`bData[indexB${b}][componentB${b}]`;return`
            let outputIndices${b} = ${f.offsetToIndices(`global_idx * 4u + ${b}u`)};
            let offsetA${b} = ${y.broadcastedIndicesToOffset(`outputIndices${b}`,f)};
            let offsetB${b} = ${_.broadcastedIndicesToOffset(`outputIndices${b}`,f)};
            let indexA${b} = offsetA${b} / 4u;
            let indexB${b} = offsetB${b} / 4u;
            let componentA${b} = offsetA${b} % 4u;
            let componentB${b} = offsetB${b} % 4u;
            ${$}[${b}] = ${w}(${c(x,v)});
          `};d===9?m=`
            var data = vec4<u32>(0);
            ${g("data",0,"u32")}
            ${g("data",1,"u32")}
            ${g("data",2,"u32")}
            ${g("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:m=`
            ${g("outputData[global_idx]",0)}
            ${g("outputData[global_idx]",1)}
            ${g("outputData[global_idx]",2)}
            ${g("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(y,_,f)}

        ${p??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${m}
      }`},wo=(e,t,r,i,n,a,s=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),l=!T.areEqual(o,u),d=o,p=T.size(o),c=!1,h=!1,f=[l];if(l){let y=pt.calcShape(o,u,!1);if(!y)throw new Error("Can't perform binary op on the given tensors");d=y.slice(),p=T.size(d);let _=T.size(o)===1,m=T.size(u)===1,g=o.length>0&&o[o.length-1]%4===0,$=u.length>0&&u[u.length-1]%4===0;f.push(_),f.push(m),f.push(g),f.push($);let b=1;for(let w=1;w<d.length;w++){let x=o[o.length-w],v=u[u.length-w];if(x===v)b*=x;else break}b%4===0?(h=!0,c=!0):(_||m||g||$)&&(c=!0)}else c=!0;return f.push(c),{name:e,shaderCache:{hint:t+f.map(y=>y.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:y=>$o(y,o,u,d,c,l,h,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:d,dataType:s}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(T.size(d)/4)},...q(o,u,d)]})}},Ee=(e,t,r,i,n,a)=>{e.compute(wo(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},bo=e=>{Ee(e,"Add",(t,r)=>`${t}+${r}`)},vo=e=>{Ee(e,"Div",(t,r)=>`${t}/${r}`)},xo=e=>{Ee(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},ko=e=>{Ee(e,"Mul",(t,r)=>`${t}*${r}`)},So=e=>{let t=z("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Ee(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Io=e=>{Ee(e,"Sub",(t,r)=>`${t}-${r}`)},To=e=>{Ee(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},zo=e=>{Ee(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Eo=e=>{Ee(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Co=e=>{Ee(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Mo,Ao,Bo,Oo,Cc=C(()=>{"use strict";G(),j(),ae(),K(),Mo=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,o)=>{if(o!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((u,l)=>{if(l!==t&&u!==i.dims[l])throw new Error("non concat dimensions must match")})}})},Ao=(e,t,r,i,n=0)=>{let a=e.reduce((m,g)=>m+T.size(g.dims),0),s=new Array(e.length),o=new Array(e.length),u=new Array(e.length),l=0,d=n,p=[],c=[],h=[{type:12,data:a}];for(let m=0;m<e.length;++m)s[m]=l,o[m]=d,l+=T.size(e[m].dims),d+=e[m].dims[t],c.push(e[m].dims.length),u[m]=z(`input${m}`,i,c[m]),p.push("rank"),h.push({type:12,data:s[m]}),h.push({type:12,data:o[m]});for(let m=0;m<e.length;++m)h.push(...q(e[m].dims));h.push(...q(r));let f=D("output",i,r.length),y=u.map((m,g)=>{let $=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${g}`};
        var outputIndices = ${m.offsetToIndices("inputOffset")};
        ${f.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${g};
        ${f.setByIndices("outputIndices",m.getByOffset("inputOffset"))}`;return e.length===1?$:g===0?`if (inputIndex == 0u) {${$}}`:g===e.length-1?`else {${$}}`:`else if (inputIndex == ${g}u) {${$}}`}).join(`
`),_=m=>`

  ${(()=>{m.registerUniform("outputSize","u32");for(let g=0;g<e.length;g++)m.registerUniform(`inputOffset${g}`,"u32"),m.registerUniform(`outputAxisOffset${g}`,"u32");return m.declareVariables(...u,f)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${u.slice(1).map((g,$)=>`if (global_idx < uniforms.inputOffset${$+1}) {
      return ${$}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${y}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h}),getShaderSource:_}},Bo=(e,t)=>{let r=e.inputs,i=r[0].dims,n=T.normalizeAxis(t.axis,i.length);Mo(r,n);let a=i.slice();a[n]=r.reduce((l,d)=>l+(d.dims.length>n?d.dims[n]:0),0);let s=r.filter(l=>T.size(l.dims)>0);if(s.length===0){e.output(0,a);return}let o=e.deviceLimits.maxStorageBuffersPerShaderStage-1,u=0;for(let l=0;l<s.length;l+=o){let d=s.slice(l,l+o);e.compute(Ao(d,n,a,r[0].dataType,u),{inputs:d,outputs:[0]}),u+=d.reduce((p,c)=>p+c.dims[n],0)}},Oo=e=>J({axis:e.axis})}),Je,et,tt,ui,rt=C(()=>{"use strict";G(),j(),Je=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},et=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},tt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},ui=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[ra,ia];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),pe,Ro,li=C(()=>{"use strict";pe=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Ro=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Do,Mc=C(()=>{"use strict";Do=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),xt,di,pi=C(()=>{"use strict";G(),j(),K(),rt(),xt=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,o)=>`
      if (${P(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,P(n,o+a,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},di=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s[s.length-2],l=o[o.length-1],d=s[s.length-1],p=se(l),c=se(d),h=se(u),f=T.size(r)/p/h,y=e.length>2,_=i?i.slice(0,-2):r.slice(0,-2),m=[T.size(_),u,l],g=[{type:12,data:f},{type:12,data:u},{type:12,data:l},{type:12,data:d}];et(t,g),g.push(...q(_,s,o)),y&&g.push(...q(e[2].dims)),g.push(...q(m));let $=b=>{let w=Qr("batch_dims",e[0].dataType,_.length),x=z("a",e[0].dataType,s.length,c),v=z("b",e[1].dataType,o.length,p),k=D("output",e[0].dataType,m.length,p),S=ue(k.type.tensor),E=Je(t,k.type.value,S),R=[x,v],O="";if(y){let X=n?p:1;R.push(z("bias",e[2].dataType,e[2].dims.length,X)),O=`${n?`value += bias[col / ${X}];`:`value += ${k.type.value}(bias[row + i]);`}`}let B=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];tt(t,B);let F=()=>{let X=`var a_data: ${x.type.value};`;for(let V=0;V<c;V++)X+=`
              let b_data${V} = b[(b_offset + (k + ${V}) * uniforms.N + col) / ${p}];`;for(let V=0;V<h;V++){X+=`a_data = a[(a_offset + (row + ${V}) * uniforms.K + k) / ${c}];`;for(let M=0;M<c;M++)X+=`
            values[${V}] = fma(${v.type.value}(a_data${c===1?"":`[${M}]`}), b_data${M}, values[${V}]);
`}return X};return`
  ${b.registerUniforms(B).registerInternalVariables(w).declareVariables(...R,k)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${p})) * ${p};
    var index1 = global_idx / (uniforms.N / ${p});
    let stride1 = uniforms.M / ${h};
    let row = (index1 % stride1) * ${h};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${w.offsetToIndices("batch")};`}

    var a_indices: ${x.type.indices};
    ${xt("a_indices",x,x.rank-2,w.rank,"batch_indices")}
    ${x.indicesSet("a_indices",x.rank-2,0)}
    ${x.indicesSet("a_indices",x.rank-1,0)}
    let a_offset = ${x.indicesToOffset("a_indices")};

    var b_indices: ${v.type.indices};
    ${xt("b_indices",v,v.rank-2,w.rank,"batch_indices")}
    ${v.indicesSet("b_indices",v.rank-2,0)}
    ${v.indicesSet("b_indices",v.rank-1,0)}
    let b_offset = ${v.indicesToOffset("b_indices")};
    var values: array<${k.type.value}, ${h}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${c}) {
      ${F()}
    }
    for (var i = 0u; i < ${h}u; i++) {
      var value = values[i];
      ${O}
      ${E}
      let cur_indices = ${k.type.indices}(batch, row + i, col);
      let offset = ${k.indicesToOffset("cur_indices")};
      ${k.setByOffset(`offset / ${p}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${p};${c};${h};${n}`,inputDependencies:y?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:$}}}),Uo,No,ci,hi,Po,fi,qo,Qt,mi=C(()=>{"use strict";G(),j(),K(),rt(),pi(),li(),Uo=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,No=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,ci=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32)=>{let u=t[1]*e[1],l=t[0]*e[0],d=n?u:a,p=n?a:u,c=d/t[0],h=a/t[1];if(!((n&&c===4&&e[1]===4||!n&&(c===3||c===4))&&d%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${c} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${c} must be 3 or 4.
  tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${c}<${r}>, ${d/c}>, ${p}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${l/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${c};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${h};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Uo(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${c===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${No(n,c)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},hi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Po=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",fi=(e,t,r="f32",i,n=!1,a=32,s=!1,o=32,u=!1)=>{let l=e[1]*t[1],d=e[0]*t[0],p=n?l:a,c=n?a:l;if(!(c%t[1]===0&&p%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${c} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let h=c/t[1],f=p/t[0],y=a/t[1],_=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${d};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          ${hi(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${h};
let tileColA = i32(localId.x) * ${f};
let tileRowB = i32(localId.y) * ${y};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${f}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${hi(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Po(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${p}>, ${c}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${d}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(o/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${_}
  }
`},qo=(e,t,r,i,n=!1)=>{let[a,s,o,u]=i,l=ue(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${pe(e,l)} {
      var value = ${pe(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${xt("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${pe(e,l)} {
      var value = ${pe(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${xt("bIndices",o,o.rank-2,a.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${pe(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${pe(e,l)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Qt=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,o=e[1].dims,u=s.slice(0,-2),l=o.slice(0,-2),d=i?i.slice(0,-2):r.slice(0,-2),p=T.size(d),c=s[s.length-2],h=s[s.length-1],f=o[o.length-1],y=h%4===0&&f%4===0,_=c<=8?[4,1,1]:[4,4,1],m=[8,8,1],g=[Math.ceil(f/m[0]/_[0]),Math.ceil(c/m[1]/_[1]),Math.ceil(p/m[2]/_[2])],$=y?4:1,b=[...u,c,h/$],w=b.length,x=[...l,h,f/$],v=x.length,k=[p,c,f/$],S=[{type:6,data:c},{type:6,data:f},{type:6,data:h}];et(t,S),S.push(...q(d,b,x));let E=["rank","rank"],R=e.length>2;R&&(S.push(...q(e[2].dims)),E.push("rank")),S.push(...q(k));let O=B=>{let F=d.length,X=Qr("batchDims",e[0].dataType,F,1),V=ue(e[0].dataType),M=z("a",e[0].dataType,w,$),W=z("b",e[1].dataType,v,$),U=D("result",e[0].dataType,k.length,$),H=[M,W];if(R){let re=n?$:1;H.push(z("bias",e[2].dataType,e[2].dims.length,re))}let I=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];tt(t,I);let N=ue(U.type.tensor),L=Je(t,U.type.value,N),A=qo($,R,L,[X,M,W,U],n);return`
  ${B.registerUniforms(I).registerInternalVariables(X).declareVariables(...H,U)}
  ${A}
  ${y?ci(_,m,V,X):fi(_,m,V,X)}
                   `};return{name:"MatMul",shaderCache:{hint:`${_};${t.activation};${y};${n}`,inputDependencies:E},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:g[0],y:g[1],z:g[2]},programUniforms:S}),getShaderSource:O}}}),Lo,Vo,Ac=C(()=>{"use strict";G(),Re(),K(),rt(),li(),Mc(),mi(),Lo=(e,t,r,i,n=!1,a,s=4,o=4,u=4,l="f32")=>{let d=S=>{switch(S){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${S} is not supported.`)}},p=S=>{switch(S){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${S} is not supported.`)}},c=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,h=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,f=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",y=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",_=e?"row":"col",m=e?"col":"row",g=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${_} / outWidth;
    let outCol = ${_} % outWidth;

    let WRow = ${m} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${m} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${m} % inChannels;
    var resData = ${pe(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${y}) {
      ${c}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${d(s)}
    }
    return resData;`,$=e?t&&i?`
    let col = colIn * ${s};
    ${g}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${g}
    }
    return ${pe(s,l)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${g}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${g}
    }
    return ${pe(s,l)}(0.0);`,b=e?i&&r?p(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(o)}
    }
    return ${pe(o,l)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(o)}
    }
    return ${pe(o,l)}(0.0);`,w=pe(u,l),x=pe(e?s:o,l),v=pe(e?o:s,l),k=Je(a,w,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${x} {
      ${e?$:b}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${v} {
      ${e?b:$}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${w}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${h}
      ${Ro(n)}
      ${k}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Vo=(e,t,r,i,n,a,s,o,u)=>{let l=t.format==="NHWC",d=l?e[0].dims[3]:e[0].dims[1],p=r[0],c=l?r[2]:r[3],h=l?r[1]:r[2],f=l?r[3]:r[1],y=l&&(d%4===0||d%3===0)&&f%4===0,_=l?f:c*h,m=l?c*h:f,g=[8,8,1],$=i<=8?[4,1,1]:[4,4,1],b=[Math.ceil(_/g[0]/$[0]),Math.ceil(m/g[1]/$[1]),Math.ceil(p/g[2]/$[2])];Z("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${b}`);let w=y?l&&d%4!==0?3:4:1,x=g[1]*$[1],v=g[0]*$[0],k=Math.max(g[0]*w,g[1]),S=i%x===0,E=n%v===0,R=a%k===0,O=y?[w,4,4]:[1,1,1],B=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];et(t,B),B.push(...q(e[0].dims,e[1].dims));let F=["rank","rank"];s&&(B.push(...q(e[2].dims)),F.push("rank")),B.push(...q(r));let X=V=>{let M=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];tt(t,M);let W=y?4:1,U=ue(e[0].dataType),H=`
      fn setOutputAtIndex(flatIndex : i32, value : ${y?`vec4<${U}>`:U}) {
        result[flatIndex] = ${y?`vec4<${U}>`:U}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${y?`vec4<${U}>`:U}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${y?"/ 4":""}, value);
      }`,I=z("x",e[0].dataType,e[0].dims.length,w===3?1:w),N=z("w",e[1].dataType,e[1].dims.length,W),L=[I,N],A=D("result",e[0].dataType,r.length,W);if(s){let re=z("bias",e[2].dataType,e[2].dims.length,W);L.push(re),H+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${y?`vec4<${U}>`:U} {
          return bias[coords.${l?"w":"y"}${y?"/ 4":""}];
        }`}return`
        ${Do("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${V.registerUniforms(M).declareVariables(...L,A)}
        ${H}
        ${Lo(l,S,E,R,s,t,O[0],O[1],O[2],U)}
        ${y?ci($,g,U,void 0,!l,k):fi($,g,U,void 0,!l,k,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${w};${y};${S};${E};${R};${x};${v};${k}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:B}),getShaderSource:X}}}),Go,gi,kt,Wo,yi,Fo,Ho,jo,Bc=C(()=>{"use strict";G(),Re(),j(),K(),rt(),li(),Go=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},gi=e=>typeof e=="number"?[e,e,e]:e,kt=(e,t)=>t<=1?e:e+(e-1)*(t-1),Wo=(e,t,r,i=1)=>{let n=kt(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},yi=(e,t,r,i,n)=>{n==null&&(n=Wo(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},Fo=(e,t,r,i,n,a,s,o,u,l)=>{let d,p,c,h;if(e==="VALID"&&(e=0),typeof e=="number"){d={top:e,bottom:e,left:e,right:e,front:e,back:e};let f=yi([t,r,i,1],[o,u,l],1,[n,a,s],e);p=f[0],c=f[1],h=f[2]}else if(Array.isArray(e)){if(!e.every((y,_,m)=>y===m[0]))throw Error(`Unsupported padding parameter: ${e}`);d={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let f=yi([t,r,i,1],[o,u,l],1,[n,a,s],e[0]);p=f[0],c=f[1],h=f[2]}else if(e==="SAME_UPPER"){p=Math.ceil(t/n),c=Math.ceil(r/a),h=Math.ceil(i/s);let f=(p-1)*n+o-t,y=(c-1)*a+u-r,_=(h-1)*s+l-i,m=Math.floor(f/2),g=f-m,$=Math.floor(y/2),b=y-$,w=Math.floor(_/2),x=_-w;d={top:$,bottom:b,left:w,right:x,front:m,back:g}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:d,outDepth:p,outHeight:c,outWidth:h}},Ho=(e,t,r,i,n,a=!1,s="channelsLast")=>{let o,u,l,d,p;if(s==="channelsLast")[o,u,l,d,p]=e;else if(s==="channelsFirst")[o,p,u,l,d]=e;else throw new Error(`Unknown dataFormat ${s}`);let[c,,h,f,y]=t,[_,m,g]=gi(r),[$,b,w]=gi(i),x=kt(h,$),v=kt(f,b),k=kt(y,w),{padInfo:S,outDepth:E,outHeight:R,outWidth:O}=Fo(n,u,l,d,_,m,g,x,v,k),B=a?c*p:c,F=[0,0,0,0,0];return s==="channelsFirst"?F=[o,B,E,R,O]:s==="channelsLast"&&(F=[o,E,R,O,B]),{batchSize:o,dataFormat:s,inDepth:u,inHeight:l,inWidth:d,inChannels:p,outDepth:E,outHeight:R,outWidth:O,outChannels:B,padInfo:S,strideDepth:_,strideHeight:m,strideWidth:g,filterDepth:h,filterHeight:f,filterWidth:y,effectiveFilterDepth:x,effectiveFilterHeight:v,effectiveFilterWidth:k,dilationDepth:$,dilationHeight:b,dilationWidth:w,inShape:e,outShape:F,filterShape:t}},jo=(e,t,r,i,n,a)=>{let s=a==="channelsLast",o=s?e[0].dims[3]:e[0].dims[1],u=!1,l=[64,1,1],d={x:r.map((g,$)=>$)},p=[Math.ceil(Go(d.x.map(g=>r[g]))/l[0]),1,1];Z("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let c=u?s&&o%4!==0?3:4:1,h=T.size(r),f=[{type:12,data:h},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];et(t,f),f.push(...q(e[0].dims,e[1].dims));let y=["rank","rank"],_=e.length===3;_&&(f.push(...q(e[2].dims)),y.push("rank")),f.push(...q(r));let m=g=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];tt(t,$);let b=u?4:1,w=ue(e[0].dataType),x=z("x",e[0].dataType,e[0].dims.length,c===3?1:c),v=z("W",e[1].dataType,e[1].dims.length,b),k=[x,v],S=D("result",e[0].dataType,r.length,b),E="";if(_){let B=z("bias",e[2].dataType,e[2].dims.length,b);k.push(B),E+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${w}>`:w} {
          return bias[${s?P("coords",4,5):P("coords",1,5)}${u?"/ 4":""}];
        }`}let R=pe(c,w),O=Je(t,R,w);return`
            ${E}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${w} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${x.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${w} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${v.getByIndices("aIndices")};
            }
          ${g.registerUniforms($).declareVariables(...k,S)}
          ${g.mainStart()}
          ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${S.offsetToIndices("global_idx")};
              let batch = ${P("coords",0,x.rank)};
              let d2 = ${s?P("coords",x.rank-1,x.rank):P("coords",1,x.rank)};
              let xFRCCorner = vec3<u32>(${s?P("coords",1,x.rank):P("coords",2,x.rank)},
              ${s?P("coords",2,x.rank):P("coords",3,x.rank)},
              ${s?P("coords",3,x.rank):P("coords",4,x.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?P("uniforms.x_shape",1,x.rank):P("uniforms.x_shape",2,x.rank)};
              let xShapeZ = ${s?P("uniforms.x_shape",2,x.rank):P("uniforms.x_shape",3,x.rank)};
              let xShapeW = ${s?P("uniforms.x_shape",3,x.rank):P("uniforms.x_shape",4,x.rank)};
              let xShapeU = ${s?P("uniforms.x_shape",4,x.rank):P("uniforms.x_shape",1,x.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${w}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<${w}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${w}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${w}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<${w}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${w}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${w}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${w}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${w}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${w}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${O}
              result[global_idx] = ${w}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${_}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:f}),getShaderSource:m}}}),Ko,Xo,Oc=C(()=>{"use strict";G(),j(),K(),rt(),Ko=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,o=e[1].dims,u=t.format==="NHWC",l=u?r[3]:r[1],d=l/t.group,p=u&&d>=4?se(l):1,c=T.size(r)/p,h=[{type:12,data:c},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:d}];et(t,h),h.push(...q(s,[o[0],o[1],o[2],o[3]/p]));let f=n?["rank","rank","rank"]:["rank","rank"];h.push(...q([r[0],r[1],r[2],r[3]/p]));let y=_=>{let m=D("output",e[0].dataType,r.length,p),g=ue(m.type.tensor),$=Je(t,m.type.value,g),b=z("x",e[0].dataType,s.length),w=z("w",e[1].dataType,o.length,p),x=[b,w];n&&x.push(z("b",e[2].dataType,e[2].dims,p));let v=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];tt(t,v);let k=u?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${b.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${w.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${b.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${w.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${_.registerUniforms(v).declareVariables(...x,m)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${m.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${p} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${m.type.value} = ${m.type.value}(0);
    ${k}
    ${a}
    ${$}
    ${m.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${p}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:y}},Xo=(e,t,r,i)=>{let n=e.length>2,a=se(r[3]),s=se(r[2]),o=T.size(r)/a/s,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],d=[r[0],r[1],r[2],r[3]/a],p=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];et(t,p),p.push(...q(u,l,d));let c=(s-1)*t.strides[1]+l[1],h=f=>{let y=D("output",e[0].dataType,d.length,a),_=ue(y.type.tensor),m=Je(t,y.type.value,_),g=z("x",e[0].dataType,u.length,a),$=z("w",e[1].dataType,l.length,a),b=[g,$];n&&b.push(z("b",e[2].dataType,e[2].dims,a));let w=n?"value += b[output_channel];":"",x=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return tt(t,x),`
  ${f.registerUniforms(x).declareVariables(...b,y)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${g.type.value}, ${c}>;
    var values: array<${y.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${c}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${g.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${g.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${$.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${w}
      ${m}
      ${y.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${c};${l[0]};${l[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:h}}}),Zo,Yt,Qo,Jt,_i,$i,Yo,Jo,wi,Rc=C(()=>{"use strict";j(),Ac(),Bc(),mi(),Oc(),rt(),pi(),qe(),Zo=(e,t,r,i,n,a)=>{let s=e[0],o=e.slice(a?1:2,a?3:4),u=o.length,l=t[0],d=t.slice(2).map((c,h)=>c+(c-1)*(r[h]-1)),p=o.map((c,h)=>c+i[h]+i[h+u]).map((c,h)=>Math.floor((c-d[h]+n[h])/n[h]));return p.splice(0,0,s),p.splice(a?3:1,0,l),p},Yt=[2,3,1,0],Qo=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Jt=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();Wt.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},_i=e=>{let t=ui(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,o=e.pads,u=e.strides,l=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},$i=(e,t,r,i)=>{let n=r.format==="NHWC",a=Zo(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let x=[t[0]];if(n){let v=e.kernelCustomData.wT??e.compute(be(t[1],Yt),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v),x.push(v)}else x.push(t[1]);t.length===3&&x.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Xo(x,r,a,i),{inputs:x}):e.compute(Ko(x,r,a,i),{inputs:x});return}let s=t.length===3,o=t[0].dims[n?1:2],u=t[0].dims[n?2:3],l=t[0].dims[n?3:1],d=t[1].dims[2],p=t[1].dims[3],c=a[n?1:2],h=a[n?2:3],f=a[n?3:1],y=n&&d===o&&p===u&&r.pads[0]===0&&r.pads[1]===0;if(y||d===1&&p===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let x=a[0],v,k,S,E=[];if(n){let B=e.kernelCustomData.wT??e.compute(be(t[1],Yt),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=B),y){let F=o*u*l;v=t[0].reshape([1,x,F]),k=B.reshape([1,F,f]),S=[1,x,f]}else v=t[0].reshape([x,o*u,l]),k=B.reshape([1,l,f]),S=[x,c*h,f];E.push(v),E.push(k)}else v=t[0].reshape([x,l,o*u]),k=t[1].reshape([1,f,l]),S=[x,f,c*h],E.push(k),E.push(v);s&&E.push(t[2]);let R=S[2],O=E[0].dims[E[0].dims.length-1];R<8&&O<8?e.compute(di(E,r,a,S,n,i),{inputs:E}):e.compute(Qt(E,r,a,S,n,i),{inputs:E});return}let _=!0,m=e.kernelCustomData.wT??e.compute(be(t[1],Yt),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=m);let g=[t[0],m];s&&g.push(t[2]);let $=n?c*h:f,b=n?f:c*h,w=d*p*l;e.compute(Vo(g,r,a,$,b,w,s,_,i),{inputs:g})},Yo=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=Jt({...t,pads:n,strides:a,dilations:s,kernelShape:o},i);$i(e,i,u,l=>r?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},Jo=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Jt(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Ho(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(jo(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},wi=(e,t)=>{if(Qo(e.inputs,t),e.inputs[0].dims.length===3)Yo(e,t);else if(e.inputs[0].dims.length===5)Jo(e,e.inputs,t);else{let r=Jt(t,e.inputs);$i(e,e.inputs,r)}}}),eu,Dc=C(()=>{"use strict";G(),Re(),j(),K(),eu=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,o=e[1].dims,u=o[2]/s,l=o[3],d=a?se(u):1,p=a&&l===1&&u>=4,c=p?Math.floor(u/4)*4:Math.floor(u/d)*d,h=u-c,f=a?se(l):1,y=a?l===1?d:f:1,_=T.size(n)/f,m=[Math.ceil(_/64),1,1];Z("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${m}`);let g=["rank","rank"],$=[t.strides[0],t.strides[1]],b=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],w=[t.dilations[0],t.dilations[1]],x=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],v=[x[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),x[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],k=[{type:12,data:_},{type:12,data:$},{type:12,data:b},{type:12,data:w},{type:12,data:x},{type:6,data:v},{type:12,data:c},{type:12,data:u},{type:12,data:l},...q(e[0].dims,e[1].dims)];i&&(k.push(...q(e[2].dims)),g.push("rank")),k.push(...q(n));let S=E=>{let R=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:$.length},{name:"filter_dims",type:"u32",length:b.length},{name:"dilations",type:"u32",length:b.length},{name:"effective_filter_dims",type:"u32",length:x.length},{name:"pads",type:"i32",length:v.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],O=ue(e[0].dataType),B=a?1:2,F=a?2:3,X=a?3:1,V=z("W",e[1].dataType,e[1].dims.length,y),M=z("Dy",e[0].dataType,e[0].dims.length,d),W=[M,V];i&&W.push(z("bias",e[2].dataType,[n[X]].length,f));let U=D("result",e[0].dataType,n.length,f),H=()=>{let L="";if(p)d===4?L+=`
        let xValue = ${M.getByOffset("x_offset")};
        let wValue = ${V.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:d===2?L+=`
          dotProd = dotProd + dot(vec4<${O}>(${M.getByOffset("x_offset")}, ${M.getByOffset("x_offset + 1u")}), vec4<${O}>(${V.getByOffset("w_offset")}, ${V.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:d===1&&(L+=`
          dotProd = dotProd + dot(vec4<${O}>(${M.getByOffset("x_offset")}, ${M.getByOffset("x_offset + 1u")}, ${M.getByOffset("x_offset + 2u")}, ${M.getByOffset("x_offset + 3u")}), vec4<${O}>(${V.getByOffset("w_offset")}, ${V.getByOffset("w_offset + 1u")}, ${V.getByOffset("w_offset + 2u")}, ${V.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(L+=`
                  let xValue = ${a?M.getByOffset(`${M.indicesToOffset(`${M.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d}`):M.get("batch","inputChannel","idyR","idyC")};
        `,d===1)L+=`
          let w_offset = ${V.indicesToOffset(`${V.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${V.getByOffset(`w_offset / ${y}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let A=0;A<d;A++)L+=`
            let wValue${A} = ${V.getByOffset(`${V.indicesToOffset(`${V.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${A}, wOutChannel)`)} / ${y}`)};
            dotProd = dotProd + xValue[${A}] * wValue${A};`;return L},I=()=>{if(h===0)return"";if(!p)throw new Error(`packInputAs4 ${p} is not true.`);let L="";if(d===1){L+="dotProd = dotProd";for(let A=0;A<h;A++)L+=`
            + ${M.getByOffset(`x_offset + ${A}`)} * ${V.getByOffset(`w_offset + ${A}`)}`;L+=";"}else if(d===2){if(h!==2)throw new Error(`Invalid inputChannelsRemainder ${h}.`);L+=`
          let xValue = ${M.getByOffset("x_offset")};
          let wValue = ${V.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return L},N=`
            let outputIndices = ${U.offsetToIndices(`global_idx * ${f}`)};
            let batch = ${U.indicesGet("outputIndices",0)};
            let d1 = ${U.indicesGet("outputIndices",X)};
            let r = ${U.indicesGet("outputIndices",B)};
            let c = ${U.indicesGet("outputIndices",F)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${U.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${O}(dyRCorner) + ${O}(wR)) / ${O}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${O}(uniforms.Dy_shape[${B}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${O}(dyCCorner) + ${O}(wC)) / ${O}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${O}(uniforms.Dy_shape[${F}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${p?`
                var x_offset = ${M.indicesToOffset(`${M.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d};
                var w_offset = ${V.indicesToOffset(`${V.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${y};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${p?4:d}) {
                  ${H()}
                  inputChannel = inputChannel + ${p?4:d};
                }
                ${I()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${f}]`:""};
            ${U.setByOffset("global_idx","value")};
          `;return`
    ${E.registerUniforms(R).declareVariables(...W,U)}
      ${E.mainStart()}
      ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${N}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${d}${y}${f}${p}${h}`,inputDependencies:g},getRunData:()=>({dispatchGroup:{x:m[0],y:m[1],z:m[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:k}),getShaderSource:S}}}),tu,ru,iu,bi,nu,au,vi,su,ou,Uc=C(()=>{"use strict";Dc(),rt(),qe(),tu=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,ru=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},iu=(e,t,r,i,n,a,s,o,u,l)=>{let d=e.length-2,p=l.length===0;u.length<d&&u.push(...Array(d-u.length).fill(0));let c=e[0],h=t[o?3:1]*n;for(let f=0,y=e.length-d-(o?1:0);f<d;++f,++y){let _=e[y],m=p?_*s[f]:l[f],g=tu(_,s[f],a[f],t[y],r[f],m);ru(g,i,a,f,f+d),p&&l.push(s[f]*(_-1)+u[f]+(t[y]-1)*r[f]+1-a[f]-a[f+d])}l.splice(0,0,c),l.splice(o?3:1,0,h)},bi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((p,c)=>p*c,1)===0){r.length=0;for(let p=2;p<t[1].dims.length;++p)r.push(t[1].dims[p])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((p,c)=>p+c,0)===0){let p=t[0].dims.length-2;u=new Array(p).fill(1)}let l=e.strides.slice();if(l.reduce((p,c)=>p+c,0)===0){let p=t[0].dims.length-2;l=new Array(p).fill(1)}iu(o,r,u,e.autoPad,e.group,n,l,i,s,a);let d=Object.assign({},e);return Object.assign(d,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:u,strides:l}),d},nu=e=>{let t=ui(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,o=e.pads,u=e.strides,l=e.wIsConst(),d=e.outputPadding,p=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:d,outputShape:p,pads:o,strides:u,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},au=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,o)=>s+o,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,o)=>s+o,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,o)=>s+o,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,o)=>s+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},vi=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(be(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(eu(a,r,i),{inputs:a})},su=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let u=t.outputPadding;u=[0].concat(u);let l=bi({...t,pads:o,strides:s,dilations:a,kernelShape:n,outputPadding:u},i);vi(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},ou=(e,t)=>{if(au(e.inputs,t),e.inputs[0].dims.length===3)su(e,t);else{let r=bi(t,e.inputs);vi(e,e.inputs,r)}}}),uu,lu,du,Nc=C(()=>{"use strict";G(),j(),ae(),K(),uu=(e,t,r,i)=>{let n=T.size(t),a=t.length,s=z("input",e,a),o=D("output",e,a),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),l=T.normalizeAxis(u,a),d=p=>{let c=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,h=P("uniforms.input_shape","uniforms.axis",a),f=i.reverse?c+(i.exclusive?" + 1":""):"0",y=i.reverse?h:c+(i.exclusive?"":" + 1");return`
                ${p.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,o)}
                ${p.mainStart()}
                  ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${f};
                  let last : i32 = ${y};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:l},...q(t,t)]}),getShaderSource:d}},lu=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(uu(i,r,n,t),{inputs:[0]})},du=e=>{let t=e.exclusive===1,r=e.reverse===1;return J({exclusive:t,reverse:r})}}),pu,cu,hu,fu,mu,Pc=C(()=>{"use strict";G(),j(),ae(),K(),pu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},cu=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},hu=(e,t)=>{let r,i,n,a,s,o,u=t.format==="NHWC",l=t.blocksize,d=t.mode==="DCR";u?([r,i,n,a]=e.dims,s=d?[r,i,n,l,l,a/l**2]:[r,i,n,a/l**2,l,l],o=d?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=d?[r,l,l,a/l**2,i,n]:[r,a/l**2,l,l,i,n],o=d?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let p=e.reshape(s),c=p.dims.length,h=e.dataType,f=z("a",h,c),y=D("output",h,c),_=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(f,y)}

  ${cu(o,c,f,y)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${y.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${y.setByOffset("global_idx",f.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:m=>{let g=u?[r,i*l,n*l,a/l**2]:[r,a/l**2,i*l,n*l],$=T.size(g),b=p.dims,w=T.sortBasedOnPerm(b,o);return{outputs:[{dims:g,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:[{type:12,data:$},...q(b,w)]}},getShaderSource:_}},fu=(e,t)=>{pu(e.inputs),e.compute(hu(e.inputs[0],t))},mu=e=>J({blocksize:e.blocksize,mode:e.mode,format:e.format})}),De,St,er,xi,Le,gu,yu,_u,ki,Si,Ii,$u,wu,Ti,bu,vu,xu,qc=C(()=>{"use strict";G(),j(),ae(),K(),De=256,St=512,er=2*Math.PI,xi=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},Le=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},gu=(e,t,r,i,n)=>{let a=r/e,s=St-i,o=l=>`smem[${s}u + base + ${l*t}u]`,u=`  for (var t = local_idx; t < ${a}u; t += ${De}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let l=0;l<e;l++){let d=`${i}u + t + ${l*a}u`;if(l===0)u+=`    leg[0] = smem[${d}];
`;else{let p=n*er*l/(e*t);u+=`    { let a = ${Le(p)} * angleUnit; leg[${l}] = cmul(smem[${d}], vec2<f32>(cos(a), sin(a))); }
`}}if(u+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)u+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let l=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";u+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,u+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,u+=`    let oddRot = ${l};
`,u+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,u+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let l=0;l<e;l++){let d=["leg[0]"];for(let p=1;p<e;p++){let c=n*er*(p*l)/e,h=Le(Math.cos(c)),f=Le(Math.sin(c));d.push(`vec2<f32>(leg[${p}].x*${h} - leg[${p}].y*${f}, leg[${p}].x*${f} + leg[${p}].y*${h})`)}u+=`    ${o(l)} = ${d.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},yu=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=gu(s,n,t,a,r),n*=s,a=St-a;return{code:i,resultOffset:a}},_u=(e,t,r,i,n)=>{let a=e.dims,s=a.length,o=a[s-1],u=a[t],l=r&&i?(u-1)*2:u;n!==void 0&&(l=n);let d=r&&i?1:2,p=i&&!r?Math.floor(l/2)+1:l,c=a.slice();c[t]=p,c[s-1]=d;let h=1;for(let y=t+1;y<s-1;y++)h*=a[y];let f=T.size(a)/o/u;return{dataType:e.dataType,outputDims:c,length:l,signalLength:u,inner:h,batch:f,inputComponents:o,outputComponents:d,outputLength:p,inverse:r,onesided:i}},ki=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Si=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],Ii=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),$u=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=le(t),u=a?1:-1,l=a?1/r:1,d=xi(r),p=c=>{let h=z("x",t,[1]),f=D("y",t,[1]),y=w=>{let x=`inBase + (${w}) * uniforms.inner * ${i}u`,v=`f32(${h.getByOffset(x)})`,k=i===2?`f32(${h.getByOffset(`${x} + 1u`)})`:"0.0";return`vec2<f32>(${v}, ${k})`},_;if(a&&s){let w=Math.floor(r/2)+1,x=r%2===0?`select(provided, provided - 1u, provided == ${w}u)`:"provided";_=`
    let provided = min(uniforms.signalLength, ${w}u);
    for (var i = local_idx; i < ${r}u; i += ${De}u) {
      if (i < provided) { smem[i] = ${y("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${x}; k += ${De}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else _=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${De}u) {
      if (i < loadCount) { smem[i] = ${y("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:m,resultOffset:g}=yu(d,r,u),$=l===1?`smem[${g}u + i]`:`smem[${g}u + i] * ${Le(l)}`,b=n===2?f.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${Ii(c,h,f)}
  var<workgroup> smem: array<vec2<f32>, ${2*St}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${c.mainStart(De)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${_}
${m}    for (var i = local_idx; i < uniforms.outputLength; i += ${De}u) {
      let v = ${$};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${f.setByOffset("off",`${o}(v.x)`)}
      ${b}
    }
  }`};return{name:"DFT",shaderCache:{hint:ki(e,"fft"),inputDependencies:["type"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Si(e),dispatchGroup:{x:e.batch}})}},wu=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,o=le(t),u=a?1:-1,l=a?1/r:1,d=p=>{let c=z("x",t,[1]),h=D("y",t,[1]),f=$=>{let b=`inBase + (${$}) * uniforms.inner * ${i}u`,w=`f32(${c.getByOffset(b)})`,x=i===2?`f32(${c.getByOffset(`${b} + 1u`)})`:"0.0";return`vec2<f32>(${w}, ${x})`},y=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${f("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${f("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${f("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,_=`
      let angle = ${Le(u*er)} * f32(knMod) / ${Le(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,m=n===2?h.setByOffset("off + 1u",`${o}(v.y)`):"",g=l===1?"acc":`acc * ${Le(l)}`;return`
  ${Ii(p,c,h)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${y}
  ${p.mainStart(De)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${De}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${_}
      }
      let v = ${g};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${h.setByOffset("off",`${o}(v.x)`)}
      ${m}
    }
  }`};return{name:"DFT",shaderCache:{hint:ki(e,"direct"),inputDependencies:["type"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Si(e),dispatchGroup:{x:e.batch}})}},Ti=e=>{if(!e||e.dataType===0)return;if(T.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},bu=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},vu=(e,t)=>{bu(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=Ti(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let o=T.normalizeAxis(Ti(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=_u(r,o,n,a,s);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let l=u.length<=St&&xi(u.length)!==void 0?$u(u):wu(u);e.compute(l,{inputs:[0]})},xu=e=>J({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),tr,It,zi,ku,Su,Iu,Tu,Ei,zu,Eu,Cu,Lc=C(()=>{"use strict";G(),j(),ae(),K(),tr="[a-zA-Z]|\\.\\.\\.",It="("+tr+")+",zi="^"+It+"$",ku="("+It+",)*"+It,Su="^"+ku+"$",Iu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Tu=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Su)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,s)=>{let o=e[s].dims.slice();if(!a.match(RegExp(zi)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,o,s);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,s])=>s.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(It)))throw new Error("Invalid RHS");(n=i.match(RegExp(tr,"g")))==null||n.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(a);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],o=0;if(!e.match(RegExp(zi))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(tr,"g")),l=new Iu(i);return u==null||u.forEach((d,p)=>{if(d==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let c=n-u.length+1;if(c<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(o,o+c),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let h=0;h<s.length;h++){let f=String.fromCharCode(48+h);l.addSymbol(f,p+h),this.addSymbol(f,r[o++],i)}}else l.addSymbol(d,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(d,r[o++],i)}),l}},Ei=e=>e+"_max",zu=(e,t,r,i)=>{let n=e.map(l=>l.length).map((l,d)=>z(`input${d}`,t,l)),a=T.size(i),s=D("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(l=>!r.rhs.symbolToIndices.has(l)),u=l=>{let d=[],p="var prod = 1.0;",c="var sum = 0.0;",h="sum += prod;",f=[],y=[],_=[],m=[],g=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((b,w)=>{var x;if(r.rhs.symbolToIndices.has(w)){let v=(x=r.rhs.symbolToIndices.get(w))==null?void 0:x[0];v!==void 0&&r.lhs.forEach((k,S)=>{if(b.inputIndices.includes(S)){let E=k.symbolToIndices.get(w);if(E===void 0)throw new Error("Invalid symbol error");E.forEach(R=>{d.push(`${n[S].indicesSet(`input${S}Indices`,R,s.indicesGet("outputIndices",v))}`)})}})}else r.lhs.forEach((v,k)=>{if(b.inputIndices.includes(k)){let S=v.symbolToIndices.get(w);if(S===void 0)throw new Error("Invalid symbol error");S.forEach(E=>{f.push(`${n[k].indicesSet(`input${k}Indices`,E,`${w}`)}`)}),m.push(`prod *= ${n[k].getByIndices(`input${k}Indices`)};`)}}),y.push(`for(var ${w}: u32 = 0; ${w} < uniforms.${Ei(w)}; ${w}++) {`),_.push("}")});let $=g?[...d,`let sum = ${n.map((b,w)=>b.getByIndices(`input${w}Indices`)).join(" * ")};`]:[...d,c,...y,...f,p,...m,h,..._];return`
            ${l.registerUniforms(o.map(b=>({name:`${Ei(b)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((b,w)=>`var input${w}Indices: ${n[w].type.indices};`).join(`
`)}
            ${$.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let l=o.filter(p=>r.symbolToInfo.has(p)).map(p=>{var c;return{type:12,data:((c=r.symbolToInfo.get(p))==null?void 0:c.dimValue)||0}});l.push({type:12,data:a});let d=e.map((p,c)=>[...q(p)]).reduce((p,c)=>p.concat(c),l);return d.push(...q(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}},getShaderSource:u}},Eu=(e,t)=>{let r=new Tu(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(zu(n,e.inputs[0].dataType,r,i))},Cu=e=>{let t=e.equation.replace(/\s+/g,"");return J({equation:t})}}),Mu,Ci,Au,Bu,Ou,Vc=C(()=>{"use strict";G(),j(),K(),Mu=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Ci=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Au=(e,t)=>e.length>t.length?Ci(e,t):Ci(t,e),Bu=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Au(t,r),n=e[0].dataType,a=n===9||T.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=a||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(T.size(i)/o),l=p=>{let c=z("input",n,t.length,s),h=D("output",n,i.length,o),f;if(n===9){let y=(_,m,g="")=>`
          let outputIndices${m} = ${h.offsetToIndices(`outputOffset + ${m}u`)};
          let offset${m} = ${c.broadcastedIndicesToOffset(`outputIndices${m}`,h)};
          let index${m} = offset${m} / 4u;
          let component${m} = offset${m} % 4u;
          ${_}[${m}] = ${g}(${c.getByOffset(`index${m}`)}[component${m}]);
        `;f=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${y("data",0,"u32")}
        ${y("data",1,"u32")}
        ${y("data",2,"u32")}
        ${y("data",3,"u32")}
        ${h.setByOffset("global_idx","data")}
      }`}else f=`
        let outputIndices = ${h.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${c.broadcastedIndicesToOffset("outputIndices",h)};
        let data = ${h.type.value}(${c.getByOffset(`inputOffset / ${s}`)});
        ${h.setByOffset("global_idx","data")}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(c,h)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${f}`},d=[{type:12,data:u},...q(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${o}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d})}},Ou=e=>{Mu(e.inputs),e.compute(Bu(e.inputs),{inputs:[0]})}}),Ru,Du,Gc=C(()=>{"use strict";G(),j(),K(),oi(),Ru=e=>{let t=e[0].dataType,r=T.size(e[0].dims),i=T.size(e[1].dims),n=i%4===0,a=s=>{let o=z("x",t,[1],4),u=z("bias",t,[1],4),l=D("y",t,[1],4),d=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],p=h=>`
      let bias${h}_offset: u32 = (global_idx * 4 + ${h}) % uniforms.bias_size;
      let bias${h} = ${u.getByOffset(`bias${h}_offset / 4`)}[bias${h}_offset % 4];`,c=n?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${p(0)}${p(1)}${p(2)}${p(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(d).declareVariables(o,u,l)}

    ${ai(le(t))}

    ${s.mainStart(ct)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${c}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",si("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/ct/4)}})}},Du=e=>{e.inputs.length<2||T.size(e.inputs[1].dims)===0?lo(e):e.compute(Ru(e.inputs))}}),Uu,Nu,Pu,qu,Wc=C(()=>{"use strict";G(),j(),ae(),K(),Uu=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Nu=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=T.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let o=r[a],u=e[0].dataType===9?4:1,l=Math.ceil(T.size(s)/u),d=[{type:12,data:l},{type:6,data:o},{type:12,data:a},...q(e[0].dims,e[1].dims,s)],p=c=>{let h=z("data",e[0].dataType,e[0].dims.length,u),f=z("inputIndices",e[1].dataType,e[1].dims.length),y=D("output",e[0].dataType,s.length,u),_=g=>{let $=i.length,b=`var indicesIndices${g}  = ${f.type.indices}(0);`;for(let w=0;w<$;w++)b+=`${$>1?`indicesIndices${g}[${w}]`:`indicesIndices${g}`} = ${s.length>1?`outputIndices${g}[uniforms.axis + ${w}]`:`outputIndices${g}`};`;b+=`
          var idx${g} = ${f.getByIndices(`indicesIndices${g}`)};
          if (idx${g} < 0) {
            idx${g} = idx${g} + uniforms.axisDimLimit;
          }
          var dataIndices${g} : ${h.type.indices};
        `;for(let w=0,x=0;w<n;w++)w===a?(b+=`${n>1?`dataIndices${g}[${w}]`:`dataIndices${g}`} = u32(idx${g});`,x+=$):(b+=`${n>1?`dataIndices${g}[${w}]`:`dataIndices${g}`} = ${s.length>1?`outputIndices${g}[${x}]`:`outputIndices${g}`};`,x++);return b},m;if(e[0].dataType===9){let g=($,b,w="")=>`
          let outputIndices${b} = ${y.offsetToIndices(`outputOffset + ${b}u`)};
          ${_(b)};
          let offset${b} = ${h.indicesToOffset(`dataIndices${b}`)};
          let index${b} = offset${b} / 4u;
          let component${b} = offset${b} % 4u;
          ${$}[${b}] = ${w}(${h.getByOffset(`index${b}`)}[component${b}]);
        `;m=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${g("value",0,"u32")}
        ${g("value",1,"u32")}
        ${g("value",2,"u32")}
        ${g("value",3,"u32")}
        ${y.setByOffset("global_idx","value")}
      `}else m=`
      let outputIndices = ${y.offsetToIndices("global_idx")};
      ${_("")};
      let value = ${h.getByIndices("dataIndices")};
      ${y.setByOffset("global_idx","value")};
      `;return`
      ${c.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,f,y)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${m}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:p}},Pu=e=>J({axis:e.axis}),qu=(e,t)=>{let r=e.inputs;Uu(r),e.compute(Nu(e.inputs,t))}}),Lu,Vu,Gu,Fc=C(()=>{"use strict";G(),j(),K(),Lu=(e,t,r,i,n,a,s,o,u)=>{let l=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:o},{type:12,data:u}],d=[a];l.push(...q(t.dims,d));let p=c=>{let h=z("indices_data",t.dataType,t.dims.length),f=D("input_slice_offsets_data",12,1,1),y=[h,f],_=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${c.registerUniforms(_).declareVariables(...y)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:p},{inputs:[t],outputs:[-1]})[0]},Vu=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],o=T.sizeToDimension(a,a.length-1),u=T.sizeFromDimension(i,t.batchDims+s),l=T.sizeToDimension(i,t.batchDims),d=T.sizeFromDimension(i,t.batchDims),p=o/l,c=new Array(s),h=u;for(let b=0;b<s;++b)c[s-1-b]=h,h*=i[t.batchDims+s-1-b];let f=Lu(e,r[1],c,t.batchDims,i,o,p,d,s),y=t.batchDims+s;if(y>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let _=a.slice(0,-1).concat(i.slice(y)),m=T.size(_),g=[{type:12,data:m},{type:12,data:u},...q(r[0].dims,f.dims,_)],$=b=>{let w=z("data",r[0].dataType,r[0].dims.length),x=z("slice_offsets",12,f.dims.length),v=D("output",r[0].dataType,_.length);return`
          ${b.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(w,x,v)}
            ${b.mainStart()}
            ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:_,dataType:n}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:g}),getShaderSource:$},{inputs:[r[0],f]})},Gu=e=>({batchDims:e.batch_dims,cacheKey:""})}),Wu,Fu,Hu,ju,Hc=C(()=>{"use strict";G(),j(),ae(),K(),Wu=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=T.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((o,u)=>u===r?Math.ceil(o/i)===a.dims[u]:o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((o,u)=>o===a.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Fu=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=T.normalizeAxis(t.gatherAxis,n),s=T.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(a,1,...i);let u=T.size(o),l=e[2].dataType,d=e[0].dataType===22,p=[{type:12,data:u},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...q(...e.map((h,f)=>h.dims),o)],c=h=>{let f=z("data",e[0].dataType,e[0].dims.length),y=z("inputIndices",e[1].dataType,e[1].dims.length),_=z("scales",e[2].dataType,e[2].dims.length),m=e.length>3?z("zeroPoint",e[3].dataType,e[3].dims.length):void 0,g=D("output",l,o.length),$=[f,y,_];m&&$.push(m);let b=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${h.registerUniforms(b).declareVariables(...$,g)}
        ${h.mainStart()}
        let output_indices = ${g.offsetToIndices("global_idx")};
        var indices_indices = ${y.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${g.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${y.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${g.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${f.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${g.indicesGet("output_indices","i")};
          ${f.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${y.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${f.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${g.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${f.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${f.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${f.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${d?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${_.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${_.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${_.getByIndices("scale_indices")};
        ${m?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${m.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${m.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${d?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${le(l)}(quantized_data - zero_point) * scale;
        ${g.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((h,f)=>f!==1).map(h=>h.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(h,f)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:l}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:p}),getShaderSource:c}},Hu=(e,t)=>{let r=e.inputs;Wu(r,t),e.compute(Fu(e.inputs,t))},ju=e=>J({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Ku,Xu,Zu,Qu,jc=C(()=>{"use strict";G(),j(),ae(),K(),Ku=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Xu=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,o=T.normalizeAxis(t.axis,n),u=r[o],l=a.slice(0),d=T.size(l),p=z("input",i,n),c=z("indicesInput",s,a.length),h=D("output",i,l.length),f=[{type:12,data:d},{type:6,data:u},{type:12,data:o}];return f.push(...q(r,a,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f}),getShaderSource:y=>`
      ${y.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(p,c,h)}
      ${y.mainStart()}
      ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${h.offsetToIndices("global_idx")};

      var idx = ${c.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${p.type.indices}(outputIndices);
      ${p.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${p.getByIndices("inputIndices")};

      ${h.setByOffset("global_idx","value")};
  }`}},Zu=e=>J({axis:e.axis}),Qu=(e,t)=>{let r=e.inputs;Ku(r),e.compute(Xu(e.inputs,t))}}),Yu,Ju,el,tl,Kc=C(()=>{"use strict";G(),j(),K(),Yu=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Ju=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=ta.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,a];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,l=Math.ceil(a/u),d=Math.ceil(n/u),p=!0,c=T.size(o),h=[{type:12,data:p?l:c},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],f=["type","type"];e.length===3&&(h.push(...q(e[2].dims)),f.push("rank")),h.push(...q(o));let y=m=>{let g="";t.transA&&t.transB?g="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?g="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?g="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(g="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let $=t.alpha===1?"":"value *= uniforms.alpha;",b=z("a",e[0].dataType,e[0].dims),w=z("b",e[1].dataType,e[1].dims),x=b.type.value,v=null,k=[b,w];e.length===3&&(v=z("c",e[2].dataType,e[2].dims.length),k.push(v));let S=D("output",e[0].dataType,o.length);k.push(S);let E=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${m.registerUniforms(E).declareVariables(...k)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${x}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${g}
    }

    ${$}
    ${v!=null?`let cOffset = ${v.broadcastedIndicesToOffset("vec2(m, n)",S)}; value += ${x}(uniforms.beta) * ${v.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},_=m=>{let g=z("a",e[0].dataType,e[0].dims),$=z("b",e[1].dataType,e[1].dims),b=null,w=[g,$];e.length===3&&(b=z("c",e[2].dataType,e[2].dims.length),w.push(b));let x=D("output",e[0].dataType,o.length);w.push(x);let v=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],k="",S="";t.transA&&t.transB?(S=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${g.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,k="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(S=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${g.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,k="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(S=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${g.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,k="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(S=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${g.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,k="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let E=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${m.registerUniforms(v).declareVariables(...w)}
  var<workgroup> tile_a: array<array<${g.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${$.type.storage}, ${u}>, ${u}>;
  ${m.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${x.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${S}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${k}
      }
      workgroupBarrier();
    }

    ${E}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${b!=null?`let cOffset = ${b.broadcastedIndicesToOffset("vec2(m, n)",x)}; value += ${x.type.value}(uniforms.beta) * ${b.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return p?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:l*d},programUniforms:h}),getShaderSource:_}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:y}},el=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},tl=(e,t)=>{Yu(e.inputs),e.compute(Ju(e.inputs,t))}}),Me,Ue,it,nt,rl,il,nl,al,sl,ol,ul,ll,dl,pl,Xc=C(()=>{"use strict";G(),j(),ae(),K(),[Me,Ue,it,nt]=[0,1,2,3],rl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},il=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,nl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,al=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,sl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,ol=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Me}] = batch;
     indices[${Ue}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${it}] = u32(r);
            indices[${nt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${it}] = u32(clamp(r, 0, H - 1));
          indices[${nt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${it}] = gs_reflect(r, border[1], border[3]);
          indices[${nt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,ul=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Me}], indices[${Ue}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Me}], indices[${Ue}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Me}], indices[${Ue}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Me}], indices[${Ue}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Me}], indices[${Ue}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Me}], indices[${Ue}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,ll=(e,t)=>{let r=z("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=z("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Me,Ue,it,nt]=[0,3,1,2]);let s=D("output",e[0].dataType,a.length),o=r.type.value,u=T.size(a),l=[{type:12,data:u},...q(e[0].dims,i,a)],d=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${il}
  ${nl(o)}
  ${al(t)}
  ${sl(t)}
  ${ol(r,o,t)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${it}]);
      let W_in = i32(uniforms.x_shape[${nt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Me}], indices[${it}], indices[${nt}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${ul(s,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:p=>{let c=T.size(a);return{outputs:[{dims:a,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l}},getShaderSource:d}},dl=(e,t)=>{rl(e.inputs),e.compute(ll(e.inputs,t))},pl=e=>J({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),fe,cl,hl,Mi,fl,Tt,ml,gl=C(()=>{"use strict";G(),j(),ae(),Hr(),ii(),K(),qe(),fe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,cl=(e,t)=>{let r=e[0],i=fe(e,1),n=fe(e,2),a=fe(e,3),s=fe(e,4),o=fe(e,5),u=fe(e,6),l=fe(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let d=r.dims[0],p=r.dims[1],c=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],h=p,f=0,y=0,_=Math.floor(c/t.numHeads);if(u&&l&&T.size(u.dims)&&T.size(l.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[3]!==_)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==d||l.dims[1]!==t.numHeads||l.dims[3]!==_)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');f=u.dims[2],y=u.dims[2]}else if(u&&T.size(u.dims)||l&&T.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let m;if(i&&T.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');m=2,h=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');m=5,h=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=0,h=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');m=3}if(a&&T.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let g=f+h,$=0;if(s&&T.size(s.dims)>0){$=8;let v=s.dims;throw v.length===1?v[0]===d?$=1:v[0]===3*d+2&&($=3):v.length===2&&v[0]===d&&v[1]===g&&($=5),$===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let b=!1,w=c;if(n&&T.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(h!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');w=n.dims[2]}else{if(h!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');w=n.dims[1]*n.dims[3],b=!0}}let x=!1;if(s&&T.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(o&&T.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==d||o.dims[1]!==t.numHeads||o.dims[2]!==p||o.dims[3]!==g)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:p,pastSequenceLength:f,kvSequenceLength:h,totalSequenceLength:g,maxSequenceLength:y,inputHiddenSize:0,hiddenSize:c,vHiddenSize:w,headSize:_,vHeadSize:Math.floor(w/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:$,scale:t.scale,broadcastResPosBias:x,passPastInKv:b,qkvFormat:m}},hl=e=>J({...e}),Mi=J({perm:[0,2,1,3]}),fl=(e,t,r,i,n,a,s)=>{let o=[i,n,a],u=T.size(o),l=[{type:12,data:u},{type:12,data:s},{type:12,data:a}],d=p=>{let c=D("qkv_with_bias",t.dataType,o),h=z("qkv",t.dataType,o),f=z("bias",r.dataType,o),y=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${p.registerUniforms(y).declareVariables(h,f,c)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d},{inputs:[t,r],outputs:[-1]})[0]},Tt=(e,t,r,i,n,a,s,o)=>{let u=a;if(s&&T.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=fl(e,a,s,t,i,r*n,o),u=u.reshape([t,i,r,n]),r===1||i===1?u:e.compute(be(u,Mi.perm),{inputs:[u],outputs:[-1]})[0]}else return a.dims.length===3&&(u=a.reshape([t,i,r,n])),r===1||i===1?u:e.compute(be(u,Mi.perm),{inputs:[u],outputs:[-1]})[0]},ml=(e,t)=>{let r=cl(e.inputs,t),i=e.inputs[0],n=fe(e.inputs,1),a=fe(e.inputs,2),s=fe(e.inputs,3),o=fe(e.inputs,4),u=fe(e.inputs,5),l=fe(e.inputs,6),d=fe(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let p=n&&a&&n.dims.length===4&&a.dims.length===4,c=Tt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(p)return bt(e,c,n,a,o,void 0,l,d,u,r);if(!n||!a)throw new Error("key and value must be provided");let h=Tt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),f=Tt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);bt(e,c,h,f,o,void 0,l,d,u,r)}}),yl,_l,$l,wl,Ai,bl,vl,xl=C(()=>{"use strict";G(),j(),ae(),K(),yl=e=>{if(!e||e.length<1)throw new Error("too few inputs")},_l=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),J({numOutputs:i,axis:t.axis,splitSizes:r})},$l=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${P("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,wl=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Ai=(e,t)=>{let r=e[0].dims,i=T.size(r),n=e[0].dataType,a=T.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),o=z("input",n,r.length),u=new Array(t.numOutputs),l=[],d=[],p=0,c=[{type:12,data:i}];for(let f=0;f<t.numOutputs;f++){p+=t.splitSizes[f],u[f]=p;let y=r.slice();y[a]=t.splitSizes[f],d.push(y),s[f]=D(`output${f}`,n,y.length),l.push({dims:d[f],dataType:e[0].dataType})}c.push({type:12,data:u},...q(r,...d));let h=f=>`
  ${f.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(o,...s)}
  ${$l(u.length)}
  ${wl(s)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${P("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${o.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:h,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c})}},bl=(e,t)=>{yl(e.inputs);let r=e.inputs.length===1?t:_l(e.inputs,t);e.compute(Ai(e.inputs,r),{inputs:[0]})},vl=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return J({axis:t,numOutputs:i,splitSizes:r})}}),kl,rr,Sl,Il=C(()=>{"use strict";G(),j(),ae(),K(),kl=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!T.areEqual(i.dims,[])&&!T.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!T.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],l=r.dims[r.dims.length-2],d=n.dims[0],p=T.sizeFromDimension(r.dims,1)/l,c=o===0?n.dims[1]*2:p/s;if(o>c)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(l!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(l>d)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(c/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},rr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],o=T.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],l=o/u,d=e[2].dims[1],p=n===0?d*2:l/i,c=new Array(s,u,l/p,p-d),h=T.computeStrides(c),f=[{type:1,data:a},{type:12,data:c},{type:12,data:h},...e[0].dims.length===3?new Array({type:12,data:[o,l,p,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,p,u*p,1]}):[],...q(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],y=_=>{let m=z("input",e[0].dataType,e[0].dims.length),g=z("position_ids",e[1].dataType,e[1].dims.length),$=z("cos_cache",e[2].dataType,e[2].dims.length),b=z("sin_cache",e[3].dataType,e[3].dims.length),w=D("output",e[0].dataType,e[0].dims.length);return _.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:c.length},{name:"global_strides",type:"u32",length:h.length},{name:"input_output_strides",type:"u32",length:h.length}]),`
        ${_.declareVariables(m,g,$,b,w)}

        ${_.mainStart(ct)}
          let half_rotary_emb_dim = uniforms.${$.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${g.broadcastedIndicesToOffset("bsnh.xy",D("",g.type.tensor,2))};
            let position_id =
                u32(${g.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${m.getByOffset("i")} * ${$.get("position_id","bsnh[3]")} -
                ${m.getByOffset("j")} * ${b.get("position_id","bsnh[3]")};
            ${w.setByOffset("i","re")}
            let im = ${m.getByOffset("i")} * ${b.get("position_id","bsnh[3]")} +
                ${m.getByOffset("j")} * ${$.get("position_id","bsnh[3]")};
            ${w.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${w.setByOffset("k",m.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:J({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(T.size(c)/ct)},programUniforms:f})}},Sl=(e,t)=>{kl(e.inputs,t),e.compute(rr(e.inputs,t))}}),Tl,zl,Bi,El,Cl,Zc=C(()=>{"use strict";ae(),G(),ii(),gl(),xl(),qe(),Il(),K(),Tl=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],l=r.dims[1],d=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],p=l,c=0,h=!i||i.dims.length===0,f=Math.floor(h?d/(t.numHeads+2*t.kvNumHeads):d/t.numHeads);h&&(d=f*t.numHeads);let y=a&&a.dims.length!==0,_=s&&s.dims.length!==0;if(y&&a.dims.length===4&&a.dims[0]===u&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===f)throw new Error("BSNH pastKey/pastValue is not supported");if(y&&_){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');c=a.dims[2]}else if(y||_)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let m=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');p=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==f)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');p=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==f)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');m=3}let g=0,$=!1,b=t.kvNumHeads?f*t.kvNumHeads:d;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(p!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');b=n.dims[2]}else{if(p!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');b=n.dims[1]*n.dims[3],$=!0}}let w=e.length>4?e[5]:void 0;if(w){if(w.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let x=w.dims.reduce((v,k)=>v*k,1);if(x!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${x}.`);for(let v=0;v<w.dims.length;v++)if(w.dims[v]!==1&&w.dims[v]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${v}] = ${w.dims[v]}.`)}return{batchSize:u,sequenceLength:l,pastSequenceLength:c,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:d,vHiddenSize:b,headSize:f,vHeadSize:Math.floor(b/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:g,scale:t.scale,broadcastResPosBias:!1,passPastInKv:$,qkvFormat:m}},zl=J({perm:[0,2,1,3]}),Bi=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(be(i,zl.perm),{inputs:[i],outputs:[-1]})[0]),i},El=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],l=d=>{let p=z("seq_lens",r.dataType,r.dims),c=z("total_seq_lens",i.dataType,i.dims),h=D("pos_ids",n,s),f=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${d.registerUniforms(f).declareVariables(p,c,h)}
  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${c.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${p.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${h.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:l}},Cl=(e,t)=>{var b;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=Tl(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((b=e.inputs[1])==null?void 0:b.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,d=r.kvNumHeads?r.kvNumHeads:r.numHeads,p=J({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,d*r.headSize,d*r.headSize]}),[c,h,f]=!n&&!a?e.compute(Ai([i],p),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],y,_;if(t.doRotary){let w=e.compute(El(r.batchSize,r.sequenceLength,u,l),{inputs:[u,l],outputs:[-1]})[0],x=e.inputs[7],v=e.inputs[8],k=J({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),S=[c,w,x,v],E=[-1];y=e.compute(rr(S,k),{inputs:S,outputs:E})[0],S.splice(0,1,h);let R=J({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});_=e.compute(rr(S,R),{inputs:S,outputs:E})[0]}let m=Tt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?y:c,void 0,0),g=Bi(e,t.doRotary?_:h,r),$=Bi(e,f,r);bt(e,m,g,$,void 0,void 0,s,o,void 0,r,u,l)}}),Oi,Ml,Al,Bl,Qc=C(()=>{"use strict";G(),j(),qe(),K(),Oi=(e,t,r,i,n,a,s,o)=>{let u=se(a),l=u===1?"f32":`vec${u}f`,d=u===1?"vec2f":`mat2x${u}f`,p=n*s,c=64;p===1&&(c=256);let h=[n,s,a/u],f=[n,s,2],y=["rank","type","type"],_=[];_.push(...q(h,f));let m=g=>{let $=z("x",t.dataType,3,u),b=z("scale",r.dataType,r.dims),w=z("bias",i.dataType,i.dims),x=D("output",1,3,2),v=[$,b,w,x];return`
  var<workgroup> workgroup_shared : array<${d}, ${c}>;
  const workgroup_size = ${c}u;
  ${g.declareVariables(...v)}
  ${g.mainStart(c)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${$.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${d}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Pe("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${Pe("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${c}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:f,dataType:1}],dispatchGroup:{x:p},programUniforms:_}),getShaderSource:m},{inputs:[t,r,i],outputs:[-1]})[0]},Ml=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],o=i[1],u=T.sizeFromDimension(i,a),l=se(u),d=T.size(n)/l,p=Oi(e,t[0],t[1],t[2],s,u,o,r.epsilon),c=[s,o,u/l],h=[s,o],f=["type","none"],y=_=>{let m=z("x",t[0].dataType,c.length,l),g=z("scale_shift",1,h.length,2),$=D("output",t[0].dataType,c.length,l),b=[m,g,$];return`
  ${_.registerUniform("output_size","u32").declareVariables(...b)}
  ${_.mainStart()}
  ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${$.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${g.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${m.getByOffset("global_idx")} * ${$.type.value}(scale_shift.x) + ${$.type.value}(scale_shift.y);
      ${$.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:[{type:12,data:d},...q(c,h,c)]}),getShaderSource:y},{inputs:[t[0],p]})},Al=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],o=T.sizeFromDimension(i,1)/s,u=se(s),l=T.size(n)/u,d=[{type:12,data:o},{type:12,data:Math.floor(s/u)}],p=["type","type"],c=!1,h=[0,i.length-1];for(let m=0;m<i.length-2;m++)c=c||i[m+1]!==1,h.push(m+1);c=c&&i[i.length-1]!==1;let f=c?e.compute(be(e.inputs[0],h),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(m,g)=>i[h[g]])),y=Oi(e,f,t[1],t[2],a,o,s,r.epsilon),_=m=>{let g=ue(t[0].dataType),$=u===1?"vec2f":`mat${u}x2f`,b=v=>{let k=v===0?"x":"y",S=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${g}(${S}(scale.${k}))`;case 2:return`vec2<${g}>(${S}(scale[0].${k}, scale[1].${k}))`;case 4:return`vec4<${g}>(${S}(scale[0].${k}, scale[1].${k}, scale[2].${k}, scale[3].${k}))`;default:throw new Error(`Not supported compoents ${u}`)}},w=z("input",t[0].dataType,t[0].dims,u),x=D("output",t[0].dataType,n,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${w.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${$}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${x.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${m.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${b(0)}, ${b(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:_},{inputs:[t[0],y]})},Bl=(e,t)=>{t.format==="NHWC"?Al(e,e.inputs,t):Ml(e,e.inputs,t)}}),Ol,Rl,Dl,Yc=C(()=>{"use strict";G(),j(),K(),Ol=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Rl=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],o=n,u=T.normalizeAxis(t.axis,n.length),l=T.sizeToDimension(n,u),d=T.sizeFromDimension(n,u),p=T.size(a.dims),c=s?T.size(s.dims):0;if(p!==d||s&&c!==d)throw new Error(`Size of X.shape()[axis:] == ${d}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${c}`);let h=[];for(let w=0;w<n.length;++w)w<u?h.push(n[w]):h.push(1);let f=se(d),y=["type","type"],_=[{type:12,data:l},{type:1,data:d},{type:12,data:Math.floor(d/f)},{type:1,data:t.epsilon}];s&&y.push("type");let m=r>1,g=r>2,$=w=>{let x=ue(e[0].dataType),v=[z("x",e[0].dataType,e[0].dims,f),z("scale",a.dataType,a.dims,f)];s&&v.push(z("bias",s.dataType,s.dims,f)),v.push(D("output",e[0].dataType,o,f)),m&&v.push(D("mean_data_output",1,h)),g&&v.push(D("inv_std_output",1,h));let k=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${w.registerUniforms(k).declareVariables(...v)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Zr("f32",f)};
    var mean_square_vector = ${Zr("f32",f)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${ht(x,f,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Pe("mean_vector",f)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Pe("mean_square_vector",f)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${ht(x,f,"x[j + offset]")};
      let f32scale = ${ht(x,f,"scale[j]")};
      output[j + offset] = ${v[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${ht(x,f,"bias[j]")}`:""}
      );
    }

    ${m?"mean_data_output[global_idx] = mean":""};
    ${g?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},b=[{dims:o,dataType:e[0].dataType}];return m&&b.push({dims:h,dataType:1}),g&&b.push({dims:h,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${f};${r};${i}`,inputDependencies:y},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:_}),getShaderSource:$}},Dl=(e,t)=>{Ol(e.inputs),e.compute(Rl(e.inputs,t,e.outputCount))}}),Ul,Nl,Jc=C(()=>{"use strict";j(),pi(),mi(),Ul=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Nl=e=>{Ul(e.inputs);let t=pt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(di(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=T.size(e.inputs[0].dims.slice(0,-2)),s=T.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let o=e.inputs[0].reshape([1,a,i]),u=e.inputs[1].reshape([1,i,r]),l=[1,a,r],d=[o,u];e.compute(Qt(d,{activation:""},t,l),{inputs:d})}else e.compute(Qt(e.inputs,{activation:""},t))}}}),Pl,ql,Ll,Vl,Gl,eh=C(()=>{"use strict";G(),j(),ae(),K(),Pl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!T.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(T.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,l=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(T.size(u)!==l)throw new Error("zeroPoints input size error.")}},ql=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=T.size(o),l=e[1].dims[2]/4,d=e[0].dataType,p=se(t.k),c=se(l),h=se(s),f=o.concat([n,s]),y=n>1&&s/h%2===0?2:1,_=T.size(f)/h/y,m=64,g=[],$=[u,n,a/p],b=T.convertShape(e[1].dims).slice();b.splice(-1,1,l/c),g.push(...q($)),g.push(...q(b)),g.push(...q(e[2].dims)),e.length===4&&g.push(...q(T.convertShape(e[3].dims)));let w=[u,n,s/h];g.push(...q(w));let x=v=>{let k=$.length,S=z("a",e[0].dataType,k,p),E=z("b",12,b.length,c),R=z("scales",e[2].dataType,e[2].dims.length),O=[S,E,R],B=e.length===4?z("zero_points",12,e[3].dims.length):void 0;B&&O.push(B);let F=w.length,X=D("output",e[0].dataType,F,h),V=ue(e[0].dataType),M=(()=>{switch(p){case 1:return`array<${V}, 8>`;case 2:return`mat4x2<${V}>`;case 4:return`mat2x4<${V}>`;default:throw new Error(`${p}-component is not supported.`)}})(),W=Math.floor(32/t.bits),U=Math.floor(W/8),H=()=>{let L="";for(let A=0;A<U;A++){let re=A*t.bits*4,ne=re+t.bits;L+=`
          // reuse a data (pass ${A})
            var input_offset${A>0?A:""} = ${A===0?S.indicesToOffset(`${S.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${A>0?A:""}: ${M};
            for (var j${A>0?A:""}: u32 = 0; j${A>0?A:""} < ${8/p}; j${A>0?A:""}++) {
              a_data${A>0?A:""}[j${A>0?A:""}] = ${S.getByOffset(`input_offset${A>0?A:""}`)};
              input_offset${A>0?A:""}++;
            }
          `;for(let ie=0;ie<h*y;ie++)L+=`
            b_value = ${c===1?`b${ie}_data`:`b${ie}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${A*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${re}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${ne}u) & b_mask);`}
            b_quantized_values = ${M}(${Array.from({length:4},(ge,he)=>`${V}(b_value_lower[${he}]), ${V}(b_value_upper[${he}])`).join(", ")});
            b_dequantized_values = ${p===1?`${M}(${Array.from({length:8},(ge,he)=>`(b_quantized_values[${he}] - ${B?`zero_point${ie}`:"zero_point"}) * scale${ie}`).join(", ")});`:`(b_quantized_values - ${M}(${Array(8).fill(`${B?`zero_point${ie}`:"zero_point"}`).join(",")})) * scale${ie};`};
            workgroup_shared[local_id.x * ${y} + ${Math.floor(ie/h)}]${h>1?`[${ie%h}]`:""} += ${Array.from({length:8/p},(ge,he)=>`${p===1?`a_data${A>0?A:""}[${he}] * b_dequantized_values[${he}]`:`dot(a_data${A>0?A:""}[${he}], b_dequantized_values[${he}])`}`).join(" + ")};
          `}return L},I=()=>{let L=`
            var col_index = col * ${h};
            ${B?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${V}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let A=0;A<h*y;A++)L+=`
            let scale${A} = ${R.getByOffset("col_index * nBlocksPerCol + block")};
            ${B?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${B.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${A} = ${V}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return L},N=()=>{let L=`col_index = col * ${h};`;for(let A=0;A<h*y;A++)L+=`
            let b${A}_data = ${E.getByIndices(`${E.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return L+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${M};
            var b_dequantized_values: ${M};`,L};return`
        var<workgroup> workgroup_shared: array<${X.type.value}, ${y*m}>;
        ${v.declareVariables(...O,X)}
        ${v.mainStart([m,1,1])}
          let output_indices = ${X.offsetToIndices(`(global_idx / ${m}) * ${y}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${m}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/p};
            ${I()}
            for (var word: u32 = 0; word < ${l}; word += ${c}) {
              ${N()}
              for (var i: u32 = 0; i < ${c}; i++) {
                ${H()}
                word_offset += ${W/p};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${y}) {
            var output_value: ${X.type.value} = ${X.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${m}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${y};
            }
            ${X.setByIndices(`${X.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${p};${c};${h};${y};${m}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:f,dataType:d}],dispatchGroup:{x:_},programUniforms:g}),getShaderSource:x}},Ll=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,o=r.slice(0,i-2),u=T.size(o),l=e[1].dims[2]/4,d=e[0].dataType,p=se(t.k),c=se(l),h=o.concat([n,s]),f=128,y=s%8===0?8:s%4===0?4:1,_=f/y,m=Math.floor(32/t.bits),g=_*c*m,$=g/p,b=g/t.blockSize,w=T.size(h)/y,x=[],v=[u,n,a/p],k=T.convertShape(e[1].dims).slice();k.splice(-1,1,l/c),x.push(...q(v)),x.push(...q(k)),x.push(...q(e[2].dims)),e.length===4&&x.push(...q(T.convertShape(e[3].dims)));let S=[u,n,s];x.push(...q(S));let E=R=>{let O=v.length,B=z("a",e[0].dataType,O,p),F=z("b",12,k.length,c),X=z("scales",e[2].dataType,e[2].dims.length),V=[B,F,X],M=e.length===4?z("zero_points",12,e[3].dims.length):void 0;M&&V.push(M);let W=S.length,U=D("output",e[0].dataType,W),H=ue(e[0].dataType),I=()=>{switch(p){case 1:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${p}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${B.type.value}, ${$}>;
        var<workgroup> inter_results: array<array<${U.type.value}, ${_}>, ${y}>;
        ${R.declareVariables(...V,U)}
        ${R.mainStart([_,y,1])}
          let output_indices = ${U.offsetToIndices(`workgroup_index * ${y}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${b} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${$};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${$}; a_offset += ${f})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${B.getByIndices(`${B.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${B.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${b} + local_id.x;
            ${M?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${M.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${H}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${H}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${X.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${F.getByIndices(`${F.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/p};
            for (var i: u32 = 0; i < ${c}; i++) {
              let b_value = ${c===1?"b_data":"b_data[i]"};
              ${(()=>{let N=Math.floor(m/8),L="";for(let A=0;A<N;A++){let re=A*t.bits*4,ne=re+t.bits;L+=`
              ${I()}
              {${t.bits===2?`
                let half_word = b_value >> ${A*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${re}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${ne}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${H}>(${Array.from({length:4},(ie,ge)=>`${H}(b_value_lower[${ge}]), ${H}(b_value_upper[${ge}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${H}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(ie,ge)=>`${`dot(a_data${ge}, b_dequantized_values[${ge}])`}`).join(" + ")};
              }
              word_offset += ${8/p};`}return L})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${y}) {
            var output_value: ${U.type.value} = ${U.type.value}(0);
            for (var b = 0u; b < ${_}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${U.setByIndices(`${U.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${p};${c};${_};${y}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:h,dataType:d}],dispatchGroup:{x:w},programUniforms:x}),getShaderSource:E}},Vl=(e,t)=>{Pl(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Ll(e.inputs,t)):e.compute(ql(e.inputs,t))},Gl=e=>J(e)}),Wl,Fl,Hl,jl,Kl,Xl,Zl,Ql,Yl,th=C(()=>{"use strict";G(),j(),K(),Wl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Fl=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${P("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${P("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${P("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Hl=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${P("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${P("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${P("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${P("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},jl=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${P("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${P("uniforms.x_shape",n,t)})) {
                  k = i32(${P("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${P("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Kl=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${P("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${P("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${P("uniforms.x_shape",n,t)})) {
                  k -= i32(${P("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${P("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Xl=(e,t,r)=>{switch(r.mode){case 0:return Fl(e,t,r.pads.length);case 1:return Hl(e,t,r.pads.length);case 2:return jl(e,t,r.pads.length);case 3:return Kl(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Zl=(e,t)=>{let r=T.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=T.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...q(e[0].dims,r));let o=["rank"],u=l=>{let d=D("output",e[0].dataType,r.length),p=z("x",e[0].dataType,i.length),c=p.type.value,h=Xl(d,i.length,t),f=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&f.push({name:"constant_value",type:s?c:"f32"}),`
            ${l.registerUniforms(f).declareVariables(p,d)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${d.offsetToIndices("global_idx")};

            var value = ${c}(0);
            ${h}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(T.size(r)/64)},programUniforms:a}),getShaderSource:u}},Ql=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)a[Number(o[u])]=Number(r[u]),a[Number(o[u])+n]=Number(r[u+o.length])}else r.forEach((o,u)=>a[Number(u)]=Number(o));let s=[];return a.forEach(o=>s.push(o)),{mode:t.mode,value:i,pads:s}}else return t},Yl=(e,t)=>{Wl(e.inputs);let r=Ql(e.inputs,t);e.compute(Zl(e.inputs,r),{inputs:[0]})}}),zt,Ri,Di,Ui,Ni,Jl,ed,Pi,qi,td,rd,Li,id,nd,Vi,ad,sd,od,ud,rh=C(()=>{"use strict";$e(),G(),j(),K(),zt=e=>{if(te.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Ri=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),o=t.strides.slice(),u=a?t.dilations.slice():[],l=t.pads.slice();Wt.adjustPoolAttributes(r,n,s,o,u,l);let d=Wt.computePoolOutputShape(r,n,o,u,s,l,t.autoPad,t.ceilMode),p=Object.assign({},t);a?Object.assign(p,{kernelShape:s,strides:o,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:s,strides:o,pads:l,cacheKey:t.cacheKey});let c=d.slice();return c.push(c.splice(1,1)[0]),[p,i?c:d]},Di=(e,t)=>{let r=t.format==="NHWC",i=T.size(e),n=T.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],l=t.pads[t.pads.length/2-1],d=t.pads[t.pads.length-1],p=!!(l+d);a.push({type:12,data:o},{type:12,data:u},{type:12,data:l},{type:12,data:d}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let c=!1;if(t.kernelShape.length===2){let h=t.kernelShape[t.kernelShape.length-2],f=t.strides[t.strides.length-2],y=t.pads[t.pads.length/2-2],_=t.pads[t.pads.length-2];c=!!(y+_),a.push({type:12,data:h},{type:12,data:f},{type:12,data:y},{type:12,data:_}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,p,c]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=T.computeStrides(t.kernelShape);a.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((l,d)=>l+d);return[a,s,!!u,!1,!1]}},Ui=(e,t,r,i,n,a,s,o,u,l,d,p)=>{let c=n.format==="NHWC",h=t.type.value,f=D("output",t.type.tensor,i);if(n.kernelShape.length<=2){let y="",_="",m="",g=r-(c?2:1);if(d?y=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${g}] < 0 || xIndices[${g}]
                      >= uniforms.x_shape[${g}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:y=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let $=r-(c?3:2);p?_=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${$}] < 0 || xIndices[${$}] >= uniforms.x_shape[${$}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:_=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sh - uniforms.phStart + j;
                `,m=`
              }
            `}return`
            ${e.registerUniforms(u).declareVariables(t,f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var value = ${h}(${o});
              var pad = 0;
              ${_}
              ${y}
              ${m}
              ${s}

              output[global_idx] = value;
            }`}else{if(c)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let y=n.kernelShape.length,_=n.pads.length,m="";return l?m=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:m=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(u).declareVariables(t,f)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${f.offsetToIndices("global_idx")};
              var xIndices = ${f.offsetToIndices("global_idx")};

              var offsets: array<u32, ${y}>;

              var value = ${h}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${y-1}u; j++) {
                  offsets[j] = offset / ${P("uniforms.kernelStrides","j",y)};
                  offset -= offsets[j] * ${P("uniforms.kernelStrides","j",y)};
                }
                offsets[${y-1}] = offset;

                isPad = false;
                for (var j = ${r-y}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${P("uniforms.strides",`j - ${r-y}u`,y)}
                    + offsets[j - ${r-y}u] - ${P("uniforms.pads","j - 2u",_)};
                  ${m}
              }
              ${s}

              output[global_idx] = value;
            }`}},Ni=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Jl=e=>`${Ni(e)};${e.countIncludePad}`,ed=e=>`${Ni(e)};${e.storageOrder};${e.dilations}`,Pi=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),qi=(e,t,r,i)=>{let[n,a]=Ri(t,i,r),s=z("x",t.dataType,t.dims.length),o=s.type.value,u="value += x_val;",l="";n.countIncludePad?l+=`value /= ${o}(uniforms.kernelSize);`:l+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[d,p,c,h,f]=Di(a,n);d.push(...q(t.dims,a));let y=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${c};${h};${f}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(T.size(a)/64)},programUniforms:d}),getShaderSource:_=>Ui(_,s,t.dims.length,a.length,n,u,l,0,p,c,h,f)}},td=e=>{let t=e.count_include_pad!==0,r=Pi(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Jl(i)}},rd=(e,t)=>{zt(e.inputs),e.compute(qi("AveragePool",e.inputs[0],!1,t))},Li={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},id=e=>{let t=e.format;return{format:t,...Li,cacheKey:t}},nd=(e,t)=>{zt(e.inputs),e.compute(qi("GlobalAveragePool",e.inputs[0],!0,t))},Vi=(e,t,r,i)=>{let[n,a]=Ri(t,i,r),s=`
      value = max(x_val, value);
    `,o="",u=z("x",t.dataType,t.dims.length),l=["rank"],[d,p,c,h,f]=Di(a,n);return d.push(...q(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${c};${h};${f}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(T.size(a)/64)},programUniforms:d}),getShaderSource:y=>Ui(y,u,t.dims.length,a.length,n,s,o,t.dataType===10?-65504:-1e5,p,c,h,f)}},ad=(e,t)=>{zt(e.inputs),e.compute(Vi("MaxPool",e.inputs[0],!1,t))},sd=e=>{let t=e.storage_order,r=e.dilations,i=Pi(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:ed(n)}},od=e=>{let t=e.format;return{format:t,...Li,cacheKey:t}},ud=(e,t)=>{zt(e.inputs),e.compute(Vi("GlobalMaxPool",e.inputs[0],!0,t))}}),ld,dd,pd,cd,ih=C(()=>{"use strict";G(),j(),ae(),K(),ld=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},dd=(e,t)=>{let r=T.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,o=T.size(a),u=i===3||i===2,l=u?[Math.ceil(T.size(e[0].dims)/4)]:e[0].dims,d=e[1].dims,p=e.length>2?e[2]:void 0,c=p?u?[Math.ceil(T.size(p.dims)/4)]:p.dims:void 0,h=d.length===0||d.length===1&&d[0]===1,f=h===!1&&d.length===1,y=se(o),_=h&&(!u||y===4),m=_?y:1,g=_&&!u?y:1,$=z("input",u?12:i,l.length,g),b=z("scale",s,d.length),w=p?z("zero_point",u?12:i,c.length):void 0,x=D("output",s,a.length,m),v=[$,b];w&&v.push(w);let k=[l,d];p&&k.push(c);let S=[{type:12,data:o/m},{type:12,data:r},{type:12,data:t.blockSize},...q(...k,a)],E=R=>{let O=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${R.registerUniforms(O).declareVariables(...v,x)}
      ${R.mainStart()}
          ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${x.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${$.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${m===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${$.getByOffset("global_idx")};`};

          // Set scale input
          ${h?`let scale_value= ${b.getByOffset("0")}`:f?`
            let scale_index = ${x.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${b.getByOffset("scale_index")};`:`
            var scale_indices: ${b.type.indices} = output_indices;
            let index = ${b.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${b.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${b.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${w?h?u?`
                let zero_point_input = ${w.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${w.getByOffset("0")}`:f?u?`
                let zero_point_index = ${x.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${w.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${x.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${w.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${b.indicesToOffset("scale_indices")};
                let zero_point_input = ${w.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${w.getByIndices("scale_indices")};`:`let zero_point_value = ${u?n?"i32":"u32":$.type.value}(0);`};
      // Compute and write output
      ${x.setByOffset("global_idx",`${x.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getShaderSource:E,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(o/m/64),y:1,z:1},programUniforms:S})}},pd=(e,t)=>{ld(e.inputs,t),e.compute(dd(e.inputs,t))},cd=e=>J({axis:e.axis,blockSize:e.blockSize})}),hd,fd,md,nh=C(()=>{"use strict";$e(),G(),K(),hd=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},fd=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,o=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...q(a)],u=l=>{let d=D("output",i,a.length),p=d.type.value,c=[{name:"outputSize",type:"u32"},{name:"start",type:p},{name:"delta",type:p}];return`
        ${l.registerUniforms(c).declareVariables(d)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${p}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:o})}},md=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),te.webgpu.validateInputContent&&hd(t,r,i),e.compute(fd(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),gd,yd,_d,$d,ah=C(()=>{"use strict";G(),j(),ae(),K(),gd=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${a}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},yd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(T.sizeToDimension(i,i.length-1)/a),o=i[i.length-1],u=T.sizeFromDimension(r,o),l=[{type:12,data:s},{type:12,data:o},{type:12,data:u},...q(e[1].dims,e[2].dims,n)],d=p=>{let c=z("indices",e[1].dataType,e[1].dims.length),h=z("updates",e[2].dataType,e[2].dims.length,a),f=t.reduction!=="none"&&t.reduction!==""?ya("output",e[0].dataType,n.length):D("output",e[0].dataType,n.length,a);return`
      ${p.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(c,h,f)}
      ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${gd(t.reduction,"output[data_offset + i]","value",f.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:l}),getShaderSource:d}},_d=e=>J({reduction:e.reduction}),$d=(e,t)=>{e.compute(yd(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),wd,bd,vd,Gi,xd,kd,Sd,Id,Td,zd,Ed,Cd,Wi,Md,Ad,Bd,Od,Rd,Dd,Ud,sh=C(()=>{"use strict";G(),j(),ae(),K(),wd=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},bd=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},vd=(e,t,r,i,n,a)=>{let[s,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(d=>a.push(d));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(d=>i.push(d)),i.length!==0&&i.length!==l&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");wd(i,t),t.axes.length>0&&bd(i,t.axes,l).forEach((d,p)=>i[p]=d)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(d=>n.push(Number(d))),n.length!==0&&n.length!==l&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},Gi=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,xd=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Gi("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Gi("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",kd=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Sd=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},Id=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},Td=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},zd=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${P("uniforms.scales","i",i)};
        var roi_low = ${P("uniforms.roi","i",n)};
        var roi_hi = ${P("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${P("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${P("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Ed=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${P("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${P("uniforms.roi","i",a)};
          var roi_hi = ${P("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${P("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${P("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Cd=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${P("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Wi=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Md=(e,t,r,i,n)=>{let[a,s,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${Wi(e,u,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${s}];
      var col:${l} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${u}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Ad=(e,t,r,i,n,a,s,o,u,l)=>{let d=r.length===2,p=!0,[c,h]=d?[0,1]:p?[2,3]:[1,2],f=e.type.value,y=_=>{let m=_===c?"row":"col";return`
      fn ${m}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
        var output_index = ${t.indicesGet("output_indices",_)};
        var originalIdx: ${f} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[_]},
        ${i[_]}, ${r[_]}, ${a[_]}, ${a[_]} + ${r.length});
        var fractOriginalIdx: ${f} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[_]} - 1))) {
          return ${u};
        }
        var data: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${m}: ${f} = originalIdx + ${f}(i);
          if (${m} < 0 || ${m} >= ${r[_]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${u};`:`${m} = max(0, min(${m}, ${r[_]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",_,`u32(${m})`)};
          data[i + 1] = ${_===c?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${y(c)};
    ${y(h)};
  fn getCubicInterpolationCoefs(s: ${f}) -> array<${f}, 4> {
    var absS = abs(s);
    var coeffs: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${f} = 1.0 - absS;
    var twoMinusAbsS: ${f} = 2.0 - absS;
    var onePlusAbsS: ${f} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${f}, 4>, coefs: array<${f}, 4>) -> ${f} {
    var coefsSum: ${f} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${f} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Bd=(e,t,r,i,n)=>{let[a,s,o,u,l]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(width, ${r[u]} - 1))`)};
      ${Wi(e,l,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${d} = originalIndices[${s}];
      var height:${d} = originalIndices[${o}];
      var width:${d} = originalIndices[${u}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[u]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[u]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${d} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${d} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${d} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${d} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${d} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${d} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${d} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${d} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${d} = abs(depth - ${d}(depth1));
      var dx2: ${d} = abs(${d}(depth2) - depth);
      var dy1: ${d} = abs(height - ${d}(height1));
      var dy2: ${d} = abs(${d}(height2) - height);
      var dz1: ${d} = abs(width - ${d}(width1));
      var dz2: ${d} = abs(${d}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Od=(e,t,r,i,n,a)=>{let s=e.dims,o=Sd(a,t.axes,s.length),u=Id(s,i,n,t.axes),l=i.slice();i.length===0&&(l=s.map((g,$)=>g===0?1:u[$]/g),t.keepAspectRatioPolicy!=="stretch"&&(u=Td(s,l,t)));let d=D("output",e.dataType,u.length),p=z("input",e.dataType,s.length),c=T.size(u),h=s.length===u.length&&s.every((g,$)=>g===u[$]),f=t.coordinateTransformMode==="tf_crop_and_resize",y=t.extrapolationValue,_=p.type.value,m=g=>`
      ${h?"":`
      ${xd(t.coordinateTransformMode,_)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Cd(p,s)};
              ${kd(t.nearestMode,r,_)};
              ${Ed(p,d,s,u,l.length,o.length,f)};
              `;case"linear":return`
              ${zd(d,s,u,l.length,o.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${Md(p,d,s,f,y)}`;if(s.length===3||s.length===5)return`${Bd(p,d,s,f,y)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Ad(p,d,s,u,l,o,t.cubicCoeffA,f,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${g.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",o.length).declareVariables(p,d)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${h?"output[global_idx] = input[global_idx];":`
        let output_indices = ${d.offsetToIndices("global_idx")};
        var input_indices: ${p.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${p.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${l.length>0?t.mode==="cubic"?l:l.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${h}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},{type:1,data:l},{type:1,data:o},...q(s,u)]})}},Rd=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Dd=(e,t)=>{let r=[],i=[],n=[],a=Rd(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");vd(e.inputs,t,a,r,i,n),e.compute(Od(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Ud=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,l=e.nearestMode===""?"simple":e.nearestMode;return J({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:o,mode:u,nearestMode:l})}}),Nd,Pd,qd,oh=C(()=>{"use strict";G(),j(),K(),Nd=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Pd=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=T.size(a),o=a,u=s,l=a.slice(-1)[0],d=i?a.slice(0,-1).concat(1):[],p=!n&&e.length>3,c=e.length>4,h=i&&r>1,f=i&&r>2,y=r>3,_=64,m=se(l),g=[{type:12,data:u},{type:12,data:m},{type:12,data:l},{type:1,data:t.epsilon}],$=w=>{let x=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],v=[z("x",e[0].dataType,e[0].dims,m),z("skip",e[1].dataType,e[1].dims,m),z("gamma",e[2].dataType,e[2].dims,m)];p&&v.push(z("beta",e[3].dataType,e[3].dims,m)),c&&v.push(z("bias",e[4].dataType,e[4].dims,m)),v.push(D("output",e[0].dataType,o,m)),h&&v.push(D("mean_output",1,d)),f&&v.push(D("inv_std_output",1,d)),y&&v.push(D("input_skip_bias_sum",e[0].dataType,o,m));let k=ue(e[0].dataType),S=ue(1,m);return`

      ${w.registerUniforms(x).declareVariables(...v)}
      var<workgroup> sum_shared : array<${S}, ${_}>;
      var<workgroup> sum_squared_shared : array<${S}, ${_}>;

      ${w.mainStart([_,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${_};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${_};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${_-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${c?"bias[offset1d + i]":k+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${y?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${ht(k,m,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${_};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Pe("sum",m)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Pe("square_sum",m)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${h?"mean_output[global_idx] = mean;":""}
        ${f?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${k}(mean)`}) *
            ${k}(inv_std_dev) * gamma[offset1d + i]
            ${p?"+ beta[offset1d + i]":""};
        }
      }`},b=[{dims:o,dataType:e[0].dataType}];return r>1&&b.push({dims:d,dataType:1}),r>2&&b.push({dims:d,dataType:1}),r>3&&b.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${m};${h};${f};${y}`,inputDependencies:e.map((w,x)=>"type")},getShaderSource:$,getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:g})}},qd=(e,t)=>{Nd(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Pd(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Ld,Et,Vd,Fi,Gd,Wd,Fd,Hd,uh=C(()=>{"use strict";G(),j(),ae(),K(),Ld=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Et=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Vd=(e,t)=>{if(e.length>1){let r=Et(e,1),i=Et(e,2),n=Et(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),J({starts:r,ends:i,axes:n})}else return t},Fi=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},Gd=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${P("uniforms.input_shape","i",r.length)};
            let steps_i = ${P("uniforms.steps","i",r.length)};
            let signs_i = ${P("uniforms.signs","i",r.length)};
            let starts_i = ${P("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Wd=(e,t)=>{let r=e[0].dims,i=T.size(r),n=t.axes.length>0?T.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=Et(e,4);a.forEach(m=>m!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map((m,g)=>Fi(m,g,r,n,a)),o=t.ends.map((m,g)=>Fi(m,g,r,n,a));if(n.length!==s.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let m=0;m<r.length;++m)n.includes(m)||(s.splice(m,0,0),o.splice(m,0,r[m]),a.splice(m,0,1));let u=a.map(m=>Math.sign(m));a.forEach((m,g,$)=>{if(m<0){let b=(o[g]-s[g])/m,w=s[g],x=w+b*a[g];s[g]=x,o[g]=w,$[g]=-m}});let l=r.slice(0);n.forEach((m,g)=>{l[m]=Math.ceil((o[m]-s[m])/a[m])});let d={dims:l,dataType:e[0].dataType},p=D("output",e[0].dataType,l.length),c=z("input",e[0].dataType,e[0].dims.length),h=T.size(l),f=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:a.length}],y=[{type:12,data:h},{type:12,data:s},{type:6,data:u},{type:12,data:a},...q(e[0].dims,l)],_=m=>`
      ${m.registerUniforms(f).declareVariables(c,p)}
        ${Gd(c,p,r)}
        ${m.mainStart()}
          ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${p.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${p.setByOffset("global_idx",c.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:[d],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:y})}},Fd=(e,t)=>{Ld(e.inputs,t);let r=Vd(e.inputs,t);e.compute(Wd(e.inputs,r),{inputs:[0]})},Hd=e=>{let t=e.starts,r=e.ends,i=e.axes;return J({starts:t,ends:r,axes:i})}}),jd,Kd,Xd,Zd,lh=C(()=>{"use strict";G(),j(),ae(),qe(),K(),jd=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Kd=(e,t)=>{let r=e.inputs[0],i=r.dims,n=T.size(i),a=i.length,s=T.normalizeAxis(t.axis,a),o=s<i.length-1,u,l=[];o?(l=Array.from({length:a},(v,k)=>k),l[s]=a-1,l[a-1]=s,u=e.compute(be(r,l),{inputs:[r],outputs:[-1]})[0]):u=r;let d=u.dims,p=d[a-1],c=n/p,h=se(p),f=p/h,y=64;c===1&&(y=256);let _=(v,k)=>k===4?`max(max(${v}.x, ${v}.y), max(${v}.z, ${v}.w))`:k===2?`max(${v}.x, ${v}.y)`:k===3?`max(max(${v}.x, ${v}.y), ${v}.z)`:v,m=z("x",u.dataType,u.dims,h),g=D("result",u.dataType,u.dims,h),$=m.type.value,b=ue(u.dataType)==="f32"?`var threadMax = ${$}(-3.4028234663852886e+38f);`:`var threadMax = ${$}(-65504.0h);`,w=v=>`
      var<workgroup> rowMaxShared : ${$};
      var<workgroup> rowSumShared : ${$};
      var<workgroup> threadShared : array<${$}, ${y}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${$} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${$}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${v.registerUniform("packedCols","i32").declareVariables(m,g)}
      ${v.mainStart(y)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${y};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${b}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${$}(${_("threadShared[0]",h)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${$}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${$}(${Pe("threadShared[0]",h)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${$}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,x=e.compute({name:"Softmax",shaderCache:{hint:`${h};${y}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:d,dataType:u.dataType}],dispatchGroup:{x:c},programUniforms:[{type:6,data:f}]}),getShaderSource:w},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(be(x,l),{inputs:[x]})},Xd=(e,t)=>{jd(e.inputs),Kd(e,t)},Zd=e=>J({axis:e.axis})}),Hi,Qd,Yd,Jd,ep,dh=C(()=>{"use strict";G(),j(),K(),Hi=e=>Array.from(e.getBigInt64Array(),Number),Qd=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Hi(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Yd=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Jd=(e,t)=>{let r=e[0].dims,i=t??Hi(e[1]),n=Yd(r,i),a=T.size(n),s=e[0].dataType,o=z("input",s,r.length),u=D("output",s,n.length),l=d=>`
      const inputShape = ${o.indices(...r)};
      ${d.registerUniform("output_size","u32").declareVariables(o,u)}
      ${d.mainStart()}
      ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...q(e[0].dims,n)]}),getShaderSource:l}},ep=e=>{Qd(e.inputs),e.compute(Jd(e.inputs),{inputs:[0]})}}),tp,rp,ip,ph=C(()=>{"use strict";G(),j(),K(),tp=(e,t,r,i,n)=>{let a=D("output_data",n,r.length,4),s=z("a_data",t[1].dataType,t[1].dims.length,4),o=z("b_data",t[2].dataType,t[2].dims.length,4),u=z("c_data",t[0].dataType,t[0].dims.length,4),l,d=(p,c,h)=>`select(${c}, ${p}, ${h})`;if(!i)l=a.setByOffset("global_idx",d(s.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let p=(c,h,f="")=>{let y=`a_data[index_a${h}][component_a${h}]`,_=`b_data[index_b${h}][component_b${h}]`,m=`bool(c_data[index_c${h}] & (0xffu << (component_c${h} * 8)))`;return`
            let output_indices${h} = ${a.offsetToIndices(`global_idx * 4u + ${h}u`)};
            let offset_a${h} = ${s.broadcastedIndicesToOffset(`output_indices${h}`,a)};
            let offset_b${h} = ${o.broadcastedIndicesToOffset(`output_indices${h}`,a)};
            let offset_c${h} = ${u.broadcastedIndicesToOffset(`output_indices${h}`,a)};
            let index_a${h} = offset_a${h} / 4u;
            let index_b${h} = offset_b${h} / 4u;
            let index_c${h} = offset_c${h} / 4u;
            let component_a${h} = offset_a${h} % 4u;
            let component_b${h} = offset_b${h} % 4u;
            let component_c${h} = offset_c${h} % 4u;
            ${c}[${h}] = ${f}(${d(y,_,m)});
          `};n===9?l=`
            var data = vec4<u32>(0);
            ${p("data",0,"u32")}
            ${p("data",1,"u32")}
            ${p("data",2,"u32")}
            ${p("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${p("output_data[global_idx]",0)}
            ${p("output_data[global_idx]",1)}
            ${p("output_data[global_idx]",2)}
            ${p("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,s,o,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},rp=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(T.areEqual(t,r)&&T.areEqual(r,i)),s=t,o=T.size(t);if(a){let l=pt.calcShape(pt.calcShape(t,r,!1),i,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,o=T.size(s)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>tp(l,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...q(i,t,r,s)]})}},ip=e=>{e.compute(rp(e.inputs))}}),np,ch=C(()=>{"use strict";Sc(),ii(),Ic(),Tc(),zc(),Ec(),Cc(),Rc(),Uc(),Nc(),Pc(),qc(),Lc(),Vc(),Gc(),Wc(),Fc(),Hc(),jc(),Kc(),Xc(),Zc(),Qc(),Yc(),Jc(),eh(),gl(),th(),rh(),ih(),nh(),ah(),ei(),sh(),Il(),oh(),uh(),lh(),xl(),dh(),qe(),oi(),ph(),np=new Map([["Abs",[Cs]],["Acos",[Ms]],["Acosh",[As]],["Add",[bo]],["ArgMax",[ms,ri]],["ArgMin",[fs,ri]],["Asin",[Bs]],["Asinh",[Os]],["Atan",[Rs]],["Atanh",[Ds]],["Attention",[bs]],["AveragePool",[rd,td]],["BatchNormalization",[Ss]],["BiasAdd",[zs]],["BiasSplitGelu",[_o]],["Cast",[Ns,Us]],["Ceil",[Ls]],["Clip",[qs]],["Concat",[Bo,Oo]],["Conv",[wi,_i]],["ConvTranspose",[ou,nu]],["Cos",[Vs]],["Cosh",[Gs]],["CumSum",[lu,du]],["DepthToSpace",[fu,mu]],["DequantizeLinear",[pd,cd]],["DFT",[vu,xu]],["Div",[vo]],["Einsum",[Eu,Cu]],["Elu",[Ws,vt]],["Equal",[xo]],["Erf",[Fs]],["Exp",[Hs]],["Expand",[Ou]],["FastGelu",[Du]],["Floor",[js]],["FusedConv",[wi,_i]],["Gather",[qu,Pu]],["GatherElements",[Qu,Zu]],["GatherBlockQuantized",[Hu,ju]],["GatherND",[Vu,Gu]],["Gelu",[Ks]],["Gemm",[tl,el]],["GlobalAveragePool",[nd,id]],["GlobalMaxPool",[ud,od]],["Greater",[To]],["GreaterOrEqual",[Eo]],["GridSample",[dl,pl]],["GroupQueryAttention",[Cl]],["HardSigmoid",[ro,to]],["HardSwish",[io]],["InstanceNormalization",[Bl]],["LayerNormalization",[Dl]],["LeakyRelu",[Xs,vt]],["Less",[zo]],["LessOrEqual",[Co]],["Log",[co]],["MatMul",[Nl]],["MatMulNBits",[Vl,Gl]],["MaxPool",[ad,sd]],["Mul",[ko]],["MultiHeadAttention",[ml,hl]],["Neg",[Qs]],["Not",[Zs]],["Pad",[Yl]],["Pow",[So]],["QuickGelu",[mo,vt]],["Range",[md]],["Reciprocal",[Ys]],["ReduceMin",[ls]],["ReduceMean",[ns]],["ReduceMax",[us]],["ReduceSum",[ps]],["ReduceProd",[ds]],["ReduceL1",[as]],["ReduceL2",[ss]],["ReduceLogSum",[hs]],["ReduceLogSumExp",[os]],["ReduceSumSquare",[cs]],["Relu",[Js]],["Resize",[Dd,Ud]],["RotaryEmbedding",[Sl]],["ScatterND",[$d,_d]],["Sigmoid",[eo]],["Sin",[no]],["Sinh",[ao]],["Slice",[Fd,Hd]],["SkipLayerNormalization",[qd]],["Split",[bl,vl]],["Sqrt",[so]],["Softmax",[Xd,Zd]],["Sub",[Io]],["Tan",[oo]],["Tanh",[uo]],["ThresholdedRelu",[po,vt]],["Tile",[ep]],["Transpose",[Sa,Ia]],["Where",[ip]]])}),ap,hh=C(()=>{"use strict";$e(),Re(),K(),ap=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){ve(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let l of t)o.push({binding:o.length,resource:{buffer:l.buffer}});for(let l of r)o.push({binding:o.length,resource:{buffer:l.buffer}});n&&o.push({binding:o.length,resource:n});let u=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let l={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(l)}s.setPipeline(e.computePipeline),s.setBindGroup(0,u),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),ye(e.programInfo.name)}dispose(){}build(e,t){ve(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(l=>{r.features.has(l.feature)&&i.push(`enable ${l.extension};`)});let n=$a(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,o=r.createShaderModule({code:s,label:e.name});Z("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return ye(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),sp={};gt(sp,{WebGpuBackend:()=>dp});var op,up,lp,dp,fh=C(()=>{"use strict";$e(),G(),Re(),na(),xc(),ch(),hh(),op=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},up=(e,t,r)=>{var n,a;let i=e.name;return(n=e.shaderCache)!=null&&n.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${op(t,((a=e.shaderCache)==null?void 0:a.inputDependencies)??new Array(t.length).fill("dims"))}`,i},lp=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},dp=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new lp(s),this.gpuDataManager=ma(this),this.programManager=new ap(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Nr(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;ve(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let a=r[n],s=a.kernelId,o=this.kernels.get(s),u=o.kernelType,l=o.kernelName,d=a.programName,p=a.inputTensorViews,c=a.outputTensorViews,h=t[n*2],f=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=h);let y=Number(h-this.queryTimeBase),_=Number(f-this.queryTimeBase);if(!Number.isSafeInteger(y)||!Number.isSafeInteger(_))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:p.map(m=>({dims:m.dims,dataType:Oe(m.dataType)})),outputsMetadata:c.map(m=>({dims:m.dims,dataType:Oe(m.dataType)})),kernelId:s,kernelType:u,kernelName:l,programName:d,startTime:y,endTime:_});else{let m="";p.forEach(($,b)=>{m+=`input[${b}]: [${$.dims}] | ${Oe($.dataType)}, `});let g="";c.forEach(($,b)=>{g+=`output[${b}]: [${$.dims}] | ${Oe($.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${l}|${d}" ${m}${g}start time: ${y} ns, execution time: ${_-y} ns`)}Dt("GPU",`${d}::${h}::${f}`)}e.unmap(),this.pendingQueries.delete(e)}),ye()}run(e,t,r,i,n,a){ve(e.name);let s=[];for(let g=0;g<t.length;++g){let $=t[g].data;if($===0)continue;let b=this.gpuDataManager.get($);if(!b)throw new Error(`no GPU data for input: ${$}`);s.push(b)}let{outputs:o,dispatchGroup:u,programUniforms:l}=e.getRunData(t),d=r.length===0?o.map((g,$)=>$):r;if(d.length!==o.length)throw new Error(`Output size ${d.length} must be equal to ${o.length}.`);let p=[],c=[];for(let g=0;g<o.length;++g){if(!Number.isInteger(d[g])||d[g]<-3||d[g]>=a)throw new Error(`Invalid output index: ${d[g]}`);if(d[g]===-3)continue;let $=d[g]===-1,b=d[g]===-2,w=$||b?n(o[g].dataType,o[g].dims):i(d[g],o[g].dataType,o[g].dims);if(p.push(w),w.data===0)continue;let x=this.gpuDataManager.get(w.data);if(!x)throw new Error(`no GPU data for output: ${w.data}`);if($&&this.temporaryData.push(x),b){let v=this.kernelPersistentData.get(this.currentKernelId);v||(v=[],this.kernelPersistentData.set(this.currentKernelId,v)),v.push(x)}c.push(x)}if(s.length!==t.length||c.length!==p.length){if(c.length===0)return ye(e.name),p;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let h;if(l){let g=0,$=[];l.forEach(v=>{let k=typeof v.data=="number"?[v.data]:v.data;if(k.length===0)return;let S=v.type===10?2:4,E,R;v.type===10?(R=k.length>4?16:k.length>2?8:k.length*S,E=k.length>4?16:S*k.length):(R=k.length<=2?k.length*S:16,E=16),g=Math.ceil(g/R)*R,$.push(g);let O=v.type===10?8:4;g+=k.length>4?Math.ceil(k.length/O)*E:k.length*S});let b=16;g=Math.ceil(g/b)*b;let w=new ArrayBuffer(g);l.forEach((v,k)=>{let S=$[k],E=typeof v.data=="number"?[v.data]:v.data;if(v.type===6)new Int32Array(w,S,E.length).set(E);else if(v.type===12)new Uint32Array(w,S,E.length).set(E);else if(v.type===10)new Uint16Array(w,S,E.length).set(E);else if(v.type===1)new Float32Array(w,S,E.length).set(E);else throw new Error(`Unsupported uniform type: ${Oe(v.type)}`)});let x=this.gpuDataManager.create(g,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(x.buffer,0,w,0,g),this.gpuDataManager.release(x.id),h={offset:0,size:g,buffer:x.buffer}}let f=this.programManager.normalizeDispatchGroupSize(u),y=f[1]===1&&f[2]===1,_=up(e,t,y),m=this.programManager.getArtifact(_);if(m||(m=this.programManager.build(e,f),this.programManager.setArtifact(_,m),Z("info",()=>`[artifact] key: ${_}, programName: ${e.name}`)),l&&m.uniformVariablesInfo){if(l.length!==m.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${m.uniformVariablesInfo.length}, got ${l.length} in program "${m.programInfo.name}".`);for(let g=0;g<l.length;g++){let $=l[g],b=$.type,w=typeof $.data=="number"?1:$.data.length,[x,v]=m.uniformVariablesInfo[g];if(b!==x||w!==v)throw new Error(`Uniform variable ${g} mismatch: expect type ${x} with size ${v}, got type ${b} with size ${w} in program "${m.programInfo.name}".`)}}if(Z("info",()=>`[ProgramManager] run "${e.name}" (key=${_}) with ${f[0]}x${f[1]}x${f[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let g={kernelId:this.currentKernelId,programName:m.programInfo.name,inputTensorViews:t,outputTensorViews:p};this.pendingKernels.push(g),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(g)}return this.programManager.run(m,s,c,f,h),ye(e.name),p}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=np.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),Z("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),s(t,o[1]),0}catch(l){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${l}`)),1}finally{u&&r.push(this.device.popErrorScope().then(l=>l?`GPU validation error for kernel "[${n}] ${a}": ${l.message}`:null));for(let l of this.temporaryData)this.gpuDataManager.release(l.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Xr(this,e,t);return Pr(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){Z("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){Z("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){Z("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),pp={};gt(pp,{init:()=>hp});var ir,cp,hp,mh=C(()=>{"use strict";G(),Re(),j(),vc(),ir=class Kp{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=T.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=T.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=T.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=T.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(T.size(t)!==T.size(this.dims))throw new Error("Invalid new shape");return new Kp(this.module,this.dataType,this.data,t)}},cp=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let o=[];for(let u=0;u<s;u++){let l=Number(e.getValue(i*n++,a)),d=Number(e.getValue(i*n++,"*")),p=Number(e.getValue(i*n++,a)),c=[];for(let h=0;h<p;h++)c.push(Number(e.getValue(i*n++,a)));o.push(new ir(e,l,d,c))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(o=>typeof o=="number"?this.inputs[o]:o))??this.inputs,i=(t==null?void 0:t.outputs)??[],n=(o,u,l)=>new ir(this.module,u,this.output(o,l),l),a=(o,u)=>{let l=Ye(o,u);if(!l)throw new Error(`Unsupported data type: ${o}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new ir(this.module,o,d,u)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},hp=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(fh(),Rt(sp)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,l,d=!1)=>{if(d)Z("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(l)}`),s.memcpy(Number(o),Number(u));else{Z("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let p=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(l));s.upload(Number(u),p)}},async(o,u,l)=>{Z("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${l}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(o,u,l)=>s.createKernel(o,Number(u),l,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,l,d)=>{Z("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${o}, contextDataOffset=${u}`);let p=new cp(t,s,Number(u));return s.computeKernel(Number(o),p,d)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new pa(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,o,u,l,d)=>a.ensureTensor(s,o,u,l,d),(s,o)=>{a.uploadTensor(s,o)},async(s,o)=>a.downloadTensor(s,o),(s,o)=>a.registerMLContext(s,o),!!r.trace])}}}),fp,ji,Ki,Ve,mp,Xi,nr,Zi,Qi,Ct,gp,at,yp,_p,Yi,Ji,en,tn,$p=C(()=>{"use strict";$e(),$c(),wc(),G(),Xe(),Br(),Ur(),fp=(e,t)=>{ee()._OrtInit(e,t)!==0&&Q("Can't initialize onnxruntime.")},ji=async e=>{fp(e.wasm.numThreads,Vt(e.logLevel))},Ki=async(e,t)=>{var i,n;(n=(i=ee()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let a=(mh(),Rt(pp)).init;t==="webgpu"&&await a("webgpu",ee(),e,r),t==="webnn"&&await a("webnn",ee(),e)}},Ve=new Map,mp=e=>{let t=ee(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Q("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Xi=(e,t)=>{let r=ee(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Q("Can't get session input/output metadata.");let o=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let l=r.HEAPU32[n/4+1],d=[];for(let p=0;p<l;p++){let c=Number(r.getValue(n+8+p*a,"*"));d.push(c!==0?r.UTF8ToString(c):Number(r.getValue(n+8+(p+l)*a,"*")))}return[o,u,d]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},nr=e=>{let t=ee(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Zi=async(e,t)=>{var p,c,h,f;let r,i,n=ee();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=nr(e);let a=0,s=0,o=0,u=[],l=[],d=[];try{if([s,u]=await Kn(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let k=[];for(let S of t.externalData){let E=typeof S=="string"?S:S.path,R=typeof S=="string"?S:S.data;k.push(Gt(R).then(O=>{n.mountExternalData(E,O)}))}await Promise.all(k)}for(let k of(t==null?void 0:t.executionProviders)??[])if((typeof k=="string"?k:k.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof k!="string"){let S=k,E=S==null?void 0:S.context,R=S==null?void 0:S.gpuDevice,O=S==null?void 0:S.deviceType,B=S==null?void 0:S.powerPreference;E?n.currentContext=E:R?n.currentContext=await n.webnnCreateMLContext(R):n.currentContext=await n.webnnCreateMLContext({deviceType:O,powerPreference:B})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),(p=n.webgpuOnCreateSession)==null||p.call(n,a),a===0&&Q("Can't create a session."),(c=n.jsepOnCreateSession)==null||c.call(n),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[y,_]=mp(a),m=!!(t!=null&&t.enableGraphCapture),g=[],$=[],b=[],w=[],x=[];for(let k=0;k<y;k++){let[S,E,R]=Xi(a,k);S===0&&Q("Can't get an input name."),l.push(S);let O=n.UTF8ToString(S);g.push(O),b.push(E===0?{name:O,isTensor:!1}:{name:O,isTensor:!0,type:Oe(E),shape:R})}for(let k=0;k<_;k++){let[S,E,R]=Xi(a,k+y);S===0&&Q("Can't get an output name."),d.push(S);let O=n.UTF8ToString(S);$.push(O),w.push(E===0?{name:O,isTensor:!1}:{name:O,isTensor:!0,type:Oe(E),shape:R});{if(m&&(t==null?void 0:t.preferredOutputLocation)===void 0){x.push("gpu-buffer");continue}let B=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((h=t==null?void 0:t.preferredOutputLocation)==null?void 0:h[O])??"cpu",F=n.webnnIsGraphOutput;if(B==="cpu"&&F&&F(a,O)){x.push("ml-tensor-cpu-output");continue}if(B!=="cpu"&&B!=="cpu-pinned"&&B!=="gpu-buffer"&&B!=="ml-tensor")throw new Error(`Not supported preferred output location: ${B}.`);if(m&&B!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${B}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);x.push(B)}}let v=null;return x.some(k=>k==="gpu-buffer"||k==="ml-tensor"||k==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(a),o===0&&Q("Can't create IO binding."),v={handle:o,outputPreferredLocations:x,outputPreferredLocationsEncoded:x.map(k=>k==="ml-tensor-cpu-output"?"ml-tensor":k).map(k=>Dr(k))}),Ve.set(a,[a,l,d,v,m,!1]),[a,g,$,b,w]}catch(y){throw l.forEach(_=>n._OrtFree(_)),d.forEach(_=>n._OrtFree(_)),o!==0&&n._OrtReleaseBinding(o)!==0&&Q("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Q("Can't release session."),y}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Q("Can't release session options."),u.forEach(y=>n._free(y)),(f=n.unmountExternalData)==null||f.call(n)}},Qi=e=>{var u,l,d;let t=ee(),r=Ve.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,o]=r;s&&(o&&t._OrtClearBoundOutputs(s.handle)!==0&&Q("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Q("Can't release IO binding.")),(u=t.jsepOnReleaseSession)==null||u.call(t,e),(l=t.webnnOnReleaseSession)==null||l.call(t,e),(d=t.webgpuOnReleaseSession)==null||d.call(t,e),n.forEach(p=>t._OrtFree(p)),a.forEach(p=>t._OrtFree(p)),t._OrtReleaseSession(i)!==0&&Q("Can't release session."),Ve.delete(e)},Ct=new Map,gp=1,at=new Map,yp=e=>{let t=ee(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,r);let i=t._OrtCreateLoraAdapter(r,e.byteLength);i===0&&Q("Can't create a LoRA adapter.");let n=gp++;return Ct.set(n,i),n}finally{t._free(r)}},_p=e=>{let t=ee(),r=Ct.get(e);if(r===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(at.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(r)!==0&&Q("Can't release LoRA adapter."),Ct.delete(e)},Yi=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let o=ee(),u=o.PTR_SIZE,l=e[0],d=e[1],p=e[3],c=p,h,f;if(l==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let m=e[2].gpuBuffer;f=Ye(Qe(l),d);{let g=o.jsepRegisterBuffer;if(!g)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');h=g(i,a,m,f)}}else if(p==="ml-tensor"){let m=e[2].mlTensor;f=Ye(Qe(l),d);let g=o.webnnRegisterMLTensor;if(!g)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');h=g(i,m,Qe(l),d)}else{let m=e[2];if(Array.isArray(m)){f=u*m.length,h=o._malloc(f),r.push(h);for(let g=0;g<m.length;g++){if(typeof m[g]!="string")throw new TypeError(`tensor data at index ${g} is not a string`);o.setValue(h+g*u,ke(m[g],r),"*")}}else{let g=o.webnnIsGraphInput,$=o.webnnIsGraphOutput;if(l!=="string"&&g&&$){let b=o.UTF8ToString(n);if(g(i,b)||$(i,b)){let w=Qe(l);f=Ye(w,d),c="ml-tensor";let x=o.webnnCreateTemporaryTensor,v=o.webnnUploadTensor;if(!x||!v)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let k=await x(i,w,d);v(k,new Uint8Array(m.buffer,m.byteOffset,m.byteLength)),h=k}else f=m.byteLength,h=o._malloc(f),r.push(h),o.HEAPU8.set(new Uint8Array(m.buffer,m.byteOffset,f),h)}else f=m.byteLength,h=o._malloc(f),r.push(h),o.HEAPU8.set(new Uint8Array(m.buffer,m.byteOffset,f),h)}}let y=o.stackSave(),_=o.stackAlloc(4*d.length);try{d.forEach((g,$)=>o.setValue(_+$*u,g,u===4?"i32":"i64"));let m=o._OrtCreateTensor(Qe(l),h,f,_,d.length,Dr(c));m===0&&Q(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(m)}finally{o.stackRestore(y)}},Ji=async(e,t,r,i,n,a,s=[])=>{var F,X,V,M;let o=ee(),u=o.PTR_SIZE,l=Ve.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],p=l[1],c=l[2],h=l[3],f=l[4],y=l[5],_=[];if(s.length>0){if(h)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let W of s){let U=Ct.get(W);if(U===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${W}`);_.push(U)}}let m=t.length,g=i.length,$=0,b=[],w=[],x=[],v=[],k=[],S=o.stackSave(),E=o.stackAlloc(m*u),R=o.stackAlloc(m*u),O=o.stackAlloc(g*u),B=o.stackAlloc(g*u);try{for(let I of s)at.set(I,(at.get(I)??0)+1);[$,b]=Gn(a,_),He("wasm prepareInputOutputTensor");for(let I=0;I<m;I++)await Yi(r[I],w,v,e,p[t[I]],t[I],f);for(let I=0;I<g;I++)await Yi(n[I],x,v,e,c[i[I]],m+i[I],f);je("wasm prepareInputOutputTensor");for(let I=0;I<m;I++)o.setValue(E+I*u,w[I],"*"),o.setValue(R+I*u,p[t[I]],"*");for(let I=0;I<g;I++)o.setValue(O+I*u,x[I],"*"),o.setValue(B+I*u,c[i[I]],"*");if(h&&!y){let{handle:I,outputPreferredLocations:N,outputPreferredLocationsEncoded:L}=h;if(p.length!==m)throw new Error(`input count from feeds (${m}) is expected to be always equal to model's input count (${p.length}).`);He("wasm bindInputsOutputs");for(let A=0;A<m;A++){let re=t[A];await o._OrtBindInput(I,p[re],w[A])!==0&&Q(`Can't bind input[${A}] for session=${e}.`)}for(let A=0;A<g;A++){let re=i[A];(F=n[A])!=null&&F[3]?(k.push(x[A]),o._OrtBindOutput(I,c[re],x[A],0)!==0&&Q(`Can't bind pre-allocated output[${A}] for session=${e}.`)):o._OrtBindOutput(I,c[re],0,L[re])!==0&&Q(`Can't bind output[${A}] to ${N[A]} for session=${e}.`)}je("wasm bindInputsOutputs"),Ve.set(e,[d,p,c,h,f,!0])}(X=o.jsepOnRunStart)==null||X.call(o,d),(V=o.webnnOnRunStart)==null||V.call(o,d);let W;h?W=await o._OrtRunWithBinding(d,h.handle,g,O,$):W=await o._OrtRun(d,R,E,m,B,g,O,$),W!==0&&Q("failed to call OrtRun().");let U=[],H=[];He("wasm ProcessOutputTensor");for(let I=0;I<g;I++){let N=Number(o.getValue(O+I*u,"*"));if(N===x[I]||k.includes(x[I])){U.push(n[I]),N!==x[I]&&o._OrtReleaseTensor(N)!==0&&Q("Can't release tensor.");continue}let L=o.stackSave(),A=o.stackAlloc(4*u),re=!1,ne,ie=0;try{o._OrtGetTensorData(N,A,A+u,A+2*u,A+3*u)!==0&&Q(`Can't access output tensor data on index ${I}.`);let ge=u===4?"i32":"i64",he=Number(o.getValue(A,ge));ie=o.getValue(A+u,"*");let ur=o.getValue(A+u*2,"*"),mt=Number(o.getValue(A+u*3,ge)),Ce=[];for(let ce=0;ce<mt;ce++)Ce.push(Number(o.getValue(ur+ce*u,ge)));o._OrtFree(ur)!==0&&Q("Can't free memory for tensor dims.");let We=Ce.reduce((ce,oe)=>ce*oe,1);ne=Oe(he);let Ot=h==null?void 0:h.outputPreferredLocations[i[I]];if(ne==="string"){if(Ot==="gpu-buffer"||Ot==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ce=[];for(let oe=0;oe<We;oe++){let Ne=o.getValue(ie+oe*u,"*"),ef=o.getValue(ie+(oe+1)*u,"*"),tf=oe===We-1?void 0:ef-Ne;ce.push(o.UTF8ToString(Ne,tf))}U.push([ne,Ce,ce,"cpu"])}else if(Ot==="gpu-buffer"&&We>0){let ce=o.jsepGetBuffer;if(!ce)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let oe=ce(ie),Ne=Ye(he,We);if(Ne===void 0||!Or(ne))throw new Error(`Unsupported data type: ${ne}`);re=!0,U.push([ne,Ce,{gpuBuffer:oe,download:o.jsepCreateDownloader(oe,Ne,ne),dispose:()=>{o._OrtReleaseTensor(N)!==0&&Q("Can't release tensor.")}},"gpu-buffer"])}else if(Ot==="ml-tensor"&&We>0){let ce=o.webnnEnsureTensor,oe=o.webnnIsGraphInputOutputTypeSupported;if(!ce||!oe)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ye(he,We)===void 0||!Rr(ne))throw new Error(`Unsupported data type: ${ne}`);if(!oe(e,ne,!1))throw new Error(`preferredLocation "ml-tensor" for ${ne} output is not supported by current WebNN Context.`);let Ne=await ce(e,ie,he,Ce,!1);re=!0,U.push([ne,Ce,{mlTensor:Ne,download:o.webnnCreateMLTensorDownloader(ie,ne),dispose:()=>{o.webnnReleaseTensorId(ie),o._OrtReleaseTensor(N)}},"ml-tensor"])}else if(Ot==="ml-tensor-cpu-output"&&We>0){let ce=o.webnnCreateMLTensorDownloader(ie,ne)(),oe=U.length;re=!0,H.push((async()=>{let Ne=[oe,await ce];return o.webnnReleaseTensorId(ie),o._OrtReleaseTensor(N),Ne})()),U.push([ne,Ce,[],"cpu"])}else{let ce=Lt(ne),oe=new ce(We);new Uint8Array(oe.buffer,oe.byteOffset,oe.byteLength).set(o.HEAPU8.subarray(ie,ie+oe.byteLength)),U.push([ne,Ce,oe,"cpu"])}}finally{o.stackRestore(L),ne==="string"&&ie&&o._free(ie),re||o._OrtReleaseTensor(N)}}h&&!f&&(o._OrtClearBoundOutputs(h.handle)!==0&&Q("Can't clear bound outputs."),Ve.set(e,[d,p,c,h,f,!1]));for(let[I,N]of await Promise.all(H))U[I][2]=N;return je("wasm ProcessOutputTensor"),U}finally{(M=o.webnnOnRunEnd)==null||M.call(o,d),o.stackRestore(S),w.forEach(W=>o._OrtReleaseTensor(W)),x.forEach(W=>o._OrtReleaseTensor(W)),v.forEach(W=>o._free(W)),$!==0&&o._OrtReleaseRunOptions($),b.forEach(W=>o._free(W));for(let W of s){let U=at.get(W)-1;U===0?at.delete(W):at.set(W,U)}}},en=e=>{let t=ee(),r=Ve.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Q("Can't get an profile file name."),t._OrtFree(n)},tn=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Ae,me,ft,Mt,At,ar,rn,sr,st,ot,wp,bp,vp,xp,kp,Sp,Ip,Tp,zp,Ep,nn=C(()=>{"use strict";$e(),$p(),Xe(),Er(),Ur(),Ae=()=>!!te.wasm.proxy&&typeof document<"u",ft=!1,Mt=!1,At=!1,sr=new Map,st=(e,t)=>{let r=sr.get(e);r?r.push(t):sr.set(e,[t])},ot=()=>{if(ft||!Mt||At||!me)throw new Error("worker not ready")},wp=e=>{switch(e.data.type){case"init-wasm":ft=!1,e.data.err?(At=!0,rn[1](e.data.err)):(Mt=!0,rn[0]()),ar&&(URL.revokeObjectURL(ar),ar=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=sr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},bp=async()=>{if(!Mt){if(ft)throw new Error("multiple calls to 'initWasm()' detected.");if(At)throw new Error("previous call to 'initWasm()' failed.");if(ft=!0,Ae())return new Promise((e,t)=>{me==null||me.terminate(),Nn().then(([r,i])=>{try{me=i,me.onerror=a=>t(a),me.onmessage=wp,rn=[e,t];let n={type:"init-wasm",in:te};if(!n.in.wasm.wasmPaths&&r){let a=Sr();a&&(n.in.wasm.wasmPaths=a)}me.postMessage(n),ar=r}catch(n){t(n)}},t)});try{await Ar(te.wasm),await ji(te),Mt=!0}catch(e){throw At=!0,e}finally{ft=!1}}},vp=async e=>{if(Ae())return ot(),new Promise((t,r)=>{st("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:te}};me.postMessage(i)});await Ki(te,e)},xp=async e=>Ae()?(ot(),new Promise((t,r)=>{st("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};me.postMessage(i,[e.buffer])})):nr(e),kp=async(e,t)=>{if(Ae()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return ot(),new Promise((r,i)=>{st("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),me.postMessage(n,a)})}else return Zi(e,t)},Sp=async e=>{if(Ae())return ot(),new Promise((t,r)=>{st("release",[t,r]);let i={type:"release",in:e};me.postMessage(i)});Qi(e)},Ip=async e=>{if(Ae())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await Gt(e):e;return yp(t)},Tp=async e=>{if(Ae())throw new Error("LoRA adapter is not supported for proxy.");_p(e)},zp=async(e,t,r,i,n,a,s)=>{if(Ae()){if(s.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return ot(),new Promise((o,u)=>{st("run",[o,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};me.postMessage(d,tn(l))})}else return Ji(e,t,r,i,n,a,s)},Ep=async e=>{if(Ae())return ot(),new Promise((t,r)=>{st("end-profiling",[t,r]);let i={type:"end-profiling",in:e};me.postMessage(i)});en(e)}}),an,Cp=C(()=>{"use strict";$e(),nn(),an=class{async loadAdapter(e){ve(),this.adapterId=await Ip(e),ye()}async dispose(){return Tp(this.adapterId)}}}),sn,Mp,Ap,gh=C(()=>{"use strict";$e(),Cp(),nn(),G(),br(),Ur(),sn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Mp=e=>{switch(e[3]){case"cpu":return new xe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Or(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return xe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!Rr(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return xe.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},Ap=class{async fetchModelAndCopyToWasmMemory(e){return xp(await Gt(e))}async loadModel(e,t){ve();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await kp(r,t),ye()}async dispose(){return Sp(this.sessionId)}async run(e,t,r,i=[]){ve();let n=i.map(h=>{if(!(h instanceof an))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return h.adapterId}),a=[],s=[];Object.entries(e).forEach(h=>{let f=h[0],y=h[1],_=this.inputNames.indexOf(f);if(_===-1)throw new Error(`invalid input '${f}'`);a.push(y),s.push(_)});let o=[],u=[];Object.entries(t).forEach(h=>{let f=h[0],y=h[1],_=this.outputNames.indexOf(f);if(_===-1)throw new Error(`invalid output '${f}'`);o.push(y),u.push(_)});let l=a.map((h,f)=>sn(h,()=>`input "${this.inputNames[s[f]]}"`)),d=o.map((h,f)=>h?sn(h,()=>`output "${this.outputNames[u[f]]}"`):null),p=await zp(this.sessionId,s,l,u,d,r,n),c={};for(let h=0;h<p.length;h++)c[this.outputNames[u[h]]]=o[h]??Mp(p[h]);return ye(),c}startProfiling(){}endProfiling(){Ep(this.sessionId)}}}),Bp,yh=C(()=>{"use strict";Bp=e=>{if(e!=null&&e.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),Op={};gt(Op,{OnnxruntimeWebAssemblyBackend:()=>un,initializeFlags:()=>on,wasmBackend:()=>Rp});var on,un,Rp,_h=C(()=>{"use strict";$e(),Cp(),nn(),gh(),yh(),on=()=>{(typeof te.wasm.initTimeout!="number"||te.wasm.initTimeout<0)&&(te.wasm.initTimeout=0);let e=te.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),te.wasm.simd=!1),typeof te.wasm.proxy!="boolean"&&(te.wasm.proxy=!1),typeof te.wasm.trace!="boolean"&&(te.wasm.trace=!1),typeof te.wasm.numThreads!="number"||!Number.isInteger(te.wasm.numThreads)||te.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)te.wasm.numThreads=1;else{let t=typeof navigator>"u"?tc("node:os").cpus().length:navigator.hardwareConcurrency;te.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},un=class{async init(e){on(),await bp(),await vp(e)}async createInferenceSessionHandler(e,t){Bp(t);let r=new Ap;return await r.loadModel(e,t),r}async createLoraAdapterHandler(e){let t=new an;return await t.loadAdapter(e),t}},Rp=new un});$e(),$e(),$e();var $h="1.31.1";{let e=(_h(),Rt(Op)).wasmBackend;dt("webgpu",e,5),dt("webnn",e,5),dt("cpu",e,10),dt("wasm",e,10)}Object.defineProperty(te.versions,"web",{value:$h,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wh(e){const t=Math.min(1,1700/e.width,2400/e.height),r=Math.max(1,Math.floor(e.width*t)),i=Math.max(1,Math.floor(e.height*t)),n=new Uint8Array(r*i);for(let a=0;a<i;a+=1){const s=Math.min(e.height-1,Math.floor(a/t));for(let o=0;o<r;o+=1){const u=Math.min(e.width-1,Math.floor(o/t)),l=(s*e.width+u)*4,d=e.data[l],p=e.data[l+1],c=e.data[l+2],h=e.data[l+3]/255,f=(.299*d+.587*p+.114*c)*h+255*(1-h);n[a*r+o]=f}}return{gray:n,w:r,h:i}}function bh(e){const t=new Uint32Array(256);for(const u of e)t[u]+=1;const r=e.length;let i=0;for(let u=0;u<256;u+=1)i+=u*t[u];let n=0,a=0,s=0,o=160;for(let u=0;u<256;u+=1){if(a+=t[u],a===0)continue;const l=r-a;if(l===0)break;n+=u*t[u];const d=n/a,p=(i-n)/l,c=a*l*(d-p)**2;c>s&&(s=c,o=u)}return o}function vh(e,t,r){const i=bh(e),n=new Uint8Array(t*r);for(let u=0;u<e.length;u+=1)n[u]=e[u]<i?1:0;const a=new Int32Array((t+1)*(r+1)),s=new Uint16Array(t*r),o=t+1;for(let u=0;u<r;u+=1){let l=0;for(;l<t;){if(!n[u*t+l]){l+=1;continue}const p=l;for(;l<t&&n[u*t+l];)l+=1;const c=l-p;for(let h=p;h<l;h+=1)s[u*t+h]=c}let d=0;for(let p=0;p<t;p+=1)d+=n[u*t+p],a[(u+1)*o+(p+1)]=a[u*o+(p+1)]+d}return{w:t,h:r,ink:n,integral:a,runLength:s}}function Dp(e,t,r,i,n){const a=Math.max(0,Math.min(e.w,Math.round(t))),s=Math.max(0,Math.min(e.w,Math.round(i))),o=Math.max(0,Math.min(e.h,Math.round(r))),u=Math.max(0,Math.min(e.h,Math.round(n)));if(s<=a||u<=o)return 0;const l=e.w+1;return e.integral[u*l+s]-e.integral[o*l+s]-e.integral[u*l+a]+e.integral[o*l+a]}function Ge(e,t,r,i,n){const a=Math.max(1,Math.round(i-t)*Math.round(n-r));return Dp(e,t,r,i,n)/a}function xh(e){const{w:t,h:r,ink:i}=e,n=new Int32Array(r);let a=0;for(let l=0;l<r;l+=1){let d=0;const p=l*t;for(let c=0;c<t;c+=1)i[p+c]&&(d+=1);n[l]=d,d>a&&(a=d)}if(a<t*.12)return[];const s=Math.max(12,a*.45),o=[];let u=-1;for(let l=0;l<=r;l+=1){const d=l<r&&n[l]>=s;d&&u<0&&(u=l),!d&&u>=0&&(o.push({top:u,bottom:l-1,center:(u+l-1)/2}),u=-1)}return o}function kh(e){if(e.length===0)return 0;const t=[...e].sort((i,n)=>i-n),r=Math.floor(t.length/2);return t.length%2?t[r]:(t[r-1]+t[r])/2}function Sh(e,t){const{w:r,h:i,ink:n}=e,a=Math.max(0,Math.round(t)-2),s=Math.min(i-1,Math.round(t)+2),o=new Uint8Array(r);for(let c=0;c<r;c+=1)for(let h=a;h<=s;h+=1)if(n[h*r+c]){o[c]=1;break}let u=0,l=r-1,d=0,p=0;for(;p<r;){if(!o[p]){p+=1;continue}const c=p;let h=p;for(;p<r&&(o[p]||p-h<=3);)o[p]&&(h=p),p+=1;const f=h;f-c>d&&(d=f-c,u=c,l=f)}return{left:u,right:l}}function Ih(e){const t=xh(e);if(t.length<5)return[];const r=[];for(let l=1;l<t.length;l+=1){const d=t[l].center-t[l-1].center;d>=2&&d<=120&&r.push(d)}if(!kh(r))return[];const n=[];let a=0;for(;a+4<t.length;){const l=t.slice(a,a+5),d=[];for(let h=1;h<l.length;h+=1)d.push(l[h].center-l[h-1].center);const p=d.reduce((h,f)=>h+f,0)/d.length;if(d.every(h=>h>=p*.62&&h<=p*1.5)&&p>=2.5&&p<=90){const h=l[0].center,f=l[4].center,y=Sh(e,h);if(y.right-y.left>p*8){n.push({top:h,bottom:f,space:p,left:y.left+2,right:y.right-2,lineRuns:l,clef:"treble",systemIndex:0,staffInSystem:0,systemSize:1,index:n.length,scanTop:0,scanBottom:0}),a+=5;continue}}a+=1}n.sort((l,d)=>l.top-d.top);const s=[];for(const l of n){const d=s[s.length-1];d&&Math.abs(l.top-d.top)<l.space||s.push(l)}let o=0,u=[];for(let l=0;l<s.length;l+=1){const d=s[l],p=u[u.length-1];p&&d.top-p.bottom>p.space*8&&(Up(u,o),o+=1,u=[]),u.push(d)}return Up(u,o),s}function Up(e,t){for(let r=0;r<e.length;r+=1){const i=e[r];i.systemIndex=t,i.staffInSystem=r,i.systemSize=e.length,i.clef=r===0?"treble":"bass"}}function Th(e){const t=[...e].sort((r,i)=>r.top-i.top);for(let r=0;r<t.length;r+=1){const i=t[r],n=r>0?t[r-1]:null,a=r<t.length-1?t[r+1]:null,s=n?(i.top+n.bottom)/2:Number.NEGATIVE_INFINITY,o=a?(i.bottom+a.top)/2:Number.POSITIVE_INFINITY;i.scanTop=Math.max(i.top-i.space*4.5,s),i.scanBottom=Math.min(i.bottom+i.space*4.5,o)}}function zh(e,t,r,i){const{w:n,h:a,ink:s}=e,{space:o}=t,u=Math.max(0,Math.round(t.top-o*.7)),l=Math.min(a-1,Math.round(t.bottom+o*.7)),d=i-r+1,p=l-u+1;if(d<=2||p<=2)return!1;const c=new Set;for(const m of t.lineRuns)for(let g=Math.round(m.top)-1;g<=Math.round(m.bottom)+1;g+=1)c.add(g);const h=new Uint8Array(d*p);for(let m=u;m<=l;m+=1){if(c.has(m))continue;const g=(m-u)*d;for(let $=r;$<=i;$+=1)s[m*n+$]&&(h[g+($-r)]=1)}const f=t.lineRuns[1].center,y=[],_=new Uint8Array(d*p);for(let m=0;m<h.length;m+=1){if(!h[m]||_[m])continue;const g=[m];_[m]=1;let $=0,b=d,w=-1,x=p,v=-1;for(;g.length>0;){const E=g.pop(),R=E%d,O=E/d|0;$+=1,R<b&&(b=R),R>w&&(w=R),O<x&&(x=O),O>v&&(v=O);for(const B of[E-1,E+1,E-d,E+d])B<0||B>=h.length||h[B]&&!_[B]&&(_[B]=1,g.push(B))}const k=w-b+1,S=v-x+1;k<o*.28||k>o*.75||S<o*.28||S>o*.75||Math.abs(k-S)>o*.35||$/(k*S)<.55||$<Math.max(6,o*o*.05)||$>o*o*.35||y.push({x:r+(b+w)/2,y:u+(x+v)/2})}for(let m=0;m<y.length;m+=1)for(let g=m+1;g<y.length;g+=1){const $=y[m],b=y[g];if(Math.abs($.x-b.x)>o*.7)continue;const w=Math.abs($.y-b.y);if(w<o*.7||w>o*1.5)continue;const x=($.y+b.y)/2;if(!(Math.abs(x-f)>o*.45||y.some(k=>k!==$&&k!==b&&(Math.abs(k.y-$.y)<=o*1.7||Math.abs(k.y-b.y)<=o*1.7)&&Math.abs(k.x-$.x)<=o*1.2&&Math.abs(k.x-b.x)<=o*1.2)))return!0}return!1}function Eh(e,t,r){const{space:i}=t,n=Math.max(0,Math.round(t.top-i*2.2)),a=Math.round(t.top-i*.35);if(a<=n)return!1;const s=Math.min(e.w-1,Math.round(r+i*4));let o=0;for(let u=n;u<=a;u+=1){let l=0,d=0;for(let p=r;p<=s;p+=1)e.ink[u*e.w+p]?(d+=1,d>l&&(l=d)):d=0;if(!(l<i*.55))for(let p=r;p<=s;p+=1)e.ink[u*e.w+p]&&(o+=1)}return o>=Math.max(20,Math.round(i*i*.2))}function Ch(e,t){const{space:r}=t,i=Math.max(0,Math.round(t.left-r*1.2)),n=t.systemIndex===0?7.5:5.5,a=Math.min(e.w-1,Math.round(t.left+r*n));return a<=i+2?null:zh(e,t,i,a)?"bass":Eh(e,t,i)?"treble":null}function Mh(e,t){const{w:r,ink:i}=e,n=Math.max(0,Math.round(t.top)),a=Math.min(e.h-1,Math.round(t.bottom)),s=a-n+1,o=[];for(let l=Math.max(0,Math.round(t.left));l<=Math.min(r-1,Math.round(t.right));l+=1){let d=0;for(let p=n;p<=a;p+=1)i[p*r+l]&&(d+=1);d/s>=.93&&o.push(l)}const u=[];for(const l of o){const d=u[u.length-1];d&&l-d[d.length-1]<=t.space*1.1?d.push(l):u.push([l])}return u.map(l=>l.reduce((d,p)=>d+p,0)/l.length)}function Np(e,t){const{w:r,ink:i,h:n}=e,a=Math.max(0,Math.round(t.top-t.space*4)),s=Math.min(n-1,Math.round(t.bottom+t.space*4)),o=new Set;for(const f of t.lineRuns)for(let y=Math.round(f.top)-1;y<=Math.round(f.bottom)+1;y+=1)o.add(y);const u=Math.max(3,t.space*.45),l=[];for(let f=a;f<=s;f+=1){const y=[];if(!o.has(f)){let _=-1;for(let m=0;m<=r;m+=1){const g=m<r&&i[f*r+m]===1;g&&_<0&&(_=m),!g&&_>=0&&(m-_>=u&&y.push({startX:_,endX:m-1}),_=-1)}}l.push(y)}const d=[];let p=[];for(let f=0;f<l.length;f+=1){const y=l[f],_=new Set,m=[];for(const g of y){const $=g.endX-g.startX+1,b=p.findIndex(w=>{if(!(w.minX<=g.endX+1&&w.maxX>=g.startX-1))return!1;const x=[...w.widths].sort((k,S)=>k-S),v=x[Math.floor(x.length/2)]||$;return $>=Math.max(3,v*.3)&&$<=v*3});if(b>=0&&!_.has(b)){const w=p[b];_.add(b),w.rows+=1,w.inkArea+=$,w.widths.push($),w.minX=Math.min(w.minX,g.startX),w.maxX=Math.max(w.maxX,g.endX),w.segments.push({y:a+f,startX:g.startX,endX:g.endX}),m.push(w)}else m.push({rows:1,minX:g.startX,maxX:g.endX,inkArea:$,widths:[$],segments:[{y:a+f,startX:g.startX,endX:g.endX}]})}for(let g=0;g<p.length;g+=1)_.has(g)||d.push(p[g]);p=m}d.push(...p);const c=[],h=Math.max(3,Math.round(t.space*.2));for(let f=0;f<d.length;f+=1){const y=d[f],_=y.maxX-y.minX+1;if(_<t.space*2||y.rows<h)continue;const m=y.inkArea/(_*y.rows);if(m<.45&&!(m>=.28&&y.rows>=5))continue;const g=_>=t.space*2.6;for(const $ of y.segments)c.push({y:$.y,startX:$.startX,endX:$.endX,wide:g,blob:f})}return c}function Ah(e,t,r,i){return e.some(n=>n.wide&&Math.abs(n.y-r)<=i*.45&&t>=n.startX-i*.5&&t<=n.endX+i*.5)}function Bt(e,t,r){const i=Math.round(r),n=Math.round(t);return i<0||i>=e.h||n<0||n>=e.w?0:e.runLength[i*e.w+n]}function ln(e,t,r){const{w:i,ink:n}=e,a=Math.round(t),s=Math.round(r);if(a<0||a>=i||s<0||s>=e.h)return 0;let o=s,u=s;for(;o>0&&n[(o-1)*i+a];)o-=1;for(;u<e.h-1&&n[(u+1)*i+a];)u+=1;return n[s*i+a]?u-o+1:0}function Pp(e,t,r,i){for(const n of[-.35,-.18,0,.18,.35])if(ln(e,t+n*i,r+i*1.8)>i*.7)return!0;return!1}function Bh(e,t){const r=Math.min(...t.map(l=>l.left)),i=Math.max(...t.map(l=>l.right)),n=Math.max(0,Math.round(Math.min(...t.map(l=>l.top)))),a=Math.min(e.h-1,Math.round(Math.max(...t.map(l=>l.bottom)))),s=a-n+1;if(s<=0)return[];const o=[];for(let l=Math.max(0,Math.round(r));l<=Math.min(e.w-1,Math.round(i));l+=1){let d=0,p=0;for(let c=n;c<=a;c+=1)e.ink[c*e.w+l]?(d+=1,d>p&&(p=d)):d=0;p>=s*.92&&o.push(l)}const u=[];for(const l of o){const d=u[u.length-1];d&&l-d[d.length-1]<=2?d.push(l):u.push([l])}return u.map(l=>l.reduce((d,p)=>d+p,0)/l.length)}function Oh(e,t,r){const i=Math.min(...t.map(u=>u.left)),n=Math.max(...t.map(u=>u.right));let a=Bh(e,t);if(a.length<2){const u=[];for(const l of t)u.push(...Mh(e,l));a=u.sort((l,d)=>l-d)}const s=[i,...a.filter(u=>u>i+r*2&&u<n-r*2),n].sort((u,l)=>u-l).filter((u,l,d)=>l===0||u-d[l-1]>2),o=[];for(let u=0;u<s.length-1;u+=1)s[u+1]-s[u]>r*3&&o.push({start:s[u],end:s[u+1]});return o.length===0&&o.push({start:i,end:n}),o}function Rh(e,t,r,i,n){const a=Math.max(0,Math.round(i-n*.35)),s=Math.min(e.h-1,Math.round(i+n*.35)),o=Math.max(0,Math.round(r-n*.4)),u=Math.min(e.w-1,Math.round(r+n*.4));let l=0,d=0;for(let p=a;p<=s;p+=1)if(!t.lineRuns.some(c=>Math.abs(c.center-p)<=1.2))for(let c=o;c<=u;c+=1)e.ink[p*e.w+c]&&(l+=p,d+=1);return d<4?i:l/d}function Dh(e,t,r,i,n){const a=Math.max(0,Math.round(i-n*.35)),s=Math.min(e.h-1,Math.round(i+n*.35)),o=Math.max(0,Math.round(r-n*.7)),u=Math.min(e.w-1,Math.round(r+n*.7));let l=0,d=0;for(let h=a;h<=s;h+=1)if(!t.lineRuns.some(f=>Math.abs(f.center-h)<=1.2))for(let f=o;f<=u;f+=1)e.ink[h*e.w+f]&&(l+=f,d+=1);if(d<4)return r;const p=l/d,c=n*.35;return p>r+c?r+c:p<r-c?r-c:p}function qp(e,t,r){const{space:i}=t,n=i*.58,a=i*.42,s=i*.24,o=Math.max(1,Math.round(i*.25)),u=[],l=t.systemIndex===0?i*6.5:i*3.5;for(let d=-6;d<=14;d+=1){const p=t.bottom-d*i/2;if(!(p<t.scanTop||p>t.scanBottom))for(let c=Math.round(t.left+l);c<=t.right-i*.6;c+=o){if(Ah(r,c,p,i))continue;const h=Rh(e,t,c,p,i);if(Math.abs(h-p)>i*.3)continue;const f=Dh(e,t,c,h,i);if(Math.abs(f-c)>i*.6)continue;const y=Ge(e,f-n,h-a,f+n,h+a);if(y<.35)continue;const _=Lp(e,f,h,i);if(!_)continue;const m=_==="filled";if(!m&&ln(e,f,h)>i*1.5||!m&&Pp(e,f,h,i)||m&&y<.6)continue;const g=Gh(e,f,h,i*.7,i*.8);if(g<i*.65||g>i*1.6)continue;const $=Vh(e,t,f,h,i*.75,i*.6);if($<i*1||$>i*2.8)continue;const b=Ge(e,f-n-s,h-a-s,f+n+s,h+a+s),w=4*n*a,x=4*(n+s)*(a+s),v=Math.max(0,(b*x-y*w)/(x-w)),k=y-v*.2;k<.3||u.push({x:f,y:h,k:Math.round((t.bottom-h)*2/i),score:k,inner:y})}}return u}function Uh(e,t){const r=[...e].sort((n,a)=>a.score-n.score),i=[];for(const n of r)i.some(s=>Math.abs(s.x-n.x)<=t*1.1&&Math.abs(s.y-n.y)<=t*.62)||i.push(n);return i.sort((n,a)=>n.x-a.x)}function Nh(e,t){const r=[];for(const i of e){const n=r[r.length-1];n&&i.x-n.x<=t*.72?(n.ys.push(i.y),n.ks.push(i.k),n.scores.push(i.score),n.x=(n.x*(n.ks.length-1)+i.x)/n.ks.length):r.push({x:i.x,ys:[i.y],ks:[i.k],scores:[i.score]})}return r}function Lp(e,t,r,i){if(Bt(e,t,r)>i*1.45){const u=Bt(e,t,r-i*.25),l=Bt(e,t,r+i*.25);return u<i*.55||l<i*.55?Vp(e,t,r,i)?"hollow":null:"filled"}const a=[0,-.2,.2];let s=1;for(const u of a){const l=r+u*i,d=Ge(e,t-i*.17,l-i*.09,t+i*.17,l+i*.09);s=Math.min(s,d)}return s>.55?"filled":Ge(e,t-i*.18,r-i*.18,t+i*.18,r+i*.18)>.62?null:Vp(e,t,r,i)?"hollow":null}function Vp(e,t,r,i){const n=i*.62*.85,a=i*.43,s=[[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];let o=0;for(const[u,l]of s){const d=t+u*n,p=r+l*a;Ge(e,d-1.6,p-1.6,d+1.6,p+1.6)>.35&&(o+=1)}return o>=5}function Ph(e,t,r,i){const n=Math.min(...r),a=Math.max(...r),s=Math.max(2,i*.9),o=[{x0:t+i*.32,x1:t+i*1.18,y0:n-i*3.4,y1:n-i*.3},{x0:t-i*1.18,x1:t-i*.32,y0:n-i*3.4,y1:n-i*.3},{x0:t+i*.32,x1:t+i*1.18,y0:a+i*.3,y1:a+i*3.4},{x0:t-i*1.18,x1:t-i*.32,y0:a+i*.3,y1:a+i*3.4}];for(const u of o){const l=Math.max(0,Math.round(u.x0)),d=Math.min(e.w-1,Math.round(u.x1)),p=Math.max(0,Math.round(u.y0)),c=Math.min(e.h-1,Math.round(u.y1));for(let h=l;h<=d;h+=1){let f=0,y=0;for(let _=p;_<=c;_+=1)e.ink[_*e.w+h]?(f+=1,f>y&&(y=f)):f=0;if(y>=s)return!0}}return!1}function Gp(e,t,r,i,n){const a=Math.round(t);if(a<0||a>=e.w)return r;let s=r,o=0;const u=Math.round(n*5);for(let l=1;l<=u;l+=1){const d=Math.round(r)+i*l;if(d<0||d>=e.h)break;let p=e.ink[d*e.w+a]===1;if(!p&&a>0&&(p=e.ink[d*e.w+a-1]===1),!p&&a<e.w-1&&(p=e.ink[d*e.w+a+1]===1),p)s=d,o=0;else if(o+=1,o>2)break}return s}function qh(e,t,r,i){const n=Math.min(...r),a=Math.max(...r),s=Gp(e,t+i*.55,n,-1,i),o=Gp(e,t-i*.55,a,1,i),u=n-s,l=o-a,d=i*1.2;return u>=l&&u>=d?Ge(e,t+i*.15,s-i*.55,t+i*1.5,s+i*.55)>.3:l>u&&l>=d?Ge(e,t+i*.15,o-i*.55,t+i*1.5,o+i*.55)>.3:!1}function Lh(e,t,r,i,n){const a=Math.min(...i),s=Math.max(...i),o=new Set;for(const u of t){if(r<u.startX-n*1.1||r>u.endX+n*1.1)continue;const l=u.y<a,d=u.y>s;if(!l&&!d)continue;const p=l?r+n*.55:r-n*.55,c=l?a-u.y:u.y-s,h=Math.max(2,c-2);let f=0;const y=[];for(let _=Math.round(p-1);_<=Math.round(p+1);_+=1)_<0||_>=e.w||y.push(_);for(const _ of y){let m=0;for(let g=Math.round(l?a:s);(l?g>=0:g<e.h)&&e.ink[g*e.w+_];g+=l?-1:1)if(m+=1,m>=h)break;m>f&&(f=m)}f>=h&&o.add(u.blob)}return o.size}function Vh(e,t,r,i,n,a){const{w:s,runLength:o}=e;let u=0;const l=Math.max(0,Math.round(i-a)),d=Math.min(e.h-1,Math.round(i+a));for(let p=l;p<=d;p+=1)if(!t.lineRuns.some(c=>Math.abs(c.center-p)<=1.2))for(let c=Math.max(0,Math.round(r-n));c<=Math.min(s-1,Math.round(r+n));c+=1){const h=o[p*s+c];h>u&&(u=h)}return u}function Gh(e,t,r,i,n){const{w:a,ink:s}=e,o=Math.max(0,Math.round(r-n)),u=Math.min(e.h-1,Math.round(r+n));let l=Number.POSITIVE_INFINITY,d=Number.NEGATIVE_INFINITY;for(let p=o;p<=u;p+=1)for(let c=Math.round(t-i);c<=Math.round(t+i);c+=1)if(!(c<0||c>=a)&&s[p*a+c]){p<l&&(l=p),p>d&&(d=p);break}return d<l?0:d-l+1}function or(e,t,r,i,n){const a=Math.round(r);if(a<0||a>=e.w)return 0;let s=0,o=Number.POSITIVE_INFINITY,u=Number.NEGATIVE_INFINITY;const l=[];for(let _=Math.round(t.top-i);_<=Math.round(t.bottom+i);_+=1){if(t.lineRuns.some(g=>Math.abs(g.center-_)<=1.2)||!e.ink[_*e.w+a]||n.some(g=>Math.abs(g.y-_)<=1&&a>=g.startX-2&&a<=g.endX+2))continue;const m=Bt(e,a,_);m<i*.28||m>i*1.35||(s+=1,l.push(m),_<o&&(o=_),_>u&&(u=_))}const d=u-o;l.sort((_,m)=>_-m);const p=l.length?l[Math.floor(l.length/2)]:0;if(!(s>=7&&d>=i*1.5&&d<=i*3.6&&p>=i*.55))return 0;let c=0,h=0;const f=Math.round(t.top-i),y=Math.round(t.bottom+i);for(let _=f;_<=y;_+=1)e.ink[_*e.w+a]?(h+=1,h>c&&(c=h)):h=0;return c>=d*.6?0:s}function Wh(e,t,r,i,n){const a=[.3,.6,.9,1.05,1.2,1.5,1.8,2.1],s=[0,-.5,.5,-1,1,-1.4,1.4];for(const o of a)for(const u of s){if(o<.9&&Math.abs(u)<.65||Math.abs(u)<.65&&o>=1.5)continue;const l=r+o*n,d=i+u*n,p=Math.round(l),c=Math.round(d);if(p<0||p>=e.w||c<0||c>=e.h||!e.ink[c*e.w+p]||t.lineRuns.some(y=>Math.abs(y.center-d)<=1.8)||Ge(e,l-2.2,d-2.2,l+2.2,d+2.2)<.4)continue;const h=ln(e,l,d),f=Bt(e,l,d);if(!(h<n*.18||h>n*.6)&&!(f<n*.18||f>n*.7)&&!(Dp(e,l-2.2,d-2.2,l+2.2,d+2.2)>30))return!0}return!1}function Wp(e,t){for(let r=0;r<e.length;r+=1)if(t>=e[r].start-2&&t<e[r].end+2)return r;return t<e[0].start?0:e.length-1}function Fh(e,t,r,i,n,a){const s=t.systemIndex===0?r*6.5:r*3.5,o=Math.round(t.left+s),u=Math.round(t.right-r*.5),l=Math.max(2,Math.round(r*.4)),d=[];for(let c=o;c<=u;c+=l){if(n.some(_=>_.stem&&Math.abs(_.x-c)<r*2)||i.some(_=>_-c>r*.8&&_-c<r*1.9))continue;const y=or(e,t,c,r,a);y!==0&&d.push({x:c,rows:y})}d.sort((c,h)=>h.rows-c.rows);const p=[];for(const c of d)p.some(h=>Math.abs(h-c.x)<r*1.2)||p.push(c.x);return p.sort((c,h)=>c-h)}let dn=null;function Hh(){const e=globalThis;return e.__SEGNET_MODEL_URL__?e.__SEGNET_MODEL_URL__:e.location&&e.location.href?new URL("models/segnet.onnx",e.location.href).href:"/models/segnet.onnx"}function jh(){const e=globalThis;return e.location&&e.location.href?new URL("ort-wasm-simd-threaded.wasm",e.location.href).href:"/ort-wasm-simd-threaded.wasm"}function Kh(){if(!dn){const e=globalThis;typeof e.WorkerGlobalScope<"u"&&typeof e.document>"u"&&(te.wasm.numThreads=1,te.wasm.wasmPaths={wasm:jh()}),dn=wr.create(Hh(),{executionProviders:["wasm"],graphOptimizationLevel:"all"})}return dn}function Xh(e,t,r,i,n,a,s,o,u){const l=Math.max(0,Math.round(n)),d=Math.min(r-1,Math.round(s)),p=Math.max(0,Math.round(a)),c=Math.min(i-1,Math.round(o)),h=[],f=[];for(let y=p;y<=c;y+=1)for(let _=l;_<=d;_+=1){const m=y*r+_;if(!e[m]||t[m])continue;f.length=0,f.push(m),t[m]=1;let g=0,$=0,b=0,w=r,x=-1,v=i,k=-1;for(;f.length>0;){const S=f.pop(),E=S%r,R=(S-E)/r;g+=1,$+=E,b+=R,E<w&&(w=E),E>x&&(x=E),R<v&&(v=R),R>k&&(k=R),E>l&&e[S-1]&&!t[S-1]&&(t[S-1]=1,f.push(S-1)),E<d&&e[S+1]&&!t[S+1]&&(t[S+1]=1,f.push(S+1)),R>p&&e[S-r]&&!t[S-r]&&(t[S-r]=1,f.push(S-r)),R<c&&e[S+r]&&!t[S+r]&&(t[S+r]=1,f.push(S+r))}g>=u&&h.push({minX:w,maxX:x,minY:v,maxY:k,width:x-w+1,height:k-v+1,area:g,cx:$/g,cy:b/g})}return h}async function Zh(e,t,r,i){let s;try{s=await Kh()}catch{return null}const o=i.map(y=>({top:Math.max(0,y.top-y.space*4.5),bottom:Math.min(r-1,y.bottom+y.space*4.5),left:Math.max(0,y.left-y.space*2),right:Math.min(t-1,y.right+y.space*2)})),u=[];for(let y=0;y<Math.max(r,320);y+=160){const _=Math.max(0,Math.min(y,Math.max(0,r-320)));for(let m=0;m<Math.max(t,320);m+=160){const g=Math.max(0,Math.min(m,Math.max(0,t-320)));o.some($=>_<$.bottom&&_+320>$.top&&g<$.right&&g+320>$.left)&&u.push({y:_,x:g})}}if(u.length===0)return null;const l=new Float32Array(t*r),d=new Uint16Array(t*r),p=4;for(let y=0;y<u.length;y+=p){const _=u.slice(y,y+p),m=new Float32Array(_.length*3*320*320);for(let w=0;w<_.length;w+=1){const{y:x,x:v}=_[w],k=Math.max(x,0),S=Math.max(v,0),E=Math.min(x+320,r),R=Math.min(v+320,t),O=w*3*320*320;for(let B=k;B<E;B+=1)for(let F=S;F<R;F+=1){const X=e[B*t+F],V=B-k,M=F-S,W=V*320+M;m[O+W]=X,m[O+320*320+W]=X,m[O+2*320*320+W]=X}}const g=new xe("float32",m,[_.length,3,320,320]),b=(await s.run({input:g}))[s.outputNames[0]].data;for(let w=0;w<_.length;w+=1){const{y:x,x:v}=_[w],k=Math.max(0,x),S=Math.max(0,v),E=Math.min(320,r-x),R=Math.min(320,t-v),O=w*6*320*320;for(let B=0;B<E;B+=1)for(let F=0;F<R;F+=1){let X=0,V=-1/0;const M=B*320+F;for(let U=0;U<6;U+=1){const H=b[O+U*320*320+M];H>V&&(V=H,X=U)}const W=(k+B)*t+(S+F);l[W]+=X,d[W]+=1}}}const c=new Uint8Array(t*r),h=new Uint8Array(t*r),f=new Uint8Array(t*r);for(let y=0;y<t*r;y+=1){const _=l[y]/(d[y]||1),m=Math.round(_);m===1?h[y]=1:m===2?c[y]=1:m===5&&(f[y]=1)}return{w:t,h:r,notehead:c,stemsRests:h,symbols:f}}function Qh(e,t){const{w:r,h:i}=e,n=new Uint8Array(r*i),a=new Map;for(const s of t){const o=s.space,u=Math.max(0,Math.round(s.scanTop)),l=Math.min(i-1,Math.round(s.scanBottom)),d=Math.min(r-1,Math.round(s.right)),p=s.systemIndex===0?o*6.5:o*3.5,c=Math.round(s.left+p);n.fill(0);const f=Xh(e.notehead,n,r,i,c,u,d,l,Math.max(8,o*o*.1)).filter(y=>{const _=y.width/y.height;return y.width>=o*.9&&y.height>=o*.7&&y.height<=o*2.6&&y.area>=o*o*.5&&_>=.55&&_<=3.5});a.set(s.index,f.map(y=>({x:y.cx,y:y.cy,k:Math.round((s.bottom-y.cy)*2/o),score:y.area,inner:y.area})))}return a}function Yh(e,t,r){const i=Qh(e,t),n=new Map;for(const a of t){const s=a.space,o=a.systemIndex===0?s*6.5:s*3.5,u=a.left+o,l=Np(r,a),d=qp(r,a,l),p=i.get(a.index)??[],c=[...p];for(const h of d){if(h.x<u-s*.4)continue;p.some(y=>Math.abs(y.x-h.x)<=s*1.2&&Math.abs(y.y-h.y)<=s*.7)||c.push(h)}n.set(a.index,c)}return n}function Fp(e,t,r,i){const n=[];for(const _ of r)n[_.systemIndex]||(n[_.systemIndex]=[]),n[_.systemIndex].push(_);const a=new Map,s=[],o=[],u=[],l=[],d=[],p=[];let c=0,h=0;for(const _ of n){if(!_||_.length===0)continue;const m=[..._].sort((v,k)=>v.top-k.top),g=m[0].space,$=Oh(t,m,g),b=m.length;let w=a.get(b);w||(w={name:b===2?"钢琴":b===1?"旋律":"多谱表",clefTreble:m.map(()=>0),clefBass:m.map(()=>0),staffMeasures:Array.from({length:b},()=>[])},a.set(b,w));const x=w;if(m.forEach((v,k)=>{v.clef==="treble"?x.clefTreble[k]+=1:x.clefBass[k]+=1}),e.debug){for(const v of m)s.push({index:v.index,top:v.top,bottom:v.bottom,left:v.left,right:v.right,space:v.space,clef:v.clef,systemIndex:v.systemIndex});for(const v of $)l.push({systemIndex:m[0].systemIndex,x:v.start})}m.forEach((v,k)=>{const S=Np(t,v);if(e.debug)for(const M of S)d.push({staffIndex:v.index,y:M.y,startX:M.startX,endX:M.endX});const E=(i==null?void 0:i.get(v.index))??qp(t,v,S);if(e.debug)for(const M of E)p.push({staffIndex:v.index,x:M.x,y:M.y,k:M.k,score:M.score});const R=Uh(E,v.space),O=Nh(R,v.space),B=$.map(()=>[]),F=[],X=[];for(const M of O){const W=Wp($,M.x),U=Lp(t,M.x,M.ys[0],v.space);if(!U)continue;const H=U==="filled",I=Ph(t,M.x,M.ys,v.space),N=Lh(t,S,M.x,M.ys,v.space),L=N>0,re=new Set(M.ks).size===1&&Math.max(or(t,v,M.x-1,v.space,S),or(t,v,M.x,v.space,S),or(t,v,M.x+1,v.space,S))>0,ne=(Math.min(...M.ys)+Math.max(...M.ys))/2;if(re){B[W].push({x:M.x,y:ne,k:0,filled:!1,stem:!1,beamed:!1,note:{id:ut("note"),pitches:[],type:4,dot:!1,rest:!0}});continue}if(H&&!I&&!L&&Pp(t,M.x,M.ys[0],v.space))continue;const ie=M.ks.map(mt=>Zp(Qp(v.clef)+mt)).sort((mt,Ce)=>mt.octave*7+"CDEFGAB".indexOf(mt.step)-(Ce.octave*7+"CDEFGAB".indexOf(Ce.step))),ge=H&&I&&!L&&qh(t,M.x,M.ys,v.space),he=H?N>=2?16:N===1||ge?8:4:I?2:1,ur=he===1?!1:Wh(t,v,M.x,M.ys[0],v.space);B[W].push({x:M.x,y:M.ys[0],k:M.ks[0],filled:H,stem:I,beamed:L,note:{id:ut("note"),pitches:ie,type:he,dot:ur,rest:!1}}),F.push(M.x),X.push({x:M.x,y:M.ys[0],stem:I}),c+=1}const V=Fh(t,v,v.space,F,X,S);for(const M of V){const W=Wp($,M);B[W].push({x:M,y:v.top+v.space*2,k:0,filled:!1,stem:!1,beamed:!1,note:{id:ut("note"),pitches:[],type:4,dot:!1,rest:!0}})}B.forEach(M=>{M.sort((H,I)=>H.x-I.x);const W=[];for(const H of M)H.note.rest&&(W.some(I=>Math.abs(I-H.x)<v.space*1.2)||W.push(H.x));const U=[];for(const H of M){if(H.note.rest){W.includes(H.x)&&U.push(H.note);continue}W.some(I=>Math.abs(I-H.x)<v.space*.9)||U.push(H.note)}if(e.debug)for(const H of U){const I=M.find(N=>N.note.id===H.id);I&&(H.rest?u.push({x:I.x,y:I.y,staffIndex:v.index,type:H.type}):o.push({x:I.x,y:I.y,k:I.k,staffIndex:v.index,type:H.type,dot:H.dot,filled:I.filled,stem:I.stem,beamed:I.beamed}))}x.staffMeasures[k].push({id:ut("measure"),notes:U})})}),h+=$.length}const f=[];for(const[_,m]of a)f.push({id:ut("part"),name:m.name,staves:Array.from({length:_},(g,$)=>({id:ut("staff"),clef:m.clefTreble[$]>m.clefBass[$]?"treble":m.clefBass[$]>m.clefTreble[$]?"bass":$===0?"treble":"bass",measures:m.staffMeasures[$]}))});if(c===0)return{ok:!1,error:"已找到谱线，但未识别到音符，请尝试更清晰的页面"};const y=f.reduce((_,m)=>_+m.staves.reduce((g,$)=>g+$.measures.reduce((b,w)=>b+w.notes.filter(x=>!x.rest).length,0),0),0);return{ok:!0,stats:{staves:r.length,measures:h,notes:y,width:t.w,height:t.h},debug:e.debug?{staves:s,notes:o,rests:u,barlines:l,beams:d,rawCandidates:p}:void 0,score:{title:"识别结果",composer:"",tempo:96,keyFifths:0,time:{beats:4,beatType:4},parts:f}}}async function Jh(e){if(e.width<20||e.height<20)return{ok:!1,error:"页面图像太小，无法识别"};const{gray:t,w:r,h:i}=wh(e),n=vh(t,r,i),a=Ih(n);if(a.length===0)return{ok:!1,error:"未检测到五线谱，请确认 PDF 页面为清晰的印刷乐谱"};Th(a);for(const s of a){const o=Ch(n,s);o&&(s.clef=o)}try{const s=await Zh(t,r,i,a);if(s){const o=Yh(s,a,n),u=Fp(e,n,a,o);if(u.ok)return u}}catch(s){e.debug&&console.warn("[segnet] 识别失败，回退启发式：",s)}return Fp(e,n,a)}const pn=self;pn.onmessage=async e=>{try{const t=await Jh(e.data);pn.postMessage(t)}catch(t){const r=t instanceof Error?t.message:"识别过程出现未知错误";pn.postMessage({ok:!1,error:r})}}})();
