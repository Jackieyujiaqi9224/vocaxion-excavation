import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a=e((()=>{t(),r=`meshUboDeclaration`,i=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i)})),o,s,c=e((()=>{t(),o=`mainUVVaryingDeclaration`,s=`#ifdef MAINUV{X}
varying vec2 vMainUV{X};
#endif
`,n.IncludesShadersStore[o]||(n.IncludesShadersStore[o]=s)}));export{a as n,c as t};