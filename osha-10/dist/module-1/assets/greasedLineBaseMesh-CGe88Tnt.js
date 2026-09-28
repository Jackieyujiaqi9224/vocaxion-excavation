const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./textureMerger.fragment-Dv4Mhp89.js","./rolldown-runtime-B0Z9INg1.js","./shaderStore-DBiNfWDC.js","./textureMerger.fragment-TrNL1-XO.js","./greasedLine.vertex-BD6Df1dE.js","./clipPlaneVertexDeclaration-DvJWanBK.js","./mainUVVaryingDeclaration-Bgx_6krh.js","./logDepthDeclaration-Bgr7jMWX.js","./greasedLine.fragment-Bll41gv5.js","./greasedLine.vertex-DvnO9vew.js","./instancesVertex-DnDsYTdk.js","./greasedLine.fragment-BXSz7HUE.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{et as t,tt as n}from"./abstractEngine-D6wkb_-5.js";import{_ as r,v as i}from"./textureTools-CUEg0BNw.js";import{a,i as o,r as s,s as c}from"./math.vector-BkdMtVfm.js";import{i as l,r as u}from"./typeStore-Cabm4lgz.js";import{i as d,t as f}from"./math.color-Crhbjyg0.js";import{c as p,i as m}from"./math.path-BkyOGnOG.js";import{c as h,s as g}from"./tools-BGC6Orsr.js";import{n as _,t as v}from"./preload-helper-Ckak8w_N.js";import{n as y,r as b,t as x}from"./buffer-D2Cjl7hH.js";import{i as S,t as ee}from"./mesh-sCMZ5ws8.js";import{l as te,s as C}from"./abstractMesh-CYU9la3W.js";import{n as ne,t as re}from"./materialDefines-CB4vGlYM.js";import{a as w,i as T}from"./material.detailMapConfiguration-Mp-1kbPW.js";import{n as E,t as D}from"./rawTexture-DkX5IaF6.js";import{n as O,t as ie}from"./shaderMaterial-CoVwjEhA.js";import{n as ae,o as oe,s as se,t as ce}from"./proceduralTexture-B_FEBdyD.js";function le(e,t,n,r,i){return(1-e)*(1-e)*(1-e)*t+3*(1-e)*(1-e)*e*n+3*(1-e)*e*e*r+e*e*e*i}function k(e,t=new o(0,1),n=new o(0,.1),r=new o(0,.1),i=new o(1300,.1)){return le((e/i.x)**.333333,t.y,n.y,r.y,i.y)}var A=e((()=>{c()}));function j(e){return`texture`in e}function M(e){return`value`in e}function N(e,t){t.uOffset=e.uOffset,t.vOffset=e.vOffset,t.uScale=e.uScale,t.vScale=e.vScale,t.uAng=e.uAng,t.vAng=e.vAng,t.wAng=e.wAng,t.uRotationCenter=e.uRotationCenter,t.vRotationCenter=e.vRotationCenter}async function P(e,t,n){let r=[t.red,t.green,t.blue,t.alpha],i=[],a=[];for(let e=0;e<4;e++){let t=r[e];if(t){if(j(t)){if(t.sourceChannel<0||t.sourceChannel>3)throw Error(`Source channel must be between 0 and 3 (R, G, B, A)`);let n=i.indexOf(t.texture);n===-1&&(n=i.length,i.push(t.texture)),a[e]=n}else if(M(t)){if(t.value<0||t.value>1)throw Error(`Constant value must be between 0.0 and 1.0`);a[e]=-1}else throw Error(`Invalid channel input configuration`)}else a[e]=-1}let o=t.outputSize;if(!o&&i.length>0){let e=0;for(let t of i){let n=t.getSize(),r=Math.max(n.width,n.height);r>e&&(e=r,o=n.width===n.height?e:n)}}o||=512;let s=[],c=new Set;for(let e=0;e<4;e++){let t=r[e],n=[`RED`,`GREEN`,`BLUE`,`ALPHA`][e];if(t&&j(t)){s.push(`${n}_FROM_TEXTURE`);let t=a[e];c.add(t)}}c.forEach(e=>{s.push(`USE_TEXTURE${e}`)});let l={type:2,format:5,samplingMode:1,generateDepthBuffer:!1,generateMipMaps:!1,shaderLanguage:+!!n.getEngine().isWebGPU,extraInitializationsAsync:async()=>{n.getEngine().isWebGPU?await Promise.all([v(()=>import(`./textureMerger.fragment-Dv4Mhp89.js`),__vite__mapDeps([0,1,2]),import.meta.url)]):await Promise.all([v(()=>import(`./textureMerger.fragment-TrNL1-XO.js`),__vite__mapDeps([3,1,2]),import.meta.url)])}},u=new ce(e,o,R,n,l);u.refreshRate=-1,u.defines=s.length>0?`#define `+s.join(`
#define `)+`
`:``;for(let e=0;e<i.length;e++)N(i[e],u),u.setTexture(`inputTexture${e}`,i[e]);for(let e=0;e<4;e++){let t=r[e],n=[`red`,`green`,`blue`,`alpha`][e];if(t&&j(t)){let r=a[e];u.setInt(`${n}TextureIndex`,r),u.setInt(`${n}SourceChannel`,t.sourceChannel)}else{let r;r=t&&M(t)?t.value:+(e===3),u.setFloat(`${n}ConstantValue`,r)}}return await new Promise((e,t)=>{u.executeWhenReady(()=>{try{u.render(),e(u)}catch(e){t(e instanceof Error?e:Error(String(e)))}})})}function F(e,t){return{texture:e,sourceChannel:t}}function I(e){return{value:e}}function L(e,t,n,r){return{red:e,green:t,blue:n,alpha:r}}var R,z=e((()=>{ae(),_(),R=`textureMerger`})),B,V=e((()=>{d(),B=class{},B.DEFAULT_COLOR=f.White(),B.DEFAULT_WIDTH_ATTENUATED=1,B.DEFAULT_WIDTH=.1})),H,U=e((()=>{p(),b(),c(),se(),E(),i(),V(),H=class e{static ConvertPoints(e,t){if(e.length&&Array.isArray(e)&&typeof e[0]==`number`)return[e];if(e.length&&Array.isArray(e[0])&&typeof e[0][0]==`number`)return e;if(e.length&&!Array.isArray(e[0])&&e[0]instanceof a){let t=[];for(let n=0;n<e.length;n++){let r=e[n];t.push(r.x,r.y,r.z)}return[t]}if(e.length>0&&Array.isArray(e[0])&&e[0].length>0&&e[0][0]instanceof a){let t=[],n=e;for(let e of n)t.push(e.flatMap(e=>[e.x,e.y,e.z]));return t}if(e instanceof Float32Array){if(t?.floatArrayStride){let n=[],r=t.floatArrayStride*3;for(let t=0;t<e.length;t+=r){let i=Array(r);for(let n=0;n<r;n++)i[n]=e[t+n];n.push(i)}return n}return[Array.from(e)]}if(e.length&&e[0]instanceof Float32Array){let t=[];for(let n of e)t.push(Array.from(n));return t}return[]}static OmitZeroLengthPredicate(e,t,n){let r=[];return t.subtract(e).lengthSquared()>0&&r.push([e,t]),n.subtract(t).lengthSquared()>0&&r.push([t,n]),e.subtract(n).lengthSquared()>0&&r.push([n,e]),r.length===0?null:r}static OmitDuplicatesPredicate(t,n,r,i){let a=[];return e._SearchInPoints(t,n,i)||a.push([t,n]),e._SearchInPoints(n,r,i)||a.push([n,r]),e._SearchInPoints(r,t,i)||a.push([r,t]),a.length===0?null:a}static _SearchInPoints(e,t,n){for(let r of n)for(let n=0;n<r.length;n++)if(r[n]?.equals(e)&&(r[n+1]?.equals(t)||r[n-1]?.equals(t)))return!0;return!1}static MeshesToLines(e,t){let n=[];for(let r=0;r<e.length;r++){let i=e[r],o=i.getVerticesData(y.PositionKind),s=i.getIndices();if(o&&s)for(let e=0,c=0;e<s.length;e++){let l=s[c++]*3,u=s[c++]*3,d=s[c++]*3,f=new a(o[l],o[l+1],o[l+2]),p=new a(o[u],o[u+1],o[u+2]),m=new a(o[d],o[d+1],o[d+2]);if(t){let a=t(f,p,m,n,e,l,i,r,o,s);if(a)for(let e of a)n.push(e)}else n.push([f,p],[p,m],[m,f])}}return n}static ToVector3Array(e){if(Array.isArray(e[0])){let t=[],n=e;for(let e of n){let n=[];for(let t=0;t<e.length;t+=3)n.push(new a(e[t],e[t+1],e[t+2]));t.push(n)}return t}let t=e,n=[];for(let e=0;e<t.length;e+=3)n.push(new a(t[e],t[e+1],t[e+2]));return n}static ToNumberArray(e){return e.flatMap(e=>[e.x,e.y,e.z])}static GetPointsCountInfo(e){let t=Array(e.length),n=0;for(let r=e.length;r--;)t[r]=e[r].length/3,n+=t[r];return{total:n,counts:t}}static GetLineLength(t){if(t.length===0)return 0;let n;n=typeof t[0]==`number`?e.ToVector3Array(t):t;let r=s.Vector3[0],i=0;for(let e=0;e<n.length-1;e++){let t=n[e],a=n[e+1];i+=a.subtractToRef(t,r).length()}return i}static GetLineLengthArray(e,t){let n=t?new Float32Array(t,0,e.length/3):new Float32Array(e.length/3),r=0;for(let t=0,i=e.length/3-1;t<i;t++){let i=e[t*3+0],a=e[t*3+1],o=e[t*3+2];i-=e[t*3+3],a-=e[t*3+4],o-=e[t*3+5];let s=Math.sqrt(i*i+a*a+o*o);r+=s,n[t+1]=r}return n}static SegmentizeSegmentByCount(e,t,n){let r=[],i=t.subtract(e),a=s.Vector3[0];a.setAll(n);let o=s.Vector3[1];i.divideToRef(a,o);let c=e.clone();r.push(c);for(let e=0;e<n;e++)c=c.clone(),r.push(c.addInPlace(o));return r}static SegmentizeLineBySegmentLength(t,n){let r=t[0]instanceof a?e.GetLineSegments(t):typeof t[0]==`number`?e.GetLineSegments(e.ToVector3Array(t)):t,i=[];for(let t of r)if(t.length>n){let r=e.SegmentizeSegmentByCount(t.point1,t.point2,Math.ceil(t.length/n));for(let e of r)i.push(e)}else i.push(t.point1),i.push(t.point2);return i}static SegmentizeLineBySegmentCount(t,n){let r=typeof t[0]==`number`?e.ToVector3Array(t):t,i=e.GetLineLength(r)/n;return e.SegmentizeLineBySegmentLength(r,i)}static GetLineSegments(e){let t=[];for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=i.subtract(r).length();t.push({point1:r,point2:i,length:a})}return t}static GetMinMaxSegmentLength(t){let n=e.GetLineSegments(t).sort(e=>e.length);return{min:n[0].length,max:n[n.length-1].length}}static GetPositionOnLineByVisibility(e,t,n,r=!1){let i=t*n,a=0,o=0,c=e.length;for(let t=0;t<c;t++){if(i<=a+e[t].length){o=t;break}a+=e[t].length}let l=(i-a)/e[o].length;return e[o].point2.subtractToRef(e[o].point1,s.Vector3[0]),s.Vector3[1]=s.Vector3[0].multiplyByFloats(l,l,l),r||s.Vector3[1].addInPlace(e[o].point1),s.Vector3[1].clone()}static GetCircleLinePoints(e,t,n=0,r=e,i=Math.PI*2/t){let o=[];for(let s=0;s<=t;s++)o.push(new a(Math.cos(s*i)*e,Math.sin(s*i)*r,n));return o}static GetBezierLinePoints(e,t,n,r){return m.CreateQuadraticBezier(e,t,n,r).getPoints().flatMap(e=>[e.x,e.y,e.z])}static GetArrowCap(e,t,n,r,i,a=0,o=0){return{points:[e.clone(),e.add(t.multiplyByFloats(n,n,n))],widths:[r,i,a,o]}}static GetPointsFromText(e,t,n,r,i=0,a=!0){let o=[],s=oe(e,t,n,r);for(let e of s){for(let t of e.paths){let e=[],n=t.getPoints();for(let t of n)e.push(t.x,t.y,i);o.push(e)}if(a)for(let t of e.holes){let e=[],n=t.getPoints();for(let t of n)e.push(t.x,t.y,i);o.push(e)}}return o}static Color3toRGBAUint8(e){let t=new Uint8Array(e.length*4);for(let n=0,r=0;n<e.length;n++)t[r++]=e[n].r*255,t[r++]=e[n].g*255,t[r++]=e[n].b*255,t[r++]=255;return t}static CreateColorsTexture(t,n,i,a){let o=a.getEngine().getCaps().maxTextureSize??1,s=n.length>o?o:n.length,c=Math.ceil(n.length/o);c>1&&(n=[...n,...Array(s*c-n.length).fill(n[0])]);let l=e.Color3toRGBAUint8(n),u=new D(l,s,c,r.TEXTUREFORMAT_RGBA,a,!1,!0,i);return u.name=t,u}static PrepareEmptyColorsTexture(e){return B.EmptyColorsTexture||(B.EmptyColorsTexture=new D(new Uint8Array(4),1,1,r.TEXTUREFORMAT_RGBA,e,!1,!1,D.NEAREST_NEAREST),B.EmptyColorsTexture.name=`grlEmptyColorsTexture`),B.EmptyColorsTexture}static DisposeEmptyColorsTexture(){B.EmptyColorsTexture?.dispose(),B.EmptyColorsTexture=null}static BooleanToNumber(e){return+!!e}}}));function ue(e,t){if(e===`vertex`){let e={CUSTOM_VERTEX_DEFINITIONS:`
                attribute float grl_widths;
                attribute vec3 grl_offsets;
                attribute float grl_colorPointers;
                varying float grlCounters;
                varying float grlColorPointer;

                #ifdef GREASED_LINE_CAMERA_FACING
                    attribute vec4 grl_previousAndSide;
                    attribute vec4 grl_nextAndCounters;

                    vec2 grlFix( vec4 i, float aspect ) {
                        vec2 res = i.xy / i.w;
                        res.x *= aspect;
                        return res;
                    }
                #else
                    attribute vec3 grl_slopes;
                    attribute float grl_counters;
                #endif
                `,CUSTOM_VERTEX_UPDATE_POSITION:`
                #ifdef GREASED_LINE_CAMERA_FACING
                    vec3 grlPositionOffset = grl_offsets;
                    positionUpdated += grlPositionOffset;
                #else
                    positionUpdated = (positionUpdated + grl_offsets) + (grl_slopes * grl_widths);
                #endif
                `,CUSTOM_VERTEX_MAIN_END:`
                grlColorPointer = grl_colorPointers;

                #ifdef GREASED_LINE_CAMERA_FACING

                    float grlAspect = grl_aspect_resolution_lineWidth.x;
                    float grlBaseWidth = grl_aspect_resolution_lineWidth.w;

                    vec3 grlPrevious = grl_previousAndSide.xyz;
                    float grlSide = grl_previousAndSide.w;

                    vec3 grlNext = grl_nextAndCounters.xyz;
                    grlCounters = grl_nextAndCounters.w;
                    float grlWidth = grlBaseWidth * grl_widths;
                    
                    vec3 worldDir = normalize(grlNext - grlPrevious);
                    vec3 nearPosition = positionUpdated + (worldDir * 0.01);
                    mat4 grlMatrix = viewProjection * finalWorld;
                    vec4 grlFinalPosition = grlMatrix * vec4(positionUpdated , 1.0);
                    vec4 screenNearPos = grlMatrix * vec4(nearPosition, 1.0);
                    vec2 grlLinePosition = grlFix(grlFinalPosition, grlAspect);
                    vec2 grlLineNearPosition = grlFix(screenNearPos, grlAspect);
                    vec2 grlDir = normalize(grlLineNearPosition - grlLinePosition);

                    vec4 grlNormal = vec4(-grlDir.y, grlDir.x, 0., 1.);

                    #ifdef GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM
                        grlNormal.xy *= -.5 * grlWidth;
                    #else
                        grlNormal.xy *= .5 * grlWidth;
                    #endif

                    grlNormal *= grl_projection;

                    #ifdef GREASED_LINE_SIZE_ATTENUATION
                        grlNormal.xy *= grlFinalPosition.w;
                        grlNormal.xy /= (vec4(grl_aspect_resolution_lineWidth.yz, 0., 1.) * grl_projection).xy;
                    #endif

                    grlFinalPosition.xy += grlNormal.xy * grlSide;
                    gl_Position = grlFinalPosition;

                    vPositionW = vec3(grlFinalPosition);
                #else
                    grlCounters = grl_counters;
                #endif
                `};return t&&(e[`!gl_Position\\=viewProjection\\*worldPos;`]=`//`),e}return e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:`
                    #ifdef PBR
                         #define grlFinalColor finalColor
                    #else
                         #define grlFinalColor color
                    #endif

                    varying float grlCounters;
                    varying float grlColorPointer;
                    uniform sampler2D grl_colors;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
                    float grlColorMode = grl_colorMode_visibility_colorsWidth_useColors.x;
                    float grlVisibility = grl_colorMode_visibility_colorsWidth_useColors.y;
                    float grlColorsWidth = grl_colorMode_visibility_colorsWidth_useColors.z;
                    float grlUseColors = grl_colorMode_visibility_colorsWidth_useColors.w;

                    float grlUseDash = grl_dashOptions.x;
                    float grlDashArray = grl_dashOptions.y;
                    float grlDashOffset = grl_dashOptions.z;
                    float grlDashRatio = grl_dashOptions.w;

                    grlFinalColor.a *= step(grlCounters, grlVisibility);
                    if(grlFinalColor.a == 0.) discard;

                    if(grlUseDash == 1.){
                        grlFinalColor.a *= ceil(mod(grlCounters + grlDashOffset, grlDashArray) - (grlDashArray * grlDashRatio));
                        if (grlFinalColor.a == 0.) discard;
                    }

                    #ifdef GREASED_LINE_HAS_COLOR
                        if (grlColorMode == 0.) {
                            grlFinalColor.rgb = grl_singleColor;
                        } else if (grlColorMode == 1.) {
                            grlFinalColor.rgb += grl_singleColor;
                        } else if (grlColorMode == 2.) {
                            grlFinalColor.rgb *= grl_singleColor;
                        }
                    #else
                        if (grlUseColors == 1.) {
                            #ifdef GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE
                                vec4 grlColor = texture2D(grl_colors, vec2(grlCounters, 0.), 0.);
                            #else
                                vec2 lookup = vec2(fract(grlColorPointer / grl_textureSize.x), 1.0 - floor(grlColorPointer / grl_textureSize.x) / max(grl_textureSize.y - 1.0, 1.0));
                                vec4 grlColor = texture2D(grl_colors, lookup, 0.0);
                            #endif
                            if (grlColorMode == 0.) {
                                grlFinalColor = grlColor;
                            } else if (grlColorMode == 1.) {
                                grlFinalColor += grlColor;
                            } else if (grlColorMode == 2.) {
                                grlFinalColor *= grlColor;
                            }
                        }
                    #endif
                `}:null}var de=e((()=>{}));function fe(e,t){if(e===`vertex`){let e={CUSTOM_VERTEX_DEFINITIONS:`
                attribute grl_widths: f32;
                attribute grl_colorPointers: f32;
                varying grlCounters: f32;
                varying grlColorPointer: f32;

                #ifdef GREASED_LINE_USE_OFFSETS
                    attribute grl_offsets: vec3f;   
                #endif

                #ifdef GREASED_LINE_CAMERA_FACING
                    attribute grl_previousAndSide : vec4f;
                    attribute grl_nextAndCounters : vec4f;

                    fn grlFix(i: vec4f, aspect: f32) -> vec2f {
                        var res = i.xy / i.w;
                        res.x *= aspect;
                        return res;
                    }
                #else
                    attribute grl_slopes: f32;
                    attribute grl_counters: f32;
                #endif


                `,CUSTOM_VERTEX_UPDATE_POSITION:`
                #ifdef GREASED_LINE_USE_OFFSETS
                    var grlPositionOffset: vec3f = input.grl_offsets;
                #else
                    var grlPositionOffset = vec3f(0.);
                #endif

                #ifdef GREASED_LINE_CAMERA_FACING
                    positionUpdated += grlPositionOffset;
                #else
                    positionUpdated = (positionUpdated + grlPositionOffset) + (input.grl_slopes * input.grl_widths);
                #endif
                `,CUSTOM_VERTEX_MAIN_END:`
                vertexOutputs.grlColorPointer = input.grl_colorPointers;

                #ifdef GREASED_LINE_CAMERA_FACING

                    let grlAspect: f32 = uniforms.grl_aspect_resolution_lineWidth.x;
                    let grlBaseWidth: f32 = uniforms.grl_aspect_resolution_lineWidth.w;

                    let grlPrevious: vec3f = input.grl_previousAndSide.xyz;
                    let grlSide: f32 = input.grl_previousAndSide.w;

                    let grlNext: vec3f = input.grl_nextAndCounters.xyz;
                    vertexOutputs.grlCounters = input.grl_nextAndCounters.w;

                    let grlWidth: f32 = grlBaseWidth * input.grl_widths;

                    let worldDir: vec3f = normalize(grlNext - grlPrevious);
                    let nearPosition: vec3f = positionUpdated + (worldDir * 0.01);
                    let grlMatrix: mat4x4f = uniforms.viewProjection * finalWorld;
                    let grlFinalPosition: vec4f = grlMatrix * vec4f(positionUpdated, 1.0); 
                    let screenNearPos: vec4f = grlMatrix * vec4(nearPosition, 1.0);
                    let grlLinePosition: vec2f = grlFix(grlFinalPosition, grlAspect);
                    let grlLineNearPosition: vec2f = grlFix(screenNearPos, grlAspect);
                    let grlDir: vec2f = normalize(grlLineNearPosition - grlLinePosition);

                    var grlNormal: vec4f = vec4f(-grlDir.y, grlDir.x, 0.0, 1.0);

                    let grlHalfWidth: f32 = 0.5 * grlWidth;
                    #if defined(GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM)
                        grlNormal.x *= -grlHalfWidth;
                        grlNormal.y *= -grlHalfWidth;
                    #else
                        grlNormal.x *= grlHalfWidth;
                        grlNormal.y *= grlHalfWidth;
                    #endif

                    grlNormal *= uniforms.grl_projection;

                    #if defined(GREASED_LINE_SIZE_ATTENUATION)
                        grlNormal.x *= grlFinalPosition.w;
                        grlNormal.y *= grlFinalPosition.w;

                        let pr = vec4f(uniforms.grl_aspect_resolution_lineWidth.yz, 0.0, 1.0) * uniforms.grl_projection;
                        grlNormal.x /= pr.x;
                        grlNormal.y /= pr.y;
                    #endif

                    vertexOutputs.position = vec4f(grlFinalPosition.xy + grlNormal.xy * grlSide, grlFinalPosition.z, grlFinalPosition.w);
                    vertexOutputs.vPositionW = vertexOutputs.position.xyz;
                
                #else
                    vertexOutputs.grlCounters = input.grl_counters;
                #endif
                `};return t&&(e[`!vertexOutputs\\.position\\s=\\sscene\\.viewProjection\\s\\*\\sworldPos;`]=`//`),e}return e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:`
                    #ifdef PBR
                         #define grlFinalColor finalColor
                    #else
                         #define grlFinalColor color
                    #endif

                    varying grlCounters: f32;
                    varying grlColorPointer: 32;

                    var grl_colors: texture_2d<f32>;
                    var grl_colorsSampler: sampler;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
                    let grlColorMode: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.x;
                    let grlVisibility: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.y;
                    let grlColorsWidth: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.z;
                    let grlUseColors: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.w;

                    let grlUseDash: f32 = uniforms.grl_dashOptions.x;
                    let grlDashArray: f32 = uniforms.grl_dashOptions.y;
                    let grlDashOffset: f32 = uniforms.grl_dashOptions.z;
                    let grlDashRatio: f32 = uniforms.grl_dashOptions.w;

                    grlFinalColor.a *= step(fragmentInputs.grlCounters, grlVisibility);
                    if (grlFinalColor.a == 0.0) {
                        discard;
                    }

                    if (grlUseDash == 1.0) {
                        let dashPosition = (fragmentInputs.grlCounters + grlDashOffset) % grlDashArray;
                        grlFinalColor.a *= ceil(dashPosition - (grlDashArray * grlDashRatio));

                        if (grlFinalColor.a == 0.0) {
                            discard;
                        }
                    }

                    #ifdef GREASED_LINE_HAS_COLOR
                        if (grlColorMode == 0.) {
                            grlFinalColor = vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        } else if (grlColorMode == 1.) {
                            grlFinalColor += vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        } else if (grlColorMode == 2.) {
                            grlFinalColor *= vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        }
                    #else
                        if (grlUseColors == 1.) {
                            #ifdef GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE
                                let grlColor: vec4f = textureSample(grl_colors, grl_colorsSampler, vec2f(fragmentInputs.grlCounters, 0.));
                            #else
                                let lookup: vec2f = vec2(fract(fragmentInputs.grlColorPointer / uniforms.grl_textureSize.x), 1.0 - floor(fragmentInputs.grlColorPointer / uniforms.grl_textureSize.x) / max(uniforms.grl_textureSize.y - 1.0, 1.0));
                                let grlColor: vec4f = textureSample(grl_colors, grl_colorsSampler, lookup);
                            #endif
                            if (grlColorMode == 0.) {
                                grlFinalColor = grlColor;
                            } else if (grlColorMode == 1.) {
                                grlFinalColor += grlColor;
                            } else if (grlColorMode == 2.) {
                                grlFinalColor *= grlColor;
                            }
                        }
                    #endif


                `}:null}var pe=e((()=>{})),W,G,K=e((()=>{E(),w(),c(),ne(),l(),V(),U(),de(),pe(),W=class extends re{constructor(){super(...arguments),this.GREASED_LINE_HAS_COLOR=!1,this.GREASED_LINE_SIZE_ATTENUATION=!1,this.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=!1,this.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=!1,this.GREASED_LINE_CAMERA_FACING=!0,this.GREASED_LINE_USE_OFFSETS=!1}},G=class e extends T{isCompatible(e){return!0}constructor(t,n,r){r||={color:B.DEFAULT_COLOR};let i=new W;i.GREASED_LINE_HAS_COLOR=!!r.color&&!r.useColors,i.GREASED_LINE_SIZE_ATTENUATION=r.sizeAttenuation??!1,i.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=r.colorDistributionType===1,i.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=(n??t.getScene()).useRightHandedSystem,i.GREASED_LINE_CAMERA_FACING=r.cameraFacing??!0,super(t,e.GREASED_LINE_MATERIAL_NAME,200,i,!0,!0),this.colorsTexture=null,this._forceGLSL=!1,this._forceGLSL=r?.forceGLSL||e.ForceGLSL,this._scene=n??t.getScene(),this._engine=this._scene.getEngine(),this._cameraFacing=r.cameraFacing??!0,this.visibility=r.visibility??1,this.useDash=r.useDash??!1,this.dashRatio=r.dashRatio??.5,this.dashOffset=r.dashOffset??0,this.width=r.width?r.width:r.sizeAttenuation?B.DEFAULT_WIDTH_ATTENUATED:B.DEFAULT_WIDTH,this._sizeAttenuation=r.sizeAttenuation??!1,this.colorMode=r.colorMode??0,this._color=r.color??null,this.useColors=r.useColors??!1,this._colorsDistributionType=r.colorDistributionType??0,this.colorsSampling=r.colorsSampling??D.NEAREST_NEAREST,this._colors=r.colors??null,this.dashCount=r.dashCount??1,this.resolution=r.resolution??new o(this._engine.getRenderWidth(),this._engine.getRenderHeight()),r.colorsTexture?this.colorsTexture=r.colorsTexture:this._colors?this.colorsTexture=H.CreateColorsTexture(`${t.name}-colors-texture`,this._colors,this.colorsSampling,this._scene):(this._color=this._color??B.DEFAULT_COLOR,H.PrepareEmptyColorsTexture(this._scene)),this._engine.onDisposeObservable.add(()=>{H.DisposeEmptyColorsTexture()})}getAttributes(e){e.push(`grl_offsets`),e.push(`grl_widths`),e.push(`grl_colorPointers`),e.push(`grl_counters`),this._cameraFacing?(e.push(`grl_previousAndSide`),e.push(`grl_nextAndCounters`)):e.push(`grl_slopes`)}getSamplers(e){e.push(`grl_colors`)}getActiveTextures(e){this.colorsTexture&&e.push(this.colorsTexture)}getUniforms(e=0){let t=[{name:`grl_singleColor`,size:3,type:`vec3`},{name:`grl_textureSize`,size:2,type:`vec2`},{name:`grl_dashOptions`,size:4,type:`vec4`},{name:`grl_colorMode_visibility_colorsWidth_useColors`,size:4,type:`vec4`}];return this._cameraFacing&&t.push({name:`grl_projection`,size:16,type:`mat4`},{name:`grl_aspect_resolution_lineWidth`,size:4,type:`vec4`}),e===1&&t.push({name:`viewProjection`,size:16,type:`mat4`}),{ubo:t,vertex:this._cameraFacing&&this._isGLSL(e)?`
                    uniform vec4 grl_aspect_resolution_lineWidth;
                    uniform mat4 grl_projection;
    `:``,fragment:this._isGLSL(e)?`
                    uniform vec4 grl_dashOptions;
                    uniform vec2 grl_textureSize;
                    uniform vec4 grl_colorMode_visibility_colorsWidth_useColors;
                    uniform vec3 grl_singleColor;
    `:``}}get isEnabled(){return!0}bindForSubMesh(e){if(this._cameraFacing){e.updateMatrix(`grl_projection`,this._scene.getProjectionMatrix()),this._isGLSL(this._material.shaderLanguage)||e.updateMatrix(`viewProjection`,this._scene.getTransformMatrix());let t=s.Vector4[0];t.x=this._aspect,t.y=this._resolution.x,t.z=this._resolution.y,t.w=this.width,e.updateVector4(`grl_aspect_resolution_lineWidth`,t)}let t=s.Vector4[0];t.x=H.BooleanToNumber(this.useDash),t.y=this._dashArray,t.z=this.dashOffset,t.w=this.dashRatio,e.updateVector4(`grl_dashOptions`,t);let n=s.Vector4[1];n.x=this.colorMode,n.y=this.visibility,n.z=this.colorsTexture?this.colorsTexture.getSize().width:0,n.w=H.BooleanToNumber(this.useColors),e.updateVector4(`grl_colorMode_visibility_colorsWidth_useColors`,n),this._color&&e.updateColor3(`grl_singleColor`,this._color);let r=this.colorsTexture??B.EmptyColorsTexture;e.setTexture(`grl_colors`,r),e.updateFloat2(`grl_textureSize`,r?.getSize().width??1,r?.getSize().height??1)}prepareDefines(e,t,n){e.GREASED_LINE_HAS_COLOR=!!this.color&&!this.useColors,e.GREASED_LINE_SIZE_ATTENUATION=this._sizeAttenuation,e.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=this._colorsDistributionType===1,e.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=t.useRightHandedSystem,e.GREASED_LINE_CAMERA_FACING=this._cameraFacing,e.GREASED_LINE_USE_OFFSETS=!!n.offsets}getClassName(){return e.GREASED_LINE_MATERIAL_NAME}getCustomCode(e,t=0){return this._isGLSL(t)?ue(e,this._cameraFacing):fe(e,this._cameraFacing)}dispose(){this.colorsTexture?.dispose(),super.dispose()}get colors(){return this._colors}set colors(e){this.setColors(e)}setColors(e,t=!1,n=!1){let r=this._colors?.length??0;if(this._colors=e,e===null||e.length===0){this.colorsTexture?.dispose();return}if(!t||n){if(this.colorsTexture&&r===e.length&&!n){let t=H.Color3toRGBAUint8(e);this.colorsTexture.update(t)}else this.colorsTexture?.dispose(),this.colorsTexture=H.CreateColorsTexture(`${this._material.name}-colors-texture`,e,this.colorsSampling,this._scene)}}updateLazy(){this._colors&&this.setColors(this._colors,!1,!0)}get dashCount(){return this._dashCount}set dashCount(e){this._dashCount=e,this._dashArray=1/e}get sizeAttenuation(){return this._sizeAttenuation}set sizeAttenuation(e){this._sizeAttenuation=e,this.markAllDefinesAsDirty()}get color(){return this._color}set color(e){this.setColor(e)}setColor(e,t=!1){this._color===null&&e!==null||this._color!==null&&e===null?(this._color=e,t||this.markAllDefinesAsDirty()):this._color=e}get colorsDistributionType(){return this._colorsDistributionType}set colorsDistributionType(e){this._colorsDistributionType=e,this.markAllDefinesAsDirty()}get resolution(){return this._resolution}set resolution(e){this._aspect=e.x/e.y,this._resolution=e}serialize(){let e=super.serialize(),t={colorDistributionType:this._colorsDistributionType,colorsSampling:this.colorsSampling,colorMode:this.colorMode,dashCount:this._dashCount,dashOffset:this.dashOffset,dashRatio:this.dashRatio,resolution:this._resolution,sizeAttenuation:this._sizeAttenuation,useColors:this.useColors,useDash:this.useDash,visibility:this.visibility,width:this.width};return this._colors&&(t.colors=this._colors),this._color&&(t.color=this._color),e.greasedLineMaterialOptions=t,e}parse(e,t,n){super.parse(e,t,n);let r=e.greasedLineMaterialOptions;this.colorsTexture?.dispose(),r.color&&this.setColor(r.color,!0),r.colorDistributionType&&(this.colorsDistributionType=r.colorDistributionType),r.colors&&(this.colors=r.colors),r.colorsSampling&&(this.colorsSampling=r.colorsSampling),r.colorMode&&(this.colorMode=r.colorMode),r.useColors&&(this.useColors=r.useColors),r.visibility&&(this.visibility=r.visibility),r.useDash&&(this.useDash=r.useDash),r.dashCount&&(this.dashCount=r.dashCount),r.dashRatio&&(this.dashRatio=r.dashRatio),r.dashOffset&&(this.dashOffset=r.dashOffset),r.width&&(this.width=r.width),r.sizeAttenuation&&(this.sizeAttenuation=r.sizeAttenuation),r.resolution&&(this.resolution=r.resolution),this.colors?this.colorsTexture=H.CreateColorsTexture(`${this._material.name}-colors-texture`,this.colors,this.colorsSampling,t):H.PrepareEmptyColorsTexture(t),this.markAllDefinesAsDirty()}copyTo(e){let t=e;t.colorsTexture?.dispose(),this._colors&&(t.colorsTexture=H.CreateColorsTexture(`${t._material.name}-colors-texture`,this._colors,t.colorsSampling,this._scene)),t.setColor(this.color,!0),t.colorsDistributionType=this.colorsDistributionType,t.colorsSampling=this.colorsSampling,t.colorMode=this.colorMode,t.useColors=this.useColors,t.visibility=this.visibility,t.useDash=this.useDash,t.dashCount=this.dashCount,t.dashRatio=this.dashRatio,t.dashOffset=this.dashOffset,t.width=this.width,t.sizeAttenuation=this.sizeAttenuation,t.resolution=this.resolution,t.markAllDefinesAsDirty()}_isGLSL(e){return e===0||this._forceGLSL}},G.GREASED_LINE_MATERIAL_NAME=`GreasedLinePluginMaterial`,G.ForceGLSL=!1,u(`BABYLON.${G.GREASED_LINE_MATERIAL_NAME}`,G)})),q,J,Y=e((()=>{E(),O(),d(),c(),n(),U(),V(),_(),q=`GREASED_LINE_USE_OFFSETS`,J=class e extends ie{constructor(n,r,i){let a=r.getEngine(),s=a.isWebGPU&&!(i.forceGLSL||e.ForceGLSL),c=[`COLOR_DISTRIBUTION_TYPE_LINE 1.`,`COLOR_DISTRIBUTION_TYPE_SEGMENT 0.`,`COLOR_MODE_SET 0.`,`COLOR_MODE_ADD 1.`,`COLOR_MODE_MULTIPLY 2.`];r.useRightHandedSystem&&c.push(`GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM`);let l=[`position`,`grl_widths`,`grl_offsets`,`grl_colorPointers`];i.cameraFacing?(c.push(`GREASED_LINE_CAMERA_FACING`),l.push(`grl_previousAndSide`,`grl_nextAndCounters`)):(l.push(`grl_slopes`),l.push(`grl_counters`));let u=[`grlColorsWidth`,`grlUseColors`,`grlWidth`,`grlColor`,`grl_colorModeAndColorDistributionType`,`grlResolution`,`grlAspect`,`grlAizeAttenuation`,`grlDashArray`,`grlDashOffset`,`grlDashRatio`,`grlUseDash`,`grlVisibility`,`grlColors`];if(s||u.push(`world`,`viewProjection`,`view`,`projection`),super(n,r,{vertex:`greasedLine`,fragment:`greasedLine`},{uniformBuffers:s?[`Scene`,`Mesh`]:void 0,attributes:l,uniforms:u,samplers:s?[]:[`grlColors`],defines:c,extraInitializationsAsync:async()=>{s?await Promise.all([v(()=>import(`./greasedLine.vertex-BD6Df1dE.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([4,1,2,5,6,7]),import.meta.url),v(()=>import(`./greasedLine.fragment-Bll41gv5.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([8,1,2]),import.meta.url)]):await Promise.all([v(()=>import(`./greasedLine.vertex-DvnO9vew.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([9,1,2,10]),import.meta.url),v(()=>import(`./greasedLine.fragment-BXSz7HUE.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([11,1,2]),import.meta.url)])},shaderLanguage:+!!s}),this._color=f.White(),this._colorsDistributionType=0,this._colorsTexture=null,i||={color:B.DEFAULT_COLOR},this.visibility=i.visibility??1,this.useDash=i.useDash??!1,this.dashRatio=i.dashRatio??.5,this.dashOffset=i.dashOffset??0,this.dashCount=i.dashCount??1,this.width=i.width?i.width:i.sizeAttenuation&&i.cameraFacing?B.DEFAULT_WIDTH_ATTENUATED:B.DEFAULT_WIDTH,this.sizeAttenuation=i.sizeAttenuation??!1,this.color=i.color??f.White(),this.useColors=i.useColors??!1,this.colorsDistributionType=i.colorDistributionType??0,this.colorsSampling=i.colorsSampling??D.NEAREST_NEAREST,this.colorMode=i.colorMode??0,this._colors=i.colors??null,this._cameraFacing=i.cameraFacing??!0,this.resolution=i.resolution??new o(a.getRenderWidth(),a.getRenderHeight()),i.colorsTexture?this.colorsTexture=i.colorsTexture:this._colors?this.colorsTexture=H.CreateColorsTexture(`${this.name}-colors-texture`,this._colors,this.colorsSampling,r):(this._color=this._color??B.DEFAULT_COLOR,this.colorsTexture=H.PrepareEmptyColorsTexture(r)),s){let e=new t;e.setParameters(),e.samplingMode=this.colorsSampling,this.setTextureSampler(`grlColorsSampler`,e)}a.onDisposeObservable.add(()=>{H.DisposeEmptyColorsTexture()})}dispose(){this._colorsTexture?.dispose(),super.dispose()}_setColorModeAndColorDistributionType(){this.setVector2(`grl_colorModeAndColorDistributionType`,new o(this._colorMode,this._colorsDistributionType))}updateLazy(){this._colors&&this.setColors(this._colors,!1,!0)}get colors(){return this._colors}set colors(e){this.setColors(e)}setColors(e,t=!1,n=!1){let r=this._colors?.length??0;if(this._colors=e,e===null||e.length===0){this._colorsTexture?.dispose();return}if(!t||n){if(this._colorsTexture&&r===e.length&&!n){let t=H.Color3toRGBAUint8(e);this._colorsTexture.update(t)}else this._colorsTexture?.dispose(),this.colorsTexture=H.CreateColorsTexture(`${this.name}-colors-texture`,e,this.colorsSampling,this.getScene())}}get colorsTexture(){return this._colorsTexture??null}set colorsTexture(e){this._colorsTexture=e,this.setFloat(`grlColorsWidth`,this._colorsTexture.getSize().width),this.setTexture(`grlColors`,this._colorsTexture)}get width(){return this._width}set width(e){this._width=e,this.setFloat(`grlWidth`,e)}get useColors(){return this._useColors}set useColors(e){this._useColors=e,this.setFloat(`grlUseColors`,H.BooleanToNumber(e))}get colorsSampling(){return this._colorsSampling}set colorsSampling(e){this._colorsSampling=e}get visibility(){return this._visibility}set visibility(e){this._visibility=e,this.setFloat(`grlVisibility`,e)}get useDash(){return this._useDash}set useDash(e){this._useDash=e,this.setFloat(`grlUseDash`,H.BooleanToNumber(e))}get dashOffset(){return this._dashOffset}set dashOffset(e){this._dashOffset=e,this.setFloat(`grlDashOffset`,e)}get dashRatio(){return this._dashRatio}set dashRatio(e){this._dashRatio=e,this.setFloat(`grlDashRatio`,e)}get dashCount(){return this._dashCount}set dashCount(e){this._dashCount=e,this._dashArray=1/e,this.setFloat(`grlDashArray`,this._dashArray)}get sizeAttenuation(){return this._sizeAttenuation}set sizeAttenuation(e){this._sizeAttenuation=e,this.setFloat(`grlSizeAttenuation`,H.BooleanToNumber(e))}get color(){return this._color}set color(e){this.setColor(e)}setColor(e){e??=B.DEFAULT_COLOR,this._color=e,this.setColor3(`grlColor`,e)}get colorsDistributionType(){return this._colorsDistributionType}set colorsDistributionType(e){this._colorsDistributionType=e,this._setColorModeAndColorDistributionType()}get colorMode(){return this._colorMode}set colorMode(e){this._colorMode=e,this._setColorModeAndColorDistributionType()}get resolution(){return this._resolution}set resolution(e){this._resolution=e,this.setVector2(`grlResolution`,e),this.setFloat(`grlAspect`,e.x/e.y)}serialize(){let e=super.serialize(),t={colorDistributionType:this._colorsDistributionType,colorsSampling:this._colorsSampling,colorMode:this._colorMode,color:this._color,dashCount:this._dashCount,dashOffset:this._dashOffset,dashRatio:this._dashRatio,resolution:this._resolution,sizeAttenuation:this._sizeAttenuation,useColors:this._useColors,useDash:this._useDash,visibility:this._visibility,width:this._width,cameraFacing:this._cameraFacing};return this._colors&&(t.colors=this._colors),e.greasedLineMaterialOptions=t,e}parse(e,t,n){let r=e.greasedLineMaterialOptions;this._colorsTexture?.dispose(),r.color&&(this.color=r.color),r.colorDistributionType&&(this.colorsDistributionType=r.colorDistributionType),r.colorsSampling&&(this.colorsSampling=r.colorsSampling),r.colorMode&&(this.colorMode=r.colorMode),r.useColors&&(this.useColors=r.useColors),r.visibility&&(this.visibility=r.visibility),r.useDash&&(this.useDash=r.useDash),r.dashCount&&(this.dashCount=r.dashCount),r.dashRatio&&(this.dashRatio=r.dashRatio),r.dashOffset&&(this.dashOffset=r.dashOffset),r.width&&(this.width=r.width),r.sizeAttenuation&&(this.sizeAttenuation=r.sizeAttenuation),r.resolution&&(this.resolution=r.resolution),this.colorsTexture=r.colors?H.CreateColorsTexture(`${this.name}-colors-texture`,r.colors,this.colorsSampling,this.getScene()):H.PrepareEmptyColorsTexture(t),this._cameraFacing=r.cameraFacing??!0,this.setDefine(`GREASED_LINE_CAMERA_FACING`,this._cameraFacing)}},J.ForceGLSL=!1})),X,Z,Q,$,me=e((()=>{K(),S(),b(),te(),h(),Y(),U(),(function(e){e[e.POINTS_MODE_POINTS=0]=`POINTS_MODE_POINTS`,e[e.POINTS_MODE_PATHS=1]=`POINTS_MODE_PATHS`})(X||={}),(function(e){e[e.FACES_MODE_SINGLE_SIDED=0]=`FACES_MODE_SINGLE_SIDED`,e[e.FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING=1]=`FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING`,e[e.FACES_MODE_DOUBLE_SIDED=2]=`FACES_MODE_DOUBLE_SIDED`})(Z||={}),(function(e){e[e.AUTO_DIRECTIONS_FROM_FIRST_SEGMENT=0]=`AUTO_DIRECTIONS_FROM_FIRST_SEGMENT`,e[e.AUTO_DIRECTIONS_FROM_ALL_SEGMENTS=1]=`AUTO_DIRECTIONS_FROM_ALL_SEGMENTS`,e[e.AUTO_DIRECTIONS_ENHANCED=2]=`AUTO_DIRECTIONS_ENHANCED`,e[e.AUTO_DIRECTIONS_FACE_TO=3]=`AUTO_DIRECTIONS_FACE_TO`,e[e.AUTO_DIRECTIONS_NONE=99]=`AUTO_DIRECTIONS_NONE`})(Q||={}),$=class extends ee{constructor(e,t,n){super(e,t,null,null,!1,!1),this.name=e,this._options=n,this._lazy=!1,this._updatable=!1,this._engine=t.getEngine(),this._lazy=n.lazy??!1,this._updatable=n.updatable??!1,this._vertexPositions=[],this._indices=[],this._uvs=[],this._points=[],this._colorPointers=n.colorPointers??[],this._widths=n.widths??Array(n.points.length).fill(1)}getClassName(){return`GreasedLineMesh`}_updateWidthsWithValue(e){let t=0;for(let e of this._points)t+=e.length;let n=t/3*2-this._widths.length;for(let t=0;t<n;t++)this._widths.push(e)}updateLazy(){this._setPoints(this._points),this._options.colorPointers||this._updateColorPointers(),this._createVertexBuffers(this._options.ribbonOptions?.smoothShading),!this.doNotSyncBoundingInfo&&this.refreshBoundingInfo(),this.greasedLineMaterial?.updateLazy()}addPoints(e,t){for(let t of e)this._points.push(t);this._lazy||this.setPoints(this._points,t)}dispose(e,t=!1){super.dispose(e,t)}isLazy(){return this._lazy}get uvs(){return this._uvs}set uvs(e){this._uvs=e instanceof Float32Array?e:new Float32Array(e),this._createVertexBuffers()}get offsets(){return this._offsets}set offsets(e){this.material instanceof J&&this.material.setDefine(q,e?.length>0),this._offsets=e,this._offsetsBuffer?this._offsetsBuffer.update(e):this._createOffsetsBuffer(e)}get widths(){return this._widths}set widths(e){this._widths=e,this._lazy||this._widthsBuffer&&this._widthsBuffer.update(e)}get colorPointers(){return this._colorPointers}set colorPointers(e){this._colorPointers=e,this._lazy||this._colorPointersBuffer&&this._colorPointersBuffer.update(e)}get greasedLineMaterial(){if(this.material&&this.material instanceof J)return this.material;let e=this.material?.pluginManager?.getPlugin(G.GREASED_LINE_MATERIAL_NAME);if(e)return e}get points(){let e=[];return g.DeepCopy(this._points,e),e}setPoints(e,t){this._points=H.ConvertPoints(e,t?.pointsOptions??this._options.pointsOptions),this._updateWidths(),t?.colorPointers||this._updateColorPointers(),this._setPoints(this._points,t)}_initGreasedLine(){this._vertexPositions=[],this._indices=[],this._uvs=[]}_createLineOptions(){return{points:this._points,colorPointers:this._colorPointers,lazy:this._lazy,updatable:this._updatable,uvs:this._uvs,widths:this._widths,ribbonOptions:this._options.ribbonOptions}}serialize(e){super.serialize(e),e.type=this.getClassName(),e.lineOptions=this._createLineOptions()}_createVertexBuffers(e=!1){let t=new C;return t.positions=this._vertexPositions,t.indices=this._indices,t.uvs=this._uvs,e&&(t.normals=[],C.ComputeNormals(this._vertexPositions,this._indices,t.normals)),t.applyToMesh(this,this._options.updatable),t}_createOffsetsBuffer(e){let t=this._scene.getEngine(),n=new x(t,e,this._updatable,3);this.setVerticesBuffer(n.createVertexBuffer(`grl_offsets`,0,3)),this._offsetsBuffer=n}}}));export{A as S,L as _,me as a,z as b,Y as c,K as d,H as f,I as g,V as h,X as i,G as l,B as m,Q as n,J as o,U as p,Z as r,q as s,$ as t,W as u,F as v,k as x,P as y};