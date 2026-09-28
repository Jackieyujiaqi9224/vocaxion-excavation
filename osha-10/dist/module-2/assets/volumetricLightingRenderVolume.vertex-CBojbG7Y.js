import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as r}from"./mainUVVaryingDeclaration-Bgx_6krh.js";import{n as i}from"./logDepthDeclaration-Bgr7jMWX.js";var a,o,s;e((()=>{t(),i(),r(),a=`volumetricLightingRenderVolumeVertexShader`,o=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
attribute position : vec3f;varying vWorldPos: vec4f;@vertex
fn main(input : VertexInputs)->FragmentInputs {let worldPos=mesh.world*vec4f(vertexInputs.position,1.0);vertexOutputs.vWorldPos=worldPos;vertexOutputs.position=scene.viewProjection*worldPos;}
`,n.ShadersStoreWGSL[a]||(n.ShadersStoreWGSL[a]=o),s={name:a,shader:o}}))();export{s as volumetricLightingRenderVolumeVertexShaderWGSL};