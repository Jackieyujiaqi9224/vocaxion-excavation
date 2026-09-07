import{t as e}from"./shaderStore-D-XQlhUT.js";var t=`sceneUboDeclaration`,n=`layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;};
`;e.IncludesShadersStore[t]||(e.IncludesShadersStore[t]=n);var r=`logDepthDeclaration`,i=`#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`;e.IncludesShadersStore[r]||(e.IncludesShadersStore[r]=i);