import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./logDepthDeclaration-Bgr7jMWX.js";import{o as a,r as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{S as s,n as c,t as l}from"./fogFragment-HWYbboUn.js";var u,d,f=e((()=>{n(),c(),l(),u=`gaussianSplattingFragmentDeclaration`,d=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`,r.IncludesShadersStoreWGSL[u]||(r.IncludesShadersStoreWGSL[u]=d)})),p=t({gaussianSplattingPixelShaderWGSL:()=>g}),m,h,g,_=e((()=>{n(),o(),i(),s(),f(),a(),m=`gaussianSplattingPixelShader`,h=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
varying vColor: vec4f;varying vPosition: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var finalColor: vec4f=gaussianColor(input.vColor,input.vPosition);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
fragmentOutputs.color=finalColor;
#define CUSTOM_FRAGMENT_MAIN_END
}
`,r.ShadersStoreWGSL[m]||(r.ShadersStoreWGSL[m]=h),g={name:m,shader:h}}));export{_ as n,f as r,p as t};