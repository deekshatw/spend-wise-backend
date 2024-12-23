// src/types/node.d.ts

declare module NodeJS {
    interface Module {
        hot?: {
            accept: (path?: string, callback?: () => void) => void;
            dispose: (callback: () => void) => void;
            // Add any other hot module reload properties you may use
        };
    }
}
