import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{r}from"./helperFunctions-yT7jCNsU.js";var i,a,o,s=e((()=>{t(),r(),i=`rgbdEncodePixelShader`,a=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`,n.ShadersStore[i]||(n.ShadersStore[i]=a),o={name:i,shader:a}}));s();export{o as rgbdEncodePixelShader,s as t};