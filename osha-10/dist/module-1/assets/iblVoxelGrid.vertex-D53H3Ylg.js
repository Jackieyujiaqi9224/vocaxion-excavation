import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{f as i,g as a,l as o,n as s,p as c,t as l}from"./instancesVertex-DnDsYTdk.js";import{i as u,s as d,t as f,u as p}from"./morphTargetsVertex-ZYi1Wknh.js";var m=t({iblVoxelGridVertexShader:()=>_}),h,g,_,v=e((()=>{n(),a(),c(),s(),p(),d(),u(),f(),l(),i(),o(),h=`iblVoxelGridVertexShader`,g=`attribute vec3 position;varying vec3 vNormalizedPosition;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
uniform mat4 invWorldScale;uniform mat4 viewMatrix;void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewMatrix*invWorldScale*worldPos;vNormalizedPosition.xyz=gl_Position.xyz*0.5+0.5;
#ifdef IS_NDC_HALF_ZRANGE
gl_Position.z=gl_Position.z*0.5+0.5;
#endif
}`,r.ShadersStore[h]||(r.ShadersStore[h]=g),_={name:h,shader:g}}));export{m as n,v as r,_ as t};