import Friendship from '../models/Friendship';

export default async function getFriendRequests(userId: string) {
	try {
		const friends = await Friendship.find({
			_friendId: userId,
			status: 'pending',
		});
    return friends;
	} catch (err) {
		throw new Error(err as any);
	}
}
