import { useQuery, useMutation } from '@apollo/client';

import { ME } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';

export const useCurrentUser = () => {
    const { loading, data } = useQuery(ME)
    const currentUser = data;
    console.log(currentUser);
    return currentUser;
};

export const useSaveBook = () => {
    const [ saveBook, { error } ] = useMutation(SAVE_BOOK);
    console.log(saveBook);
    if (error) {
        console.error(error);
    }
    return saveBook;
}

