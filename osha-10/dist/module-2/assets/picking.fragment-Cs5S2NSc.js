import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({pickingPixelShaderWGSL:()=>s}),a,o,s,c=e((()=>{n(),a=`pickingPixelShader`,o=`#if defined(INSTANCES)
flat varying vMeshID: f32;
#else
uniform meshID: f32;
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var id: i32;
#if defined(INSTANCES)
id=i32(input.vMeshID);
#else
id=i32(uniforms.meshID);
#endif
var color=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF),
)/255.0;fragmentOutputs.color=vec4f(color,1.0);}
`,r.ShadersStoreWGSL[a]||(r.ShadersStoreWGSL[a]=o),s={name:a,shader:o}}));export{s as n,i as r,c as t};