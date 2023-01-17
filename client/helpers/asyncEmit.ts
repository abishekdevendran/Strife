import { Socket } from 'socket.io-client';

export default async function asyncEmit(
	socket: Socket,
	event: string,
	data: any
) {
	return new Promise((resolve, reject) => {
		socket.timeout(5000).emit(event, data, (err: any, res: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}
