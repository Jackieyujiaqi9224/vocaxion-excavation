import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a=e((()=>{t(),r=`sceneUboDeclaration`,i=`layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;};
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i)})),o,s,c=e((()=>{t(),o=`logDepthDeclaration`,s=`#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`,n.IncludesShadersStore[o]||(n.IncludesShadersStore[o]=s)}));export{a as n,c as t};