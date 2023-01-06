import React, { useState } from 'react';

const GithubOAuth = () => {
	const URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user`;
	return <button onClick={() => window.open(URL, '_self')}>Github</button>;
};

export default GithubOAuth;
