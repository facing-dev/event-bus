export interface Events {
    [index: string]: [...any[]]
}

type NamesOf<Es extends Events> = keyof Es

type ListenerOf<Es extends Events, Name extends NamesOf<Es>> = { (...args: Es[Name]): void }

class ListenerAgent<Es extends Events, Name extends NamesOf<Es>> {
    constructor(private options: {
        name: Name
        listener: ListenerOf<Es, Name>
        eventBus: EventBus<Es>
        once: boolean
    }) {

    }
    is(listener: Function) {
        return this.options.listener === listener
    }
    call(...args: Parameters<ListenerOf<Es, Name>>) {
        if (this.options.once === true) {
            this.off()
        }
        this.options.listener.apply({}, args)
    }
    off() {
        const options = this.options
        options.eventBus.off(options.name, options.listener)
    }
}

export class EventBus<Es extends Events> {
    private listeners: { [index in NamesOf<Es>]?: ListenerAgent<Es, index>[] } = {}
    on<Name extends NamesOf<Es>>(name: Name, listener: ListenerOf<Es, Name>, once?: boolean) {
        const arr = this.listeners[name] ??= []
        const agent = new ListenerAgent({
            eventBus: this,
            listener: listener,
            name: name,
            once: !!once
        })
        arr.push(agent)
        return agent
    }
    onOnce<Name extends NamesOf<Es>>(name: Name, listener: ListenerOf<Es, Name>) {
        return this.on(name, listener, true)
    }
    dispatch<Name extends NamesOf<Es>>(name: Name, ...args: Parameters<ListenerOf<Es, Name>>) {
        const arr = this.listeners[name] ??= []
        for (const listener of arr) {
            listener.call(...args)
        }
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
        const agents = this.listeners[nameOrAgent] ??= []
        let ind = agents.findIndex(agent => agent.is(listener))
        if (ind >= 0) {
            agents.splice(ind, 1);
        }
        if (agents.length === 0) {
            delete this.listeners[nameOrAgent]
        }
    }
}

export default EventBus
