class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery; // Mongoose query
        this.queryString = queryString; // req.query
    }

    filter() {
        // 1) Filtering 
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) Advanced Filtering (Numeric parsing, Regex search)
        let mongoQuery = {};

        for (const key in queryObj) {
            // Multi-value filtering
            if (typeof queryObj[key] === 'string' && queryObj[key].includes(',')) {
                mongoQuery[key] = { $in: queryObj[key].split(',') };
                continue;
            }

            const value = isNaN(queryObj[key]) ? queryObj[key] : Number(queryObj[key]);
            const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

            if (match) {
                const [, field, operator] = match;
                if (!mongoQuery[field]) mongoQuery[field] = {};
                mongoQuery[field][`$${operator}`] = value;
            } else {
                if (typeof value === 'string') {
                    mongoQuery[key] = { $regex: value, $options: 'i' };
                } else {
                    mongoQuery[key] = value;
                }
            }
        }
        this.mongooseQuery = this.mongooseQuery.find(mongoQuery);

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }

        return this;
    }

    search() {
        if (this.queryString.keyword) {
            const keywordQuery = {
                $or: [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ]
            };

            this.mongooseQuery = this.mongooseQuery.find(keywordQuery);
        }
        return this;
    }

    paginate(totalDocs) {
        const page = Math.max(1, parseInt(this.queryString.page) || 1);
        const limit = Math.max(1, parseInt(this.queryString.limit) || 5);
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalDocs / limit);

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = {
            totalPages,
            currentPage: page,
            limit,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        };
        return this;
    }

    populate(path, select) {
        this.mongooseQuery = this.mongooseQuery.populate(path, select);
        return this;
    }
}

module.exports = ApiFeatures;