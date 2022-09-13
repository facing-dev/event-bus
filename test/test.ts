import { expect } from 'chai';
import 'mocha';

import EventBus from '../dist'

describe('Component',
    () => {
        let value: any = null
        const eb = new EventBus<{
            a: [string],
            b: [number],
            c: [string, number],
            d: []
            e: []
        }>()
        function aListener(p: string) {
            value = p
        }
        let aAgent = eb.on('a', aListener)
        function b1Listener(p: number) {
            value = p
        }
        let bAgent1 = eb.on('b', b1Listener)
        let bAgent2 = eb.on('b', function (p) {
            value++
        })
        let cAgent = eb.on('c', function (p, pp) {
            value = {
                p, pp
            }
        })
        let eAgent = eb.onOnce('e', function () {
            value++
        })
        it('check d', () => {
            expect(undefined).to.equal((eb as any).listeners['d'])
        })
        it('check a', () => {
            expect('object').to.equal(typeof (eb as any).listeners['a'])
            eb.dispatch('a', 'va')
            expect('va').to.equal(value)
            expect(1).to.equal((eb as any).listeners['a'].length)
            expect(true).to.equal(aAgent.is(aListener))
            eb.off(aAgent)
            expect(undefined).to.equal((eb as any).listeners['a'])
        })
        it('check b', () => {
            expect('object').to.equal(typeof (eb as any).listeners['b'])
            eb.dispatch('b', 1)
            expect(2).to.equal(value)
            bAgent2.off()
            expect(1).to.equal((eb as any).listeners['b'].length)
            eb.off('b', b1Listener)
            expect(undefined).to.equal((eb as any).listeners['b'])


        })
        it('check c', () => {
            expect('object').to.equal(typeof (eb as any).listeners['c'])
            eb.dispatch('c', 'aaa', 10)
            expect('object').to.equal(typeof value)
            expect('aaa').to.equal(value.p)
            expect(10).to.equal(value.pp)
        })
        it('check e', () => {
            value = 0
            eb.dispatch('e')
            expect(1).to.equal(value)
            eb.dispatch('e')
            expect(1).to.equal(value)
        })
    }
)