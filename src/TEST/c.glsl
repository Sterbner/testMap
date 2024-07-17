
out vec4 fragColor;
uniform float iTime;
uniform sampler2D bufferA;
uniform sampler2D bufferB;

// water level 2nd pass

vec2 readHeight(ivec2 p)
{
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));
    return texelFetch(bufferA, p, 0).xy;
}

vec4 readOutFlow(ivec2 p)
{
    if(p.x < 0 || p.y < 0 || p.x >= textureSize || p.y >= textureSize)
    return vec4(0);
    return texelFetch(bufferB, p, 0);
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    float iFrame = 60.;
    // Outside ?
    if( max(fragCoord.x, fragCoord.y) > float(textureSize) )
    discard;

    // Water
    ivec2 p = ivec2(fragCoord);
    vec2 height = readHeight(p);
    vec4 OutFlow = texelFetch(bufferB, p, 0);
    float totalOutFlow = OutFlow.x + OutFlow.y + OutFlow.z + OutFlow.w;
    float totalInFlow = 0.0;
    totalInFlow += readOutFlow(p  + ivec2( 1,  0)).z;
    totalInFlow += readOutFlow(p  + ivec2( 0,  1)).w;
    totalInFlow += readOutFlow(p  + ivec2(-1,  0)).x;
    totalInFlow += readOutFlow(p  + ivec2( 0, -1)).y;
    float waterDept = height.y - totalOutFlow + totalInFlow;

    fragColor = vec4(height.x, waterDept, 0, 1);
}
