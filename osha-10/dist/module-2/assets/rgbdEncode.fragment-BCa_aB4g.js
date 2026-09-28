import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{r}from"./helperFunctions-T-lAzG2R.js";var i,a,o,s=e((()=>{t(),r(),i=`rgbdEncodePixelShader`,a=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`,n.ShadersStoreWGSL[i]||(n.ShadersStoreWGSL[i]=a),o={name:i,shader:a}}));s();export{o as rgbdEncodePixelShaderWGSL,s as t};