/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
am4internal_webpackJsonp(["0471"], {
  "4E4r": function (t, e) {
    t.exports = function (t) {
      (this.ok = !1), (this.alpha = 1), "#" == t.charAt(0) && (t = t.substr(1, 6)), (t = (t = t.replace(/ /g, "")).toLowerCase());
      var e = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueindigo: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkindigo: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumindigored: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        paleindigored: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        indigo: "ee82ee",
        indigored: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32",
      };
      t = e[t] || t;
      for (
        var i = [
            {
              re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
              example: ["rgba(123, 234, 45, 0.8)", "rgba(255,234,245,1.0)"],
              process: function (t) {
                return [parseInt(t[1]), parseInt(t[2]), parseInt(t[3]), parseFloat(t[4])];
              },
            },
            {
              re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
              example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
              process: function (t) {
                return [parseInt(t[1]), parseInt(t[2]), parseInt(t[3])];
              },
            },
            {
              re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
              example: ["#00ff00", "336699"],
              process: function (t) {
                return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)];
              },
            },
            {
              re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
              example: ["#fb0", "f0f"],
              process: function (t) {
                return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)];
              },
            },
          ],
          n = 0;
        n < i.length;
        n++
      ) {
        var s = i[n].re,
          a = i[n].process,
          r = s.exec(t);
        if (r) {
          var o = a(r);
          (this.r = o[0]), (this.g = o[1]), (this.b = o[2]), o.length > 3 && (this.alpha = o[3]), (this.ok = !0);
        }
      }
      (this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r),
        (this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g),
        (this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b),
        (this.alpha = this.alpha < 0 ? 0 : this.alpha > 1 || isNaN(this.alpha) ? 1 : this.alpha),
        (this.toRGB = function () {
          return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        }),
        (this.toRGBA = function () {
          return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
        }),
        (this.toHex = function () {
          var t = this.r.toString(16),
            e = this.g.toString(16),
            i = this.b.toString(16);
          return 1 == t.length && (t = "0" + t), 1 == e.length && (e = "0" + e), 1 == i.length && (i = "0" + i), "#" + t + e + i;
        }),
        (this.getHelpXML = function () {
          for (var t = new Array(), n = 0; n < i.length; n++) for (var s = i[n].example, a = 0; a < s.length; a++) t[t.length] = s[a];
          for (var r in e) t[t.length] = r;
          var o = document.createElement("ul");
          o.setAttribute("id", "rgbcolor-examples");
          for (n = 0; n < t.length; n++)
            try {
              var l = document.createElement("li"),
                h = new RGBColor(t[n]),
                u = document.createElement("div");
              (u.style.cssText = "margin: 3px; border: 1px solid black; background:" + h.toHex() + "; color:" + h.toHex()), u.appendChild(document.createTextNode("test"));
              var f = document.createTextNode(" " + t[n] + " -> " + h.toRGB() + " -> " + h.toHex());
              l.appendChild(u), l.appendChild(f), o.appendChild(l);
            } catch (t) {
              throw new Error("unable to access local image data: " + t);
            }
          return o;
        });
    };
  },
  IJT6: function (t, e) {
    var i = [
        512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364,
        345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364,
        354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323,
        318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364,
        359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465,
        460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323,
        320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259,
      ],
      n = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      ];
    function s(t, e, i, n, s) {
      if ("string" == typeof t) t = document.getElementById(t);
      else if ("undefined" != typeof HTMLCanvasElement && !t instanceof HTMLCanvasElement) return;
      var a,
        r = t.getContext("2d");
      try {
        try {
          a = r.getImageData(e, i, n, s);
        } catch (t) {
          throw new Error("unable to access local image data: " + t);
        }
      } catch (t) {
        throw new Error("unable to access image data: " + t);
      }
      return a;
    }
    function a(t, e, i, n, a, o) {
      if (!(isNaN(o) || o < 1)) {
        o |= 0;
        var l = s(t, e, i, n, a);
        (l = r(l, e, i, n, a, o)), t.getContext("2d").putImageData(l, e, i);
      }
    }
    function r(t, e, s, a, r, o) {
      var l,
        u,
        f,
        c,
        d,
        m,
        p,
        y,
        g,
        v,
        b,
        x,
        E,
        w,
        P,
        B,
        C,
        T,
        V,
        M,
        k,
        S,
        A,
        D,
        R = t.data,
        I = o + o + 1,
        N = a - 1,
        z = r - 1,
        O = o + 1,
        X = (O * (O + 1)) / 2,
        F = new h(),
        L = F;
      for (f = 1; f < I; f++) if (((L = L.next = new h()), f == O)) var $ = L;
      L.next = F;
      var G = null,
        W = null;
      p = m = 0;
      var H = i[o],
        U = n[o];
      for (u = 0; u < r; u++) {
        for (
          B = C = T = V = y = g = v = b = 0, x = O * (M = R[m]), E = O * (k = R[m + 1]), w = O * (S = R[m + 2]), P = O * (A = R[m + 3]), y += X * M, g += X * k, v += X * S, b += X * A, L = F, f = 0;
          f < O;
          f++
        )
          (L.r = M), (L.g = k), (L.b = S), (L.a = A), (L = L.next);
        for (f = 1; f < O; f++)
          (c = m + ((N < f ? N : f) << 2)),
            (y += (L.r = M = R[c]) * (D = O - f)),
            (g += (L.g = k = R[c + 1]) * D),
            (v += (L.b = S = R[c + 2]) * D),
            (b += (L.a = A = R[c + 3]) * D),
            (B += M),
            (C += k),
            (T += S),
            (V += A),
            (L = L.next);
        for (G = F, W = $, l = 0; l < a; l++)
          (R[m + 3] = A = (b * H) >> U),
            0 != A ? ((A = 255 / A), (R[m] = ((y * H) >> U) * A), (R[m + 1] = ((g * H) >> U) * A), (R[m + 2] = ((v * H) >> U) * A)) : (R[m] = R[m + 1] = R[m + 2] = 0),
            (y -= x),
            (g -= E),
            (v -= w),
            (b -= P),
            (x -= G.r),
            (E -= G.g),
            (w -= G.b),
            (P -= G.a),
            (c = (p + ((c = l + o + 1) < N ? c : N)) << 2),
            (y += B += G.r = R[c]),
            (g += C += G.g = R[c + 1]),
            (v += T += G.b = R[c + 2]),
            (b += V += G.a = R[c + 3]),
            (G = G.next),
            (x += M = W.r),
            (E += k = W.g),
            (w += S = W.b),
            (P += A = W.a),
            (B -= M),
            (C -= k),
            (T -= S),
            (V -= A),
            (W = W.next),
            (m += 4);
        p += a;
      }
      for (l = 0; l < a; l++) {
        for (
          C = T = V = B = g = v = b = y = 0,
            x = O * (M = R[(m = l << 2)]),
            E = O * (k = R[m + 1]),
            w = O * (S = R[m + 2]),
            P = O * (A = R[m + 3]),
            y += X * M,
            g += X * k,
            v += X * S,
            b += X * A,
            L = F,
            f = 0;
          f < O;
          f++
        )
          (L.r = M), (L.g = k), (L.b = S), (L.a = A), (L = L.next);
        for (d = a, f = 1; f <= o; f++)
          (m = (d + l) << 2),
            (y += (L.r = M = R[m]) * (D = O - f)),
            (g += (L.g = k = R[m + 1]) * D),
            (v += (L.b = S = R[m + 2]) * D),
            (b += (L.a = A = R[m + 3]) * D),
            (B += M),
            (C += k),
            (T += S),
            (V += A),
            (L = L.next),
            f < z && (d += a);
        for (m = l, G = F, W = $, u = 0; u < r; u++)
          (R[(c = m << 2) + 3] = A = (b * H) >> U),
            A > 0 ? ((A = 255 / A), (R[c] = ((y * H) >> U) * A), (R[c + 1] = ((g * H) >> U) * A), (R[c + 2] = ((v * H) >> U) * A)) : (R[c] = R[c + 1] = R[c + 2] = 0),
            (y -= x),
            (g -= E),
            (v -= w),
            (b -= P),
            (x -= G.r),
            (E -= G.g),
            (w -= G.b),
            (P -= G.a),
            (c = (l + ((c = u + O) < z ? c : z) * a) << 2),
            (y += B += G.r = R[c]),
            (g += C += G.g = R[c + 1]),
            (v += T += G.b = R[c + 2]),
            (b += V += G.a = R[c + 3]),
            (G = G.next),
            (x += M = W.r),
            (E += k = W.g),
            (w += S = W.b),
            (P += A = W.a),
            (B -= M),
            (C -= k),
            (T -= S),
            (V -= A),
            (W = W.next),
            (m += a);
      }
      return t;
    }
    function o(t, e, i, n, a, r) {
      if (!(isNaN(r) || r < 1)) {
        r |= 0;
        var o = s(t, e, i, n, a);
        (o = l(o, e, i, n, a, r)), t.getContext("2d").putImageData(o, e, i);
      }
    }
    function l(t, e, s, a, r, o) {
      var l,
        u,
        f,
        c,
        d,
        m,
        p,
        y,
        g,
        v,
        b,
        x,
        E,
        w,
        P,
        B,
        C,
        T,
        V,
        M,
        k = t.data,
        S = o + o + 1,
        A = a - 1,
        D = r - 1,
        R = o + 1,
        I = (R * (R + 1)) / 2,
        N = new h(),
        z = N;
      for (f = 1; f < S; f++) if (((z = z.next = new h()), f == R)) var O = z;
      z.next = N;
      var X = null,
        F = null;
      p = m = 0;
      var L = i[o],
        $ = n[o];
      for (u = 0; u < r; u++) {
        for (w = P = B = y = g = v = 0, b = R * (C = k[m]), x = R * (T = k[m + 1]), E = R * (V = k[m + 2]), y += I * C, g += I * T, v += I * V, z = N, f = 0; f < R; f++)
          (z.r = C), (z.g = T), (z.b = V), (z = z.next);
        for (f = 1; f < R; f++)
          (c = m + ((A < f ? A : f) << 2)), (y += (z.r = C = k[c]) * (M = R - f)), (g += (z.g = T = k[c + 1]) * M), (v += (z.b = V = k[c + 2]) * M), (w += C), (P += T), (B += V), (z = z.next);
        for (X = N, F = O, l = 0; l < a; l++)
          (k[m] = (y * L) >> $),
            (k[m + 1] = (g * L) >> $),
            (k[m + 2] = (v * L) >> $),
            (y -= b),
            (g -= x),
            (v -= E),
            (b -= X.r),
            (x -= X.g),
            (E -= X.b),
            (c = (p + ((c = l + o + 1) < A ? c : A)) << 2),
            (y += w += X.r = k[c]),
            (g += P += X.g = k[c + 1]),
            (v += B += X.b = k[c + 2]),
            (X = X.next),
            (b += C = F.r),
            (x += T = F.g),
            (E += V = F.b),
            (w -= C),
            (P -= T),
            (B -= V),
            (F = F.next),
            (m += 4);
        p += a;
      }
      for (l = 0; l < a; l++) {
        for (P = B = w = g = v = y = 0, b = R * (C = k[(m = l << 2)]), x = R * (T = k[m + 1]), E = R * (V = k[m + 2]), y += I * C, g += I * T, v += I * V, z = N, f = 0; f < R; f++)
          (z.r = C), (z.g = T), (z.b = V), (z = z.next);
        for (d = a, f = 1; f <= o; f++)
          (m = (d + l) << 2), (y += (z.r = C = k[m]) * (M = R - f)), (g += (z.g = T = k[m + 1]) * M), (v += (z.b = V = k[m + 2]) * M), (w += C), (P += T), (B += V), (z = z.next), f < D && (d += a);
        for (m = l, X = N, F = O, u = 0; u < r; u++)
          (k[(c = m << 2)] = (y * L) >> $),
            (k[c + 1] = (g * L) >> $),
            (k[c + 2] = (v * L) >> $),
            (y -= b),
            (g -= x),
            (v -= E),
            (b -= X.r),
            (x -= X.g),
            (E -= X.b),
            (c = (l + ((c = u + R) < D ? c : D) * a) << 2),
            (y += w += X.r = k[c]),
            (g += P += X.g = k[c + 1]),
            (v += B += X.b = k[c + 2]),
            (X = X.next),
            (b += C = F.r),
            (x += T = F.g),
            (E += V = F.b),
            (w -= C),
            (P -= T),
            (B -= V),
            (F = F.next),
            (m += a);
      }
      return t;
    }
    function h() {
      (this.r = 0), (this.g = 0), (this.b = 0), (this.a = 0), (this.next = null);
    }
    t.exports = {
      image: function (t, e, i, n) {
        if ("string" == typeof t) t = document.getElementById(t);
        else if ("undefined" != typeof HTMLImageElement && !t instanceof HTMLImageElement) return;
        var s = t.naturalWidth,
          r = t.naturalHeight;
        if ("string" == typeof e) e = document.getElementById(e);
        else if ("undefined" != typeof HTMLCanvasElement && !e instanceof HTMLCanvasElement) return;
        (e.style.width = s + "px"), (e.style.height = r + "px"), (e.width = s), (e.height = r);
        var l = e.getContext("2d");
        l.clearRect(0, 0, s, r), l.drawImage(t, 0, 0), isNaN(i) || i < 1 || (n ? a(e, 0, 0, s, r, i) : o(e, 0, 0, s, r, i));
      },
      canvasRGBA: a,
      canvasRGB: o,
      imageDataRGBA: r,
      imageDataRGB: l,
    };
  },
  pu93: function (t, e, i) {
    !(function (e, n) {
      t.exports = n(i("4E4r"), i("IJT6"));
    })(0, function (t, e) {
      "use strict";
      var i;
      return (
        (t = t && t.hasOwnProperty("default") ? t.default : t),
        (e = e && e.hasOwnProperty("default") ? e.default : e),
        (function (i) {
          var n;
          function s() {
            return document.createElement("canvas");
          }
          i.exports, ((n = window).DOMParser = window.DOMParser);
          var a,
            r = function (i, o, l) {
              if (null != i || null != o || null != l) {
                var h = (function (i) {
                  var r = { opts: i, FRAMERATE: 30, MAX_VIRTUAL_PIXELS: 3e4, rootEmSize: 12, emSize: 12, log: function (t) {} };
                  1 == r.opts.log &&
                    "undefined" != typeof console &&
                    (r.log = function (t) {
                      console.log(t);
                    }),
                    (r.init = function (t) {
                      var e = 0;
                      (r.UniqueId = function () {
                        return "canvg" + ++e;
                      }),
                        (r.Definitions = {}),
                        (r.Styles = {}),
                        (r.StylesSpecificity = {}),
                        (r.Animations = []),
                        (r.Images = []),
                        (r.ctx = t),
                        (r.ViewPort = new (function () {
                          (this.viewPorts = []),
                            (this.Clear = function () {
                              this.viewPorts = [];
                            }),
                            (this.SetCurrent = function (t, e) {
                              this.viewPorts.push({ width: t, height: e });
                            }),
                            (this.RemoveCurrent = function () {
                              this.viewPorts.pop();
                            }),
                            (this.Current = function () {
                              return this.viewPorts[this.viewPorts.length - 1];
                            }),
                            (this.width = function () {
                              return this.Current().width;
                            }),
                            (this.height = function () {
                              return this.Current().height;
                            }),
                            (this.ComputeSize = function (t) {
                              return null != t && "number" == typeof t
                                ? t
                                : "x" == t
                                ? this.width()
                                : "y" == t
                                ? this.height()
                                : Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
                            });
                        })());
                    }),
                    r.init(),
                    (r.ImagesLoaded = function () {
                      for (var t = 0; t < r.Images.length; t++) if (!r.Images[t].loaded) return !1;
                      return !0;
                    }),
                    (r.trim = function (t) {
                      return t.replace(/^\s+|\s+$/g, "");
                    }),
                    (r.compressSpaces = function (t) {
                      return t.replace(/(?!\u3000)\s+/gm, " ");
                    }),
                    (r.ajax = function (t) {
                      var e;
                      return (e = n.XMLHttpRequest ? new n.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")) ? (e.open("GET", t, !1), e.send(null), e.responseText) : null;
                    }),
                    (r.parseXml = function (t) {
                      if ("undefined" != typeof Windows && void 0 !== Windows.Data && void 0 !== Windows.Data.Xml) {
                        var e = new Windows.Data.Xml.Dom.XmlDocument(),
                          s = new Windows.Data.Xml.Dom.XmlLoadSettings();
                        return (s.prohibitDtd = !1), e.loadXml(t, s), e;
                      }
                      if (!n.DOMParser) return (t = t.replace(/<!DOCTYPE svg[^>]*>/, "")), ((e = new ActiveXObject("Microsoft.XMLDOM")).async = "false"), e.loadXML(t), e;
                      try {
                        var a = i.xmldom ? new n.DOMParser(i.xmldom) : new n.DOMParser();
                        return a.parseFromString(t, "image/svg+xml");
                      } catch (e) {
                        return (a = i.xmldom ? new n.DOMParser(i.xmldom) : new n.DOMParser()).parseFromString(t, "text/xml");
                      }
                    }),
                    (r.Property = function (t, e) {
                      (this.name = t), (this.value = e);
                    }),
                    (r.Property.prototype.getValue = function () {
                      return this.value;
                    }),
                    (r.Property.prototype.hasValue = function () {
                      return null != this.value && "" !== this.value;
                    }),
                    (r.Property.prototype.numValue = function () {
                      if (!this.hasValue()) return 0;
                      var t = parseFloat(this.value);
                      return (this.value + "").match(/%$/) && (t /= 100), t;
                    }),
                    (r.Property.prototype.valueOrDefault = function (t) {
                      return this.hasValue() ? this.value : t;
                    }),
                    (r.Property.prototype.numValueOrDefault = function (t) {
                      return this.hasValue() ? this.numValue() : t;
                    }),
                    (r.Property.prototype.addOpacity = function (e) {
                      var i = this.value;
                      if (null != e.value && "" != e.value && "string" == typeof this.value) {
                        var n = new t(this.value);
                        n.ok && (i = "rgba(" + n.r + ", " + n.g + ", " + n.b + ", " + e.numValue() + ")");
                      }
                      return new r.Property(this.name, i);
                    }),
                    (r.Property.prototype.getDefinition = function () {
                      var t = this.value.match(/#([^\)'"]+)/);
                      return t && (t = t[1]), t || (t = this.value), r.Definitions[t];
                    }),
                    (r.Property.prototype.isUrlDefinition = function () {
                      return 0 == this.value.indexOf("url(");
                    }),
                    (r.Property.prototype.getFillStyleDefinition = function (t, e) {
                      var i = this.getDefinition();
                      if (null != i && i.createGradient) return i.createGradient(r.ctx, t, e);
                      if (null != i && i.createPattern) {
                        if (i.getHrefAttribute().hasValue()) {
                          var n = i.attribute("patternTransform");
                          (i = i.getHrefAttribute().getDefinition()), n.hasValue() && (i.attribute("patternTransform", !0).value = n.value);
                        }
                        return i.createPattern(r.ctx, t);
                      }
                      return null;
                    }),
                    (r.Property.prototype.getDPI = function (t) {
                      return 96;
                    }),
                    (r.Property.prototype.getREM = function (t) {
                      return r.rootEmSize;
                    }),
                    (r.Property.prototype.getEM = function (t) {
                      return r.emSize;
                    }),
                    (r.Property.prototype.getUnits = function () {
                      return (this.value + "").replace(/[0-9\.\-]/g, "");
                    }),
                    (r.Property.prototype.isPixels = function () {
                      if (!this.hasValue()) return !1;
                      var t = this.value + "";
                      return !!t.match(/px$/) || !!t.match(/^[0-9]+$/);
                    }),
                    (r.Property.prototype.toPixels = function (t, e) {
                      if (!this.hasValue()) return 0;
                      var i = this.value + "";
                      if (i.match(/rem$/)) return this.numValue() * this.getREM(t);
                      if (i.match(/em$/)) return this.numValue() * this.getEM(t);
                      if (i.match(/ex$/)) return (this.numValue() * this.getEM(t)) / 2;
                      if (i.match(/px$/)) return this.numValue();
                      if (i.match(/pt$/)) return this.numValue() * this.getDPI(t) * (1 / 72);
                      if (i.match(/pc$/)) return 15 * this.numValue();
                      if (i.match(/cm$/)) return (this.numValue() * this.getDPI(t)) / 2.54;
                      if (i.match(/mm$/)) return (this.numValue() * this.getDPI(t)) / 25.4;
                      if (i.match(/in$/)) return this.numValue() * this.getDPI(t);
                      if (i.match(/%$/)) return this.numValue() * r.ViewPort.ComputeSize(t);
                      var n = this.numValue();
                      return e && n < 1 ? n * r.ViewPort.ComputeSize(t) : n;
                    }),
                    (r.Property.prototype.toMilliseconds = function () {
                      if (!this.hasValue()) return 0;
                      var t = this.value + "";
                      return t.match(/s$/) ? 1e3 * this.numValue() : (t.match(/ms$/), this.numValue());
                    }),
                    (r.Property.prototype.toRadians = function () {
                      if (!this.hasValue()) return 0;
                      var t = this.value + "";
                      return t.match(/deg$/)
                        ? this.numValue() * (Math.PI / 180)
                        : t.match(/grad$/)
                        ? this.numValue() * (Math.PI / 200)
                        : t.match(/rad$/)
                        ? this.numValue()
                        : this.numValue() * (Math.PI / 180);
                    });
                  var o = {
                    baseline: "alphabetic",
                    "before-edge": "top",
                    "text-before-edge": "top",
                    middle: "middle",
                    central: "middle",
                    "after-edge": "bottom",
                    "text-after-edge": "bottom",
                    ideographic: "ideographic",
                    alphabetic: "alphabetic",
                    hanging: "hanging",
                    mathematical: "alphabetic",
                  };
                  return (
                    (r.Property.prototype.toTextBaseline = function () {
                      return this.hasValue() ? o[this.value] : null;
                    }),
                    (r.Font = new (function () {
                      (this.Styles = "normal|italic|oblique|inherit"),
                        (this.Variants = "normal|small-caps|inherit"),
                        (this.Weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit"),
                        (this.CreateFont = function (t, e, i, n, s, a) {
                          var o = null != a ? this.Parse(a) : this.CreateFont("", "", "", "", "", r.ctx.font);
                          return {
                            fontFamily: (s = s || o.fontFamily),
                            fontSize: n || o.fontSize,
                            fontStyle: t || o.fontStyle,
                            fontWeight: i || o.fontWeight,
                            fontVariant: e || o.fontVariant,
                            toString: function () {
                              return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(" ");
                            },
                          };
                        });
                      var t = this;
                      this.Parse = function (e) {
                        for (var i = {}, n = r.trim(r.compressSpaces(e || "")).split(" "), s = { fontSize: !1, fontStyle: !1, fontWeight: !1, fontVariant: !1 }, a = "", o = 0; o < n.length; o++)
                          s.fontStyle || -1 == t.Styles.indexOf(n[o])
                            ? s.fontVariant || -1 == t.Variants.indexOf(n[o])
                              ? s.fontWeight || -1 == t.Weights.indexOf(n[o])
                                ? s.fontSize
                                  ? "inherit" != n[o] && (a += n[o])
                                  : ("inherit" != n[o] && (i.fontSize = n[o].split("/")[0]), (s.fontStyle = s.fontVariant = s.fontWeight = s.fontSize = !0))
                                : ("inherit" != n[o] && (i.fontWeight = n[o]), (s.fontStyle = s.fontVariant = s.fontWeight = !0))
                              : ("inherit" != n[o] && (i.fontVariant = n[o]), (s.fontStyle = s.fontVariant = !0))
                            : ("inherit" != n[o] && (i.fontStyle = n[o]), (s.fontStyle = !0));
                        return "" != a && (i.fontFamily = a), i;
                      };
                    })()),
                    (r.ToNumberArray = function (t) {
                      for (var e = r.trim(r.compressSpaces((t || "").replace(/,/g, " "))).split(" "), i = 0; i < e.length; i++) e[i] = parseFloat(e[i]);
                      return e;
                    }),
                    (r.Point = function (t, e) {
                      (this.x = t), (this.y = e);
                    }),
                    (r.Point.prototype.angleTo = function (t) {
                      return Math.atan2(t.y - this.y, t.x - this.x);
                    }),
                    (r.Point.prototype.applyTransform = function (t) {
                      var e = this.x * t[0] + this.y * t[2] + t[4],
                        i = this.x * t[1] + this.y * t[3] + t[5];
                      (this.x = e), (this.y = i);
                    }),
                    (r.CreatePoint = function (t) {
                      var e = r.ToNumberArray(t);
                      return new r.Point(e[0], e[1]);
                    }),
                    (r.CreatePath = function (t) {
                      for (var e = r.ToNumberArray(t), i = [], n = 0; n < e.length; n += 2) i.push(new r.Point(e[n], e[n + 1]));
                      return i;
                    }),
                    (r.BoundingBox = function (t, e, i, n) {
                      (this.x1 = Number.NaN),
                        (this.y1 = Number.NaN),
                        (this.x2 = Number.NaN),
                        (this.y2 = Number.NaN),
                        (this.x = function () {
                          return this.x1;
                        }),
                        (this.y = function () {
                          return this.y1;
                        }),
                        (this.width = function () {
                          return this.x2 - this.x1;
                        }),
                        (this.height = function () {
                          return this.y2 - this.y1;
                        }),
                        (this.addPoint = function (t, e) {
                          null != t && ((isNaN(this.x1) || isNaN(this.x2)) && ((this.x1 = t), (this.x2 = t)), t < this.x1 && (this.x1 = t), t > this.x2 && (this.x2 = t)),
                            null != e && ((isNaN(this.y1) || isNaN(this.y2)) && ((this.y1 = e), (this.y2 = e)), e < this.y1 && (this.y1 = e), e > this.y2 && (this.y2 = e));
                        }),
                        (this.addX = function (t) {
                          this.addPoint(t, null);
                        }),
                        (this.addY = function (t) {
                          this.addPoint(null, t);
                        }),
                        (this.addBoundingBox = function (t) {
                          this.addPoint(t.x1, t.y1), this.addPoint(t.x2, t.y2);
                        }),
                        (this.addQuadraticCurve = function (t, e, i, n, s, a) {
                          var r = t + (2 / 3) * (i - t),
                            o = e + (2 / 3) * (n - e),
                            l = r + (1 / 3) * (s - t),
                            h = o + (1 / 3) * (a - e);
                          this.addBezierCurve(t, e, r, l, o, h, s, a);
                        }),
                        (this.addBezierCurve = function (t, e, i, n, s, a, r, o) {
                          var l = [t, e],
                            h = [i, n],
                            u = [s, a],
                            f = [r, o];
                          this.addPoint(l[0], l[1]), this.addPoint(f[0], f[1]);
                          for (var c = 0; c <= 1; c++) {
                            var d = function (t) {
                                return Math.pow(1 - t, 3) * l[c] + 3 * Math.pow(1 - t, 2) * t * h[c] + 3 * (1 - t) * Math.pow(t, 2) * u[c] + Math.pow(t, 3) * f[c];
                              },
                              m = 6 * l[c] - 12 * h[c] + 6 * u[c],
                              p = -3 * l[c] + 9 * h[c] - 9 * u[c] + 3 * f[c],
                              y = 3 * h[c] - 3 * l[c];
                            if (0 != p) {
                              var g = Math.pow(m, 2) - 4 * y * p;
                              if (!(g < 0)) {
                                var v = (-m + Math.sqrt(g)) / (2 * p);
                                0 < v && v < 1 && (0 == c && this.addX(d(v)), 1 == c && this.addY(d(v)));
                                var b = (-m - Math.sqrt(g)) / (2 * p);
                                0 < b && b < 1 && (0 == c && this.addX(d(b)), 1 == c && this.addY(d(b)));
                              }
                            } else {
                              if (0 == m) continue;
                              var x = -y / m;
                              0 < x && x < 1 && (0 == c && this.addX(d(x)), 1 == c && this.addY(d(x)));
                            }
                          }
                        }),
                        (this.isPointInBox = function (t, e) {
                          return this.x1 <= t && t <= this.x2 && this.y1 <= e && e <= this.y2;
                        }),
                        this.addPoint(t, e),
                        this.addPoint(i, n);
                    }),
                    (r.Transform = function (t) {
                      var e = this;
                      (this.Type = {}),
                        (this.Type.translate = function (t) {
                          (this.p = r.CreatePoint(t)),
                            (this.apply = function (t) {
                              t.translate(this.p.x || 0, this.p.y || 0);
                            }),
                            (this.unapply = function (t) {
                              t.translate(-1 * this.p.x || 0, -1 * this.p.y || 0);
                            }),
                            (this.applyToPoint = function (t) {
                              t.applyTransform([1, 0, 0, 1, this.p.x || 0, this.p.y || 0]);
                            });
                        }),
                        (this.Type.rotate = function (t) {
                          var e = r.ToNumberArray(t);
                          (this.angle = new r.Property("angle", e[0])),
                            (this.cx = e[1] || 0),
                            (this.cy = e[2] || 0),
                            (this.apply = function (t) {
                              t.translate(this.cx, this.cy), t.rotate(this.angle.toRadians()), t.translate(-this.cx, -this.cy);
                            }),
                            (this.unapply = function (t) {
                              t.translate(this.cx, this.cy), t.rotate(-1 * this.angle.toRadians()), t.translate(-this.cx, -this.cy);
                            }),
                            (this.applyToPoint = function (t) {
                              var e = this.angle.toRadians();
                              t.applyTransform([1, 0, 0, 1, this.p.x || 0, this.p.y || 0]),
                                t.applyTransform([Math.cos(e), Math.sin(e), -Math.sin(e), Math.cos(e), 0, 0]),
                                t.applyTransform([1, 0, 0, 1, -this.p.x || 0, -this.p.y || 0]);
                            });
                        }),
                        (this.Type.scale = function (t) {
                          (this.p = r.CreatePoint(t)),
                            (this.apply = function (t) {
                              t.scale(this.p.x || 1, this.p.y || this.p.x || 1);
                            }),
                            (this.unapply = function (t) {
                              t.scale(1 / this.p.x || 1, 1 / this.p.y || this.p.x || 1);
                            }),
                            (this.applyToPoint = function (t) {
                              t.applyTransform([this.p.x || 0, 0, 0, this.p.y || 0, 0, 0]);
                            });
                        }),
                        (this.Type.matrix = function (t) {
                          (this.m = r.ToNumberArray(t)),
                            (this.apply = function (t) {
                              t.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
                            }),
                            (this.unapply = function (t) {
                              var e = this.m[0],
                                i = this.m[2],
                                n = this.m[4],
                                s = this.m[1],
                                a = this.m[3],
                                r = this.m[5],
                                o = 1 / (e * (1 * a - 0 * r) - i * (1 * s - 0 * r) + n * (0 * s - 0 * a));
                              t.transform(o * (1 * a - 0 * r), o * (0 * r - 1 * s), o * (0 * n - 1 * i), o * (1 * e - 0 * n), o * (i * r - n * a), o * (n * s - e * r));
                            }),
                            (this.applyToPoint = function (t) {
                              t.applyTransform(this.m);
                            });
                        }),
                        (this.Type.SkewBase = function (t) {
                          (this.base = e.Type.matrix), this.base(t), (this.angle = new r.Property("angle", t));
                        }),
                        (this.Type.SkewBase.prototype = new this.Type.matrix()),
                        (this.Type.skewX = function (t) {
                          (this.base = e.Type.SkewBase), this.base(t), (this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0]);
                        }),
                        (this.Type.skewX.prototype = new this.Type.SkewBase()),
                        (this.Type.skewY = function (t) {
                          (this.base = e.Type.SkewBase), this.base(t), (this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0]);
                        }),
                        (this.Type.skewY.prototype = new this.Type.SkewBase()),
                        (this.transforms = []),
                        (this.apply = function (t) {
                          for (var e = 0; e < this.transforms.length; e++) this.transforms[e].apply(t);
                        }),
                        (this.unapply = function (t) {
                          for (var e = this.transforms.length - 1; 0 <= e; e--) this.transforms[e].unapply(t);
                        }),
                        (this.applyToPoint = function (t) {
                          for (var e = 0; e < this.transforms.length; e++) this.transforms[e].applyToPoint(t);
                        });
                      for (
                        var i = r
                            .trim(r.compressSpaces(t))
                            .replace(/\)([a-zA-Z])/g, ") $1")
                            .replace(/\)(\s?,\s?)/g, ") ")
                            .split(/\s(?=[a-z])/),
                          n = 0;
                        n < i.length;
                        n++
                      )
                        if ("none" !== i[n]) {
                          var s = r.trim(i[n].split("(")[0]),
                            a = i[n].split("(")[1].replace(")", ""),
                            o = this.Type[s];
                          if (void 0 !== o) {
                            var l = new o(a);
                            (l.type = s), this.transforms.push(l);
                          }
                        }
                    }),
                    (r.AspectRatio = function (t, e, i, n, s, a, o, l, h, u) {
                      var f = (e = (e = r.compressSpaces(e)).replace(/^defer\s/, "")).split(" ")[0] || "xMidYMid",
                        c = e.split(" ")[1] || "meet",
                        d = i / n,
                        m = s / a,
                        p = Math.min(d, m),
                        y = Math.max(d, m);
                      "meet" == c && ((n *= p), (a *= p)),
                        "slice" == c && ((n *= y), (a *= y)),
                        (h = new r.Property("refX", h)),
                        (u = new r.Property("refY", u)),
                        h.hasValue() && u.hasValue()
                          ? t.translate(-p * h.toPixels("x"), -p * u.toPixels("y"))
                          : (f.match(/^xMid/) && (("meet" == c && p == m) || ("slice" == c && y == m)) && t.translate(i / 2 - n / 2, 0),
                            f.match(/YMid$/) && (("meet" == c && p == d) || ("slice" == c && y == d)) && t.translate(0, s / 2 - a / 2),
                            f.match(/^xMax/) && (("meet" == c && p == m) || ("slice" == c && y == m)) && t.translate(i - n, 0),
                            f.match(/YMax$/) && (("meet" == c && p == d) || ("slice" == c && y == d)) && t.translate(0, s - a)),
                        "none" == f ? t.scale(d, m) : "meet" == c ? t.scale(p, p) : "slice" == c && t.scale(y, y),
                        t.translate(null == o ? 0 : -o, null == l ? 0 : -l);
                    }),
                    (r.Element = {}),
                    (r.EmptyProperty = new r.Property("EMPTY", "")),
                    (r.Element.ElementBase = function (t) {
                      (this.attributes = {}),
                        (this.styles = {}),
                        (this.stylesSpecificity = {}),
                        (this.children = []),
                        (this.attribute = function (t, e) {
                          var i = this.attributes[t];
                          return null != i ? i : (1 == e && ((i = new r.Property(t, "")), (this.attributes[t] = i)), i || r.EmptyProperty);
                        }),
                        (this.getHrefAttribute = function () {
                          for (var t in this.attributes) if ("href" == t || t.match(/:href$/)) return this.attributes[t];
                          return r.EmptyProperty;
                        }),
                        (this.style = function (t, e, i) {
                          var n = this.styles[t];
                          if (null != n) return n;
                          var s = this.attribute(t);
                          if (null != s && s.hasValue()) return (this.styles[t] = s);
                          if (1 != i) {
                            var a = this.parent;
                            if (null != a) {
                              var o = a.style(t);
                              if (null != o && o.hasValue()) return o;
                            }
                          }
                          return 1 == e && ((n = new r.Property(t, "")), (this.styles[t] = n)), n || r.EmptyProperty;
                        }),
                        (this.render = function (t) {
                          if ("none" != this.style("display").value && "hidden" != this.style("visibility").value) {
                            if ((t.save(), this.style("mask").hasValue())) {
                              var e = this.style("mask").getDefinition();
                              null != e && e.apply(t, this);
                            } else if (this.style("filter").hasValue()) {
                              var i = this.style("filter").getDefinition();
                              null != i && i.apply(t, this);
                            } else this.setContext(t), this.renderChildren(t), this.clearContext(t);
                            t.restore();
                          }
                        }),
                        (this.setContext = function (t) {}),
                        (this.clearContext = function (t) {}),
                        (this.renderChildren = function (t) {
                          for (var e = 0; e < this.children.length; e++) this.children[e].render(t);
                        }),
                        (this.addChild = function (t, e) {
                          var i = t;
                          e && (i = r.CreateElement(t)), (i.parent = this), "title" != i.type && this.children.push(i);
                        }),
                        (this.addStylesFromStyleDefinition = function () {
                          for (var e in r.Styles)
                            if ("@" != e[0] && a(t, e)) {
                              var i = r.Styles[e],
                                n = r.StylesSpecificity[e];
                              if (null != i)
                                for (var s in i) {
                                  var o = this.stylesSpecificity[s];
                                  void 0 === o && (o = "000"), o < n && ((this.styles[s] = i[s]), (this.stylesSpecificity[s] = n));
                                }
                            }
                        });
                      var e,
                        i = new RegExp("^[A-Z-]+$");
                      if (null != t && 1 == t.nodeType) {
                        for (var n = 0; n < t.attributes.length; n++) {
                          var s = t.attributes[n],
                            o = ((e = s.nodeName), i.test(e) ? e.toLowerCase() : e);
                          this.attributes[o] = new r.Property(o, s.value);
                        }
                        if ((this.addStylesFromStyleDefinition(), this.attribute("style").hasValue())) {
                          var l = this.attribute("style").value.split(";");
                          for (n = 0; n < l.length; n++)
                            if ("" != r.trim(l[n])) {
                              var h = l[n].split(":"),
                                u = r.trim(h[0]),
                                f = r.trim(h[1]);
                              this.styles[u] = new r.Property(u, f);
                            }
                        }
                        for (
                          this.attribute("id").hasValue() && null == r.Definitions[this.attribute("id").value] && (r.Definitions[this.attribute("id").value] = this), n = 0;
                          n < t.childNodes.length;
                          n++
                        ) {
                          var c = t.childNodes[n];
                          if ((1 == c.nodeType && this.addChild(c, !0), this.captureTextNodes && (3 == c.nodeType || 4 == c.nodeType))) {
                            var d = c.value || c.text || c.textContent || "";
                            "" != r.compressSpaces(d) && this.addChild(new r.Element.tspan(c), !1);
                          }
                        }
                      }
                    }),
                    (r.Element.RenderedElementBase = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.calculateOpacity = function () {
                          for (var t = 1, e = this; null != e; ) {
                            var i = e.style("opacity", !1, !0);
                            i.hasValue() && (t *= i.numValue()), (e = e.parent);
                          }
                          return t;
                        }),
                        (this.setContext = function (t, e) {
                          if (!e) {
                            var i;
                            if (this.style("fill").isUrlDefinition()) null != (i = this.style("fill").getFillStyleDefinition(this, this.style("fill-opacity"))) && (t.fillStyle = i);
                            else if (this.style("fill").hasValue()) {
                              var n;
                              "currentColor" == (n = this.style("fill")).value && (n.value = this.style("color").value),
                                "inherit" != n.value && (t.fillStyle = "none" == n.value ? "rgba(0,0,0,0)" : n.value);
                            }
                            if (
                              (this.style("fill-opacity").hasValue() && ((n = (n = new r.Property("fill", t.fillStyle)).addOpacity(this.style("fill-opacity"))), (t.fillStyle = n.value)),
                              this.style("stroke").isUrlDefinition())
                            )
                              null != (i = this.style("stroke").getFillStyleDefinition(this, this.style("stroke-opacity"))) && (t.strokeStyle = i);
                            else if (this.style("stroke").hasValue()) {
                              var s;
                              "currentColor" == (s = this.style("stroke")).value && (s.value = this.style("color").value),
                                "inherit" != s.value && (t.strokeStyle = "none" == s.value ? "rgba(0,0,0,0)" : s.value);
                            }
                            if (
                              (this.style("stroke-opacity").hasValue() && ((s = (s = new r.Property("stroke", t.strokeStyle)).addOpacity(this.style("stroke-opacity"))), (t.strokeStyle = s.value)),
                              this.style("stroke-width").hasValue())
                            ) {
                              var a = this.style("stroke-width").toPixels();
                              t.lineWidth = 0 == a ? 0.001 : a;
                            }
                            if (
                              (this.style("stroke-linecap").hasValue() && (t.lineCap = this.style("stroke-linecap").value),
                              this.style("stroke-linejoin").hasValue() && (t.lineJoin = this.style("stroke-linejoin").value),
                              this.style("stroke-miterlimit").hasValue() && (t.miterLimit = this.style("stroke-miterlimit").value),
                              this.style("paint-order").hasValue() && (t.paintOrder = this.style("paint-order").value),
                              this.style("stroke-dasharray").hasValue() && "none" != this.style("stroke-dasharray").value)
                            ) {
                              var o = r.ToNumberArray(this.style("stroke-dasharray").value);
                              void 0 !== t.setLineDash
                                ? t.setLineDash(o)
                                : void 0 !== t.webkitLineDash
                                ? (t.webkitLineDash = o)
                                : void 0 === t.mozDash || (1 == o.length && 0 == o[0]) || (t.mozDash = o);
                              var l = this.style("stroke-dashoffset").toPixels();
                              void 0 !== t.lineDashOffset
                                ? (t.lineDashOffset = l)
                                : void 0 !== t.webkitLineDashOffset
                                ? (t.webkitLineDashOffset = l)
                                : void 0 !== t.mozDashOffset && (t.mozDashOffset = l);
                            }
                          }
                          if (void 0 !== t.font) {
                            t.font = r.Font.CreateFont(
                              this.style("font-style").value,
                              this.style("font-variant").value,
                              this.style("font-weight").value,
                              this.style("font-size").hasValue() ? this.style("font-size").toPixels() + "px" : "",
                              this.style("font-family").value
                            ).toString();
                            var h = this.style("font-size", !1, !1);
                            h.isPixels() && (r.emSize = h.toPixels());
                          }
                          if ((this.style("transform", !1, !0).hasValue() && new r.Transform(this.style("transform", !1, !0).value).apply(t), this.style("clip-path", !1, !0).hasValue())) {
                            var u = this.style("clip-path", !1, !0).getDefinition();
                            null != u && u.apply(t);
                          }
                          t.globalAlpha = this.calculateOpacity();
                        });
                    }),
                    (r.Element.RenderedElementBase.prototype = new r.Element.ElementBase()),
                    (r.Element.PathElementBase = function (t) {
                      (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.path = function (t) {
                          return null != t && t.beginPath(), new r.BoundingBox();
                        }),
                        (this.renderChildren = function (t) {
                          this.path(t),
                            r.Mouse.checkPath(this, t),
                            "" != t.fillStyle && ("inherit" != this.style("fill-rule").valueOrDefault("inherit") ? t.fill(this.style("fill-rule").value) : t.fill()),
                            "" != t.strokeStyle && t.stroke();
                          var e = this.getMarkers();
                          if (null != e) {
                            if (
                              (this.style("marker-start").isUrlDefinition() && (i = this.style("marker-start").getDefinition()).render(t, e[0][0], e[0][1]), this.style("marker-mid").isUrlDefinition())
                            )
                              for (var i = this.style("marker-mid").getDefinition(), n = 1; n < e.length - 1; n++) i.render(t, e[n][0], e[n][1]);
                            this.style("marker-end").isUrlDefinition() && (i = this.style("marker-end").getDefinition()).render(t, e[e.length - 1][0], e[e.length - 1][1]);
                          }
                        }),
                        (this.getBoundingBox = function () {
                          return this.path();
                        }),
                        (this.getMarkers = function () {
                          return null;
                        });
                    }),
                    (r.Element.PathElementBase.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.svg = function (t) {
                      (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.baseClearContext = this.clearContext),
                        (this.clearContext = function (t) {
                          this.baseClearContext(t), r.ViewPort.RemoveCurrent();
                        }),
                        (this.baseSetContext = this.setContext),
                        (this.setContext = function (t) {
                          if (
                            ((t.strokeStyle = "rgba(0,0,0,0)"), (t.lineCap = "butt"), (t.lineJoin = "miter"), (t.miterLimit = 4), t.canvas.style && void 0 !== t.font && void 0 !== n.getComputedStyle)
                          ) {
                            t.font = n.getComputedStyle(t.canvas).getPropertyValue("font");
                            var e = new r.Property("fontSize", r.Font.Parse(t.font).fontSize);
                            e.hasValue() && (r.rootEmSize = r.emSize = e.toPixels("y"));
                          }
                          this.baseSetContext(t),
                            this.attribute("x").hasValue() || (this.attribute("x", !0).value = 0),
                            this.attribute("y").hasValue() || (this.attribute("y", !0).value = 0),
                            t.translate(this.attribute("x").toPixels("x"), this.attribute("y").toPixels("y"));
                          var i = r.ViewPort.width(),
                            s = r.ViewPort.height();
                          if (
                            (this.attribute("width").hasValue() || (this.attribute("width", !0).value = "100%"),
                            this.attribute("height").hasValue() || (this.attribute("height", !0).value = "100%"),
                            void 0 === this.root)
                          ) {
                            (i = this.attribute("width").toPixels("x")), (s = this.attribute("height").toPixels("y"));
                            var a = 0,
                              o = 0;
                            this.attribute("refX").hasValue() && this.attribute("refY").hasValue() && ((a = -this.attribute("refX").toPixels("x")), (o = -this.attribute("refY").toPixels("y"))),
                              "visible" != this.attribute("overflow").valueOrDefault("hidden") &&
                                (t.beginPath(), t.moveTo(a, o), t.lineTo(i, o), t.lineTo(i, s), t.lineTo(a, s), t.closePath(), t.clip());
                          }
                          if ((r.ViewPort.SetCurrent(i, s), this.attribute("viewBox").hasValue())) {
                            var l = r.ToNumberArray(this.attribute("viewBox").value),
                              h = l[0],
                              u = l[1];
                            (i = l[2]),
                              (s = l[3]),
                              r.AspectRatio(
                                t,
                                this.attribute("preserveAspectRatio").value,
                                r.ViewPort.width(),
                                i,
                                r.ViewPort.height(),
                                s,
                                h,
                                u,
                                this.attribute("refX").value,
                                this.attribute("refY").value
                              ),
                              r.ViewPort.RemoveCurrent(),
                              r.ViewPort.SetCurrent(l[2], l[3]);
                          }
                        });
                    }),
                    (r.Element.svg.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.rect = function (t) {
                      (this.base = r.Element.PathElementBase),
                        this.base(t),
                        (this.path = function (t) {
                          var e = this.attribute("x").toPixels("x"),
                            i = this.attribute("y").toPixels("y"),
                            n = this.attribute("width").toPixels("x"),
                            s = this.attribute("height").toPixels("y"),
                            a = this.attribute("rx").toPixels("x"),
                            o = this.attribute("ry").toPixels("y");
                          if (
                            (this.attribute("rx").hasValue() && !this.attribute("ry").hasValue() && (o = a),
                            this.attribute("ry").hasValue() && !this.attribute("rx").hasValue() && (a = o),
                            (a = Math.min(a, n / 2)),
                            (o = Math.min(o, s / 2)),
                            null != t)
                          ) {
                            var l = ((Math.sqrt(2) - 1) / 3) * 4;
                            t.beginPath(),
                              t.moveTo(e + a, i),
                              t.lineTo(e + n - a, i),
                              t.bezierCurveTo(e + n - a + l * a, i, e + n, i + o - l * o, e + n, i + o),
                              t.lineTo(e + n, i + s - o),
                              t.bezierCurveTo(e + n, i + s - o + l * o, e + n - a + l * a, i + s, e + n - a, i + s),
                              t.lineTo(e + a, i + s),
                              t.bezierCurveTo(e + a - l * a, i + s, e, i + s - o + l * o, e, i + s - o),
                              t.lineTo(e, i + o),
                              t.bezierCurveTo(e, i + o - l * o, e + a - l * a, i, e + a, i),
                              t.closePath();
                          }
                          return new r.BoundingBox(e, i, e + n, i + s);
                        });
                    }),
                    (r.Element.rect.prototype = new r.Element.PathElementBase()),
                    (r.Element.circle = function (t) {
                      (this.base = r.Element.PathElementBase),
                        this.base(t),
                        (this.path = function (t) {
                          var e = this.attribute("cx").toPixels("x"),
                            i = this.attribute("cy").toPixels("y"),
                            n = this.attribute("r").toPixels();
                          return null != t && (t.beginPath(), t.arc(e, i, n, 0, 2 * Math.PI, !1), t.closePath()), new r.BoundingBox(e - n, i - n, e + n, i + n);
                        });
                    }),
                    (r.Element.circle.prototype = new r.Element.PathElementBase()),
                    (r.Element.ellipse = function (t) {
                      (this.base = r.Element.PathElementBase),
                        this.base(t),
                        (this.path = function (t) {
                          var e = ((Math.sqrt(2) - 1) / 3) * 4,
                            i = this.attribute("rx").toPixels("x"),
                            n = this.attribute("ry").toPixels("y"),
                            s = this.attribute("cx").toPixels("x"),
                            a = this.attribute("cy").toPixels("y");
                          return (
                            null != t &&
                              (t.beginPath(),
                              t.moveTo(s + i, a),
                              t.bezierCurveTo(s + i, a + e * n, s + e * i, a + n, s, a + n),
                              t.bezierCurveTo(s - e * i, a + n, s - i, a + e * n, s - i, a),
                              t.bezierCurveTo(s - i, a - e * n, s - e * i, a - n, s, a - n),
                              t.bezierCurveTo(s + e * i, a - n, s + i, a - e * n, s + i, a),
                              t.closePath()),
                            new r.BoundingBox(s - i, a - n, s + i, a + n)
                          );
                        });
                    }),
                    (r.Element.ellipse.prototype = new r.Element.PathElementBase()),
                    (r.Element.line = function (t) {
                      (this.base = r.Element.PathElementBase),
                        this.base(t),
                        (this.getPoints = function () {
                          return [
                            new r.Point(this.attribute("x1").toPixels("x"), this.attribute("y1").toPixels("y")),
                            new r.Point(this.attribute("x2").toPixels("x"), this.attribute("y2").toPixels("y")),
                          ];
                        }),
                        (this.path = function (t) {
                          var e = this.getPoints();
                          return null != t && (t.beginPath(), t.moveTo(e[0].x, e[0].y), t.lineTo(e[1].x, e[1].y)), new r.BoundingBox(e[0].x, e[0].y, e[1].x, e[1].y);
                        }),
                        (this.getMarkers = function () {
                          var t = this.getPoints(),
                            e = t[0].angleTo(t[1]);
                          return [
                            [t[0], e],
                            [t[1], e],
                          ];
                        });
                    }),
                    (r.Element.line.prototype = new r.Element.PathElementBase()),
                    (r.Element.polyline = function (t) {
                      (this.base = r.Element.PathElementBase),
                        this.base(t),
                        (this.points = r.CreatePath(this.attribute("points").value)),
                        (this.path = function (t) {
                          var e = new r.BoundingBox(this.points[0].x, this.points[0].y);
                          null != t && (t.beginPath(), t.moveTo(this.points[0].x, this.points[0].y));
                          for (var i = 1; i < this.points.length; i++) e.addPoint(this.points[i].x, this.points[i].y), null != t && t.lineTo(this.points[i].x, this.points[i].y);
                          return e;
                        }),
                        (this.getMarkers = function () {
                          for (var t = [], e = 0; e < this.points.length - 1; e++) t.push([this.points[e], this.points[e].angleTo(this.points[e + 1])]);
                          return 0 < t.length && t.push([this.points[this.points.length - 1], t[t.length - 1][1]]), t;
                        });
                    }),
                    (r.Element.polyline.prototype = new r.Element.PathElementBase()),
                    (r.Element.polygon = function (t) {
                      (this.base = r.Element.polyline),
                        this.base(t),
                        (this.basePath = this.path),
                        (this.path = function (t) {
                          var e = this.basePath(t);
                          return null != t && (t.lineTo(this.points[0].x, this.points[0].y), t.closePath()), e;
                        });
                    }),
                    (r.Element.polygon.prototype = new r.Element.polyline()),
                    (r.Element.path = function (t) {
                      (this.base = r.Element.PathElementBase), this.base(t);
                      var e = this.attribute("d").value;
                      e = e.replace(/,/gm, " ");
                      for (var i = 0; i < 2; i++) e = e.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, "$1 $2");
                      for (e = (e = e.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, "$1 $2")).replace(/([0-9])([+\-])/gm, "$1 $2"), i = 0; i < 2; i++) e = e.replace(/(\.[0-9]*)(\.)/gm, "$1 $2");
                      (e = e.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, "$1 $3 $4 ")),
                        (e = r.compressSpaces(e)),
                        (e = r.trim(e)),
                        (this.PathParser = new (function (t) {
                          (this.tokens = t.split(" ")),
                            (this.reset = function () {
                              (this.i = -1),
                                (this.command = ""),
                                (this.previousCommand = ""),
                                (this.start = new r.Point(0, 0)),
                                (this.control = new r.Point(0, 0)),
                                (this.current = new r.Point(0, 0)),
                                (this.points = []),
                                (this.angles = []);
                            }),
                            (this.isEnd = function () {
                              return this.i >= this.tokens.length - 1;
                            }),
                            (this.isCommandOrEnd = function () {
                              return !!this.isEnd() || null != this.tokens[this.i + 1].match(/^[A-Za-z]$/);
                            }),
                            (this.isRelativeCommand = function () {
                              switch (this.command) {
                                case "m":
                                case "l":
                                case "h":
                                case "v":
                                case "c":
                                case "s":
                                case "q":
                                case "t":
                                case "a":
                                case "z":
                                  return !0;
                              }
                              return !1;
                            }),
                            (this.getToken = function () {
                              return this.i++, this.tokens[this.i];
                            }),
                            (this.getScalar = function () {
                              return parseFloat(this.getToken());
                            }),
                            (this.nextCommand = function () {
                              (this.previousCommand = this.command), (this.command = this.getToken());
                            }),
                            (this.getPoint = function () {
                              var t = new r.Point(this.getScalar(), this.getScalar());
                              return this.makeAbsolute(t);
                            }),
                            (this.getAsControlPoint = function () {
                              var t = this.getPoint();
                              return (this.control = t);
                            }),
                            (this.getAsCurrentPoint = function () {
                              var t = this.getPoint();
                              return (this.current = t);
                            }),
                            (this.getReflectedControlPoint = function () {
                              return "c" != this.previousCommand.toLowerCase() &&
                                "s" != this.previousCommand.toLowerCase() &&
                                "q" != this.previousCommand.toLowerCase() &&
                                "t" != this.previousCommand.toLowerCase()
                                ? this.current
                                : new r.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
                            }),
                            (this.makeAbsolute = function (t) {
                              return this.isRelativeCommand() && ((t.x += this.current.x), (t.y += this.current.y)), t;
                            }),
                            (this.addMarker = function (t, e, i) {
                              null != i &&
                                0 < this.angles.length &&
                                null == this.angles[this.angles.length - 1] &&
                                (this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(i)),
                                this.addMarkerAngle(t, null == e ? null : e.angleTo(t));
                            }),
                            (this.addMarkerAngle = function (t, e) {
                              this.points.push(t), this.angles.push(e);
                            }),
                            (this.getMarkerPoints = function () {
                              return this.points;
                            }),
                            (this.getMarkerAngles = function () {
                              for (var t = 0; t < this.angles.length; t++)
                                if (null == this.angles[t])
                                  for (var e = t + 1; e < this.angles.length; e++)
                                    if (null != this.angles[e]) {
                                      this.angles[t] = this.angles[e];
                                      break;
                                    }
                              return this.angles;
                            });
                        })(e)),
                        (this.path = function (t) {
                          var e = this.PathParser;
                          e.reset();
                          var i = new r.BoundingBox();
                          for (null != t && t.beginPath(); !e.isEnd(); )
                            switch ((e.nextCommand(), e.command)) {
                              case "M":
                              case "m":
                                var n = e.getAsCurrentPoint();
                                for (e.addMarker(n), i.addPoint(n.x, n.y), null != t && t.moveTo(n.x, n.y), e.start = e.current; !e.isCommandOrEnd(); )
                                  (n = e.getAsCurrentPoint()), e.addMarker(n, e.start), i.addPoint(n.x, n.y), null != t && t.lineTo(n.x, n.y);
                                break;
                              case "L":
                              case "l":
                                for (; !e.isCommandOrEnd(); ) {
                                  var s = e.current;
                                  (n = e.getAsCurrentPoint()), e.addMarker(n, s), i.addPoint(n.x, n.y), null != t && t.lineTo(n.x, n.y);
                                }
                                break;
                              case "H":
                              case "h":
                                for (; !e.isCommandOrEnd(); ) {
                                  var a = new r.Point((e.isRelativeCommand() ? e.current.x : 0) + e.getScalar(), e.current.y);
                                  e.addMarker(a, e.current), (e.current = a), i.addPoint(e.current.x, e.current.y), null != t && t.lineTo(e.current.x, e.current.y);
                                }
                                break;
                              case "V":
                              case "v":
                                for (; !e.isCommandOrEnd(); )
                                  (a = new r.Point(e.current.x, (e.isRelativeCommand() ? e.current.y : 0) + e.getScalar())),
                                    e.addMarker(a, e.current),
                                    (e.current = a),
                                    i.addPoint(e.current.x, e.current.y),
                                    null != t && t.lineTo(e.current.x, e.current.y);
                                break;
                              case "C":
                              case "c":
                                for (; !e.isCommandOrEnd(); ) {
                                  var o = e.current,
                                    l = e.getPoint(),
                                    h = e.getAsControlPoint(),
                                    u = e.getAsCurrentPoint();
                                  e.addMarker(u, h, l), i.addBezierCurve(o.x, o.y, l.x, l.y, h.x, h.y, u.x, u.y), null != t && t.bezierCurveTo(l.x, l.y, h.x, h.y, u.x, u.y);
                                }
                                break;
                              case "S":
                              case "s":
                                for (; !e.isCommandOrEnd(); )
                                  (o = e.current),
                                    (l = e.getReflectedControlPoint()),
                                    (h = e.getAsControlPoint()),
                                    (u = e.getAsCurrentPoint()),
                                    e.addMarker(u, h, l),
                                    i.addBezierCurve(o.x, o.y, l.x, l.y, h.x, h.y, u.x, u.y),
                                    null != t && t.bezierCurveTo(l.x, l.y, h.x, h.y, u.x, u.y);
                                break;
                              case "Q":
                              case "q":
                                for (; !e.isCommandOrEnd(); )
                                  (o = e.current),
                                    (h = e.getAsControlPoint()),
                                    (u = e.getAsCurrentPoint()),
                                    e.addMarker(u, h, h),
                                    i.addQuadraticCurve(o.x, o.y, h.x, h.y, u.x, u.y),
                                    null != t && t.quadraticCurveTo(h.x, h.y, u.x, u.y);
                                break;
                              case "T":
                              case "t":
                                for (; !e.isCommandOrEnd(); )
                                  (o = e.current),
                                    (h = e.getReflectedControlPoint()),
                                    (e.control = h),
                                    (u = e.getAsCurrentPoint()),
                                    e.addMarker(u, h, h),
                                    i.addQuadraticCurve(o.x, o.y, h.x, h.y, u.x, u.y),
                                    null != t && t.quadraticCurveTo(h.x, h.y, u.x, u.y);
                                break;
                              case "A":
                              case "a":
                                for (; !e.isCommandOrEnd(); ) {
                                  o = e.current;
                                  var f = e.getScalar(),
                                    c = e.getScalar(),
                                    d = e.getScalar() * (Math.PI / 180),
                                    m = e.getScalar(),
                                    p = e.getScalar(),
                                    y =
                                      ((u = e.getAsCurrentPoint()),
                                      new r.Point((Math.cos(d) * (o.x - u.x)) / 2 + (Math.sin(d) * (o.y - u.y)) / 2, (-Math.sin(d) * (o.x - u.x)) / 2 + (Math.cos(d) * (o.y - u.y)) / 2)),
                                    g = Math.pow(y.x, 2) / Math.pow(f, 2) + Math.pow(y.y, 2) / Math.pow(c, 2);
                                  1 < g && ((f *= Math.sqrt(g)), (c *= Math.sqrt(g)));
                                  var v =
                                    (m == p ? -1 : 1) *
                                    Math.sqrt(
                                      (Math.pow(f, 2) * Math.pow(c, 2) - Math.pow(f, 2) * Math.pow(y.y, 2) - Math.pow(c, 2) * Math.pow(y.x, 2)) /
                                        (Math.pow(f, 2) * Math.pow(y.y, 2) + Math.pow(c, 2) * Math.pow(y.x, 2))
                                    );
                                  isNaN(v) && (v = 0);
                                  var b = new r.Point((v * f * y.y) / c, (v * -c * y.x) / f),
                                    x = new r.Point((o.x + u.x) / 2 + Math.cos(d) * b.x - Math.sin(d) * b.y, (o.y + u.y) / 2 + Math.sin(d) * b.x + Math.cos(d) * b.y),
                                    E = function (t) {
                                      return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2));
                                    },
                                    w = function (t, e) {
                                      return (t[0] * e[0] + t[1] * e[1]) / (E(t) * E(e));
                                    },
                                    P = function (t, e) {
                                      return (t[0] * e[1] < t[1] * e[0] ? -1 : 1) * Math.acos(w(t, e));
                                    },
                                    B = P([1, 0], [(y.x - b.x) / f, (y.y - b.y) / c]),
                                    C = [(y.x - b.x) / f, (y.y - b.y) / c],
                                    T = [(-y.x - b.x) / f, (-y.y - b.y) / c],
                                    V = P(C, T);
                                  w(C, T) <= -1 && (V = Math.PI), 1 <= w(C, T) && (V = 0);
                                  var M = 1 - p ? 1 : -1,
                                    k = B + M * (V / 2),
                                    S = new r.Point(x.x + f * Math.cos(k), x.y + c * Math.sin(k));
                                  if ((e.addMarkerAngle(S, k - (M * Math.PI) / 2), e.addMarkerAngle(u, k - M * Math.PI), i.addPoint(u.x, u.y), null != t)) {
                                    w = c < f ? f : c;
                                    var A = c < f ? 1 : f / c,
                                      D = c < f ? c / f : 1;
                                    t.translate(x.x, x.y), t.rotate(d), t.scale(A, D), t.arc(0, 0, w, B, B + V, 1 - p), t.scale(1 / A, 1 / D), t.rotate(-d), t.translate(-x.x, -x.y);
                                  }
                                }
                                break;
                              case "Z":
                              case "z":
                                null != t && i.x1 !== i.x2 && i.y1 !== i.y2 && t.closePath(), (e.current = e.start);
                            }
                          return i;
                        }),
                        (this.getMarkers = function () {
                          for (var t = this.PathParser.getMarkerPoints(), e = this.PathParser.getMarkerAngles(), i = [], n = 0; n < t.length; n++) i.push([t[n], e[n]]);
                          return i;
                        });
                    }),
                    (r.Element.path.prototype = new r.Element.PathElementBase()),
                    (r.Element.pattern = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.createPattern = function (t, e) {
                          var i = this.attribute("width").toPixels("x", !0),
                            n = this.attribute("height").toPixels("y", !0),
                            a = new r.Element.svg();
                          (a.attributes.viewBox = new r.Property("viewBox", this.attribute("viewBox").value)),
                            (a.attributes.width = new r.Property("width", i + "px")),
                            (a.attributes.height = new r.Property("height", n + "px")),
                            (a.attributes.transform = new r.Property("transform", this.attribute("patternTransform").value)),
                            (a.children = this.children);
                          var o = s();
                          (o.width = i), (o.height = n);
                          var l = o.getContext("2d");
                          this.attribute("x").hasValue() && this.attribute("y").hasValue() && l.translate(this.attribute("x").toPixels("x", !0), this.attribute("y").toPixels("y", !0));
                          for (var h = -1; h <= 1; h++)
                            for (var u = -1; u <= 1; u++) l.save(), (a.attributes.x = new r.Property("x", h * o.width)), (a.attributes.y = new r.Property("y", u * o.height)), a.render(l), l.restore();
                          return t.createPattern(o, "repeat");
                        });
                    }),
                    (r.Element.pattern.prototype = new r.Element.ElementBase()),
                    (r.Element.marker = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.baseRender = this.render),
                        (this.render = function (t, e, i) {
                          if (e) {
                            t.translate(e.x, e.y),
                              "auto" == this.attribute("orient").valueOrDefault("auto") && t.rotate(i),
                              "strokeWidth" == this.attribute("markerUnits").valueOrDefault("strokeWidth") && t.scale(t.lineWidth, t.lineWidth),
                              t.save();
                            var n = new r.Element.svg();
                            (n.attributes.viewBox = new r.Property("viewBox", this.attribute("viewBox").value)),
                              (n.attributes.refX = new r.Property("refX", this.attribute("refX").value)),
                              (n.attributes.refY = new r.Property("refY", this.attribute("refY").value)),
                              (n.attributes.width = new r.Property("width", this.attribute("markerWidth").value)),
                              (n.attributes.height = new r.Property("height", this.attribute("markerHeight").value)),
                              (n.attributes.fill = new r.Property("fill", this.attribute("fill").valueOrDefault("black"))),
                              (n.attributes.stroke = new r.Property("stroke", this.attribute("stroke").valueOrDefault("none"))),
                              (n.children = this.children),
                              n.render(t),
                              t.restore(),
                              "strokeWidth" == this.attribute("markerUnits").valueOrDefault("strokeWidth") && t.scale(1 / t.lineWidth, 1 / t.lineWidth),
                              "auto" == this.attribute("orient").valueOrDefault("auto") && t.rotate(-i),
                              t.translate(-e.x, -e.y);
                          }
                        });
                    }),
                    (r.Element.marker.prototype = new r.Element.ElementBase()),
                    (r.Element.defs = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t), (this.render = function (t) {});
                    }),
                    (r.Element.defs.prototype = new r.Element.ElementBase()),
                    (r.Element.GradientBase = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t), (this.stops = []);
                      for (var e = 0; e < this.children.length; e++) {
                        var i = this.children[e];
                        "stop" == i.type && this.stops.push(i);
                      }
                      (this.getGradient = function () {}),
                        (this.gradientUnits = function () {
                          return this.attribute("gradientUnits").valueOrDefault("objectBoundingBox");
                        }),
                        (this.attributesToInherit = ["gradientUnits"]),
                        (this.inheritStopContainer = function (t) {
                          for (var e = 0; e < this.attributesToInherit.length; e++) {
                            var i = this.attributesToInherit[e];
                            !this.attribute(i).hasValue() && t.attribute(i).hasValue() && (this.attribute(i, !0).value = t.attribute(i).value);
                          }
                        }),
                        (this.createGradient = function (t, e, i) {
                          var n = this;
                          this.getHrefAttribute().hasValue() && ((n = this.getHrefAttribute().getDefinition()), this.inheritStopContainer(n));
                          var a = function (t) {
                              return i.hasValue() ? new r.Property("color", t).addOpacity(i).value : t;
                            },
                            o = this.getGradient(t, e);
                          if (null == o) return a(n.stops[n.stops.length - 1].color);
                          for (var l = 0; l < n.stops.length; l++) o.addColorStop(n.stops[l].offset, a(n.stops[l].color));
                          if (this.attribute("gradientTransform").hasValue()) {
                            var h = r.ViewPort.viewPorts[0],
                              u = new r.Element.rect();
                            (u.attributes.x = new r.Property("x", -r.MAX_VIRTUAL_PIXELS / 3)),
                              (u.attributes.y = new r.Property("y", -r.MAX_VIRTUAL_PIXELS / 3)),
                              (u.attributes.width = new r.Property("width", r.MAX_VIRTUAL_PIXELS)),
                              (u.attributes.height = new r.Property("height", r.MAX_VIRTUAL_PIXELS));
                            var f = new r.Element.g();
                            (f.attributes.transform = new r.Property("transform", this.attribute("gradientTransform").value)), (f.children = [u]);
                            var c = new r.Element.svg();
                            (c.attributes.x = new r.Property("x", 0)),
                              (c.attributes.y = new r.Property("y", 0)),
                              (c.attributes.width = new r.Property("width", h.width)),
                              (c.attributes.height = new r.Property("height", h.height)),
                              (c.children = [f]);
                            var d = s();
                            (d.width = h.width), (d.height = h.height);
                            var m = d.getContext("2d");
                            return (m.fillStyle = o), c.render(m), m.createPattern(d, "no-repeat");
                          }
                          return o;
                        });
                    }),
                    (r.Element.GradientBase.prototype = new r.Element.ElementBase()),
                    (r.Element.linearGradient = function (t) {
                      (this.base = r.Element.GradientBase),
                        this.base(t),
                        this.attributesToInherit.push("x1"),
                        this.attributesToInherit.push("y1"),
                        this.attributesToInherit.push("x2"),
                        this.attributesToInherit.push("y2"),
                        (this.getGradient = function (t, e) {
                          var i = "objectBoundingBox" == this.gradientUnits() ? e.getBoundingBox(t) : null;
                          this.attribute("x1").hasValue() ||
                            this.attribute("y1").hasValue() ||
                            this.attribute("x2").hasValue() ||
                            this.attribute("y2").hasValue() ||
                            ((this.attribute("x1", !0).value = 0), (this.attribute("y1", !0).value = 0), (this.attribute("x2", !0).value = 1), (this.attribute("y2", !0).value = 0));
                          var n = "objectBoundingBox" == this.gradientUnits() ? i.x() + i.width() * this.attribute("x1").numValue() : this.attribute("x1").toPixels("x"),
                            s = "objectBoundingBox" == this.gradientUnits() ? i.y() + i.height() * this.attribute("y1").numValue() : this.attribute("y1").toPixels("y"),
                            a = "objectBoundingBox" == this.gradientUnits() ? i.x() + i.width() * this.attribute("x2").numValue() : this.attribute("x2").toPixels("x"),
                            r = "objectBoundingBox" == this.gradientUnits() ? i.y() + i.height() * this.attribute("y2").numValue() : this.attribute("y2").toPixels("y");
                          return n == a && s == r ? null : t.createLinearGradient(n, s, a, r);
                        });
                    }),
                    (r.Element.linearGradient.prototype = new r.Element.GradientBase()),
                    (r.Element.radialGradient = function (t) {
                      (this.base = r.Element.GradientBase),
                        this.base(t),
                        this.attributesToInherit.push("cx"),
                        this.attributesToInherit.push("cy"),
                        this.attributesToInherit.push("r"),
                        this.attributesToInherit.push("fx"),
                        this.attributesToInherit.push("fy"),
                        (this.getGradient = function (t, e) {
                          var i = e.getBoundingBox(t);
                          this.attribute("cx").hasValue() || (this.attribute("cx", !0).value = "50%"),
                            this.attribute("cy").hasValue() || (this.attribute("cy", !0).value = "50%"),
                            this.attribute("r").hasValue() || (this.attribute("r", !0).value = "50%");
                          var n = "objectBoundingBox" == this.gradientUnits() ? i.x() + i.width() * this.attribute("cx").numValue() : this.attribute("cx").toPixels("x"),
                            s = "objectBoundingBox" == this.gradientUnits() ? i.y() + i.height() * this.attribute("cy").numValue() : this.attribute("cy").toPixels("y"),
                            a = n,
                            r = s;
                          this.attribute("fx").hasValue() &&
                            (a = "objectBoundingBox" == this.gradientUnits() ? i.x() + i.width() * this.attribute("fx").numValue() : this.attribute("fx").toPixels("x")),
                            this.attribute("fy").hasValue() &&
                              (r = "objectBoundingBox" == this.gradientUnits() ? i.y() + i.height() * this.attribute("fy").numValue() : this.attribute("fy").toPixels("y"));
                          var o = "objectBoundingBox" == this.gradientUnits() ? ((i.width() + i.height()) / 2) * this.attribute("r").numValue() : this.attribute("r").toPixels();
                          return t.createRadialGradient(a, r, 0, n, s, o);
                        });
                    }),
                    (r.Element.radialGradient.prototype = new r.Element.GradientBase()),
                    (r.Element.stop = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.offset = this.attribute("offset").numValue()),
                        this.offset < 0 && (this.offset = 0),
                        1 < this.offset && (this.offset = 1);
                      var e = this.style("stop-color", !0);
                      "" === e.value && (e.value = "#000"), this.style("stop-opacity").hasValue() && (e = e.addOpacity(this.style("stop-opacity"))), (this.color = e.value);
                    }),
                    (r.Element.stop.prototype = new r.Element.ElementBase()),
                    (r.Element.AnimateBase = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        r.Animations.push(this),
                        (this.duration = 0),
                        (this.begin = this.attribute("begin").toMilliseconds()),
                        (this.maxDuration = this.begin + this.attribute("dur").toMilliseconds()),
                        (this.getProperty = function () {
                          var t = this.attribute("attributeType").value,
                            e = this.attribute("attributeName").value;
                          return "CSS" == t ? this.parent.style(e, !0) : this.parent.attribute(e, !0);
                        }),
                        (this.initialValue = null),
                        (this.initialUnits = ""),
                        (this.removed = !1),
                        (this.calcValue = function () {
                          return "";
                        }),
                        (this.update = function (t) {
                          if ((null == this.initialValue && ((this.initialValue = this.getProperty().value), (this.initialUnits = this.getProperty().getUnits())), this.duration > this.maxDuration)) {
                            if ("indefinite" == this.attribute("repeatCount").value || "indefinite" == this.attribute("repeatDur").value) this.duration = 0;
                            else if ("freeze" != this.attribute("fill").valueOrDefault("remove") || this.frozen) {
                              if ("remove" == this.attribute("fill").valueOrDefault("remove") && !this.removed)
                                return (this.removed = !0), (this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue), !0;
                            } else (this.frozen = !0), (this.parent.animationFrozen = !0), (this.parent.animationFrozenValue = this.getProperty().value);
                            return !1;
                          }
                          this.duration = this.duration + t;
                          var e = !1;
                          if (this.begin < this.duration) {
                            var i = this.calcValue();
                            this.attribute("type").hasValue() && (i = this.attribute("type").value + "(" + i + ")"), (this.getProperty().value = i), (e = !0);
                          }
                          return e;
                        }),
                        (this.from = this.attribute("from")),
                        (this.to = this.attribute("to")),
                        (this.values = this.attribute("values")),
                        this.values.hasValue() && (this.values.value = this.values.value.split(";")),
                        (this.progress = function () {
                          var t = { progress: (this.duration - this.begin) / (this.maxDuration - this.begin) };
                          if (this.values.hasValue()) {
                            var e = t.progress * (this.values.value.length - 1),
                              i = Math.floor(e),
                              n = Math.ceil(e);
                            (t.from = new r.Property("from", parseFloat(this.values.value[i]))), (t.to = new r.Property("to", parseFloat(this.values.value[n]))), (t.progress = (e - i) / (n - i));
                          } else (t.from = this.from), (t.to = this.to);
                          return t;
                        });
                    }),
                    (r.Element.AnimateBase.prototype = new r.Element.ElementBase()),
                    (r.Element.animate = function (t) {
                      (this.base = r.Element.AnimateBase),
                        this.base(t),
                        (this.calcValue = function () {
                          var t = this.progress();
                          return t.from.numValue() + (t.to.numValue() - t.from.numValue()) * t.progress + this.initialUnits;
                        });
                    }),
                    (r.Element.animate.prototype = new r.Element.AnimateBase()),
                    (r.Element.animateColor = function (e) {
                      (this.base = r.Element.AnimateBase),
                        this.base(e),
                        (this.calcValue = function () {
                          var e = this.progress(),
                            i = new t(e.from.value),
                            n = new t(e.to.value);
                          if (i.ok && n.ok) {
                            var s = i.r + (n.r - i.r) * e.progress,
                              a = i.g + (n.g - i.g) * e.progress,
                              r = i.b + (n.b - i.b) * e.progress;
                            return "rgb(" + parseInt(s, 10) + "," + parseInt(a, 10) + "," + parseInt(r, 10) + ")";
                          }
                          return this.attribute("from").value;
                        });
                    }),
                    (r.Element.animateColor.prototype = new r.Element.AnimateBase()),
                    (r.Element.animateTransform = function (t) {
                      (this.base = r.Element.AnimateBase),
                        this.base(t),
                        (this.calcValue = function () {
                          for (var t = this.progress(), e = r.ToNumberArray(t.from.value), i = r.ToNumberArray(t.to.value), n = "", s = 0; s < e.length; s++)
                            n += e[s] + (i[s] - e[s]) * t.progress + " ";
                          return n;
                        });
                    }),
                    (r.Element.animateTransform.prototype = new r.Element.animate()),
                    (r.Element.font = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.horizAdvX = this.attribute("horiz-adv-x").numValue()),
                        (this.isRTL = !1),
                        (this.isArabic = !1),
                        (this.fontFace = null),
                        (this.missingGlyph = null),
                        (this.glyphs = []);
                      for (var e = 0; e < this.children.length; e++) {
                        var i = this.children[e];
                        "font-face" == i.type
                          ? (this.fontFace = i).style("font-family").hasValue() && (r.Definitions[i.style("font-family").value] = this)
                          : "missing-glyph" == i.type
                          ? (this.missingGlyph = i)
                          : "glyph" == i.type &&
                            ("" != i.arabicForm
                              ? ((this.isRTL = !0), (this.isArabic = !0), void 0 === this.glyphs[i.unicode] && (this.glyphs[i.unicode] = []), (this.glyphs[i.unicode][i.arabicForm] = i))
                              : (this.glyphs[i.unicode] = i));
                      }
                    }),
                    (r.Element.font.prototype = new r.Element.ElementBase()),
                    (r.Element.fontface = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.ascent = this.attribute("ascent").value),
                        (this.descent = this.attribute("descent").value),
                        (this.unitsPerEm = this.attribute("units-per-em").numValue());
                    }),
                    (r.Element.fontface.prototype = new r.Element.ElementBase()),
                    (r.Element.missingglyph = function (t) {
                      (this.base = r.Element.path), this.base(t), (this.horizAdvX = 0);
                    }),
                    (r.Element.missingglyph.prototype = new r.Element.path()),
                    (r.Element.glyph = function (t) {
                      (this.base = r.Element.path),
                        this.base(t),
                        (this.horizAdvX = this.attribute("horiz-adv-x").numValue()),
                        (this.unicode = this.attribute("unicode").value),
                        (this.arabicForm = this.attribute("arabic-form").value);
                    }),
                    (r.Element.glyph.prototype = new r.Element.path()),
                    (r.Element.text = function (t) {
                      (this.captureTextNodes = !0),
                        (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.baseSetContext = this.setContext),
                        (this.setContext = function (t) {
                          this.baseSetContext(t);
                          var e = this.style("dominant-baseline").toTextBaseline();
                          null == e && (e = this.style("alignment-baseline").toTextBaseline()), null != e && (t.textBaseline = e);
                        }),
                        (this.initializeCoordinates = function (t) {
                          (this.x = this.attribute("x").toPixels("x")),
                            (this.y = this.attribute("y").toPixels("y")),
                            this.attribute("dx").hasValue() && (this.x += this.attribute("dx").toPixels("x")),
                            this.attribute("dy").hasValue() && (this.y += this.attribute("dy").toPixels("y")),
                            (this.x += this.getAnchorDelta(t, this, 0));
                        }),
                        (this.getBoundingBox = function (t) {
                          this.initializeCoordinates(t);
                          for (var e = null, i = 0; i < this.children.length; i++) {
                            var n = this.getChildBoundingBox(t, this, this, i);
                            null == e ? (e = n) : e.addBoundingBox(n);
                          }
                          return e;
                        }),
                        (this.renderChildren = function (t) {
                          this.initializeCoordinates(t);
                          for (var e = 0; e < this.children.length; e++) this.renderChild(t, this, this, e);
                        }),
                        (this.getAnchorDelta = function (t, e, i) {
                          var n = this.style("text-anchor").valueOrDefault("start");
                          if ("start" != n) {
                            for (var s = 0, a = i; a < e.children.length; a++) {
                              var r = e.children[a];
                              if (i < a && r.attribute("x").hasValue()) break;
                              s += r.measureTextRecursive(t);
                            }
                            return -1 * ("end" == n ? s : s / 2);
                          }
                          return 0;
                        }),
                        (this.adjustChildCoordinates = function (t, e, i, n) {
                          var s = i.children[n];
                          return (
                            s.attribute("x").hasValue()
                              ? ((s.x = s.attribute("x").toPixels("x") + e.getAnchorDelta(t, i, n)), s.attribute("dx").hasValue() && (s.x += s.attribute("dx").toPixels("x")))
                              : (s.attribute("dx").hasValue() && (e.x += s.attribute("dx").toPixels("x")), (s.x = e.x)),
                            (e.x = s.x + s.measureText(t)),
                            s.attribute("y").hasValue()
                              ? ((s.y = s.attribute("y").toPixels("y")), s.attribute("dy").hasValue() && (s.y += s.attribute("dy").toPixels("y")))
                              : (s.attribute("dy").hasValue() && (e.y += s.attribute("dy").toPixels("y")), (s.y = e.y)),
                            (e.y = s.y),
                            s
                          );
                        }),
                        (this.getChildBoundingBox = function (t, e, i, n) {
                          var s = this.adjustChildCoordinates(t, e, i, n),
                            a = s.getBoundingBox(t);
                          for (n = 0; n < s.children.length; n++) {
                            var r = e.getChildBoundingBox(t, e, s, n);
                            a.addBoundingBox(r);
                          }
                          return a;
                        }),
                        (this.renderChild = function (t, e, i, n) {
                          var s = this.adjustChildCoordinates(t, e, i, n);
                          for (s.render(t), n = 0; n < s.children.length; n++) e.renderChild(t, e, s, n);
                        });
                    }),
                    (r.Element.text.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.TextElementBase = function (t) {
                      (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.getGlyph = function (t, e, i) {
                          var n = e[i],
                            s = null;
                          if (t.isArabic) {
                            var a = "isolated";
                            (0 == i || " " == e[i - 1]) && i < e.length - 2 && " " != e[i + 1] && (a = "terminal"),
                              0 < i && " " != e[i - 1] && i < e.length - 2 && " " != e[i + 1] && (a = "medial"),
                              0 < i && " " != e[i - 1] && (i == e.length - 1 || " " == e[i + 1]) && (a = "initial"),
                              void 0 !== t.glyphs[n] && null == (s = t.glyphs[n][a]) && "glyph" == t.glyphs[n].type && (s = t.glyphs[n]);
                          } else s = t.glyphs[n];
                          return null == s && (s = t.missingGlyph), s;
                        }),
                        (this.renderChildren = function (t) {
                          var e = this.parent.style("font-family").getDefinition();
                          if (null == e)
                            "stroke" == t.paintOrder
                              ? ("" != t.strokeStyle && t.strokeText(r.compressSpaces(this.getText()), this.x, this.y),
                                "" != t.fillStyle && t.fillText(r.compressSpaces(this.getText()), this.x, this.y))
                              : ("" != t.fillStyle && t.fillText(r.compressSpaces(this.getText()), this.x, this.y),
                                "" != t.strokeStyle && t.strokeText(r.compressSpaces(this.getText()), this.x, this.y));
                          else {
                            var i = this.parent.style("font-size").numValueOrDefault(r.Font.Parse(r.ctx.font).fontSize),
                              n = this.parent.style("font-style").valueOrDefault(r.Font.Parse(r.ctx.font).fontStyle),
                              s = this.getText();
                            e.isRTL && (s = s.split("").reverse().join(""));
                            for (var a = r.ToNumberArray(this.parent.attribute("dx").value), o = 0; o < s.length; o++) {
                              var l = this.getGlyph(e, s, o),
                                h = i / e.fontFace.unitsPerEm;
                              t.translate(this.x, this.y), t.scale(h, -h);
                              var u = t.lineWidth;
                              (t.lineWidth = (t.lineWidth * e.fontFace.unitsPerEm) / i),
                                "italic" == n && t.transform(1, 0, 0.4, 1, 0, 0),
                                l.render(t),
                                "italic" == n && t.transform(1, 0, -0.4, 1, 0, 0),
                                (t.lineWidth = u),
                                t.scale(1 / h, -1 / h),
                                t.translate(-this.x, -this.y),
                                (this.x += (i * (l.horizAdvX || e.horizAdvX)) / e.fontFace.unitsPerEm),
                                void 0 === a[o] || isNaN(a[o]) || (this.x += a[o]);
                            }
                          }
                        }),
                        (this.getText = function () {}),
                        (this.measureTextRecursive = function (t) {
                          for (var e = this.measureText(t), i = 0; i < this.children.length; i++) e += this.children[i].measureTextRecursive(t);
                          return e;
                        }),
                        (this.measureText = function (t) {
                          var e = this.parent.style("font-family").getDefinition();
                          if (null != e) {
                            var i = this.parent.style("font-size").numValueOrDefault(r.Font.Parse(r.ctx.font).fontSize),
                              n = 0,
                              s = this.getText();
                            e.isRTL && (s = s.split("").reverse().join(""));
                            for (var a = r.ToNumberArray(this.parent.attribute("dx").value), o = 0; o < s.length; o++)
                              (n += ((this.getGlyph(e, s, o).horizAdvX || e.horizAdvX) * i) / e.fontFace.unitsPerEm), void 0 === a[o] || isNaN(a[o]) || (n += a[o]);
                            return n;
                          }
                          var l = r.compressSpaces(this.getText());
                          if (!t.measureText) return 10 * l.length;
                          t.save(), this.setContext(t, !0);
                          var h = t.measureText(l).width;
                          return t.restore(), h;
                        }),
                        (this.getBoundingBox = function (t) {
                          var e = this.parent.style("font-size").numValueOrDefault(r.Font.Parse(r.ctx.font).fontSize);
                          return new r.BoundingBox(this.x, this.y - e, this.x + this.measureText(t), this.y);
                        });
                    }),
                    (r.Element.TextElementBase.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.tspan = function (t) {
                      (this.captureTextNodes = !0),
                        (this.base = r.Element.TextElementBase),
                        this.base(t),
                        (this.text = r.compressSpaces(t.value || t.text || t.textContent || "")),
                        (this.getText = function () {
                          return 0 < this.children.length ? "" : this.text;
                        });
                    }),
                    (r.Element.tspan.prototype = new r.Element.TextElementBase()),
                    (r.Element.tref = function (t) {
                      (this.base = r.Element.TextElementBase),
                        this.base(t),
                        (this.getText = function () {
                          var t = this.getHrefAttribute().getDefinition();
                          if (null != t) return t.children[0].getText();
                        });
                    }),
                    (r.Element.tref.prototype = new r.Element.TextElementBase()),
                    (r.Element.a = function (t) {
                      (this.base = r.Element.TextElementBase), this.base(t), (this.hasText = 0 < t.childNodes.length);
                      for (var e = 0; e < t.childNodes.length; e++) 3 != t.childNodes[e].nodeType && (this.hasText = !1);
                      (this.text = this.hasText ? t.childNodes[0].value || t.childNodes[0].data : ""),
                        (this.getText = function () {
                          return this.text;
                        }),
                        (this.baseRenderChildren = this.renderChildren),
                        (this.renderChildren = function (t) {
                          if (this.hasText) {
                            this.baseRenderChildren(t);
                            var e = new r.Property("fontSize", r.Font.Parse(r.ctx.font).fontSize);
                            r.Mouse.checkBoundingBox(this, new r.BoundingBox(this.x, this.y - e.toPixels("y"), this.x + this.measureText(t), this.y));
                          } else if (0 < this.children.length) {
                            var i = new r.Element.g();
                            (i.children = this.children), (i.parent = this), i.render(t);
                          }
                        }),
                        (this.onclick = function () {
                          n.open(this.getHrefAttribute().value);
                        }),
                        (this.onmousemove = function () {
                          r.ctx.canvas.style.cursor = "pointer";
                        });
                    }),
                    (r.Element.a.prototype = new r.Element.TextElementBase()),
                    (r.Element.image = function (t) {
                      (this.base = r.Element.RenderedElementBase), this.base(t);
                      var e = this.getHrefAttribute().value;
                      if ("" != e) {
                        var i = e.match(/\.svg$/);
                        if ((r.Images.push(this), (this.loaded = !1), i)) (this.img = r.ajax(e)), (this.loaded = !0);
                        else {
                          (this.img = document.createElement("img")), 1 == r.opts.useCORS && (this.img.crossOrigin = "Anonymous");
                          var n = this;
                          (this.img.onload = function () {
                            n.loaded = !0;
                          }),
                            (this.img.onerror = function () {
                              r.log('ERROR: image "' + e + '" not found'), (n.loaded = !0);
                            }),
                            (this.img.src = e);
                        }
                        (this.renderChildren = function (t) {
                          var e = this.attribute("x").toPixels("x"),
                            s = this.attribute("y").toPixels("y"),
                            a = this.attribute("width").toPixels("x"),
                            o = this.attribute("height").toPixels("y");
                          0 != a &&
                            0 != o &&
                            (t.save(),
                            i
                              ? t.drawSvg(this.img, e, s, a, o)
                              : (t.translate(e, s),
                                r.AspectRatio(t, this.attribute("preserveAspectRatio").value, a, this.img.width, o, this.img.height, 0, 0),
                                n.loaded && (void 0 === this.img.complete || this.img.complete) && t.drawImage(this.img, 0, 0)),
                            t.restore());
                        }),
                          (this.getBoundingBox = function () {
                            var t = this.attribute("x").toPixels("x"),
                              e = this.attribute("y").toPixels("y"),
                              i = this.attribute("width").toPixels("x"),
                              n = this.attribute("height").toPixels("y");
                            return new r.BoundingBox(t, e, t + i, e + n);
                          });
                      }
                    }),
                    (r.Element.image.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.g = function (t) {
                      (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.getBoundingBox = function (t) {
                          for (var e = new r.BoundingBox(), i = 0; i < this.children.length; i++) e.addBoundingBox(this.children[i].getBoundingBox(t));
                          return e;
                        });
                    }),
                    (r.Element.g.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.symbol = function (t) {
                      (this.base = r.Element.RenderedElementBase), this.base(t), (this.render = function (t) {});
                    }),
                    (r.Element.symbol.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.style = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t);
                      for (var e = "", i = 0; i < t.childNodes.length; i++) e += t.childNodes[i].data;
                      e = e.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "");
                      var n = (e = r.compressSpaces(e)).split("}");
                      for (i = 0; i < n.length; i++)
                        if ("" != r.trim(n[i]))
                          for (var s = n[i].split("{"), a = s[0].split(","), o = s[1].split(";"), l = 0; l < a.length; l++) {
                            var h = r.trim(a[l]);
                            if ("" != h) {
                              for (var u = r.Styles[h] || {}, f = 0; f < o.length; f++) {
                                var c = o[f].indexOf(":"),
                                  d = o[f].substr(0, c),
                                  p = o[f].substr(c + 1, o[f].length - c);
                                null != d && null != p && (u[r.trim(d)] = new r.Property(r.trim(d), r.trim(p)));
                              }
                              if (((r.Styles[h] = u), (r.StylesSpecificity[h] = m(h)), "@font-face" == h))
                                for (var y = u["font-family"].value.replace(/"/g, ""), g = u.src.value.split(","), v = 0; v < g.length; v++)
                                  if (0 < g[v].indexOf('format("svg")'))
                                    for (
                                      var b = g[v].indexOf("url"), x = g[v].indexOf(")", b), E = g[v].substr(b + 5, x - b - 6), w = r.parseXml(r.ajax(E)).getElementsByTagName("font"), P = 0;
                                      P < w.length;
                                      P++
                                    ) {
                                      var B = r.CreateElement(w[P]);
                                      r.Definitions[y] = B;
                                    }
                            }
                          }
                    }),
                    (r.Element.style.prototype = new r.Element.ElementBase()),
                    (r.Element.use = function (t) {
                      (this.base = r.Element.RenderedElementBase),
                        this.base(t),
                        (this.baseSetContext = this.setContext),
                        (this.setContext = function (t) {
                          this.baseSetContext(t),
                            this.attribute("x").hasValue() && t.translate(this.attribute("x").toPixels("x"), 0),
                            this.attribute("y").hasValue() && t.translate(0, this.attribute("y").toPixels("y"));
                        });
                      var e = this.getHrefAttribute().getDefinition();
                      (this.path = function (t) {
                        null != e && e.path(t);
                      }),
                        (this.elementTransform = function () {
                          if (null != e && e.style("transform", !1, !0).hasValue()) return new r.Transform(e.style("transform", !1, !0).value);
                        }),
                        (this.getBoundingBox = function (t) {
                          if (null != e) return e.getBoundingBox(t);
                        }),
                        (this.renderChildren = function (t) {
                          if (null != e) {
                            var i = e;
                            "symbol" == e.type &&
                              (((i = new r.Element.svg()).type = "svg"),
                              (i.attributes.viewBox = new r.Property("viewBox", e.attribute("viewBox").value)),
                              (i.attributes.preserveAspectRatio = new r.Property("preserveAspectRatio", e.attribute("preserveAspectRatio").value)),
                              (i.attributes.overflow = new r.Property("overflow", e.attribute("overflow").value)),
                              (i.children = e.children)),
                              "svg" == i.type &&
                                (this.attribute("width").hasValue() && (i.attributes.width = new r.Property("width", this.attribute("width").value)),
                                this.attribute("height").hasValue() && (i.attributes.height = new r.Property("height", this.attribute("height").value)));
                            var n = i.parent;
                            (i.parent = null), i.render(t), (i.parent = n);
                          }
                        });
                    }),
                    (r.Element.use.prototype = new r.Element.RenderedElementBase()),
                    (r.Element.mask = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.apply = function (t, e) {
                          var i = this.attribute("x").toPixels("x"),
                            n = this.attribute("y").toPixels("y"),
                            a = this.attribute("width").toPixels("x"),
                            o = this.attribute("height").toPixels("y");
                          if (0 == a && 0 == o) {
                            for (var l = new r.BoundingBox(), h = 0; h < this.children.length; h++) l.addBoundingBox(this.children[h].getBoundingBox(t));
                            (i = Math.floor(l.x1)), (n = Math.floor(l.y1)), (a = Math.floor(l.width())), (o = Math.floor(l.height()));
                          }
                          var u = e.attribute("mask").value;
                          e.attribute("mask").value = "";
                          var f = s();
                          (f.width = i + a), (f.height = n + o);
                          var c = f.getContext("2d");
                          this.renderChildren(c);
                          var d = s();
                          (d.width = i + a), (d.height = n + o);
                          var m = d.getContext("2d");
                          e.render(m),
                            (m.globalCompositeOperation = "destination-in"),
                            (m.fillStyle = c.createPattern(f, "no-repeat")),
                            m.fillRect(0, 0, i + a, n + o),
                            (t.fillStyle = m.createPattern(d, "no-repeat")),
                            t.fillRect(0, 0, i + a, n + o),
                            (e.attribute("mask").value = u);
                        }),
                        (this.render = function (t) {});
                    }),
                    (r.Element.mask.prototype = new r.Element.ElementBase()),
                    (r.Element.clipPath = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.apply = function (t) {
                          var e = "undefined" != typeof CanvasRenderingContext2D,
                            i = t.beginPath,
                            n = t.closePath;
                          e && ((CanvasRenderingContext2D.prototype.beginPath = function () {}), (CanvasRenderingContext2D.prototype.closePath = function () {})), i.call(t);
                          for (var s = 0; s < this.children.length; s++) {
                            var a = this.children[s];
                            if (void 0 !== a.path) {
                              var o = void 0 !== a.elementTransform && a.elementTransform();
                              !o && a.style("transform", !1, !0).hasValue() && (o = new r.Transform(a.style("transform", !1, !0).value)),
                                o && o.apply(t),
                                a.path(t),
                                e && (CanvasRenderingContext2D.prototype.closePath = n),
                                o && o.unapply(t);
                            }
                          }
                          n.call(t), t.clip(), e && ((CanvasRenderingContext2D.prototype.beginPath = i), (CanvasRenderingContext2D.prototype.closePath = n));
                        }),
                        (this.render = function (t) {});
                    }),
                    (r.Element.clipPath.prototype = new r.Element.ElementBase()),
                    (r.Element.filter = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.apply = function (t, e) {
                          var i = e.getBoundingBox(t),
                            n = Math.floor(i.x1),
                            a = Math.floor(i.y1),
                            r = Math.floor(i.width()),
                            o = Math.floor(i.height()),
                            l = e.style("filter").value;
                          e.style("filter").value = "";
                          for (var h = 0, u = 0, f = 0; f < this.children.length; f++) {
                            var c = this.children[f].extraFilterDistance || 0;
                            (h = Math.max(h, c)), (u = Math.max(u, c));
                          }
                          var d = s();
                          (d.width = r + 2 * h), (d.height = o + 2 * u);
                          var m = d.getContext("2d");
                          for (m.translate(-n + h, -a + u), e.render(m), f = 0; f < this.children.length; f++)
                            "function" == typeof this.children[f].apply && this.children[f].apply(m, 0, 0, r + 2 * h, o + 2 * u);
                          t.drawImage(d, 0, 0, r + 2 * h, o + 2 * u, n - h, a - u, r + 2 * h, o + 2 * u), (e.style("filter", !0).value = l);
                        }),
                        (this.render = function (t) {});
                    }),
                    (r.Element.filter.prototype = new r.Element.ElementBase()),
                    (r.Element.feMorphology = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t), (this.apply = function (t, e, i, n, s) {});
                    }),
                    (r.Element.feMorphology.prototype = new r.Element.ElementBase()),
                    (r.Element.feComposite = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t), (this.apply = function (t, e, i, n, s) {});
                    }),
                    (r.Element.feComposite.prototype = new r.Element.ElementBase()),
                    (r.Element.feColorMatrix = function (t) {
                      (this.base = r.Element.ElementBase), this.base(t);
                      var e = r.ToNumberArray(this.attribute("values").value);
                      switch (this.attribute("type").valueOrDefault("matrix")) {
                        case "saturate":
                          var i = e[0];
                          e = [
                            0.213 + 0.787 * i,
                            0.715 - 0.715 * i,
                            0.072 - 0.072 * i,
                            0,
                            0,
                            0.213 - 0.213 * i,
                            0.715 + 0.285 * i,
                            0.072 - 0.072 * i,
                            0,
                            0,
                            0.213 - 0.213 * i,
                            0.715 - 0.715 * i,
                            0.072 + 0.928 * i,
                            0,
                            0,
                            0,
                            0,
                            0,
                            1,
                            0,
                            0,
                            0,
                            0,
                            0,
                            1,
                          ];
                          break;
                        case "hueRotate":
                          var n = (e[0] * Math.PI) / 180,
                            s = function (t, e, i) {
                              return t + Math.cos(n) * e + Math.sin(n) * i;
                            };
                          e = [
                            s(0.213, 0.787, -0.213),
                            s(0.715, -0.715, -0.715),
                            s(0.072, -0.072, 0.928),
                            0,
                            0,
                            s(0.213, -0.213, 0.143),
                            s(0.715, 0.285, 0.14),
                            s(0.072, -0.072, -0.283),
                            0,
                            0,
                            s(0.213, -0.213, -0.787),
                            s(0.715, -0.715, 0.715),
                            s(0.072, 0.928, 0.072),
                            0,
                            0,
                            0,
                            0,
                            0,
                            1,
                            0,
                            0,
                            0,
                            0,
                            0,
                            1,
                          ];
                          break;
                        case "luminanceToAlpha":
                          e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
                      }
                      function a(t, e, i, n, s, a) {
                        return t[i * n * 4 + 4 * e + a];
                      }
                      function o(t, e, i, n, s, a, r) {
                        t[i * n * 4 + 4 * e + a] = r;
                      }
                      function l(t, i) {
                        var n = e[t];
                        return n * (n < 0 ? i - 255 : i);
                      }
                      this.apply = function (t, e, i, n, s) {
                        var r = t.getImageData(0, 0, n, s);
                        for (i = 0; i < s; i++)
                          for (e = 0; e < n; e++) {
                            var h = a(r.data, e, i, n, 0, 0),
                              u = a(r.data, e, i, n, 0, 1),
                              f = a(r.data, e, i, n, 0, 2),
                              c = a(r.data, e, i, n, 0, 3);
                            o(r.data, e, i, n, 0, 0, l(0, h) + l(1, u) + l(2, f) + l(3, c) + l(4, 1)),
                              o(r.data, e, i, n, 0, 1, l(5, h) + l(6, u) + l(7, f) + l(8, c) + l(9, 1)),
                              o(r.data, e, i, n, 0, 2, l(10, h) + l(11, u) + l(12, f) + l(13, c) + l(14, 1)),
                              o(r.data, e, i, n, 0, 3, l(15, h) + l(16, u) + l(17, f) + l(18, c) + l(19, 1));
                          }
                        t.clearRect(0, 0, n, s), t.putImageData(r, 0, 0);
                      };
                    }),
                    (r.Element.feColorMatrix.prototype = new r.Element.ElementBase()),
                    (r.Element.feGaussianBlur = function (t) {
                      (this.base = r.Element.ElementBase),
                        this.base(t),
                        (this.blurRadius = Math.floor(this.attribute("stdDeviation").numValue())),
                        (this.extraFilterDistance = this.blurRadius),
                        (this.apply = function (t, i, n, s, a) {
                          e && void 0 !== e.canvasRGBA
                            ? ((t.canvas.id = r.UniqueId()),
                              (t.canvas.style.display = "none"),
                              document.body.appendChild(t.canvas),
                              e.canvasRGBA(t.canvas, i, n, s, a, this.blurRadius),
                              document.body.removeChild(t.canvas))
                            : r.log("ERROR: StackBlur.js must be included for blur to work");
                        });
                    }),
                    (r.Element.feGaussianBlur.prototype = new r.Element.ElementBase()),
                    (r.Element.title = function (t) {}),
                    (r.Element.title.prototype = new r.Element.ElementBase()),
                    (r.Element.desc = function (t) {}),
                    (r.Element.desc.prototype = new r.Element.ElementBase()),
                    (r.Element.MISSING = function (t) {
                      r.log("ERROR: Element '" + t.nodeName + "' not yet implemented.");
                    }),
                    (r.Element.MISSING.prototype = new r.Element.ElementBase()),
                    (r.CreateElement = function (t) {
                      var e = t.nodeName.replace(/^[^:]+:/, "");
                      e = e.replace(/\-/g, "");
                      var i;
                      return ((i = void 0 !== r.Element[e] ? new r.Element[e](t) : new r.Element.MISSING(t)).type = t.nodeName), i;
                    }),
                    (r.load = function (t, e) {
                      r.loadXml(t, r.ajax(e));
                    }),
                    (r.loadXml = function (t, e) {
                      r.loadXmlDoc(t, r.parseXml(e));
                    }),
                    (r.loadXmlDoc = function (t, e) {
                      r.init(t);
                      var i = function (e) {
                        for (var i = t.canvas; i; ) (e.x -= i.offsetLeft), (e.y -= i.offsetTop), (i = i.offsetParent);
                        return n.scrollX && (e.x += n.scrollX), n.scrollY && (e.y += n.scrollY), e;
                      };
                      1 != r.opts.ignoreMouse &&
                        ((t.canvas.onclick = function (t) {
                          var e = i(new r.Point(null != t ? t.clientX : event.clientX, null != t ? t.clientY : event.clientY));
                          r.Mouse.onclick(e.x, e.y);
                        }),
                        (t.canvas.onmousemove = function (t) {
                          var e = i(new r.Point(null != t ? t.clientX : event.clientX, null != t ? t.clientY : event.clientY));
                          r.Mouse.onmousemove(e.x, e.y);
                        }));
                      var s = r.CreateElement(e.documentElement);
                      (s.root = !0), s.addStylesFromStyleDefinition();
                      var a = !0,
                        o = function () {
                          r.ViewPort.Clear(),
                            t.canvas.parentNode ? r.ViewPort.SetCurrent(t.canvas.parentNode.clientWidth, t.canvas.parentNode.clientHeight) : r.ViewPort.SetCurrent(800, 600),
                            1 != r.opts.ignoreDimensions &&
                              (s.style("width").hasValue() && ((t.canvas.width = s.style("width").toPixels("x")), t.canvas.style && (t.canvas.style.width = t.canvas.width + "px")),
                              s.style("height").hasValue() && ((t.canvas.height = s.style("height").toPixels("y")), t.canvas.style && (t.canvas.style.height = t.canvas.height + "px")));
                          var i = t.canvas.clientWidth || t.canvas.width,
                            n = t.canvas.clientHeight || t.canvas.height;
                          if (
                            (1 == r.opts.ignoreDimensions &&
                              s.style("width").hasValue() &&
                              s.style("height").hasValue() &&
                              ((i = s.style("width").toPixels("x")), (n = s.style("height").toPixels("y"))),
                            r.ViewPort.SetCurrent(i, n),
                            null != r.opts.offsetX && (s.attribute("x", !0).value = r.opts.offsetX),
                            null != r.opts.offsetY && (s.attribute("y", !0).value = r.opts.offsetY),
                            null != r.opts.scaleWidth || null != r.opts.scaleHeight)
                          ) {
                            var o = null,
                              l = null,
                              h = r.ToNumberArray(s.attribute("viewBox").value);
                            null != r.opts.scaleWidth &&
                              (s.attribute("width").hasValue() ? (o = s.attribute("width").toPixels("x") / r.opts.scaleWidth) : isNaN(h[2]) || (o = h[2] / r.opts.scaleWidth)),
                              null != r.opts.scaleHeight &&
                                (s.attribute("height").hasValue() ? (l = s.attribute("height").toPixels("y") / r.opts.scaleHeight) : isNaN(h[3]) || (l = h[3] / r.opts.scaleHeight)),
                              null == o && (o = l),
                              null == l && (l = o),
                              (s.attribute("width", !0).value = r.opts.scaleWidth),
                              (s.attribute("height", !0).value = r.opts.scaleHeight),
                              (s.style("transform", !0, !0).value += " scale(" + 1 / o + "," + 1 / l + ")");
                          }
                          1 != r.opts.ignoreClear && t.clearRect(0, 0, i, n), s.render(t), a && ((a = !1), "function" == typeof r.opts.renderCallback && r.opts.renderCallback(e));
                        },
                        l = !0;
                      r.ImagesLoaded() && ((l = !1), o()),
                        (r.intervalID = setInterval(function () {
                          var t = !1;
                          if ((l && r.ImagesLoaded() && (t = !(l = !1)), 1 != r.opts.ignoreMouse && (t |= r.Mouse.hasEvents()), 1 != r.opts.ignoreAnimation))
                            for (var e = 0; e < r.Animations.length; e++) t |= r.Animations[e].update(1e3 / r.FRAMERATE);
                          "function" == typeof r.opts.forceRedraw && 1 == r.opts.forceRedraw() && (t = !0), t && (o(), r.Mouse.runEvents());
                        }, 1e3 / r.FRAMERATE));
                    }),
                    (r.stop = function () {
                      r.intervalID && clearInterval(r.intervalID);
                    }),
                    (r.Mouse = new (function () {
                      (this.events = []),
                        (this.hasEvents = function () {
                          return 0 != this.events.length;
                        }),
                        (this.onclick = function (t, e) {
                          this.events.push({
                            type: "onclick",
                            x: t,
                            y: e,
                            run: function (t) {
                              t.onclick && t.onclick();
                            },
                          });
                        }),
                        (this.onmousemove = function (t, e) {
                          this.events.push({
                            type: "onmousemove",
                            x: t,
                            y: e,
                            run: function (t) {
                              t.onmousemove && t.onmousemove();
                            },
                          });
                        }),
                        (this.eventElements = []),
                        (this.checkPath = function (t, e) {
                          for (var i = 0; i < this.events.length; i++) {
                            var n = this.events[i];
                            e.isPointInPath && e.isPointInPath(n.x, n.y) && (this.eventElements[i] = t);
                          }
                        }),
                        (this.checkBoundingBox = function (t, e) {
                          for (var i = 0; i < this.events.length; i++) {
                            var n = this.events[i];
                            e.isPointInBox(n.x, n.y) && (this.eventElements[i] = t);
                          }
                        }),
                        (this.runEvents = function () {
                          r.ctx.canvas.style.cursor = "";
                          for (var t = 0; t < this.events.length; t++) for (var e = this.events[t], i = this.eventElements[t]; i; ) e.run(i), (i = i.parent);
                          (this.events = []), (this.eventElements = []);
                        });
                    })()),
                    r
                  );
                })(l || {});
                "string" == typeof i && (i = document.getElementById(i)),
                  null != i.svg && i.svg.stop(),
                  (i.childNodes && 1 == i.childNodes.length && "OBJECT" == i.childNodes[0].nodeName) || (i.svg = h);
                var u = i.getContext("2d");
                void 0 !== o.documentElement ? h.loadXmlDoc(u, o) : "<" == o.substr(0, 1) ? h.loadXml(u, o) : h.load(u, o);
              } else
                for (var f = document.querySelectorAll("svg"), c = 0; c < f.length; c++) {
                  var d = f[c],
                    p = document.createElement("canvas");
                  (p.width = d.clientWidth), (p.height = d.clientHeight), d.parentNode.insertBefore(p, d), d.parentNode.removeChild(d);
                  var y = document.createElement("div");
                  y.appendChild(d), r(p, y.innerHTML);
                }
            };
          "undefined" == typeof Element ||
            (void 0 !== Element.prototype.matches
              ? (a = function (t, e) {
                  return t.matches(e);
                })
              : void 0 !== Element.prototype.webkitMatchesSelector
              ? (a = function (t, e) {
                  return t.webkitMatchesSelector(e);
                })
              : void 0 !== Element.prototype.mozMatchesSelector
              ? (a = function (t, e) {
                  return t.mozMatchesSelector(e);
                })
              : void 0 !== Element.prototype.msMatchesSelector
              ? (a = function (t, e) {
                  return t.msMatchesSelector(e);
                })
              : void 0 !== Element.prototype.oMatchesSelector
              ? (a = function (t, e) {
                  return t.oMatchesSelector(e);
                })
              : (("function" != typeof jQuery && "function" != typeof Zepto) ||
                  (a = function (t, e) {
                    return $(t).is(e);
                  }),
                void 0 === a && "undefined" != typeof Sizzle && (a = Sizzle.matchesSelector)));
          var o = /(\[[^\]]+\])/g,
            l = /(#[^\s\+>~\.\[:]+)/g,
            h = /(\.[^\s\+>~\.\[:]+)/g,
            u = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,
            f = /(:[\w-]+\([^\)]*\))/gi,
            c = /(:[^\s\+>~\.\[:]+)/g,
            d = /([^\s\+>~\.\[:]+)/g;
          function m(t) {
            var e = [0, 0, 0],
              i = function (i, n) {
                var s = t.match(i);
                null != s && ((e[n] += s.length), (t = t.replace(i, " ")));
              };
            return (
              (t = (t = t.replace(/:not\(([^\)]*)\)/g, "     $1 ")).replace(/{[\s\S]*/gm, " ")),
              i(o, 1),
              i(l, 0),
              i(h, 1),
              i(u, 2),
              i(f, 1),
              i(c, 1),
              (t = (t = t.replace(/[\*\s\+>~]/g, " ")).replace(/[#\.]/g, " ")),
              i(d, 2),
              e.join("")
            );
          }
          "undefined" != typeof CanvasRenderingContext2D &&
            (CanvasRenderingContext2D.prototype.drawSvg = function (t, e, i, n, s, a) {
              var o = { ignoreMouse: !0, ignoreAnimation: !0, ignoreDimensions: !0, ignoreClear: !0, offsetX: e, offsetY: i, scaleWidth: n, scaleHeight: s };
              for (var l in a) a.hasOwnProperty(l) && (o[l] = a[l]);
              r(this.canvas, t, o);
            }),
            (i.exports = r);
        })((i = { exports: {} })),
        i.exports
      );
    });
  },
});
//# sourceMappingURL=canvg.js.map
