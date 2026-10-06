/**
 * @file tests/helpers/navigation.ts
 * @desc The route a mocked next/navigation reports. Each test file mocks the module itself
 *       (vi.mock hoists only within its own file): `vi.mock("next/navigation.js", () => navMock);`
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

/** The pathname usePathname returns; tests set it. */
export const route = { pathname: "/" };

/** The mocked module. */
export const navMock = { usePathname: () => route.pathname };
