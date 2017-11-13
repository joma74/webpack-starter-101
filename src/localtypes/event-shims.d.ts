interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}