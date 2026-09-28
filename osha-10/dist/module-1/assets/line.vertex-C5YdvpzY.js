import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,n as o,t as s}from"./instancesVertex-DnDsYTdk.js";import{t as c}from"./logDepthVertex-CIAWrUfy.js";import{n as l,t as u}from"./logDepthDeclaration-CS3cPirk.js";import{n as d}from"./mainUVVaryingDeclaration-Db3THNzU.js";var f,p,m=e((()=>{n(),f=`lineVertexDeclaration`,p=`uniform mat4 viewProjection;
#define ADDITIONAL_VERTEX_DECLARATION
`,r.IncludesShadersStore[f]||(r.IncludesShadersStore[f]=p)})),h,g,_=e((()=>{n(),l(),d(),h=`lineUboDeclaration`,g=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`,r.IncludesShadersStore[h]||(r.IncludesShadersStore[h]=g)})),v=t({lineVertexShader:()=>x}),y,b,x,S=e((()=>{n(),m(),_(),o(),i(),u(),s(),a(),c(),y=`lineVertexShader`,b=`#include<__decl__lineVertex>
#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;attribute vec4 normal;uniform float width;uniform float aspectRatio;
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;vec4 viewPosition=worldViewProjection*vec4(position,1.0);vec4 viewPositionNext=worldViewProjection*vec4(normal.xyz,1.0);vec2 currentScreen=viewPosition.xy/viewPosition.w;vec2 nextScreen=viewPositionNext.xy/viewPositionNext.w;currentScreen.x*=aspectRatio;nextScreen.x*=aspectRatio;vec2 dir=normalize(nextScreen-currentScreen);vec2 normalDir=vec2(-dir.y,dir.x);normalDir*=width/2.0;normalDir.x/=aspectRatio;vec4 offset=vec4(normalDir*normal.w,0.0,0.0);gl_Position=viewPosition+offset;
#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
vec4 worldPos=finalWorld*vec4(position,1.0);
#include<clipPlaneVertex>
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStore[y]||(r.ShadersStore[y]=b),x={name:y,shader:b}}));export{x as n,v as r,S as t};