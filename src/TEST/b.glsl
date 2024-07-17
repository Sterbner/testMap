
out vec4 fragColor;
uniform float iTime;
uniform sampler2D bufferA;
uniform sampler2D bufferD;

// Update Outflow 1st pass

vec2 readHeight(ivec2 p)
{
    p = clamp(p, ivec2(0), ivec2(textureSize - 1));
    return texelFetch(bufferA, p, 0).xy;
}

float computeOutFlowDir(vec2 centerHeight, ivec2 pos)
{
    vec2 dirHeight = readHeight(pos);
    return max(0.0f, (centerHeight.x + centerHeight.y) - (dirHeight.x + dirHeight.y));
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    //    float iFrame = 60.;

    ivec2 p = ivec2(fragCoord);
    // Init to zero at frame 0

    if (czm_frameNumber == 1.)
    {
        fragColor = vec4(0.);
        return;
    }

    // Outside ?
    if (max(p.x, p.y) > textureSize)
    discard;


    vec4 oOutFlow = texelFetch(bufferD, p, 0);
    vec2 height = readHeight(p);
    vec4 nOutFlow;
    nOutFlow.x = computeOutFlowDir(height, p + ivec2(1, 0));
    nOutFlow.y = computeOutFlowDir(height, p + ivec2(0, 1));
    nOutFlow.z = computeOutFlowDir(height, p + ivec2(-1, 0));
    nOutFlow.w = computeOutFlowDir(height, p + ivec2(0, -1));
    nOutFlow = attenuation * oOutFlow + strenght * nOutFlow;
    float totalFlow = nOutFlow.x + nOutFlow.y + nOutFlow.z + nOutFlow.w;
    if (totalFlow > minTotalFlow)
    {
        if (height.y < totalFlow)
        {
            nOutFlow = nOutFlow * (height.y / totalFlow);
        }
    }
    else
    {
        nOutFlow = vec4(0);
    }


    fragColor = nOutFlow;
}
