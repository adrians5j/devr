import React from "react";
import { DeleteIcon } from "@webiny/ui/List/DataList/icons";
import { ButtonIcon, ButtonSecondary } from "@webiny/ui/Button";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import {
    DataList,
    ScrollList,
    ListItem,
    ListItemText,
    ListItemMeta,
    ListActions
} from "@webiny/ui/List";
import { useBooksDataList } from "./hooks/useBooksDataList";

/**
 * Renders a list of all Book entries. Includes basic deletion, pagination, and sorting capabilities.
 * The data querying functionality is located in the `useBooksDataList` React hook.
 */

// By default, we are able to sort entries by time of creation (ascending and descending).
// More sorters can be added, but not that further adjustments will be needed on the GraphQL API side.
const sorters = [
    {
        label: "Newest to oldest",
        value: "createdOn_DESC"
    },
    {
        label: "Oldest to newest",
        value: "createdOn_ASC"
    }
];

const BooksDataList = () => {
    const {
        books,
        loading,
        refresh,
        pagination,
        setSort,
        newBook,
        editBook,
        deleteBook,
        currentBookId
    } = useBooksDataList();

    return (
        <DataList
            title={"Books"}
            data={books}
            loading={loading}
            refresh={refresh}
            pagination={pagination}
            sorters={sorters}
            setSorters={setSort}
            actions={
                <ButtonSecondary onClick={newBook}>
                    <ButtonIcon icon={<AddIcon />} />
                    New Book
                </ButtonSecondary>
            }
        >
            {({ data }) => (
                <ScrollList>
                    {data.map(item => (
                        <ListItem key={item.id} selected={item.id === currentBookId}>
                            <ListItemText onClick={() => editBook(item.id)}>
                                {item.title}
                            </ListItemText>

                            <ListItemMeta>
                                <ListActions>
                                    <DeleteIcon onClick={() => deleteBook(item)} />
                                </ListActions>
                            </ListItemMeta>
                        </ListItem>
                    ))}
                </ScrollList>
            )}
        </DataList>
    );
};

export default BooksDataList;
