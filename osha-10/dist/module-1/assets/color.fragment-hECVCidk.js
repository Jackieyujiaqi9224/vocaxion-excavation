import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{o as i,r as a}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{t as o,w as s}from"./fogFragment-B1yLUz9z.js";var c=t({colorPixelShader:()=>d}),l,u,d,f=e((()=>{n(),a(),s(),i(),o(),l=`colorPixelShader`,u=`#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
#include<fogFragment>(color,gl_FragColor)
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};