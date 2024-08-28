export type Events = {
    [index in string]: any[]
}

type NamesOf<Es extends Events> = keyof Es

type ListenerOf<Es extends Events, Name extends NamesOf<Es>> = { (...args: Es[Name]): void | Promise<void> }

export class ListenerAgent<Es extends Events, Name extends NamesOf<Es>> {
    constructor(private options: {
        name: Name
        listener: ListenerOf<Es, Name>
        once: boolean
        off: Function
    }) {

    }
    is(listener: Function) {
        return this.options.listener === listener
    }
    call(...args: Parameters<ListenerOf<Es, Name>>) {
        if (this.options.once === true) {
            this.off()
        }
        return this.options.listener.apply({}, args)
    }
    off() {
        this.options.off()
    }
}

export class EventBus<Es extends Events = {}> {
    #listeners: Map<NamesOf<Es>, Map<ListenerOf<Es, any>, ListenerAgent<Es, any>>> = new Map
    get listeners() {
        return this.#listeners
    }

    on<Name extends NamesOf<Es>>(name: Name, listener: ListenerOf<Es, Name>, once?: boolean): ListenerAgent<Es, Name> {
        const _listener = listener
        let map = this.#listeners.get(name)
        if (!map) {
            this.#listeners.set(name, map = new Map)
        }
        let agent = map.get(_listener)
        if (agent) {
            return agent
        }
        agent = new ListenerAgent({
            off: () => this.off(name, listener),
            listener: listener,
            name: name,
            once: !!once
        })
        map.set(_listener, agent)
        return agent
    }
    onOnce<Name extends NamesOf<Es>>(name: Name, listener: ListenerOf<Es, Name>) {
        return this.on(name, listener, true)
    }
    dispatch<Name extends NamesOf<Es>>(name: Name, ...args: Parameters<ListenerOf<Es, Name>>): void | Promise<void[]> {

        const map = this.#listeners.get(name)
        if (!map) {
            return
        }
        const arr = Array.from(map.values())
        let promises: Promise<void>[] | undefined = undefined
        for (const listener of arr) {
            const r = listener.call(...args)
            if (r instanceof Promise) {
                promises ??= []
                promises.push(r)
            }
        }
        if (!promises) {
            return
        }
        return Promise.all(promises)

    }
    off<Name extends NamesOf<Es>>(agent: ListenerAgent<Es, Name>): any
    off<Name extends NamesOf<Es>>(name: Name, listener: ListenerOf<Es, Name>): any
    off<Name extends NamesOf<Es>>(nameOrAgent: Name | ListenerAgent<Es, Name>, listener?: ListenerOf<Es, Name>): any {
        if (nameOrAgent instanceof ListenerAgent) {
            nameOrAgent.off()
            return
        }
        if (!listener) {
            throw ''
        }
        const map = this.#listeners.get(nameOrAgent)
        if (!map) {
            return
        }
        map.delete(listener as ListenerOf<Es, NamesOf<Es>>)
        if (map.size === 0) {
            this.#listeners.delete(nameOrAgent)
        }
    }
}

export default EventBus
