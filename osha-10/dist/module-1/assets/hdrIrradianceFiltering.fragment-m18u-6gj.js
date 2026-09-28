import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-T-lAzG2R.js";import{m as a,p as o}from"./pbrDebug-BChif9Az.js";import{n as s}from"./harmonicsFunctions-FfQx5eOZ.js";var c=t({hdrIrradianceFilteringPixelShaderWGSL:()=>d}),l,u,d,f=e((()=>{n(),i(),a(),s(),o(),l=`hdrIrradianceFilteringPixelShader`,u=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var inputTextureSampler: sampler;var inputTexture: texture_cube<f32>;
#ifdef IBL_CDF_FILTERING
var icdfTextureSampler: sampler;var icdfTexture: texture_2d<f32>;
#endif
uniform vFilteringInfo: vec2f;uniform hdrScale: f32;varying direction: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var color: vec3f=irradiance(inputTexture,inputTextureSampler,input.direction,uniforms.vFilteringInfo,0.0,vec3f(1.0),input.direction
#ifdef IBL_CDF_FILTERING
,icdfTexture,icdfTextureSampler
#endif
);fragmentOutputs.color= vec4f(color*uniforms.hdrScale,1.0);}`,r.ShadersStoreWGSL[l]||(r.ShadersStoreWGSL[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};