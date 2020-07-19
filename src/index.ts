import * as http from 'http';
import { listenerFactory } from './request-listener';
import * as fs from 'fs';
import { FileEvent } from './types/file-event.type';
import { LiveReload } from './live-reload/live-reload';
import { Protocols } from './types/protocol.enum';
import { address } from './utils/address';
import { open } from './utils/open';

interface LivelyOptions {
	port: number;
	host: string;
	root: string;
	source: string;
	symbol: string;
	verbose: boolean;
}

export class Lively {
	
	options: LivelyOptions = {
		port: 3000,
		host: 'localhost',
		root: '',
		source: '',
		symbol: '♨',
		verbose: false
	}
	address: string;
	server: http.Server;
	liveReload: LiveReload;
	
	constructor(options?: Partial<LivelyOptions>) {

		if (options) {
			Object.assign(this.options, options);
			if (options.source === undefined) {
				this.options.source = this.options.root;
			}
		}
		
		const requestListener = listenerFactory(this.options.root, this.options.host, this.options.port);
		this.server = http.createServer(requestListener);
		this.liveReload = new LiveReload(this.server, this.options.host, this.options.port);
		this.address = address(Protocols.http, this.options.host, this.options.port);
	}

	start(): void {
		this.server.listen(this.options.port, this.options.host, () => {
			console.log(`${this.options.symbol} ${this.address}`);
			open(this.address);
		});
	}

	watch(location: fs.PathLike, callback?: (event: FileEvent, filename: string, path: fs.PathLike) => void): void {
		
		const createWatch = (loc: string): void => {
			console.log(loc);
			fs.watch(`${this.options.source}/${loc}`, (event, filename) => {
				if (this.options.verbose) {
					console.log(`☼ ${this.options.source}/${loc}`);
				}
				if (callback) {
					callback(event as FileEvent, filename, `${this.options.source}/${filename}`);
				}
				this.liveReload.reload();
			});
		}
		
		const wildcards = location.toString().split('*');
		if (wildcards.length > 1) {
			fs.readdirSync(`${this.options.source}/${wildcards[0]}`)
				.filter(fn => fn.endsWith(wildcards[1]))
				.forEach(f => createWatch(`${wildcards[0]}${f}`));
		} else {
			createWatch(location.toString());
		}
	}
}