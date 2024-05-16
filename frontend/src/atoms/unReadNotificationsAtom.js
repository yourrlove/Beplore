import { atom } from 'recoil';

const unReadNotificationsAtom = atom({
    key: 'unReadNotificationsAtom',
    default: [],
});

export default unReadNotificationsAtom;