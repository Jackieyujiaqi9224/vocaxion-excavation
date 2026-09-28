import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,f as o,g as s,l as c,p as l,t as u}from"./instancesVertex-DnDsYTdk.js";import{i as d,s as f,t as p,u as m}from"./morphTargetsVertex-ZYi1Wknh.js";import{r as h}from"./helperFunctions-yT7jCNsU.js";import{t as g}from"./shadowMapVertexMetric-B1-sgeFH.js";import{n as _}from"./logDepthDeclaration-CS3cPirk.js";import{n as v}from"./mainUVVaryingDeclaration-Db3THNzU.js";import{t as y}from"./sceneVertexDeclaration-Bv7rdzvt.js";import{t as b}from"./meshVertexDeclaration-B88w7I_u.js";var x,S,C=e((()=>{n(),y(),b(),x=`shadowMapVertexDeclaration`,S=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`,r.IncludesShadersStore[x]||(r.IncludesShadersStore[x]=S)})),w,T,E=e((()=>{n(),_(),v(),w=`shadowMapUboDeclaration`,T=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`,r.IncludesShadersStore[w]||(r.IncludesShadersStore[w]=T)})),D,O,k=e((()=>{n(),D=`shadowMapVertexExtraDeclaration`,O=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`,r.IncludesShadersStore[D]||(r.IncludesShadersStore[D]=O)})),A,j,M=e((()=>{n(),A=`shadowMapVertexNormalBias`,j=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`,r.IncludesShadersStore[A]||(r.IncludesShadersStore[A]=j)})),N=t({shadowMapVertexShader:()=>I}),P,F,I,L=e((()=>{n(),s(),l(),m(),f(),h(),C(),E(),k(),i(),d(),p(),u(),o(),c(),M(),g(),a(),P=`shadowMapVertexShader`,F=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`,r.ShadersStore[P]||(r.ShadersStore[P]=F),I={name:P,shader:F}}));export{I as n,N as r,L as t};