// ─── GLSL ─────────────────────────────────────────────────────────────────────

export const VERTEX_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    vec2 uv = a_pos * 0.5 + 0.5;
    v_uv = vec2(uv.x, 1.0 - uv.y);
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform float u_pixels;
  uniform vec2  u_res;
  uniform int   u_mode;
  uniform float u_border;
  varying vec2  v_uv;

  vec4 blurSample(vec2 uv, float px) {
    vec2 s = px / u_res;
    vec4 c = vec4(0.0);
    for (int dx = -1; dx <= 1; dx++)
      for (int dy = -1; dy <= 1; dy++) {
        vec2 cell = floor((uv + vec2(float(dx), float(dy)) * s) * u_res / px)
                    * px / u_res + (px / u_res) * 0.5;
        c += texture2D(u_tex, cell);
      }
    return c / 9.0;
  }

  void main() {
    vec2 cellSz  = u_pixels / u_res;
    vec2 cellIdx = floor(v_uv / cellSz);
    vec2 cellUV  = fract(v_uv / cellSz);
    vec2 center  = (cellIdx + 0.5) * cellSz;

    float bMask = 0.0;
    if (u_border > 0.0) {
      float bx = step(cellUV.x, u_border) + step(1.0 - u_border, cellUV.x);
      float by = step(cellUV.y, u_border) + step(1.0 - u_border, cellUV.y);
      bMask = clamp(bx + by, 0.0, 1.0);
    }

    vec4 color;
    if (u_mode == 0) {
      color = texture2D(u_tex, center);
    } else if (u_mode == 1) {
      color = texture2D(u_tex, center);
      float t = fract(sin(dot(cellIdx, vec2(12.9898, 78.233))) * 43758.5453);
      color.rgb = mix(color.rgb, color.rgb * (0.8 + t * 0.4), 0.35);
    } else if (u_mode == 2) {
      vec2 sh = cellSz * 0.8;
      float r = texture2D(u_tex, center + vec2(sh.x, 0.0)).r;
      float g = texture2D(u_tex, center).g;
      float b = texture2D(u_tex, center - vec2(sh.x, 0.0)).b;
      color = vec4(r, g, b, 1.0);
    } else {
      color = blurSample(v_uv, u_pixels);
    }

    color.rgb = mix(color.rgb, vec3(0.0), bMask * 0.6);
    gl_FragColor = color;
  }
`;

// ─── Пресеты ──────────────────────────────────────────────────────────────────

export const PRESETS = {
  default:   { mode: 0, border: 0 },
  mosaic:    { mode: 1, border: 0.1 },
  rgb_split: { mode: 2, border: 0 },
  blur:      { mode: 3, border: 0 },
};

// ─── GL утилиты ───────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function initGL(canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return { gl, prog, tex };
}

export function glRender(gl, prog, canvas, pixels, mode, border) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(prog, "u_pixels"), Math.max(1, pixels));
  gl.uniform2f(gl.getUniformLocation(prog, "u_res"), canvas.width, canvas.height);
  gl.uniform1i(gl.getUniformLocation(prog, "u_mode"), mode);
  gl.uniform1f(gl.getUniformLocation(prog, "u_border"), border);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function loadTexture(gl, tex, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function loadTextureFromCanvas(gl, tex, sourceCanvas) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
}
