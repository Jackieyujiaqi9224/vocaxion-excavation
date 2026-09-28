import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./boundingBoxRendererUboDeclaration-DMpAFJdw.js";var a,o,s=e((()=>{n(),a=`boundingBoxRendererFragmentDeclaration`,o=`uniform vec4 color;
`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o)})),c=t({boundingBoxRendererPixelShader:()=>d}),l,u,d,f=e((()=>{n(),s(),i(),l=`boundingBoxRendererPixelShader`,u=`#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};