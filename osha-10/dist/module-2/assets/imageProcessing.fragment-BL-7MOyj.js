import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{v as i,x as a}from"./fogFragment-B1yLUz9z.js";import{r as o}from"./helperFunctions-yT7jCNsU.js";var s=t({imageProcessingPixelShader:()=>u}),c,l,u,d=e((()=>{n(),a(),o(),i(),c=`imageProcessingPixelShader`,l=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 result=texture2D(textureSampler,vUV);result.rgb=max(result.rgb,vec3(0.));
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;}`,r.ShadersStore[c]||(r.ShadersStore[c]=l),u={name:c,shader:l}}));export{s as n,d as r,u as t};