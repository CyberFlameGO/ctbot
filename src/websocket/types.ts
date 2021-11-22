type EventType = 'module_created' | 'module_deleted' | 'release_created';

interface EventBase {
    type: EventType;
}

interface ModuleCreatedEvent extends EventBase {
    type: 'module_created';
    module: Module;
}

interface ModuleDeletedEvent extends EventBase {
    type: 'module_deleted';
    module: Module;
}

interface ReleaseCreatedEvent extends EventBase {
    type: 'release_created';
    module: Module;
    releases: Release[];
    release: Release;
}

export type Event = ModuleCreatedEvent | ModuleDeletedEvent | ReleaseCreatedEvent;

interface Module {
    id: number;
    owner: Owner;
    name: string;
    description: string;
    image: string;
    downloads: number;
    tags: string[];
    releases: Release[];
}

interface Owner {
    id: number;
    name: string;
    rank: string;
}

interface Release {
    module: Module;
    id: string;
    releaseVersion: string;
    modVersion: string;
    changelog: string;
    downloads: number;
}
