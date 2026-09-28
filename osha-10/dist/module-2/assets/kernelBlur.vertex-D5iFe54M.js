import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./kernelBlurVaryingDeclaration-BhU8UX2b.js";var a,o,s=e((()=>{n(),a=`kernelBlurVertex`,o=`vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};`,r.IncludesShadersStoreWGSL[a]||(r.IncludesShadersStoreWGSL[a]=o)})),c=t({kernelBlurVertexShaderWGSL:()=>d}),l,u,d,f=e((()=>{n(),i(),s(),l=`kernelBlurVertexShader`,u=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(vertexInputs.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStoreWGSL[l]||(r.ShadersStoreWGSL[l]=u),d={name:l,shader:u}}));f();export{d as kernelBlurVertexShaderWGSL,c as n,f as t};