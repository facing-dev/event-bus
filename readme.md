# Read me

## Install

`npm install --save @facing/event-bus`

## Usage

```typescript
import EventBus from '@facing/event-bus'

const EB = new EventBus<{
    MyEvent: [string],
}>

//Listen
{
    EB.on('MyEvent', function (arg: string) { })
}

//Listen once
{
    EB.onOnce('MyEvent', function (arg: string) { })
}

//Delete listener
{
    function listener(arg: string) { }
    EB.on('MyEvent', listener)
    EB.off('MyEvent', listener)
}

//Delete listener by ListenerAgent
{
    const ListenerAgent = EB.on('MyEvent', function (arg: string) { })
    ListenerAgent.off()
}

//If ListenerAgent is an agent of a listener
{
    function listener(arg: string) { }
    const ListenerAgent = EB.on('MyEvent', listener)
    ListenerAgent.is(listener) //false
}

//Dispatch event
{
    EB.dispatch('MyEvent', 'value')
}
```