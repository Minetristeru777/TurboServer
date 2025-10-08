(function(Scratch) {
  'use strict';

  class TurboServerExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.ws = null;
      this.lastMessage = '';
      this.connected = false;
    }

    getInfo() {
      return {
        id: 'turboserver',
        name: 'TurboServer',
        color1: '#4B8BFF',
        color2: '#3366CC',
        color3: '#224499',
        blocks: [
          {
            opcode: 'connect',
            blockType: Scratch.BlockType.COMMAND,
            text: 'connect to server [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ws://localhost:8765'
              }
            }
          },
          {
            opcode: 'sendMessage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello server!'
              }
            }
          },
          {
            opcode: 'getLastMessage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last message'
          },
          {
            opcode: 'isConnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected?'
          }
        ]
      };
    }

    connect({ URL }) {
      if (this.ws) this.ws.close();

      this.ws = new WebSocket(URL);

      this.ws.onopen = () => {
        console.log('Connected to TurboServer!');
        this.connected = true;
      };

      this.ws.onmessage = (event) => {
        this.lastMessage = event.data;
        console.log('Received:', event.data);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from server.');
        this.connected = false;
      };

      this.ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        this.connected = false;
      };
    }

    sendMessage({ TEXT }) {
      if (this.ws && this.connected) {
        this.ws.send(JSON.stringify({ text: TEXT }));
      }
    }

    getLastMessage() {
      return this.lastMessage || '';
    }

    isConnected() {
      return this.connected;
    }
  }

  Scratch.extensions.register(new TurboServerExtension());
})(Scratch);
