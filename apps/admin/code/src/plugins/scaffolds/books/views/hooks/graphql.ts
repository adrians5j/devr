import gql from "graphql-tag";

// The same set of fields is being used on all query and mutation operations below.
export const BOOK_FIELDS_FRAGMENT = /* GraphQL */ `
    fragment BookFields on Book {
        id
        title
        description
        createdOn
        savedOn
        createdBy {
            id
            displayName
            type
        }
    }
`;

export const LIST_BOOKS = gql`
    ${BOOK_FIELDS_FRAGMENT}
    query ListBooks($sort: BooksListSort, $limit: Int, $after: String, $before: String) {
        books {
            listBooks(sort: $sort, limit: $limit, after: $after, before: $before) {
                data {
                    ...BookFields
                }
                meta {
                    before
                    after
                    limit
                }
            }
        }
    }
`;

export const CREATE_BOOK = gql`
    ${BOOK_FIELDS_FRAGMENT}
    mutation CreateBook($data: BookCreateInput!) {
        books {
            createBook(data: $data) {
                ...BookFields
            }
        }
    }
`;

export const GET_BOOK = gql`
    ${BOOK_FIELDS_FRAGMENT}
    query GetBook($id: ID!) {
        books {
            getBook(id: $id) {
                ...BookFields
            }
        }
    }
`;

export const DELETE_BOOK = gql`
    ${BOOK_FIELDS_FRAGMENT}
    mutation DeleteBook($id: ID!) {
        books {
            deleteBook(id: $id) {
                ...BookFields
            }
        }
    }
`;

export const UPDATE_BOOK = gql`
    ${BOOK_FIELDS_FRAGMENT}
    mutation UpdateBook($id: ID!, $data: BookUpdateInput!) {
        books {
            updateBook(id: $id, data: $data) {
                ...BookFields
            }
        }
    }
`;
