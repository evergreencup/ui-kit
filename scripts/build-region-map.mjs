#!/usr/bin/env node
/**
 * @file scripts/build-region-map.mjs
 * @desc Regenerates src/components/region/regionPaths.ts: fetches Natural Earth admin-1
 *       boundaries for the US and Canada (cached in scripts/data/, gitignored), projects them
 *       with d3-geo Albers framed on the PNW, and writes the path data. Alaska is drawn
 *       separately into a lower-left inset panel (ALASKA_INSET) with its own equal-area
 *       projection. d3-geo and topojson-* are devDependencies only; the kit ships the output.
 *       Run with: bun scripts/build-region-map.mjs
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { geoAlbers, geoConicEqualArea, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { topology } from "topojson-server";
import { presimplify, simplify } from "topojson-simplify";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = `${SCRIPT_DIR}/..`;
const CACHE = `${SCRIPT_DIR}/data/ne_50m_admin_1_states_provinces.geojson`;
const OUT = `${APP_ROOT}/src/components/region/regionPaths.ts`;
const DATA_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson";

const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 360;

// Iso codes for the 4 allowed PNW regions; the map is framed around these and
// everything else renders as context (possibly clipped at the viewBox edges).
const PNW_ISO = new Set(["US-WA", "US-OR", "US-ID", "CA-BC"]);

// Iso codes we never want to render at all — Hawaii is far south of the
// continental bounding box and would visually drag the projection.
const SKIP_ISO = new Set(["US-HI"]);

// Alaska is non-contiguous and far NW; the main PNW-framed Albers would render it
// clipped off the top-left. Instead it gets its own equal-area projection fitted
// into a labelled inset panel in the empty lower-left (the way d3.geoAlbersUsa
// handles Alaska). The box lives entirely left of the interactive PNW cluster
// (which starts at x≈176) so the opaque panel never covers a clickable region.
// These coords are re-emitted so the map component can draw the panel + label.
const ALASKA_ISO = "US-AK";
const ALASKA_INSET = { x: 10, y: 238, width: 158, height: 110 };

const loadAdmin1 = async () => {
  if (!existsSync(CACHE)) {
    await mkdir(dirname(CACHE), { recursive: true });
    process.stdout.write(`Fetching ${DATA_URL}\n`);
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`fetch failed: ${res.status.toString()}`);
    const text = await res.text();
    await writeFile(CACHE, text);
    return JSON.parse(text);
  }
  return JSON.parse(await readFile(CACHE, "utf8"));
};

const main = async () => {
  const admin1 = await loadAdmin1();

  const filtered = admin1.features.filter((f) => {
    const iso = f.properties.iso_a2 ?? f.properties.ISO_A2 ?? f.properties.adm0_a3;
    return iso === "US" || iso === "CA" || iso === "USA" || iso === "CAN";
  });

  process.stdout.write(`Loaded ${filtered.length.toString()} admin-1 features\n`);

  // Sample a feature's properties for debugging id mapping
  if (filtered.length > 0) {
    const sample = filtered[0].properties;
    const keys = Object.keys(sample).filter((k) => /iso|postal|adm|name/i.exec(k));
    const shown = Object.fromEntries(keys.slice(0, 10).map((k) => [k, sample[k]]));
    process.stdout.write(`Sample keys: ${JSON.stringify(shown)}\n`);
  }

  // Convert geojson -> topojson, simplify with Douglas-Peucker, convert back.
  // Tolerance is in steradians-equivalent; higher = more aggressive simplification.
  // At 0.002 we drop ~80% of input vertices while keeping state/province shapes recognisable.
  const topo = topology({ admin1: { type: "FeatureCollection", features: filtered } }, 1e5);
  const simplified = simplify(presimplify(topo), 0.002);
  const simplifiedCollection = feature(simplified, simplified.objects.admin1);
  const simplifiedFeatures = simplifiedCollection.features;
  process.stdout.write(`Simplified to ${simplifiedFeatures.length.toString()} features\n`);

  const resolveId = (f) => {
    const iso2 = f.properties.iso_a2 ?? f.properties.ISO_A2;
    const adm0 = f.properties.adm0_a3;
    const country =
      iso2 === "US" || adm0 === "USA" ? "US" : iso2 === "CA" || adm0 === "CAN" ? "CA" : null;
    if (!country) return null;
    const postal = f.properties.postal ?? f.properties.abbrev_1 ?? f.properties.abbrev;
    const iso3166 = f.properties.iso_3166_2;
    if (iso3166 && /^[A-Z]{2}-[A-Z0-9]{2,3}$/.exec(iso3166)) {
      return SKIP_ISO.has(iso3166) ? null : iso3166;
    }
    if (postal) {
      const composed = `${country}-${String(postal).toUpperCase().replace(/^CA-/, "")}`;
      return SKIP_ISO.has(composed) ? null : composed;
    }
    return null;
  };

  // Fit the projection so the 4 PNW regions fill the centre of the viewBox,
  // leaving PADDING on each side for surrounding states/provinces to peek in.
  // Non-PNW features still render — they're just drawn at whatever position
  // the projection produces and may extend beyond the viewBox (which clips).
  const pnwFeatures = simplifiedFeatures.filter((f) => {
    const id = resolveId(f);
    return id !== null && PNW_ISO.has(id);
  });
  const PADDING_X = 90;
  const PADDING_Y = 40;
  const projection = geoAlbers().rotate([96, 0]).center([-0.6, 48]).parallels([40, 55]);
  projection.fitExtent(
    [
      [PADDING_X, PADDING_Y],
      [VIEW_WIDTH - PADDING_X, VIEW_HEIGHT - PADDING_Y],
    ],
    { type: "FeatureCollection", features: pnwFeatures },
  );

  const path = geoPath(projection);

  const compressD = (d) => d.replace(/(-?\d+\.\d+)/g, (m) => Math.round(Number(m)).toString());

  const states = {};
  const provinces = {};
  for (const f of simplifiedFeatures) {
    const id = resolveId(f);
    if (!id) continue;
    if (id === ALASKA_ISO) continue; // projected separately into the inset below
    const d = path(f);
    if (!d) continue;
    const compressed = compressD(d);
    if (id.startsWith("US-")) states[id] = compressed;
    else if (id.startsWith("CA-")) provinces[id] = compressed;
  }

  // --- Alaska inset ---
  // Own equal-area projection (matching d3.geoAlbersUsa's Alaska sub-projection),
  // fitted into ALASKA_INSET with a top strip left clear for the panel label.
  const alaskaFeature = simplifiedFeatures.find((f) => resolveId(f) === ALASKA_ISO);
  if (alaskaFeature) {
    // Drop the far Aleutian chain (any polygon reaching west of -170°, including the
    // antimeridian wrap) so the fitted mainland + SE panhandle stay large + clickable.
    const polys =
      alaskaFeature.geometry.type === "MultiPolygon"
        ? alaskaFeature.geometry.coordinates
        : [alaskaFeature.geometry.coordinates];
    const kept = polys.filter((poly) => {
      let minLon = Infinity;
      for (const ring of poly) for (const pt of ring) if (pt[0] < minLon) minLon = pt[0];
      return minLon >= -170;
    });
    const akFeature = {
      type: "Feature",
      properties: alaskaFeature.properties,
      geometry: { type: "MultiPolygon", coordinates: kept },
    };
    const box = ALASKA_INSET;
    const akProjection = geoConicEqualArea()
      .rotate([154, 0])
      .center([-2, 58.5])
      .parallels([55, 65]);
    akProjection.fitExtent(
      [
        [box.x + 10, box.y + 24],
        [box.x + box.width - 10, box.y + box.height - 10],
      ],
      akFeature,
    );
    akProjection.clipExtent([
      [box.x, box.y],
      [box.x + box.width, box.y + box.height],
    ]);
    const akPath = geoPath(akProjection)(akFeature);
    if (akPath) states[ALASKA_ISO] = compressD(akPath);
  }

  process.stdout.write(
    `Emitted ${Object.keys(states).length.toString()} states, ${Object.keys(provinces).length.toString()} provinces\n`,
  );

  const sortEntries = (obj) =>
    Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `  "${k}": "${v}",`)
      .join("\n");

  const body = `/**
 * @file src/components/region/regionPaths.ts
 * @desc Generated SVG path data for US states and Canadian provinces on a 480x360 Albers view
 *       framed on the PNW, with Alaska projected into a lower-left inset. Do not edit by hand;
 *       regenerate with \`bun scripts/build-region-map.mjs\`.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

export const MAP_VIEW_WIDTH = ${VIEW_WIDTH.toString()};
export const MAP_VIEW_HEIGHT = ${VIEW_HEIGHT.toString()};

/** Lower-left panel the Alaska path ("US-AK") is projected into; the map draws its frame + label. */
export const ALASKA_INSET = { x: ${ALASKA_INSET.x.toString()}, y: ${ALASKA_INSET.y.toString()}, width: ${ALASKA_INSET.width.toString()}, height: ${ALASKA_INSET.height.toString()} } as const;

export const STATE_PATHS: Record<string, string> = {
${sortEntries(states)}
};

export const PROVINCE_PATHS: Record<string, string> = {
${sortEntries(provinces)}
};
`;

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, body, "utf8");
  process.stdout.write(`Wrote ${OUT}\n`);
};

await main();
