var db = require("../database"),
view = require("../view"),
conn = db.connection;

db.search = function (req, res, next) {
    var query = req.body.query,
    position = req.body.position,
    wholeSite = req.body.whole_site,
    sort = req.body.sort;
    
    if (position !== "title" && position !== "content") {
        position = "title";
    }
    if (sort !== "most_read" && sort !== "least_read" &&
        sort !== "latest" && sort !== "oldest") {
        sort = "latest";
    }
    
    req.data = {
        query: query,
        position: position,
        wholeSite: wholeSite === "on",
        sort: sort
    };
    
    query = "%" + query.replace(/\\/g, "\\\\").replace(/%/g, "\\%") + "%";
    
    var where = [position + " like ?"],
        params = [query];
    if (wholeSite === "off") {
        where.push("uid=?");
        params.push(req.query.uid);
    }
    
    if (/\S/.test(query)) {
        db.getBlogs({
            allUser: 1,
            hasContent: 1,
            itemsPerPage: 10,
            where: where,
            params: params
        })(req, res, next);
    } else {
        req.blogs = [];
        next();
    }
};