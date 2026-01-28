#version 300 es
precision highp float;

in vec4 vColor;
in float vFlash;

in vec2 vQuadPos;

out vec4 outColor;

void main(){
    // vQuadPos ranges from -0.5..0.5; scale to -1..1 for radial calc
    vec2 p = vQuadPos * 2.0;
    float d2 = dot(p, p);
    if(d2 > 1.0) discard;

    // core + glow shape (copied/adapted from render.frag)
    // Increase core size for triangle-based atoms and adjust glow curve
    float coreSize = 0.3;
    float glowAmount = -4.0;

    float core = 1.0 - smoothstep(0.0, coreSize, d2);
    float glow = exp(glowAmount * d2);

    float fast = exp(-d2 * 200.0);
    float tail = exp(-d2 * 1.0) * 0.25;
    glow = fast + tail;

    // Determine glow strength from color intensity (less temp -> less glow)
    float maxc = max(max(vColor.r, vColor.g), vColor.b);
    // below ~0.05 -> no glow, near 1.0 -> full glow
    float glowScale = smoothstep(0.05, 0.95, maxc);
    glow *= 11.2;
    glow *= glowScale;

    vec3 col = vColor.rgb * core;
    col += vColor.rgb * glow;

    if (vFlash > 0.5) {
        float flashBoost = 1.5;
        vec3 flashCol = vec3(1.0) * (core + glow * flashBoost);
        col = flashCol;
        float alpha = clamp(core + glow * flashBoost, 0.0, 1.0);
        outColor = vec4(col, alpha);
        return;
    }

    float alpha = clamp(core + glow, 0.0, 1.0);
    outColor = vec4(col, alpha);
}
