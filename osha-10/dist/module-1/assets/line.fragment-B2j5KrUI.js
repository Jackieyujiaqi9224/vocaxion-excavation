import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{o as i,r as a}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{n as o}from"./fogFragment-B1yLUz9z.js";import{t as s}from"./logDepthDeclaration-CS3cPirk.js";var c=t({linePixelShader:()=>d}),l,u,d,f=e((()=>{n(),a(),s(),o(),i(),l=`linePixelShader`,u=`#include<clipPlaneFragmentDeclaration>
uniform vec4 color;
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<logDepthFragment>
#include<clipPlaneFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{d as n,c as r,f as t};