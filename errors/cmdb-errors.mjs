export default {
    INVALID_PARAMETER: argName => {
        return {
            code: 1,
            message: `Invalid argument ${argName}`
        }
    },
    USER_NOT_FOUND: () => {
        return {
            code: 2,
            message: `User not found`
        }
    },
    GROUP_NOT_FOUND: (groupId) => {
        return {
            code: 3,
            message: `Group with id ${groupId} not found`
        }
    },
    MOVIE_NOT_FOUND: (type, movie) => {
        return {
            code: 4,
            message: `No movies found for the ${type} ${movie}`
        }
    }

}