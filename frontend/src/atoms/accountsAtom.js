import { atom } from 'recoil';

const accountsAtom = atom({
    key: 'accountsAtom',
    default: [],
});

export default accountsAtom;