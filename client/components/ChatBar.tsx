import React, { useContext, useEffect, useRef, useState } from 'react';
import SocketContext from '../contexts/SocketContext';
import asyncEmit from '../helpers/asyncEmit';

const ChatBar = () => {
	const [isDisabled, setIsDisabled] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [text, setText] = useState('');
	const { socket } = useContext(SocketContext);
	const textbar = useRef<null | HTMLInputElement>(null);
	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsDisabled(true);
		if (text.length === 0) return;
		console.log(text);
		try {
			const res = await asyncEmit(socket!, 'chat', text);
			console.log(res);
		} catch (err) {
			console.log(err);
		}
		setText('');
		setIsDisabled(false);
		console.log(textbar.current);
	};
	useEffect(() => {
		if (text.length > 0) {
			if (!isTyping) setIsTyping(true);
		} else {
			if (isTyping) setIsTyping(false);
		}
	}, [isTyping, text]);
	useEffect(() => {
		if (!isDisabled) {
			textbar?.current?.focus();
		}
	}, [isDisabled]);
	useEffect(() => {
		textbar?.current?.focus();
	}, []);
	return (
		<form className="form-control w-full" onSubmit={submitHandler}>
			<fieldset
				disabled={isDisabled}
				className="form-control w-full flex flex-row items-center justify-center"
			>
				<input
					type="text"
					placeholder="Type something fun here..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="input w-full"
					ref={textbar}
					autoFocus
				/>
				<button
					type="submit"
					className="btn btn-outline disabled:btn-disabled btn-md bg-base-300 ml-8"
				>
					Send
				</button>
			</fieldset>
		</form>
	);
};

export default ChatBar;
