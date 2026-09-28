import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{f as i,g as a,h as o,l as s,m as c,p as l}from"./clipPlaneVertexDeclaration-DvJWanBK.js";import{i as u,s as d,t as f,u as p}from"./morphTargetsVertexGlobalDeclaration-Db3_Y0tb.js";var m=t({pickingVertexShaderWGSL:()=>_}),h,g,_,v=e((()=>{n(),i(),a(),f(),d(),c(),u(),p(),l(),s(),o(),h=`pickingVertexShader`,g=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=vertexInputs.instanceMeshID;
#endif
}
`,r.ShadersStoreWGSL[h]||(r.ShadersStoreWGSL[h]=g),_={name:h,shader:g}}));export{_ as n,m as r,v as t};