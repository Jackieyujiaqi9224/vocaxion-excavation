import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-T-lAzG2R.js";import{m as a,p as o}from"./pbrDebug-BChif9Az.js";import{n as s}from"./harmonicsFunctions-FfQx5eOZ.js";var c=t({iblDominantDirectionPixelShaderWGSL:()=>d}),l,u,d,f=e((()=>{n(),i(),a(),s(),o(),l=`iblDominantDirectionPixelShader`,u=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var lightDir: vec3f=vec3f(0.0,0.0,0.0);for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var T: vec2f;T.x=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(Xi.x,0.0),0.0).x;T.y=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(T.x,Xi.y),0.0).y;var Ls: vec3f=uv_to_normal(vec2f(1.0-fract(T.x+0.25),T.y));lightDir+=Ls;}
lightDir/=vec3f(f32(NUM_SAMPLES));fragmentOutputs.color=vec4f(lightDir,1.0);}`,r.ShadersStoreWGSL[l]||(r.ShadersStoreWGSL[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};