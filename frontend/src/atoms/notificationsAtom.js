import { atom } from 'recoil';

const notificationsAtom = atom({
    key: 'notificationsAtom',
    default: [],
});

export default notificationsAtom;