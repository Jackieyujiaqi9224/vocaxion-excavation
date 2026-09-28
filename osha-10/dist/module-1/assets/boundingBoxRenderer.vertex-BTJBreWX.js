import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./boundingBoxRendererUboDeclaration-DMpAFJdw.js";var a,o,s=e((()=>{n(),a=`boundingBoxRendererVertexDeclaration`,o=`uniform mat4 world;uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o)})),c=t({boundingBoxRendererVertexShader:()=>d}),l,u,d,f=e((()=>{n(),s(),i(),l=`boundingBoxRendererVertexShader`,u=`attribute vec3 position;
#include<__decl__boundingBoxRendererVertex>
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef INSTANCES
mat4 finalWorld=mat4(world0,world1,world2,world3);vec4 worldPos=finalWorld*vec4(position,1.0);
#else
vec4 worldPos=world*vec4(position,1.0);
#endif
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};