let paginate = (page, limit, paginate) => {
    let currentPage = page - 1 <= 1 ? 1 : page - 1;
    if (paginate - page * limit == 0) {
        currentPage = page - 3;
    } else if (paginate - page * limit <= limit) {
        currentPage = page - 2;
    }
    let pages = [currentPage];
    while (pages[pages.length - 1] * 4 <= paginate) {
        pages.push(++currentPage);
        if (pages.length == limit) break;
    }
    return pages;
};

module.exports = paginate;
