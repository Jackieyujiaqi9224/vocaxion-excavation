import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{f as i,g as a,h as o,l as s,m as c,o as l,p as u,r as d}from"./clipPlaneVertexDeclaration-DvJWanBK.js";import{n as f,r as p}from"./logDepthVertex-DdzQtmmk.js";import{s as m}from"./samplerVertexImplementation-B60aDht5.js";var h=t({colorVertexShaderWGSL:()=>v}),g,_,v,y=e((()=>{n(),i(),a(),d(),p(),c(),u(),s(),o(),l(),f(),m(),g=`colorVertexShader`,_=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStoreWGSL[g]||(r.ShadersStoreWGSL[g]=_),v={name:g,shader:_}}));export{h as n,y as r,v as t};