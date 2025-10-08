const qs = require('qs');
class ApiFeatures {
    constructor(mongooseQuery, queryStr) {
        this.mongooseQuery = mongooseQuery;
        // this.queryStrRaw = queryStr;
        this.queryObj = qs.parse(queryStr); // Parse once
    }
    filter() {
        // 1️⃣ Filtering
        const queryStringObj = { ...this.queryObj };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludeFields.forEach((el) => delete queryStringObj[el]);
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        // 2️⃣ Sorting
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        // 3️⃣ Fields Limiting
        if (this.queryObj.fields) {
            const fields = this.queryObj.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }
    search(modelName) {
        if (this.queryObj.keyword) {
            const keyword = this.queryObj.keyword.trim();
            let query = {};
            if (modelName === 'Product') {
                 query = {
                    $or: [
                        { title: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } }
                    ]
                };
            }else{
                 query = { name: { $regex: keyword, $options: 'i' } };
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    paginate(countDocuments) {
        // 5️⃣ Pagination
        const page = this.queryObj.page * 1 || 1;
        const limit = this.queryObj.limit * 1 || 10;
        const skip = (page - 1) * limit;

        //pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        if (skip > 0) {
            pagination.prev = page - 1;
        }
        if (skip + limit < countDocuments) {
            pagination.next = page + 1;
        }


        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;

        return this;
    }
}
module.exports = ApiFeatures;