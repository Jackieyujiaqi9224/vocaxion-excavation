import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-T-lAzG2R.js";import{g as a,y as o}from"./fogFragment-HWYbboUn.js";var s=t({imageProcessingPixelShaderWGSL:()=>u}),c,l,u,d=e((()=>{n(),o(),i(),a(),c=`imageProcessingPixelShader`,l=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`,r.ShadersStoreWGSL[c]||(r.ShadersStoreWGSL[c]=l),u={name:c,shader:l}}));export{s as n,d as r,u as t};