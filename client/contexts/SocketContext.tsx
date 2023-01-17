import { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';

type TSocketContext = {
	socket: Socket | null;
	isConnected: boolean;
	disconnect: () => void;
	connect: () => void;
};

const SocketContext = createContext<TSocketContext>({
	socket: null,
	isConnected: false,
	disconnect: () => {},
	connect: () => {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	useEffect(() => {
		const socketInit = () => {
			const socketTemp = io();
			setSocket(socketTemp);
			setIsConnected(true);
		};
		socketInit();
	}, []);
	useEffect(() => {
		if (socket) {
			socket.on('connect', () => {
				console.log('connected');
				toast.success('Socket connected');
			});
			socket.on('disconnect', () => {
				console.log('disconnected');
				toast.success('Socket disconnected');
			});
		}
		return () => {
			socket?.off('connect');
			socket?.off('disconnect');
		};
	}, [socket]);
	const disconnect = () => {
		socket?.disconnect();
		setIsConnected(false);
	};
	const connect = () => {
		socket?.connect();
		setIsConnected(true);
	};
	return (
		<SocketContext.Provider
			value={{ socket, isConnected, disconnect, connect }}
		>
			{children}
		</SocketContext.Provider>
	);
}

export default SocketContext;
