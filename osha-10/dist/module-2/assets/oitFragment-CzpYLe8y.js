import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a=e((()=>{t(),r=`samplerFragmentDeclaration`,i=`#ifdef _DEFINENAME_
#if _DEFINENAME_DIRECTUV==1
#define v_VARYINGNAME_UV vMainUV1
#elif _DEFINENAME_DIRECTUV==2
#define v_VARYINGNAME_UV vMainUV2
#elif _DEFINENAME_DIRECTUV==3
#define v_VARYINGNAME_UV vMainUV3
#elif _DEFINENAME_DIRECTUV==4
#define v_VARYINGNAME_UV vMainUV4
#elif _DEFINENAME_DIRECTUV==5
#define v_VARYINGNAME_UV vMainUV5
#elif _DEFINENAME_DIRECTUV==6
#define v_VARYINGNAME_UV vMainUV6
#else
varying vec2 v_VARYINGNAME_UV;
#endif
uniform sampler2D _SAMPLERNAME_Sampler;
#endif
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i)})),o,s,c=e((()=>{t(),o=`decalFragmentDeclaration`,s=`#ifdef DECAL
uniform vec4 vDecalInfos;
#endif
`,n.IncludesShadersStore[o]||(n.IncludesShadersStore[o]=s)})),l,u,d=e((()=>{t(),l=`prePassDeclaration`,u=`#ifdef PREPASS
#extension GL_EXT_draw_buffers : require
layout(location=0) out highp vec4 glFragData[{X}];highp vec4 gl_FragColor;
#ifdef PREPASS_LOCAL_POSITION
varying highp vec3 vPosition;
#endif
#ifdef PREPASS_DEPTH
varying highp vec3 vViewPos;
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
varying highp float vNormViewDepth;
#endif
#if defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)
varying highp vec4 vCurrentPosition;varying highp vec4 vPreviousPosition;
#endif
#endif
`,n.IncludesShadersStore[l]||(n.IncludesShadersStore[l]=u)})),f,p,m=e((()=>{t(),f=`oitDeclaration`,p=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#extension GL_EXT_draw_buffers : require
layout(location=0) out vec2 depth; 
layout(location=1) out vec4 frontColor;layout(location=2) out vec4 backColor;
#define MAX_DEPTH 99999.0
highp vec4 gl_FragColor;uniform sampler2D oitDepthSampler;uniform sampler2D oitFrontColorSampler;
#endif
`,n.IncludesShadersStore[f]||(n.IncludesShadersStore[f]=p)})),h,g,_=e((()=>{t(),h=`depthPrePass`,g=`#ifdef DEPTHPREPASS
gl_FragColor=vec4(0.,0.,0.,1.0);return;
#endif
`,n.IncludesShadersStore[h]||(n.IncludesShadersStore[h]=g)})),v,y,b=e((()=>{t(),v=`oitFragment`,y=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
float fragDepth=gl_FragCoord.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
uint halfFloat=packHalf2x16(vec2(fragDepth));vec2 full=unpackHalf2x16(halfFloat);fragDepth=full.x;
#endif
ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec2 lastDepth=texelFetch(oitDepthSampler,fragCoord,0).rg;vec4 lastFrontColor=texelFetch(oitFrontColorSampler,fragCoord,0);depth.rg=vec2(-MAX_DEPTH);frontColor=lastFrontColor;backColor=vec4(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
float furthestDepth=-lastDepth.x;float nearestDepth=lastDepth.y;
#else
float nearestDepth=-lastDepth.x;float furthestDepth=lastDepth.y;
#endif
float alphaMultiplier=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
depth.rg=vec2(-fragDepth,fragDepth);return;}
#endif
`,n.IncludesShadersStore[v]||(n.IncludesShadersStore[v]=y)}));export{c as a,d as i,_ as n,a as o,m as r,b as t};