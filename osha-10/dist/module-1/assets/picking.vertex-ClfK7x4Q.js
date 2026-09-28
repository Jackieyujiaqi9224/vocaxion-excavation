import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{f as i,g as a,l as o,n as s,p as c,t as l}from"./instancesVertex-DnDsYTdk.js";import{i as u,s as d,t as f,u as p}from"./morphTargetsVertex-ZYi1Wknh.js";var m=t({pickingVertexShader:()=>_}),h,g,_,v=e((()=>{n(),a(),c(),p(),d(),s(),u(),f(),l(),i(),o(),h=`pickingVertexShader`,g=`attribute vec3 position;
#if defined(INSTANCES)
attribute float instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
flat varying float vMeshID;
#endif
void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}
`,r.ShadersStore[h]||(r.ShadersStore[h]=g),_={name:h,shader:g}}));export{_ as n,m as r,v as t};