class APIfeatures  {
    constructor(query, queryString) // queryString is req.query Object
    {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      //1A FILTERING
      let queryObj = {...this.queryString}; 
      const excludedFields = ['sort', 'limit', 'page', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      //1B ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}`)
      // console.log(JSON.parse(queryStr))
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    sort(){
      const queryObj = {...this.queryString}
      if (queryObj.sort)
        {
          const sortBy = queryObj.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        }
        else {
          this.query = this.query.sort('-createdAt'); // Default sort by newest first
        }
        return this;
    }
    select(){
      const queryObj = {...this.queryString};
      if (queryObj.fields)
        {
          const fields = queryObj.fields.split(',').join(' ');
          this.query = this.query.select(fields);
        }
        else {
          this.query = this.query.select('-__v'); // Default exclude '__v'
        }
        return this;
    }
    pagination() {
      const queryObj = {...this.queryString};
      const limit = queryObj.limit*1 || 10;
      const page = queryObj.page*1 || 1;
      const skip = (page - 1) * limit; 
      const numTours = this.query.countDocuments(); 
      if(queryObj.page)
      {
        if(skip >= numTours)
        {
          throw new Error('This page does not exist');
        }
      }
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

module.exports = APIfeatures;