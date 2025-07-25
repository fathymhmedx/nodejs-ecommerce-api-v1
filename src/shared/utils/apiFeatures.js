exports.getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 5);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}