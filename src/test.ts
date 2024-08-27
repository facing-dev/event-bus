import { describe, expect, test } from '@jest/globals';

import EventBus from './index.mjs'

describe('Component',
    () => {
        let value: any = null
        const eb = new EventBus<{
            a: [string],
            b: [number],
            c: [string, number],
            d: []
            e: [],
            promise: []
        }>()
        function aListener(p: string) {
            value = p
        }
        let aAgent = eb.on('a', aListener)
        let aAgent2 = eb.on('a', aListener)
        function b1Listener(p: number) {
            value = p
        }
        eb.on('b', b1Listener)
        let bAgent2 = eb.on('b', function (p) {
            value++
        })
        eb.on('c', function (p, pp) {
            value = {
                p, pp
            }
        })
        eb.onOnce('e', function () {
            value++
        })

        test('check d', () => {
            expect(undefined).toBe((eb as any).listeners.get('d'))
        })
        test('check a', () => {
            expect('object').toBe(typeof (eb as any).listeners.get('a'))
            eb.dispatch('a', 'va')
            expect('va').toBe(value)
            expect(1).toBe((eb as any).listeners.get('a').size)
            expect(true).toBe(aAgent.is(aListener))
            eb.off(aAgent)
            expect(undefined).toBe((eb as any).listeners.get('a'))
            expect(aAgent===aAgent2).toBe(true)
        })
        test('check b', () => {
            expect('object').toBe(typeof (eb as any).listeners.get('b'))
            eb.dispatch('b', 1)
            expect(2).toBe(value)
            bAgent2.off()
            expect(1).toBe((eb as any).listeners.get('b').size)
            eb.off('b', b1Listener)
            expect(undefined).toBe((eb as any).listeners.get('b'))


        })
        test('check c', () => {
            expect('object').toBe(typeof (eb as any).listeners.get('c'))
            eb.dispatch('c', 'aaa', 10)
            expect('object').toBe(typeof value)
            expect('aaa').toBe(value.p)
            expect(10).toBe(value.pp)
        })
        test('check e', () => {
            value = 0
            eb.dispatch('e')
            expect(1).toBe(value)
            eb.dispatch('e')
            expect(1).toBe(value)
        })
        function promiseListener() {
            return new Promise<void>((res) => {
                setTimeout(() => {
                    res()
                }, 1000);
            })
        }
        eb.on('promise', promiseListener)
        function promiseListener2() {
            return new Promise<void>((res) => {
                setTimeout(() => {
                    res()
                }, 1000);
            })
        }
        eb.on('promise', promiseListener2)
        test('check p', async () => {
            const r = await eb.dispatch('promise')
            expect(Array.isArray(r)).toBe(true)
            expect((r as void[]).length).toBe(2)
        })
    }
)