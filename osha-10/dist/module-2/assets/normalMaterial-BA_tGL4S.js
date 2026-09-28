import{n as e,t}from"./shaderStore-DBiNfWDC.js";import{i as n,r}from"./typeStore-Cabm4lgz.js";import{i,t as a}from"./math.color-Crhbjyg0.js";import{n as o,t as s}from"./decorators.serialization-An9rPbAU.js";import{a as c,b as l,h as u,n as d,r as ee,s as f,x as te}from"./decorators-POqq-wt0.js";import{r as ne,t as re}from"./scene-Dlzcptvt.js";import{n as p,r as ie}from"./buffer-D2Cjl7hH.js";import{C as ae,E as oe,H as m,I as h,O as g,R as _,U as v,V as y,W as b,f as x,h as S,m as C,n as w,q as T,s as E,t as D,y as O,z as k}from"./materialHelper.functions-Ce7cuqjG.js";import{i as A,n as j,r as M,t as N}from"./pushMaterial-n8PW6fOc.js";import{n as P,t as F}from"./materialDefines-CB4vGlYM.js";import{a as I,c as L,f as se,g as R,l as z,n as B,p as V,t as H}from"./instancesVertex-DnDsYTdk.js";import{n as U}from"./oitFragment-CzpYLe8y.js";import{o as W,r as G}from"./clipPlaneFragmentDeclaration-DFSYjMag.js";import{n as K,p as q,r as ce,t as le,u as J,w as ue}from"./fogFragment-B1yLUz9z.js";import{r as de}from"./helperFunctions-yT7jCNsU.js";import{n as fe}from"./clusteredLightingFunctions-jtBxWyRY.js";import{i as pe,n as me,r as he,t as ge}from"./logDepthVertex-CIAWrUfy.js";import{t as _e}from"./lightsFragmentFunctions-B7XFkbuu.js";import{t as Y}from"./logDepthDeclaration-CS3cPirk.js";import{t as ve}from"./imageProcessingCompatibility-DR1kRG9K.js";n(),i(),te(),ee(),o(),ie(),ne(),m(),P(),j(),e(),de(),q(),J(),_e(),ce(),G(),Y(),ue(),W(),U(),fe(),K(),le(),ve();var X=`normalPixelShader`,Z=`precision highp float;uniform vec4 vEyePosition;uniform vec4 vDiffuseColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef LIGHTING
#include<helperFunctions>
#include<__decl__lightFragment>[0]
#include<__decl__lightFragment>[1]
#include<__decl__lightFragment>[2]
#include<__decl__lightFragment>[3]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#endif
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform sampler2D diffuseSampler;uniform vec2 vDiffuseInfos;
#endif
#include<clipPlaneFragmentDeclaration>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);vec4 baseColor=vec4(1.,1.,1.,1.);vec3 diffuseColor=vDiffuseColor.rgb;float alpha=vDiffuseColor.a;
#ifdef DIFFUSE
baseColor=texture2D(diffuseSampler,vDiffuseUV);
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
#include<depthPrePass>
baseColor.rgb*=vDiffuseInfos.y;
#endif
#ifdef NORMAL
baseColor=mix(baseColor,vec4(vNormalW,1.0),0.5);
#endif
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
#ifdef LIGHTING
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0]
#include<lightFragment>[1]
#include<lightFragment>[2]
#include<lightFragment>[3]
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor,0.0,1.0)*baseColor.rgb;
#else
vec3 finalDiffuse= baseColor.rgb;
#endif
vec4 color=vec4(finalDiffuse,alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;t.ShadersStore[X]||(t.ShadersStore[X]=Z),e(),R(),V(),B(),I(),Y(),he(),q(),J(),H(),se(),z(),L(),ge(),me(),pe();var Q=`normalVertexShader`,ye=`precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform mat4 view;uniform mat4 viewProjection;
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`;t.ShadersStore[Q]||(t.ShadersStore[Q]=ye),A(),T(),_();var be=class extends F{constructor(){super(),this.DIFFUSE=!1,this.CLIPPLANE=!1,this.CLIPPLANE2=!1,this.CLIPPLANE3=!1,this.CLIPPLANE4=!1,this.CLIPPLANE5=!1,this.CLIPPLANE6=!1,this.ALPHATEST=!1,this.DEPTHPREPASS=!1,this.POINTSIZE=!1,this.FOG=!1,this.LIGHT0=!1,this.LIGHT1=!1,this.LIGHT2=!1,this.LIGHT3=!1,this.SPOTLIGHT0=!1,this.SPOTLIGHT1=!1,this.SPOTLIGHT2=!1,this.SPOTLIGHT3=!1,this.HEMILIGHT0=!1,this.HEMILIGHT1=!1,this.HEMILIGHT2=!1,this.HEMILIGHT3=!1,this.DIRLIGHT0=!1,this.DIRLIGHT1=!1,this.DIRLIGHT2=!1,this.DIRLIGHT3=!1,this.POINTLIGHT0=!1,this.POINTLIGHT1=!1,this.POINTLIGHT2=!1,this.POINTLIGHT3=!1,this.SHADOW0=!1,this.SHADOW1=!1,this.SHADOW2=!1,this.SHADOW3=!1,this.SHADOWS=!1,this.SHADOWESM0=!1,this.SHADOWESM1=!1,this.SHADOWESM2=!1,this.SHADOWESM3=!1,this.SHADOWPOISSON0=!1,this.SHADOWPOISSON1=!1,this.SHADOWPOISSON2=!1,this.SHADOWPOISSON3=!1,this.SHADOWPCF0=!1,this.SHADOWPCF1=!1,this.SHADOWPCF2=!1,this.SHADOWPCF3=!1,this.SHADOWPCSS0=!1,this.SHADOWPCSS1=!1,this.SHADOWPCSS2=!1,this.SHADOWPCSS3=!1,this.NORMAL=!1,this.UV1=!1,this.UV2=!1,this.NUM_BONE_INFLUENCERS=0,this.BonesPerMesh=0,this.INSTANCES=!1,this.THIN_INSTANCES=!1,this.LIGHTING=!1,this.IMAGEPROCESSINGPOSTPROCESS=!1,this.SKIPFINALCOLORCLAMP=!1,this.LOGARITHMICDEPTH=!1,this.AREALIGHTSUPPORTED=!0,this.AREALIGHTNOROUGHTNESS=!0,this.rebuild()}},$=class e extends N{constructor(e,t){super(e,t),this.diffuseColor=new a(1,1,1),this._disableLighting=!1,this._maxSimultaneousLights=4}needAlphaBlending(){return this.alpha<1}needAlphaBlendingForMesh(e){return this.needAlphaBlending()||e.visibility<1}needAlphaTesting(){return!1}getAlphaTestTexture(){return null}isReadyForSubMesh(e,t,n){let r=t._drawWrapper;if(this.isFrozen&&r.effect&&r._wasPreviouslyReady&&r._wasPreviouslyUsingInstances===n)return!0;t.materialDefines||=new be;let i=t.materialDefines,a=this.getScene();if(this._isReadyForSubMesh(t))return!0;let o=a.getEngine();if(i._areTexturesDirty&&(i._needUVs=!1,a.texturesEnabled&&this._diffuseTexture&&y.DiffuseTextureEnabled)){if(this._diffuseTexture.isReady())i._needUVs=!0,i.DIFFUSE=!0;else return!1}if(g(e,a,this._useLogarithmicDepth,this.pointsCloud,this.fogEnabled,this.needAlphaTestingForMesh(e),i,void 0,void 0,void 0,this._isVertexOutputInvariant),i._needNormals=!0,oe(a,e,i,!1,this._maxSimultaneousLights,this._disableLighting),ae(a,o,this,i,!!n,null,t.getRenderingMesh().hasThinInstances),i.LIGHTING=!this._disableLighting,O(e,i,!0,!0),i.isDirty){i.markAsProcessed(),a.resetCachedMaterial();let n=new M;i.FOG&&n.addFallback(1,`FOG`),x(i,n),i.NUM_BONE_INFLUENCERS>0&&n.addCPUSkinningFallback(0,e),i.IMAGEPROCESSINGPOSTPROCESS=a.imageProcessingConfiguration.applyByPostProcess;let r=[p.PositionKind];i.NORMAL&&r.push(p.NormalKind),i.UV1&&r.push(p.UVKind),i.UV2&&r.push(p.UV2Kind),C(r,e,i,n),S(r,i);let s=i.toString(),c=[`world`,`view`,`viewProjection`,`vEyePosition`,`vLightsType`,`vDiffuseColor`,`vFogInfos`,`vFogColor`,`pointSize`,`vDiffuseInfos`,`mBones`,`diffuseMatrix`,`logarithmicDepthConstant`],l=[`diffuseSampler`,`areaLightsLTC1Sampler`,`areaLightsLTC2Sampler`],u=[];v(c),h({uniformsNames:c,uniformBuffersNames:u,samplers:l,defines:i,maxSimultaneousLights:4}),t.setEffect(a.getEngine().createEffect(`normal`,{attributes:r,uniformsNames:c,uniformBuffersNames:u,samplers:l,defines:s,fallbacks:n,onCompiled:this.onCompiled,onError:this.onError,indexParameters:{maxSimultaneousLights:4}},o),i,this._materialContext)}if(i.AREALIGHTUSED){for(let t=0;t<e.lightSources.length;t++)if(!e.lightSources[t]._isReady())return!1}return!t.effect||!t.effect.isReady()?!1:(i._renderId=a.getRenderId(),r._wasPreviouslyReady=!0,r._wasPreviouslyUsingInstances=!!n,!0)}bindForSubMesh(e,t,n){let r=this.getScene(),i=n.materialDefines;if(!i)return;let a=n.effect;a&&(this._activeEffect=a,this.bindOnlyWorldMatrix(e),this._activeEffect.setMatrix(`viewProjection`,r.getTransformMatrix()),D(t,this._activeEffect),this._mustRebind(r,a,n)&&(this.diffuseTexture&&y.DiffuseTextureEnabled&&(this._activeEffect.setTexture(`diffuseSampler`,this.diffuseTexture),this._activeEffect.setFloat2(`vDiffuseInfos`,this.diffuseTexture.coordinatesIndex,this.diffuseTexture.level),this._activeEffect.setMatrix(`diffuseMatrix`,this.diffuseTexture.getTextureMatrix())),b(a,this,r),this.pointsCloud&&this._activeEffect.setFloat(`pointSize`,this.pointSize),this._useLogarithmicDepth&&k(i,a,r),r.bindEyePosition(a)),this._activeEffect.setColor4(`vDiffuseColor`,this.diffuseColor,this.alpha*t.visibility),r.lightsEnabled&&!this.disableLighting&&E(r,t,this._activeEffect,i),r.fogEnabled&&t.applyFog&&r.fogMode!==re.FOGMODE_NONE&&this._activeEffect.setMatrix(`view`,r.getViewMatrix()),w(r,t,this._activeEffect),this._afterBind(t,this._activeEffect,n))}getAnimatables(){let e=[];return this.diffuseTexture&&this.diffuseTexture.animations&&this.diffuseTexture.animations.length>0&&e.push(this.diffuseTexture),e}getActiveTextures(){let e=super.getActiveTextures();return this._diffuseTexture&&e.push(this._diffuseTexture),e}hasTexture(e){return!!(super.hasTexture(e)||this.diffuseTexture===e)}dispose(e){this.diffuseTexture&&this.diffuseTexture.dispose(),super.dispose(e)}clone(t){return s.Clone(()=>new e(t,this.getScene()),this)}serialize(){let e=super.serialize();return e.customType=`BABYLON.NormalMaterial`,e}getClassName(){return`NormalMaterial`}static Parse(t,n,r){return s.Parse(()=>new e(t.name,n),t,n,r)}};l([u(`diffuseTexture`)],$.prototype,`_diffuseTexture`,void 0),l([d(`_markAllSubMeshesAsTexturesDirty`)],$.prototype,`diffuseTexture`,void 0),l([f()],$.prototype,`diffuseColor`,void 0),l([c(`disableLighting`)],$.prototype,`_disableLighting`,void 0),l([d(`_markAllSubMeshesAsLightsDirty`)],$.prototype,`disableLighting`,void 0),l([c(`maxSimultaneousLights`)],$.prototype,`_maxSimultaneousLights`,void 0),l([d(`_markAllSubMeshesAsLightsDirty`)],$.prototype,`maxSimultaneousLights`,void 0),r(`BABYLON.NormalMaterial`,$);export{$ as NormalMaterial};