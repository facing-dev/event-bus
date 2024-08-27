import { describe, it, expect } from "@jest/globals"
import I from './index.mjs'
describe('test',()=>{
    it('default',()=>{
        expect(I).toBe(true)
    })
})