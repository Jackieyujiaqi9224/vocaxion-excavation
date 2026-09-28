import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a,o=e((()=>{t(),r=`passPixelShader`,i=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`,n.ShadersStoreWGSL[r]||(n.ShadersStoreWGSL[r]=i),a={name:r,shader:i}}));o();export{a as passPixelShaderWGSL,o as t};