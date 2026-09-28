import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i}from"./helperFunctions-yT7jCNsU.js";var a=t({copyTextureToTexturePixelShader:()=>c}),o,s,c,l=e((()=>{n(),i(),o=`copyTextureToTexturePixelShader`,s=`uniform float conversion;uniform sampler2D textureSampler;uniform float lodLevel;varying vec2 vUV;
#include<helperFunctions>
void main(void) 
{
#ifdef NO_SAMPLER
vec4 color=texelFetch(textureSampler,ivec2(gl_FragCoord.xy),0);
#else
vec4 color=textureLod(textureSampler,vUV,lodLevel);
#endif
#ifdef DEPTH_TEXTURE
gl_FragDepth=color.r;
#else
if (conversion==1.) {color=toLinearSpace(color);} else if (conversion==2.) {color=toGammaSpace(color);}
gl_FragColor=color;
#endif
}
`,r.ShadersStore[o]||(r.ShadersStore[o]=s),c={name:o,shader:s}}));export{a as n,l as r,c as t};