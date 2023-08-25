import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import * as pc from '../PageContext.js'

describe("pageZone", () => {
	it("cp=1 hot=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = 0;
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
		];
		for(let page = 0; page < pagecount; page++) {
			const zone = pc.pageZone(page, current, pagecount, hot, warm);
			expect(zone).toBe(expecting[page]);
		}
	});
	it("cp=15 hot=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = pagecount - 1;
		const expecting = [
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
		];
		for(let page = 0; page < pagecount; page++) {
			const zone = pc.pageZone(page, current, pagecount, hot, warm);
			expect(zone).toBe(expecting[page]);
		}
	});
	it("cp 1 hot=4 warm=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = 4;
		const current = 0;
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.COLD,
			pc.COLD,pc.COLD,pc.COLD,pc.COLD,pc.COLD,
		];
		for(let page = 0; page < pagecount; page++) {
			const zone = pc.pageZone(page, current, pagecount, hot, warm);
			expect(zone).toBe(expecting[page]);
		}
	});
	it("cp=9 hot=4 warm=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = 4;
		const current = 9;
		const expecting = [
			pc.COLD, pc.WARM, pc.WARM, pc.WARM, pc.WARM,
			pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT,
			pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT ,pc.WARM,
		];
		for(let page = 0; page < pagecount; page++) {
			const zone = pc.pageZone(page, current, pagecount, hot, warm);
			expect(zone).toBe(expecting[page]);
		}
	});
	it("cp=9 hot=undefined warm=undefined", () => {
		const pagecount = 15;
		const hot = undefined;
		const warm = undefined;
		const current = 9;
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT,
			pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT ,pc.HOT,
		];
		for(let page = 0; page < pagecount; page++) {
			const zone = pc.pageZone(page, current, pagecount, hot, warm);
			expect(zone).toBe(expecting[page]);
		}
	});
});
describe('PageContext', () => {
	it('initial state', () => {
		const page = new pc.PageContext("page-1", 0, 1, "1");
		expect(page.id).toBe("page-1");
		expect(page.index).toBe(0);
		expect(page.pageNumber).toBe(1);
		expect(page.pageTitle).toBe("1");
		expect(page.state).toBe(pc.COLD);
		expect(page.is(pc.COLD)).toBe(true);
	});
	it("materialize pages", () => {
		const list = [];
		pc.materializePages("pdf", 5, list);
		expect(list.length).toBe(5);
		function verify(lx, ix) {
			expect(lx.id).toBe(`pdf-page-${lx.pageNumber}`);
			expect(lx.index).toBe(ix);
			expect(lx.pageNumber).toBe(ix + 1);
			expect(lx.pageTitle).toBe((ix + 1).toString());
			expect(lx.state).toBe(pc.COLD);
		}
		verify(list[0], 0);
		verify(list[1], 1);
		verify(list[2], 2);
		verify(list[3], 3);
		verify(list[4], 4);
	});
});
describe("RenderState", () => {
	it("scan cp=0 hot=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = 0;
		const list = [];
		pc.materializePages("pdf", pagecount, list);
		const state = new pc.RenderState(list, pagecount, current, hot, warm);
		const output = state.scan();
		expect(output.length).toBe(pagecount);
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
		];
		for(let page = 0; page < pagecount; page++) {
			expect(output[page].page.index).toBe(page);
			expect(output[page].zone).toBe(expecting[page]);
		}
	});
	it("tiles cp=0 hot=4 tilect=undefined", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = 0;
		const tilect = undefined;
		const list = [];
		pc.materializePages("pdf", pagecount, list);
		const state = new pc.RenderState(list, pagecount, current, hot, warm);
		const output = state.scan();
		expect(output.length).toBe(pagecount);
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
		];
		for(let page = 0; page < pagecount; page++) {
			expect(output[page].page.index).toBe(page);
			expect(output[page].zone).toBe(expecting[page]);
		}
		const tiles = state.tiles(output, tilect);
		expect(tiles.length).toBe(output.length);
	});
	it("tiles cp=0 hot=4 tilect=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = 0;
		const tilect = 4;
		const list = [];
		pc.materializePages("pdf", pagecount, list);
		expect(list.length).toBe(pagecount);
		const state = new pc.RenderState(list, pagecount, current, hot, warm);
		const output = state.scan();
		expect(output.length).toBe(pagecount);
		const expecting = [
			pc.HOT, pc.HOT, pc.HOT, pc.HOT, pc.HOT,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
			pc.WARM,pc.WARM,pc.WARM,pc.WARM,pc.WARM,
		];
		for(let page = 0; page < pagecount; page++) {
			expect(output[page].page.state).toBe(pc.COLD);
			expect(output[page].page.index).toBe(page);
			expect(output[page].zone).toBe(expecting[page]);
		}
		const tiles = state.tiles(output, tilect);
		expect(tiles.length).toBe(tilect);
	});
	it("transition cp=0 hot=4 tilect=4", () => {
		const pagecount = 15;
		const hot = 4;
		const warm = undefined;
		const current = 0;
		const tilect = 4;
		const list = [];
		pc.materializePages("pdf", pagecount, list);
		expect(list.length).toBe(pagecount);
		const state = new pc.RenderState(list, pagecount, current, hot, warm);
		const output = state.scan();
		expect(output.length).toBe(pagecount);
		const tiles = state.tiles(output, tilect);
		expect(tiles.length).toBe(tilect);
		state.transition(tiles, tx => {
			expect(tx.page.state).toBe(pc.COLD);
			expect(tx.zone).toBe(pc.HOT);
		});
	});
});
describe("getPageDimensions", () => {
	it("ar=1 width mode", () => {
		const ratio = 1;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.WIDTH, ratio, actualWidth, actualHeight);
		expect(width).toBe(actualWidth);
		expect(height).toBe(actualHeight);
	});
	it("ar=1 height mode", () => {
		const ratio = 1;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.HEIGHT, ratio, actualWidth, actualHeight);
		expect(width).toBe(actualWidth);
		expect(height).toBe(actualHeight);
	});
	it("ar=(8.5/11) width mode", () => {
		const ratio = 8.5/11;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.WIDTH, ratio, actualWidth, actualHeight);
		expect(width).toBe(actualWidth);
		expect(Math.floor(height)).toBe(395);
	});
	it("ar=(8.5/11) height mode", () => {
		const ratio = 8.5/11;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.HEIGHT, ratio, actualWidth, actualHeight);
		expect(height).toBe(actualHeight);
		expect(Math.floor(width)).toBe(395);
	});
	it("ar=(11/8.5) width mode", () => {
		const ratio = 11/8.5;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.WIDTH, ratio, actualWidth, actualHeight);
		expect(width).toBe(actualWidth);
		expect(Math.floor(height)).toBe(395);
	});
	// fitting a Landscape to a square in HEIGHT mode will cause the width to overflow!
	// Rule for tile grids: Landscape->WIDTH, Portrait->HEIGHT
	it("ar=(11/8.5) height mode", () => {
		const ratio = 11/8.5;
		const actualWidth = 512;
		const actualHeight = 512;
		const [width,height] = pc.getPageDimensions(pc.HEIGHT, ratio, actualWidth, actualHeight);
		expect(height).toBe(actualHeight);
		expect(Math.floor(width)).toBe(662);
	});
});