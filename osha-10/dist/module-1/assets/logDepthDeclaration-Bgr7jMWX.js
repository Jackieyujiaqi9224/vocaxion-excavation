import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a=e((()=>{t(),r=`sceneUboDeclaration`,i=`struct Scene {viewProjection : mat4x4<f32>,
#ifdef MULTIVIEW
viewProjectionR : mat4x4<f32>,
#endif 
view : mat4x4<f32>,
projection : mat4x4<f32>,
vEyePosition : vec4<f32>,};
#define SCENE_UBO
var<uniform> scene : Scene;
`,n.IncludesShadersStoreWGSL[r]||(n.IncludesShadersStoreWGSL[r]=i)})),o,s,c=e((()=>{t(),o=`logDepthDeclaration`,s=`#ifdef LOGARITHMICDEPTH
uniform logarithmicDepthConstant: f32;varying vFragmentDepth: f32;
#endif
`,n.IncludesShadersStoreWGSL[o]||(n.IncludesShadersStoreWGSL[o]=s)}));export{a as n,c as t};