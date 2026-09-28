import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{o as r,r as i}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{r as a}from"./helperFunctions-yT7jCNsU.js";var o,s,c,l=e((()=>{t(),a(),i(),r(),o=`glowMapGenerationPixelShader`,s=`#if defined(DIFFUSE_ISLINEAR) || defined(EMISSIVE_ISLINEAR)
#include<helperFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vUVDiffuse;uniform sampler2D diffuseSampler;
#endif
#ifdef OPACITY
varying vec2 vUVOpacity;uniform sampler2D opacitySampler;uniform float opacityIntensity;
#endif
#ifdef EMISSIVE
varying vec2 vUVEmissive;uniform sampler2D emissiveSampler;
#endif
#ifdef VERTEXALPHA
varying vec4 vColor;
#endif
uniform vec4 glowColor;uniform float glowIntensity;
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
vec4 finalColor=glowColor;
#ifdef DIFFUSE
vec4 albedoTexture=texture2D(diffuseSampler,vUVDiffuse);
#ifdef DIFFUSE_ISLINEAR
albedoTexture=toGammaSpace(albedoTexture);
#endif
#ifdef GLOW
finalColor.a*=albedoTexture.a;
#endif
#ifdef HIGHLIGHT
finalColor.a=albedoTexture.a;
#endif
#endif
#ifdef OPACITY
vec4 opacityMap=texture2D(opacitySampler,vUVOpacity);
#ifdef OPACITYRGB
finalColor.a*=getLuminance(opacityMap.rgb);
#else
finalColor.a*=opacityMap.a;
#endif
finalColor.a*=opacityIntensity;
#endif
#ifdef VERTEXALPHA
finalColor.a*=vColor.a;
#endif
#ifdef ALPHATEST
if (finalColor.a<ALPHATESTVALUE)
discard;
#endif
#ifdef EMISSIVE
vec4 emissive=texture2D(emissiveSampler,vUVEmissive);
#ifdef EMISSIVE_ISLINEAR
emissive=toGammaSpace(emissive);
#endif
gl_FragColor=emissive*finalColor*glowIntensity;
#else
gl_FragColor=finalColor*glowIntensity;
#endif
#ifdef HIGHLIGHT
gl_FragColor.a=glowColor.a;
#endif
}`,n.ShadersStore[o]||(n.ShadersStore[o]=s),c={name:o,shader:s}}));l();export{c as glowMapGenerationPixelShader,l as t};