import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a=e((()=>{t(),r=`meshUboDeclaration`,i=`struct Mesh {world : mat4x4<f32>,
visibility : f32,};var<uniform> mesh : Mesh;
#define WORLD_UBO
`,n.IncludesShadersStoreWGSL[r]||(n.IncludesShadersStoreWGSL[r]=i)})),o,s,c=e((()=>{t(),o=`mainUVVaryingDeclaration`,s=`#ifdef MAINUV{X}
varying vMainUV{X}: vec2f;
#endif
`,n.IncludesShadersStoreWGSL[o]||(n.IncludesShadersStoreWGSL[o]=s)}));export{a as n,c as t};