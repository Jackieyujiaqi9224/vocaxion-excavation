import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{o as i,r as a}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{n as o,t as s,w as c}from"./fogFragment-B1yLUz9z.js";import{t as l}from"./logDepthDeclaration-CS3cPirk.js";var u,d,f=e((()=>{n(),o(),s(),u=`gaussianSplattingFragmentDeclaration`,d=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`,r.IncludesShadersStore[u]||(r.IncludesShadersStore[u]=d)})),p=t({gaussianSplattingPixelShader:()=>g}),m,h,g,_=e((()=>{n(),a(),l(),c(),f(),i(),m=`gaussianSplattingPixelShader`,h=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vec4 vColor;varying vec2 vPosition;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
void main () {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec4 finalColor=gaussianColor(vColor);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
gl_FragColor=finalColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`,r.ShadersStore[m]||(r.ShadersStore[m]=h),g={name:m,shader:h}}));export{_ as n,p as t};