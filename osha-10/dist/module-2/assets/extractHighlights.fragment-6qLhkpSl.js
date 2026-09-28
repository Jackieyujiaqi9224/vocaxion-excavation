import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-yT7jCNsU.js";var a=t({extractHighlightsPixelShader:()=>c}),o,s,c,l=e((()=>{n(),i(),o=`extractHighlightsPixelShader`,s=`#include<helperFunctions>
varying vec2 vUV;uniform sampler2D textureSampler;uniform float threshold;uniform float exposure;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);float luma=dot(LuminanceEncodeApprox,gl_FragColor.rgb*exposure);gl_FragColor.rgb=step(threshold,luma)*gl_FragColor.rgb;}`,r.ShadersStore[o]||(r.ShadersStore[o]=s),c={name:o,shader:s}}));export{a as n,l as r,c as t};