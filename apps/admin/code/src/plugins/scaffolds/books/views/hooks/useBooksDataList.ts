import { useCallback, useReducer } from "react";
import { useRouter } from "@webiny/react-router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { useConfirmationDialog } from "@webiny/app-admin/hooks/useConfirmationDialog";
import { PaginationProp } from "@webiny/ui/List/DataList/types";
import { LIST_BOOKS, DELETE_BOOK } from "./graphql";

/**
 * Contains essential data listing functionality - data querying and UI control.
 */

interface useBooksDataListHook {
    (): {
        books: Array<{
            id: string;
            title: string;
            description: string;
            createdOn: string;
            [key: string]: any;
        }>;
        loading: boolean;
        pagination: PaginationProp;
        refresh: () => void;
        setSort: (sort: string) => void;
        newBook: () => void;
        editBook: (id: string) => void;
        deleteBook: (id: string) => void;
        currentBookId: string;
    };
}

const reducer = (prev, next) => ({ ...prev, ...next });

export const useBooksDataList: useBooksDataListHook = () => {
    // Base state and UI React hooks.
    const { history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const { showConfirmation } = useConfirmationDialog();
    const [variables, setVariables] = useReducer(reducer, {
        limit: undefined,
        after: undefined,
        before: undefined,
        sort: undefined
    });

    const searchParams = new URLSearchParams(location.search);
    const currentBookId = searchParams.get("id");

    // Queries and mutations.
    const listQuery = useQuery(LIST_BOOKS, {
        variables,
        onError: e => showSnackbar(e.message)
    });

    const [deleteIt, deleteMutation] = useMutation(DELETE_BOOK, {
        refetchQueries: [{ query: LIST_BOOKS }]
    });

    const { data: books = [], meta = {} } = listQuery.loading
        ? {}
        : listQuery?.data?.books?.listBooks || {};
    const loading = [listQuery, deleteMutation].some(item => item.loading);

    // Base CRUD actions - new, edit, and delete.
    const newBook = useCallback(() => history.push("/books?new"), []);
    const editBook = useCallback(id => {
        history.push(`/books?id=${id}`);
    }, []);

    const deleteBook = useCallback(
        item => {
            showConfirmation(async () => {
                try {
                    await deleteIt({
                        variables: item
                    });

                    showSnackbar(`Book "${item.title}" deleted.`);
                    if (currentBookId === item.id) {
                        history.push(`/books`);
                    }
                } catch (e) {
                    showSnackbar(e.message);
                }
            });
        },
        [currentBookId]
    );

    // Sorting.
    const setSort = useCallback(
        value => setVariables({ after: undefined, before: undefined, sort: value }),
        []
    );

    // Pagination metadata and controls.
    const setPreviousPage = useCallback(
        () => setVariables({ after: undefined, before: meta.before }),
        undefined
    );
    const setNextPage = useCallback(
        () => setVariables({ after: meta.after, before: undefined }),
        undefined
    );
    const setLimit = useCallback(
        value => setVariables({ after: undefined, before: undefined, limit: value }),
        []
    );

    const pagination: PaginationProp = {
        setPerPage: setLimit,
        perPageOptions: [10, 25, 50],
        setPreviousPage,
        setNextPage,
        hasPreviousPage: meta.before,
        hasNextPage: meta.after
    };

    return {
        books,
        loading,
        refresh: listQuery.refetch,
        pagination,
        setSort,
        newBook,
        editBook,
        deleteBook,
        currentBookId
    };
};
