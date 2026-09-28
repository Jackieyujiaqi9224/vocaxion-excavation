import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-yT7jCNsU.js";import{f as a,p as o}from"./pbrDebug-BntnRi7V.js";import{n as s}from"./harmonicsFunctions-Cj9TGPLP.js";var c=t({hdrIrradianceFilteringPixelShader:()=>d}),l,u,d,f=e((()=>{n(),i(),o(),s(),a(),l=`hdrIrradianceFilteringPixelShader`,u=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform samplerCube inputTexture;
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfTexture;
#endif
uniform vec2 vFilteringInfo;uniform float hdrScale;varying vec3 direction;void main() {vec3 color=irradiance(inputTexture,direction,vFilteringInfo,0.0,vec3(1.0),direction
#ifdef IBL_CDF_FILTERING
,icdfTexture
#endif
);gl_FragColor=vec4(color*hdrScale,1.0);}`,r.ShadersStore[l]||(r.ShadersStore[l]=u),d={name:l,shader:u}}));export{c as n,f as r,d as t};