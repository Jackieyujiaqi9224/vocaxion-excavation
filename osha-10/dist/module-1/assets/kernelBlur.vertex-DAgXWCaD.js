import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./kernelBlurVaryingDeclaration-Cy_I_5QT.js";var a,o,s=e((()=>{n(),a=`kernelBlurVertex`,o=`sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o)})),c=t({kernelBlurVertexShader:()=>d}),l,u,d,f=e((()=>{n(),i(),s(),l=`kernelBlurVertexShader`,u=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));f();export{d as kernelBlurVertexShader,c as n,f as t};