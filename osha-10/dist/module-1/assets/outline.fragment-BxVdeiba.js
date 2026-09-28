import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{t as i}from"./logDepthDeclaration-Bgr7jMWX.js";import{o as a,r as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{n as s}from"./fogFragment-HWYbboUn.js";var c=t({outlinePixelShaderWGSL:()=>d}),l,u,d,f=e((()=>{n(),o(),i(),a(),s(),l=`outlinePixelShader`,u=`uniform color: vec4f;
#ifdef ALPHATEST
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV).a<0.4) {discard;}
#endif
#include<logDepthFragment>
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStoreWGSL[l]||(r.ShadersStoreWGSL[l]=u),d={name:l,shader:u}}));export{d as n,c as r,f as t};