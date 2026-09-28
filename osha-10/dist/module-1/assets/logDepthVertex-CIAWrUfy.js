import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({lightVxFragmentDeclaration:()=>s}),a,o,s,c=e((()=>{n(),a=`lightVxFragmentDeclaration`,o=`#ifdef LIGHT{X}
uniform vec4 vLightData{X};uniform vec4 vLightDiffuse{X};
#ifdef SPECULARTERM
uniform vec4 vLightSpecular{X};
#else
vec4 vLightSpecular{X}=vec4(0.);
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#elif defined(SHADOWCUBE{X})
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};
#endif
uniform vec4 shadowsInfo{X};uniform vec2 depthValues{X};
#endif
#ifdef SPOTLIGHT{X}
uniform vec4 vLightDirection{X};uniform vec4 vLightFalloff{X};
#elif defined(POINTLIGHT{X})
uniform vec4 vLightFalloff{X};
#elif defined(HEMILIGHT{X})
uniform vec3 vLightGround{X};
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
uniform vec4 vLightWidth{X};uniform vec4 vLightHeight{X};
#endif
#endif
`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o),s={name:a,shader:o}})),l=t({lightVxUboDeclaration:()=>f}),u,d,f,p=e((()=>{n(),u=`lightVxUboDeclaration`,d=`#ifdef LIGHT{X}
uniform Light{X}
{vec4 vLightData;vec4 vLightDiffuse;vec4 vLightSpecular;
#ifdef SPOTLIGHT{X}
vec4 vLightDirection;vec4 vLightFalloff;
#elif defined(POINTLIGHT{X})
vec4 vLightFalloff;
#elif defined(HEMILIGHT{X})
vec3 vLightGround;
#elif defined(CLUSTLIGHT{X})
vec2 vSliceData;vec2 vSliceRanges[CLUSTLIGHT_SLICES];
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
vec4 vLightWidth;vec4 vLightHeight;
#endif
vec4 shadowsInfo;vec2 depthValues;} light{X};
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#elif defined(SHADOWCUBE{X})
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};
#endif
#endif
#endif
`,r.IncludesShadersStore[u]||(r.IncludesShadersStore[u]=d),f={name:u,shader:d}})),m=t({shadowsVertex:()=>_}),h,g,_,v=e((()=>{n(),h=`shadowsVertex`,g=`#ifdef SHADOWS
#if defined(SHADOWCSM{X})
vPositionFromCamera{X}=view*worldPos;for (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++) {vPositionFromLight{X}[i]=lightMatrix{X}[i]*worldPos;
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric{X}[i]=(-vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;
#else
vDepthMetric{X}[i]=(vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;
#endif
}
#elif defined(SHADOW{X}) && !defined(SHADOWCUBE{X})
vPositionFromLight{X}=lightMatrix{X}*worldPos;
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric{X}=(-vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;
#else
vDepthMetric{X}=(vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;
#endif
#endif
#endif
`,r.IncludesShadersStore[h]||(r.IncludesShadersStore[h]=g),_={name:h,shader:g}})),y,b,x=e((()=>{n(),y=`fogVertexDeclaration`,b=`#ifdef FOG
varying vec3 vFogDistance;
#endif
`,r.IncludesShadersStore[y]||(r.IncludesShadersStore[y]=b)})),S,C,w=e((()=>{n(),S=`fogVertex`,C=`#ifdef FOG
vFogDistance=(view*worldPos).xyz;
#endif
`,r.IncludesShadersStore[S]||(r.IncludesShadersStore[S]=C)})),T,E,D=e((()=>{n(),T=`logDepthVertex`,E=`#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`,r.IncludesShadersStore[T]||(r.IncludesShadersStore[T]=E)}));export{_ as a,f as c,s as d,i as f,v as i,l,w as n,m as o,x as r,p as s,D as t,c as u};