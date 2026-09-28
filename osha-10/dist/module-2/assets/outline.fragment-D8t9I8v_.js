import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{o as i,r as a}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{n as o}from"./fogFragment-B1yLUz9z.js";import{t as s}from"./logDepthDeclaration-CS3cPirk.js";var c=t({outlinePixelShader:()=>d}),l,u,d,f=e((()=>{n(),a(),s(),i(),o(),l=`outlinePixelShader`,u=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{d as n,c as r,f as t};